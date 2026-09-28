/**
 * Mesure d'audience : Google Analytics 4, chargé uniquement après consentement (CNIL).
 *
 * `gaMeasurementId` : identifiant de mesure du flux Web GA4 (« G-XXXXXXXXXX »).
 * `null` : aucune mesure et aucun bandeau (le bandeau n'existe que s'il y a un traceur).
 */
export const gaMeasurementId: string | null = null;

/** Domaines mesurés : ni le développement local ni les aperçus Vercel ne remontent de données. */
export const domainesMesures = ["dernieresseances.fr", "www.dernieresseances.fr"];

/** Durée de conservation du choix (accepter ou refuser), recommandée par la CNIL : 6 mois. */
export const dureeChoixJours = 182;

/** Durée de vie maximale des cookies Google Analytics : 13 mois (CNIL), en secondes. */
export const dureeCookiesSecondes = 13 * 30 * 24 * 60 * 60;
