# À faire — Dernières Séances

Suivi des chantiers restants du site immersif (`/visite`). Cocher au fil de l'eau.

## Avant le lancement (bloquant)

- [ ] **Billetterie Pretix** : renseigner `pretixShopUrl` dans `src/data/billetterie.ts`
      (URL de la boutique, avec le « / » final), puis tester un achat complet en mode test
      Pretix : widget, panier, paiement Stripe, 3-D Secure, retour sur le site, e-mail du billet.
- [ ] **Pages légales** (`/mentions-legales/`, `/confidentialite/`, contenus dans
      `src/data/legal.ts`) : renseigner le directeur de la publication (prénom et nom
      de la présidence de l'association) — la page affiche « [À compléter] » et le build
      les liste tant qu'elles manquent. Valider les durées de conservation proposées, confirmer
      l'hébergeur (Vercel) et mettre à jour la date `miseAJour`.
- [ ] **Conditions générales de vente** (`/cgv/`) : faire relire et valider par le bureau,
      puis renseigner l'URL `https://dernieresseances.fr/cgv/` dans Pretix comme conditions à
      accepter au paiement. Vérifier si l'association est tenue de proposer un médiateur de
      la consommation (art. L612-1 du Code de la consommation) : pas de médiateur à ce jour.
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
- [ ] Logo d'Eden Crêpes (partenaire affiché sans logo pour l'instant).
- [ ] Remplacer les images dans `src/assets/scenes/` en gardant les mêmes noms : l'optimisation
      (AVIF/WebP, tailles) est faite au build.

## Mesure d'audience

- [ ] Choisir l'outil. Privilégier une solution pouvant être exemptée de consentement selon
      les critères de la CNIL (liste des solutions sur cnil.fr ; ex. Matomo configuré en mode
      exempté) pour éviter un bandeau cookies.
- [ ] Suivre au minimum : visites, clics sur « J'achète mon billet ! », ouverture du widget,
      achats (conversion Pretix).
- [ ] Mettre à jour la politique de confidentialité en conséquence.

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
