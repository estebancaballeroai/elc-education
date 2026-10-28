'use strict';
const assert=require('node:assert/strict');
const E=require('../engine.js');
require('../content.js');
const C=globalThis.MathShiftContent;
const eq=(actual,expected,msg)=>assert.equal(actual,expected,msg);
eq(C.version,'0.4.0');
eq(C.questions.length,122);
eq(C.stations.length,9);
assert.deepEqual(C.stations.slice(0,7).map(s=>[s.id,C.questions.filter(q=>q.station===s.id).length]),[['pont',7],['laser',7],['reacteur',6],['equation',16],['fonction',16],['nombres',18],['litteral',18]]);
eq(new Set(C.questions.map(q=>q.id)).size,122,'unique IDs');
function correctAnswer(q){
 if(q.kind==='function')return {a:q.aTarget,b:q.bTarget};
 if(q.kind==='number'&&q.mode==='scientific')return {mantissa:q.mantissa,exponent:q.exponent};
 if(q.kind==='algebra'){
  if(q.mode==='factor')return {g:q.factor,a:q.insideA,b:q.insideB};
  if(q.mode==='expand')return {a:q.ax,b:q.constant};
  return {a:q.linear,b:q.constant};
 }
 return q.answer;
}
for(const q of C.questions.slice(0,88)){
 assert.ok(q.story&&q.prompt&&q.hint&&q.explain,`missing text ${q.id}`);
 assert.ok(q.explain.length>=58 && q.hint.length>=50,`quality text ${q.id}`);
 assert.ok(q.difficulty>=1&&q.difficulty<=3,`difficulty ${q.id}`);
 const answer=correctAnswer(q);
 assert.ok(E.isCorrect(q,answer),`accept true answer ${q.id}`);
 let invalid;
 if(typeof answer==='object'){
  invalid={...answer};const key=Object.keys(invalid)[0];invalid[key]=String(Number(invalid[key])+1);
 }else invalid=Number(answer)+1;
 assert.equal(E.isCorrect(q,invalid),false,`reject wrong answer ${q.id}`);
 assert.equal(E.isCorrect(q,{}),false,`reject empty object ${q.id}`);
 if(q.kind==='number'){
  if(q.mode==='power')assert.ok(Math.abs(q.answer-q.base**q.exponent)<1e-10);
  if(q.mode==='root')eq(q.answer*q.answer,q.radicand);
  if(q.mode==='simplify')eq(q.factor*q.factor*q.remaining,q.radicand);
  if(q.mode==='scientific'){
   assert.ok(Math.abs(q.mantissa*10**q.exponent-q.value)<1e-7);
   assert.equal(E.isCorrect(q,{mantissa:'9',exponent:'not-an-integer'}),false);
   assert.equal(E.isCorrect(q,{mantissa:'0.42',exponent:'-3'}),false,'non-normalized notation');
  }
 }
 if(q.kind==='algebra'){
  if(q.mode==='expand'){eq(q.ax,q.k*q.a);eq(q.constant,q.k*q.b);}
  if(q.mode==='factor'){
    eq(q.factor*q.insideA,q.A);eq(q.factor*q.insideB,q.B);
    function gcd(a,b){return b?gcd(b,a%b):Math.abs(a);}eq(q.factor,gcd(q.A,q.B));
  }
  if(q.mode==='double'){
   eq(q.linear,q.p+q.q);eq(q.constant,q.p*q.q);
   for(const x of [-6,0,2,11])assert.ok(Math.abs((x+q.p)*(x+q.q)-(x*x+q.linear*x+q.constant))<1e-9);
  }
 }
}
// Le bilan V0.2 reste stable en V0.3 : aucune réponse ancienne ne change.
for(const q of C.questions.slice(0,52))assert.ok(E.isCorrect(q,correctAnswer(q)),`old challenge ${q.id}`);
const old={version:1,solved:{'pont-1':{xp:30},'equation-4':{xp:20},'fonction-3':{xp:15}},skipped:{'laser-1':true},attempts:{'pont-1':2},secrets:{jardin:true},sound:true};
const state=E.sanitize(old);
eq(E.score(state,C.questions).success,3);eq(E.score(state,C.questions).total,122);
eq(E.stats(state,C.questions,'nombres').solved,0);eq(E.stats(state,C.questions,'litteral').solved,0);
const newQ=C.questions.find(q=>q.id==='litteral-double-3');
assert.ok(E.markCorrect(state,newQ));assert.equal(E.markCorrect(state,newQ),false);
let storeData='';let store={getItem:()=>storeData,setItem:(_,v)=>storeData=v};
assert.ok(E.save(store,state));eq(E.load(store).solved['pont-1'].xp,30);
eq(E.load(store).solved['litteral-double-3'].xp,30);
assert.equal(E.isCorrect({kind:'algebra',mode:'factor',factor:3,insideA:2,insideB:3},{g:'3',a:'2',b:'3'}),true);
assert.equal(E.isCorrect(C.questions.find(q=>q.id==='nombres-science-1'),{mantissa:'4,2',exponent:'-4'}),true);
assert.equal(E.cleanNumber('4,2'),4.2);
console.log('OK — non-régression des 88 défis V0.3, 7 quartiers historiques, calcul exact, retours d’erreur, anciens parcours et sauvegardes V0.1/V0.2.');
