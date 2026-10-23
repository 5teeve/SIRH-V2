-- =============================================================================
-- SCRIPT 04 : SCHÉMA BLOC 2 — RECRUTEMENT
-- Offres, Candidats, Candidatures, Grilles de notation, Entretiens & Évaluations
-- =============================================================================

-- Offres d'emploi (EF2.1, RG06 : issue d'une demande OUVERTE uniquement)
CREATE TABLE IF NOT EXISTS offres_emploi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference VARCHAR(50) NOT NULL UNIQUE, -- Ex: OFF-2026-0001
    demande_id UUID NOT NULL REFERENCES demandes_recrutement(id) ON DELETE RESTRICT,
    poste_id UUID NOT NULL REFERENCES postes(id) ON DELETE RESTRICT,
    titre VARCHAR(255) NOT NULL,
    departement_id UUID NOT NULL REFERENCES departements(id) ON DELETE RESTRICT,
    missions TEXT NOT NULL,
    profil_recherche TEXT NOT NULL,
    competences_requises TEXT[] NOT NULL DEFAULT '{}',
    type_contrat type_contrat_enum NOT NULL,
    lieu VARCHAR(150) NOT NULL,
    salaire_affiche BOOLEAN NOT NULL DEFAULT FALSE,
    salaire_min NUMERIC(12, 2),
    salaire_max NUMERIC(12, 2),
    nombre_postes INT NOT NULL DEFAULT 1 CHECK (nombre_postes > 0),
    postes_pourvus INT NOT NULL DEFAULT 0 CHECK (postes_pourvus >= 0),
    date_publication DATE,
    date_cloture DATE NOT NULL,
    statut offre_statut_enum NOT NULL DEFAULT 'BROUILLON',
    cree_par UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_offres_statut ON offres_emploi(statut);
CREATE INDEX IF NOT EXISTS idx_offres_poste ON offres_emploi(poste_id);

-- Candidats (EF2.3, RG07, RG08 : Fiche unique distincte de l'employé, détection de doublon)
CREATE TABLE IF NOT EXISTS candidats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cin VARCHAR(50) NOT NULL, -- Carte d'Identité Nationale ou Passeport
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE NOT NULL,
    email VARCHAR(255) NOT NULL,
    telephone VARCHAR(50) NOT NULL,
    adresse TEXT NOT NULL,
    cv_url TEXT NOT NULL,
    lettre_motivation_url TEXT,
    diplomes_url TEXT[] DEFAULT '{}',
    titre_actuel VARCHAR(150),
    annees_experience INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    
    -- Unicité sur le CIN et sur l'email
    CONSTRAINT uq_candidat_cin UNIQUE (cin),
    CONSTRAINT uq_candidat_email UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_candidats_nom_prenom ON candidats(nom, prenom);

-- Candidatures (EF2.4 : Lien Candidat <-> Offre)
CREATE TABLE IF NOT EXISTS candidatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero VARCHAR(50) NOT NULL UNIQUE, -- Ex: CAN-2026-0001
    offre_id UUID NOT NULL REFERENCES offres_emploi(id) ON DELETE RESTRICT,
    candidat_id UUID NOT NULL REFERENCES candidats(id) ON DELETE RESTRICT,
    date_candidature TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    statut candidature_statut_enum NOT NULL DEFAULT 'RECUE',
    score_preselection NUMERIC(5, 2), -- Score calculé sur 100
    rang_final INT,
    motif_refus TEXT,
    commentaires_rh TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT uq_candidature_offre_candidat UNIQUE (offre_id, candidat_id)
);

CREATE INDEX IF NOT EXISTS idx_candidatures_offre ON candidatures(offre_id);
CREATE INDEX IF NOT EXISTS idx_candidatures_candidat ON candidatures(candidat_id);
CREATE INDEX IF NOT EXISTS idx_candidatures_statut ON candidatures(statut);

-- Grilles et critères d'évaluation (EF2.5)
CREATE TABLE IF NOT EXISTS grilles_evaluation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    poste_id UUID REFERENCES postes(id) ON DELETE SET NULL,
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS criteres_evaluation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grille_id UUID NOT NULL REFERENCES grilles_evaluation(id) ON DELETE CASCADE,
    libelle VARCHAR(255) NOT NULL,
    description TEXT,
    ponderation INT NOT NULL DEFAULT 1 CHECK (ponderation > 0),
    note_maximale INT NOT NULL DEFAULT 5,
    ordre INT NOT NULL DEFAULT 0
);

-- Entretiens et tests (EF2.6, RG09 : anti-chevauchement des horaires et salles)
CREATE TABLE IF NOT EXISTS entretiens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidature_id UUID NOT NULL REFERENCES candidatures(id) ON DELETE CASCADE,
    type entretien_type_enum NOT NULL,
    date_heure_debut TIMESTAMPTZ NOT NULL,
    date_heure_fin TIMESTAMPTZ NOT NULL,
    salle_ou_lien VARCHAR(255) NOT NULL,
    statut entretien_statut_enum NOT NULL DEFAULT 'PLANIFIE',
    motif_annulation_ou_report TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT chk_entretien_duree CHECK (date_heure_fin > date_heure_debut)
);

CREATE INDEX IF NOT EXISTS idx_entretiens_debut ON entretiens(date_heure_debut);

-- Participants / Intervieweurs d'un entretien (RG09)
CREATE TABLE IF NOT EXISTS participants_entretien (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entretien_id UUID NOT NULL REFERENCES entretiens(id) ON DELETE CASCADE,
    utilisateur_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE RESTRICT,
    role_dans_entretien VARCHAR(100) DEFAULT 'INTERVIEWEUR',
    CONSTRAINT uq_participant_entretien UNIQUE (entretien_id, utilisateur_id)
);

-- Évaluations (EF2.7, RG10 : verrouillée une fois validée, nouvelle version si correction)
CREATE TABLE IF NOT EXISTS evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entretien_id UUID NOT NULL REFERENCES entretiens(id) ON DELETE CASCADE,
    evaluateur_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE RESTRICT,
    grille_id UUID REFERENCES grilles_evaluation(id) ON DELETE SET NULL,
    version INT NOT NULL DEFAULT 1,
    est_verrouillee BOOLEAN NOT NULL DEFAULT FALSE,
    date_verrouillage TIMESTAMPTZ,
    recommandation evaluation_recommandation_enum NOT NULL,
    points_forts TEXT,
    points_amelioration TEXT,
    commentaire_general TEXT,
    note_moyenne_ponderee NUMERIC(4, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_evaluation_version UNIQUE (entretien_id, evaluateur_id, version)
);

-- Notes par critère au sein d'une évaluation
CREATE TABLE IF NOT EXISTS notes_evaluation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
    critere_id UUID NOT NULL REFERENCES criteres_evaluation(id) ON DELETE RESTRICT,
    note NUMERIC(4, 2) NOT NULL CHECK (note >= 0),
    commentaire TEXT,
    CONSTRAINT uq_note_critere UNIQUE (evaluation_id, critere_id)
);
