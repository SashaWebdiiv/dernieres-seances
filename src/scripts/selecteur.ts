import type { Billet, Creneau, ExperienceId, ReponseCreneaux } from "../../api/creneaux";
import { mesurer } from "./consent";
import { chargerScriptPretix, paiementDansNouvelOnglet } from "./pretix";

/**
 * Sélecteur de créneau (`components/ticketing/SelecteurCreneaux.astro`).
 *
 * Les créneaux sont lus à l'approche de la section (`/api/creneaux`), puis relus quand le visiteur
 * change de jour ou d'expérience si les données ont plus d'une minute. Une option n'est jamais
 * reconstruite pendant que le visiteur s'en sert : seules les étapes suivantes le sont (et le focus
 * est rendu à l'option équivalente si la liste courante doit être rafraîchie).
 *
 * Étape 4 : billets du créneau (+ / −), limités aux places restantes (un Duo en compte 2, voir
 * `Billet.places`). « Payer » ouvre le paiement Pretix avec le panier rempli (`PretixWidget.open`),
 * dans un nouvel onglet sur mobile et dans Safari (`paiementDansNouvelOnglet`) ;
 * sans script Pretix, on envoie vers la page Pretix du créneau.
 * Pretix garde le panier (cookie) : des billets ajoutés après une première ouverture s'y ajoutent,
 * d'où l'avertissement affiché ensuite. Il reste modifiable au moment du paiement.
 *
 * Échec (fonction absente, jeton manquant, Pretix indisponible, aucun créneau) : le sélecteur
 * s'efface et le widget Pretix `[data-billetterie-secours]` prend sa place.
 */

const PERIME = 60_000;
const DELAI = 10_000;

interface ExperienceAffichee {
  id: ExperienceId;
  titre: string;
  public: string;
}

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
  const payer = formulaire.querySelector<HTMLButtonElement>("[data-payer]")!;
  const avisPanier = formulaire.querySelector<HTMLElement>("[data-panier]")!;
  const reprendre = formulaire.querySelector<HTMLButtonElement>("[data-reprendre]")!;

  let donnees: ReponseCreneaux | null = null;
  let chargeA = 0;
  const choix: { jour?: string; experience?: ExperienceId; creneau?: number } = {};
  /** Quantité choisie par id de billet, pour l'expérience affichée à l'étape 4. */
  const quantites = new Map<number, number>();
  let billetsAffiches: ExperienceId | undefined;
  let panierOuvert = false;
  /** Créneau du dernier panier ouvert : « Reprendre mon panier » y revient. */
  let dernierCreneau: number | undefined;

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

  const creneauxDu = (jour: string, experience?: ExperienceId): Creneau[] =>
    (donnees?.creneaux ?? []).filter((c) => c.jour === jour && (!experience || c.experience === experience));
  const libres = (creneaux: Creneau[]) => creneaux.filter((c) => c.places !== 0);

  /** Crée une option radio à partir d'un modèle ; `textes` remplit les `[data-texte]`. */
  const creerOption = (nom: string, valeur: string, textes: Record<string, string>, coche: boolean, desactive: boolean) => {
    const fragment = modele(nom).content.cloneNode(true) as DocumentFragment;
    const input = fragment.querySelector("input")!;
    input.value = valeur;
    input.checked = coche && !desactive;
    input.disabled = desactive;
    fragment.querySelectorAll<HTMLElement>("[data-texte]").forEach((span) => {
      span.textContent = textes[span.dataset.texte ?? ""] ?? "";
    });
    return fragment;
  };

  /** Remplace les options d'une étape en rendant le focus à l'option de même valeur. */
  const remplir = (nom: string, fragments: DocumentFragment[]) => {
    const conteneur = options(nom);
    const focus = conteneur.contains(document.activeElement) ? (document.activeElement as HTMLInputElement).value : null;
    conteneur.replaceChildren(...fragments);
    if (focus !== null) conteneur.querySelector<HTMLInputElement>(`input[value="${focus}"]`)?.focus();
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

  const texteDesPlaces = (places: number | null) => {
    if (places === null) return "Disponible";
    if (places === 0) return "Complet";
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
          { heure: heure(c.heure), places: texteDesPlaces(c.places) },
          choix.creneau === c.id,
          c.places === 0,
        ),
      ),
    );
    etape("creneau").hidden = false;
  };

  /** Créneau retenu, s'il appartient au jour et à l'expérience affichés et n'est pas complet. */
  const creneauChoisi = () =>
    donnees?.creneaux.find(
      (c) => c.id === choix.creneau && c.jour === choix.jour && c.experience === choix.experience && c.places !== 0,
    );
  const billetsDe = (experience: ExperienceId) => (donnees?.billets ?? []).filter((b) => b.experience === experience);
  const placesChoisies = () =>
    (donnees?.billets ?? []).reduce((somme, b) => somme + (quantites.get(b.id) ?? 0) * b.places, 0);
  const peutAjouter = (billet: Billet, creneau: Creneau) => {
    const quantite = quantites.get(billet.id) ?? 0;
    if (billet.max !== null && quantite >= billet.max) return false;
    return creneau.places === null || placesChoisies() + billet.places <= creneau.places;
  };

  /** Met à jour compteurs, boutons + / −, total et bouton de paiement (sans reconstruire la liste). */
  const actualiserBillets = () => {
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
    const personnes = placesChoisies();
    const complet = creneau.places !== null && personnes >= creneau.places;
    total.textContent =
      nombre === 0
        ? "Aucun billet choisi"
        : `${pluriel(personnes, "personne")} · ${euros(montant)}${complet ? " · créneau complet avec votre sélection" : ""}`;
    payer.disabled = nombre === 0;
    payer.textContent =
      nombre === 0 ? "Choisir au moins un billet" : panierOuvert ? `Ajouter au panier · ${euros(montant)}` : `Payer ${euros(montant)}`;
  };

  const construireBillets = (experience: ExperienceId) => {
    quantites.clear();
    billetsAffiches = experience;
    options("billets").replaceChildren(
      ...billetsDe(experience).map((billet) => {
        const fragment = modele("billet").content.cloneNode(true) as DocumentFragment;
        fragment.querySelector("li")!.dataset.billet = String(billet.id);
        fragment.querySelector('[data-texte="nom"]')!.textContent = billet.nom;
        fragment.querySelector('[data-texte="detail"]')!.textContent =
          billet.places > 1 ? `${euros(billet.prix)} · ${billet.places} places` : euros(billet.prix);
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
    const experience = experiences.find((e) => e.id === creneau.experience);
    recapitulatif.textContent = `${majuscule(premier(jourComplet.format(date(creneau.jour))))} · ${experience?.titre ?? ""} · ${heure(creneau.heure)}`;
    if (billetsAffiches !== creneau.experience) construireBillets(creneau.experience);
    // Sélection trop grande pour ce créneau (changement de créneau) : on repart de zéro.
    else if (creneau.places !== null && placesChoisies() > creneau.places) quantites.clear();
    actualiserBillets();
    bloc.hidden = false;
    if (defiler) {
      const doux = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      bloc.scrollIntoView({ block: "nearest", behavior: doux ? "smooth" : "auto" });
    }
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

  payer.addEventListener("click", () => {
    const creneau = creneauChoisi();
    const billets = [...quantites].filter(([, quantite]) => quantite > 0);
    if (!creneau || billets.length === 0) return;
    const montant = billets.reduce((somme, [id, q]) => somme + q * (donnees?.billets.find((b) => b.id === id)?.prix ?? 0), 0);
    mesurer("billetterie_redirection", {
      experience: creneau.experience,
      jour: creneau.jour,
      heure: creneau.heure,
      personnes: String(placesChoisies()),
      montant: String(montant),
    });
    const pretix = window.PretixWidget;
    if (!pretix?.open) {
      // Script Pretix indisponible (bloqueur, réseau) : page du créneau, billets à y choisir.
      window.location.assign(new URL(`${creneau.id}/`, boutique).href);
      return;
    }
    pretix.open(
      boutique,
      null,
      String(creneau.id),
      billets.map(([id, quantite]) => ({ item: `item_${id}`, count: String(quantite) })),
      undefined,
      false,
      paiementDansNouvelOnglet(),
    );
    // Pretix garde ce panier : une nouvelle sélection s'y ajoutera.
    panierOuvert = true;
    dernierCreneau = creneau.id;
    avisPanier.hidden = false;
    quantites.clear();
    actualiserBillets();
  });

  // Sans billet, `PretixWidget.open` n'ajoute rien et rouvre le panier en cours (fenêtre sur
  // ordinateur ; page Pretix du créneau, panier compris, dans un nouvel onglet sinon).
  reprendre.addEventListener("click", () => {
    const creneau = dernierCreneau === undefined ? null : String(dernierCreneau);
    if (window.PretixWidget?.open) {
      window.PretixWidget.open(boutique, null, creneau, [], undefined, false, paiementDansNouvelOnglet());
    }
    else window.location.assign(new URL(creneau ? `${creneau}/` : "", boutique).href);
    mesurer("billetterie_reprise_panier");
  });

  const demarrer = async () => {
    if (!(await charger())) return echec("donnees");
    if (donnees!.creneaux.length === 0) return echec("vide");
    afficherJours();
    statut.hidden = true;
    formulaire.hidden = false;
    mesurer("billetterie_affichee", { mode: "selecteur" });
    // Prêt avant le clic sur « Payer » : les navigateurs n'ouvrent un onglet qu'en réponse directe au clic.
    const { script, stylesheet } = racine.dataset;
    if (script && stylesheet) chargerScriptPretix(script, stylesheet, false).catch(() => {});
  };

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
