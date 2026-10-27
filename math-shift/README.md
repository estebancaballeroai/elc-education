# MATH SHIFT — Mission Observatoire (v0.1.0)

**Jeu éducatif gratuit pour la classe de 3e** · ELC Éducation.

Une aventure futuriste à la cité des anomalies. La première mission comporte **20 défis jouables** dans 3 stations : **Thalès (7)**, **trigonométrie / tangente (7)**, **Pythagore (6)**. Les mécaniques incluent un pont à aligner, un rayon lumineux orientable et des circuits à recalculer. L'exploration libre permet aussi de découvrir 3 trésors sans questions scolaires.

## Démarrer

- **Sur GitHub Pages :** publier tous les fichiers, `index.html` et le dossier `assets/` dans un même répertoire. Aucun build ou npm nécessaire.
- **Sur ordinateur :** double-cliquer `index.html`. La navigation et les exercices fonctionnent en mode fichier local (le mode PWA n'est pas disponible en `file://`).
- **Sur téléphone ou tablette :** ouvrir l'URL GitHub Pages ou servir le dossier via un petit serveur HTTP local.
- **Hors connexion :** après un premier chargement réussi via une URL HTTPS, le service worker met en cache les fichiers du jeu. L'utilisation de la sauvegarde dépend des réglages du navigateur et de l'espace disponible.

## Installation recommandée dans le dépôt ELC Éducation

Créer un sous-dossier `math-shift/` dans `estebancaballeroai/elc-education` **sans toucher aux autres applications**, puis copier les éléments suivants :

```
math-shift/
├── index.html
├── styles.css
├── app.js
├── content.js
├── engine.js
├── manifest.webmanifest
├── sw.js
└── assets/
    ├── observatoire.webp
    ├── mission.webp
    ├── explorateur.webp
    ├── nox.webp
    └── icon-192.png


```

Si GitHub Pages sert la branche `main` depuis la racine du dépôt, l'URL attendue est `https://estebancaballeroai.github.io/elc-education/math-shift/`. Vérifier dans **Settings → Pages** si ce site est bien actif : cette URL n'est pas garantie avant publication.

## Mécaniques

- **Pont :** faire glisser E sur [AC] pour rendre la poutre DE parallèle à BC. Le théorème de Thalès permet de trouver la longueur AE.
- **Laser :** appliquer `tan(θ) = opposé / adjacent` pour régler l'angle en degrés, arrondi à l'unité.
- **Réacteur :** appliquer le théorème de Pythagore pour trouver une hypoténuse ou un côté de l'angle droit.
- **Entraînement :** indice, explication après erreur, passage libre, reprise des défis difficiles et révision des acquis.
- **Progression :** XP obtenus une seule fois par défi, 3 emblèmes, niveau, trésors de découverte, sauvegarde locale, import/export.
- **Vie privée :** pas de compte, publicité, traqueur ni requête API.

## Tests

Le jeu inclut des tests de logique :

```bash
node tests/logic.test.cjs
node --check app.js
```

Contrôles recommandés avant fusion : tester la carte et les trois stations sur smartphone, tablettes Android (notamment anciennes), ordinateur ; la sauvegarde après rafraîchissement ; le fonctionnement hors ligne après installation ; l'import/export JSON ; les erreurs de calcul et le parcours de 20 questions.

## Références pédagogiques

Contenu aligné avec les attendus de fin de 3e publiés par Éduscol (2026-2027) : <https://eduscol.education.fr/document/14068/download>. Le nouveau programme de mathématiques de cycle 4 publié au BO du 5 mars 2026 s'applique à la classe de 3e à partir de septembre 2028, pas en 2026-2027 : <https://www.education.gouv.fr/bo/2026/Hebdo10/MENE2602912A>.

## Direction artistique et licence

Les **illustrations originales du jeu** ont été générées avec ImageGen et intégrées comme **véritables fichiers graphiques** PNG/WebP. Le code assemble ces illustrations et dessine uniquement les schémas mathématiques interactifs. Aucun lien vers des images externes n'est requis. Il est possible de réutiliser ce prototype et son code dans le cadre des projets ELC Éducation. Toute évolution doit préserver une archive de la version précédente et passer par une branche de travail avant fusion.

## Périmètre V0.1

Une seule mission verticale complète ; les autres quartiers du programme de 3e et les sujets blancs du brevet seront développés dans les versions suivantes. Ce prototype n'est pas une couverture exhaustive du programme.