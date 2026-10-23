-- =============================================================================
-- SCRIPT 03 : SCHÉMA BLOC 1 — EXPRESSION DU BESOIN EN PERSONNEL
-- Unités (Départements / Services), Postes, Demandes et Validations
-- =============================================================================

-- Départements
CREATE TABLE IF NOT EXISTS departements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) NOT NULL UNIQUE,
    nom VARCHAR(150) NOT NULL,
    description TEXT,
    responsable_id UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);

-- Services rattachés aux départements
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    departement_id UUID NOT NULL REFERENCES departements(id) ON DELETE RESTRICT,
    code VARCHAR(20) NOT NULL UNIQUE,
    nom VARCHAR(150) NOT NULL,
    description TEXT,
    responsable_id UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_services_dept ON services(departement_id);

-- Postes (EF1.1, RG01 : un poste existe sans employé)
CREATE TABLE IF NOT EXISTS postes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) NOT NULL UNIQUE,
    intitule VARCHAR(200) NOT NULL,
    departement_id UUID NOT NULL REFERENCES departements(id) ON DELETE RESTRICT,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    description TEXT NOT NULL,
    competences_requises TEXT[] NOT NULL DEFAULT '{}',
    fourchette_salaire_min NUMERIC(12, 2) NOT NULL,
    fourchette_salaire_max NUMERIC(12, 2) NOT NULL,
    effectif_autorise INT NOT NULL CHECK (effectif_autorise >= 0),
    effectif_pourvu INT NOT NULL DEFAULT 0 CHECK (effectif_pourvu >= 0),
    -- effectif_vacant est une colonne calculée : (effectif_autorise - effectif_pourvu)
    statut VARCHAR(30) NOT NULL DEFAULT 'ACTIF', -- 'ACTIF', 'GELE', 'FERME'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_postes_service ON postes(service_id);

-- Demandes de recrutement (EF1.2, EF1.3, EF1.4)
CREATE TABLE IF NOT EXISTS demandes_recrutement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero VARCHAR(50) NOT NULL UNIQUE, -- Ex: DEM-2026-0001
    type demande_type_enum NOT NULL, -- 'CREATION' ou 'REMPLACEMENT'
    demandeur_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE RESTRICT,
    poste_id UUID NOT NULL REFERENCES postes(id) ON DELETE RESTRICT,
    departement_id UUID NOT NULL REFERENCES departements(id) ON DELETE RESTRICT,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    nombre_postes INT NOT NULL DEFAULT 1 CHECK (nombre_postes > 0),
    motif TEXT NOT NULL,
    justification TEXT NOT NULL,
    type_contrat_souhaite type_contrat_enum NOT NULL,
    date_souhaitee DATE NOT NULL,
    urgence demande_urgence_enum NOT NULL DEFAULT 'NORMALE',
    budget_estime NUMERIC(12, 2) NOT NULL CHECK (budget_estime > 0),
    ancien_titulaire_ref VARCHAR(255), -- Référence en cas de REMPLACEMENT
    
    statut demande_statut_enum NOT NULL DEFAULT 'BROUILLON',
    etape_validation_actuelle VARCHAR(30) DEFAULT 'MANAGER', -- 'MANAGER', 'RH', 'FINANCE', 'DIRECTION', 'CLOTURE'
    
    date_reexamen_budget DATE, -- En cas de mise en attente budget (EN_ATTENTE_BUDGET)
    motif_refus_ou_renvoi TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_demandes_statut ON demandes_recrutement(statut);
CREATE INDEX IF NOT EXISTS idx_demandes_demandeur ON demandes_recrutement(demandeur_id);
CREATE INDEX IF NOT EXISTS idx_demandes_poste ON demandes_recrutement(poste_id);

-- Validations de demande (Circuit séquentiel : RH -> Finance -> Direction)
CREATE TABLE IF NOT EXISTS validations_demande (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    demande_id UUID NOT NULL REFERENCES demandes_recrutement(id) ON DELETE CASCADE,
    etape VARCHAR(30) NOT NULL, -- 'RH', 'FINANCE', 'DIRECTION'
    valideur_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE RESTRICT,
    decision decision_validation_enum NOT NULL,
    commentaire TEXT,
    motif_refus_code VARCHAR(100), -- Lié au référentiel MOTIF_REFUS
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_validations_demande ON validations_demande(demande_id, etape);
