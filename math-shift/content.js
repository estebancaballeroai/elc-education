/* MATH SHIFT V0.1 – Jeu original ELC Education – exercices de mathématiques niveau 3e */
(function (root) {
  'use strict';
  const stations = [
    {
      id:'pont', number:'01', name:'Le pont des géomètres', short:'Thalès', icon:'triangle', color:'cyan',
      subtitle:'Reconstruire les passerelles de l’observatoire',
      lore:'Les ponts sont coupés. Nox a retrouvé un plan ancien : deux droites parallèles garantissent les bonnes proportions. Ajuste les poutres sans faire tomber le mécanisme.',
      objective:'Déterminer une longueur à l’aide du théorème de Thalès.',
      theory:'Si D est sur [AB], E sur [AC] et (DE) parallèle à (BC), alors AD/AB = AE/AC. On cherche AE en effectuant un produit en croix.',
      medal:'Architecte des ponts', points:7
    },
    {
      id:'laser', number:'02', name:'La tour des rayons', short:'Trigonométrie', icon:'sun', color:'violet',
      subtitle:'Orienter le faisceau à travers le canyon',
      lore:'Un phare ancien doit envoyer sa lumière au sommet de chaque balise. Calcule l’angle de visée, puis oriente le laser avec précision.',
      objective:'Trouver un angle dans un triangle rectangle à l’aide de la tangente.',
      theory:'Dans un triangle rectangle, tan(angle) = côté opposé / côté adjacent. Pour retrouver l’angle, on utilise la fonction arctangente de la calculatrice.',
      medal:'Maître des rayons', points:7
    },
    {
      id:'reacteur', number:'03', name:'Le cœur du réacteur', short:'Pythagore', icon:'hexagon', color:'orange',
      subtitle:'Rallumer le grand cristal de la cité',
      lore:'La salle centrale est silencieuse. Chaque chambre d’énergie est un triangle rectangle : calcule la longueur manquante pour reconnecter les circuits.',
      objective:'Calculer un côté dans un triangle rectangle avec le théorème de Pythagore.',
      theory:'Dans un triangle rectangle, le carré de l’hypoténuse est la somme des carrés des deux autres côtés. Si l’hypoténuse est connue, on effectue une soustraction.',
      medal:'Gardien du cristal', points:6
    }
  ];
  const bridgeCases = [
    [10,4,15],[12,8,18],[9,3,15],[8,6,12],[14,7,20],[10,7,20],[15,9,25]
  ];
  const laserCases = [
    [12,5],[15,9],[10,7],[18,12],[9,9],[20,8],[14,11]
  ];
  const reactorCases = [
    {a:6,b:8,mode:'hyp'}, {a:5,b:12,mode:'hyp'}, {a:5,c:13,mode:'leg'},
    {a:9,b:12,mode:'hyp'}, {a:15,c:17,mode:'leg'}, {a:7,c:25,mode:'leg'}
  ];
  const questions = [
    ...bridgeCases.map(([AB,AD,AC],i)=>({
      id:'pont-'+(i+1), station:'pont', title:'Passerelle '+(i+1),
      AB, AD, AC, answer:AC*AD/AB, unit:'m', difficulty:i<2?1:i<5?2:3,
      story:['Le premier arc est brisé.','Une poutre de secours doit être ajustée.','Le passage du jardin attend ses mesures.','Le mécanisme de pierre se réveille.','Les anciennes tours doivent être reliées.','Une passerelle suspendue résiste au vent.','Dernier verrou : la grande passerelle.'][i],
      prompt:'Dans le triangle ABC, D appartient à [AB], E appartient à [AC] et (DE) est parallèle à (BC). Quelle longueur AE permet de reconstruire le pont ?',
      hint:'Utilise la proportion AD/AB = AE/AC. Pour isoler AE, multiplie AC par AD puis divise par AB.',
      explain:`Grâce à Thalès : AE / ${AC} = ${AD} / ${AB}. Donc AE = ${AC} × ${AD} ÷ ${AB} = ${AC*AD/AB} m. Les deux rapports sont bien égaux.`
    })),
    ...laserCases.map(([distance,height],i)=>({
      id:'laser-'+(i+1), station:'laser', title:'Balise '+(i+1),
      distance, height, answer:Math.round(Math.atan(height/distance)*180/Math.PI),unit:'°', difficulty:i<2?1:i<5?2:3,
      story:['La balise du canyon est éteinte.','Les rayons traversent la brume.','Un ancien phare apparaît.','Le cristal du promontoire doit briller.','Une balise se trouve au-dessus du vide.','L’éclaireur repère un nouveau signal.','Dernier rayon avant la salle centrale.'][i],
      prompt:`La balise se trouve à ${distance} m horizontalement du projecteur et ${height} m au-dessus de lui. Quel angle de visée faut-il choisir (au degré près) ?`,
      hint:'Ici, tan(angle) = hauteur / distance horizontale. Utilise arctan(hauteur ÷ distance), puis arrondis au degré le plus proche.',
      explain:`tan(θ) = ${height} / ${distance}. Donc θ = arctan(${height} ÷ ${distance}) ≈ ${(Math.atan(height/distance)*180/Math.PI).toFixed(1).replace('.',',')}°, soit ${Math.round(Math.atan(height/distance)*180/Math.PI)}° au degré près.`
    })),
    ...reactorCases.map((x,i)=>{
      const isHyp=x.mode==='hyp'; const a=x.a;const b=isHyp?x.b:Math.sqrt(x.c*x.c-a*a);const c=isHyp?Math.sqrt(a*a+b*b):x.c;
      return {
        id:'reacteur-'+(i+1), station:'reacteur', title:i===5?'Cristal final':'Circuit '+(i+1),
        a,b,c,mode:x.mode, answer:isHyp?c:b, unit:'m',difficulty:i<2?1:i<4?2:3,
        story:['Une conduite manque entre deux bornes.','Le second circuit est rompu.','La trappe de maintenance exige une mesure.','Le noyau reprend son rythme.','Deux transformateurs doivent être reliés.','Le grand cristal attend sa dernière connexion.'][i],
        prompt:isHyp?`Dans ce triangle rectangle, les deux côtés de l’angle droit mesurent ${a} m et ${b} m. Quelle est la longueur de l’hypoténuse ?`:`Dans ce triangle rectangle, l’hypoténuse mesure ${c} m et un côté de l’angle droit mesure ${a} m. Quelle est la longueur de l’autre côté ?`,
        hint:isHyp?'Pythagore : hypoténuse² = côté 1² + côté 2². N’oublie pas la racine carrée.':'Pythagore : côté recherché² = hypoténuse² − côté connu². N’oublie pas la racine carrée.',
        explain:isHyp?`D’après Pythagore : c² = ${a}² + ${b}² = ${a*a} + ${b*b} = ${c*c}. Donc c = √${c*c} = ${c} m.`:`D’après Pythagore : b² = ${c}² − ${a}² = ${c*c} − ${a*a} = ${b*b}. Donc b = √${b*b} = ${b} m.`
      }
    })
  ];
  // Deux quartiers de la V0.2 : activités originales de calcul littéral et de fonctions affines.
  const signed=(n)=>n>=0?`+ ${n}`:`− ${Math.abs(n)}`;
  const expr=(a,b)=>{
    const first=a===0?'':a===1?'x':a===-1?'−x':`${a}x`;
    return first ? b===0?first:`${first} ${signed(b)}` : String(b);
  };
  const equationCases=[
    {a:2,b:3,d:0,x:4},{a:3,b:5,d:0,x:5},{a:4,b:-2,d:0,x:3},
    {a:5,b:7,d:0,x:2},{a:2,b:-6,d:0,x:7},{a:7,b:1,d:0,x:2},
    {a:5,b:4,d:2,x:3},{a:6,b:-2,d:3,x:4},{a:7,b:5,d:2,x:2},
    {a:4,b:-3,d:1,x:6},{a:8,b:3,d:5,x:-2},{a:6,b:-4,d:2,x:-1},
    {k:3,t:2,x:5},{k:2,t:-3,x:7},{k:4,t:-1,x:-2},{k:5,t:3,x:-1}
  ];
  function makeEquation(v,i){
    let a,b,d,e,initial,plan=[];
    if(v.k){
      a=v.k;b=v.k*v.t;d=0;e=v.k*(v.x+v.t);
      initial=`${v.k}(x ${signed(v.t)}) = ${e}`;
      plan.push({label:'Développer les parenthèses',after:`${expr(a,b)} = ${e}`,reason:`${v.k} × x + ${v.k} × (${v.t}) = ${expr(a,b)}. On distribue le facteur à chaque terme.`});
    }else{
      ({a,b,d}=v);e=(a-d)*v.x+b;
      initial=`${expr(a,b)} = ${expr(d,e)}`;
    }
    if(d!==0){
      plan.push({label:`${d>0?'Soustraire':'Ajouter'} ${Math.abs(d)}x aux deux membres`,after:`${expr(a-d,b)} = ${e}`,reason:'On élimine le terme en x du membre de droite sans changer les solutions : on applique la même opération aux deux membres.'});
    }
    if(b!==0){
      plan.push({label:`${b>0?'Soustraire':'Ajouter'} ${Math.abs(b)} aux deux membres`,after:`${expr(a-d,0)} = ${e-b}`,reason:`On isole le terme en x : ${expr(a-d,0)} = ${e} ${signed(-b)} = ${e-b}.`});
    }
    const coefficient=a-d;
    if(coefficient!==1){
      plan.push({label:`Diviser les deux membres par ${coefficient}`,after:`x = ${v.x}`,reason:`${expr(coefficient,0)} = ${e-b}, donc x = (${e-b}) ÷ (${coefficient}) = ${v.x}.`});
    }
    return {
      id:`equation-${i+1}`,station:'equation',kind:'equation',title:i===15?'Le verrou central':`Verrou ${i+1}`,
      difficulty:i<6?1:i<12?2:3,story:['La première porte résiste.','Un engrenage reste bloqué.','Les plateaux sont déséquilibrés.','Une rune indique une égalité.',
      'Le mécanisme demande plus de précision.','La lumière se diffuse à travers la salle.','Les deux côtés semblent différents.','Le noyau reconnaît le bon raisonnement.'][i%8],
      prompt:'Choisis des opérations qui préservent l’égalité, puis calcule la valeur de x pour ouvrir le verrou.',
      initial,plan,answer:v.x,unit:'',
      hint:`Commence par ${plan[0].label.toLowerCase()}. Applique toujours l’opération aux deux membres.`,
      explain:`Équation de départ : ${initial}. ${plan.map(p=>p.after).join(' → ')}. Vérifie en remplaçant x par ${v.x} dans l’égalité initiale.`
    };
  }
  const functionCases=[
    [2,1],[1,3],[-1,4],[3,-2],[-2,7],[-3,10],[2,-5],[1,-4],
    [-1,-3],[3,-6],[-2,-1],[-3,6],[4,-5],[-4,8],[2,6],[-1,8]
  ];
  function makeFunction(pair,i){
    const [a,b]=pair,x1=i%3===0?2:1,x2=i%4===0?6:5;
    const y1=a*x1+b,y2=a*x2+b;
    return {
      id:`fonction-${i+1}`,station:'fonction',kind:'function',title:i===15?'L’anneau d’arrivée':`Trajectoire ${i+1}`,
      difficulty:i<4?1:i<11?2:3,
      story:['Le drone attend sa première trajectoire.','Deux anneaux brillent au-dessus du canyon.','Le vent change de direction.','Les tours dessinent une nouvelle route.','Une balise est dissimulée dans la brume.','Le parcours se complique.'][i%6],
      prompt:`Programme une fonction affine f(x) = a × x + b pour traverser les anneaux A(${x1} ; ${y1}) et B(${x2} ; ${y2}).`,
      x1,x2,y1,y2,aTarget:a,bTarget:b,answer:a,unit:'',
      hint:`Calcule la pente : a = (${y2} − (${y1})) ÷ (${x2} − ${x1}), puis b = ${y1} − a × ${x1}.`,
      explain:`a = (${y2} − (${y1})) ÷ (${x2} − ${x1}) = ${a}. Puis b = ${y1} − ${a} × ${x1} = ${b}. La bonne fonction est f(x) = ${expr(a,b)} : elle passe par les deux anneaux.`
    };
  }
  stations.push(
    {id:'equation',number:'04',name:'L’atelier des équations',short:'Équations',icon:'scale',color:'gold',subtitle:'Équilibrer les deux côtés de la balance',
      lore:'La fabrique des nombres s’est arrêtée. Chaque porte repose sur une égalité : choisis des opérations qui conservent l’équilibre pour libérer x.',
      objective:'Résoudre une équation du premier degré en appliquant des opérations équivalentes.',
      theory:'On conserve les solutions en ajoutant ou retirant le même terme aux deux membres, puis en divisant les deux membres par un même nombre non nul. Développe les parenthèses lorsque c’est nécessaire.',
      medal:'Maître de l’équilibre',points:16},
    {id:'fonction',number:'05',name:'La piste des fonctions',short:'Fonctions',icon:'chart',color:'mint',subtitle:'Piloter un drone à travers les anneaux',
      lore:'Les routes aériennes de la cité sont brouillées. Programme la trajectoire du drone avec la pente a et la valeur initiale b. Deux balises suffisent pour déterminer une fonction affine.',
      objective:'Déterminer les paramètres d’une fonction affine à partir de deux points.',
      theory:'Une fonction affine s’écrit f(x) = ax + b. a est le coefficient directeur (variation de y pour 1 unité de x) et b est l’image de 0. Pour deux points, a = (y₂ − y₁) / (x₂ − x₁).',
      medal:'Pilote des courbes',points:16}
  );
  questions.push(...equationCases.map(makeEquation),...functionCases.map(makeFunction));

  // V0.3 — Deux quartiers supplémentaires, indépendants de la progression V0.1/V0.2.
  const fr=n=>String(n).replace('.',',');
  const superscript=n=>String(n).replace(/-/g,'⁻').replace(/0/g,'⁰').replace(/1/g,'¹').replace(/2/g,'²').replace(/3/g,'³').replace(/4/g,'⁴').replace(/5/g,'⁵').replace(/6/g,'⁶').replace(/7/g,'⁷').replace(/8/g,'⁸').replace(/9/g,'⁹');
  stations.push(
    {id:'nombres',number:'06',name:'Le laboratoire des nombres',short:'Puissances & racines',icon:'sparkle',color:'amethyst',subtitle:'Réveiller les cristaux des puissances',
     lore:'Le laboratoire conserve l’énergie de la cité dans des cristaux. Une bonne puissance active le réacteur ; une racine carrée dévoile ses facettes. Décode les nombres pour remettre le générateur en marche.',
     objective:'Calculer des puissances, des racines carrées et utiliser la notation scientifique.',
     theory:'aⁿ est le produit de n facteurs a si n est positif. Pour a ≠ 0, a⁻ⁿ = 1/aⁿ. √a est le nombre positif dont le carré vaut a. En notation scientifique, on écrit m × 10ⁿ avec 1 ≤ |m| < 10.',
     medal:'Alchimiste des nombres',points:18},
    {id:'litteral',number:'07',name:'La forge des expressions',short:'Calcul littéral',icon:'book',color:'copper',subtitle:'Fabriquer des formules pour ouvrir les portails',
     lore:'Les portails antiques reconnaissent les expressions équivalentes. Développe ou factorise les formules dans la forge pour réassembler les trois plaques du sceau.',
     objective:'Développer, réduire et factoriser des expressions littérales avec les règles de distributivité.',
     theory:'La distributivité transforme k(a + b) en ka + kb. Factoriser consiste à faire l’opération inverse, en mettant un facteur commun en évidence. Pour les doubles produits : (x + p)(x + q) = x² + (p + q)x + pq.',
     medal:'Forgeron des formules',points:18}
  );
  const powerCases=[
    [2,5],[3,4],[-2,3],[-2,4],[5,3],[10,-3]
  ];
  const powerQs=powerCases.map(([base,exponent],i)=>{
    const answer=Math.pow(base,exponent),notation=(base<0?`(${base})`:base)+superscript(exponent);
    return {id:`nombres-puissance-${i+1}`,station:'nombres',kind:'number',mode:'power',title:`Cristal des puissances ${i+1}`,
      difficulty:i<2?1:i<5?2:3,base,exponent,notation,answer,unit:'',
      story:['Le premier cristal se charge.','Multiplie plusieurs fois la même énergie.','La polarité devient négative.','Un cristal avec un exposant pair.','La réserve d’énergie grandit.','Un signal minuscule doit être décodé.'][i],
      prompt:`Quelle est la valeur exacte de ${notation} ?`,
      hint:exponent<0?'Un exposant négatif signifie l’inverse : 10⁻³ = 1/10³.':'Une puissance multiplie la base par elle-même autant de fois que l’exposant l’indique. Pour une base négative, surveille la parité de l’exposant.',
      explain:exponent<0?`${notation} = 1/${base}${superscript(-exponent)} = 1/${Math.pow(base,-exponent)} = ${fr(answer)}. L’exposant négatif donne l’inverse.`:
        `${notation} = ${Array.from({length:exponent},()=>`(${base})`).join(' × ')} = ${fr(answer)}. ${base<0?(exponent%2?'Un nombre impair de facteurs négatifs donne un produit négatif.':'Un nombre pair de facteurs négatifs donne un produit positif.'):'On multiplie exactement '+exponent+' facteurs égaux.'}`};
  });
  const rootCases=[49,81,144,225];
  const rootQs=rootCases.map((radicand,i)=>({
    id:`nombres-racine-${i+1}`,station:'nombres',kind:'number',mode:'root',title:`Dalle carrée ${i+1}`,
    difficulty:i<2?1:2,radicand,answer:Math.sqrt(radicand),unit:'',
    story:'Pour former une dalle carrée, retrouve la longueur de son côté.',
    prompt:`Une dalle carrée a une aire de ${radicand} unités². Combien mesure exactement son côté ?`,
    hint:'L’aire d’un carré est côté × côté. Cherche le nombre positif dont le carré vaut '+radicand+'.',
    explain:`Le côté recherché vaut √${radicand}. Or ${Math.sqrt(radicand)} × ${Math.sqrt(radicand)} = ${radicand}, donc √${radicand} = ${Math.sqrt(radicand)} unités.`
  }));
  const simplifiedCases=[[72,6,2],[50,5,2],[75,5,3],[98,7,2]];
  const simplifyQs=simplifiedCases.map(([radicand,factor,remaining],i)=>({
    id:`nombres-simplifier-${i+1}`,station:'nombres',kind:'number',mode:'simplify',title:`Prisme radical ${i+1}`,
    difficulty:i<2?2:3,radicand,factor,remaining,answer:factor,unit:'',
    story:'Le cristal contient un carré parfait qu’il faut faire sortir de la racine.',
    prompt:`Complète √${radicand} = ?√${remaining}. Quel nombre entier remplace le point d’interrogation ?`,
    hint:`Cherche un carré parfait multiplié par ${remaining} : ${radicand} = k² × ${remaining}. Puis √(k² × ${remaining}) = k√${remaining}, avec k positif.`,
    explain:`${radicand} = ${factor*factor} × ${remaining} = ${factor}² × ${remaining}. Donc √${radicand} = √(${factor}² × ${remaining}) = ${factor}√${remaining}. La valeur cherchée est ${factor}.`
  }));
  const scienceCases=[
    [0.00042,4.2,-4],[560000,5.6,5],[0.0078,7.8,-3],[92100000,9.21,7]
  ];
  const scienceQs=scienceCases.map(([value,mantissa,exponent],i)=>({
    id:`nombres-science-${i+1}`,station:'nombres',kind:'number',mode:'scientific',title:`Signal cosmique ${i+1}`,
    difficulty:i<2?2:3,value,mantissa,exponent,answer:value,unit:'',
    story:'Le terminal reçoit un nombre trop grand ou trop petit pour son affichage classique.',
    prompt:`Réécris ${fr(value)} en notation scientifique : m × 10ⁿ, avec 1 ≤ m < 10.`,
    hint:'Déplace la virgule pour obtenir un nombre entre 1 et 10. Si tu déplaces la virgule vers la droite, l’exposant est négatif ; vers la gauche, il est positif.',
    explain:`${fr(value)} = ${fr(mantissa)} × 10${superscript(exponent)}. Le nombre ${fr(mantissa)} est compris entre 1 et 10 et l’exposant ${exponent} compense le déplacement de la virgule.`
  }));
  const distributeCases=[[3,1,4],[2,2,-3],[-2,1,5],[5,1,-2],[-3,2,-1],[4,-1,3]];
  const distributeQs=distributeCases.map(([k,a,b],i)=>({
    id:`litteral-distribuer-${i+1}`,station:'litteral',kind:'algebra',mode:'expand',title:`Forge des produits ${i+1}`,
    difficulty:i<2?1:i<4?2:3,k,a,b,ax:k*a,constant:k*b,unit:'',
    starting:`${k}(${expr(a,b)})`,story:'La première plaque doit être développée avant d’entrer dans le mécanisme.',
    prompt:`Développe et réduis ${k}(${expr(a,b)}) sous la forme Ax + B. Entre les coefficients A et B.`,
    hint:'Distribue le facteur extérieur aux DEUX termes : k(ax + b) = kax + kb. Attention aux signes.',
    explain:`On multiplie chaque terme de la parenthèse par ${k} : ${k} × (${expr(a,0)}) = ${k*a}x et ${k} × (${b}) = ${k*b}. Résultat : ${expr(k*a,k*b)}.`
  }));
  const factorCases=[[6,9],[8,12],[10,-15],[12,18],[-14,21],[15,-25]];
  const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
  const factorQs=factorCases.map(([A,B],i)=>{
    const factor=gcd(A,B),insideA=A/factor,insideB=B/factor;
    return {id:`litteral-factoriser-${i+1}`,station:'litteral',kind:'algebra',mode:'factor',title:`Sceau commun ${i+1}`,
      difficulty:i<2?1:i<4?2:3,A,B,factor,insideA,insideB,unit:'',
      starting:expr(A,B),story:'La forge distingue une structure commune dans les deux termes.',
      prompt:`Factorise ${expr(A,B)} en utilisant le plus grand facteur entier positif commun, sous la forme g(ux + v). Entre g, u et v.`,
      hint:'Cherche le plus grand diviseur commun des deux coefficients. Divise ensuite les deux termes par ce nombre.',
      explain:`Le plus grand diviseur commun de ${Math.abs(A)} et ${Math.abs(B)} est ${factor}. On écrit donc ${expr(A,B)} = ${factor}(${expr(insideA,insideB)}). En développant, on retrouve bien l’expression initiale.`};
  });
  const doubleCases=[[2,3],[1,-4],[-2,-5],[3,-1],[3,-3],[5,-2]];
  const doubleQs=doubleCases.map(([p,q],i)=>({
    id:`litteral-double-${i+1}`,station:'litteral',kind:'algebra',mode:'double',title:`Quatre plaques ${i+1}`,
    difficulty:i<2?2:3,p,q,linear:p+q,constant:p*q,unit:'',
    starting:`(x ${signed(p)})(x ${signed(q)})`,story:'Les quatre pièces du portail doivent être réunies en une seule expression.',
    prompt:`Développe (x ${signed(p)})(x ${signed(q)}) sous la forme x² + Bx + C. Entre B et C (avec leur signe).`,
    hint:'Multiplie chaque terme de la première parenthèse par chaque terme de la seconde, puis regroupe les deux termes en x.',
    explain:`On obtient x × x = x², puis ${p}x et ${q}x, et enfin (${p}) × (${q}) = ${p*q}. En regroupant : x² ${signed(p+q)}x ${signed(p*q)}. B = ${p+q} et C = ${p*q}.`
  }));
  questions.push(...powerQs,...rootQs,...simplifyQs,...scienceQs,...distributeQs,...factorQs,...doubleQs);

  // V0.4 — laboratoire des donnees et experiences de hasard : un resultat
  // theorique exact, une simulation aleatoire qui ne determine jamais la note.
  stations.push(
    {id:'statistiques',number:'08',name:'L’observatoire des données',short:'Statistiques',icon:'chart',color:'teal',subtitle:'Enquêter avec les relevés de la cité',
      lore:'Une panne a mélangé les registres de l’observatoire. Reconstitue les graphiques, retrouve les valeurs centrales et découvre les informations cachées dans les mesures.',
      objective:'Interpréter des séries et calculer effectifs, moyenne, médiane et étendue.',
      theory:'Pour lire une série, on peut comparer des effectifs, calculer la moyenne (somme des valeurs divisée par leur nombre), déterminer la médiane après classement des données, ou l’étendue (maximum − minimum). Une valeur aberrante peut modifier fortement la moyenne.',
      medal:'Détective des données',points:16},
    {id:'hasard',number:'09',name:'La station des probabilités',short:'Probabilités',icon:'hexagon',color:'pink',subtitle:'Tester le hasard et comprendre les chances',
      lore:'La station des chances alimente les portails de la cité. Lance les machines, observe les fréquences puis retrouve les probabilités exactes : une expérience ne garantit jamais le résultat attendu.',
      objective:'Calculer une probabilité dans une situation d’équiprobabilité et comparer fréquences observées et probabilités théoriques.',
      theory:'Dans une expérience où toutes les issues élémentaires sont équiprobables, P(A) = nombre d’issues favorables / nombre total d’issues. Une fréquence expérimentale peut s’en approcher avec de nombreux essais, mais varie d’une série à l’autre. Deux tirages avec remise sont indépendants : on multiplie les probabilités.',
      medal:'Explorateur du hasard',points:18}
  );
  // Pour reconstruire les barres, le journal conserve toutes les observations.
  // Leur ordre est melange de maniere deterministe pour la lecture pedagogique.
  function shuffleLog(items,seed){
    const result=items.slice();let state=seed*117+13;
    for(let i=result.length-1;i>0;i--){state=(state*1103515245+12345) & 0x7fffffff;const j=state%(i+1);const t=result[i];result[i]=result[j];result[j]=t;}
    return result;
  }
  const chartCases=[
    {names:['Nord','Sud','Est','Ouest'],counts:[5,7,4,6],targetIndex:1,story:'Une panne a effacé une colonne du suivi des navettes.'},
    {names:['Lune','Soleil','Comète','Étoile'],counts:[4,3,8,5],targetIndex:2,story:'Les chercheurs ont classé chaque observation du ciel.'},
    {names:['Rouge','Bleu','Or','Vert'],counts:[6,9,4,5],targetIndex:0,story:'Le registre des cristaux contient les couleurs de chaque échantillon.'},
    {names:['Alpha','Bêta','Gamma','Delta'],counts:[11,7,5,8],targetIndex:3,story:'Le dernier relevé regroupe les visiteurs de quatre secteurs.'}
  ];
  const statisticChart=chartCases.map((v,i)=>{
    const observations=shuffleLog(v.names.reduce((all,name,j)=>all.concat(Array(v.counts[j]).fill(name)),[]),i+1);
    const answer=v.counts[v.targetIndex];
    return {id:`stats-barre-${i+1}`,station:'statistiques',kind:'statistics',mode:'bar',title:`Archive effacée ${i+1}`,
      difficulty:i<2?1:i===2?2:3,story:v.story,labels:v.names,counts:v.counts,targetIndex:v.targetIndex,observations,answer,unit:'observations',maxBar:14,
      prompt:`Compte dans le journal combien de fois apparaît « ${v.names[v.targetIndex]} », puis règle la barre manquante sur le diagramme.`,
      hint:`Lis le journal d’observation et fais un bâton de comptage à chaque « ${v.names[v.targetIndex]} ». Le diagramme montre les autres catégories, pas la barre recherchée.`,
      explain:`Dans les ${observations.length} observations, « ${v.names[v.targetIndex]} » apparaît exactement ${answer} fois. L’effectif est ${answer} ; la hauteur de sa barre est donc ${answer}. La somme des effectifs des quatre catégories vaut ${observations.length}.`};
  });
  const meanCases=[
    [6,8,10,12],[5,7,6,10,12],[4,7,7,8,9,10],[13,15,10,12,16,18]
  ];
  const meanQs=meanCases.map((data,i)=>{
    const sum=data.reduce((a,b)=>a+b,0),answer=sum/data.length;
    return {id:`stats-moyenne-${i+1}`,station:'statistiques',kind:'statistics',mode:'mean',title:`Indice moyen ${i+1}`,
      difficulty:i<2?1:2,story:'Le tableau des sondes est revenu, mais leur mesure moyenne a disparu.',data,answer,unit:'unités',
      prompt:`Les ${data.length} sondes affichent ${data.join(' ; ')}. Quelle est la moyenne exacte de ces valeurs ?`,
      hint:`Additionne toutes les mesures, puis divise la somme par le nombre de mesures (${data.length}). Une moyenne peut avoir une partie décimale.`,
      explain:`La somme vaut ${data.join(' + ')} = ${sum}. Comme il y a ${data.length} mesures, la moyenne vaut ${sum} ÷ ${data.length} = ${fr(answer)}. La moyenne peut ne correspondre à aucune mesure prise individuellement.`};
  });
  const medianCases=[
    [10,4,7,8,5],[11,8,5,14,6,9],[3,9,2,6,5,8,7],[14,8,17,12,19,10,20,16]
  ];
  const medianQs=medianCases.map((data,i)=>{
    const sorted=data.slice().sort((a,b)=>a-b),n=sorted.length;
    const left=sorted[Math.floor((n-1)/2)],right=sorted[Math.floor(n/2)],answer=(left+right)/2;
    return {id:`stats-mediane-${i+1}`,station:'statistiques',kind:'statistics',mode:'median',title:`Dossier central ${i+1}`,
      difficulty:i<1?1:i<3?2:3,story:'Les archives sont désordonnées. Classe les valeurs pour trouver leur centre.',data,answer,unit:'unités',
      prompt:`Quelle est la médiane de cette série de ${n} mesures ? Utilise le bouton « Classer les données » pour repérer les cases centrales.`,
      hint:n%2?`Classe les ${n} valeurs du plus petit au plus grand et prends la ${Math.ceil(n/2)}e, au milieu.`:
        `Classe les ${n} valeurs par ordre croissant. Comme l’effectif est pair, calcule la moyenne des deux valeurs centrales.`,
      explain:`Dans l’ordre croissant : ${sorted.join(' ; ')}. ${n%2?`La valeur au milieu est ${left}.`:`Les deux valeurs centrales sont ${left} et ${right} ; leur moyenne est (${left} + ${right}) ÷ 2 = ${fr(answer)}.`} La médiane partage la série ordonnée en deux groupes de même effectif (ou presque).`};
  });
  const rangeCases=[
    [13,21,18,16,25],[7,2,10,9,1,6],[15,20,12,25,18,28],[40,32,49,36,50,44]
  ];
  const rangeQs=rangeCases.map((data,i)=>{
    const smallest=Math.min(...data),largest=Math.max(...data),answer=largest-smallest;
    return {id:`stats-etendue-${i+1}`,station:'statistiques',kind:'statistics',mode:'range',title:`Amplitude des signaux ${i+1}`,
      difficulty:i<2?1:i===2?2:3,story:'Les variations de la station doivent être estimées avant de redémarrer les capteurs.',data,answer,unit:'unités',
      prompt:`Quelle est l’étendue de la série ${data.join(' ; ')} ? Repère les extrêmes puis calcule leur différence.`,
      hint:'L’étendue mesure l’écart entre la plus grande et la plus petite valeur : maximum − minimum. Utilise « Repérer les extrêmes » si besoin.',
      explain:`La plus petite mesure est ${smallest} et la plus grande est ${largest}. L’étendue vaut donc ${largest} − ${smallest} = ${answer}. C’est l’amplitude des mesures, pas leur moyenne.`};
  });
  questions.push(...statisticChart,...meanQs,...medianQs,...rangeQs);

  const colors=['bleu','rouge','or'];
  function urnPool(counts){return counts.reduce((all,n,i)=>all.concat(Array(n).fill(colors[i])),[]);}
  function makeChance(spec){
    const outcomes=spec.pool,den=spec.mode==='two'?outcomes.length*outcomes.length:outcomes.length;
    const successes=spec.mode==='two'?
      outcomes.filter(x=>x===spec.first).length*outcomes.filter(x=>x===spec.second).length:
      outcomes.filter(x=>spec.mode==='die'?spec.favorable.indexOf(x)!==-1:x===spec.target).length;
    const result=Object.assign({station:'hasard',kind:'probability',unit:'',numerator:successes,denominator:den,answer:successes/den},spec);
    const countText=spec.mode==='two'?`${outcomes.filter(x=>x===spec.first).length} possibilités pour le premier tirage et ${outcomes.filter(x=>x===spec.second).length} pour le second, sur ${outcomes.length} possibilités à chaque fois.`:`${successes} issues favorables sur ${den} issues équiprobables.`;
    result.hint=spec.mode==='two'?`Les deux tirages se font avec remise : les chances restent identiques. Multiplie la chance du premier par celle du second. Compte les boules à chaque fois.`:
      'Toutes les issues élémentaires sont équiprobables. Compte celles qui réalisent l’événement demandé, puis le nombre total ; écris la fraction favorable/total.';
    result.explain=spec.mode==='two'?`Avec remise, les tirages sont indépendants : P = (${outcomes.filter(x=>x===spec.first).length}/${outcomes.length}) × (${outcomes.filter(x=>x===spec.second).length}/${outcomes.length}) = ${successes}/${den}. ${countText} Une simulation peut donner des fréquences différentes.`:
      `On compte ${successes} issue${successes>1?'s':''} favorable${successes>1?'s':''} parmi ${den} issues équiprobables. Donc P = ${successes}/${den}. Une simulation de tirages donne une fréquence qui varie autour de cette probabilité, sans garantie sur un petit échantillon.`;
    return result;
  }
  const urnCases=[
    {counts:[3,2,1],target:'bleu'}, {counts:[2,5,1],target:'or'},
    {counts:[4,3,2],target:'rouge'}, {counts:[6,2,4],target:'or'},
    {counts:[1,4,5],target:'bleu'}, {counts:[5,5,2],target:'rouge'}
  ];
  const urnQs=urnCases.map((v,i)=>makeChance({
    id:`proba-urne-${i+1}`,mode:'urn',title:`Urne des cristaux ${i+1}`,difficulty:i<2?1:i<4?2:3,
    story:'La chambre du hasard mélange des cristaux de trois couleurs. Une seule boule est tirée au hasard.',
    pool:urnPool(v.counts),target:v.target,
    prompt:`Il y a ${v.counts[0]} boules bleues, ${v.counts[1]} rouges et ${v.counts[2]} dorées. Quelle est la probabilité de tirer une boule ${v.target==='or'?'dorée':v.target} ? Écris une fraction.`
  }));
  const dieCases=[
    {faces:[2,4,6],event:'obtenir un nombre pair'},
    {faces:[1],event:'obtenir exactement 1'},
    {faces:[1,2,3,4,5],event:'ne pas obtenir 6'},
    {faces:[3,6],event:'obtenir un multiple de 3'}
  ];
  const dieQs=dieCases.map((v,i)=>makeChance({
    id:`proba-de-${i+1}`,mode:'die',title:`Dé orbital ${i+1}`,difficulty:i<1?1:i<3?2:3,
    story:'Le dé orbital possède six faces numérotées de 1 à 6, toutes aussi probables.',
    pool:[1,2,3,4,5,6],favorable:v.faces,event:v.event,
    prompt:`On lance un dé équilibré à six faces. Quelle est la probabilité pour l’événement « ${v.event} » ? Écris une fraction.`
  }));
  const wheelCases=[
    {pool:['bleu','rouge','bleu','or','bleu','rouge','or','bleu'],target:'bleu'},
    {pool:['or','rouge','bleu','rouge','or','rouge','bleu','rouge'],target:'or'},
    {pool:['bleu','bleu','or','rouge','bleu','or','or','rouge'],target:'rouge'},
    {pool:['bleu','rouge','bleu','rouge','bleu','rouge','or','rouge'],target:'or'}
  ];
  const wheelQs=wheelCases.map((v,i)=>makeChance({
    id:`proba-roue-${i+1}`,mode:'wheel',title:`Roue du hasard ${i+1}`,difficulty:i<2?2:3,
    story:'La roue tourne librement. Ses huit secteurs ont exactement la même taille : compare la théorie aux tirages.',
    pool:v.pool,target:v.target,requiresSimulation:true,
    prompt:`Fais tourner la roue au moins 10 fois. Puis calcule la probabilité théorique de tomber sur un secteur ${v.target==='or'?'doré':v.target} (et non la fréquence de tes essais).`
  }));
  const doubleChanceCases=[
    {counts:[2,1,0],first:'bleu',second:'bleu'},
    {counts:[3,2,0],first:'bleu',second:'rouge'},
    {counts:[2,2,1],first:'or',second:'bleu'},
    {counts:[1,3,2],first:'rouge',second:'rouge'}
  ];
  const doubleChanceQs=doubleChanceCases.map((v,i)=>makeChance({
    id:`proba-double-${i+1}`,mode:'two',title:`Double portail ${i+1}`,difficulty:i<1?2:3,
    story:'Deux tirages consécutifs avec remise déclenchent le portail. Chaque boule tirée est replacée dans l’urne avant le tirage suivant.',
    pool:urnPool(v.counts),first:v.first,second:v.second,
    prompt:`Dans l’urne : ${v.counts[0]} bleue(s), ${v.counts[1]} rouge(s), ${v.counts[2]} dorée(s). On tire une boule, on la remet puis on tire encore. Quelle est la probabilité de tirer ${v.first} puis ${v.second} ?`
  }));
  questions.push(...urnQs,...dieQs,...wheelQs,...doubleChanceQs);

  const secrets = [
    {id:'jardin',name:'Feuille d’azur',label:'Le Jardin suspendu',detail:'Une feuille métallique gravée d’un triangle. Les botanistes de la cité observaient les mêmes proportions dans les plantes.'},
    {id:'passage',name:'Fragment d’étoile',label:'Le Passage des brumes',detail:'Une poussière scintillante provenant du vieux ciel artificiel de la cité.'},
    {id:'archive',name:'Clé des archives',label:'La Galerie oubliée',detail:'Cette clé permettra peut-être d’ouvrir une nouvelle zone dans une prochaine version.'}
  ];
  root.MathShiftContent={stations,questions,secrets,version:'0.4.0'};
})(typeof window!=='undefined'?window:globalThis);
