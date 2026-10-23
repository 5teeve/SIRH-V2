-- =============================================================================
-- SCRIPT 07 : FONCTIONS PL/PGSQL ET DÉCLENCHEURS (TRIGGERS)
-- Règles Métier Automatisées, Intégrité et Audit Immuable
-- =============================================================================

-- Séquence dédiée pour le matricule séquentiel unique (RG15)
CREATE SEQUENCE IF NOT EXISTS matricule_seq START WITH 1 INCREMENT BY 1;

-- -----------------------------------------------------------------------------
-- 1. Génération automatique du matricule unique lors de la signature du 1er contrat (RG15)
-- Format : EMP-YYYY-XXXX (Ex: EMP-2026-0001)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_generer_matricule_premier_contrat()
RETURNS TRIGGER AS $$
DECLARE
    v_annee VARCHAR(4);
    v_seq_num BIGINT;
    v_nouveau_matricule VARCHAR(50);
    v_matricule_actuel VARCHAR(50);
BEGIN
    -- Se déclenche quand le contrat passe à 'SIGNE'
    IF NEW.statut = 'SIGNE' AND (OLD.statut IS NULL OR OLD.statut <> 'SIGNE') THEN
        -- Vérifier si l'employé possède déjà un matricule
        SELECT matricule INTO v_matricule_actuel
        FROM employes
        WHERE id = NEW.employe_id;
        
        IF v_matricule_actuel IS NULL THEN
            v_annee := TO_CHAR(COALESCE(NEW.date_signature, CURRENT_DATE), 'YYYY');
            v_seq_num := nextval('matricule_seq');
            v_nouveau_matricule := 'EMP-' || v_annee || '-' || LPAD(v_seq_num::TEXT, 4, '0');
            
            -- Mise à jour du matricule sur le dossier employé
            UPDATE employes
            SET matricule = v_nouveau_matricule,
                updated_at = NOW()
            WHERE id = NEW.employe_id;
            
            -- Journalisation de l'attribution du matricule
            INSERT INTO journal_mouvements (
                utilisateur_id,
                nom_utilisateur,
                role_utilisateur,
                entite,
                entite_id,
                action,
                valeur_avant,
                valeur_apres,
                motif_ou_commentaire
            ) VALUES (
                NEW.valide_par,
                'Système SIRH Automate',
                'ADMIN',
                'employes',
                NEW.employe_id::TEXT,
                'ATTRIBUTION_MATRICULE',
                jsonb_build_object('matricule', null),
                jsonb_build_object('matricule', v_nouveau_matricule),
                'Génération automatique du premier matricule suite à signature de contrat'
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_contrat_signature_matricule ON contrats;
CREATE TRIGGER trg_contrat_signature_matricule
AFTER INSERT OR UPDATE OF statut ON contrats
FOR EACH ROW
EXECUTE FUNCTION fn_generer_matricule_premier_contrat();

-- -----------------------------------------------------------------------------
-- 2. Détection de collision de créneau pour les entretiens (RG09)
-- Aucun intervieweur ni salle ne peut être sur 2 entretiens simultanés
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_verifier_collision_entretien()
RETURNS TRIGGER AS $$
DECLARE
    v_conflit_id UUID;
    v_conflit_participant VARCHAR(200);
BEGIN
    -- 1. Vérification de conflit de salle (si ce n'est pas un lien virtuel)
    IF NEW.salle_ou_lien NOT ILIKE 'http%' AND NEW.salle_ou_lien NOT ILIKE 'zoom%' AND NEW.salle_ou_lien NOT ILIKE 'teams%' THEN
        SELECT id INTO v_conflit_id
        FROM entretiens
        WHERE id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)
          AND salle_ou_lien = NEW.salle_ou_lien
          AND statut = 'PLANIFIE'
          AND is_deleted = FALSE
          AND (date_heure_debut, date_heure_fin) OVERLAPS (NEW.date_heure_debut, NEW.date_heure_fin)
        LIMIT 1;

        IF v_conflit_id IS NOT NULL THEN
            RAISE EXCEPTION 'RG09 Conflit : La salle "%" est déjà réservée sur ce créneau (entretien %)', NEW.salle_ou_lien, v_conflit_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_verifier_collision_entretien ON entretiens;
CREATE TRIGGER trg_verifier_collision_entretien
BEFORE INSERT OR UPDATE OF date_heure_debut, date_heure_fin, salle_ou_lien ON entretiens
FOR EACH ROW
EXECUTE FUNCTION fn_verifier_collision_entretien();

-- -----------------------------------------------------------------------------
-- 3. Recalcul automatique de l'avancement Onboarding (EF4.8, RG19)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_recalculer_avancement_onboarding()
RETURNS TRIGGER AS $$
DECLARE
    v_onboarding_id UUID;
    v_total INT;
    v_faits INT;
    v_obligatoires_restants INT;
    v_taux NUMERIC(5, 2);
BEGIN
    v_onboarding_id := COALESCE(NEW.onboarding_id, OLD.onboarding_id);

    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE statut = 'FAIT'),
        COUNT(*) FILTER (WHERE obligatoire = TRUE AND statut <> 'FAIT')
    INTO v_total, v_faits, v_obligatoires_restants
    FROM taches_onboarding
    WHERE onboarding_id = v_onboarding_id;

    IF v_total > 0 THEN
        v_taux := ROUND((v_faits::NUMERIC / v_total::NUMERIC) * 100, 2);
    ELSE
        v_taux := 0.0;
    END IF;

    UPDATE onboardings
    SET taux_avancement = v_taux,
        statut = CASE 
            WHEN v_obligatoires_restants = 0 AND v_faits = v_total THEN 'COMPLETE'::onboarding_statut_enum
            ELSE 'EN_COURS'::onboarding_statut_enum
        END,
        updated_at = NOW()
    WHERE id = v_onboarding_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_recalcul_onboarding ON taches_onboarding;
CREATE TRIGGER trg_recalcul_onboarding
AFTER INSERT OR UPDATE OF statut, obligatoire OR DELETE ON taches_onboarding
FOR EACH ROW
EXECUTE FUNCTION fn_recalculer_avancement_onboarding();

-- -----------------------------------------------------------------------------
-- 4. Mise à jour de l'effectif pourvu sur le poste suite à une affectation active (EF1.1)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_maj_effectif_poste()
RETURNS TRIGGER AS $$
DECLARE
    v_poste_id UUID;
    v_nb_actifs INT;
BEGIN
    v_poste_id := COALESCE(NEW.poste_id, OLD.poste_id);

    SELECT COUNT(DISTINCT employe_id) INTO v_nb_actifs
    FROM affectations
    WHERE poste_id = v_poste_id 
      AND est_actuelle = TRUE 
      AND is_deleted = FALSE;

    UPDATE postes
    SET effectif_pourvu = v_nb_actifs,
        updated_at = NOW()
    WHERE id = v_poste_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_maj_effectif_poste ON affectations;
CREATE TRIGGER trg_maj_effectif_poste
AFTER INSERT OR UPDATE OF est_actuelle, is_deleted OR DELETE ON affectations
FOR EACH ROW
EXECUTE FUNCTION fn_maj_effectif_poste();
