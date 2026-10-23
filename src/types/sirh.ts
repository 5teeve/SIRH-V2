/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'ADMIN' | 'MANAGER' | 'RH' | 'FINANCE' | 'DIRECTION' | 'EMPLOYE';

export interface Utilisateur {
  id: string;
  matricule?: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  departement_id?: string;
  service_id?: string;
  actif: boolean;
  avatar_url?: string;
}

export type DemandeType = 'CREATION' | 'REMPLACEMENT';
export type DemandeUrgence = 'NORMALE' | 'URGENTE' | 'TRES_URGENTE';
export type DemandeStatut =
  | 'BROUILLON'
  | 'SOUMISE'
  | 'VALIDEE_RH'
  | 'VALIDEE_FINANCE'
  | 'VALIDEE_DIRECTION'
  | 'OUVERTE'
  | 'A_REVOIR'
  | 'EN_ATTENTE_BUDGET'
  | 'REJETEE'
  | 'ANNULEE';

export type DecisionValidation = 'VALIDER' | 'RENVOYER' | 'METTRE_EN_ATTENTE' | 'REJETER';

export type TypeContrat = 'CDI' | 'CDD' | 'STAGE' | 'PRESTATION' | 'APPRENTISSAGE';

export interface Departement {
  id: string;
  code: string;
  nom: string;
  description: string;
  responsable_id?: string;
}

export interface Service {
  id: string;
  departement_id: string;
  code: string;
  nom: string;
  description: string;
  responsable_id?: string;
}

export interface Poste {
  id: string;
  code: string;
  intitule: string;
  departement_id: string;
  service_id: string;
  description: string;
  competences_requises: string[];
  fourchette_salaire_min: number;
  fourchette_salaire_max: number;
  effectif_autorise: number;
  effectif_pourvu: number; // effectif_vacant = effectif_autorise - effectif_pourvu
  statut: 'ACTIF' | 'GELE' | 'FERME';
}

export interface ValidationDemande {
  id: string;
  demande_id: string;
  etape: 'RH' | 'FINANCE' | 'DIRECTION';
  valideur_id: string;
  valideur_nom: string;
  decision: DecisionValidation;
  commentaire?: string;
  motif_refus_code?: string;
  created_at: string;
}

export interface DemandeRecrutement {
  id: string;
  numero: string;
  type: DemandeType;
  demandeur_id: string;
  demandeur_nom: string;
  poste_id: string;
  departement_id: string;
  service_id: string;
  nombre_postes: number;
  motif: string;
  justification: string;
  type_contrat_souhaite: TypeContrat;
  date_souhaitee: string;
  urgence: DemandeUrgence;
  budget_estime: number;
  ancien_titulaire_ref?: string;
  statut: DemandeStatut;
  etape_validation_actuelle: 'MANAGER' | 'RH' | 'FINANCE' | 'DIRECTION' | 'CLOTURE';
  date_reexamen_budget?: string;
  motif_refus_ou_renvoi?: string;
  validations: ValidationDemande[];
  created_at: string;
  updated_at: string;
}

export type OffreStatut = 'BROUILLON' | 'PUBLIEE' | 'CLOTUREE' | 'POURVUE' | 'ANNULEE';

export interface OffreEmploi {
  id: string;
  reference: string;
  demande_id: string;
  poste_id: string;
  titre: string;
  departement_id: string;
  missions: string;
  profil_recherche: string;
  competences_requises: string[];
  type_contrat: TypeContrat;
  lieu: string;
  salaire_affiche: boolean;
  salaire_min?: number;
  salaire_max?: number;
  nombre_postes: number;
  postes_pourvus: number;
  date_publication?: string;
  date_cloture: string;
  statut: OffreStatut;
  cree_par: string;
  created_at: string;
}

export interface Candidat {
  id: string;
  cin: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  email: string;
  telephone: string;
  adresse: string;
  cv_url: string;
  lettre_motivation_url?: string;
  diplomes_url?: string[];
  titre_actuel?: string;
  annees_experience: number;
  created_at: string;
}

export type CandidatureStatut =
  | 'RECUE'
  | 'PRESELECTIONNEE'
  | 'EN_ENTRETIEN'
  | 'EN_TEST'
  | 'RETENUE'
  | 'PROPOSITION_ENVOYEE'
  | 'ACCEPTEE'
  | 'REFUSEE'
  | 'RETIREE'
  | 'REFUSE_PAR_CANDIDAT';

export interface Candidature {
  id: string;
  numero: string;
  offre_id: string;
  candidat_id: string;
  date_candidature: string;
  statut: CandidatureStatut;
  score_preselection?: number;
  rang_final?: number;
  motif_refus?: string;
  commentaires_rh?: string;
  created_at: string;
  updated_at: string;
}

export type EntretienType = 'ENTRETIEN_RH' | 'ENTRETIEN_TECHNIQUE' | 'TEST_ECRIT' | 'TEST_PRATIQUE';
export type EntretienStatut = 'PLANIFIE' | 'REALISE' | 'ANNULE' | 'REPORTE';
export type RecommandationEval = 'FAVORABLE' | 'RESERVE' | 'DEFAVORABLE';

export interface Entretien {
  id: string;
  candidature_id: string;
  type: EntretienType;
  date_heure_debut: string; // ISO String
  date_heure_fin: string; // ISO String
  salle_ou_lien: string;
  statut: EntretienStatut;
  participants_ids: string[];
  motif_annulation_ou_report?: string;
  created_at: string;
}

export interface NoteCritere {
  critere_id: string;
  libelle: string;
  note: number; // 0 à 5
  ponderation: number;
  commentaire?: string;
}

export interface Evaluation {
  id: string;
  entretien_id: string;
  evaluateur_id: string;
  evaluateur_nom: string;
  version: number;
  est_verrouillee: boolean;
  date_verrouillage?: string;
  recommandation: RecommandationEval;
  points_forts: string;
  points_amelioration: string;
  commentaire_general: string;
  notes: NoteCritere[];
  note_moyenne_ponderee: number;
  created_at: string;
}

export type PropositionStatut = 'PROPOSEE' | 'ACCEPTEE' | 'REFUSEE' | 'NEGOCIATION';

export interface PropositionEmbauche {
  id: string;
  numero: string;
  candidature_id: string;
  poste_id: string;
  version: number;
  remuneration_mensuelle: number;
  type_contrat: TypeContrat;
  date_debut_prevue: string;
  duree_mois?: number;
  periode_essai_jours: number;
  horaires_travail: string;
  lieu_travail: string;
  avantages: string[];
  date_limite_reponse: string;
  statut: PropositionStatut;
  date_reponse?: string;
  motif_refus_ou_negociation?: string;
  emise_par: string;
  created_at: string;
}

export type ContratStatut = 'CREE' | 'SIGNE' | 'VALIDE' | 'TERMINE' | 'ANNULE' | 'RENOUVELE';

export interface Contrat {
  id: string;
  numero: string;
  employe_id: string;
  poste_id: string;
  contrat_precedent_id?: string;
  type_contrat: TypeContrat;
  date_debut: string;
  date_fin?: string;
  periode_essai_fin?: string;
  remuneration_base: number;
  duree_hebdomadaire_heures: number;
  lieu_travail: string;
  statut: ContratStatut;
  date_signature?: string;
  document_signe_url?: string;
  signe_par_employe: boolean;
  signe_par_employeur: boolean;
  date_validation?: string;
  valide_par?: string;
  motif_annulation?: string;
  numero_avenant: number;
  created_at: string;
}

export type PieceStatut = 'EN_ATTENTE' | 'RECU' | 'VALIDE' | 'REJETE';

export interface PieceDossier {
  id: string;
  employe_id: string;
  type_piece: string;
  libelle: string;
  obligatoire: boolean;
  statut: PieceStatut;
  url_fichier?: string;
  date_reception?: string;
  date_validation?: string;
  commentaire?: string;
}

export interface Employe {
  id: string;
  matricule?: string; // attribué lors de la signature du 1er contrat (RG15)
  candidat_origine_id: string;
  candidature_origine_id: string;
  nom: string;
  prenom: string;
  cin: string;
  date_naissance: string;
  lieu_naissance?: string;
  nationalite: string;
  situation_matrimoniale: string;
  email_professionnel?: string;
  email_personnel: string;
  telephone: string;
  adresse_domicile: string;
  numero_cnaps?: string;
  numero_ostie?: string;
  rib_bancaire?: string;
  statut: 'EN_ONBOARDING' | 'ACTIF' | 'SUSPENDU' | 'SORTI';
  date_entree: string;
  date_sortie?: string;
  created_at: string;
}

export interface Affectation {
  id: string;
  employe_id: string;
  poste_id: string;
  departement_id: string;
  service_id: string;
  contrat_id: string;
  motif: 'EMBAUCHE' | 'MUTATION' | 'PROMOTION' | 'REORGANISATION';
  date_debut: string;
  date_fin?: string;
  est_actuelle: boolean;
  lieu_affectation: string;
  notes?: string;
  created_at: string;
}

export type TacheResponsable = 'RH' | 'IT' | 'LOGISTIQUE' | 'MANAGER' | 'PAIE';
export type TacheStatut = 'A_FAIRE' | 'EN_COURS' | 'FAIT' | 'BLOQUEE';

export interface TacheOnboarding {
  id: string;
  onboarding_id: string;
  titre: string;
  description: string;
  responsable: TacheResponsable;
  assigne_a?: string;
  date_echeance: string;
  obligatoire: boolean;
  statut: TacheStatut;
  date_realisation?: string;
  realise_par?: string;
  commentaire_execution?: string;
  url_piece_jointe?: string;
  depend_de_tache_id?: string;
}

export interface Onboarding {
  id: string;
  employe_id: string;
  contrat_id: string;
  date_debut: string;
  date_fin_prevue: string;
  date_cloture_reelle?: string;
  statut: 'EN_COURS' | 'COMPLETE' | 'CLOTURE' | 'SUSPENDU';
  taux_avancement: number; // 0 - 100%
  commentaires?: string;
  taches: TacheOnboarding[];
  created_at: string;
}

export interface JournalMouvement {
  id: number;
  utilisateur_id?: string;
  nom_utilisateur: string;
  role_utilisateur: UserRole;
  entite: string;
  entite_id: string;
  action: string;
  valeur_avant?: any;
  valeur_apres?: any;
  motif_ou_commentaire?: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  destinataire_role?: UserRole;
  destinataire_id?: string;
  titre: string;
  message: string;
  type: 'INFO' | 'ACTION_REQUISE' | 'VALIDATION' | 'ALERTE';
  lien_onglet?: string;
  lu: boolean;
  created_at: string;
}

export interface Parametre {
  cle: string;
  valeur: string;
  description: string;
}

export interface Referentiel {
  id: string;
  categorie: string;
  code: string;
  libelle: string;
  description?: string;
  ordre: number;
}
