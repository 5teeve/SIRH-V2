-- =============================================================================
-- SCRIPT 01 : EXTENSIONS ET TYPES ENUM
-- Système d'Information des Ressources Humaines (SIRH)
-- =============================================================================

-- Activation des extensions requises
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. Rôles transversaux
-- -----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM (
        'ADMIN',
        'MANAGER',
        'RH',
        'FINANCE',
        'DIRECTION',
        'EMPLOYE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- -----------------------------------------------------------------------------
-- 2. Bloc 1 : Statuts Demande de Recrutement
-- Circuit : BROUILLON -> SOUMISE -> VALIDEE_RH -> VALIDEE_FINANCE -> VALIDEE_DIRECTION -> OUVERTE
-- Sorties : A_REVOIR, EN_ATTENTE_BUDGET, REJETEE, ANNULEE
-- -----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE demande_type_enum AS ENUM (
        'CREATION',
        'REMPLACEMENT'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE demande_urgence_enum AS ENUM (
        'NORMALE',
        'URGENTE',
        'TRES_URGENTE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE demande_statut_enum AS ENUM (
        'BROUILLON',
        'SOUMISE',
        'VALIDEE_RH',
        'VALIDEE_FINANCE',
        'VALIDEE_DIRECTION',
        'OUVERTE',
        'A_REVOIR',
        'EN_ATTENTE_BUDGET',
        'REJETEE',
        'ANNULEE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE decision_validation_enum AS ENUM (
        'VALIDER',
        'RENVOYER',
        'METTRE_EN_ATTENTE',
        'REJETER'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- -----------------------------------------------------------------------------
-- 3. Bloc 2 : Recrutement & Candidatures
-- -----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE offre_statut_enum AS ENUM (
        'BROUILLON',
        'PUBLIEE',
        'CLOTUREE',
        'POURVUE',
        'ANNULEE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE candidature_statut_enum AS ENUM (
        'RECUE',
        'PRESELECTIONNEE',
        'EN_ENTRETIEN',
        'EN_TEST',
        'RETENUE',
        'PROPOSITION_ENVOYEE',
        'ACCEPTEE',
        'REFUSEE',
        'RETIREE',
        'REFUSE_PAR_CANDIDAT'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE entretien_type_enum AS ENUM (
        'ENTRETIEN_RH',
        'ENTRETIEN_TECHNIQUE',
        'TEST_ECRIT',
        'TEST_PRATIQUE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE entretien_statut_enum AS ENUM (
        'PLANIFIE',
        'REALISE',
        'ANNULE',
        'REPORTE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE evaluation_recommandation_enum AS ENUM (
        'FAVORABLE',
        'RESERVE',
        'DEFAVORABLE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- -----------------------------------------------------------------------------
-- 4. Bloc 3 : Embauche & Contrat
-- -----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE proposition_statut_enum AS ENUM (
        'PROPOSEE',
        'ACCEPTEE',
        'REFUSEE',
        'NEGOCIATION'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE type_contrat_enum AS ENUM (
        'CDI',
        'CDD',
        'STAGE',
        'PRESTATION',
        'APPRENTISSAGE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE contrat_statut_enum AS ENUM (
        'CREE',
        'SIGNE',
        'VALIDE',
        'TERMINE',
        'ANNULE',
        'RENOUVELE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE affectation_motif_enum AS ENUM (
        'EMBAUCHE',
        'MUTATION',
        'PROMOTION',
        'REORGANISATION'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE piece_statut_enum AS ENUM (
        'EN_ATTENTE',
        'RECU',
        'VALIDE',
        'REJETE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- -----------------------------------------------------------------------------
-- 5. Bloc 4 : Onboarding
-- -----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE onboarding_statut_enum AS ENUM (
        'EN_COURS',
        'COMPLETE',
        'CLOTURE',
        'SUSPENDU'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE tache_responsable_enum AS ENUM (
        'RH',
        'IT',
        'LOGISTIQUE',
        'MANAGER',
        'PAIE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE tache_statut_enum AS ENUM (
        'A_FAIRE',
        'EN_COURS',
        'FAIT',
        'BLOQUEE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
