# Brancher le formulaire de pré-réservation

Le formulaire est terminé côté site, mais **inerte** : il valide la saisie et affiche un
avis, sans rien envoyer. Il le restera tant que `endpointFormulaire` vaut `null` dans
`src/data/evenement.ts`.

Ces étapes créent l'endpoint qui enregistre chaque inscription dans un Google Sheet et
notifie `contact@dernieresseances.fr`.

> Utiliser un compte Google que **l'association** maîtrise, pas le compte personnel d'un
> membre : le fichier des inscrits doit survivre au départ de son propriétaire.

## 1. Coller le script dans le fichier

Le classeur de destination existe déjà — son lien est conservé hors du dépôt, ce dernier
étant public ; demander l'accès au bureau de l'association.

Aucun identifiant n'est à renseigner dans le code : le script s'attache au classeur dans
lequel il est collé, et y crée l'onglet dont il a besoin.

1. Ouvrir ce classeur.
2. Menu **Extensions → Apps Script**.
3. Supprimer le contenu de `Code.gs` et y coller l'intégralité de `docs/pre-reservations.gs`.
4. Enregistrer.

## 2. Déployer

1. Bouton **Déployer → Nouveau déploiement**.
2. Type : **Application web**.
3. *Exécuter en tant que* : **moi**.
4. *Qui a accès* : **Tout le monde**. C'est indispensable — le site est public et poste
   sans authentification. Cela n'expose que cet endpoint, jamais le fichier.
5. Déployer, puis **autoriser** l'accès demandé (écriture dans le fichier, envoi de mails).
   Google affiche un avertissement « application non vérifiée » : passer par
   *Paramètres avancés → Accéder à …*, c'est votre propre script.
6. Copier l'**URL de l'application web**, de la forme
   `https://script.google.com/macros/s/……/exec`.

## 3. Vérifier avant de brancher

Ouvrir l'URL copiée dans un navigateur. Elle doit répondre :

```json
{"ok":true,"message":"Endpoint des pré-réservations opérationnel."}
```

Si Google demande une connexion, c'est que l'étape 2.4 n'est pas sur « Tout le monde ».

## 4. Activer côté site

Dans `src/data/evenement.ts`, remplacer :

```ts
export const endpointFormulaire: string | null = null;
```

par l'URL copiée, entre guillemets. Puis tester un envoi réel depuis la page : une ligne
doit apparaître dans l'onglet *Pré-réservations* et un mail arriver.

## Ce que fait le script

- **Le fichier est la source de vérité.** La ligne est écrite d'abord, le mail ensuite : si
  la notification se perd ou part en spam, l'inscription est quand même enregistrée.
- **Dédoublonnage sur l'e-mail.** Une même adresse qui valide deux fois met à jour sa ligne
  au lieu d'en créer une seconde.
- **Anti-robots.** Le formulaire contient un champ piège invisible (`societe`) ; s'il est
  rempli, la soumission est ignorée silencieusement.
- **Réponse directe.** Le mail porte un `replyTo` vers l'inscrit : « Répondre » lui écrit.
- **Écritures sérialisées** par un verrou, pour que deux envois simultanés ne se marchent
  pas dessus.

## Après modification du script

Tout changement dans l'éditeur Apps Script exige un **nouveau déploiement**
(*Déployer → Gérer les déploiements → crayon → Version : nouvelle*), sinon l'ancienne
version continue de répondre. L'URL, elle, ne change pas.

## RGPD

Vous collectez nom, e-mail et consentement explicite. À tenir :

- accès au Sheet restreint aux membres du bureau qui en ont besoin ;
- suppression de la ligne sur simple demande d'une personne ;
- données utilisées uniquement pour prévenir de l'ouverture de la billetterie, comme
  l'annonce la case à cocher ;
- fichier supprimé une fois l'événement passé et son objet épuisé.
