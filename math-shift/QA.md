# Rapport de validation — MATH SHIFT V0.3.0

**Date : 28 octobre 2026.** Périmètre : nouveaux défis de nombres/calcul littéral, parcours historiques, mobile, compatibilité de la sauvegarde.

## Tests réalisés

| Domaine | Résultat | Preuve |
|---|---|---|
| Données et exactitude | **88/88** réponses attendues acceptées et réponses altérées refusées | `node tests/logic-v03.test.cjs` |
| Régression | **52/52** exercices historiques conservés, stations anciennes fonctionnelles | `node tests/logic-v02.test.cjs` |
| Puissances / racines / scientifique | **18** défis testés, formats décimaux FR, signe et exposant | `tests/logic-v03.test.cjs` |
| Calcul littéral | **18** défis testés, distributivité simple/double, PGCD et signes | `tests/logic-v03.test.cjs` |
| Interface interactive | Puissances, développement, scientifique, racines, factorisation, double distributivité, anciens ponts | `tests/browser-v03-smoke.py` |
| Écrans | **320, 390, 768 et 1280 px** ; nouveaux écrans sans débordement horizontal | `MATHSHIFT_VIEWPORTS=... SKIP_SCENARIOS=1 python ...` |
| Artworks | Deux nouveaux WebP chargés et utilisés dans les scènes | `tests/visual-v03.py` |
| JavaScript | Aucune erreur de page lors des parcours testés | Tests Playwright |
| Sauvegardes V0.1/V0.2 | Import/sanitisation des anciennes clés et XP ; nouvelles catégories initialement vides | Tests Node |

## Méthode

La politique réseau de l'environnement de test bloque `localhost` et `file:` dans Chromium. Pour les tests d'interface, Playwright injecte localement les vrais fichiers HTML, CSS et JavaScript dans un document de test ; pour les captures graphiques, les images WebP sont injectées sous forme de données afin de vérifier leur rendu réel. Le fonctionnement de GitHub Pages devra être confirmé après publication.

## Points de vigilance non bloquants

- Tests physiques sur tablette Android ancienne non réalisés (en particulier PWA, stockage, son et puissance graphique).
- Le rendu avec un navigateur Android très ancien doit être vérifié sur appareil réel.
- Cache hors ligne vérifiable en conditions HTTPS seulement.
- Les exercices constituent un échantillon progressif, pas une couverture exhaustive du programme de 3e.

**Statut :** candidat à la publication, en conservant la branche de sauvegarde V0.2.
