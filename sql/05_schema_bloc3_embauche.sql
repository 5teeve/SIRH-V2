-- =============================================================================
-- SCRIPT 05 : SCHÉMA BLOC 3 — SÉLECTION ET EMBAUCHE
-- Propositions d'embauche versionnées, Dossier Employé et Pièces justificatives
-- =============================================================================

-- Propositions d'embauche (EF3.1, RG11 : chaque renégociation crée une nouvelle version)
CREATE TABLE IF NOT EXISTS propositions_embauche (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero VARCHAR(50) NOT NULL UNIQUE, -- Ex: PROP-2026-0001
    candidature_id UUID NOT NULL REFERENCES candidatures(id) ON DELETE RESTRICT,
    poste_id UUID NOT NULL REFERENCES postes(id) ON DELETE RESTRICT,
    version INT NOT NULL DEFAULT 1,
    remuneration_mensuelle NUMERIC(12, 2) NOT NULL CHECK (remuneration_mensuelle > 0),
    type_contrat type_contrat_enum NOT NULL,
    date_debut_prevue DATE NOT NULL,
    duree_mois INT, -- Si CDD ou Stage
    periode_essai_jours INT NOT NULL DEFAULT 90,
    horaires_travail VARCHAR(100) NOT NULL DEFAULT '40h/semaine (Lundi au Vendredi)',
    lieu_travail VARCHAR(150) NOT NULL,
    avantages TEXT[] DEFAULT '{}',
    date_limite_reponse DATE NOT NULL,
    
    statut proposition_statut_enum NOT NULL DEFAULT 'PROPOSEE',
    date_reponse TIMESTAMPTZ,
    motif_refus_ou_negociation TEXT,
    
    emise_par UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT uq_proposition_candidature_version UNIQUE (candidature_id, version)
);

CREATE INDEX IF NOT EXISTS idx_propositions_candidature ON propositions_embauche(candidature_id);

-- Dossier Employé (EF3.5, RG08, RG13 : distinct du candidat, type de contrat non stocké sur l'employé)
CREATE TABLE IF NOT EXISTS employes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matricule VARCHAR(50) UNIQUE, -- Généré automatiquement lors de la signature du 1er contrat (RG15)
    candidat_origine_id UUID NOT NULL REFERENCES candidats(id) ON DELETE RESTRICT,
    candidature_origine_id UUID NOT NULL REFERENCES candidatures(id) ON DELETE RESTRICT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    cin VARCHAR(50) NOT NULL UNIQUE,
    date_naissance DATE NOT NULL,
    lieu_naissance VARCHAR(150),
    nationalite VARCHAR(100) DEFAULT 'Malgache',
    situation_matrimoniale VARCHAR(50) DEFAULT 'Célibataire',
    nombre_enfants INT DEFAULT 0,
    email_professionnel VARCHAR(255) UNIQUE,
    email_personnel VARCHAR(255) NOT NULL,
    telephone VARCHAR(50) NOT NULL,
    adresse_domicile TEXT NOT NULL,
    numero_cnaps VARCHAR(50), -- Caisse Nationale de Prévoyance Sociale
    numero_ostie VARCHAR(50), -- Organisation Sanitaire Tananarivienne Inter-Entreprises
    rib_bancaire VARCHAR(100),
    
    statut VARCHAR(30) NOT NULL DEFAULT 'ACTIF', -- 'EN_ONBOARDING', 'ACTIF', 'SUSPENDU', 'SORTI'
    date_entree DATE NOT NULL,
    date_sortie DATE,
    
    compte_utilisateur_id UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_employes_matricule ON employes(matricule);
CREATE INDEX IF NOT EXISTS idx_employes_cin ON employes(cin);

-- Pièces du dossier Salarié (EF3.6 : statuts En attente, Reçu, Validé, Rejeté)
CREATE TABLE IF NOT EXISTS pieces_dossier (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employe_id UUID NOT NULL REFERENCES employes(id) ON DELETE CASCADE,
    type_piece VARCHAR(100) NOT NULL, -- 'CIN', 'DIPLOME', 'CERTIFICAT_TRAVAIL', 'RIB', 'CASIER_JUDICIAIRE', 'PHOTO_IDENTITE', 'CERTIFICAT_MEDICAL'
    libelle VARCHAR(255) NOT NULL,
    obligatoire BOOLEAN NOT NULL DEFAULT TRUE,
    statut piece_statut_enum NOT NULL DEFAULT 'EN_ATTENTE',
    url_fichier TEXT,
    date_reception DATE,
    date_validation DATE,
    valide_par UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
    commentaire TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_employe_piece UNIQUE (employe_id, type_piece)
);

CREATE INDEX IF NOT EXISTS idx_pieces_employe ON pieces_dossier(employe_id);
