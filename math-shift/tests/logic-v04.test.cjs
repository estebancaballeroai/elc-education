'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const E=require('../engine.js');
require('../content.js');
const C=globalThis.MathShiftContent;
assert.equal(C.version,'0.4.0');
assert.equal(C.questions.length,122);
assert.equal(C.stations.length,9);
assert.deepEqual(C.stations.map(s=>[s.id,C.questions.filter(q=>q.station===s.id).length]),
 [['pont',7],['laser',7],['reacteur',6],['equation',16],['fonction',16],['nombres',18],['litteral',18],['statistiques',16],['hasard',18]]);
const legacy=JSON.parse(fs.readFileSync(__dirname+'/legacy-v03.json','utf8'));
const fields=[...new Set(legacy.reduce((a,x)=>a.concat(Object.keys(x)),[]))];
assert.equal(legacy.length,88);
for(let i=0;i<legacy.length;i++){
 for(const key of fields)if(Object.prototype.hasOwnProperty.call(legacy[i],key))
  assert.deepEqual((C.questions[i][key]===undefined?'':C.questions[i][key]),legacy[i][key],`regression V0.3 ${i+1} ${key}`);
}
const ids=C.questions.map(q=>q.id);assert.equal(new Set(ids).size,122);
for(const q of C.questions){
 assert.ok(q.story&&q.prompt&&q.hint&&q.explain,`text ${q.id}`);
 assert.ok(q.difficulty>=1&&q.difficulty<=3,`difficulty ${q.id}`);
 assert.ok(q.hint.length>=50 && q.explain.length>=58,`detailed correction ${q.id}`);
 let answer;
 if(q.kind==='function')answer={a:q.aTarget,b:q.bTarget};
 else if(q.kind==='number'&&q.mode==='scientific')answer={mantissa:q.mantissa,exponent:q.exponent};
 else if(q.kind==='algebra')answer=q.mode==='factor'?{g:q.factor,a:q.insideA,b:q.insideB}:{a:q.mode==='expand'?q.ax:q.linear,b:q.constant};
 else if(q.kind==='probability')answer={num:q.numerator,den:q.denominator};
 else answer=q.answer;
 assert.ok(E.isCorrect(q,answer),`expected ${q.id}`);
 let wrong;if(typeof answer==='object'){
  wrong={...answer};const k=Object.keys(wrong)[0];wrong[k]=Number(wrong[k])+1;
 }else wrong=answer+1;
 assert.equal(E.isCorrect(q,wrong),false,`reject wrong ${q.id}`);
 if(q.kind==='statistics'){
  const d=q.data||[];
  if(q.mode==='bar'){
   assert.equal(q.counts.reduce((a,b)=>a+b,0),q.observations.length);
   assert.equal(q.observations.filter(x=>x===q.labels[q.targetIndex]).length,q.answer);
   assert.equal(q.counts[q.targetIndex],q.answer);
  }
  if(q.mode==='mean')assert.equal(q.answer,d.reduce((a,b)=>a+b,0)/d.length);
  if(q.mode==='median'){
   const sorted=d.slice().sort((a,b)=>a-b),n=sorted.length;
   assert.equal(q.answer,(sorted[Math.floor((n-1)/2)]+sorted[Math.floor(n/2)])/2);
  }
  if(q.mode==='range')assert.equal(q.answer,Math.max(...d)-Math.min(...d));
  assert.ok(E.isCorrect(q,String(q.answer).replace('.',',')),`French number ${q.id}`);
 }
 if(q.kind==='probability'){
  let favourable;
  if(q.mode==='two')favourable=q.pool.filter(x=>x===q.first).length*q.pool.filter(x=>x===q.second).length;
  else if(q.mode==='die')favourable=q.pool.filter(x=>q.favorable.includes(x)).length;
  else favourable=q.pool.filter(x=>x===q.target).length;
  assert.equal(favourable,q.numerator,`favorable ${q.id}`);
  assert.equal(q.denominator,q.mode==='two'?q.pool.length*q.pool.length:q.pool.length);
  assert.equal(q.answer,q.numerator/q.denominator);
  assert.ok(E.isCorrect(q,{num:String(q.numerator*2),den:String(q.denominator*2)}),`equivalent fraction ${q.id}`);
  for(const invalid of [{num:-1,den:1},{num:1,den:0},{num:1.5,den:3},{num:'',den:'2'},{num:1,den:'h'},null])
   assert.equal(E.isCorrect(q,invalid),false,`invalid fraction ${q.id}`);
 }
}
const backup={version:1,solved:{'pont-1':{xp:30},'equation-2':{xp:25},'fonction-2':{xp:20},'nombres-puissance-3':{xp:30},'litteral-double-1':{xp:25}},skipped:{'reacteur-1':true},attempts:{'laser-2':2},secrets:{archive:true},sound:true};
const migrated=E.sanitize(backup);
assert.equal(E.score(migrated,C.questions).success,5);
assert.equal(E.score(migrated,C.questions).total,122);
assert.equal(E.stats(migrated,C.questions,'statistiques').solved,0);
assert.equal(E.stats(migrated,C.questions,'hasard').solved,0);
assert.ok(E.markCorrect(migrated,C.questions.find(q=>q.id==='proba-urne-1')));
assert.ok(!E.markCorrect(migrated,C.questions.find(q=>q.id==='proba-urne-1')),'no repeat XP');
const mem={};const store={getItem:key=>mem[key],setItem:(key,value)=>{mem[key]=value;}};
assert.ok(E.save(store,migrated));assert.ok(E.load(store).solved['pont-1']);assert.ok(E.load(store).solved['proba-urne-1']);
console.log('OK: 122 réponses, 9 stations, 88 anciens défis inchangés, 34 nouveaux vérifiés, fractions équivalentes, migration sauvegardes.');
