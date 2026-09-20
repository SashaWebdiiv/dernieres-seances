/**
 * Dernières Séances 2026 — réception des pré-réservations.
 *
 * À coller dans le Google Sheet qui doit recevoir les inscriptions :
 * Extensions → Apps Script, puis suivre docs/brancher-le-formulaire.md.
 *
 * Le script enregistre d'abord la ligne — le fichier est la source de vérité —
 * puis envoie la notification. Si le mail échoue, l'inscription reste enregistrée.
 */

const DESTINATAIRE = "contact@dernieresseances.fr";
const NOM_FEUILLE = "Pré-réservations";
const ENTETES = [
  "Horodatage",
  "Prénom et nom",
  "E-mail",
  "Expérience",
  "Adultes",
  "Enfants",
  "Consentement",
];

function doPost(requete) {
  const verrou = LockService.getScriptLock();

  try {
    // Deux envois simultanés écriraient sur la même ligne sans ce verrou.
    verrou.waitLock(20000);

    const champs = (requete && requete.parameter) || {};

    // Champ piège : invisible pour un visiteur, souvent rempli par les robots.
    // On répond « ok » sans rien enregistrer, pour ne pas leur signaler le filtre.
    if (champs.societe) {
      return json({ ok: true });
    }

    const email = String(champs.email || "").trim().toLowerCase();
    if (!email || !champs.prenomNom) {
      return json({ ok: false, erreur: "Champs obligatoires manquants." });
    }

    const ligne = [
      new Date(),
      String(champs.prenomNom || "").trim(),
      email,
      String(champs.experience || "").trim(),
      Number(champs.adultes || 0),
      Number(champs.enfants || 0),
      champs.consentement ? "oui" : "non",
    ];

    const feuille = feuilleCible_();
    const existante = rechercherEmail_(feuille, email);
    const misAJour = existante > 0;

    if (misAJour) {
      // Même adresse : on remplace la ligne plutôt que d'accumuler les doublons.
      feuille.getRange(existante, 1, 1, ligne.length).setValues([ligne]);
    } else {
      feuille.appendRow(ligne);
    }

    notifier_(ligne, misAJour);
    return json({ ok: true });
  } catch (erreur) {
    return json({ ok: false, erreur: String(erreur) });
  } finally {
    verrou.releaseLock();
  }
}

/** Permet de vérifier dans un navigateur que le déploiement répond bien. */
function doGet() {
  return json({ ok: true, message: "Endpoint des pré-réservations opérationnel." });
}

function feuilleCible_() {
  const classeur = SpreadsheetApp.getActiveSpreadsheet();
  let feuille = classeur.getSheetByName(NOM_FEUILLE);

  if (!feuille) {
    feuille = classeur.insertSheet(NOM_FEUILLE);
    feuille.appendRow(ENTETES);
    feuille.getRange(1, 1, 1, ENTETES.length).setFontWeight("bold");
    feuille.setFrozenRows(1);
  }

  return feuille;
}

function rechercherEmail_(feuille, email) {
  const dernière = feuille.getLastRow();
  if (dernière < 2) return 0;

  const colonne = feuille.getRange(2, 3, dernière - 1, 1).getValues();
  for (let i = 0; i < colonne.length; i++) {
    if (String(colonne[i][0]).trim().toLowerCase() === email) return i + 2;
  }
  return 0;
}

function notifier_(ligne, misAJour) {
  const [, prenomNom, email, experience, adultes, enfants] = ligne;

  const corps = [
    misAJour
      ? "Pré-réservation mise à jour (cette adresse était déjà inscrite)."
      : "Nouvelle pré-réservation.",
    "",
    "Nom        : " + prenomNom,
    "E-mail     : " + email,
    "Expérience : " + experience,
    "Adultes    : " + adultes,
    "Enfants    : " + enfants,
    "",
    "Répondre à ce message écrit directement à la personne.",
  ].join("\n");

  MailApp.sendEmail({
    to: DESTINATAIRE,
    replyTo: email,
    subject: (misAJour ? "[MAJ] " : "") + "Pré-réservation — " + prenomNom,
    body: corps,
  });
}

function json(charge) {
  return ContentService.createTextOutput(JSON.stringify(charge)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
