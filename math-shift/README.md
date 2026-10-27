# MATH SHIFT — La cité des anomalies (V0.2.0)

**ELC Éducation** · Jeu gratuit de mathématiques pour la classe de 3e (France, année scolaire 2026-2027), sans compte, publicité, collecte ni backend.

**Jouer :** <https://estebancaballeroai.github.io/elc-education/math-shift/>

## Le contenu de la V0.2

52 défis originaux répartis en cinq stations jouables :

| Station | Contenu et mécaniques | Défis |
|---|---|---:|
| Pont des géomètres | Thalès, pont à ajuster | 7 |
| Tour des rayons | Trigonométrie, laser à orienter | 7 |
| Cœur du réacteur | Pythagore, calcul d'une longueur | 6 |
| Atelier des équations | Equations du premier degré : choisir les opérations **sur les deux membres**, puis trouver x | 16 |
| Piste des fonctions | Fonctions affines : régler **a** et **b** pour faire traverser deux balises à un drone | 16 |

- Indices contextualisés et corrections mathématiques après les erreurs ; les défis peuvent être passés et repris.
- Cartes et parcours, médailles, XP comptés une fois par défi, statistiques et révisions.
- Exploration libre : **3 parcours narratifs de 3 étapes**, deux choix par étape, sans question scolaire, avec trésors persistants.
- 4 nouveaux assets graphiques WebP (atelier, pistes aériennes, cité, drone) réellement utilisés ; sprites et scènes de V0.1 conservés.
- Compatibilité avec les anciennes sauvegardes de la V0.1 : même clé `elc-mathshift-save-v1`, nouveaux défis initialement non réussis.

## Démarrage / publication GitHub Pages

Aucune installation, dépendance NPM ni compilation. Déposer le dossier `math-shift/` sur GitHub Pages, `index.html` à sa racine. Après première visite sous HTTPS, le service worker permet de jouer hors ligne avec les ressources installées, sous réserve des capacités et réglages du navigateur. Si l'utilisateur vide les données du navigateur, la sauvegarde locale peut disparaître : un export/import JSON est disponible.

Les images et scripts ne font aucune requête vers un service externe. Le programme utilise les éléments HTML, CSS, JavaScript et SVG natifs et peut être ouvert sans connexion directement en `file://` (hors service worker).

### Structure

```
math-shift/
├── index.html
├── styles.css
├── app.js
├── content.js
├── engine.js
├── manifest.webmanifest
├── sw.js
├── assets/
│   ├── observatoire.webp
│   ├── mission.webp
│   ├── explorateur.webp
│   ├── nox.webp
│   ├── equations.webp      # V0.2
│   ├── fonctions.webp       # V0.2
│   ├── cite.webp            # V0.2
│   ├── drone.webp           # V0.2
│   ├── icon-192.png
│   └── icon-512.png
└── tests/
    ├── logic-v02.test.cjs
    └── v02_smoke.py
```

## Tests

- Logique : `node tests/logic-v02.test.cjs`.
- Navigation et interactions : `python3 tests/v02_smoke.py` (requiert Python, Playwright, Chromium, uniquement pour la validation ; non nécessaire aux joueurs).
- Vérifier le comportement du navigateur en l'absence de stockage, et après avoir importé une sauvegarde V0.1.
- Valider les 5 stations et les 3 expéditions, la console JavaScript, les images locales, l'absence de débordement horizontal, la lisibilité mobile et la gestion des erreurs.
- Tests en vrai sur une ancienne tablette Android recommandés avant élargissement de la diffusion ; les navigateurs très anciens peuvent ne pas supporter toutes les fonctions de PWA.

## Références pédagogiques

Le contenu s'appuie sur les attendus de fin de 3e applicables à la rentrée 2026 : <https://eduscol.education.fr/document/14068/download>. Le programme du cycle 4 publié le 5 mars 2026 n'entre en application en 3e qu'à la rentrée 2028.

## Sécurité, propriété et prochaines étapes

- Sauvegarde locale avec contrôles d'entrée ; pas de données personnelles collectées.
- Aucun compte ni publicité. Les récompenses sont entièrement gratuites.
- Les images ont été créées pour ce jeu avec ImageGen ; le SVG sert aux **schémas mathématiques interactifs**, non à remplacer les décors.
- Les versions antérieures restent sauvegardées dans les branches GitHub `backup/pre-math-shift-*`; développement sur `feature/math-shift-*` avant validation et fusion.
- V0.3 envisagée : calcul littéral et factorisation, nombres et puissances, progression adaptative par compétences, nouvelles zones explorable et nouveaux sprites animés.

**Périmètre V0.2 :** exploration et première consolidation de cinq notions. Le jeu ne couvre pas encore tout le programme de mathématiques de 3e ni l'intégralité de l'entraînement au brevet.
