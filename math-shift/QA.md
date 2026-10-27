# Rapport de validation — MATH SHIFT v0.1.0 (27/10/2026)

## Tests effectués

- **Mathématiques** : 20/20 réponses attendues validées par les formules correspondantes ; réponses erronées refusées ; indices et solutions présents.
- **Sauvegarde / XP** : création, assainissement des imports, relecture, absence d'XP supplémentaire lors d'une répétition.
- **Navigation** : carte → Thalès → erreur → correction → défi suivant → trigonométrie → Pythagore → révision → exploration → statistiques → guide.
- **Rendu** : Chromium headless en 320 × 640, 390 × 844 et 1280 × 900 ; pas de débordement horizontal ; images réelles chargées ; pas d'erreur JS détectée.
- **Fonctionnalités** : curseur du laser, saisie des réponses, retour d'erreur, passage au défi suivant, trésor gratuit, compteur d'XP, filtres de révision.

## Limites de vérification

- Le navigateur de test du conteneur bloque les navigations vers localhost et `file://`. Les interactions ont donc été exécutées dans un document HTML injecté avec les vrais scripts et assets intégrés. La persistance `localStorage` a été vérifiée au niveau du moteur, mais pas en rechargement réel avec HTTPS.
- Le service worker a été inspecté statiquement ; un véritable essai « hors réseau après publication » reste à faire avec une URL HTTPS de GitHub Pages.
- Aucun test n'a encore été fait sur une **tablette Android physique ancienne**. Tester sur l'appareil cible avant de déclarer cette compatibilité confirmée.
- Seule la première mission de 3e est présente ; l'ensemble du programme et le brevet blanc ne sont pas encore intégrés.