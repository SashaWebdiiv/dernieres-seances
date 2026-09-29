# À faire — Dernières Séances

Suivi des chantiers restants du site (`/`), en ligne depuis le 29 septembre 2026. Cocher au fil de l'eau.

## Billetterie (en vente depuis le 29/09)

- [x] **Sélecteur de créneaux** en production (jour → expérience → créneau avec places restantes →
      billets, sélection multi-créneaux, paiement Pretix avec le panier rempli ; code :
      `api/creneaux.ts`, `SelecteurCreneaux.astro`, `scripts/selecteur.ts`). Jeton Pretix en lecture
      seule (`PRETIX_TOKEN`, Vercel, Production et Preview). Testé sur iPhone : paniers, plusieurs
      créneaux et jours, « Reprendre mon panier ». Si la fonction ne répond pas, le widget Pretix
      s'affiche à sa place.
- [x] **Achat réel de contrôle** : sur iPhone, avec deux créneaux, jusqu'à l'e-mail du billet ;
      puis remboursement depuis Pretix.
- [x] **Réglages Pretix** : conditions de vente `https://dernieresseances.fr/cgv/` à
      accepter au paiement, réservation du panier 30 minutes (article 3 des conditions), couleur
      principale lisible avec du texte blanc (rouille #a25b32 plutôt qu'ambre).
- [x] **Créneaux manquants** : pauses voulues (aucun parcours à 16h50, 15h50 le 31, ni horrifique
      à 21h40, tous les jours).
- [ ] **Panier multi-créneaux** : refaire un achat sur deux jours une fois pendant l'événement. Le
      format `subevent_<créneau>_item_<billet>` vient du code de Pretix, pas de sa documentation,
      et pourrait changer lors d'une mise à jour (de même que l'arrivée sur la page du panier,
      `arreterSurLePanier` dans `scripts/pretix.ts`).
- [ ] **Mention de TVA** : provisoire (« TVA non applicable. »), en attente du comptable ; mettre
      à jour `cgv.mentionTva` dans `src/data/legal.ts` (non bloquant).

## Tests sur vrais appareils (après les correctifs mobiles du 29/09)

- [x] **iPhone** dans Edge, Safari et Firefox : faire défiler la billetterie par petits coups en
      choisissant jour, expérience et créneau (plus aucun saut) ; double tap à côté des + / −
      (plus de zoom).
- [ ] **Android** (Chrome, Firefox) et **tablette** : défilement, menu, bouton de réservation fixe,
      barre « Votre sélection », paiement.
- [ ] Mode « mouvement réduit » (réglage d'accessibilité du téléphone) : scènes statiques, lisibles.

## Communication et mesure

- [x] **Délivrabilité des e-mails** (DNS OVH) : SPF et DKIM OVH en place, DMARC ajouté le
      28/09/2026 (`p=none`, rapports sur contact@). Vérifier DKIM « Actif » dans OVH, puis
      envoyer un test depuis support@ et contact@ vers Gmail (« Afficher l'original » :
      SPF, DKIM et DMARC en PASS) **avant** l'e-mail aux pré-inscrits. Envoi depuis le webmail
      OVH : destinataires en Cci, par lots d'environ 50.
- [ ] **E-mail aux pré-inscrits** (prêt), puis **supprimer le Google Sheet des pré-réservations**
      (la politique de confidentialité annonce leur suppression une fois la billetterie ouverte, au
      plus tard le 1er novembre 2026) et **désactiver le déploiement Apps Script** : le formulaire a
      disparu du site, mais son adresse accepte encore des envois.
- [ ] **Aperçus de partage** : forcer la mise à jour dans
      [l'outil de débogage de Facebook](https://developers.facebook.com/tools/debug/)
      (`https://dernieresseances.fr`, « Scrape Again »). WhatsApp : coller l'adresse en `https://`
      et attendre la vignette avant d'envoyer.
- [x] **Google Analytics — vérifier la mesure** (ordinateur OK ; téléphone de test : refus mémorisé ou bloqueur) : ouvrir le site, « Tout accepter », puis
      GA4 → Rapports → Temps réel : la visite doit apparaître en moins d'une minute.
- [ ] **Google Analytics — événement clé** : `billetterie_redirection` (clic sur « Payer », le plus
      proche d'un achat). Faire un parcours complet, attendre qu'il apparaisse (jusqu'à 24 h) dans
      Administration → Événements → Événements récents, puis l'étoiler. Les autres
      (`selection_ajout`, `clic_billetterie`, `billetterie_affichee`, `billetterie_erreur`,
      `billetterie_reprise_panier`) restent des événements simples. Retirer l'étoile de
      `close_convert_lead` et `qualify_lead` (défauts Google, jamais envoyés).
- [x] **Google Search Console** : propriété « Domaine » validée par TXT chez OVH, sitemap soumis,
      page testée dans le [test des résultats enrichis](https://search.google.com/test/rich-results)
      (événement valide ; `performer` ajouté). Revenir dans quelques jours voir l'indexation.
- [x] **Redirections** `www`, `.com` et `vercel.app` vers `dernieresseances.fr` en 308 (permanentes).
- [ ] Les achats se font dans Pretix : suivre les ventes dans les statistiques Pretix (GA ne
      voit pas le paiement).

## Visuels

Décision du 29/09 : le site reste tel quel. Pas de vidéos IA (code vidéo retiré), pas de nouvelles
images ; les pièces restent en 1536 × 1024 avec des recadrages mobiles centrés.

## Maintenance

- [x] Page d'attente retirée (composants, layout, `global.css`) ; `/visite` redirige vers `/`.
- [x] `src/data/evenement.ts` réduit à `emailContact` et `ouvertureBilletterie` ; code vidéo retiré.
- [ ] Archiver `docs/` (formulaire de pré-réservation) une fois Apps Script désactivé.
- [ ] `public/assets/` : gardé pour les aperçus déjà partagés de la page d'attente ; à supprimer
      après l'événement.
- [x] CI GitHub Actions (`.github/workflows/verification.yml`) : `npm ci`, `npm run typecheck` et
      `npm run build` sur chaque PR et sur `main`. Ne fusionner une PR que si la vérification est verte.
- [ ] Lint (ESLint + Prettier) : pas avant l'événement (il reformaterait tout le code pour un gain
      faible sur un site figé).
- [ ] Dépendances : à jour au 29/09, sauf TypeScript 7 (version majeure) volontairement laissé en 6
      jusqu'après l'événement. Relancer `npm outdated` début octobre.
- [ ] DMARC : lire les rapports reçus sur contact@ ; si tous les envois légitimes passent,
      durcir en `p=quarantine` (après l'événement, pas avant).
- [ ] Après l'événement : bilan, puis décider du sort du site (archive, édition 2027).
