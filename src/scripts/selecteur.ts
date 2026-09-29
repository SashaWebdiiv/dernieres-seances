import type { Billet, Creneau, ExperienceId, ReponseCreneaux } from "../../api/creneaux";
import { mesurer } from "./consent";
import { arreterSurLePanier, chargerScriptPretix, paiementDansNouvelOnglet } from "./pretix";

/**
 * Sélecteur de créneau (`components/ticketing/SelecteurCreneaux.astro`).
 *
 * Les créneaux sont lus à l'approche de la section (`/api/creneaux`), puis relus quand le visiteur
 * change de jour ou d'expérience si les données ont plus d'une minute. Une option n'est jamais
 * reconstruite pendant que le visiteur s'en sert : seules les étapes suivantes le sont (et le focus
 * est rendu à l'option équivalente si la liste courante doit être rafraîchie).
 *
 * Étape 4 : billets du créneau (+ / −), limités aux places restantes (un Duo en compte 2, voir
 * `Billet.places`), puis « Ajouter à ma sélection ». La sélection réunit autant de créneaux et de
 * jours que voulu ; les places qu'elle occupe sont déduites de chaque créneau. Elle est gardée
 * 12 heures dans le navigateur (`localStorage`), rien n'est réservé chez Pretix avant « Payer ».
 *
 * « Payer » ouvre un seul panier Pretix avec toute la sélection : `PretixWidget.open` sans créneau,
 * chaque billet nommé `subevent_<créneau>_item_<billet>` (format lu par le panier Pretix pour une
 * série d'événements, voir `_item_from_post_value` dans pretix/presale/views/cart.py). Nouvel onglet
 * sur mobile et dans Safari (`paiementDansNouvelOnglet`). Le visiteur arrive sur la page du panier
 * Pretix, encore modifiable, avant ses coordonnées (`arreterSurLePanier`).
 * Sans script Pretix : page du premier créneau.
 * Pretix garde le panier (cookie) : ce qui est payé ensuite s'y ajoute, d'où l'avertissement et le
 * bouton « Reprendre mon panier ».
 *
 * Échec (fonction absente, jeton manquant, Pretix indisponible, aucun créneau) : le sélecteur
 * s'efface et le widget Pretix `[data-billetterie-secours]` prend sa place.
 */

const PERIME = 60_000;
const DELAI = 10_000;
const CLE_SELECTION = "ds-selection";
const DUREE_SELECTION = 12 * 60 * 60 * 1000;

interface ExperienceAffichee {
  id: ExperienceId;
  titre: string;
  public: string;
}

/** Sélection : quantité par billet, par créneau. */
type Selection = Map<number, Map<number, number>>;

const date = (jour: string) => new Date(`${jour}T12:00:00Z`);
const format = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("fr-FR", { ...options, timeZone: "UTC" });
const semaine = format({ weekday: "short" });
const jourEtMois = format({ day: "numeric", month: "short" });
const jourComplet = format({ weekday: "long", day: "numeric", month: "long" });

/** « 1er nov. » plutôt que « 1 nov. ». */
const premier = (texte: string) => texte.replace(/^1 /, "1er ");
const heure = (h: string) => h.replace(":", "h");
const majuscule = (texte: string) => texte.charAt(0).toUpperCase() + texte.slice(1);
const euros = (montant: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(montant) ? 0 : 2,
  }).format(montant);
const pluriel = (n: number, singulier: string, formePlurielle = `${singulier}s`) =>
  `${n} ${n > 1 ? formePlurielle : singulier}`;

const lireSelection = (): Selection => {
  try {
    const lu = JSON.parse(localStorage.getItem(CLE_SELECTION) ?? "null") as {
      enregistre: number;
      lignes: [number, number, number][];
    } | null;
    if (!lu || Date.now() - lu.enregistre > DUREE_SELECTION) return new Map();
    const selection: Selection = new Map();
    for (const [creneau, billet, quantite] of lu.lignes) {
      if (quantite > 0) selection.set(creneau, (selection.get(creneau) ?? new Map()).set(billet, quantite));
    }
    return selection;
  } catch {
    return new Map();
  }
};

const enregistrerSelection = (selection: Selection) => {
  try {
    const lignes = [...selection].flatMap(([creneau, billets]) => [...billets].map(([billet, q]) => [creneau, billet, q]));
    if (lignes.length === 0) localStorage.removeItem(CLE_SELECTION);
    else localStorage.setItem(CLE_SELECTION, JSON.stringify({ enregistre: Date.now(), lignes }));
  } catch {
    // Stockage indisponible (navigation privée stricte) : la sélection vit le temps de la page.
  }
};

export function initSelecteur(): void {
  const racine = document.querySelector<HTMLElement>("[data-selecteur]");
  if (!racine) return;

  const endpoint = racine.dataset.endpoint ?? "";
  const boutique = racine.dataset.boutique ?? "";
  const peuDePlaces = Number(racine.dataset.peuDePlaces ?? 0);
  const experiences = JSON.parse(racine.dataset.experiences ?? "[]") as ExperienceAffichee[];

  const statut = racine.querySelector<HTMLElement>("[data-selecteur-statut]")!;
  const formulaire = racine.querySelector<HTMLFormElement>("[data-selecteur-formulaire]")!;
  const etape = (nom: string) => formulaire.querySelector<HTMLElement>(`[data-etape="${nom}"]`)!;
  const options = (nom: string) => etape(nom).querySelector<HTMLElement>("[data-options]")!;
  const modele = (nom: string) => racine.querySelector<HTMLTemplateElement>(`[data-modele="${nom}"]`)!;
  const recapitulatif = formulaire.querySelector<HTMLElement>("[data-recapitulatif]")!;
  const total = formulaire.querySelector<HTMLElement>("[data-total]")!;
  const ajouter = formulaire.querySelector<HTMLButtonElement>("[data-ajouter]")!;
  const blocSelection = formulaire.querySelector<HTMLElement>("[data-selection]")!;
  const lignesSelection = blocSelection.querySelector<HTMLElement>("[data-selection-lignes]")!;
  const totalSelection = blocSelection.querySelector<HTMLElement>("[data-selection-total]")!;
  const avisPanier = formulaire.querySelector<HTMLElement>("[data-panier]")!;
  const reprendre = formulaire.querySelector<HTMLButtonElement>("[data-reprendre]")!;
  const barre = document.querySelector<HTMLElement>("[data-barre-selection]")!;
  const resumeBarre = barre.querySelector<HTMLElement>("[data-barre-resume]")!;
  const boutonsPayer = [
    ...blocSelection.querySelectorAll<HTMLButtonElement>("[data-payer]"),
    ...barre.querySelectorAll<HTMLButtonElement>("[data-payer]"),
  ];

  let donnees: ReponseCreneaux | null = null;
  let chargeA = 0;
  const choix: { jour?: string; experience?: ExperienceId; creneau?: number } = {};
  /** Billets en cours de choix pour le créneau affiché à l'étape 4 (pas encore dans la sélection). */
  const quantites = new Map<number, number>();
  let billetsAffiches: ExperienceId | undefined;
  let selection: Selection = new Map();
  let selectionVisible = false;
  let panierOuvert = false;

  const echec = (cause: string) => {
    racine.hidden = true;
    document.querySelectorAll("[data-billetterie-secours]").forEach((bloc) => bloc.classList.add("billetterie-secours--active"));
    mesurer("billetterie_erreur", { cause: `selecteur_${cause}` });
  };

  const charger = async (): Promise<boolean> => {
    try {
      const reponse = await fetch(endpoint, { signal: AbortSignal.timeout(DELAI) });
      if (!reponse.ok) return false;
      const lu = (await reponse.json()) as ReponseCreneaux;
      if (!Array.isArray(lu.creneaux)) return false;
      donnees = lu;
      chargeA = Date.now();
      return true;
    } catch {
      return false;
    }
  };

  const creneauParId = (id: number) => donnees?.creneaux.find((c) => c.id === id);
  const billetParId = (id: number) => donnees?.billets.find((b) => b.id === id);
  const creneauxDu = (jour: string, experience?: ExperienceId): Creneau[] =>
    (donnees?.creneaux ?? []).filter((c) => c.jour === jour && (!experience || c.experience === experience));

  /** Places occupées par des quantités de billets (un Duo en compte 2). */
  const placesDe = (billets: Map<number, number>) =>
    [...billets].reduce((somme, [id, quantite]) => somme + quantite * (billetParId(id)?.places ?? 1), 0);
  /** Places encore libres pour ce visiteur : places Pretix moins celles de sa sélection. */
  const restantes = (creneau: Creneau) =>
    creneau.places === null ? Infinity : creneau.places - placesDe(selection.get(creneau.id) ?? new Map());
  const libres = (creneaux: Creneau[]) => creneaux.filter((c) => restantes(c) > 0);

  /** Crée une option radio à partir d'un modèle ; `textes` remplit les `[data-texte]`. */
  const creerOption = (nom: string, valeur: string, textes: Record<string, string>, coche: boolean, desactive: boolean) => {
    const fragment = modele(nom).content.cloneNode(true) as DocumentFragment;
    const input = fragment.querySelector("input")!;
    input.value = valeur;
    input.checked = coche && !desactive;
    input.disabled = desactive;
    remplirTextes(fragment, textes);
    return fragment;
  };

  const remplirTextes = (fragment: DocumentFragment, textes: Record<string, string>) =>
    fragment.querySelectorAll<HTMLElement>("[data-texte]").forEach((span) => {
      span.textContent = textes[span.dataset.texte ?? ""] ?? "";
    });

  /** Remplace les options d'une étape en rendant le focus à l'option de même valeur. */
  const remplir = (nom: string, fragments: DocumentFragment[]) => {
    const conteneur = options(nom);
    const focus = conteneur.contains(document.activeElement) ? (document.activeElement as HTMLInputElement).value : null;
    conteneur.replaceChildren(...fragments);
    if (focus !== null) conteneur.querySelector<HTMLInputElement>(`input[value="${focus}"]`)?.focus();
  };

  const libelleCreneau = (creneau: Creneau) => {
    const experience = experiences.find((e) => e.id === creneau.experience);
    return `${majuscule(premier(jourComplet.format(date(creneau.jour))))} · ${experience?.titre ?? ""} · ${heure(creneau.heure)}`;
  };

  const afficherJours = () => {
    const jours = [...new Set(donnees!.creneaux.map((c) => c.jour))];
    remplir(
      "jour",
      jours.map((jour) => {
        const complet = libres(creneauxDu(jour)).length === 0;
        return creerOption(
          "jour",
          jour,
          {
            semaine: semaine.format(date(jour)),
            date: premier(jourEtMois.format(date(jour))),
            etat: complet ? "Complet" : "",
          },
          choix.jour === jour,
          complet,
        );
      }),
    );
  };

  const afficherExperiences = () => {
    const jour = choix.jour!;
    remplir(
      "experience",
      experiences.map((experience) => {
        const creneaux = creneauxDu(jour, experience.id);
        const disponibles = libres(creneaux);
        const horaires =
          creneaux.length > 0
            ? `Départs de ${heure(creneaux[0].heure)} à ${heure(creneaux[creneaux.length - 1].heure)}`
            : "Pas de séance ce jour";
        const etat =
          creneaux.length === 0
            ? ""
            : disponibles.length === 0
              ? "Complet"
              : pluriel(disponibles.length, "créneau disponible", "créneaux disponibles");
        return creerOption(
          "experience",
          experience.id,
          { titre: experience.titre, public: experience.public, horaires, etat },
          choix.experience === experience.id,
          disponibles.length === 0,
        );
      }),
    );
    etape("experience").hidden = false;
  };

  const texteDesPlaces = (creneau: Creneau) => {
    if (creneau.places === null) return "Disponible";
    const places = restantes(creneau);
    if (places <= 0) return creneau.places > 0 ? "Dans votre sélection" : "Complet";
    // Libellés courts : une seule ligne dans les cases de 3 colonnes en mobile.
    if (places === 1) return "Dernière place";
    if (places <= peuDePlaces) return `Plus que ${places}`;
    return pluriel(places, "place");
  };

  const afficherCreneaux = () => {
    const creneaux = creneauxDu(choix.jour!, choix.experience);
    remplir(
      "creneau",
      creneaux.map((c) =>
        creerOption(
          "creneau",
          String(c.id),
          { heure: heure(c.heure), places: texteDesPlaces(c) },
          choix.creneau === c.id,
          restantes(c) <= 0,
        ),
      ),
    );
    etape("creneau").hidden = false;
  };

  /** Créneau retenu, s'il appartient au jour et à l'expérience affichés et qu'il y reste de la place. */
  const creneauChoisi = () =>
    donnees?.creneaux.find(
      (c) => c.id === choix.creneau && c.jour === choix.jour && c.experience === choix.experience && restantes(c) > 0,
    );
  const billetsDe = (experience: ExperienceId) => (donnees?.billets ?? []).filter((b) => b.experience === experience);
  const peutAjouter = (billet: Billet, creneau: Creneau) => {
    const quantite = quantites.get(billet.id) ?? 0;
    const dejaChoisis = selection.get(creneau.id)?.get(billet.id) ?? 0;
    if (billet.max !== null && quantite + dejaChoisis >= billet.max) return false;
    return placesDe(quantites) + billet.places <= restantes(creneau);
  };

  /** Met à jour compteurs, boutons + / −, total et bouton d'ajout (sans reconstruire la liste). */
  const actualiserBillets = (message?: string) => {
    const creneau = creneauChoisi();
    if (!creneau) return;
    let nombre = 0;
    let montant = 0;
    for (const billet of billetsDe(creneau.experience)) {
      const quantite = quantites.get(billet.id) ?? 0;
      nombre += quantite;
      montant += quantite * billet.prix;
      const ligne = options("billets").querySelector<HTMLElement>(`[data-billet="${billet.id}"]`);
      if (!ligne) continue;
      ligne.querySelector("[data-quantite]")!.textContent = String(quantite);
      ligne.querySelector<HTMLButtonElement>("[data-moins]")!.disabled = quantite === 0;
      ligne.querySelector<HTMLButtonElement>("[data-plus]")!.disabled = !peutAjouter(billet, creneau);
    }
    const personnes = placesDe(quantites);
    const complet = personnes > 0 && personnes >= restantes(creneau);
    total.textContent =
      message ??
      (nombre === 0
        ? "Aucun billet choisi"
        : `${pluriel(personnes, "personne")} · ${euros(montant)}${complet ? " · créneau complet avec votre sélection" : ""}`);
    ajouter.disabled = nombre === 0;
    ajouter.textContent = nombre === 0 ? "Choisir au moins un billet" : `Ajouter à ma sélection · ${euros(montant)}`;
  };

  const construireBillets = (experience: ExperienceId) => {
    quantites.clear();
    billetsAffiches = experience;
    options("billets").replaceChildren(
      ...billetsDe(experience).map((billet) => {
        const fragment = modele("billet").content.cloneNode(true) as DocumentFragment;
        fragment.querySelector("li")!.dataset.billet = String(billet.id);
        remplirTextes(fragment, {
          nom: billet.nom,
          detail: billet.places > 1 ? `${euros(billet.prix)} · ${billet.places} places` : euros(billet.prix),
        });
        fragment.querySelector("[data-groupe]")!.setAttribute("aria-label", billet.nom);
        fragment.querySelector("[data-moins]")!.setAttribute("aria-label", `Retirer : ${billet.nom}`);
        fragment.querySelector("[data-plus]")!.setAttribute("aria-label", `Ajouter : ${billet.nom}`);
        return fragment;
      }),
    );
  };

  const afficherBillets = (defiler: boolean) => {
    const creneau = creneauChoisi();
    const bloc = etape("billets");
    if (!creneau) {
      choix.creneau = undefined;
      bloc.hidden = true;
      return;
    }
    recapitulatif.textContent = libelleCreneau(creneau);
    if (billetsAffiches !== creneau.experience) construireBillets(creneau.experience);
    // Choix en cours trop grand pour ce créneau (changement de créneau) : on repart de zéro.
    else if (placesDe(quantites) > restantes(creneau)) quantites.clear();
    actualiserBillets();
    bloc.hidden = false;
    if (defiler) defilerVers(bloc);
  };

  const defilerVers = (element: HTMLElement, bloc: ScrollLogicalPosition = "nearest") => {
    const doux = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollIntoView({ block: bloc, behavior: doux ? "smooth" : "auto" });
  };

  /** Créneaux de la sélection dans l'ordre chronologique, avec leurs billets. */
  const lignesTriees = () =>
    [...selection]
      .flatMap(([id, billets]) => {
        const creneau = creneauParId(id);
        return creneau ? [{ creneau, billets }] : [];
      })
      .sort((a, b) => (a.creneau.jour + a.creneau.heure).localeCompare(b.creneau.jour + b.creneau.heure));

  const montantSelection = () =>
    [...selection.values()].reduce(
      (somme, billets) => somme + [...billets].reduce((s, [id, q]) => s + q * (billetParId(id)?.prix ?? 0), 0),
      0,
    );
  const personnesSelection = () => [...selection.values()].reduce((somme, billets) => somme + placesDe(billets), 0);

  const actualiserBarre = () => {
    const vide = selection.size === 0;
    barre.hidden = vide || selectionVisible;
    document.documentElement.classList.toggle("avec-selection", !vide);
  };

  const afficherSelection = () => {
    const lignes = lignesTriees();
    blocSelection.hidden = lignes.length === 0;
    lignesSelection.replaceChildren(
      ...lignes.map(({ creneau, billets }) => {
        const fragment = modele("creneau-selection").content.cloneNode(true) as DocumentFragment;
        remplirTextes(fragment, { creneau: libelleCreneau(creneau) });
        fragment.querySelector("[data-billets-selection]")!.replaceChildren(
          ...[...billets].map(([id, quantite]) => {
            const billet = billetParId(id);
            const ligne = modele("billet-selection").content.cloneNode(true) as DocumentFragment;
            remplirTextes(ligne, {
              libelle: `${quantite} × ${billet?.nom ?? "Billet"}`,
              prix: euros(quantite * (billet?.prix ?? 0)),
            });
            const retirer = ligne.querySelector<HTMLButtonElement>("[data-retirer]")!;
            retirer.dataset.creneau = String(creneau.id);
            retirer.dataset.billet = String(id);
            retirer.setAttribute("aria-label", `Retirer ${billet?.nom ?? "ce billet"}, ${libelleCreneau(creneau)}`);
            return ligne;
          }),
        );
        return fragment;
      }),
    );
    const montant = montantSelection();
    const personnes = personnesSelection();
    const nbCreneaux = lignes.length;
    totalSelection.textContent = `${pluriel(nbCreneaux, "créneau", "créneaux")} · ${pluriel(personnes, "personne")} · ${euros(montant)}`;
    resumeBarre.textContent = `${pluriel(nbCreneaux, "créneau", "créneaux")} · ${euros(montant)}`;
    const libellePayer = panierOuvert ? `Ajouter au panier · ${euros(montant)}` : `Payer ${euros(montant)}`;
    boutonsPayer.forEach((bouton) => (bouton.textContent = bouton.closest("[data-barre-selection]") ? "Payer" : libellePayer));
    actualiserBarre();
  };

  /** Retire de la sélection les créneaux passés, supprimés ou devenus complets. */
  const nettoyerSelection = () => {
    for (const [id, billets] of selection) {
      const creneau = creneauParId(id);
      const valides = new Map([...billets].filter(([billet]) => billetParId(billet)?.experience === creneau?.experience));
      if (!creneau || creneau.places === 0 || valides.size === 0) selection.delete(id);
      else selection.set(id, valides);
    }
    enregistrerSelection(selection);
  };

  /** Après un changement de sélection : étapes 1 à 4 recalculées (places déduites), sélection réaffichée. */
  const actualiserTout = () => {
    enregistrerSelection(selection);
    afficherJours();
    if (choix.jour) afficherExperiences();
    if (choix.jour && choix.experience) afficherCreneaux();
    afficherBillets(false);
    afficherSelection();
  };

  /** Relit les créneaux si les données ont plus d'une minute (échec silencieux : on garde les anciennes). */
  const rafraichirSiPerime = async () => {
    if (Date.now() - chargeA > PERIME) await charger();
  };

  formulaire.addEventListener("submit", (event) => event.preventDefault());

  formulaire.addEventListener("change", async (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !input.checked) return;

    if (input.name === "jour") {
      choix.jour = input.value;
      await rafraichirSiPerime();
      const experience = choix.experience;
      if (experience && libres(creneauxDu(choix.jour, experience)).length === 0) choix.experience = undefined;
      afficherExperiences();
      if (choix.experience) afficherCreneaux();
      else etape("creneau").hidden = true;
      afficherBillets(false);
    } else if (input.name === "experience") {
      choix.experience = input.value as ExperienceId;
      await rafraichirSiPerime();
      afficherCreneaux();
      afficherBillets(false);
    } else if (input.name === "creneau") {
      choix.creneau = Number(input.value);
      if (Date.now() - chargeA > PERIME && (await charger())) afficherCreneaux();
      afficherBillets(true);
    }
  });

  options("billets").addEventListener("click", (event) => {
    const bouton = (event.target as Element).closest<HTMLButtonElement>("[data-plus], [data-moins]");
    const ligne = bouton?.closest<HTMLElement>("[data-billet]");
    if (!bouton || !ligne || bouton.disabled) return;
    const id = Number(ligne.dataset.billet);
    const quantite = quantites.get(id) ?? 0;
    quantites.set(id, Math.max(0, quantite + ("plus" in bouton.dataset ? 1 : -1)));
    actualiserBillets();
  });

  ajouter.addEventListener("click", () => {
    const creneau = creneauChoisi();
    if (!creneau || placesDe(quantites) === 0) return;
    const billets = selection.get(creneau.id) ?? new Map<number, number>();
    for (const [id, quantite] of quantites) {
      if (quantite > 0) billets.set(id, (billets.get(id) ?? 0) + quantite);
    }
    selection.set(creneau.id, billets);
    mesurer("selection_ajout", { experience: creneau.experience, jour: creneau.jour, heure: creneau.heure });
    quantites.clear();
    actualiserTout();
    actualiserBillets(
      restantes(creneau) > 0
        ? "Ajouté à votre sélection. Choisissez un autre créneau ou payez votre sélection."
        : "Ajouté à votre sélection.",
    );
    // Sur ordinateur, on montre la sélection ; sur mobile, la barre fixe apparaît.
    if (window.matchMedia("(min-width: 1024px)").matches) defilerVers(blocSelection);
  });

  lignesSelection.addEventListener("click", (event) => {
    const bouton = (event.target as Element).closest<HTMLButtonElement>("[data-retirer]");
    if (!bouton) return;
    const creneau = Number(bouton.dataset.creneau);
    const billets = selection.get(creneau);
    billets?.delete(Number(bouton.dataset.billet));
    if (!billets || billets.size === 0) selection.delete(creneau);
    actualiserTout();
    // Le bouton a disparu : le focus revient au titre de la sélection, ou au bouton d'ajout si elle est vide.
    if (selection.size > 0) blocSelection.focus();
    else if (!ajouter.closest("[hidden]")) ajouter.focus();
  });

  const payer = () => {
    const lignes = lignesTriees();
    if (lignes.length === 0) return;
    mesurer("billetterie_redirection", {
      creneaux: String(lignes.length),
      experiences: [...new Set(lignes.map((l) => l.creneau.experience))].join(","),
      personnes: String(personnesSelection()),
      montant: String(montantSelection()),
    });
    const pretix = window.PretixWidget;
    if (!pretix?.open) {
      // Script Pretix indisponible (bloqueur, réseau) : page du premier créneau, billets à y choisir.
      window.location.assign(new URL(`${lignes[0].creneau.id}/`, boutique).href);
      return;
    }
    pretix.open(
      boutique,
      null,
      null,
      lignes.flatMap(({ creneau, billets }) =>
        [...billets].map(([id, quantite]) => ({ item: `subevent_${creneau.id}_item_${id}`, count: String(quantite) })),
      ),
      undefined,
      false,
      paiementDansNouvelOnglet(),
    );
    arreterSurLePanier();
    // La sélection est maintenant dans le panier Pretix, qui la garde : ce qui est payé ensuite s'y ajoute.
    panierOuvert = true;
    avisPanier.hidden = false;
    selection = new Map();
    actualiserTout();
  };
  boutonsPayer.forEach((bouton) => bouton.addEventListener("click", payer));

  barre.querySelector("[data-voir-selection]")!.addEventListener("click", (event) => {
    event.preventDefault();
    defilerVers(blocSelection, "start");
    blocSelection.focus({ preventScroll: true });
  });

  // Sans billet, `PretixWidget.open` n'ajoute rien et rouvre le panier en cours (fenêtre sur
  // ordinateur ; page de la boutique, panier compris, dans un nouvel onglet sinon).
  reprendre.addEventListener("click", () => {
    if (window.PretixWidget?.open) {
      window.PretixWidget.open(boutique, null, null, [], undefined, false, paiementDansNouvelOnglet());
    } else window.location.assign(boutique);
    mesurer("billetterie_reprise_panier");
  });

  // La barre fixe s'efface quand la sélection est à l'écran.
  new IntersectionObserver((entrees) => {
    selectionVisible = entrees.some((entree) => entree.isIntersecting);
    actualiserBarre();
  }).observe(blocSelection);

  const demarrer = async () => {
    if (!(await charger())) return echec("donnees");
    if (donnees!.creneaux.length === 0) return echec("vide");
    selection = lireSelection();
    nettoyerSelection();
    afficherJours();
    afficherSelection();
    statut.hidden = true;
    formulaire.hidden = false;
    mesurer("billetterie_affichee", { mode: "selecteur" });
    // Prêt avant le clic sur « Payer » : les navigateurs n'ouvrent un onglet qu'en réponse directe au clic.
    const { script, stylesheet } = racine.dataset;
    if (script && stylesheet) chargerScriptPretix(script, stylesheet, false).catch(() => {});
  };

  // Sélection gardée d'une visite précédente : chargement immédiat, pour afficher la barre fixe
  // dès l'arrivée. Sinon, à l'approche de la billetterie.
  if (lireSelection().size > 0) {
    void demarrer();
    return;
  }
  const observateur = new IntersectionObserver(
    (entrees) => {
      if (!entrees.some((entree) => entree.isIntersecting)) return;
      observateur.disconnect();
      void demarrer();
    },
    { rootMargin: "150% 0px" },
  );
  observateur.observe(racine);
}
