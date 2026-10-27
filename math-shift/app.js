/* MATH SHIFT – Interface autonome, sans librairie externe et sans collecte de données. */
(function(){
'use strict';
const content=window.MathShiftContent;
const E=window.MathShiftEngine;
const {stations,questions,secrets}=content;
const app=document.getElementById('app');
if(!app||!content||!E){document.body.textContent='Le jeu ne peut pas démarrer : fichiers manquants.';return;}
let saveStore;
try{saveStore=window.localStorage;}catch(_){saveStore={getItem:()=>null,setItem:()=>{throw Error('Stockage indisponible');}};}
let progress=E.load(saveStore);
let screen='map';
let stageId='pont';
let questionId=null;
let currentValue='';
let feedback=null;
let notice='';
let revisionFilter='restant';
let soundContext=null;
let previousScreen='map';
const $=(selector)=>app.querySelector(selector);
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Number(n).toLocaleString('fr-FR',{maximumFractionDigits:2});
const getQuestion=()=>questions.find(q=>q.id===questionId)||questions[0];
const getStation=id=>stations.find(s=>s.id===id)||stations[0];
function save(){return E.save(saveStore,progress);}
function playSound(){
 if(!progress.sound)return;
 try{
  const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
  soundContext=soundContext||new C();
  if(soundContext.state==='suspended')soundContext.resume();
  const o=soundContext.createOscillator(),g=soundContext.createGain(),t=soundContext.currentTime;
  o.type='sine';o.frequency.setValueAtTime(520,t);o.frequency.linearRampToValueAtTime(780,t+0.13);
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.045,t+0.012);g.gain.exponentialRampToValueAtTime(0.0001,t+0.25);
  o.connect(g);g.connect(soundContext.destination);o.start(t);o.stop(t+0.26);
 }catch(_){/* mode silencieux si audio indisponible */}
}
function icon(name,size=20){
 const paths={
  compass:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.7 5.3-4.3 1.7 2.7-5.3z"/>',
  map:'<path d="M3 5 9 3l6 2 6-2v16l-6 2-6-2-6 2zM9 3v16M15 5v16"/>',
  play:'<path d="m9 6 9 6-9 6z"/>',
  book:'<path d="M4 5a2 2 0 0 1 2-2h6v18H6a2 2 0 0 0-2-2V5Zm16 0a2 2 0 0 0-2-2h-6v18h6a2 2 0 0 1 2-2V5Z"/>',
  chart:'<path d="M4 19V5M4 19h16M8 15v-5M13 15V7M18 15v-9"/>',
  award:'<circle cx="12" cy="8" r="5"/><path d="m8.5 12-2 9 5.5-3 5.5 3-2-9"/>',
  triangle:'<path d="M12 3 22 20H2L12 3Z"/><path d="M12 3v17"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  hexagon:'<path d="m12 2 9 5v10l-9 5-9-5V7l9-5z"/><path d="m12 6 5 3v6l-5 3-5-3V9l5-3z"/>',
  chevron:'<path d="m9 18 6-6-6-6"/>',
  arrow:'<path d="m5 12 14 0m-6-6 6 6-6 6"/>',
  left:'<path d="m15 18-6-6 6-6"/>',
  check:'<path d="m4 12 5 5L20 6"/>',
  lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  sparkle:'<path d="m12 2 2.1 7.9L22 12l-7.9 2.1L12 22l-2.1-7.9L2 12l7.9-2.1z"/>',
  settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2"/><circle cx="16" cy="17" r="2"/>',
  volume:'<path d="M3 9v6h4l5 4V5L7 9zM16 9a4 4 0 0 1 0 6"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a3 3 0 0 1 5.7 1c0 1.5-2.7 2.4-2.7 4M12.5 18h.01"/>',
  rotate:'<path d="M3 12a9 9 0 1 0 3-6M3 4v4h4"/>',
  download:'<path d="M12 3v12m-4-4 4 4 4-4M5 18v3h14v-3"/>',
  flag:'<path d="M4 21V4m0 1c7-4 10 4 16 0v11c-6 4-9-4-16 0"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>'
 };
 return `<svg class="icon" aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]||paths.sparkle}</svg>`;
}
function btn(label,action,klass='',attrs=''){return `<button class="${klass}" type="button" data-action="${action}" ${attrs}>${label}</button>`;}
function persistAndRender(){save();render();}
function goto(next){screen=next;feedback=null;notice='';render();window.scrollTo(0,0);}
function header(){
 const s=E.score(progress,questions),lvNeed=150-(s.xp%150);
 return `<header class="topbar">
  <button type="button" class="brand" data-action="go-map" aria-label="MATH SHIFT, revenir à la carte"><span class="brand-mark">Δ</span><span><strong>MATH <em>SHIFT</em></strong><small>Mission 3e · ELC Éducation</small></span></button>
  <div class="top-stats"><span class="pill-xp" title="Points d'expérience">${icon('sparkle',14)} <b>${s.xp}</b> XP</span><span class="level-chip" title="Encore ${lvNeed} XP avant le prochain niveau">Niv. ${s.level}</span><button class="icon-button" data-action="go-guide" aria-label="Aide et paramètres">${icon('settings',20)}</button></div>
 </header>`;
}
function nav(){
 const tabs=[['map','Carte','map'],['mission','Mission','play'],['revision','Réviser','book'],['progress','Succès','award']];
 return `<nav class="bottom-nav" aria-label="Navigation principale">${tabs.map(([id,text,sym])=>`<button type="button" class="nav-item ${screen===id||screen==='result'&&id==='mission'?'active':''}" data-action="go-${id}" ${screen===id?'aria-current="page"':''}>${icon(sym,21)}<span>${text}</span></button>`).join('')}</nav>`;
}
function noticeHtml(){return notice?`<div class="notice" role="status">${icon('sparkle',18)} ${escapeHtml(notice)}</div>`:'';}
function mapView(){
 const total=E.score(progress,questions);const done=stations.filter(s=>E.stationDone(questions,progress,s.id)).length;
 return `<section class="map-view fade-in">
  <div class="hero-scene">
   <div class="hero-image" role="img" aria-label="Observatoire futuriste perché au-dessus d’un canyon et de cascades"></div>
   <div class="hero-scrim"></div>
   <div class="hero-content">
    <div class="eyebrow">SAISON 01 <span></span> L'OBSERVATOIRE</div>
    <h1>Réveille la <span>Cité des<br>anomalies</span></h1>
    <p>Trois mécanismes mystérieux. Des maths pour les réparer. Une aventure qui commence ici.</p>
    ${btn(`${icon('play',22)} ${total.tried?'Reprendre l’aventure':'Commencer l’aventure'} ${icon('arrow',18)}`,'continue','primary-button huge')}
    <div class="hero-quick"><span>${icon('check',16)} ${total.success}/20 défis réussis</span><span>${icon('award',16)} ${done}/3 emblèmes</span></div>
   </div>
   <img class="hero-person" src="assets/explorateur.webp" alt="Explorateur de MATH SHIFT" loading="eager" />
   <img class="hero-bot float" src="assets/nox.webp" alt="Nox, le petit robot compagnon" loading="eager" />
   <div class="hero-decoration">${icon('sparkle',22)}</div>
  </div>
  <div class="content-pad">
   ${noticeHtml()}
   <div class="section-heading"><div><span class="kicker">TON PARCOURS</span><h2>Les trois stations</h2></div><span class="section-note">Choisis ton chemin</span></div>
   <div class="station-grid">${stations.map((s,i)=>stationCard(s,i)).join('')}</div>
   <div class="exploration-banner"><div class="exploration-bg"></div><div class="exploration-copy"><span class="kicker">MODE LIBRE</span><h2>Exploration sans calcul</h2><p>Découvre trois lieux secrets de la cité. Ici, aucune bonne ou mauvaise réponse : tu explores à ton rythme.</p>${btn(`${icon('compass',19)} Explorer la cité`,'go-explore','outline-button')}</div><img class="exploration-bot" src="assets/nox.webp" alt="" loading="lazy" /></div>
   <div class="note-strip">${icon('info',18)} <span>Sans publicité, sans inscription, sans limite de temps. Tes progrès sont enregistrés uniquement sur cet appareil.</span></div>
  </div>
 </section>`;
}
function stationCard(s,index){
 const st=E.stats(progress,questions,s.id);const percent=Math.round(100*st.solved/st.total);const complete=st.solved===st.total;
 return `<button type="button" data-action="open-station" data-id="${s.id}" class="station-card theme-${s.color}">
  <div class="station-art station-art-${s.id}"><div class="station-art-glow"></div><span class="station-symbol">${icon(s.icon,37)}</span><span class="station-chapter">CHAPITRE ${s.number}</span></div>
  <div class="station-body"><div class="station-title-row"><span class="station-label">${escapeHtml(s.short)} · ${st.total} défis</span>${complete?`<span class="mini-medal">${icon('award',18)} Terminé</span>`:''}</div><h3>${escapeHtml(s.name)}</h3><p>${escapeHtml(s.subtitle)}</p>
  <div class="station-bottom"><div class="small-progress"><span style="width:${percent}%"></span></div><strong>${st.solved}/${st.total}</strong><span class="arrow-disc">${icon('chevron',18)}</span></div></div></button>`;
}
function selectStation(id){
 stageId=id;const q=E.nextQuestion(questions,progress,id);questionId=q&&q.id;currentValue='';feedback=null;goto('mission');
}
function stationIntro(s,st){
 return `<div class="mission-banner"><div class="mission-image"></div><div class="mission-banner-cover"></div><button type="button" class="back-link" data-action="go-map">${icon('left',17)} Carte</button>
 <div class="mission-banner-text"><span class="eyebrow">CHAPITRE ${s.number} • ${escapeHtml(s.short)}</span><h1>${escapeHtml(s.name)}</h1><p>${escapeHtml(s.lore)}</p></div></div>
 <div class="station-line"><span>${icon('flag',19)} ${st.solved}/${st.total} maîtrisés</span><span>${st.visited}/${st.total} rencontrés</span></div>`;
}
function missionView(){
 const s=getStation(stageId);
 const st=E.stats(progress,questions,stageId);
 if(!questionId)questionId=E.nextQuestion(questions,progress,stageId).id;
 const q=getQuestion();const number=questions.filter(x=>x.station===stageId).findIndex(x=>x.id===q.id)+1;
 const answered=!!progress.solved[q.id];
 return `<section class="mission-view fade-in">
  ${stationIntro(s,st)}
  <div class="content-pad lesson-pad">
   <div class="switch-station" role="group" aria-label="Choisir une station">${stations.map(x=>`<button type="button" class="station-tab ${stageId===x.id?'active':''}" data-action="open-station" data-id="${x.id}">${icon(x.icon,17)} <span>${escapeHtml(x.short)}</span></button>`).join('')}</div>
   <article class="lesson-card theme-${s.color}">
    <div class="lesson-rail"><span class="chapter-badge">DÉFI ${String(number).padStart(2,'0')} <span>/ ${st.total}</span></span><span class="difficulty">${['','Initiation','Application','Défi'][q.difficulty]}</span></div>
    <div class="lesson-header"><div><h2>${escapeHtml(q.title)}</h2><p>${escapeHtml(q.story)}</p></div><span class="lesson-point">${icon('sparkle',18)} +XP</span></div>
    <div class="diagram-frame" id="diagram">${diagram(q,initialVal(q))}</div>
    <p class="diagram-caption">Schéma interactif — non à l'échelle</p>
    <div class="challenge-prompt"><span class="challenge-icon">${icon('help',19)}</span><p>${escapeHtml(q.prompt)}</p></div>
    <form id="answer-form" class="answer-form">
      ${sliderInput(q,answered)}
      <div class="answer-actions"><button type="submit" class="primary-button" >${icon('check',19)} Vérifier ma réponse</button>${btn(`${icon('help',17)} Un indice`,'hint','ghost-button')} </div>
    </form>
    ${feedbackHtml(q,answered)}
    <div class="lesson-footer">${btn(`${icon('left',17)} Défi précédent`,'prev','light-button')}${btn(`${icon('arrow',17)} Passer / explorer`,'skip','light-button')}
    </div>
   </article>
   <div class="teacher-note"><div>${icon('book',21)}</div><div><h3>Le rappel de Nox</h3><p>${escapeHtml(s.theory)}</p></div></div>
  </div>
 </section>`;
}
function initialVal(q){
 const n=E.cleanNumber(currentValue);return Number.isFinite(n)?n:0;
}
function sliderInput(q,answered){
 const val=initialVal(q);const isSlider=q.station!=='reacteur';
 return `${isSlider?`<label class="range-label" for="answer-range">${q.station==='pont'?'Longueur AE':'Orientation du rayon'} : <output id="value-output" for="answer-range">${fmt(val)} ${escapeHtml(q.unit)}</output></label>
 <input type="range" id="answer-range" min="0" max="${q.station==='pont'?q.AC:65}" step="${q.station==='pont'?'0.5':'1'}" value="${val}" aria-label="${q.station==='pont'?'Longueur AE en mètres':'Angle de visée en degrés'}" />
 <div class="range-ends"><span>0 ${escapeHtml(q.unit)}</span><span>${q.station==='pont'?q.AC:65} ${escapeHtml(q.unit)}</span></div>`:''}
 <label class="answer-label" for="answer-number">${isSlider?'Ou saisis la valeur précise :':'Entre la longueur manquante :'} </label>
 <div class="number-wrap"><input id="answer-number" name="answer" type="text" inputmode="decimal" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ta réponse" value="${currentValue?escapeHtml(currentValue):isSlider?String(val):''}" aria-describedby="answer-unit" /><span id="answer-unit">${escapeHtml(q.unit)}</span></div>
 <p class="input-help">${q.station==='laser'?'Arrondis à l’unité (exemple : 37°).':q.station==='pont'?'Tu peux utiliser une virgule pour les décimales.':'Tu peux utiliser la racine carrée et ton calculateur habituel.'}</p>`;
}
function feedbackHtml(q,answered){
 if(!feedback&&answered){return `<div class="feedback success" role="status">${icon('award',24)}<div><strong>Ce défi est déjà réussi !</strong><p>Tu peux passer au défi suivant ou revoir l'explication.</p>${btn('Défi suivant '+icon('arrow',18),'next','secondary-button')}</div></div>`;}
 if(!feedback)return '';
 const good=feedback.kind==='success';const marked=feedback.kind==='hint';
 return `<div class="feedback ${good?'success':marked?'hint':'incorrect'}" role="status" aria-live="polite">${icon(good?'award':marked?'help':'info',23)}<div><strong>${escapeHtml(feedback.title)}</strong><p>${escapeHtml(feedback.text)}</p>${good?btn('Défi suivant '+icon('arrow',18),'next','secondary-button'):''}</div></div>`;
}
function svgBase(label,inside){return `<svg class="geometry-svg" viewBox="0 0 400 290" role="img" aria-label="${escapeHtml(label)}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="beam" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#41ecff"/><stop offset="100%" stop-color="#ffaa69"/></linearGradient></defs>${inside}</svg>`;}
function point(x,y,label,theme=''){return `<circle cx="${x}" cy="${y}" r="5.5" fill="${theme||'#66e9ff'}" stroke="#e8ffff" stroke-width="1.4"/><text x="${x+9}" y="${y-8}" class="svg-label">${label}</text>`;}
function diagram(q,value){
 if(q.station==='pont'){
  const A=[200,30],B=[65,244],C=[335,244];const t=q.AD/q.AB;const v=Math.max(0,Math.min(1,value/q.AC));
  const D=[A[0]+t*(B[0]-A[0]),A[1]+t*(B[1]-A[1])];
  const F=[A[0]+v*(C[0]-A[0]),A[1]+v*(C[1]-A[1])];
  const aligned=Math.abs(v-t)<0.0001;
  return svgBase('Triangle ABC avec D sur AB, E sur AC et une passerelle mobile DE',`<path d="M${A} L${B} L${C}Z" fill="rgba(29,96,140,.09)" stroke="#9ec6e7" stroke-width="3"/>
  <path d="M${D} L${F}" stroke="${aligned?'#83f6b6':'#ffb15b'}" stroke-width="10" opacity=".3" stroke-linecap="round"/><path d="M${D} L${F}" stroke="${aligned?'#83f6b6':'#ffc36d'}" stroke-width="4" stroke-linecap="round" stroke-dasharray="7 4" filter="url(#glow)"/>
  <path d="M${D[0]} ${D[1]} L${D[0]} ${D[1]-10}" stroke="#fff" stroke-width="2"/>
  ${point(...A,'A')}${point(...B,'B')}${point(...C,'C')}${point(...D,'D')}${point(...F,'E',aligned?'#87f6bc':'#ffa94c')}
  <text x="58" y="155" class="svg-value">AB = ${q.AB} m</text><text x="76" y="188" class="svg-small">AD = ${q.AD} m</text><text x="259" y="155" class="svg-value">AC = ${q.AC} m</text><text x="205" y="78" class="svg-small" fill="#ffbf7a">AE = ${fmt(value)} m</text><text x="135" y="274" class="svg-note">${aligned?'Pont aligné !':'Ajuste E pour rendre DE parallèle à BC'}</text>`);
 }
 if(q.station==='laser'){
  const angle=Math.max(0,Math.min(65,value));const y=Math.max(6,242-280*Math.tan(angle*Math.PI/180));const targetY=242-280*q.height/q.distance;
  const aligned=Math.abs(angle-q.answer)<=0.49;
  return svgBase('Laser d’un projecteur vers une balise, angle ajustable',`<path d="M53 242H345" stroke="#a6c4df" stroke-width="3"/><path d="M345 242V${targetY}" stroke="#8beeff" stroke-width="6" opacity=".65"/><path d="M53 242 L345 ${y}" stroke="url(#beam)" stroke-width="5" opacity=".75" filter="url(#glow)"/><path d="M53 242 L345 ${y}" stroke="#eaffff" stroke-width="1.3"/>
  <path d="M345 ${targetY}h14v13h-14z" fill="none" stroke="#ffd78a" stroke-width="3"/><circle cx="345" cy="${targetY}" r="12" stroke="${aligned?'#6effb5':'#ffc66f'}" fill="none" stroke-width="2"/><circle cx="53" cy="242" r="10" fill="#58dffc"/>
  <path d="M82 242A29 29 0 0 0 ${53+29*Math.cos(angle*Math.PI/180)} ${242-29*Math.sin(angle*Math.PI/180)}" fill="none" stroke="#ffd28c" stroke-width="2"/>
  <text x="79" y="230" class="svg-value">θ = ${fmt(angle)}°</text><text x="156" y="265" class="svg-value">${q.distance} m</text><text x="352" y="${Math.max(28,targetY+23)}" class="svg-value">${q.height} m</text><text x="110" y="25" class="svg-note">${aligned?'Balise atteinte !':'La lumière suit ton réglage'}</text>`);
 }
 const a=q.a,b=q.b,c=q.c;
 const x=93,y=236,xt=93,yt=66,xr=323,yr=236;
 return svgBase('Triangle rectangle avec un angle droit et une longueur inconnue',`<path d="M${x} ${y}L${xt} ${yt}L${xr} ${yr}Z" fill="rgba(100,190,250,.09)" stroke="#a8d7ef" stroke-width="3"/>
 <path d="M93 216h20v20" stroke="#ffc67b" stroke-width="2.5" fill="none"/><path d="M93 66L323 236" stroke="#75eeff" stroke-width="5" filter="url(#glow)" opacity=".75"/>
 ${point(93,236,'A')}${point(93,66,'B')}${point(323,236,'C')}
 <text x="38" y="154" class="svg-value">${a} m</text><text x="176" y="262" class="svg-value">${q.mode==='hyp'?b+' m':'? m'}</text><text x="230" y="139" class="svg-value">${q.mode==='hyp'?'? m':c+' m'}</text><text x="133" y="31" class="svg-note">Angle droit en A</text>`);
}
function goNext(){
 const qs=questions.filter(q=>q.station===stageId);const idx=qs.findIndex(q=>q.id===questionId);
 const rest=qs.slice(idx+1).concat(qs.slice(0,idx+1));
 let next=rest.find(q=>!progress.solved[q.id]&&!progress.skipped[q.id]);
 if(!next){screen='result';feedback=null;currentValue='';render();window.scrollTo(0,0);return;}
 questionId=next.id;currentValue='';feedback=null;render();window.scrollTo(0,0);
}
function resultView(){
 const s=getStation(stageId),st=E.stats(progress,questions,stageId),all=st.solved===st.total,unmastered=st.total-st.solved;
 return `<section class="result-page fade-in"><div class="result-hero"><div class="result-stars">${icon(all?'award':'sparkle',55)}</div><div class="kicker">CHAPITRE ${s.number} • TERMINÉ</div><h1>${all?'Emblème débloqué !':'Exploration terminée !'}</h1><p>${all?`Tu as réussi tous les défis de « ${s.name} ». Nox a retrouvé une partie de l’énergie de l’observatoire.`:`Tu as exploré « ${s.name} ». Il reste ${unmastered} défi(s) à maîtriser : tu peux y revenir à tout moment.`}</p><div class="result-numbers"><div><b>${st.solved}/${st.total}</b><span>défis maîtrisés</span></div><div><b>${E.score(progress,questions).xp}</b><span>XP accumulés</span></div></div><img src="assets/nox.webp" alt="Nox te félicite" class="result-bot" /></div>
 <div class="result-actions">${btn('Retour à la carte','go-map','primary-button')}${btn('Revoir les défis','go-revision','outline-button')}</div></section>`;
}
function revisionView(){
 const qlist=revisionFilter==='restant'?questions.filter(q=>!progress.solved[q.id]):questions;
 return `<section class="common-page fade-in"><div class="page-hero page-hero-revision"><span class="kicker">LABORATOIRE D'ENTRAÎNEMENT</span><h1>Réviser pour progresser</h1><p>Les défis que tu n'as pas encore maîtrisés restent disponibles. Tu peux refaire ceux déjà réussis, sans limite de temps.</p></div>
 <div class="content-pad"><div class="filter-tabs" role="group" aria-label="Filtrer les exercices">${btn('À travailler','filter-restant',`filter-tab ${revisionFilter==='restant'?'active':''}`)}${btn('Tous les exercices','filter-tous',`filter-tab ${revisionFilter==='tous'?'active':''}`)}</div>
  ${qlist.length?stations.map(s=>{
  const list=qlist.filter(q=>q.station===s.id);if(!list.length)return '';
  return `<div class="revision-group"><div class="section-heading"><h2>${icon(s.icon,22)} ${escapeHtml(s.short)}</h2><span>${list.length} défis</span></div><div class="revision-list">${list.map(q=>`<button type="button" class="revision-item" data-action="open-question" data-id="${q.id}"><span class="q-indicator ${progress.solved[q.id]?'done':progress.skipped[q.id]?'skipped':''}">${icon(progress.solved[q.id]?'check':progress.skipped[q.id]?'rotate':'triangle',17)}</span><span class="revision-text"><strong>${escapeHtml(q.title)}</strong><small>${['','Initiation','Application','Défi'][q.difficulty]} ${progress.solved[q.id]?'· réussi':progress.skipped[q.id]?'· à revoir':''}</small></span>${icon('chevron',18)}</button>`).join('')}</div></div>`;
 }).join(''):`<div class="empty-state">${icon('award',45)}<h2>Tous les défis sont réussis !</h2><p>Tu peux les refaire en sélectionnant « Tous les exercices ».</p></div>`}
 </div></section>`;
}
function progressView(){
 const s=E.score(progress,questions),secretN=secrets.filter(a=>progress.secrets[a.id]).length;
 return `<section class="common-page fade-in"><div class="page-hero page-hero-progress"><span class="kicker">TON CARNET D'EXPLORATEUR</span><h1>Progrès et récompenses</h1><p>Tu gagnes tes emblèmes grâce à tes réussites. Aucune récompense payante et aucune obligation de jouer chaque jour.</p></div>
 <div class="content-pad"><div class="stat-grid"><div><b>${s.xp}</b><span>XP</span></div><div><b>${s.success}/20</b><span>défis maîtrisés</span></div><div><b>${s.percent}%</b><span>maîtrise</span></div></div>
 <div class="section-heading"><h2>Les emblèmes</h2><span>${stations.filter(x=>E.stationDone(questions,progress,x.id)).length}/3</span></div>
 <div class="medal-list">${stations.map(x=>{
 const st=E.stats(progress,questions,x.id);const done=st.solved===st.total;
 return `<button class="medal-item ${done?'unlocked':'locked'}" type="button" data-action="open-station" data-id="${x.id}"><span class="medal-icon">${icon(done?'award':x.icon,33)}</span><span><strong>${escapeHtml(x.medal)}</strong><small>${done?'Emblème obtenu':'Encore '+(st.total-st.solved)+' défi(s) à réussir'}</small></span>${icon('chevron',18)}</button>`;
 }).join('')}</div>
 <div class="section-heading"><h2>Trésors d’exploration</h2><span>${secretN}/3</span></div>
 <div class="medal-list">${secrets.map(x=>`<div class="medal-item ${progress.secrets[x.id]?'unlocked':'locked'}"><span class="medal-icon">${icon(progress.secrets[x.id]?'sparkle':'lock',30)}</span><span><strong>${progress.secrets[x.id]?escapeHtml(x.name):'Trésor inconnu'}</strong><small>${progress.secrets[x.id]?escapeHtml(x.detail):'À découvrir en exploration libre'}</small></span></div>`).join('')}</div>
 <div class="progress-tools">${btn(`${icon('download',17)} Exporter mes progrès`,'export','outline-button')}${btn(`${icon('settings',17)} Paramètres`,'go-guide','light-button')}</div>
 </div></section>`;
}
function exploreView(){
 return `<section class="common-page fade-in"><div class="page-hero page-hero-explore"><span class="kicker">EXPLORATION LIBRE</span><h1>Les secrets de la cité</h1><p>Choisis un chemin. Tu n'as aucune équation à résoudre ici : il suffit d'avoir envie d'explorer.</p></div><div class="content-pad">${noticeHtml()}<div class="explore-grid">${secrets.map((s,i)=>`<button type="button" class="explore-choice" data-action="secret" data-id="${s.id}"><span class="explore-icon">${icon(i===0?'sun':i===1?'compass':'book',30)}</span><span class="kicker">${['CHEMIN DE L’AUBE','CHEMIN DES BRUMES','CHEMIN DES SOUVENIRS'][i]}</span><strong>${escapeHtml(s.label)}</strong><small>${progress.secrets[s.id]?`Découvert : ${escapeHtml(s.name)}`:'Une curiosité t’attend derrière la porte…'}</small><span class="explore-go">${progress.secrets[s.id]?'Revisiter':'Explorer'} ${icon('arrow',17)}</span></button>`).join('')}</div>${btn(`${icon('left',17)} Retour à la carte`,'go-map','outline-button')}</div></section>`;
}
function guideView(){
 return `<section class="common-page fade-in"><div class="page-hero page-hero-guide"><span class="kicker">GUIDE DU JOUEUR</span><h1>Bienvenue dans MATH SHIFT</h1><p>Un jeu de maths pour comprendre, essayer, se tromper et recommencer.</p></div><div class="content-pad"><div class="guide-block"><h2>Comment jouer ?</h2><ol><li><strong>Choisis une station.</strong> Tu peux commencer où tu veux.</li><li><strong>Observe le schéma.</strong> Déplace le curseur ou écris ta réponse.</li><li><strong>Vérifie.</strong> Nox explique les erreurs et peut donner un indice.</li><li><strong>Continue.</strong> Si tu bloques, passe le défi et reviens plus tard grâce à « Réviser ».</li><li><strong>Collecte les emblèmes.</strong> Maîtrise tous les défis d'une station.</li></ol></div>
 <div class="guide-block"><h2>Paramètres</h2><div class="setting-row"><span>${icon('volume',20)} Son des réussites</span>${btn(progress.sound?'Activé':'Désactivé','toggle-sound',`toggle-button ${progress.sound?'on':''}`)}</div><div class="setting-row"><span>${icon('settings',20)} Animations réduites</span>${btn(progress.reduceMotion?'Activées':'Désactivées','toggle-motion',`toggle-button ${progress.reduceMotion?'on':''}`)}</div><p class="guide-caption">Le son est désactivé par défaut. Le jeu fonctionne sans compte et ne transmet pas les résultats.</p></div>
 <div class="guide-block"><h2>Sauvegarde locale</h2><p>Ton avancement est enregistré sur cet appareil, dans ce navigateur. Il peut disparaître si tu effaces ses données.</p><div class="setting-actions">${btn(`${icon('download',18)} Sauvegarder un fichier`,'export','outline-button')}<label class="import-label" for="import-save">Importer une sauvegarde<input type="file" id="import-save" accept="application/json,.json" /></label>${btn(`${icon('rotate',18)} Effacer ma progression`,'reset','danger-button')}</div><p class="guide-caption">Les fichiers de sauvegarde sont facultatifs. Aucune donnée n'est envoyée à un serveur.</p></div>
 <div class="guide-block"><h2>Programme et crédits</h2><p>Cette mission entraîne au théorème de Thalès et à la trigonométrie de 3e et révise le théorème de Pythagore. Le contenu s'appuie sur les attendus officiels de fin de 3e applicables en 2026-2027. Les exercices sont des créations originales, pas des annales officielles du brevet.</p><p>Jeu gratuit conçu pour ELC Éducation. Illustrations originales générées pour le jeu. Version ${content.version}. Fonctionne sur mobile, tablette ou ordinateur.</p></div>
 ${btn('Retour à la carte','go-map','outline-button')}</div></section>`;
}
function render(){
 const views={map:mapView,mission:missionView,revision:revisionView,progress:progressView,explore:exploreView,guide:guideView,result:resultView};
 app.innerHTML=`${header()}<main id="main-content">${(views[screen]||mapView)()}</main>${nav()}<div class="sr-only" aria-live="polite" id="announcer"></div>`;
 document.body.classList.toggle('reduce-motion',progress.reduceMotion);
}
function handleSubmit(evt){
 if(evt.target.id!=='answer-form')return;
 evt.preventDefault();const q=getQuestion();
 const field=$('#answer-number');const raw=field?field.value:currentValue;
 if(!Number.isFinite(E.cleanNumber(raw))){feedback={kind:'error',title:'Entre un nombre',text:'Écris une valeur numérique avant de vérifier. Exemple : 6 ou 6,5.'};render();return;}
 currentValue=raw;
 if(E.isCorrect(q,raw)){
  const alreadyDone=!!progress.solved[q.id];E.markCorrect(progress,q);save();feedback={kind:'success',title:alreadyDone?'Révision réussie !':'Excellent ! Mécanisme réparé',text:q.explain};playSound();render();return;
 }
 progress.attempts[q.id]=Math.min(50,(progress.attempts[q.id]||0)+1);save();
 const attempts=progress.attempts[q.id];
 feedback={kind:'error',title:attempts===1?'Pas tout à fait, réessaie !':'Une piste pour comprendre',text:attempts===1?q.hint:q.explain};render();
}
function adjustFromRange(raw){
 const q=getQuestion();const n=Number(raw);if(!Number.isFinite(n))return;
 currentValue=String(n);const input=$('#answer-number');if(input)input.value=currentValue;
 const output=$('#value-output');if(output)output.textContent=`${fmt(n)} ${q.unit}`;
 const diagramEl=$('#diagram');if(diagramEl)diagramEl.innerHTML=diagram(q,n);
}
function adjustFromText(raw){
 currentValue=raw;const q=getQuestion();const n=E.cleanNumber(raw);
 if(Number.isFinite(n)&&q.station!=='reacteur'){
  const slider=$('#answer-range');if(slider && n>=Number(slider.min) && n<=Number(slider.max))slider.value=n;
  const output=$('#value-output');if(output)output.textContent=`${fmt(n)} ${q.unit}`;
  const diagramEl=$('#diagram');if(diagramEl)diagramEl.innerHTML=diagram(q,n);
 }
}
app.addEventListener('submit',handleSubmit);
app.addEventListener('input',evt=>{
 if(evt.target.id==='answer-range')adjustFromRange(evt.target.value);
 if(evt.target.id==='answer-number')adjustFromText(evt.target.value);
});
app.addEventListener('change',evt=>{
 if(evt.target.id==='import-save'){
  const file=evt.target.files&&evt.target.files[0];if(!file)return;
  if(file.size>150000){window.alert('Ce fichier est trop grand pour une sauvegarde.');return;}
  const reader=new FileReader();reader.onload=()=>{
   try{const x=JSON.parse(reader.result);if(!x||x.version!==1||!x.solved||!x.secrets)throw Error('format');
    if(!window.confirm('Importer cette sauvegarde ? Elle remplacera la progression actuelle de cet appareil.'))return;
    progress=E.sanitize(x);save();notice='Sauvegarde restaurée.';screen='map';render();
   }catch(_){window.alert('Sauvegarde non reconnue : utilise un fichier MATH SHIFT exporté par le jeu.');}
  };reader.readAsText(file);
 }
});
app.addEventListener('click',evt=>{
 const target=evt.target.closest('[data-action]');if(!target)return;
 const action=target.dataset.action,id=target.dataset.id;
 if(action==='go-map'){goto('map');return;}
 if(action==='go-mission'){if(!questionId){selectStation(stageId);}else goto('mission');return;}
 if(action==='go-revision'){goto('revision');return;}
 if(action==='go-progress'){goto('progress');return;}
 if(action==='go-explore'){goto('explore');return;}
 if(action==='go-guide'){previousScreen=screen;goto('guide');return;}
 if(action==='continue'){
  const s=stations.find(x=>E.stats(progress,questions,x.id).visited<E.stats(progress,questions,x.id).total) || stations[0];selectStation(s.id);return;
 }
 if(action==='open-station'){selectStation(id);return;}
 if(action==='open-question'){
  const q=questions.find(x=>x.id===id);if(!q)return;
  stageId=q.station;questionId=q.id;currentValue='';feedback=null;goto('mission');return;
 }
 if(action==='hint'){
  const q=getQuestion();feedback={kind:'hint',title:'L’indice de Nox',text:q.hint};render();return;
 }
 if(action==='next'){goNext();return;}
 if(action==='skip'){
  const q=getQuestion();E.markSkipped(progress,q);save();goNext();return;
 }
 if(action==='prev'){
  const qs=questions.filter(x=>x.station===stageId),i=qs.findIndex(x=>x.id===questionId);questionId=qs[Math.max(0,i-1)].id;currentValue='';feedback=null;render();return;
 }
 if(action==='filter-restant'){revisionFilter='restant';render();return;}
 if(action==='filter-tous'){revisionFilter='tous';render();return;}
 if(action==='secret'){
  const item=secrets.find(x=>x.id===id);if(!item)return;
  const isNew=!progress.secrets[id];progress.secrets[id]=true;save();playSound();notice=(isNew?'Trésor découvert : ':'Trésor revisité : ')+item.name+' — '+item.detail;render();return;
 }
 if(action==='toggle-sound'){progress.sound=!progress.sound;save();playSound();render();return;}
 if(action==='toggle-motion'){progress.reduceMotion=!progress.reduceMotion;persistAndRender();return;}
 if(action==='reset'){
  if(window.confirm('Effacer tous tes défis réussis, badges et trésors sur cet appareil ? Cette action est irréversible sans sauvegarde exportée.')){
   progress=E.empty();save();screen='map';questionId=null;currentValue='';feedback=null;notice='Progression réinitialisée.';render();
  }return;
 }
 if(action==='export'){
  try{
   const blob=new Blob([JSON.stringify(progress,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
   a.href=url;a.download='math-shift-sauvegarde.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }catch(_){window.alert('L’export n’est pas disponible dans ce navigateur.');}return;
 }
});
if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost')){
 window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}
render();
})();
