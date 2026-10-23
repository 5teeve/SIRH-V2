# Cahier des charges — SIRH (gestion des ressources humaines)

Équipe : Steeve, Tanteraka, Tsimbina · Version 1 (conception) · 19/10/2026

## 1. Présentation

Application web de gestion des ressources humaines qui suit une personne depuis l'expression du besoin en personnel jusqu'à son intégration dans l'entreprise. Chaque mouvement est tracé.

## 2. Périmètre

**Inclus : 4 blocs.**

1. Expression du besoin en personnel
2. Recrutement
3. Sélection et embauche
4. Contrat et onboarding

**Exclus :** paie, congés, gestion des temps, évaluation annuelle, rupture de contrat.

## 3. Acteurs

- **Manager** : exprime les besoins de son service.
- **RH** : pilote tout le processus.
- **Finance** : valide le budget.
- **Direction (DG)** : valide en dernier.
- **Candidat** : consulte les offres et postule (pages publiques, sans compte).
- **Admin** : gère utilisateurs, listes de valeurs, paramètres, journal.

## 4. Exigences transversales

- **ET1 Accès** : connexion, un rôle par utilisateur, chaque écran et action contrôlés par rôle.
- **ET2 Traçabilité** : chaque création, modification, changement de statut, validation ou génération de document est journalisé (qui, quoi, quand, valeur avant, valeur après, commentaire).
- **ET3 Historique conservé** : aucune suppression physique, suppression logique seulement. Les données validées ou signées ne sont plus modifiées : on crée une nouvelle version.
- **ET4 Statuts** : chaque élément suivi avance par statuts, avec des transitions autorisées selon le rôle. Un motif est obligatoire pour tout refus, renvoi, mise en attente ou annulation.
- **ET5 Notifications** : message interne envoyé aux personnes concernées à chaque étape qui les concerne.
- **ET6 Documents** : téléversement, téléchargement, versions, rattachement à un candidat, un employé ou un contrat.
- **ET7 Listes de valeurs et paramètres** : types de contrat, motifs, lieux, types de tests et de documents, réglages (format du matricule, délais, limites de renouvellement) modifiables par l'Admin.
- **ET8 Consultation** : toute liste est paginée, triable, filtrable et recherchable.
- **ET9 Saisie** : validation des champs et messages d'erreur clairs.
- **ET10 Historique visible** : chaque fiche affiche sa chronologie (qui a fait quoi, quand, avant → après). Un journal global est consultable par RH et Admin, avec export.

## 5. Bloc 1 — Expression du besoin en personnel

**EF1.1 Organisation.** Gérer les départements, les services et les postes. Un poste existe indépendamment de tout employé. Un poste a : code, intitulé, département, service, description, compétences, fourchette salariale, effectif autorisé, statut. Les effectifs pourvu et vacant sont calculés.

**EF1.2 Créer une demande de recrutement** (Manager) : type (création de poste ou remplacement), poste, département, service, nombre de postes, motif, justification, type de contrat souhaité, date souhaitée, urgence, budget estimé. En cas de remplacement : référence de l'ancien titulaire.

**EF1.3 Brouillon et soumission.** La demande reste modifiable en brouillon. Une fois soumise, elle est verrouillée, sauf si elle est renvoyée au manager.

**EF1.4 Circuit de validation.** BROUILLON → SOUMISE → VALIDEE\_RH → VALIDEE\_FINANCE → VALIDEE\_DIRECTION → OUVERTE. Chaque valideur n'agit que sur son étape, dans l'ordre.

**EF1.5 Sorties à chaque étape de validation** (RH, Finance, Direction) :

- **Renvoyer** (A\_REVOIR) : retour au manager pour correction, commentaire obligatoire.
- **Rejeter** (REJETEE) : refus définitif, motif obligatoire.
- **Mettre en attente de budget** (EN\_ATTENTE\_BUDGET) : besoin légitime, budget indisponible, date de réexamen. La demande reprend à l'étape Finance lors du déblocage.

**EF1.6 Motifs de refus attendus.**

- RH : besoin non justifié, effectif autorisé atteint, poste déjà pourvu, doublon.
- Finance : budget insuffisant (renvoyer pour ajustement, mettre en attente ou rejeter).
- Direction : non-conformité aux priorités, arbitrage entre demandes, budget global dépassé.

**EF1.7 Annulation.** Le manager peut annuler une demande non encore OUVERTE, motif obligatoire (ANNULEE).

**EF1.8 Suivi.** Le manager voit ses demandes, leur statut et l'étape en cours. Chaque valideur a une file des demandes qui l'attendent. Le manager est notifié de toute décision, avec motif et nom du valideur.

**EF1.9 Fin de circuit.** À la validation finale, la demande passe à OUVERTE et la RH est notifiée pour créer l'offre.

## 6. Bloc 2 — Recrutement

**EF2.1 Offre d'emploi.** Créée par la RH à partir d'une demande OUVERTE, pré-remplie : titre, missions, profil, compétences, type de contrat, lieu, salaire (affiché ou non), nombre de postes, date de clôture. Statuts : BROUILLON, PUBLIEE, CLOTUREE, POURVUE, ANNULEE. Clôture automatique à la date limite.

**EF2.2 Page publique.** Liste des offres publiées avec recherche et filtres (département, lieu, contrat). Détail d'une offre et formulaire de candidature (CV, lettre, diplômes).

**EF2.3 Candidat.** Une seule fiche par personne : identité, CIN, email, téléphone, adresse, CV, diplômes. Détection de doublon (email, CIN, nom + date de naissance) pour réutiliser la fiche existante.

**EF2.4 Candidature.** Lie un candidat à une offre. Un candidat peut avoir plusieurs candidatures. Statuts : REÇUE, PRESELECTIONNEE, EN\_ENTRETIEN, EN\_TEST, RETENUE, PROPOSITION\_ENVOYEE, ACCEPTEE ; sorties REFUSEE, RETIREE, REFUSE\_PAR\_CANDIDAT.

**EF2.5 Présélection.** Liste des candidatures par offre, grille de critères pondérés, décision présélectionné ou refusé avec motif.

**EF2.6 Entretiens et tests.** Planification : type (entretien RH, technique, test écrit, test pratique), date et heure, lieu, intervieweurs. Statuts : PLANIFIE, REALISE, ANNULE, REPORTE. Blocage si un intervieweur ou une salle est déjà pris au même moment.

**EF2.7 Évaluation.** Pour chaque étape et chaque évaluateur : notes par critère, commentaire, recommandation (FAVORABLE, RESERVE, DEFAVORABLE). Une évaluation validée est verrouillée.

**EF2.8 Décision finale.** Consolidation des évaluations (moyenne pondérée), classement des candidats, décision motivée (retenu ou refusé).

**EF2.9 Communications.** Convocations et refus générés depuis des modèles et journalisés.

## 7. Bloc 3 — Sélection et embauche

**EF3.1 Proposition d'embauche** pour le candidat retenu : poste, salaire, type de contrat, date de début, horaires, lieu de travail, période d'essai, avantages, date limite de réponse. Chaque renégociation crée une nouvelle version.

**EF3.2 Réponse du candidat** : ACCEPTEE, REFUSEE ou NEGOCIATION. En cas de refus, la candidature est clôturée et le candidat classé suivant est proposé.

**EF3.3 Création automatique à l'acceptation**, en une seule opération tout-ou-rien :

- création du dossier Employé ;
- création du Contrat (état CREE) ;
- création de l'Affectation ;
- génération du PDF du contrat avec numéro unique ;
- mise à jour des places vacantes ; si toutes sont pourvues, l'offre passe à POURVUE et la demande est clôturée.

**EF3.4 Contenu du contrat de travail.** Parties (employeur et salarié avec identité complète), poste et fonction, type de contrat, date de début, date de fin (CDD), période d'essai, rémunération, durée et horaires de travail, lieu de travail, clauses (confidentialité, préavis, règlement intérieur), date, lieu et zones de signature.

**EF3.5 Dossier salarié.** Le candidat et l'employé sont deux entités distinctes, reliées par l'origine. L'employé garde la référence de sa candidature d'origine.

**EF3.6 Pièces du dossier.** CIN, diplômes, photo, RIB et autres pièces obligatoires, avec statut (en attente, reçu, validé).

## 8. Bloc 4 — Contrat et onboarding

**EF4.1 Contrats d'un salarié.** Un salarié peut avoir plusieurs contrats successifs. Le type de contrat courant se déduit du contrat actif.

**EF4.2 États du contrat.** CREE → SIGNE → VALIDE ; sorties possibles TERMINE, ANNULE, RENOUVELE. Motif obligatoire pour annuler.

**EF4.3 Signature.** Téléversement du PDF signé et de la date de signature. Le matricule est généré lors de la signature du premier contrat.

**EF4.4 Renouvellement.** Renouvellement, avenant ou passage CDD → CDI : un nouveau contrat est créé et lié au précédent, l'ancien est terminé.

**EF4.5 Affectations.** Un employé occupe un poste sur une période, avec service, lieu et motif (embauche, mutation, promotion). Un changement clôture l'ancienne affectation et en crée une nouvelle. L'historique est conservé.

**EF4.6 Onboarding.** Une checklist est générée automatiquement à l'acceptation de l'embauche selon le poste et le contrat : contrat signé, badge, compte, matériel, formation, inscription paie, etc.

**EF4.7 Tâches d'onboarding.** Libellé, responsable (RH, IT, Logistique, Manager, Paie), échéance, statut (A\_FAIRE, EN\_COURS, FAIT, BLOQUEE), commentaire, pièce jointe, dépendances. Chaque responsable voit « ses » tâches.

**EF4.8 Avancement.** Pourcentage d'avancement de l'onboarding. Il ne se clôture que lorsque les tâches obligatoires sont faites.

**EF4.9 Alertes d'échéance.** Fin de CDD et fin de période d'essai notifiées à l'avance.

## 9. Règles de gestion

- **RG01** Un poste existe sans employé.
- **RG02** Une demande n'est plus modifiable après soumission, sauf si elle est renvoyée.
- **RG03** Un valideur agit seulement sur son étape, dans l'ordre.
- **RG04** Tout refus, renvoi, mise en attente ou annulation exige un motif.
- **RG05** Après un renvoi, la demande repart de la première étape de validation (à confirmer).
- **RG06** Une offre naît d'une demande OUVERTE uniquement.
- **RG07** Un candidat est unique ; il peut avoir plusieurs candidatures.
- **RG08** Un candidat n'est pas un employé.
- **RG09** Un intervieweur ou une salle ne peut pas être sur deux entretiens simultanés.
- **RG10** Une évaluation validée est verrouillée ; toute correction crée une nouvelle version.
- **RG11** Une proposition d'embauche est versionnée.
- **RG12** L'acceptation crée employé, contrat, affectation et PDF en une opération indivisible.
- **RG13** Le type de contrat n'est jamais stocké sur l'employé.
- **RG14** Un employé a un seul contrat actif à la fois, sans chevauchement de dates.
- **RG15** Le matricule est généré à la signature du premier contrat ; il est unique, séquentiel et jamais réutilisé.
- **RG16** Un employé a un seul poste principal actif.
- **RG17** Aucune suppression physique.
- **RG18** Tout changement est écrit au journal des mouvements.
- **RG19** Un onboarding ne se clôture que si les tâches obligatoires sont faites.
- **RG20** Les renouvellements de CDD respectent les limites paramétrées.

## 10. Données à gérer (29 entités)

- **Transverse (12)** : Utilisateur, Référentiel, Paramètre, Notification, Mouvement, Transition, Document, Grille, Critère, Modèle de checklist, Élément de modèle, Échéance.
- **Bloc 1 (4)** : Unité (département/service), Poste, Demande de recrutement, Validation.
- **Bloc 2 (7)** : Offre d'emploi, Candidat, Candidature, Entretien, Participant d'entretien, Évaluation, Note.
- **Bloc 3 (4)** : Proposition d'embauche, Employé, Contrat, Affectation.
- **Bloc 4 (2)** : Onboarding, Tâche d'onboarding.

## 11. Écrans de base (environ 41, à réduire par généralisation)

- **Transverse** : login, erreurs, utilisateurs, listes de valeurs, paramètres, notifications, journal global.
- **Bloc 1** : départements, services, postes, mes demandes, formulaire de demande, détail de demande, file de validation.
- **Bloc 2** : offres, détail d'offre, pages publiques (liste, détail + postuler), candidats, fiche candidat, candidatures, détail de candidature, présélection, entretiens, évaluation, décision finale.
- **Bloc 3** : proposition d'embauche, détail et versions, réponse du candidat, fiche employé, modèle de contrat, documents du dossier, aperçu du PDF.
- **Bloc 4** : contrats d'un salarié, détail de contrat, signature, renouvellement, affectations, onboarding, mes tâches, modèles d'onboarding.

## 12. Fonctions complémentaires (optionnelles)

- **Bloc 1** : délai cible par étape avec alerte, vérification d'effectif, délégation de validation, duplication de demande.
- **Bloc 2** : tableau Kanban des candidatures, score de correspondance CV/offre, entonnoir de recrutement, calendrier des entretiens, comparateur de candidats, vivier de talents, anonymisation après délai.
- **Bloc 3** : alerte salaire hors fourchette, lien sécurisé de réponse du candidat, aperçu du contrat avec filigrane, contrôle de complétude du dossier, annulation tracée d'une embauche.
- **Bloc 4** : frise chronologique du salarié, fiche salarié exportable en PDF, tableau de bord RH, rappels automatiques, modèles d'onboarding par poste.

## 13. Contraintes

- Application web, interface en français.
- Technologie : à définir par l'équipe.
- Mentions légales du contrat, durée d'essai et limites de renouvellement CDD : à vérifier dans le Code du travail malgache ; paramétrables.
- Travail à trois, un bloc à la fois, en parallèle.

## 14. Livrables

- Application fonctionnelle couvrant les 4 blocs.
- Base de données et scripts de création.
- Dossier de conception : modèle de données, diagrammes d'états, règles de gestion.
- Jeu de données de démonstration et scénario de démo.
- Manuel utilisateur.

## 15. Critères d'acceptation

Le scénario suivant se déroule sans rupture : un manager crée une demande, la RH, la Finance et le DG la valident, l'offre est publiée, un candidat postule, il est présélectionné, passe entretien et test, reçoit des évaluations, est retenu, reçoit une proposition et accepte. Le dossier employé, le contrat et l'affectation sont créés avec le PDF. Le contrat est signé, le matricule généré, le contrat validé et l'onboarding terminé. À chaque étape, une ligne existe dans le journal des mouvements et la chronologie de la fiche est complète.

## 16. Points ouverts

- Après un renvoi, la demande repart-elle de la RH ou revient-elle à l'étape qui l'a renvoyée ?
- Garde-t-on le statut EN\_ATTENTE\_BUDGET ou le fusionne-t-on avec le rejet ?
- Technologie retenue.
- Date de rendu et modalités de soutenance.
