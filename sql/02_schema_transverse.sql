-- =============================================================================
-- SCRIPT 02 : SCHÉMA TRANSVERSE
-- Utilisateurs, Droits, Audit, Notifications, Référentiels et Paramètres
-- =============================================================================

-- Table des utilisateurs internes
CREATE TABLE IF NOT EXISTS utilisateurs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matricule VARCHAR(50) UNIQUE,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL,
    departement_id UUID,
    service_id UUID,
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    date_derniere_connexion TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_utilisateurs_email ON utilisateurs(email);
CREATE INDEX IF NOT EXISTS idx_utilisateurs_role ON utilisateurs(role);

-- Référentiels dynamiques (types d'évaluation, motifs de refus, motifs de renvoi, etc.)
CREATE TABLE IF NOT EXISTS referentiels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    categorie VARCHAR(50) NOT NULL, -- 'MOTIF_REFUS', 'MOTIF_RENVOI', 'LIEU_TRAVAIL', etc.
    code VARCHAR(50) NOT NULL,
    libelle VARCHAR(255) NOT NULL,
    description TEXT,
    ordre INT NOT NULL DEFAULT 0,
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_referentiel_cat_code UNIQUE (categorie, code)
);

CREATE INDEX IF NOT EXISTS idx_referentiels_categorie ON referentiels(categorie);

-- Paramètres généraux du système (ET7)
CREATE TABLE IF NOT EXISTS parametres (
    cle VARCHAR(100) PRIMARY KEY,
    valeur TEXT NOT NULL,
    type_donnee VARCHAR(30) NOT NULL DEFAULT 'STRING', -- 'STRING', 'INTEGER', 'BOOLEAN', 'JSON'
    description TEXT,
    modifiable_par_admin BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Journal des mouvements immuable (ET2, ET10, RG18)
-- Traçabilité absolue : Qui, Quoi, Quand, Entité, ID, Avant, Après, Commentaire
CREATE TABLE IF NOT EXISTS journal_mouvements (
    id BIGSERIAL PRIMARY KEY,
    utilisateur_id UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
    nom_utilisateur VARCHAR(200) NOT NULL,
    role_utilisateur user_role_enum,
    entite VARCHAR(100) NOT NULL, -- 'demandes_recrutement', 'candidatures', 'contrats', etc.
    entite_id VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,  -- 'CREATION', 'MODIFICATION', 'TRANSITION_STATUT', 'SIGNATURE', 'VALIDATION'
    valeur_avant JSONB,
    valeur_apres JSONB,
    motif_ou_commentaire TEXT,
    adresse_ip VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_journal_entite ON journal_mouvements(entite, entite_id);
CREATE INDEX IF NOT EXISTS idx_journal_date ON journal_mouvements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_journal_utilisateur ON journal_mouvements(utilisateur_id);

-- Notifications internes (ET5)
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destinataire_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'INFO', -- 'INFO', 'ACTION_REQUISE', 'VALIDATION', 'ALERTE'
    lien_cible VARCHAR(255),
    lu BOOLEAN NOT NULL DEFAULT FALSE,
    date_lecture TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_destinataire ON notifications(destinataire_id, lu);

-- Documents stockés ou référencés (ET6)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom_fichier VARCHAR(255) NOT NULL,
    type_mime VARCHAR(100) NOT NULL,
    taille_octets BIGINT NOT NULL,
    url_stockage TEXT NOT NULL,
    version INT NOT NULL DEFAULT 1,
    entite_liee VARCHAR(50) NOT NULL, -- 'CANDIDAT', 'EMPLOYE', 'CONTRAT', 'CANDIDATURE'
    entite_id UUID NOT NULL,
    televerse_par UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_documents_entite ON documents(entite_liee, entite_id);
