const assert=require('assert');
const COLORS={red:0,green:8,purple:16,yellow:24,black:32,blue:40};
function progress(c,pos){if(pos===-1)return null;if(pos>=48&&pos<=51)return pos;if(pos>=0&&pos<48)return (pos-COLORS[c]+48)%48;return null}
function target(c,pos,r){if(pos===-1)return r===6?COLORS[c]:null;const p=progress(c,pos);if(p===null)return null;const n=p+r;if(n>51)return null;return n<48?(COLORS[c]+n)%48:n}
function canLand(arr,i,c,r){const to=target(c,arr[i],r);if(to===null)return false;return !arr.some((x,j)=>j!==i&&x===to)}
function legal(arr,c,r){const home=arr.map((x,i)=>x===-1?i:null).filter(i=>i!==null);const start=COLORS[c];const onStart=arr.findIndex(x=>x===start);if(r===6&&home.length){if(onStart>=0&&home.length>1)return canLand(arr,onStart,c,r)?[onStart]:[];return home.filter(i=>canLand(arr,i,c,r))}return arr.map((x,i)=>x===-1?null:(canLand(arr,i,c,r)?i:null)).filter(i=>i!==null)}
for(const c of Object.keys(COLORS)){
  // A occupied + >=2 home: only A-piece may be moved with the 6.
  const arr=[COLORS[c],-1,-1,((COLORS[c]+5)%48)];
  assert.deepStrictEqual(legal(arr,c,6),[0],`${c}: occupied A with >1 home`);
  // A free + >=1 home: a 6 must bring a home piece out, not move another track piece.
  const arr2=[-1,-1,((COLORS[c]+10)%48),((COLORS[c]+5)%48)];
  assert.deepStrictEqual(legal(arr2,c,6),[0,1],`${c}: A free, home pieces waiting`);
  // Last home piece + A free: it may stay on A; no forced clearing.
  const arr3=[-1,((COLORS[c]+10)%48),((COLORS[c]+20)%48),((COLORS[c]+30)%48)];
  assert.deepStrictEqual(legal(arr3,c,6),[0],`${c}: last home piece`);
  // Last home piece + A occupied: own stacking still forbids entering A.
  const arr4=[COLORS[c],-1,((COLORS[c]+20)%48),((COLORS[c]+30)%48)];
  assert.deepStrictEqual(legal(arr4,c,6),[],`${c}: last home cannot stack on A`);
}
console.log('START-FIELD ALL-COLORS TESTS PASSED');
