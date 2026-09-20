# Dernières Séances — page d'attente

Page d'attente de **Dernières Séances**, l'événement Halloween 2026 de
L'Acompagnie Improvisée, au Château de Sucy-en-Brie du 28 octobre au 1er novembre 2026.

Elle est atteinte par QR code depuis les flyers distribués, via `dernieresseances.fr`.
Le site complet viendra ensuite ; cette page annonce l'événement, décompte l'ouverture de
la billetterie et recueille les pré-réservations.

Développé par [Webdiiv](https://webdiiv.com).

## Démarrer

```bash
npm install
npm run dev          # http://localhost:4321
npm run dev -- --host  # accessible depuis un téléphone du même réseau
npm run build        # génère dist/
```

## Structure

| Chemin | Rôle |
| --- | --- |
| `src/components/Hero.astro` | Section 1 — Ouverture |
| `src/components/AvantOuverture.astro` | Section 2 — Compte à rebours et programme |
| `src/components/CompteARebours.astro` | Décompte jusqu'à l'ouverture de la billetterie |
| `src/components/PreReservation.astro` | Section 3 — Pré-réservation et pied de page |
| `src/components/FormulairePreReservation.astro` | Formulaire |
| `src/data/evenement.ts` | **Tout le contenu éditorial** : dates, tarifs, expériences |
| `src/styles/global.css` | Jetons de design issus de la maquette |
| `docs/` | Mise en service du formulaire |

Pour modifier une date, un tarif ou un horaire, `src/data/evenement.ts` suffit.

## Formulaire de pré-réservation

Il est **inerte** tant que `endpointFormulaire` vaut `null` dans `src/data/evenement.ts` :
la saisie est validée, un avis s'affiche, rien n'est envoyé.
Voir [docs/brancher-le-formulaire.md](docs/brancher-le-formulaire.md).

## Fidélité à la maquette

L'intégration reprend au pixel la maquette Figma (desktop 1440, mobile 390). Deux pièges
rencontrés, utiles à connaître avant toute retouche :

- Les `letterSpacing` de la maquette sont en unité `RAW`, que Figma **n'applique pas** au
  rendu. Aucun `letter-spacing` ne doit donc être reporté en CSS.
- Les contours sont en `strokeAlign: INSIDE`. Un `border` CSS ajouterait 2 px et décalerait
  tout le flux : ils sont rendus par `box-shadow: inset 0 0 0 1px`.

Les titres du hero sont des tracés SVG, les polices Halloween étant vectorisées dans la
maquette. Le reste utilise Inter, Bebas Neue et New Rocker, auto-hébergées via Fontsource.
