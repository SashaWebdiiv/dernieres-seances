# À faire — Dernières Séances

Suivi des chantiers restants du site immersif (`/visite`). Cocher au fil de l'eau.

## Avant le lancement (bloquant)

- [ ] **Billetterie Pretix** : boutique branchée (`https://pretix.eu/lacompagnie/halloween26/`,
      widget v2). Reste à tester un achat complet en mode test Pretix, sur mobile et desktop :
      widget, panier, paiement Stripe / Apple Pay / Google Pay, 3-D Secure, retour sur le site,
      e-mail du billet. Côté Pretix : couleur principale lisible avec du texte blanc (rouille
      #a25b32 plutôt qu'ambre), CGV `https://dernieresseances.fr/cgv/` à accepter au paiement,
      réservation du panier 30 minutes (article 3 des conditions).
- [ ] **Pages légales** (`/mentions-legales/`, `/confidentialite/`, contenus dans
      `src/data/legal.ts`) : toutes les informations sont renseignées (le build signale
      tout champ remis à `null`). Mettre à jour la date `miseAJour` à chaque modification.
      Supprimer le fichier des pré-réservations dans le délai annoncé (au plus tard le
      1er novembre 2026).
- [ ] **Conditions générales de vente** (`/cgv/`) : faire relire et valider par le bureau,
      puis renseigner l'URL `https://dernieresseances.fr/cgv/` dans Pretix comme conditions à
      accepter au paiement. Mention de TVA provisoire (« TVA non applicable. ») : la faire
      confirmer par le comptable, avec l'article du CGI qui s'applique (`cgv.mentionTva`).
- [ ] **Bascule `/visite` → `/`** :
  - remplacer le contenu de `src/pages/index.astro` par celui de `src/pages/visite.astro` ;
  - retirer la prop `noindex` ;
  - passer `accueilHref` à `"/"` dans `src/data/navigation.ts` (retour depuis les pages légales) ;
  - faire de `/visite` une redirection 301 vers `/` (ou supprimer la page) ;
  - vérifier que le sitemap (`src/pages/sitemap.xml.ts`) ne liste que `/`.
- [ ] **Après la bascule** : déclarer le site dans Google Search Console, soumettre
      `https://dernieresseances.fr/sitemap.xml`, tester la page dans le
      [test des résultats enrichis](https://search.google.com/test/rich-results) (événement).
- [ ] **Tests sur vrais appareils** : iPhone (Safari), Android (Chrome), tablette ; scroll,
      menu burger, bouton de réservation fixe, widget Pretix, mode « mouvement réduit ».

## Images

- [ ] Sources définitives en 2880 px de large minimum (écrans Retina desktop) ; les pièces
      actuelles font 1536 × 1024 et sont un peu douces sur grand écran.
- [ ] Recadrages mobiles dédiés (portrait 9:16) pièce par pièce : les versions actuelles sont
      des recadrages centrés automatiques.
- [ ] Remplacer les images dans `src/assets/scenes/` en gardant les mêmes noms : l'optimisation
      (AVIF/WebP, tailles) est faite au build.

## Mesure d'audience (Google Analytics 4 + bandeau de consentement)

- [x] Propriété GA4 « Dernières Séances », flux `https://dernieresseances.fr`, identifiant
      `G-Y58ZH9T32G` branché (`src/data/analytics.ts`). Ne jamais coller la balise gtag de
      Google dans le `<head>` : elle se chargerait avant le consentement.
- [ ] Dans le flux : Mesures améliorées → Pages vues → décocher « changements de page basés
      sur l'historique du navigateur » (sinon chaque clic de menu compte comme une page vue).
- [ ] Dans GA4 : Administration → Collecte et conservation des données → conservation des
      données sur **14 mois** (annoncé dans la politique de confidentialité) ; laisser les
      signaux Google désactivés.
- [ ] Après la mise en ligne et un premier clic (événement visible sous 24 h dans
      Administration → Événements → Événements récents) : étoiler `clic_billetterie` pour en
      faire le seul événement clé. `billetterie_affichee` et `billetterie_erreur` restent des
      événements simples (indicateurs techniques). Retirer l'étoile des événements par défaut
      de Google (`close_convert_lead`, `qualify_lead`) : le site ne les envoie jamais.
- [ ] Les achats se font dans Pretix : suivre les ventes dans les statistiques Pretix (GA ne
      voit pas le paiement).

## Vidéos IA (après le lancement)

- [ ] Produire les vidéos par pièce (desktop 16:9, mobile 9:16, muettes, en boucle, < 2–3 Mo).
- [ ] Les brancher via `video: { desktop, mobile }` dans `src/data/scenes.ts` : l'image
      reste l'affiche et le repli (mouvement réduit, économie de données).

## Maintenance

- [ ] Nettoyer l'ancienne page d'attente une fois le site immersif en ligne : composants
      `src/components/{Hero,AvantOuverture,CompteARebours,PreReservation,FormulairePreReservation}.astro`,
      `src/layouts/Layout.astro`, `src/styles/global.css`, `public/assets/*`,
      `src/data/evenement.ts` (et `docs/` du formulaire si le formulaire disparaît).
- [ ] Une seule source de vérité pour l'événement : `evenement.ts` (page d'attente) et
      `programme.ts` (site immersif) se recoupent.
- [ ] Façade en double : `public/assets/chateau-*.webp` (page d'attente) et
      `src/assets/scenes/facade-*.webp` (site immersif).
- [ ] Ajouter un lint (ESLint + Prettier) et une CI (GitHub Actions : `npm run typecheck`
      et `npm run build` sur chaque PR).
- [ ] Mettre à jour les dépendances régulièrement (`npm outdated`), surtout avant l'événement.
- [ ] Après l'événement : bilan, puis décider du sort du site (archive, édition 2027).
