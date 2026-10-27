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
  const secrets = [
    {id:'jardin',name:'Feuille d’azur',label:'Le Jardin suspendu',detail:'Une feuille métallique gravée d’un triangle. Les botanistes de la cité observaient les mêmes proportions dans les plantes.'},
    {id:'passage',name:'Fragment d’étoile',label:'Le Passage des brumes',detail:'Une poussière scintillante provenant du vieux ciel artificiel de la cité.'},
    {id:'archive',name:'Clé des archives',label:'La Galerie oubliée',detail:'Cette clé permettra peut-être d’ouvrir une nouvelle zone dans une prochaine version.'}
  ];
  root.MathShiftContent={stations,questions,secrets,version:'0.1.0'};
})(typeof window!=='undefined'?window:globalThis);
