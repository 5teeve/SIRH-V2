-- =============================================================================
-- SCRIPT 09 : VUES ANALYTIQUES ET RAPPORTS DE CONTRÔLE RH
-- Métriques Décisionnelles, Entonnoirs et Alertes de Conformité
-- =============================================================================

-- 1. Vue Entonnoir de Recrutement par Offre (EF2.8)
CREATE OR REPLACE VIEW vue_entonnoir_recrutement AS
SELECT 
    o.id AS offre_id,
    o.reference,
    o.titre,
    o.statut AS statut_offre,
    COUNT(c.id) AS total_candidatures_recues,
    COUNT(c.id) FILTER (WHERE c.statut NOT IN ('RECUE', 'RETIREE', 'REFUSEE')) AS preselectionnees,
    COUNT(c.id) FILTER (WHERE c.statut IN ('EN_ENTRETIEN', 'EN_TEST', 'RETENUE', 'PROPOSITION_ENVOYEE', 'ACCEPTEE')) AS en_evaluation_ou_entretien,
    COUNT(c.id) FILTER (WHERE c.statut IN ('RETENUE', 'PROPOSITION_ENVOYEE', 'ACCEPTEE')) AS retenues,
    COUNT(c.id) FILTER (WHERE c.statut = 'ACCEPTEE') AS embauches_finalisees,
    o.nombre_postes,
    o.postes_pourvus
FROM offres_emploi o
LEFT JOIN candidatures c ON c.offre_id = o.id AND c.is_deleted = FALSE
WHERE o.is_deleted = FALSE
GROUP BY o.id, o.reference, o.titre, o.statut, o.nombre_postes, o.postes_pourvus;

-- 2. Vue Postes, Effectifs et Taux de Vacance (EF1.1, RG01)
CREATE OR REPLACE VIEW vue_postes_et_vacance AS
SELECT 
    d.nom AS departement,
    s.nom AS service,
    p.code AS code_poste,
    p.intitule,
    p.effectif_autorise,
    p.effectif_pourvu,
    (p.effectif_autorise - p.effectif_pourvu) AS effectif_vacant,
    CASE 
        WHEN p.effectif_autorise > 0 
        THEN ROUND(((p.effectif_autorise - p.effectif_pourvu)::NUMERIC / p.effectif_autorise::NUMERIC) * 100, 1)
        ELSE 0.0 
    END AS taux_vacance_pct,
    p.statut AS statut_poste
FROM postes p
JOIN departements d ON d.id = p.departement_id
JOIN services s ON s.id = p.service_id
WHERE p.is_deleted = FALSE;

-- 3. Vue Conformité et Complétude des Dossiers Salariés (EF3.6)
CREATE OR REPLACE VIEW vue_suivi_dossiers_employes AS
SELECT 
    e.id AS employe_id,
    e.matricule,
    CONCAT(e.nom, ' ', e.prenom) AS employe_nom_complet,
    COUNT(pd.id) FILTER (WHERE pd.obligatoire = TRUE) AS total_pieces_obligatoires,
    COUNT(pd.id) FILTER (WHERE pd.obligatoire = TRUE AND pd.statut = 'VALIDE') AS pieces_validees,
    COUNT(pd.id) FILTER (WHERE pd.obligatoire = TRUE AND pd.statut = 'EN_ATTENTE') AS pieces_en_attente,
    CASE 
        WHEN COUNT(pd.id) FILTER (WHERE pd.obligatoire = TRUE) = 0 THEN 100.0
        ELSE ROUND((COUNT(pd.id) FILTER (WHERE pd.obligatoire = TRUE AND pd.statut = 'VALIDE')::NUMERIC / 
             COUNT(pd.id) FILTER (WHERE pd.obligatoire = TRUE)::NUMERIC) * 100, 1)
    END AS taux_completude_pct
FROM employes e
LEFT JOIN pieces_dossier pd ON pd.employe_id = e.id
WHERE e.is_deleted = FALSE
GROUP BY e.id, e.matricule, e.nom, e.prenom;

-- 4. Vue Suivi des Échéances Critiques (Fins d'essai & Fins de CDD - EF4.9)
CREATE OR REPLACE VIEW vue_alertes_contrats AS
SELECT 
    e.matricule,
    CONCAT(e.nom, ' ', e.prenom) AS nom_salarie,
    c.numero AS numero_contrat,
    c.type_contrat,
    c.date_debut,
    c.periode_essai_fin,
    c.date_fin AS date_fin_cdd,
    CASE 
        WHEN c.periode_essai_fin IS NOT NULL AND c.periode_essai_fin >= CURRENT_DATE 
        THEN (c.periode_essai_fin - CURRENT_DATE)
        ELSE NULL
    END AS jours_avant_fin_essai,
    CASE 
        WHEN c.date_fin IS NOT NULL AND c.date_fin >= CURRENT_DATE 
        THEN (c.date_fin - CURRENT_DATE)
        ELSE NULL
    END AS jours_avant_fin_cdd,
    c.statut AS statut_contrat
FROM contrats c
JOIN employes e ON e.id = c.employe_id
WHERE c.statut IN ('VALIDE', 'SIGNE')
ORDER BY COALESCE(c.periode_essai_fin, c.date_fin) ASC;
