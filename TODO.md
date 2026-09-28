# À faire — Dernières Séances

Suivi des chantiers restants du site immersif (`/visite`). Cocher au fil de l'eau.

## Avant le lancement (bloquant)

- [ ] **Billetterie Pretix** : boutique branchée (`https://pretix.eu/lacompagnie/halloween26/`,
      widget v2). Reste à tester un achat complet en mode test Pretix, sur mobile et desktop :
      widget, panier, paiement Stripe / Apple Pay / Google Pay, 3-D Secure, retour sur le site,
      e-mail du billet. Côté Pretix : couleur principale lisible avec du texte blanc (rouille
      #a25b32 plutôt qu'ambre), CGV `https://dernieresseances.fr/cgv/` à accepter au paiement,
      réservation du panier 30 minutes (article 3 des conditions).
- [x] **Pages légales** (`/mentions-legales/`, `/confidentialite/`, contenus dans
      `src/data/legal.ts`) : toutes les informations sont renseignées (le build signale
      tout champ remis à `null`). Mettre à jour la date `miseAJour` à chaque modification.
- [x] **Conditions de vente** (`/cgv/`) : validées par le bureau.
- [ ] **Conditions de vente dans Pretix** : renseigner `https://dernieresseances.fr/cgv/` comme
      conditions à accepter au paiement.
- [ ] **Mention de TVA** : provisoire (« TVA non applicable. »), en attente du comptable ; mettre
      à jour `cgv.mentionTva` avec l'article du CGI qui s'applique (non bloquant).
- [ ] **Bascule `/visite` → `/`** :
  - remplacer le contenu de `src/pages/index.astro` par celui de `src/pages/visite.astro` ;
  - retirer la prop `noindex` ;
  - passer `accueilHref` à `"/"` dans `src/data/navigation.ts` (retour depuis les pages légales) ;
  - faire de `/visite` une redirection 301 vers `/` (ou supprimer la page) ;
  - vérifier que le sitemap (`src/pages/sitemap.xml.ts`) ne liste que `/`.
- [ ] **Tests sur vrais appareils** : iPhone (Safari), Android (Chrome), tablette ; scroll,
      menu burger, bouton de réservation fixe, widget Pretix, mode « mouvement réduit ».

## Une fois le site en ligne sur dernieresseances.fr

- [ ] **Délivrabilité des e-mails** (DNS OVH) : SPF et DKIM OVH en place, DMARC ajouté le
      28/09/2026 (`p=none`, rapports sur contact@). Vérifier DKIM « Actif » dans OVH, puis
      envoyer un test depuis support@ et contact@ vers Gmail (« Afficher l'original » :
      SPF, DKIM et DMARC en PASS) **avant** l'e-mail aux pré-inscrits. Envoi depuis le webmail
      OVH : destinataires en Cci, par lots d'environ 50.
- [ ] **E-mail aux pré-inscrits** (prêt) : l'envoyer dès que le site et la billetterie sont en
      ligne. **Puis supprimer le Google Sheet des pré-réservations** : la politique de
      confidentialité annonce leur suppression « une fois l'ouverture de la billetterie
      annoncée », et au plus tard le 1er novembre 2026. Désactiver aussi le déploiement
      Apps Script du formulaire (il continuerait d'accepter des envois).
- [ ] **Google Analytics — vérifier la mesure** : ouvrir le site, « Tout accepter », puis
      GA4 → Rapports → Temps réel : la visite doit apparaître en moins d'une minute.
- [ ] **Google Analytics — événement clé** : cliquer un bouton « J'achète mon billet ! »,
      attendre que `clic_billetterie` apparaisse (jusqu'à 24 h) dans Administration →
      Événements → Événements récents, puis l'étoiler : c'est le seul événement clé.
      `billetterie_affichee` et `billetterie_erreur` restent des événements simples.
      Retirer l'étoile de `close_convert_lead` et `qualify_lead` (défauts Google, jamais envoyés).
- [ ] **Google Search Console** : déclarer le site, soumettre
      `https://dernieresseances.fr/sitemap.xml`, tester la page dans le
      [test des résultats enrichis](https://search.google.com/test/rich-results) (événement).
- [ ] **Achat réel de contrôle** sur le site en ligne (widget Pretix, paiement, e-mail du billet),
      puis remboursement depuis Pretix.

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
- [x] Dans le flux : Mesures améliorées → Pages vues → décocher « changements de page basés
      sur l'historique du navigateur » (sinon chaque clic de menu compte comme une page vue).
- [x] Dans GA4 : Administration → Collecte et conservation des données → conservation des
      données sur **14 mois** (annoncé dans la politique de confidentialité) ; laisser les
      signaux Google désactivés.
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
- [ ] DMARC : lire les rapports reçus sur contact@ ; si tous les envois légitimes passent,
      durcir en `p=quarantine` (après l'événement, pas avant).
- [ ] Après l'événement : bilan, puis décider du sort du site (archive, édition 2027).
