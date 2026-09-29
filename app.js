/* Mensch ärgere Dich nicht – Online
   Multiplayer: PeerJS/WebRTC, host-authoritative game state.
   No account or server installation is required for the static version.
*/
(() => {
  "use strict";

  const COLORS = [
    {key:"red", name:"Rot"},
    {key:"yellow", name:"Gelb"},
    {key:"green", name:"Grün"},
    {key:"blue", name:"Blau"},
    {key:"orange", name:"Orange"},
    {key:"purple", name:"Lila"}
  ];
  const MAX_PLAYERS = 6;
  const PAWNS = 4;
  const TRACK_LEN = 40;
  const FINISH_LEN = 4;
  const DICE = ["⚀","⚁","⚂","⚃","⚄","⚅"];

  // A 40-square classic loop around the board.
  const TRACK = [];
  for (let c=0;c<11;c++) TRACK.push([0,c]);
  for (let r=1;r<11;r++) TRACK.push([r,10]);
  for (let c=9;c>=0;c--) TRACK.push([10,c]);
  for (let r=9;r>0;r--) TRACK.push([r,0]);

  // Different starts keep six players evenly distributed.
  const STARTS = [0,7,14,20,27,34];

  const $ = id => document.getElementById(id);
  const els = {
    lobbyPanel:$("lobbyPanel"), gamePanel:$("gamePanel"), status:$("connectionStatus"),
    create:$("createRoomBtn"), join:$("joinRoomBtn"), codeInput:$("roomCodeInput"),
    roomBox:$("hostRoomBox"), hostCode:$("hostRoomCode"), copy:$("copyRoomBtn"),
    roomLabel:$("roomCodeLabel"), players:$("playersList"), turn:$("turnPlayer"),
    dice:$("diceFace"), roll:$("rollBtn"), hint:$("actionHint"), hostControls:$("hostControls"),
    start:$("startBtn"), reset:$("resetBtn"), log:$("gameLog"), board:$("board"),
    winner:$("winnerOverlay"), winnerText:$("winnerText"), closeWinner:$("closeWinnerBtn")
  };

  let peer = null, hostConn = null, connections = [];
  let isHost = false, myId = null, myPlayerId = null, roomCode = "";
  let state = null, localPendingRoll = null;

  function randomCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let s="";
    for(let i=0;i<6;i++) s += chars[Math.floor(Math.random()*chars.length)];
    return s;
  }
  function setStatus(text, good=false) {
    els.status.textContent=text;
    els.status.style.borderColor=good ? "#77b77f" : "#d8b978";
  }
  function showGame() {
    els.lobbyPanel.classList.add("hidden");
    els.gamePanel.classList.remove("hidden");
  }
  function log(msg) {
    const row=document.createElement("div");
    row.textContent=msg;
    els.log.prepend(row);
    while(els.log.children.length>40) els.log.removeChild(els.log.lastChild);
  }
  function newState() {
    return {
      started:false, finished:false, winner:null, turn:0, dice:null, awaitingMove:false,
      players:[], logs:[]
    };
  }

  function playerById(id){ return state?.players.find(p=>p.id===id); }
  function currentPlayer(){ return state?.players[state.turn]; }

  function makePeer(id) {
    return new Peer(id, { debug: 0 });
  }

  function hostGame() {
    if (peer) peer.destroy();
    isHost=true; roomCode=randomCode(); myId="HOST";
    peer=makePeer("maedn-"+roomCode);
    peer.on("open", () => {
      setStatus("Raum bereit", true);
      els.roomBox.classList.remove("hidden");
      els.hostCode.textContent=roomCode;
      showGame();
      els.roomLabel.textContent=roomCode;
      myPlayerId="p-"+Math.random().toString(36).slice(2,9);
      state=newState();
      addPlayer(myPlayerId,"Du");
      render();
      log("Raum erstellt. Teile den Code mit deinen Freunden.");
    });
    peer.on("connection", conn => {
      conn.on("open", () => {
        if (state.players.length >= MAX_PLAYERS) {
          conn.send({type:"error",message:"Der Raum ist bereits voll."});
          conn.close(); return;
        }
        connections.push(conn);
        conn.on("data", data => handleHostMessage(conn,data));
        conn.on("close", () => {
          connections=connections.filter(c=>c!==conn);
          const p=state.players.find(x=>x.connId===conn.peer);
          if(p){ p.connected=false; broadcastState(); render(); log(`${p.name} ist nicht mehr verbunden.`); }
        });
        conn.on("error", ()=>{});
        conn.send({type:"welcome",room:roomCode});
      });
    });
    peer.on("error", err => {
      console.error(err);
      setStatus("Verbindungsfehler");
      alert("Der Raum konnte nicht erstellt werden. Bitte versuche es erneut.");
    });
  }

  function addPlayer(id,name,connId=null) {
    if(state.players.length>=MAX_PLAYERS) return null;
    const color=COLORS[state.players.length];
    const p={id,name:name||"Spieler",color:color.key,connected:true,connId,
      pawns:Array(PAWNS).fill(-1)};
    state.players.push(p);
    return p;
  }

  function joinGame() {
    const code=els.codeInput.value.trim().toUpperCase();
    if(!/^[A-Z0-9]{6}$/.test(code)){ alert("Bitte einen 6-stelligen Raumcode eingeben."); return; }
    if(peer) peer.destroy();
    isHost=false; roomCode=code; myPlayerId="p-"+Math.random().toString(36).slice(2,9);
    peer=makePeer();
    peer.on("open", id => {
      myId=id;
      hostConn=peer.connect("maedn-"+code,{reliable:true});
      hostConn.on("open",()=>{
        setStatus("Verbunden",true);
        hostConn.send({type:"join",id:myPlayerId,name:"Spieler"});
      });
      hostConn.on("data",data=>handleGuestMessage(data));
      hostConn.on("close",()=>{setStatus("Verbindung verloren"); alert("Die Verbindung zum Spielleiter wurde getrennt.");});
      hostConn.on("error",()=>setStatus("Verbindungsfehler"));
    });
    peer.on("error", err => {
      console.error(err);
      setStatus("Nicht verbunden");
      alert("Raum nicht gefunden oder Verbindung nicht möglich. Prüfe den Code.");
    });
  }

  function handleHostMessage(conn,data) {
    if(!data || typeof data.type!=="string") return;
    if(data.type==="join"){
      if(state.started){ conn.send({type:"error",message:"Das Spiel läuft bereits."}); return; }
      if(state.players.length>=MAX_PLAYERS){ conn.send({type:"error",message:"Der Raum ist voll."}); return; }
      const name=(String(data.name||"Spieler").trim().slice(0,18))||"Spieler";
      const p=addPlayer(data.id,name,conn.peer);
      if(!p) return;
      conn.send({type:"assigned",id:p.id});
      broadcastState(); render(); log(`${name} ist beigetreten.`);
    } else if(data.type==="roll"){
      if(validTurn(data.playerId)) hostRoll(data.playerId);
    } else if(data.type==="move"){
      if(validTurn(data.playerId) && state.awaitingMove) hostMove(data.playerId, data.pawnIndex);
    } else if(data.type==="start"){
      if(!state.started && state.players.length>=2){
        state.started=true; state.turn=0; state.dice=null; state.awaitingMove=false;
        addLogState("Das Spiel beginnt!");
        broadcastState(); render();
      }
    } else if(data.type==="reset"){
      state=newState();
      state.players = state.players.map(p=>({...p,pawns:Array(PAWNS).fill(-1),connected:true}));
      addLogState("Das Spiel wurde zurückgesetzt.");
      broadcastState(); render();
    }
  }

  function handleGuestMessage(data) {
    if(data.type==="welcome"){ roomCode=data.room; els.roomLabel.textContent=roomCode; }
    if(data.type==="assigned"){ myPlayerId=data.id; }
    if(data.type==="state"){
      state=data.state; showGame(); render();
    }
    if(data.type==="error"){ alert(data.message); }
  }

  function validTurn(playerId) {
    return state && state.started && !state.finished && currentPlayer()?.id===playerId;
  }

  function addLogState(msg){ state.logs=(state.logs||[]).slice(-39); state.logs.push(msg); }

  function broadcastState() {
    if(!isHost) return;
    const safe=JSON.parse(JSON.stringify(state));
    connections.forEach(c=>{try{c.send({type:"state",state:safe})}catch(e){}});
  }

  function hostRoll(playerId) {
    if(state.dice!==null || state.awaitingMove) return;
    const value=1+Math.floor(Math.random()*6);
    state.dice=value;
    const p=playerById(playerId);
    addLogState(`${p.name} würfelt eine ${value}.`);
    const moves=legalMoves(p,value);
    if(moves.length===0){
      state.awaitingMove=false;
      if(value!==6) advanceTurn();
      else { state.dice=null; addLogState(`${p.name} darf noch einmal würfeln.`); }
    } else {
      state.awaitingMove=true;
    }
    broadcastState(); render();
  }

  function legalMoves(player,dice) {
    const out=[];
    player.pawns.forEach((pos,i)=>{
      if(canMovePawn(player,i,dice)) out.push(i);
    });
    return out;
  }

  // Position: -1 home; 0..39 track; 40..43 finish lane.
  function canMovePawn(player,index,dice) {
    const pos=player.pawns[index];
    if(pos===-1) return dice===6;
    if(pos>=40) return pos+dice<=43;
    const steps=(pos-startIndex(player)+TRACK_LEN)%TRACK_LEN;
    return steps+dice < TRACK_LEN+FINISH_LEN;
  }

  function startIndex(player){ return STARTS[state.players.indexOf(player)] ?? 0; }
  function absoluteTrack(player,pos) {
    if(pos<0 || pos>=TRACK_LEN) return null;
    return (startIndex(player)+pos)%TRACK_LEN;
  }

  function hostMove(playerId,index) {
    const p=playerById(playerId);
    const dice=state.dice;
    if(!p || !Number.isInteger(index) || index<0 || index>=PAWNS || dice===null) return;
    if(!canMovePawn(p,index,dice)) return;

    const old=p.pawns[index];
    if(old===-1) p.pawns[index]=0;
    else p.pawns[index] += dice;

    const landedAbs=absoluteTrack(p,p.pawns[index]);
    if(landedAbs!==null){
      state.players.forEach(other=>{
        if(other.id===p.id) return;
        other.pawns=other.pawns.map(pos=>{
          return absoluteTrack(other,pos)===landedAbs ? -1 : pos;
        });
      });
    }
    addLogState(`${p.name} zieht eine Figur.`);
    state.dice=null; state.awaitingMove=false;

    if(p.pawns.every(x=>x>=40)){
      state.finished=true; state.winner=p.id;
      addLogState(`🎉 ${p.name} hat gewonnen!`);
    } else if(dice!==6) {
      advanceTurn();
    } else {
      addLogState(`${p.name} darf noch einmal würfeln.`);
    }
    broadcastState(); render();
  }

  function advanceTurn() {
    if(!state.players.length) return;
    state.turn=(state.turn+1)%state.players.length;
    state.dice=null; state.awaitingMove=false;
  }

  function guestRoll(){ if(hostConn) hostConn.send({type:"roll",playerId:myPlayerId}); }
  function guestMove(i){ if(hostConn) hostConn.send({type:"move",playerId:myPlayerId,pawnIndex:i}); }

  function render() {
    if(!state) return;
    els.roomLabel.textContent=roomCode||"—";
    els.players.innerHTML="";
    state.players.forEach((p,i)=>{
      const row=document.createElement("div"); row.className="player-row"+(state.started&&i===state.turn?" current":"");
      const dot=document.createElement("span"); dot.className="dot"; dot.style.background=getComputedStyle(document.documentElement).getPropertyValue(`--${p.color}`);
      const name=document.createElement("span"); name.className="player-name"; name.textContent=p.name+(p.id===myPlayerId?" (Du)":"");
      const home=document.createElement("span"); home.className="home-count"; home.textContent=`${p.pawns.filter(x=>x===-1).length} im Haus`;
      row.append(dot,name,home); els.players.appendChild(row);
    });
    els.hostControls.classList.toggle("hidden",!isHost);
    els.start.disabled=!isHost || state.started || state.players.length<2;
    els.reset.disabled=!isHost;
    const cp=currentPlayer();
    els.turn.textContent=state.started&&cp ? cp.name : "Noch nicht gestartet";
    els.dice.textContent=state.dice?DICE[state.dice-1]:"⚀";
    const myTurn=state.started && cp?.id===myPlayerId && !state.finished;
    els.roll.disabled=!myTurn || state.dice!==null || state.awaitingMove;
    if(state.finished) els.hint.textContent="Das Spiel ist beendet.";
    else if(!state.started) els.hint.textContent=isHost ? (state.players.length<2?"Mindestens 2 Spieler nötig.":"Du kannst das Spiel starten.") : "Warte auf den Spielleiter.";
    else if(myTurn && state.awaitingMove) els.hint.textContent="Wähle eine leuchtende Figur.";
    else if(myTurn) els.hint.textContent="Du bist dran – würfeln!";
    else els.hint.textContent=`${cp?.name||"Spieler"} ist am Zug.`;
    els.log.innerHTML="";
    (state.logs||[]).slice().reverse().forEach(x=>{const d=document.createElement("div");d.textContent=x;els.log.appendChild(d)});
    renderBoard();
    if(state.finished && state.winner){
      const w=playerById(state.winner); els.winnerText.textContent=`${w?.name||"Spieler"} gewinnt!`;
      els.winner.classList.remove("hidden");
    } else els.winner.classList.add("hidden");
  }

  function renderBoard() {
    els.board.innerHTML="";
    // Track cells
    TRACK.forEach(([r,c],i)=>{
      const cell=document.createElement("div"); cell.className="cell track";
      if(i===STARTS[0]) cell.classList.add("start-red");
      if(i===STARTS[1]) cell.classList.add("start-yellow");
      if(i===STARTS[2]) cell.classList.add("start-green");
      if(i===STARTS[3]) cell.classList.add("start-blue");
      if(i===STARTS[4]) cell.classList.add("start-orange");
      if(i===STARTS[5]) cell.classList.add("start-purple");
      cell.style.gridRow=r+1;cell.style.gridColumn=c+1;
      const n=document.createElement("span");n.className="cell-number";n.textContent=i+1;cell.appendChild(n);
      addPawnsToCell(cell,i);
      els.board.appendChild(cell);
    });
    // Decorative center and colored home zones
    [["red",1,1],["yellow",1,11],["green",11,1],["blue",11,11]].forEach(()=>{});
    const zones=[
      ["red",1,1],["yellow",1,7],["green",7,1],["blue",7,7]
    ];
    zones.forEach(([color,row,col])=>{
      const z=document.createElement("div");z.className=`home-zone ${color}`;z.style.gridRow=`${row}/${row+5}`;z.style.gridColumn=`${col}/${col+5}`;
      for(let i=0;i<4;i++){const s=document.createElement("div");s.className="base-slot";s.dataset.base=`${color}-${i}`;z.appendChild(s)}
      els.board.appendChild(z);
    });
    const center=document.createElement("div");center.className="center";els.board.appendChild(center);
    // Orange/lila are represented as two inner decorative homes for 5/6-player games.
    if(state.players.some(p=>p.color==="orange")) addInnerHome("orange",2,5);
    if(state.players.some(p=>p.color==="purple")) addInnerHome("purple",8,5);
  }

  function addInnerHome(color,row,col){
    const z=document.createElement("div");z.className=`home-zone ${color}`;z.style.gridRow=`${row}/${row+3}`;z.style.gridColumn=`${col}/${col+3}`;z.style.padding="5px";
    for(let i=0;i<4;i++){const s=document.createElement("div");s.className="base-slot";z.appendChild(s)}
    els.board.appendChild(z);
  }

  function addPawnsToCell(cell,absIndex) {
    state.players.forEach(p=>{
      p.pawns.forEach((pos,idx)=>{
        if(absoluteTrack(p,pos)!==absIndex) return;
        const pawn=document.createElement("button"); pawn.className=`pawn ${p.color}`; pawn.title=`${p.name} – Figur ${idx+1}`;
        const myTurn=state.started && currentPlayer()?.id===myPlayerId && p.id===myPlayerId && state.awaitingMove && state.dice!==null;
        if(myTurn && canMovePawn(p,idx,state.dice)) { pawn.classList.add("selectable"); pawn.onclick=()=>isHost?hostMove(myPlayerId,idx):guestMove(idx); }
        cell.appendChild(pawn);
      });
    });
  }

  els.create.onclick=hostGame;
  els.join.onclick=joinGame;
  els.codeInput.addEventListener("keydown",e=>{if(e.key==="Enter") joinGame()});
  els.copy.onclick=async()=>{
    try{await navigator.clipboard.writeText(roomCode);els.copy.textContent="Kopiert!";setTimeout(()=>els.copy.textContent="Code kopieren",1200)}
    catch(e){alert(`Raumcode: ${roomCode}`)}
  };
  els.roll.onclick=()=>{ if(isHost) hostRoll(myPlayerId); else guestRoll(); };
  els.start.onclick=()=>{
    if(!isHost) return;
    if(state.players.length<2){alert("Mindestens 2 Spieler werden benötigt.");return}
    state.started=true;state.turn=0;state.dice=null;state.awaitingMove=false;addLogState("Das Spiel beginnt!");
    broadcastState();render();
  };
  els.reset.onclick=()=>{
    if(!isHost) return;
    if(!confirm("Spiel wirklich zurücksetzen?")) return;
    state.players.forEach(p=>p.pawns=Array(PAWNS).fill(-1));
    state.started=false;state.finished=false;state.winner=null;state.turn=0;state.dice=null;state.awaitingMove=false;
    addLogState("Das Spiel wurde zurückgesetzt.");broadcastState();render();
  };
  els.closeWinner.onclick=()=>els.winner.classList.add("hidden");

  setStatus("Nicht verbunden");
})();
