/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Utilisateur,
  Departement,
  Service,
  Poste,
  DemandeRecrutement,
  OffreEmploi,
  Candidat,
  Candidature,
  Entretien,
  Evaluation,
  PropositionEmbauche,
  Contrat,
  PieceDossier,
  Employe,
  Affectation,
  Onboarding,
  TacheOnboarding,
  JournalMouvement,
  NotificationItem,
  Parametre,
  Referentiel,
  UserRole,
  DecisionValidation,
  TypeContrat
} from '../types/sirh';

// Mock initial data matching 08_seed_data.sql
const INITIAL_USERS: Utilisateur[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    matricule: 'EMP-2024-0001',
    nom: 'Système',
    prenom: 'Admin',
    email: 'admin@sirh-entreprise.mg',
    role: 'ADMIN',
    actif: true,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    matricule: 'EMP-2024-0010',
    nom: 'Randria',
    prenom: 'Steeve',
    email: 'manager.tech@sirh-entreprise.mg',
    role: 'MANAGER',
    departement_id: 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    service_id: 'srv-0001-0000-0000-000000000001',
    actif: true,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    matricule: 'EMP-2024-0012',
    nom: 'Rasoa',
    prenom: 'Tanteraka',
    email: 'rh.recrutement@sirh-entreprise.mg',
    role: 'RH',
    departement_id: 'bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    actif: true,
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    matricule: 'EMP-2024-0005',
    nom: 'Andria',
    prenom: 'Tsimbina',
    email: 'finance.controle@sirh-entreprise.mg',
    role: 'FINANCE',
    departement_id: 'cccc3333-cccc-cccc-cccc-cccccccccccc',
    actif: true,
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    matricule: 'EMP-2024-0002',
    nom: 'Rajaonah',
    prenom: 'Hery',
    email: 'direction.dg@sirh-entreprise.mg',
    role: 'DIRECTION',
    actif: true,
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    matricule: 'EMP-2026-0001',
    nom: 'Ranaivo',
    prenom: 'Mamy',
    email: 'mamy.ranaivo@sirh-entreprise.mg',
    role: 'EMPLOYE',
    departement_id: 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    service_id: 'srv-0001-0000-0000-000000000001',
    actif: true,
  },
];

const INITIAL_DEPARTEMENTS: Departement[] = [
  {
    id: 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    code: 'DEP-TECH',
    nom: 'Direction Technique & Systèmes',
    description: 'Ingénierie logicielle, infrastructures cloud et architectures sécurisées.',
    responsable_id: '22222222-2222-2222-2222-222222222222',
  },
  {
    id: 'bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    code: 'DEP-RH',
    nom: 'Ressources Humaines & Talents',
    description: 'Acquisition des talents, formation continue et relations sociales.',
    responsable_id: '33333333-3333-3333-3333-333333333333',
  },
  {
    id: 'cccc3333-cccc-cccc-cccc-cccccccccccc',
    code: 'DEP-FIN',
    nom: 'Direction Financière & Contrôle',
    description: 'Pilotage budgétaire, trésorerie et conformité fiscale.',
    responsable_id: '44444444-4444-4444-4444-444444444444',
  },
];

const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-0001-0000-0000-000000000001',
    departement_id: 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    code: 'SRV-DEV',
    nom: 'Développement Web & Cloud',
    description: 'Équipe applicative moderne (React, Node, Postgres).',
    responsable_id: '22222222-2222-2222-2222-222222222222',
  },
  {
    id: 'srv-0002-0000-0000-000000000002',
    departement_id: 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    code: 'SRV-DEVOPS',
    nom: 'Infrastructures & SRE',
    description: 'Maintenance des clusters, CI/CD et sécurité.',
    responsable_id: '22222222-2222-2222-2222-222222222222',
  },
  {
    id: 'srv-0003-0000-0000-000000000003',
    departement_id: 'bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    code: 'SRV-REC',
    nom: 'Recrutement & Marque Employeur',
    description: 'Pôle d’attraction et d’onboarding des collaborateurs.',
    responsable_id: '33333333-3333-3333-3333-333333333333',
  },
];

const INITIAL_POSTES: Poste[] = [
  {
    id: 'post-0001-0000-0000-000000000001',
    code: 'PST-DEV-FS',
    intitule: 'Ingénieur Full-Stack Senior (TypeScript / PostgreSQL)',
    departement_id: 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    service_id: 'srv-0001-0000-0000-000000000001',
    description: 'Développement et architecture des applications SIRH et SaaS critiques.',
    competences_requises: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    fourchette_salaire_min: 3500000,
    fourchette_salaire_max: 5500000,
    effectif_autorise: 4,
    effectif_pourvu: 2,
    statut: 'ACTIF',
  },
  {
    id: 'post-0002-0000-0000-000000000002',
    code: 'PST-DEVOPS',
    intitule: 'Ingénieur DevOps & Cloud Architect',
    departement_id: 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    service_id: 'srv-0002-0000-0000-000000000002',
    description: 'Supervision des environnements cloud, conteneurs et pipelines CI/CD.',
    competences_requises: ['Kubernetes', 'Terraform', 'Linux', 'AWS/GCP', 'PostgreSQL'],
    fourchette_salaire_min: 4000000,
    fourchette_salaire_max: 6000000,
    effectif_autorise: 2,
    effectif_pourvu: 1,
    statut: 'ACTIF',
  },
  {
    id: 'post-0003-0000-0000-000000000003',
    code: 'PST-RH-REC',
    intitule: 'Chargé(e) de Recrutement & Expérience Collaborateur',
    departement_id: 'bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    service_id: 'srv-0003-0000-0000-000000000003',
    description: 'Pilotage des campagnes de sourcing, des entretiens et de l’intégration.',
    competences_requises: ['Sourcing', 'Conduite d’entretiens', 'Droit social malgache', 'SIRH'],
    fourchette_salaire_min: 2200000,
    fourchette_salaire_max: 3400000,
    effectif_autorise: 3,
    effectif_pourvu: 2,
    statut: 'ACTIF',
  },
];

const INITIAL_DEMANDES: DemandeRecrutement[] = [
  {
    id: 'dem-0001-0000-0000-000000000001',
    numero: 'DEM-2026-0001',
    type: 'CREATION',
    demandeur_id: '22222222-2222-2222-2222-222222222222',
    demandeur_nom: 'Steeve Randria',
    poste_id: 'post-0001-0000-0000-000000000001',
    departement_id: 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    service_id: 'srv-0001-0000-0000-000000000001',
    nombre_postes: 1,
    motif: 'Création de poste pour accélérer le delivery de la plateforme SIRH',
    justification: 'Charge de travail accrue suite au gain de 3 nouveaux contrats majeurs en 2026.',
    type_contrat_souhaite: 'CDI',
    date_souhaitee: '2026-11-15',
    urgence: 'URGENTE',
    budget_estime: 4800000,
    statut: 'OUVERTE',
    etape_validation_actuelle: 'CLOTURE',
    validations: [
      {
        id: 'val-1',
        demande_id: 'dem-0001-0000-0000-000000000001',
        etape: 'RH',
        valideur_id: '33333333-3333-3333-3333-333333333333',
        valideur_nom: 'Tanteraka Rasoa (RH)',
        decision: 'VALIDER',
        commentaire: 'Effectif autorisé respecté et compétences validées.',
        created_at: '2026-10-05T09:00:00Z',
      },
      {
        id: 'val-2',
        demande_id: 'dem-0001-0000-0000-000000000001',
        etape: 'FINANCE',
        valideur_id: '44444444-4444-4444-4444-444444444444',
        valideur_nom: 'Tsimbina Andria (Finance)',
        decision: 'VALIDER',
        commentaire: 'Enveloppe budgétaire approuvée pour l’exercice.',
        created_at: '2026-10-06T14:30:00Z',
      },
      {
        id: 'val-3',
        demande_id: 'dem-0001-0000-0000-000000000001',
        etape: 'DIRECTION',
        valideur_id: '55555555-5555-5555-5555-555555555555',
        valideur_nom: 'Hery Rajaonah (DG)',
        decision: 'VALIDER',
        commentaire: 'Feu vert pour publication de l’offre.',
        created_at: '2026-10-07T10:15:00Z',
      },
    ],
    created_at: '2026-10-04T08:00:00Z',
    updated_at: '2026-10-07T10:15:00Z',
  },
  {
    id: 'dem-0002-0000-0000-000000000002',
    numero: 'DEM-2026-0002',
    type: 'REMPLACEMENT',
    demandeur_id: '22222222-2222-2222-2222-222222222222',
    demandeur_nom: 'Steeve Randria',
    poste_id: 'post-0002-0000-0000-000000000002',
    departement_id: 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    service_id: 'srv-0002-0000-0000-000000000002',
    nombre_postes: 1,
    motif: 'Départ du collaborateur titulaire de l’infrastructure',
    justification: 'Poste critique pour assurer la continuité opérationnelle des serveurs 24/7.',
    type_contrat_souhaite: 'CDI',
    date_souhaitee: '2026-12-01',
    urgence: 'NORMALE',
    budget_estime: 5200000,
    ancien_titulaire_ref: 'EMP-2023-0009',
    statut: 'VALIDEE_RH',
    etape_validation_actuelle: 'FINANCE',
    validations: [
      {
        id: 'val-4',
        demande_id: 'dem-0002-0000-0000-000000000002',
        etape: 'RH',
        valideur_id: '33333333-3333-3333-3333-333333333333',
        valideur_nom: 'Tanteraka Rasoa (RH)',
        decision: 'VALIDER',
        commentaire: 'Remplacement justifié par départ effectif le 30 novembre.',
        created_at: '2026-10-18T11:00:00Z',
      },
    ],
    created_at: '2026-10-17T15:00:00Z',
    updated_at: '2026-10-18T11:00:00Z',
  },
];

const INITIAL_OFFRES: OffreEmploi[] = [
  {
    id: 'off-0001-0000-0000-000000000001',
    reference: 'OFF-2026-0001',
    demande_id: 'dem-0001-0000-0000-000000000001',
    poste_id: 'post-0001-0000-0000-000000000001',
    titre: 'Ingénieur Full-Stack Senior TypeScript & PostgreSQL',
    departement_id: 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    missions: 'Concevoir et déployer les modules critiques du SIRH. Collaborer avec le Tech Lead et optimiser les schémas relationnels PostgreSQL.',
    profil_recherche: 'Formation supérieure en informatique (Bac+5 ou équivalent), 5+ ans d’expérience en TypeScript, React et bases SQL.',
    competences_requises: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    type_contrat: 'CDI',
    lieu: 'Siège Social — Ankorondrano, Antananarivo',
    salaire_affiche: true,
    salaire_min: 4000000,
    salaire_max: 5000000,
    nombre_postes: 1,
    postes_pourvus: 0,
    date_publication: '2026-10-08',
    date_cloture: '2026-11-30',
    statut: 'PUBLIEE',
    cree_par: 'Tanteraka Rasoa',
    created_at: '2026-10-08T09:00:00Z',
  },
];

const INITIAL_CANDIDATS: Candidat[] = [
  {
    id: 'cand-0001-0000-0000-000000000001',
    cin: '101234567890',
    nom: 'Ranaivo',
    prenom: 'Mamy',
    date_naissance: '1995-04-12',
    email: 'mamy.ranaivo@gmail.com',
    telephone: '+261 34 11 222 33',
    adresse: 'Lot IVM 42 Ambohijatovo, Antananarivo',
    cv_url: 'cv_mamy_ranaivo_2026.pdf',
    lettre_motivation_url: 'lm_mamy_ranaivo.pdf',
    titre_actuel: 'Développeur Full-Stack Web',
    annees_experience: 6,
    created_at: '2026-10-09T14:20:00Z',
  },
  {
    id: 'cand-0002-0000-0000-000000000002',
    cin: '101987654321',
    nom: 'Rakotoarisoa',
    prenom: 'Faly',
    date_naissance: '1997-09-24',
    email: 'faly.rakoto@gmail.com',
    telephone: '+261 32 44 555 66',
    adresse: 'Lot II B 18 Ankadifotsy, Antananarivo',
    cv_url: 'cv_faly_rakoto.pdf',
    titre_actuel: 'Ingénieur Logiciel Junior',
    annees_experience: 3,
    created_at: '2026-10-10T11:00:00Z',
  },
];

const INITIAL_CANDIDATURES: Candidature[] = [
  {
    id: 'app-0001-0000-0000-000000000001',
    numero: 'CAN-2026-0001',
    offre_id: 'off-0001-0000-0000-000000000001',
    candidat_id: 'cand-0001-0000-0000-000000000001',
    date_candidature: '2026-10-09T14:25:00Z',
    statut: 'PROPOSITION_ENVOYEE',
    score_preselection: 94.0,
    rang_final: 1,
    commentaires_rh: 'Excellente maîtrise technique démontrée lors de l’entretien et du test pratique PostgreSQL.',
    created_at: '2026-10-09T14:25:00Z',
    updated_at: '2026-10-20T16:00:00Z',
  },
  {
    id: 'app-0002-0000-0000-000000000002',
    numero: 'CAN-2026-0002',
    offre_id: 'off-0001-0000-0000-000000000001',
    candidat_id: 'cand-0002-0000-0000-000000000002',
    date_candidature: '2026-10-10T11:05:00Z',
    statut: 'PRESELECTIONNEE',
    score_preselection: 79.5,
    rang_final: 2,
    commentaires_rh: 'Profil prometteur, candidat gardé en vivier actif.',
    created_at: '2026-10-10T11:05:00Z',
    updated_at: '2026-10-12T10:00:00Z',
  },
];

const INITIAL_ENTRETIENS: Entretien[] = [
  {
    id: 'ent-0001-0000-0000-000000000001',
    candidature_id: 'app-0001-0000-0000-000000000001',
    type: 'ENTRETIEN_TECHNIQUE',
    date_heure_debut: '2026-10-15T09:00:00Z',
    date_heure_fin: '2026-10-15T10:30:00Z',
    salle_ou_lien: 'Salle Turing — Siège Ankorondrano',
    statut: 'REALISE',
    participants_ids: ['22222222-2222-2222-2222-222222222222'],
    created_at: '2026-10-12T10:00:00Z',
  },
];

const INITIAL_EVALUATIONS: Evaluation[] = [
  {
    id: 'eval-0001-0000-0000-000000000001',
    entretien_id: 'ent-0001-0000-0000-000000000001',
    evaluateur_id: '22222222-2222-2222-2222-222222222222',
    evaluateur_nom: 'Steeve Randria (Manager)',
    version: 1,
    est_verrouillee: true,
    date_verrouillage: '2026-10-15T11:00:00Z',
    recommandation: 'FAVORABLE',
    points_forts: 'Très solide compréhension des transactions SQL complexes, design patterns React propres et excellente communication.',
    points_amelioration: 'Ajuster les bonnes pratiques sur le monitoring de conteneurs en production.',
    commentaire_general: 'Candidat de premier ordre, recommandé pour proposition immédiate.',
    notes: [
      { critere_id: 'crit-1', libelle: 'Maîtrise TypeScript & Frameworks', note: 4.8, ponderation: 3 },
      { critere_id: 'crit-2', libelle: 'Requêtes & Indexation PostgreSQL', note: 5.0, ponderation: 3 },
      { critere_id: 'crit-3', libelle: 'Résolution de Problèmes & Algorithmes', note: 4.5, ponderation: 2 },
      { critere_id: 'crit-4', libelle: 'Esprit d’équipe & Communication', note: 4.7, ponderation: 2 },
    ],
    note_moyenne_ponderee: 4.8,
    created_at: '2026-10-15T10:45:00Z',
  },
];

const INITIAL_PROPOSITIONS: PropositionEmbauche[] = [
  {
    id: 'prop-0001-0000-0000-000000000001',
    numero: 'PROP-2026-0001',
    candidature_id: 'app-0001-0000-0000-000000000001',
    poste_id: 'post-0001-0000-0000-000000000001',
    version: 1,
    remuneration_mensuelle: 4800000,
    type_contrat: 'CDI',
    date_debut_prevue: '2026-11-15',
    periode_essai_jours: 90,
    horaires_travail: '40h/semaine (Lundi au Vendredi de 8h à 17h)',
    lieu_travail: 'Siège Social — Ankorondrano, Antananarivo',
    avantages: [
      'Couverture Santé Groupe 100% (OSTIE & privée)',
      'Indemnité de transport & déjeuner',
      'Prime annuelle sur objectifs',
      'Ordinateur portable MacBook Pro M3',
    ],
    date_limite_reponse: '2026-10-31',
    statut: 'PROPOSEE',
    emise_par: 'Tanteraka Rasoa',
    created_at: '2026-10-20T16:00:00Z',
  },
];

const INITIAL_JOURNAL: JournalMouvement[] = [
  {
    id: 1,
    nom_utilisateur: 'Steeve Randria',
    role_utilisateur: 'MANAGER',
    entite: 'demandes_recrutement',
    entite_id: 'DEM-2026-0001',
    action: 'CREATION',
    valeur_apres: { poste: 'Ingénieur Full-Stack Senior', budget: 4800000 },
    motif_ou_commentaire: 'Initialisation de la demande de recrutement',
    created_at: '2026-10-04T08:00:00Z',
  },
  {
    id: 2,
    nom_utilisateur: 'Hery Rajaonah',
    role_utilisateur: 'DIRECTION',
    entite: 'demandes_recrutement',
    entite_id: 'DEM-2026-0001',
    action: 'VALIDATION',
    valeur_avant: { statut: 'VALIDEE_FINANCE' },
    valeur_apres: { statut: 'OUVERTE' },
    motif_ou_commentaire: 'Validation finale par la Direction Générale',
    created_at: '2026-10-07T10:15:00Z',
  },
  {
    id: 3,
    nom_utilisateur: 'Tanteraka Rasoa',
    role_utilisateur: 'RH',
    entite: 'offres_emploi',
    entite_id: 'OFF-2026-0001',
    action: 'CREATION',
    valeur_apres: { titre: 'Ingénieur Full-Stack Senior TypeScript & PostgreSQL' },
    motif_ou_commentaire: 'Publication de l’offre sur le portail carrières',
    created_at: '2026-10-08T09:00:00Z',
  },
  {
    id: 4,
    nom_utilisateur: 'Mamy Ranaivo (Candidat)',
    role_utilisateur: 'EMPLOYE',
    entite: 'candidatures',
    entite_id: 'CAN-2026-0001',
    action: 'SOUMISSION_CANDIDATURE',
    valeur_apres: { statut: 'RECUE' },
    motif_ou_commentaire: 'Dépôt de candidature via le portail public',
    created_at: '2026-10-09T14:25:00Z',
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    destinataire_role: 'FINANCE',
    titre: 'Demande en attente de validation budgétaire',
    message: 'La demande DEM-2026-0002 (Ingénieur DevOps) a été validée par la RH et attend votre validation.',
    type: 'ACTION_REQUISE',
    lien_onglet: 'bloc1',
    lu: false,
    created_at: '2026-10-18T11:05:00Z',
  },
  {
    id: 'notif-2',
    destinataire_role: 'RH',
    titre: 'Proposition émise en attente de signature',
    message: 'La proposition d’embauche PROP-2026-0001 a été envoyée à Mamy Ranaivo.',
    type: 'INFO',
    lien_onglet: 'bloc3',
    lu: false,
    created_at: '2026-10-20T16:05:00Z',
  },
];

const INITIAL_PARAMETRES: Parametre[] = [
  { cle: 'FORMAT_MATRICULE', valeur: 'EMP-{YYYY}-{SEQ4}', description: 'Gabarit de génération des matricules collaborateurs' },
  { cle: 'DELAI_MAX_VALIDATION_JOURS', valeur: '5', description: 'Délai cible en jours ouvrés pour chaque étape de validation' },
  { cle: 'LIMITE_RENOUVELLEMENT_CDD', valeur: '2', description: 'Nombre maximal de renouvellements de CDD selon le code du travail' },
  { cle: 'DUREE_MAX_ESSAI_CDI_JOURS', valeur: '90', description: 'Durée maximale légale de période d’essai pour un contrat CDI' },
];

const INITIAL_REFERENTIELS: Referentiel[] = [
  { id: 'ref-1', categorie: 'MOTIF_REFUS', code: 'BESOIN_NON_JUSTIFIE', libelle: 'Besoin non justifié par rapport à la charge', ordre: 1 },
  { id: 'ref-2', categorie: 'MOTIF_REFUS', code: 'EFFECTIF_MAX_ATTEINT', libelle: 'Effectif autorisé du poste déjà atteint', ordre: 2 },
  { id: 'ref-3', categorie: 'MOTIF_REFUS', code: 'BUDGET_INSUFFISANT', libelle: 'Dépassement de l’enveloppe budgétaire allouée', ordre: 3 },
  { id: 'ref-4', categorie: 'MOTIF_REFUS', code: 'NON_CONFORME_PRIORITES', libelle: 'Non-conformité aux priorités stratégiques', ordre: 4 },
  { id: 'ref-5', categorie: 'MOTIF_RENVOI', code: 'AJUSTEMENT_BUDGET', libelle: 'Ajuster l’estimation budgétaire et la rémunération', ordre: 1 },
  { id: 'ref-6', categorie: 'MOTIF_RENVOI', code: 'PRECISER_PROFIL', libelle: 'Préciser les compétences et missions requises', ordre: 2 },
];

const INITIAL_EMPLOYES: Employe[] = [
  {
    id: 'emp-0001-0000-0000-000000000001',
    matricule: 'EMP-2026-0001',
    candidat_origine_id: 'cand-0001-0000-0000-000000000001',
    candidature_origine_id: 'can-0001-0000-0000-000000000001',
    nom: 'Ranaivo',
    prenom: 'Mamy',
    cin: '101 221 045 889',
    date_naissance: '1996-05-14',
    nationalite: 'Malgache',
    situation_matrimoniale: 'Célibataire',
    email_professionnel: 'mamy.ranaivo@sirh-entreprise.mg',
    email_personnel: 'mamy.ranaivo@gmail.com',
    telephone: '+261 34 11 223 34',
    adresse_domicile: 'Lot II M 45 Bis Ankadifotsy, Antananarivo',
    numero_cnaps: '98451203',
    numero_ostie: 'OST-77412',
    rib_bancaire: '00004 01245 0098451203 14',
    statut: 'EN_ONBOARDING',
    date_entree: '2026-10-15',
    created_at: '2026-10-15T08:00:00Z',
  },
];

const INITIAL_CONTRATS: Contrat[] = [
  {
    id: 'ctr-0001-0000-0000-000000000001',
    numero: 'CTR-2026-0001',
    employe_id: 'emp-0001-0000-0000-000000000001',
    poste_id: 'post-0001-0000-0000-000000000001',
    type_contrat: 'CDI',
    date_debut: '2026-10-15',
    periode_essai_fin: '2027-01-15',
    remuneration_base: 4800000,
    duree_hebdomadaire_heures: 40,
    lieu_travail: 'Siège Social — Ankorondrano, Antananarivo',
    statut: 'VALIDE',
    signe_par_employe: true,
    signe_par_employeur: true,
    date_signature: '2026-10-14',
    numero_avenant: 0,
    created_at: '2026-10-14T14:00:00Z',
  },
];

const INITIAL_ONBOARDINGS: Onboarding[] = [
  {
    id: 'onb-0001-0000-0000-000000000001',
    employe_id: 'emp-0001-0000-0000-000000000001',
    contrat_id: 'ctr-0001-0000-0000-000000000001',
    date_debut: '2026-10-15',
    date_fin_prevue: '2027-01-15',
    statut: 'EN_COURS',
    taux_avancement: 60,
    commentaires: 'Intégration au sein de l’équipe Web & Cloud pilotée par Steeve Randria (Manager).',
    taches: [
      {
        id: 'tch-1',
        onboarding_id: 'onb-0001-0000-0000-000000000001',
        titre: 'Configuration du poste de travail & habilitations IT',
        description: 'Attribution du MacBook Pro M3, accès GitHub organisationnel et boite mail.',
        responsable: 'IT',
        date_echeance: '2026-10-15',
        obligatoire: true,
        statut: 'FAIT',
        date_realisation: '2026-10-15T09:30:00Z',
      },
      {
        id: 'tch-2',
        onboarding_id: 'onb-0001-0000-0000-000000000001',
        titre: 'Remise du badge sécurisé et livret d’accueil',
        description: 'Badge d’accès physique au campus d’Ankorondrano et équipements.',
        responsable: 'LOGISTIQUE',
        date_echeance: '2026-10-15',
        obligatoire: true,
        statut: 'FAIT',
        date_realisation: '2026-10-15T10:15:00Z',
      },
      {
        id: 'tch-3',
        onboarding_id: 'onb-0001-0000-0000-000000000001',
        titre: 'Entretien d’accueil et cadrage des objectifs avec le Manager',
        description: 'Session de cadrage des priorités techniques du 1er trimestre avec Steeve Randria.',
        responsable: 'MANAGER',
        date_echeance: '2026-10-16',
        obligatoire: true,
        statut: 'FAIT',
        date_realisation: '2026-10-16T14:00:00Z',
      },
      {
        id: 'tch-4',
        onboarding_id: 'onb-0001-0000-0000-000000000001',
        titre: 'Visite médicale obligatoire d’embauche (OSTIE)',
        description: 'Consultation d’aptitude médicale légale selon le Code du Travail.',
        responsable: 'RH',
        date_echeance: '2026-11-15',
        obligatoire: true,
        statut: 'EN_COURS',
      },
      {
        id: 'tch-5',
        onboarding_id: 'onb-0001-0000-0000-000000000001',
        titre: 'Rapport d’étonnement à J+30',
        description: 'Restitution du collaborateur sur ses premières impressions d’intégration.',
        responsable: 'RH',
        date_echeance: '2026-11-15',
        obligatoire: false,
        statut: 'A_FAIRE',
      },
    ],
    created_at: '2026-10-15T08:00:00Z',
  },
];

export interface SirhState {
  currentUser: Utilisateur;
  currentRole: UserRole;
  isAuthenticated: boolean;
  users: Utilisateur[];
  departements: Departement[];
  services: Service[];
  postes: Poste[];
  demandes: DemandeRecrutement[];
  offres: OffreEmploi[];
  candidats: Candidat[];
  candidatures: Candidature[];
  entretiens: Entretien[];
  evaluations: Evaluation[];
  propositions: PropositionEmbauche[];
  contrats: Contrat[];
  piecesDossiers: PieceDossier[];
  employes: Employe[];
  affectations: Affectation[];
  onboardings: Onboarding[];
  journal: JournalMouvement[];
  notifications: NotificationItem[];
  parametres: Parametre[];
  referentiels: Referentiel[];
  dbStatus?: 'connecting' | 'connected' | 'fallback' | 'error';
  dbInfo?: {
    connected: boolean;
    source?: string;
    serverTime?: string;
    databaseName?: string;
    version?: string;
    tablesCount?: number;
    lastSyncedAt?: string;
    message?: string;
  };
}

const STORAGE_KEY = 'sirh_state_v3';

export class SirhDataStore {
  private state: SirhState;
  private listeners: (() => void)[] = [];
  private matriculeCounter = 42; // Next sequential matricule

  constructor() {
    this.state = this.loadState();
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        this.fetchFromNeon();
      }, 50);
    }
  }

  // --- Neon PostgreSQL Integration ---
  public async fetchFromNeon(): Promise<boolean> {
    try {
      this.state.dbStatus = 'connecting';
      this.notify();

      const res = await fetch('/api/sirh');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const result = await res.json();

      if (result.ok && result.connected && result.data) {
        const d = result.data;
        this.state = {
          ...this.state,
          users: d.users?.length ? d.users : this.state.users,
          departements: d.departements?.length ? d.departements : this.state.departements,
          services: d.services?.length ? d.services : this.state.services,
          postes: d.postes?.length ? d.postes : this.state.postes,
          demandes: d.demandes?.length ? d.demandes : this.state.demandes,
          offres: d.offres?.length ? d.offres : this.state.offres,
          candidats: d.candidats?.length ? d.candidats : this.state.candidats,
          candidatures: d.candidatures?.length ? d.candidatures : this.state.candidatures,
          entretiens: d.entretiens?.length ? d.entretiens : this.state.entretiens,
          evaluations: d.evaluations?.length ? d.evaluations : this.state.evaluations,
          propositions: d.propositions?.length ? d.propositions : this.state.propositions,
          contrats: d.contrats?.length ? d.contrats : this.state.contrats,
          employes: d.employes?.length ? d.employes : this.state.employes,
          onboardings: d.onboardings?.length ? d.onboardings : this.state.onboardings,
          journal: d.journal?.length ? d.journal : this.state.journal,
          notifications: d.notifications?.length ? d.notifications : this.state.notifications,
          parametres: d.parametres?.length ? d.parametres : this.state.parametres,
          referentiels: d.referentiels?.length ? d.referentiels : this.state.referentiels,
          dbStatus: 'connected',
          dbInfo: {
            connected: true,
            source: 'Neon PostgreSQL (En ligne)',
            lastSyncedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            message: 'Données synchronisées avec Neon PostgreSQL',
          },
        };
        this.saveState();
        return true;
      } else {
        this.state.dbStatus = 'fallback';
        this.state.dbInfo = {
          connected: false,
          source: 'Cache Local (Navigateur)',
          message: result.message || 'Mode hors-ligne / DATABASE_URL non configuré',
        };
        this.notify();
        return false;
      }
    } catch (err: any) {
      this.state.dbStatus = 'fallback';
      this.state.dbInfo = {
        connected: false,
        source: 'Cache Local (Navigateur)',
        message: err.message || 'Impossible de joindre /api/sirh',
      };
      this.notify();
      return false;
    }
  }

  public async checkNeonHealth(): Promise<any> {
    try {
      const res = await fetch('/api/sirh?action=health');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.ok && data.connected) {
        this.state.dbStatus = 'connected';
        this.state.dbInfo = {
          connected: true,
          source: 'Neon PostgreSQL',
          serverTime: data.serverTime,
          databaseName: data.databaseName,
          version: data.version,
          tablesCount: data.tablesCount,
          lastSyncedAt: new Date().toLocaleTimeString('fr-FR'),
          message: `Connecté à la base ${data.databaseName} (${data.tablesCount} tables créées)`,
        };
      } else {
        this.state.dbStatus = 'fallback';
        this.state.dbInfo = {
          connected: false,
          source: 'Cache Local (Navigateur)',
          message: data.message || data.error || 'Erreur de connexion',
        };
      }
      this.notify();
      return data;
    } catch (e: any) {
      return { ok: false, connected: false, error: e.message };
    }
  }

  public async syncActionToNeon(action: string, payload: any): Promise<void> {
    try {
      if (typeof window === 'undefined') return;
      await fetch('/api/sirh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
      });
    } catch (e) {
      console.warn(`[Neon Sync] Action '${action}' failed:`, e);
    }
  }

  private loadState(): SirhState {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...parsed,
            isAuthenticated: parsed.isAuthenticated ?? false,
          };
        }
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage', e);
    }

    return {
      currentUser: INITIAL_USERS[5], // Default role: EMPLOYE (Mamy Ranaivo)
      currentRole: 'EMPLOYE',
      isAuthenticated: false,
      users: INITIAL_USERS,
      departements: INITIAL_DEPARTEMENTS,
      services: INITIAL_SERVICES,
      postes: INITIAL_POSTES,
      demandes: INITIAL_DEMANDES,
      offres: INITIAL_OFFRES,
      candidats: INITIAL_CANDIDATS,
      candidatures: INITIAL_CANDIDATURES,
      entretiens: INITIAL_ENTRETIENS,
      evaluations: INITIAL_EVALUATIONS,
      propositions: INITIAL_PROPOSITIONS,
      contrats: INITIAL_CONTRATS,
      piecesDossiers: [],
      employes: INITIAL_EMPLOYES,
      affectations: [],
      onboardings: INITIAL_ONBOARDINGS,
      journal: INITIAL_JOURNAL,
      notifications: INITIAL_NOTIFICATIONS,
      parametres: INITIAL_PARAMETRES,
      referentiels: INITIAL_REFERENTIELS,
    };
  }

  private saveState(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.error('Error saving SIRH state', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  public getState(): SirhState {
    return this.state;
  }

  public resetAll(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    this.state = {
      currentUser: INITIAL_USERS[5], // Mamy Ranaivo (EMPLOYE)
      currentRole: 'EMPLOYE',
      isAuthenticated: false,
      users: INITIAL_USERS,
      departements: INITIAL_DEPARTEMENTS,
      services: INITIAL_SERVICES,
      postes: INITIAL_POSTES,
      demandes: INITIAL_DEMANDES,
      offres: INITIAL_OFFRES,
      candidats: INITIAL_CANDIDATS,
      candidatures: INITIAL_CANDIDATURES,
      entretiens: INITIAL_ENTRETIENS,
      evaluations: INITIAL_EVALUATIONS,
      propositions: INITIAL_PROPOSITIONS,
      contrats: INITIAL_CONTRATS,
      piecesDossiers: [],
      employes: INITIAL_EMPLOYES,
      affectations: [],
      onboardings: INITIAL_ONBOARDINGS,
      journal: INITIAL_JOURNAL,
      notifications: INITIAL_NOTIFICATIONS,
      parametres: INITIAL_PARAMETRES,
      referentiels: INITIAL_REFERENTIELS,
    };
    this.saveState();
  }

  // --- Mouvements Audit (RG18, ET2, ET10) ---
  public logMouvement(
    entite: string,
    entite_id: string,
    action: string,
    valeur_avant?: any,
    valeur_apres?: any,
    motif_ou_commentaire?: string
  ): void {
    const mouvement: JournalMouvement = {
      id: Date.now(),
      utilisateur_id: this.state.currentUser.id,
      nom_utilisateur: `${this.state.currentUser.prenom} ${this.state.currentUser.nom}`,
      role_utilisateur: this.state.currentRole,
      entite,
      entite_id,
      action,
      valeur_avant,
      valeur_apres,
      motif_ou_commentaire,
      created_at: new Date().toISOString(),
    };
    this.state.journal = [mouvement, ...this.state.journal];
  }

  // --- Notifications (ET5) ---
  public pushNotification(
    titre: string,
    message: string,
    type: 'INFO' | 'ACTION_REQUISE' | 'VALIDATION' | 'ALERTE',
    destinataire_role?: UserRole,
    lien_onglet?: string
  ): void {
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      destinataire_role,
      titre,
      message,
      type,
      lien_onglet,
      lu: false,
      created_at: new Date().toISOString(),
    };
    this.state.notifications = [notif, ...this.state.notifications];
  }

  public markNotificationRead(id: string): void {
    this.state.notifications = this.state.notifications.map((n) =>
      n.id === id ? { ...n, lu: true } : n
    );
    this.saveState();
  }

  // --- Gestion de l'Authentification & Rôle (ET1) ---
  public switchRole(role: UserRole): void {
    const targetUser = this.state.users.find((u) => u.role === role) || this.state.currentUser;
    this.state.currentRole = role;
    this.state.currentUser = targetUser;
    // Any management role switch implies authentication
    if (role !== 'EMPLOYE') {
      this.state.isAuthenticated = true;
    }
    this.saveState();
  }

  public loginUser(user: Utilisateur): void {
    this.state.currentUser = user;
    this.state.currentRole = user.role;
    this.state.isAuthenticated = true;
    this.logMouvement('AUTH', user.id, 'CONNEXION', null, { role: user.role, email: user.email }, 'Connexion utilisateur');
    this.saveState();
  }

  public logoutUser(): void {
    // Reset to unauthenticated employee landing
    const guestUser = this.state.users.find((u) => u.role === 'EMPLOYE') || INITIAL_USERS[5];
    this.state.currentUser = guestUser;
    this.state.currentRole = 'EMPLOYE';
    this.state.isAuthenticated = false;
    this.saveState();
  }

  public registerEmploye(data: {
    nom: string;
    prenom: string;
    email: string;
    matricule?: string;
    departement_id?: string;
    service_id?: string;
  }): Utilisateur {
    const newId = `user-${Date.now()}`;
    const matricule = data.matricule || `EMP-2026-${String(Math.floor(100 + Math.random() * 900))}`;
    const newUser: Utilisateur = {
      id: newId,
      matricule,
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      role: 'EMPLOYE',
      departement_id: data.departement_id || 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      service_id: data.service_id || 'srv-0001-0000-0000-000000000001',
      actif: true,
    };

    this.state.users = [...this.state.users, newUser];
    this.state.currentUser = newUser;
    this.state.currentRole = 'EMPLOYE';
    this.state.isAuthenticated = true;

    this.logMouvement(
      'UTILISATEUR',
      newId,
      'INSCRIPTION_COLLABORATEUR',
      null,
      newUser,
      `Inscription du collaborateur ${newUser.prenom} ${newUser.nom} (${matricule})`
    );

    this.saveState();
    return newUser;
  }

  // =========================================================================
  // BLOC 1 : GESTION DES POSTES & EXPRESSION DU BESOIN
  // =========================================================================

  public creerPoste(data: {
    code: string;
    intitule: string;
    departement_id: string;
    service_id: string;
    description: string;
    competences_requises: string[];
    fourchette_salaire_min: number;
    fourchette_salaire_max: number;
    effectif_autorise: number;
    statut?: 'ACTIF' | 'GELE';
  }): Poste {
    const allowedRoles: UserRole[] = ['MANAGER', 'DIRECTION', 'RH', 'ADMIN'];
    if (!allowedRoles.includes(this.state.currentRole)) {
      throw new Error("Action non autorisée. Seuls les Managers, la Direction et les RH peuvent créer un poste.");
    }

    if (!data.code || !data.intitule || !data.departement_id || !data.service_id) {
      throw new Error("Veuillez renseigner tous les champs obligatoires (Code, Intitulé, Département, Service).");
    }

    const normalizedCode = data.code.trim().toUpperCase();
    if (this.state.postes.some((p) => p.code.toUpperCase() === normalizedCode)) {
      throw new Error(`Le code de poste '${normalizedCode}' est déjà utilisé dans le SIRH.`);
    }

    if (data.fourchette_salaire_min > data.fourchette_salaire_max) {
      throw new Error("La fourchette salariale est invalide : le minimum ne peut excéder le maximum.");
    }

    if (data.effectif_autorise < 1) {
      throw new Error("L'effectif autorisé doit être d'au moins 1 collaborateur.");
    }

    const newId =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          });
    const nouveauPoste: Poste = {
      id: newId,
      code: normalizedCode,
      intitule: data.intitule.trim(),
      departement_id: data.departement_id,
      service_id: data.service_id,
      description: data.description.trim(),
      competences_requises: data.competences_requises.filter((c) => c && c.trim() !== ''),
      fourchette_salaire_min: data.fourchette_salaire_min,
      fourchette_salaire_max: data.fourchette_salaire_max,
      effectif_autorise: data.effectif_autorise,
      effectif_pourvu: 0,
      statut: data.statut || 'ACTIF',
    };

    this.state.postes = [nouveauPoste, ...this.state.postes];

    this.logMouvement(
      'postes',
      nouveauPoste.code,
      'CREATION_POSTE',
      null,
      nouveauPoste,
      `Création du poste ${nouveauPoste.intitule} (${nouveauPoste.code}) par ${this.state.currentUser.prenom} ${this.state.currentUser.nom} (${this.state.currentRole})`
    );

    this.pushNotification(
      'Nouveau Poste Créé',
      `Le poste "${nouveauPoste.intitule}" (${nouveauPoste.code}) a été créé et intégré à la cartographie.`,
      'INFO',
      'RH',
      'bloc1'
    );

    this.saveState();
    this.syncActionToNeon('create_poste', nouveauPoste);

    return nouveauPoste;
  }

  public creerDemande(data: {
    type: 'CREATION' | 'REMPLACEMENT';
    poste_id: string;
    nombre_postes: number;
    motif: string;
    justification: string;
    type_contrat_souhaite: TypeContrat;
    date_souhaitee: string;
    urgence: 'NORMALE' | 'URGENTE' | 'TRES_URGENTE';
    budget_estime: number;
    ancien_titulaire_ref?: string;
    soumettreImmediatement?: boolean;
  }): DemandeRecrutement {
    const poste = this.state.postes.find((p) => p.id === data.poste_id);
    if (!poste) throw new Error('Poste introuvable');

    const numSeq = this.state.demandes.length + 1;
    const numero = `DEM-2026-${String(numSeq).padStart(4, '0')}`;
    const now = new Date().toISOString();

    const nouvelleDemande: DemandeRecrutement = {
      id: `dem-${Date.now()}`,
      numero,
      type: data.type,
      demandeur_id: this.state.currentUser.id,
      demandeur_nom: `${this.state.currentUser.prenom} ${this.state.currentUser.nom}`,
      poste_id: poste.id,
      departement_id: poste.departement_id,
      service_id: poste.service_id,
      nombre_postes: data.nombre_postes,
      motif: data.motif,
      justification: data.justification,
      type_contrat_souhaite: data.type_contrat_souhaite,
      date_souhaitee: data.date_souhaitee,
      urgence: data.urgence,
      budget_estime: data.budget_estime,
      ancien_titulaire_ref: data.ancien_titulaire_ref,
      statut: data.soumettreImmediatement ? 'SOUMISE' : 'BROUILLON',
      etape_validation_actuelle: data.soumettreImmediatement ? 'RH' : 'MANAGER',
      validations: [],
      created_at: now,
      updated_at: now,
    };

    this.state.demandes = [nouvelleDemande, ...this.state.demandes];

    this.logMouvement(
      'demandes_recrutement',
      numero,
      data.soumettreImmediatement ? 'CREATION_ET_SOUMISSION' : 'CREATION_BROUILLON',
      null,
      nouvelleDemande,
      `Création de la demande par ${nouvelleDemande.demandeur_nom}`
    );

    if (data.soumettreImmediatement) {
      this.pushNotification(
        'Nouvelle demande de recrutement',
        `Demande ${numero} soumise pour validation RH par ${nouvelleDemande.demandeur_nom}.`,
        'ACTION_REQUISE',
        'RH',
        'bloc1'
      );
    }

    this.saveState();
    return nouvelleDemande;
  }

  public soumettreDemande(demandeId: string): void {
    const dem = this.state.demandes.find((d) => d.id === demandeId);
    if (!dem) throw new Error('Demande introuvable');
    if (dem.statut !== 'BROUILLON' && dem.statut !== 'A_REVOIR') {
      throw new Error('Seule une demande en brouillon ou à revoir peut être soumise.');
    }

    const ancienStatut = dem.statut;
    dem.statut = 'SOUMISE';
    dem.etape_validation_actuelle = 'RH';
    dem.updated_at = new Date().toISOString();

    this.logMouvement(
      'demandes_recrutement',
      dem.numero,
      'SOUMISSION',
      { statut: ancienStatut },
      { statut: dem.statut },
      'Soumission du dossier au circuit de validation'
    );

    this.pushNotification(
      'Demande de recrutement soumise',
      `La demande ${dem.numero} est prête pour la validation RH.`,
      'ACTION_REQUISE',
      'RH',
      'bloc1'
    );

    this.saveState();
  }

  public validerEtapeDemande(
    demandeId: string,
    decision: DecisionValidation,
    commentaire?: string,
    dateReexamenBudget?: string
  ): void {
    const dem = this.state.demandes.find((d) => d.id === demandeId);
    if (!dem) throw new Error('Demande introuvable');

    const etape = dem.etape_validation_actuelle;
    if (etape === 'CLOTURE' || etape === 'MANAGER') {
      throw new Error("Aucune validation n'est en attente pour cette demande.");
    }

    if ((decision === 'RENVOYER' || decision === 'REJETER') && !commentaire) {
      throw new Error('Un motif ou commentaire explicatif est obligatoire pour tout refus ou renvoi (RG04).');
    }

    const now = new Date().toISOString();
    const validationRecord = {
      id: `val-${Date.now()}`,
      demande_id: dem.id,
      etape: etape as 'RH' | 'FINANCE' | 'DIRECTION',
      valideur_id: this.state.currentUser.id,
      valideur_nom: `${this.state.currentUser.prenom} ${this.state.currentUser.nom} (${this.state.currentRole})`,
      decision,
      commentaire,
      created_at: now,
    };

    dem.validations.push(validationRecord);
    const ancienStatut = dem.statut;

    if (decision === 'VALIDER') {
      if (etape === 'RH') {
        dem.statut = 'VALIDEE_RH';
        dem.etape_validation_actuelle = 'FINANCE';
        this.pushNotification(
          'Demande transmise à la Finance',
          `La demande ${dem.numero} a été validée par la RH et attend l’approbation budgétaire.`,
          'ACTION_REQUISE',
          'FINANCE',
          'bloc1'
        );
      } else if (etape === 'FINANCE') {
        dem.statut = 'VALIDEE_FINANCE';
        dem.etape_validation_actuelle = 'DIRECTION';
        this.pushNotification(
          'Demande transmise à la Direction',
          `La demande ${dem.numero} a été validée par la Finance et attend la signature DG.`,
          'ACTION_REQUISE',
          'DIRECTION',
          'bloc1'
        );
      } else if (etape === 'DIRECTION') {
        dem.statut = 'OUVERTE';
        dem.etape_validation_actuelle = 'CLOTURE';
        this.pushNotification(
          'Demande définitivement approuvée (OUVERTE)',
          `La demande ${dem.numero} a reçu la validation de la Direction. La RH peut publier l’offre d’emploi !`,
          'INFO',
          'RH',
          'bloc2'
        );
      }
    } else if (decision === 'RENVOYER') {
      dem.statut = 'A_REVOIR';
      dem.etape_validation_actuelle = 'MANAGER';
      dem.motif_refus_ou_renvoi = commentaire;
      this.pushNotification(
        'Demande renvoyée pour correction',
        `La demande ${dem.numero} vous a été renvoyée par ${validationRecord.valideur_nom} : ${commentaire}`,
        'ACTION_REQUISE',
        'MANAGER',
        'bloc1'
      );
    } else if (decision === 'REJETER') {
      dem.statut = 'REJETEE';
      dem.etape_validation_actuelle = 'CLOTURE';
      dem.motif_refus_ou_renvoi = commentaire;
      this.pushNotification(
        'Demande de recrutement rejetée',
        `La demande ${dem.numero} a été refusée définitivement : ${commentaire}`,
        'ALERTE',
        'MANAGER',
        'bloc1'
      );
    } else if (decision === 'METTRE_EN_ATTENTE') {
      dem.statut = 'EN_ATTENTE_BUDGET';
      dem.date_reexamen_budget = dateReexamenBudget || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
      dem.motif_refus_ou_renvoi = commentaire;
      this.pushNotification(
        'Demande mise en attente budgétaire',
        `La demande ${dem.numero} est mise en attente de budget jusqu’au ${dem.date_reexamen_budget}.`,
        'INFO',
        'MANAGER',
        'bloc1'
      );
    }

    dem.updated_at = now;

    this.logMouvement(
      'demandes_recrutement',
      dem.numero,
      `VALIDATION_${decision}`,
      { statut: ancienStatut },
      { statut: dem.statut, etape_suivante: dem.etape_validation_actuelle },
      commentaire || `Décision ${decision} à l’étape ${etape}`
    );

    this.saveState();
  }

  public annulerDemande(demandeId: string, motif: string): void {
    const dem = this.state.demandes.find((d) => d.id === demandeId);
    if (!dem) throw new Error('Demande introuvable');
    if (dem.statut === 'OUVERTE') {
      throw new Error('Une demande déjà OUVERTE ne peut plus être annulée directement (RG07).');
    }
    if (!motif) throw new Error('Le motif d’annulation est obligatoire (RG04).');

    const ancienStatut = dem.statut;
    dem.statut = 'ANNULEE';
    dem.etape_validation_actuelle = 'CLOTURE';
    dem.motif_refus_ou_renvoi = motif;
    dem.updated_at = new Date().toISOString();

    this.logMouvement(
      'demandes_recrutement',
      dem.numero,
      'ANNULATION',
      { statut: ancienStatut },
      { statut: 'ANNULEE' },
      motif
    );

    this.saveState();
  }

  // =========================================================================
  // BLOC 2 : RECRUTEMENT & CANDIDATURES
  // =========================================================================

  public creerOffre(demandeId: string, details: Partial<OffreEmploi>): OffreEmploi {
    const dem = this.state.demandes.find((d) => d.id === demandeId);
    if (!dem) throw new Error('Demande introuvable');
    if (dem.statut !== 'OUVERTE') {
      throw new Error('Une offre d’emploi naît uniquement d’une demande OUVERTE (RG06).');
    }

    const poste = this.state.postes.find((p) => p.id === dem.poste_id);
    const numSeq = this.state.offres.length + 1;
    const reference = `OFF-2026-${String(numSeq).padStart(4, '0')}`;
    const now = new Date().toISOString();

    const nouvelleOffre: OffreEmploi = {
      id: `off-${Date.now()}`,
      reference,
      demande_id: dem.id,
      poste_id: dem.poste_id,
      titre: details.titre || (poste ? poste.intitule : 'Nouveau Poste'),
      departement_id: dem.departement_id,
      missions: details.missions || dem.motif,
      profil_recherche: details.profil_recherche || dem.justification,
      competences_requises: details.competences_requises || (poste ? poste.competences_requises : []),
      type_contrat: details.type_contrat || dem.type_contrat_souhaite,
      lieu: details.lieu || 'Siège Social — Ankorondrano, Antananarivo',
      salaire_affiche: details.salaire_affiche ?? true,
      salaire_min: details.salaire_min || (poste ? poste.fourchette_salaire_min : undefined),
      salaire_max: details.salaire_max || (poste ? poste.fourchette_salaire_max : undefined),
      nombre_postes: dem.nombre_postes,
      postes_pourvus: 0,
      date_publication: details.date_publication || now.split('T')[0],
      date_cloture: details.date_cloture || new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
      statut: details.statut || 'PUBLIEE',
      cree_par: `${this.state.currentUser.prenom} ${this.state.currentUser.nom}`,
      created_at: now,
    };

    this.state.offres = [nouvelleOffre, ...this.state.offres];

    this.logMouvement(
      'offres_emploi',
      reference,
      'PUBLICATION_OFFRE',
      null,
      nouvelleOffre,
      `Offre créée à partir de la demande ${dem.numero}`
    );

    this.pushNotification(
      'Offre d’emploi en ligne',
      `L’offre ${reference} (${nouvelleOffre.titre}) est publiée sur le portail carrières.`,
      'INFO',
      'MANAGER',
      'bloc2'
    );

    this.saveState();
    return nouvelleOffre;
  }

  // Candidature publique sans compte (EF2.2, EF2.3 - Détection de doublon)
  public postulerOffre(
    offreId: string,
    candidatData: {
      cin: string;
      nom: string;
      prenom: string;
      date_naissance: string;
      email: string;
      telephone: string;
      adresse: string;
      cv_url: string;
      lettre_motivation_url?: string;
      titre_actuel?: string;
      annees_experience: number;
    }
  ): { candidat: Candidat; candidature: Candidature; estExistant: boolean } {
    const offre = this.state.offres.find((o) => o.id === offreId);
    if (!offre) throw new Error('Offre introuvable');
    if (offre.statut !== 'PUBLIEE') {
      throw new Error('Cette offre n’est plus ouverte aux candidatures.');
    }

    // Détection de doublon candidat (RG07: Un candidat est unique, peut postuler à plusieurs offres)
    let candidat = this.state.candidats.find(
      (c) =>
        c.cin.trim().toLowerCase() === candidatData.cin.trim().toLowerCase() ||
        c.email.trim().toLowerCase() === candidatData.email.trim().toLowerCase() ||
        (c.nom.trim().toLowerCase() === candidatData.nom.trim().toLowerCase() &&
          c.date_naissance === candidatData.date_naissance)
    );

    let estExistant = false;
    const now = new Date().toISOString();

    if (candidat) {
      estExistant = true;
      // Mise à jour des coordonnées avec le dernier CV fourni
      candidat.telephone = candidatData.telephone;
      candidat.adresse = candidatData.adresse;
      candidat.cv_url = candidatData.cv_url;
      candidat.titre_actuel = candidatData.titre_actuel || candidat.titre_actuel;
      candidat.annees_experience = candidatData.annees_experience || candidat.annees_experience;
    } else {
      candidat = {
        id: `cand-${Date.now()}`,
        ...candidatData,
        created_at: now,
      };
      this.state.candidats.push(candidat);
    }

    // Vérifier si le candidat n'a pas déjà postulé à cette même offre
    const candidatureExistante = this.state.candidatures.find(
      (c) => c.offre_id === offreId && c.candidat_id === candidat!.id
    );

    if (candidatureExistante) {
      throw new Error('Vous avez déjà soumis une candidature pour cette offre.');
    }

    const numSeq = this.state.candidatures.length + 1;
    const numero = `CAN-2026-${String(numSeq).padStart(4, '0')}`;

    const nouvelleCandidature: Candidature = {
      id: `app-${Date.now()}`,
      numero,
      offre_id: offre.id,
      candidat_id: candidat.id,
      date_candidature: now,
      statut: 'RECUE',
      created_at: now,
      updated_at: now,
    };

    this.state.candidatures = [nouvelleCandidature, ...this.state.candidatures];

    this.logMouvement(
      'candidatures',
      numero,
      'DEPOT_CANDIDATURE',
      null,
      nouvelleCandidature,
      `Candidature de ${candidat.prenom} ${candidat.nom} (${estExistant ? 'Candidat existant reconnu' : 'Nouveau profil'})`
    );

    this.pushNotification(
      'Nouvelle candidature reçue',
      `${candidat.prenom} ${candidat.nom} a postulé à l’offre ${offre.reference} (${offre.titre}).`,
      'INFO',
      'RH',
      'bloc2'
    );

    this.saveState();
    return { candidat, candidature: nouvelleCandidature, estExistant };
  }

  public preselectionnerCandidature(
    candidatureId: string,
    score: number,
    retenu: boolean,
    motif?: string
  ): void {
    const cand = this.state.candidatures.find((c) => c.id === candidatureId);
    if (!cand) throw new Error('Candidature introuvable');

    const ancienStatut = cand.statut;
    cand.score_preselection = score;
    cand.statut = retenu ? 'PRESELECTIONNEE' : 'REFUSEE';
    if (!retenu) cand.motif_refus = motif || 'Score de présélection insuffisant';
    cand.updated_at = new Date().toISOString();

    this.logMouvement(
      'candidatures',
      cand.numero,
      retenu ? 'PRESELECTION_VALIDEE' : 'PRESELECTION_REFUSEE',
      { statut: ancienStatut },
      { statut: cand.statut, score },
      motif || `Score de correspondance établi à ${score}/100`
    );

    this.saveState();
  }

  // Planification d'entretien avec détection de collision de salle et intervieweur (RG09)
  public planifierEntretien(details: {
    candidature_id: string;
    type: 'ENTRETIEN_RH' | 'ENTRETIEN_TECHNIQUE' | 'TEST_ECRIT' | 'TEST_PRATIQUE';
    date_heure_debut: string; // ISO
    date_heure_fin: string; // ISO
    salle_ou_lien: string;
    participants_ids: string[];
  }): Entretien {
    const start = new Date(details.date_heure_debut).getTime();
    const end = new Date(details.date_heure_fin).getTime();

    if (end <= start) {
      throw new Error('L’heure de fin de l’entretien doit être postérieure à l’heure de début.');
    }

    // RG09 : Vérifier si la salle physique est libre
    const isVirtual = /^(http|zoom|teams|meet)/i.test(details.salle_ou_lien);
    if (!isVirtual) {
      const conflitSalle = this.state.entretiens.find((e) => {
        if (e.statut !== 'PLANIFIE' || e.salle_ou_lien.toLowerCase() !== details.salle_ou_lien.toLowerCase()) {
          return false;
        }
        const eStart = new Date(e.date_heure_debut).getTime();
        const eEnd = new Date(e.date_heure_fin).getTime();
        return (start < eEnd && end > eStart);
      });

      if (conflitSalle) {
        throw new Error(`RG09 Conflit : La salle "${details.salle_ou_lien}" est déjà occupée sur ce créneau.`);
      }
    }

    // RG09 : Vérifier si l'un des participants est déjà en entretien
    for (const participantId of details.participants_ids) {
      const conflitParticipant = this.state.entretiens.find((e) => {
        if (e.statut !== 'PLANIFIE' || !e.participants_ids.includes(participantId)) {
          return false;
        }
        const eStart = new Date(e.date_heure_debut).getTime();
        const eEnd = new Date(e.date_heure_fin).getTime();
        return (start < eEnd && end > eStart);
      });

      if (conflitParticipant) {
        const participant = this.state.users.find((u) => u.id === participantId);
        throw new Error(
          `RG09 Conflit : L'intervieweur ${participant?.prenom || ''} ${participant?.nom || ''} a déjà un entretien prévu sur ce créneau.`
        );
      }
    }

    const now = new Date().toISOString();
    const nouvelEntretien: Entretien = {
      id: `ent-${Date.now()}`,
      candidature_id: details.candidature_id,
      type: details.type,
      date_heure_debut: details.date_heure_debut,
      date_heure_fin: details.date_heure_fin,
      salle_ou_lien: details.salle_ou_lien,
      statut: 'PLANIFIE',
      participants_ids: details.participants_ids,
      created_at: now,
    };

    this.state.entretiens = [nouvelEntretien, ...this.state.entretiens];

    // Mise à jour du statut de la candidature
    const cand = this.state.candidatures.find((c) => c.id === details.candidature_id);
    if (cand) {
      cand.statut = details.type.startsWith('TEST') ? 'EN_TEST' : 'EN_ENTRETIEN';
      cand.updated_at = now;
    }

    this.logMouvement(
      'entretiens',
      nouvelEntretien.id,
      'PLANIFICATION_ENTRETIEN',
      null,
      nouvelEntretien,
      `Entretien ${details.type} planifié pour le candidat`
    );

    this.saveState();
    return nouvelEntretien;
  }

  // Évaluation d'entretien avec verrouillage (RG10)
  public evaluerEntretien(details: {
    entretien_id: string;
    recommandation: 'FAVORABLE' | 'RESERVE' | 'DEFAVORABLE';
    points_forts: string;
    points_amelioration: string;
    commentaire_general: string;
    notes: { critere_id: string; libelle: string; note: number; ponderation: number }[];
    verrouiller?: boolean;
  }): Evaluation {
    const entretien = this.state.entretiens.find((e) => e.id === details.entretien_id);
    if (!entretien) throw new Error('Entretien introuvable');

    let totalPoints = 0;
    let totalPoids = 0;
    for (const n of details.notes) {
      totalPoints += n.note * n.ponderation;
      totalPoids += n.ponderation;
    }
    const moyenne = totalPoids > 0 ? Number((totalPoints / totalPoids).toFixed(2)) : 0;
    const now = new Date().toISOString();

    const evaluation: Evaluation = {
      id: `eval-${Date.now()}`,
      entretien_id: details.entretien_id,
      evaluateur_id: this.state.currentUser.id,
      evaluateur_nom: `${this.state.currentUser.prenom} ${this.state.currentUser.nom}`,
      version: 1,
      est_verrouillee: details.verrouiller ?? true,
      date_verrouillage: details.verrouiller ? now : undefined,
      recommandation: details.recommandation,
      points_forts: details.points_forts,
      points_amelioration: details.points_amelioration,
      commentaire_general: details.commentaire_general,
      notes: details.notes,
      note_moyenne_ponderee: moyenne,
      created_at: now,
    };

    entretien.statut = 'REALISE';
    this.state.evaluations = [evaluation, ...this.state.evaluations];

    this.logMouvement(
      'evaluations',
      evaluation.id,
      'EVALUATION_SOUMISE',
      null,
      evaluation,
      `Note moyenne : ${moyenne}/5, recommandation : ${details.recommandation}`
    );

    this.saveState();
    return evaluation;
  }

  // Décision finale (EF2.8)
  public deciderCandidature(
    candidatureId: string,
    decision: 'RETENUE' | 'REFUSEE',
    rang?: number,
    motif?: string
  ): void {
    const cand = this.state.candidatures.find((c) => c.id === candidatureId);
    if (!cand) throw new Error('Candidature introuvable');

    const ancienStatut = cand.statut;
    cand.statut = decision;
    if (rang) cand.rang_final = rang;
    if (motif) cand.motif_refus = motif;
    cand.updated_at = new Date().toISOString();

    this.logMouvement(
      'candidatures',
      cand.numero,
      `DECISION_FINALE_${decision}`,
      { statut: ancienStatut },
      { statut: cand.statut, rang },
      motif || `Décision finale du jury de recrutement : ${decision}`
    );

    this.saveState();
  }

  // =========================================================================
  // BLOC 3 : SÉLECTION & EMBAUCHE
  // =========================================================================

  public emettreProposition(
    candidatureId: string,
    details: {
      remuneration_mensuelle: number;
      type_contrat: TypeContrat;
      date_debut_prevue: string;
      periode_essai_jours?: number;
      horaires_travail?: string;
      lieu_travail?: string;
      avantages?: string[];
      date_limite_reponse?: string;
    }
  ): PropositionEmbauche {
    const cand = this.state.candidatures.find((c) => c.id === candidatureId);
    if (!cand) throw new Error('Candidature introuvable');
    const offre = this.state.offres.find((o) => o.id === cand.offre_id);

    // Calcul de version si proposition existante (RG11: chaque renégociation crée une nouvelle version)
    const versionsExistantes = this.state.propositions.filter((p) => p.candidature_id === candidatureId);
    const versionNum = versionsExistantes.length + 1;

    const numSeq = this.state.propositions.length + 1;
    const numero = `PROP-2026-${String(numSeq).padStart(4, '0')}`;
    const now = new Date().toISOString();

    const proposition: PropositionEmbauche = {
      id: `prop-${Date.now()}`,
      numero,
      candidature_id: candidatureId,
      poste_id: offre ? offre.poste_id : 'post-0001-0000-0000-000000000001',
      version: versionNum,
      remuneration_mensuelle: details.remuneration_mensuelle,
      type_contrat: details.type_contrat,
      date_debut_prevue: details.date_debut_prevue,
      periode_essai_jours: details.periode_essai_jours || (details.type_contrat === 'CDI' ? 90 : 30),
      horaires_travail: details.horaires_travail || '40h/semaine (Lundi au Vendredi)',
      lieu_travail: details.lieu_travail || (offre ? offre.lieu : 'Siège Social — Ankorondrano, Antananarivo'),
      avantages: details.avantages || ['Couverture Santé Groupe 100%', 'Indemnités de transport', 'Matériel pro'],
      date_limite_reponse: details.date_limite_reponse || new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      statut: 'PROPOSEE',
      emise_par: `${this.state.currentUser.prenom} ${this.state.currentUser.nom}`,
      created_at: now,
    };

    cand.statut = 'PROPOSITION_ENVOYEE';
    cand.updated_at = now;

    this.state.propositions = [proposition, ...this.state.propositions];

    this.logMouvement(
      'propositions_embauche',
      numero,
      'EMISSION_PROPOSITION',
      null,
      proposition,
      `Proposition version ${versionNum} envoyée au candidat (Salaire: ${details.remuneration_mensuelle.toLocaleString()} Ar)`
    );

    this.saveState();
    return proposition;
  }

  // Réponse du candidat (EF3.2 & RG12 : TRANSACTION TOUT-OU-RIEN À L'ACCEPTATION)
  public repondreProposition(
    propositionId: string,
    decision: 'ACCEPTEE' | 'REFUSEE' | 'NEGOCIATION',
    motif?: string
  ): void {
    const prop = this.state.propositions.find((p) => p.id === propositionId);
    if (!prop) throw new Error('Proposition introuvable');

    const cand = this.state.candidatures.find((c) => c.id === prop.candidature_id);
    if (!cand) throw new Error('Candidature liée introuvable');
    const candidat = this.state.candidats.find((c) => c.id === cand.candidat_id);
    if (!candidat) throw new Error('Candidat introuvable');
    const offre = this.state.offres.find((o) => o.id === cand.offre_id);
    const poste = this.state.postes.find((p) => p.id === prop.poste_id);

    const now = new Date().toISOString();
    prop.statut = decision;
    prop.date_reponse = now;
    prop.motif_refus_ou_negociation = motif;

    if (decision === 'NEGOCIATION') {
      cand.statut = 'PROPOSITION_ENVOYEE';
      this.pushNotification(
        'Renégociation de proposition',
        `Le candidat ${candidat.prenom} ${candidat.nom} souhaite négocier les conditions : ${motif}`,
        'ACTION_REQUISE',
        'RH',
        'bloc3'
      );
      this.logMouvement('propositions_embauche', prop.numero, 'REPONSE_NEGOCIATION', null, null, motif);
      this.saveState();
      return;
    }

    if (decision === 'REFUSEE') {
      cand.statut = 'REFUSE_PAR_CANDIDAT';
      cand.motif_refus = motif;
      this.pushNotification(
        'Proposition refusée par le candidat',
        `Le candidat ${candidat.prenom} ${candidat.nom} a décliné l’offre. Passage recommandé au candidat suivant du classement.`,
        'ALERTE',
        'RH',
        'bloc2'
      );
      this.logMouvement('propositions_embauche', prop.numero, 'REPONSE_REFUS', null, null, motif);
      this.saveState();
      return;
    }

    // =======================================================================
    // RG12 : TRANSACTION ATOMIQUE INDIVISIBLE À L'ACCEPTATION
    // 1. Création Employé
    // 2. Création Contrat (statut CREE)
    // 3. Création Affectation
    // 4. Mise à jour places vacantes / Clôture offre si pourvue
    // 5. Génération Checklist Onboarding
    // 6. Pièces justificatives requises
    // =======================================================================
    cand.statut = 'ACCEPTEE';

    // 1. Création Employé (distinct du candidat - RG08)
    const nouvelEmploye: Employe = {
      id: `emp-${Date.now()}`,
      candidat_origine_id: candidat.id,
      candidature_origine_id: cand.id,
      nom: candidat.nom,
      prenom: candidat.prenom,
      cin: candidat.cin,
      date_naissance: candidat.date_naissance,
      nationalite: 'Malgache',
      situation_matrimoniale: 'Célibataire',
      email_professionnel: `${candidat.prenom.toLowerCase()}.${candidat.nom.toLowerCase()}@entreprise.mg`,
      email_personnel: candidat.email,
      telephone: candidat.telephone,
      adresse_domicile: candidat.adresse,
      statut: 'EN_ONBOARDING',
      date_entree: prop.date_debut_prevue,
      created_at: now,
    };
    this.state.employes.push(nouvelEmploye);

    // 2. Création Contrat (statut CREE, RG12)
    const numContrat = `CTR-2026-${String(this.state.contrats.length + 1).padStart(4, '0')}`;
    const nouveauContrat: Contrat = {
      id: `ctr-${Date.now()}`,
      numero: numContrat,
      employe_id: nouvelEmploye.id,
      poste_id: prop.poste_id,
      type_contrat: prop.type_contrat,
      date_debut: prop.date_debut_prevue,
      periode_essai_fin: new Date(
        new Date(prop.date_debut_prevue).getTime() + prop.periode_essai_jours * 86400000
      )
        .toISOString()
        .split('T')[0],
      remuneration_base: prop.remuneration_mensuelle,
      duree_hebdomadaire_heures: 40.0,
      lieu_travail: prop.lieu_travail,
      statut: 'CREE',
      signe_par_employe: false,
      signe_par_employeur: false,
      numero_avenant: 0,
      created_at: now,
    };
    this.state.contrats.push(nouveauContrat);

    // 3. Création Affectation (RG16 : un seul poste actif)
    const nouvelleAffectation: Affectation = {
      id: `aff-${Date.now()}`,
      employe_id: nouvelEmploye.id,
      poste_id: prop.poste_id,
      departement_id: poste ? poste.departement_id : '',
      service_id: poste ? poste.service_id : '',
      contrat_id: nouveauContrat.id,
      motif: 'EMBAUCHE',
      date_debut: prop.date_debut_prevue,
      est_actuelle: true,
      lieu_affectation: prop.lieu_travail,
      notes: 'Affectation initiale suite à embauche',
      created_at: now,
    };
    this.state.affectations.push(nouvelleAffectation);

    // 4. Mise à jour de l'effectif pourvu du poste et statut de l'offre
    if (poste) {
      poste.effectif_pourvu += 1;
    }
    if (offre) {
      offre.postes_pourvus += 1;
      if (offre.postes_pourvus >= offre.nombre_postes) {
        offre.statut = 'POURVUE';
        const demAssociee = this.state.demandes.find((d) => d.id === offre.demande_id);
        if (demAssociee) demAssociee.statut = 'OUVERTE'; // Complète
      }
    }

    // 5. Initialisation automatique de l'Onboarding (EF4.6)
    const nouvelOnboarding: Onboarding = {
      id: `onb-${Date.now()}`,
      employe_id: nouvelEmploye.id,
      contrat_id: nouveauContrat.id,
      date_debut: prop.date_debut_prevue,
      date_fin_prevue: new Date(new Date(prop.date_debut_prevue).getTime() + 30 * 86400000)
        .toISOString()
        .split('T')[0],
      statut: 'EN_COURS',
      taux_avancement: 0,
      commentaires: 'Parcours d’accueil et d’intégration généré à l’acceptation.',
      taches: [
        {
          id: `t-${Date.now()}-1`,
          onboarding_id: `onb-${Date.now()}`,
          titre: 'Signature formelle du contrat de travail',
          description: 'Recueil des signatures électroniques / manuscrites du salarié et de la direction.',
          responsable: 'RH',
          date_echeance: prop.date_debut_prevue,
          obligatoire: true,
          statut: 'A_FAIRE',
        },
        {
          id: `t-${Date.now()}-2`,
          onboarding_id: `onb-${Date.now()}`,
          titre: 'Création du compte professionnel et accès informatiques',
          description: 'Ouverture de l’email pro, compte Slack d’entreprise, GitHub et droits aux bases.',
          responsable: 'IT',
          date_echeance: prop.date_debut_prevue,
          obligatoire: true,
          statut: 'A_FAIRE',
        },
        {
          id: `t-${Date.now()}-3`,
          onboarding_id: `onb-${Date.now()}`,
          titre: 'Remise de l’ordinateur portable et du badge d’accès',
          description: 'Configuration du matériel sécurisé et attribution du badge physique pour le campus.',
          responsable: 'LOGISTIQUE',
          date_echeance: prop.date_debut_prevue,
          obligatoire: true,
          statut: 'A_FAIRE',
        },
        {
          id: `t-${Date.now()}-4`,
          onboarding_id: `onb-${Date.now()}`,
          titre: 'Affiliation sociale CNaPS & Mutuelle OSTIE',
          description: 'Déclaration préalable à l’embauche et inscription au registre du personnel.',
          responsable: 'PAIE',
          date_echeance: new Date(new Date(prop.date_debut_prevue).getTime() + 3 * 86400000).toISOString().split('T')[0],
          obligatoire: true,
          statut: 'A_FAIRE',
        },
        {
          id: `t-${Date.now()}-5`,
          onboarding_id: `onb-${Date.now()}`,
          titre: 'Entretien d’accueil & visite du campus avec le Manager',
          description: 'Présentation de l’équipe, des rituels agiles et de la roadmap technique.',
          responsable: 'MANAGER',
          date_echeance: prop.date_debut_prevue,
          obligatoire: false,
          statut: 'A_FAIRE',
        },
      ],
      created_at: now,
    };
    this.state.onboardings.push(nouvelOnboarding);

    // 6. Pièces justificatives du dossier salarié (EF3.6)
    const piecesObligatoires: PieceDossier[] = [
      {
        id: `pc-${Date.now()}-1`,
        employe_id: nouvelEmploye.id,
        type_piece: 'CIN',
        libelle: 'Copie certifiée conforme de la Carte d’Identité Nationale',
        obligatoire: true,
        statut: 'RECU',
        date_reception: now.split('T')[0],
      },
      {
        id: `pc-${Date.now()}-2`,
        employe_id: nouvelEmploye.id,
        type_piece: 'DIPLOME',
        libelle: 'Diplôme de fin d’études ou certificat d’équivalence',
        obligatoire: true,
        statut: 'RECU',
        date_reception: now.split('T')[0],
      },
      {
        id: `pc-${Date.now()}-3`,
        employe_id: nouvelEmploye.id,
        type_piece: 'RIB',
        libelle: 'Relevé d’Identité Bancaire pour virement des salaires',
        obligatoire: true,
        statut: 'EN_ATTENTE',
      },
      {
        id: `pc-${Date.now()}-4`,
        employe_id: nouvelEmploye.id,
        type_piece: 'CERTIFICAT_MEDICAL',
        libelle: 'Certificat médical d’aptitude au poste (Visite médicale OSTIE)',
        obligatoire: true,
        statut: 'EN_ATTENTE',
      },
    ];
    this.state.piecesDossiers.push(...piecesObligatoires);

    // Journalisation de la transaction atomique (RG12, RG18)
    this.logMouvement(
      'employes',
      nouvelEmploye.id,
      'EMBAUCHE_TRANSACTION_ACCEPTEE',
      null,
      {
        employe: `${nouvelEmploye.prenom} ${nouvelEmploye.nom}`,
        contrat: nouveauContrat.numero,
        poste: poste ? poste.intitule : '',
      },
      `Transaction tout-ou-rien exécutée avec succès suite à l’accord de ${candidat.prenom} ${candidat.nom}`
    );

    this.pushNotification(
      'Félicitations : Nouveau collaborateur embauché !',
      `${candidat.prenom} ${candidat.nom} a accepté la proposition. Le contrat ${numContrat} et le dossier salarié sont créés.`,
      'INFO',
      'RH',
      'bloc4'
    );

    this.saveState();
  }

  // =========================================================================
  // BLOC 4 : CONTRAT ET ONBOARDING
  // =========================================================================

  // Signature du contrat : Attribution automatique du matricule séquentiel unique (RG15)
  public signerContrat(contratId: string, signatureBlobOrSimulated?: string): void {
    const contrat = this.state.contrats.find((c) => c.id === contratId);
    if (!contrat) throw new Error('Contrat introuvable');
    const employe = this.state.employes.find((e) => e.id === contrat.employe_id);
    if (!employe) throw new Error('Employé lié introuvable');

    const now = new Date().toISOString();
    contrat.statut = 'SIGNE';
    contrat.signe_par_employe = true;
    contrat.signe_par_employeur = true;
    contrat.date_signature = now.split('T')[0];
    contrat.document_signe_url = signatureBlobOrSimulated || `contrat_signe_${contrat.numero}.pdf`;

    // RG15 : Si l'employé n'a pas encore de matricule, génération séquentielle unique
    if (!employe.matricule) {
      this.matriculeCounter += 1;
      const annee = new Date().getFullYear();
      const nouveauMatricule = `EMP-${annee}-${String(this.matriculeCounter).padStart(4, '0')}`;
      employe.matricule = nouveauMatricule;

      this.logMouvement(
        'employes',
        employe.id,
        'ATTRIBUTION_MATRICULE',
        null,
        { matricule: nouveauMatricule },
        'Attribution automatique du premier matricule suite à signature du contrat (RG15)'
      );

      this.pushNotification(
        'Matricule collaborateur attribué',
        `Le matricule unique officiel ${nouveauMatricule} a été attribué à ${employe.prenom} ${employe.nom}.`,
        'INFO',
        'RH',
        'bloc4'
      );
    }

    // Cocher automatiquement la tâche d'onboarding liée à la signature du contrat
    const onb = this.state.onboardings.find((o) => o.employe_id === employe.id);
    if (onb) {
      const tacheSignature = onb.taches.find((t) => t.titre.toLowerCase().includes('signature'));
      if (tacheSignature) {
        tacheSignature.statut = 'FAIT';
        tacheSignature.date_realisation = now;
        tacheSignature.commentaire_execution = 'Contrat signé numériquement et archivé.';
        this.recalculerAvancementOnboarding(onb);
      }
    }

    this.logMouvement(
      'contrats',
      contrat.numero,
      'SIGNATURE_CONTRAT',
      { statut: 'CREE' },
      { statut: 'SIGNE', date_signature: contrat.date_signature },
      `Contrat ${contrat.numero} signé par les deux parties`
    );

    this.saveState();
  }

  public validerContrat(contratId: string): void {
    const contrat = this.state.contrats.find((c) => c.id === contratId);
    if (!contrat) throw new Error('Contrat introuvable');
    if (contrat.statut !== 'SIGNE') {
      throw new Error('Un contrat doit être signé avant validation RH.');
    }

    const now = new Date().toISOString();
    contrat.statut = 'VALIDE';
    contrat.date_validation = now.split('T')[0];
    contrat.valide_par = `${this.state.currentUser.prenom} ${this.state.currentUser.nom}`;

    const employe = this.state.employes.find((e) => e.id === contrat.employe_id);
    if (employe) {
      employe.statut = 'ACTIF';
    }

    this.logMouvement(
      'contrats',
      contrat.numero,
      'VALIDATION_CONTRAT_RH',
      { statut: 'SIGNE' },
      { statut: 'VALIDE' },
      'Validation finale RH du contrat de travail'
    );

    this.saveState();
  }

  // Renouvellement ou avenant de contrat (EF4.4, RG20)
  public renouvelerContrat(
    contratId: string,
    details: {
      type_contrat: TypeContrat;
      date_debut: string;
      date_fin?: string;
      remuneration_base: number;
    }
  ): Contrat {
    const contratActuel = this.state.contrats.find((c) => c.id === contratId);
    if (!contratActuel) throw new Error('Contrat actuel introuvable');

    contratActuel.statut = 'RENOUVELE';
    const numContrat = `CTR-2026-${String(this.state.contrats.length + 1).padStart(4, '0')}`;
    const now = new Date().toISOString();

    const nouveauContrat: Contrat = {
      id: `ctr-${Date.now()}`,
      numero: numContrat,
      employe_id: contratActuel.employe_id,
      poste_id: contratActuel.poste_id,
      contrat_precedent_id: contratActuel.id,
      type_contrat: details.type_contrat,
      date_debut: details.date_debut,
      date_fin: details.date_fin,
      remuneration_base: details.remuneration_base,
      duree_hebdomadaire_heures: 40.0,
      lieu_travail: contratActuel.lieu_travail,
      statut: 'CREE',
      signe_par_employe: false,
      signe_par_employeur: false,
      numero_avenant: contratActuel.numero_avenant + 1,
      created_at: now,
    };

    this.state.contrats.push(nouveauContrat);

    this.logMouvement(
      'contrats',
      nouveauContrat.numero,
      'RENOUVELLEMENT_CONTRAT',
      { contrat_precedent: contratActuel.numero },
      { type_contrat: details.type_contrat, remuneration: details.remuneration_base },
      `Renouvellement/Avenant créé à partir du contrat ${contratActuel.numero}`
    );

    this.saveState();
    return nouveauContrat;
  }

  // Mise à jour tâche d'onboarding (EF4.7, RG19 : clôture conditionnée aux tâches obligatoires)
  public majTacheOnboarding(
    tacheId: string,
    nouveauStatut: 'A_FAIRE' | 'EN_COURS' | 'FAIT' | 'BLOQUEE',
    commentaire?: string
  ): void {
    let onboardingConcerne: Onboarding | undefined;
    let tacheConcernee: TacheOnboarding | undefined;

    for (const onb of this.state.onboardings) {
      const t = onb.taches.find((item) => item.id === tacheId);
      if (t) {
        onboardingConcerne = onb;
        tacheConcernee = t;
        break;
      }
    }

    if (!tacheConcernee || !onboardingConcerne) throw new Error('Tâche d’onboarding introuvable');

    const ancienStatut = tacheConcernee.statut;
    tacheConcernee.statut = nouveauStatut;
    if (commentaire) tacheConcernee.commentaire_execution = commentaire;
    if (nouveauStatut === 'FAIT') {
      tacheConcernee.date_realisation = new Date().toISOString();
      tacheConcernee.realise_par = `${this.state.currentUser.prenom} ${this.state.currentUser.nom}`;
    }

    this.recalculerAvancementOnboarding(onboardingConcerne);

    this.logMouvement(
      'taches_onboarding',
      tacheId,
      'MAJ_STATUT_TACHE',
      { statut: ancienStatut },
      { statut: nouveauStatut },
      commentaire || `Mise à jour de la tâche : ${tacheConcernee.titre}`
    );

    this.saveState();
  }

  private recalculerAvancementOnboarding(onb: Onboarding): void {
    const total = onb.taches.length;
    if (total === 0) {
      onb.taux_avancement = 100;
      onb.statut = 'COMPLETE';
      return;
    }

    const faits = onb.taches.filter((t) => t.statut === 'FAIT').length;
    onb.taux_avancement = Math.round((faits / total) * 100);

    // RG19 : Clôture autorisée seulement si TOUTES les tâches OBLIGATOIRES sont faites
    const obligatoiresInachevees = onb.taches.filter((t) => t.obligatoire && t.statut !== 'FAIT');
    if (obligatoiresInachevees.length === 0 && faits === total) {
      onb.statut = 'COMPLETE';
    } else {
      onb.statut = 'EN_COURS';
    }
  }

  public validerPieceDossier(pieceId: string, statut: 'VALIDE' | 'REJETE', commentaire?: string): void {
    const piece = this.state.piecesDossiers.find((p) => p.id === pieceId);
    if (!piece) throw new Error('Pièce de dossier introuvable');

    const ancienStatut = piece.statut;
    piece.statut = statut;
    piece.date_validation = new Date().toISOString().split('T')[0];
    if (commentaire) piece.commentaire = commentaire;

    this.logMouvement(
      'pieces_dossier',
      pieceId,
      `VALIDATION_PIECE_${statut}`,
      { statut: ancienStatut },
      { statut },
      commentaire || `Pièce ${piece.libelle} marquée comme ${statut}`
    );

    this.saveState();
  }
}

export const sirhStore = new SirhDataStore();
