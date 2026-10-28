# MATH SHIFT — La Cité des anomalies (V0.3.0)

**ELC Éducation · Jeu gratuit de mathématiques pour la classe de 3e (France)**

Jouer : **https://estebancaballeroai.github.io/elc-education/math-shift/**

Aventure mathématique mobile-first sans publicité, compte obligatoire, suivi publicitaire ni connexion à un serveur. Les progrès sont enregistrés dans le navigateur et peuvent être exportés/importés en JSON.

## Sept quartiers — 88 défis jouables

| Quartier | Mécanique | Défis |
|---|---|---:|
| Pont des géomètres | Théorème de Thalès, passerelle mobile | 7 |
| Tour des rayons | Trigonométrie, orienter un laser | 7 |
| Cœur du réacteur | Théorème de Pythagore, reconstruire un circuit | 6 |
| Atelier des équations | Résolution étape par étape, balance | 16 |
| Piste des fonctions | Fonctions affines, piloter un drone avec a et b | 16 |
| **Laboratoire des nombres (V0.3)** | 6 puissances, 4 racines carrées, 4 racines simplifiées, 4 écritures scientifiques | **18** |
| **Forge des expressions (V0.3)** | 6 développements simples, 6 factorisations par PGCD, 6 doubles distributivités | **18** |

Les **52 exercices de V0.2 sont conservés avec leurs identifiants et leurs réponses**. Deux nouveaux emblèmes s'ajoutent aux cinq précédents. Il existe aussi trois explorations narratives libres, sans questions scolaires, avec trois trésors à collectionner.

### Une mécanique qui sert les apprentissages

- **Nombres :** les cristaux visualisent les facteurs d'une puissance ; les dalles quadrillées expliquent la racine carrée ; les prismes permettent de simplifier √72 en 6√2 ; le terminal scientifique vérifie séparément la mantisse et l'exposant.
- **Expressions :** avant de résoudre, l'élève doit choisir une transformation correcte, puis composer des coefficients sur une forge qui réagit à ses saisies. La factorisation impose ici explicitement le **plus grand facteur entier positif commun**, afin que la correction soit non ambiguë.
- **Erreurs :** premier essai → indice ; essais ultérieurs → démarche explicative. Une question peut être passée et retrouvée dans « Réviser ».
- **Progression :** un succès est récompensé une seule fois ; les anciennes réussites V0.1 et V0.2 sont reprises automatiquement grâce à la clé locale historique `elc-mathshift-save-v1`.

## Démarrer

Ouvrir `index.html` dans un navigateur moderne ou publier le dossier `math-shift/` tel quel sur GitHub Pages. Aucune installation, compilation ni API n'est requise.

Après le premier chargement HTTPS, le service worker met en cache l'interface, les scripts, les images et les exercices. Hors ligne, la disponibilité dépend de la prise en charge du navigateur et du maintien du cache.

### Arborescence

```text
math-shift/
├── index.html
├── styles.css                 # feuilles historiques V0.1-V0.2
├── v03.css                   # nouveaux quartiers
├── content.js                # 88 défis, explications et progression pédagogique
├── engine.js                 # calcul et validation, sauvegarde V0.1/V0.2
├── app.js                    # application interactive
├── sw.js                     # cache offline V0.3.0
├── manifest.webmanifest
├── assets/
│   ├── nombres.webp          # nouvelle scène ImageGen, laboratoire
│   ├── litteral.webp         # nouvelle scène ImageGen, forge
│   ├── ...                   # décors et personnages précédents, préservés
└── tests/
    ├── logic-v02.test.cjs    # non-régression sur 52 anciens défis
    ├── logic-v03.test.cjs    # validation exhaustive 88 défis
    ├── browser-v03-smoke.py  # tests d'interaction mobile/desktop
    └── visual-v03.py         # test visuel avec vraies ressources
```

Les scènes ont été produites à partir d'illustrations originales ImageGen, puis recadrées et optimisées en WebP. Les composants CSS et SVG des mécanismes servent aux **manipulations mathématiques**, pas à substituer des décors illustrés.

## Tester

```bash
node tests/logic-v02.test.cjs
node tests/logic-v03.test.cjs
# Avec Python, Playwright et Chromium :
python tests/browser-v03-smoke.py
for size in 320 390 768 1280; do MATHSHIFT_VIEWPORTS=$size SKIP_SCENARIOS=1 python tests/browser-v03-smoke.py; done
python tests/visual-v03.py
```

Les scripts Playwright utilisent un chargement du document en mémoire : la navigation vers `localhost` et `file:` est désactivée dans l'environnement de validation utilisé. Les captures et contrôles portent donc sur le **même HTML/JS/CSS et les mêmes fichiers images**, mais pas sur le service GitHub Pages lui-même.

## Références et limites

Contenu aligné sur les **attendus de fin de 3e applicables en 2026-2027** : <https://eduscol.education.fr/document/14068/download>. Le programme de cycle 4 de 2026 s'appliquera à la classe de 3e à partir de septembre 2028 : <https://eduscol.education.gouv.fr/5736/ressources-d-accompagnement-du-programme-de-mathematiques-au-cycle-4>.

La V0.3 ne couvre pas encore les statistiques, les probabilités, les transformations du plan ni la programmation : ce sont des pistes pour les versions suivantes. Les défis sont originaux et ne remplacent ni le cours ni un examen blanc intégral du brevet.

**À confirmer sur matériel réel :** tactile, audio, service worker et maintien de la sauvegarde sur les anciennes tablettes Android. Un navigateur dépourvu de certaines fonctions HTML5/JavaScript peut avoir un support partiel. La sauvegarde locale peut disparaître après effacement des données du navigateur ; utilisez l'export JSON pour la conserver.

## Versions et sécurité

La version précédente de GitHub est archivée dans une branche `backup/pre-math-shift-v0.3-*`. Toute évolution est créée sur une branche `feature/` et intégrée après tests. Aucun fichier des autres applications du dépôt `elc-education` n'est modifié pour cette V0.3.
