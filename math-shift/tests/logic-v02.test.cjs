'use strict';
const assert=require('node:assert/strict');
const E=require('../engine.js');
require('../content.js');
const C=globalThis.MathShiftContent;
assert.equal(C.version,'0.3.0');
assert.equal(C.questions.length,88);
assert.deepEqual(C.stations.slice(0,5).map(s=>[s.id,C.questions.filter(q=>q.station===s.id).length]),[['pont',7],['laser',7],['reacteur',6],['equation',16],['fonction',16]]);
const ids=C.questions.map(q=>q.id);assert.equal(new Set(ids).size,ids.length,'unique question ids');
for(const q of C.questions.slice(0,52)){
 assert.ok(q.hint.length>40 && q.explain.length>50,`explanations ${q.id}`);
 assert.ok(q.difficulty>=1&&q.difficulty<=3,`difficulty ${q.id}`);
 if(q.kind==='function'){
  assert.ok(E.isCorrect(q,{a:q.aTarget,b:q.bTarget}),q.id);
  assert.ok(!E.isCorrect(q,{a:q.aTarget+1,b:q.bTarget}),q.id);
  assert.ok(!E.isCorrect(q,{a:q.aTarget,b:q.bTarget-1}),q.id);
  assert.ok(!E.isCorrect(q,String(q.answer)),q.id);
  assert.ok(q.aTarget>=-4&&q.aTarget<=4&&q.bTarget>=-10&&q.bTarget<=10,'slider bounds');
  assert.equal(q.aTarget*q.x1+q.bTarget,q.y1);
  assert.equal(q.aTarget*q.x2+q.bTarget,q.y2);
  assert.equal((q.y2-q.y1)/(q.x2-q.x1),q.aTarget);
 }else{
  assert.ok(E.isCorrect(q,String(q.answer)),`should accept ${q.id}`);
  assert.ok(!E.isCorrect(q,String(q.answer+1)),`should reject ${q.id}`);
  if(q.kind==='equation'){
   assert.ok(q.plan.length>=2 && q.plan.length<=3,`balance steps ${q.id}`);
   assert.equal(q.plan.at(-1).after,`x = ${q.answer}`,`last step ${q.id}`);
   assert.ok(q.initial.includes(' = '),`equation ${q.id}`);
  }
  if(q.station==='pont')assert.equal(q.answer,q.AC*q.AD/q.AB);
  if(q.station==='laser')assert.equal(q.answer,Math.round(Math.atan(q.height/q.distance)*180/Math.PI));
  if(q.station==='reacteur')assert.equal(q.mode==='hyp'?q.answer*q.answer:q.answer*q.answer+q.a*q.a,q.mode==='hyp'?q.a*q.a+q.b*q.b:q.c*q.c);
 }
}
let old={version:1,solved:{'pont-1':{xp:30},'laser-1':{xp:25}},skipped:{'reacteur-1':true},attempts:{'pont-1':2},secrets:{jardin:true},sound:true};
const migrated=E.sanitize(old);
assert.equal(E.score(migrated,C.questions).success,2);
assert.equal(E.score(migrated,C.questions).total,88);
assert.equal(E.stats(migrated,C.questions,'pont').solved,1);
assert.equal(E.stats(migrated,C.questions,'equation').solved,0);
assert.equal(E.stats(migrated,C.questions,'fonction').solved,0);
assert.equal(E.markCorrect(migrated,C.questions.find(q=>q.id==='equation-1')),true);
assert.equal(E.markCorrect(migrated,C.questions.find(q=>q.id==='fonction-1')),true);
const score=E.score(migrated,C.questions);
assert.equal(score.success,4);
const keys={};const store={getItem:key=>keys[key],setItem:(key,value)=>{keys[key]=value;}};
assert.equal(E.save(store,migrated),true);
assert.equal(E.load(store).solved['pont-1'].xp,30);
assert.ok(E.load(store).solved['equation-1']);
assert.ok(E.load(store).solved['fonction-1']);
for(const q of C.questions.filter(q=>q.station==='equation'))E.markCorrect(migrated,q);
assert.ok(E.stationDone(C.questions,migrated,'equation'));
console.log('OK — 52 questions historiques conservées, 5 stations historiques, équations, deux paramètres de fonction, progression, migration des sauvegardes.');
