# Rapport de validation — MATH SHIFT V0.4.0

**28 octobre 2026** · Version candidate publiée après validation.

## Tests automatiques

| Périmètre | Vérification | Statut |
|---|---|---|
| 122 défis / 9 stations | Réponse exacte acceptée, réponse fausse rejetée | OK — `logic-v04.test.cjs` |
| 88 anciens défis | Identifiants, énoncés, réponses, indices et corrections comparés au snapshot V0.3 | OK |
| 52 défis V0.1–V0.2 | Mécaniques historiques, réponses, sauvegarde | OK — `logic-v02.test.cjs` |
| 36 défis V0.3 | Nombres, calcul littéral et corrections | OK — `logic-v03.test.cjs` |
| Statistiques | Effectifs du journal = hauteur de barre, calculs exacts de moyenne, médiane, étendue | OK |
| Probabilités | Issues favorables, dénominateur, indépendance avec remise, fractions équivalentes | OK |
| Sécurité des réponses | Refus de fractions invalides (0 au dénominateur, signe négatif, décimaux), saisies vides | OK |
| Sauvegardes | Préservation des réussites, des XP et des trésors antérieurs | OK |
| Navigation mobile | Écrans 320/390/768/1280 px, pas de débordement horizontal dans les parcours testés | OK |
| Parcours guidés | Barre erronée/corrigée, moyenne FR, médiane paire, étendue, urnes, dé, roue avec 10 simulations, double tirage, géométrie et guide | OK |
| JavaScript | Aucune erreur `pageerror` lors des parcours Playwright ciblés | OK |
| Nouveaux décors | Deux nouveaux WebP originaux intégrés dans CSS / scènes et inspectés | OK |

## Points de vigilance

- La simulation est réellement aléatoire : les proportions varient et **ne sont pas notées**. Le score repose sur le calcul théorique exact. Quatre roues imposent une observation préalable de 10 essais.
- Le navigateur de test utilise un document injecté en mémoire car les connexions locales sont limitées. Le contrôle du déploiement GitHub Pages doit s'effectuer **après publication**, indépendamment de ces tests.
- La mise à jour du service worker, le fonctionnement hors ligne et le tactile demandent encore un essai sur la tablette Android ancienne de destination ; les tests sur Chromebook/Android physique ne sont pas réalisés.
- La progression dépend de l'espace de stockage local. L'export JSON demeure conseillé en cas de changement d'appareil ou d'effacement du cache.
- La V0.4 couvre certains fondamentaux des statistiques et probabilités, **pas l'intégralité du programme de 3e**.

**Critère de publication :** pas de régression constatée sur l'échantillon de tests ; validité mathématique vérifiée. Le contrôle de l'URL publique est séparé de la validation locale.
