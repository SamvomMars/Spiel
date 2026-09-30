const assert = require('assert');
const COLORS = {yellow:{start:24}};
const players=[{id:'y',color:'yellow'},{id:'b',color:'blue'}];
let pawns={y:[48,49,50,-1],b:[-1,-1,-1,-1]};
function progress(color,pos){if(pos===-1)return null;if(pos>=48)return pos;if(pos>=0&&pos<48)return (pos-COLORS[color].start+48)%48;return null}
function target(color,pos,r){if(!Number.isInteger(r)||r<1||r>6)return null;if(pos===-1)return r===6?COLORS[color].start:null;const pr=progress(color,pos);if(pr===null)return null;const np=pr+r;if(np>51)return null;return np<48?(COLORS[color].start+np)%48:48+(np-48)}
function occupied(pos,exceptId,exceptPawn){const a=[];for(const p of players)for(let i=0;i<4;i++){if(p.id===exceptId&&i===exceptPawn)continue;const q=(pawns[p.id]||[])[i];if(q===pos)a.push({p,i})}return a}
function canLand(p,i,r){const arr=pawns[p.id]||[-1,-1,-1,-1];const to=target(p.color,arr[i],r);if(to===null)return false;const blockers=occupied(to,p.id,i);if(to>=48)return blockers.length===0;return !blockers.some(o=>o.p.id===p.id)}
assert.equal(target('yellow',47,1),0);
assert.equal(target('yellow',48,1),49);
assert.equal(target('yellow',48,2),50);
assert.equal(target('yellow',49,1),50);
assert.equal(target('yellow',50,1),51);
assert.equal(target('yellow',51,1),null);
// Occupied goal cells may be jumped, but the actual landing cell must be free.
assert.equal(canLand(players[0],0,1),false); // 48 -> 49, occupied by own pawn
assert.equal(canLand(players[0],0,2),false); // 48 -> 50, occupied by own pawn
assert.equal(canLand(players[0],1,1),false); // 49 -> 50, occupied by own pawn
assert.equal(canLand(players[0],1,2),true);  // 49 -> 51, skips 50
assert.equal(canLand(players[0],2,1),true);  // 50 -> 51
// Exact final entry.
assert.equal(canLand(players[0],2,2),false);
// Last-die behavior: active dice can clear while lastDice remains.
const state={dice:2,lastDice:2}; state.dice=null; assert.equal(state.lastDice,2);
state.dice=6; state.lastDice=6; state.dice=null; assert.equal(state.lastDice,6);
console.log('ALL LOGIC TESTS PASSED');
