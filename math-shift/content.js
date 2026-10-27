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

  const secrets = [
    {id:'jardin',name:'Feuille d’azur',label:'Le Jardin suspendu',detail:'Une feuille métallique gravée d’un triangle. Les botanistes de la cité observaient les mêmes proportions dans les plantes.'},
    {id:'passage',name:'Fragment d’étoile',label:'Le Passage des brumes',detail:'Une poussière scintillante provenant du vieux ciel artificiel de la cité.'},
    {id:'archive',name:'Clé des archives',label:'La Galerie oubliée',detail:'Cette clé permettra peut-être d’ouvrir une nouvelle zone dans une prochaine version.'}
  ];
  root.MathShiftContent={stations,questions,secrets,version:'0.2.0'};
})(typeof window!=='undefined'?window:globalThis);
