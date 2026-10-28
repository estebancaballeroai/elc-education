/* Fonctions testables indépendamment de l'interface. */
(function (root) {
  'use strict';
  const KEY='elc-mathshift-save-v1';
  const now=()=>new Date().toISOString();
  function cleanNumber(value){
    if(typeof value==='number') return Number.isFinite(value)?value:NaN;
    if(typeof value!=='string')return NaN;
    const s=value.trim().replace(/\s/g,'').replace(',','.');
    if(!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(s))return NaN;
    return Number(s);
  }
  function isCorrect(q,value){
    if(q.kind==='function'){
      if(!value||typeof value!=='object')return false;
      const a=cleanNumber(value.a),b=cleanNumber(value.b);
      return Number.isFinite(a)&&Number.isFinite(b)&&a===q.aTarget&&b===q.bTarget;
    }
    if(q.kind==='number'&&q.mode==='scientific'){
      if(!value||typeof value!=='object')return false;
      const m=cleanNumber(value.mantissa),e=cleanNumber(value.exponent);
      return Number.isFinite(m)&&Number.isInteger(e)&&m>=1&&m<10&&Math.abs(m-q.mantissa)<1e-9&&e===q.exponent;
    }
    if(q.kind==='algebra'){
      if(!value||typeof value!=='object')return false;
      const valid=(key,target)=>Number.isFinite(cleanNumber(value[key]))&&Math.abs(cleanNumber(value[key])-target)<1e-9;
      if(q.mode==='expand')return valid('a',q.ax)&&valid('b',q.constant);
      if(q.mode==='factor')return valid('g',q.factor)&&valid('a',q.insideA)&&valid('b',q.insideB);
      if(q.mode==='double')return valid('a',q.linear)&&valid('b',q.constant);
      return false;
    }
    const n=cleanNumber(value);
    return Number.isFinite(n)&&Math.abs(n-q.answer)<1e-8;
  }
  function empty(){return {version:1,createdAt:now(),updatedAt:now(),solved:{},skipped:{},attempts:{},secrets:{},sound:false,reduceMotion:false};}
  function sanitize(data){
    const e=empty();
    if(!data||typeof data!=='object')return e;
    for(const field of ['solved','skipped','attempts','secrets']){
      const original=data[field];
      if(original && typeof original==='object' && !Array.isArray(original)){
        const out=Object.create(null);
        for(const [k,v] of Object.entries(original).slice(0,300)){
          if(!/^[a-z0-9-]{1,45}$/.test(k))continue;
          if(field==='attempts')out[k]=Math.max(0,Math.min(50,Number(v)||0));
          else if(v===true || (field==='solved' && v && typeof v==='object' && Number.isFinite(v.xp)))out[k]=(field==='solved'&&typeof v==='object')?{xp:Math.min(100,Math.max(0,Math.floor(v.xp)))}:true;
        }
        e[field]=out;
      }
    }
    e.sound=data.sound===true;e.reduceMotion=data.reduceMotion===true;
    e.createdAt=typeof data.createdAt==='string'?data.createdAt:e.createdAt;
    e.updatedAt=now();return e;
  }
  function load(store){
    try{return sanitize(JSON.parse(store.getItem(KEY)));}catch(_){return empty();}
  }
  function save(store,state){
    state.updatedAt=now();try{store.setItem(KEY,JSON.stringify(state));return true;}catch(_){return false;}
  }
  function score(state,questions){
    const done=questions.filter(q=>!!state.solved[q.id]);
    const success=done.length;
    const tried=questions.filter(q=>!!state.skipped[q.id]||!!state.solved[q.id]).length;
    const xp=done.reduce((acc,q)=>acc+(state.solved[q.id].xp||20),0);
    return {success,tried,total:questions.length,xp,percent:Math.round(100*success/questions.length),level:1+Math.floor(xp/150)};
  }
  function stats(state,questions,station){
    const target=questions.filter(q=>q.station===station);
    return {total:target.length,solved:target.filter(q=>!!state.solved[q.id]).length,visited:target.filter(q=>state.solved[q.id]||state.skipped[q.id]).length};
  }
  function markCorrect(state,q){
    if(state.solved[q.id])return false;
    const attempts=Math.max(0,state.attempts[q.id]||0);
    const xp=Math.max(15,30-5*Math.min(attempts,3));
    state.solved[q.id]={xp};delete state.skipped[q.id];return true;
  }
  function markSkipped(state,q){if(!state.solved[q.id])state.skipped[q.id]=true;}
  function nextQuestion(questions,state,station){
    return questions.find(q=>q.station===station && !state.solved[q.id] && !state.skipped[q.id]) ||
      questions.find(q=>q.station===station && !state.solved[q.id]) ||
      questions.find(q=>q.station===station) || null;
  }
  function stationDone(questions,state,station){return stats(state,questions,station).solved===stats(state,questions,station).total;}
  const engine={KEY,cleanNumber,isCorrect,empty,sanitize,load,save,score,stats,markCorrect,markSkipped,nextQuestion,stationDone};
  root.MathShiftEngine=engine;
  if(typeof module!=='undefined'&&module.exports)module.exports=engine;
})(typeof window!=='undefined'?window:globalThis);
