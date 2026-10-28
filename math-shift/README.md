# MATH SHIFT — La Cité des anomalies (V0.4.0)

**ELC Éducation · Jeu gratuit de mathématiques pour les élèves de 3e en France.**

**Jouer :** https://estebancaballeroai.github.io/elc-education/math-shift/

Jeu éducatif mobile-first, sans publicité, inscription, serveur, collecte de données personnelles ni achat intégré. Progression et récompenses conservées dans le navigateur, export/import JSON possible. Compatible GitHub Pages ; fonctionnement hors ligne après premier chargement HTTPS **sous réserve des possibilités du navigateur**.

## Neuf quartiers — 122 défis

| Station | Apprentissage / mécanique | Défis |
|---|---|---:|
| Pont des géomètres | Thalès : reconstruire un pont | 7 |
| Tour des rayons | Trigonométrie : aligner un laser | 7 |
| Cœur du réacteur | Pythagore : réparer des circuits | 6 |
| Atelier des équations | Équations du 1er degré, balance étape par étape | 16 |
| Piste des fonctions | Fonctions affines, trajectoire de drone | 16 |
| Laboratoire des nombres | Puissances, racines, notation scientifique | 18 |
| Forge des expressions | Développer, factoriser, double distributivité | 18 |
| **Observatoire des données — NOUVEAU** | Diagramme en barres à reconstruire, moyenne, médiane, étendue | **16** |
| **Station des probabilités — NOUVEAU** | Urnes, dés, roues, tirages avec remise ; simulateur aléatoire | **18** |

**34 nouveaux défis**, soit **122 exercices au total**. Les 88 précédents ont conservé **leurs identifiants, questions, réponses, indices et corrections** (comparaison automatisée avec le snapshot V0.3).

## Comment fonctionnent les deux nouveaux quartiers ?

### Statistiques : enquêter sur les données

- **Effectifs (4 défis) :** un journal d'observations est présenté. On compte les occurrences et reconstitue une barre manquante en actionnant un curseur ou en entrant sa hauteur. La barre se redessine en temps réel.
- **Moyennes (4) :** interpréter un relevé de sondes et déplacer une ligne de moyenne proposée sur le graphique en tapant sa valeur.
- **Médianes (4) :** trier les valeurs, repérer les valeurs centrales, puis calculer la médiane (effectif pair ou impair).
- **Étendues (4) :** mettre en évidence les valeurs extrêmes et soustraire maximum − minimum.

### Probabilités : distinguer hasard et calcul

- **Urnes (6 défis) :** reconnaître les issues équiprobables et calculer les chances d'une couleur.
- **Dés (4) :** calculer la probabilité d'un événement sur un dé équilibré à 6 faces.
- **Roues (4) :** faire au moins 10 simulations réelles avant de donner la probabilité théorique, indépendante des résultats observés.
- **Deux tirages avec remise (4) :** représenter deux tirages indépendants et multiplier les probabilités.

Les boutons **« Simuler 10 tirages »** et **« Simuler 100 tirages »** génèrent des issues aléatoires avec JavaScript `Math.random()`. Le nombre d'essais et la fréquence empirique sont affichés ; ils **ne conditionnent pas la réussite** (hormis l'observation préalable de 10 tirages sur les roues). La réponse finale est une **fraction exacte**, y compris sous une forme équivalente (2/6 = 1/3).

## Interface et graphismes

Deux nouveaux décors 1280×720 WebP réalisés avec ImageGen puis optimisés : `assets/statistiques.webp` et `assets/hasard.webp`, utilisés réellement dans les cartes, bannières et scènes interactives. Les graphiques CSS/SVG servent à la **manipulation mathématique** et ne remplacent pas les décors illustrés. Interface responsive à partir de 320 px, commandes accessibles au toucher, sans dépendance distante.

## Installation et publication

1. Copier ce dossier tel quel dans `elc-education/math-shift/` (le dépôt est déjà organisé ainsi).
2. GitHub Pages sert `index.html` à l'adresse ci-dessus.
3. Si une ancienne version apparaît, actualiser la page : le service worker doit mettre à jour le cache `math-shift-v0.4.0`.

Arborescence principale :

```text
math-shift/
├── index.html
├── styles.css + v03.css + v04.css
├── content.js                 # 122 défis
├── engine.js                  # validation exacte, sauvegarde historique
├── app.js                     # scènes et commandes du jeu
├── sw.js / manifest.webmanifest
├── assets/
│   ├── statistiques.webp      # nouvel artwork original
│   ├── hasard.webp            # nouvel artwork original
│   └── ...                    # tous les autres artworks préservés
└── tests/
    ├── logic-v02.test.cjs
    ├── logic-v03.test.cjs
    ├── logic-v04.test.cjs
    ├── legacy-v03.json
    └── browser-v04-smoke.py
```

### Vérification

```bash
node tests/logic-v02.test.cjs
node tests/logic-v03.test.cjs
node tests/logic-v04.test.cjs
MATHSHIFT_VIEWPORTS=320,390,768,1280 python tests/browser-v04-smoke.py
```

Le script navigateur injecte le HTML/CSS/JS localement pour contourner les restrictions réseau de l'environnement de test ; **il ne constitue pas un test de GitHub Pages en production**. Les captures vérifient le jeu et ses interactions ; les artworks sont inspectés séparément. Sur ancienne tablette Android, vérifier la persistance de la sauvegarde, le service worker, le tactile et la mémoire disponible.

## Références pédagogiques

- [Éduscol : attendus de fin de 3e en vigueur en 2026–2027](https://eduscol.education.fr/document/14068/download) — lire et représenter des données, effectifs et fréquences, étendue, médiane et calcul des probabilités.
- [BO du 5 mars 2026 — nouveau cycle 4](https://www.education.gouv.fr/bo/2026/Hebdo10/MENE2602912A) : le nouveau programme s'appliquera en **3e à compter de la rentrée 2028**, pas en 2026.

Les problèmes sont originaux : ce jeu est un outil de soutien, pas un remplacement du cours ni des sujets complets du brevet. D'autres aspects (programmation, transformations du plan, données groupées, probabilités plus élaborées, entraînement brevet) restent à développer.

## Versions et confidentialité

- Sauvegarde locale historique `elc-mathshift-save-v1` conservée ; aucun changement de format.
- Les 88 anciens défis sont immuables ; les 34 nouveaux ont des identifiants indépendants.
- Sauvegarde GitHub avant V0.4 dans `backup/pre-math-shift-v0.4-20261028`, développement dans `feature/math-shift-v0.4`, fusion uniquement après tests.
- Aucun fichier extérieur au dossier `math-shift` n'est modifié.
