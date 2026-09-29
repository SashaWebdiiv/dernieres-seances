# Dernières Séances

Site de **Dernières Séances**, l'événement Halloween 2026 de L'Acompagnie Improvisée, au Château
de Sucy-en-Brie du 28 octobre au 1er novembre 2026, servi sur `dernieresseances.fr` (atteint aussi
par QR code depuis les flyers). Billetterie Pretix, hébergement Vercel.

Développé par [Webdiiv](https://webdiiv.com).

## Démarrer

```bash
npm install
npm run dev          # http://localhost:4321
npm run dev -- --host  # accessible depuis un téléphone du même réseau
npm run typecheck    # astro check (TypeScript strict)
npm run build        # génère dist/
```

`astro dev` ne sert pas la fonction `api/creneaux.ts` : le sélecteur de créneaux y laisse la place
au widget Pretix. Pour le tester, passer par un déploiement d'aperçu Vercel.

## Page d'attente (retirée)

Avant l'ouverture de la billetterie, `/` servait une page d'attente avec compte à rebours et
formulaire de pré-réservation (Apps Script + Google Sheet, voir `docs/`). Elle a été remplacée par
le site immersif ; son code reste dans l'historique git. `public/assets/` est conservé pour les
aperçus déjà partagés sur les réseaux sociaux, qui pointent vers ces images.

## Site immersif — `/`

Visite scrollée du château, en page d'accueil depuis le lancement (l'ancienne adresse `/visite`
redirige vers `/`, voir `vercel.json`).
Stack : Astro, Tailwind CSS v4, GSAP + ScrollTrigger (scroll natif, pas de smooth scroll).

Intégration de la maquette Figma Design « Halloween 2026 » (`landing/desktop`, 1440 px).
Il n'existe pas de maquette mobile : l'adaptation mobile est déduite du desktop et de l'ancienne
page d'attente. Images des pièces issues de la maquette (1536 × 1024) ; versions mobiles recadrées en 9:16.

| Chemin | Rôle |
| --- | --- |
| `src/styles/immersive.css` | Jetons de la maquette : couleurs, polices, styles de texte récurrents |
| `src/data/scenes.ts` | **Les scènes** : ordre, médias desktop/mobile, voiles, longueur de scroll, animation |
| `src/data/*.ts` | Contenus : programme, étapes de l'expérience, FAQ, partenaires, liens |
| `src/components/scenes/Scene.astro` | Scène générique : décor sticky, contenu épinglé ou défilant, fondus au noir |
| `src/components/scenes/*Scene.astro` | Contenu de chaque pièce |
| `src/components/programme/` | Programme (cartes d'activités), affiché dans le hall |
| `src/components/ticketing/SelecteurCreneaux.astro` | Sélecteur jour → expérience → créneau → billets, sélection multi-créneaux, paiement Pretix |
| `api/creneaux.ts` | Fonction Vercel : créneaux, places restantes et billets lus dans l'API Pretix (`PRETIX_TOKEN`) |
| `src/components/ticketing/PretixWidget.astro` | Widget Pretix officiel, en secours si le sélecteur ne charge pas |
| `src/scripts/gsap/sceneAnimations.ts` | Une timeline par type de scène |
| `src/scripts/gsap/initScroll.ts` | Création, responsive et nettoyage des ScrollTriggers |
| `src/scripts/gsap/navigation.ts` | Navigation directe : fondu au noir → saut → synchronisation |
| `src/data/billetterie.ts` | URL de la boutique Pretix (`null` : encart d'attente) |

- **Passer une scène en vidéo** : ajouter `video: { desktop, mobile }` à côté de `image`
  dans `scenes.ts`. L'image reste l'affiche et le repli (mouvement réduit, économie de données).
- **Mouvement réduit, ou JavaScript absent** : aucune animation, scènes statiques,
  tout le contenu reste lisible et navigable.
- **Liens internes** : `data-jump` sur un lien `#ancre` déclenche la navigation directe.
- **SEO** : données structurées de l'événement dans `src/data/seo.ts` (JSON-LD), `public/robots.txt`,
  plan du site dans `src/pages/sitemap.xml.ts` (pages indexables uniquement).
- **Reste à faire** (lancement, images, mesure d'audience, vidéos, maintenance) : voir `TODO.md`.
