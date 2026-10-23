-- =============================================================================
-- SCRIPT 06 : SCHÉMA BLOC 4 — CONTRAT ET ONBOARDING
-- Contrats successifs, Affectations, Checklist Onboarding & Alertes d'échéance
-- =============================================================================

-- Contrats de travail (EF4.1, EF4.2, EF4.3, EF4.4, RG14 : un seul contrat actif à la fois)
CREATE TABLE IF NOT EXISTS contrats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero VARCHAR(50) NOT NULL UNIQUE, -- Ex: CTR-2026-0001
    employe_id UUID NOT NULL REFERENCES employes(id) ON DELETE RESTRICT,
    poste_id UUID NOT NULL REFERENCES postes(id) ON DELETE RESTRICT,
    contrat_precedent_id UUID REFERENCES contrats(id) ON DELETE SET NULL, -- En cas de renouvellement/avenant
    type_contrat type_contrat_enum NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE, -- Requis si CDD ou Stage
    periode_essai_fin DATE,
    remuneration_base NUMERIC(12, 2) NOT NULL CHECK (remuneration_base > 0),
    duree_hebdomadaire_heures NUMERIC(4, 1) NOT NULL DEFAULT 40.0,
    lieu_travail VARCHAR(150) NOT NULL,
    statut contrat_statut_enum NOT NULL DEFAULT 'CREE',
    
    -- Signature (EF4.3)
    date_signature DATE,
    document_signe_url TEXT,
    signe_par_employe BOOLEAN NOT NULL DEFAULT FALSE,
    signe_par_employeur BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Validation finale RH
    date_validation DATE,
    valide_par UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
    motif_annulation TEXT,
    
    numero_avenant INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    
    CONSTRAINT chk_contrat_dates CHECK (date_fin IS NULL OR date_fin >= date_debut)
);

CREATE INDEX IF NOT EXISTS idx_contrats_employe ON contrats(employe_id);
CREATE INDEX IF NOT EXISTS idx_contrats_statut ON contrats(statut);

-- Affectations de poste (EF4.5, RG16 : un seul poste principal actif par employé)
CREATE TABLE IF NOT EXISTS affectations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employe_id UUID NOT NULL REFERENCES employes(id) ON DELETE RESTRICT,
    poste_id UUID NOT NULL REFERENCES postes(id) ON DELETE RESTRICT,
    departement_id UUID NOT NULL REFERENCES departements(id) ON DELETE RESTRICT,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    contrat_id UUID NOT NULL REFERENCES contrats(id) ON DELETE RESTRICT,
    motif affectation_motif_enum NOT NULL DEFAULT 'EMBAUCHE',
    date_debut DATE NOT NULL,
    date_fin DATE,
    est_actuelle BOOLEAN NOT NULL DEFAULT TRUE,
    lieu_affectation VARCHAR(150) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_affectations_employe ON affectations(employe_id, est_actuelle);
CREATE INDEX IF NOT EXISTS idx_affectations_poste ON affectations(poste_id);

-- Modèles de checklist d'onboarding (EF4.6)
CREATE TABLE IF NOT EXISTS modeles_onboarding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    poste_id UUID REFERENCES postes(id) ON DELETE SET NULL, -- Spécifique ou NULL pour universel
    type_contrat type_contrat_enum, -- Optionnel
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Éléments configurables du modèle
CREATE TABLE IF NOT EXISTS elements_modele_onboarding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    modele_id UUID NOT NULL REFERENCES modeles_onboarding(id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    responsable tache_responsable_enum NOT NULL,
    delai_jours_apres_debut INT NOT NULL DEFAULT 1,
    obligatoire BOOLEAN NOT NULL DEFAULT TRUE,
    ordre INT NOT NULL DEFAULT 0
);

-- Instances d'onboarding par employé (EF4.6, EF4.8)
CREATE TABLE IF NOT EXISTS onboardings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employe_id UUID NOT NULL REFERENCES employes(id) ON DELETE CASCADE,
    contrat_id UUID NOT NULL REFERENCES contrats(id) ON DELETE RESTRICT,
    modele_id UUID REFERENCES modeles_onboarding(id) ON DELETE SET NULL,
    date_debut DATE NOT NULL,
    date_fin_prevue DATE NOT NULL,
    date_cloture_reelle DATE,
    statut onboarding_statut_enum NOT NULL DEFAULT 'EN_COURS',
    taux_avancement NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    commentaires TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_onboardings_employe ON onboardings(employe_id);

-- Tâches concrètes d'onboarding (EF4.7, RG19 : clôture conditionnée aux tâches obligatoires)
CREATE TABLE IF NOT EXISTS taches_onboarding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    onboarding_id UUID NOT NULL REFERENCES onboardings(id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    responsable tache_responsable_enum NOT NULL,
    assigne_a UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
    date_echeance DATE NOT NULL,
    obligatoire BOOLEAN NOT NULL DEFAULT TRUE,
    statut tache_statut_enum NOT NULL DEFAULT 'A_FAIRE',
    date_realisation TIMESTAMPTZ,
    realise_par UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
    commentaire_execution TEXT,
    url_piece_jointe TEXT,
    depend_de_tache_id UUID REFERENCES taches_onboarding(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_taches_onboarding_id ON taches_onboarding(onboarding_id);
CREATE INDEX IF NOT EXISTS idx_taches_responsable ON taches_onboarding(responsable, statut);

-- Échéances & Alertes automatiques (EF4.9 : fins de période d'essai et CDD)
CREATE TABLE IF NOT EXISTS echeances_alertes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employe_id UUID NOT NULL REFERENCES employes(id) ON DELETE CASCADE,
    contrat_id UUID NOT NULL REFERENCES contrats(id) ON DELETE CASCADE,
    type_alerte VARCHAR(50) NOT NULL, -- 'FIN_PERIODE_ESSAI', 'FIN_CDD', 'RENOUVELLEMENT_MAX_CDD'
    date_echeance DATE NOT NULL,
    date_notification_prevue DATE NOT NULL,
    notifie BOOLEAN NOT NULL DEFAULT FALSE,
    date_notification_reelle TIMESTAMPTZ,
    statut VARCHAR(30) NOT NULL DEFAULT 'A_TRAITER', -- 'A_TRAITER', 'TRAITE', 'IGNORE'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alertes_echeance ON echeances_alertes(date_notification_prevue, notifie);
