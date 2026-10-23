-- =============================================================================
-- SCRIPT 08 : JEU DE DONNÉES INITIAL (SEED DATA)
-- Écosystème de démonstration complet pour le SIRH
-- =============================================================================

-- 1. Paramètres système (ET7)
INSERT INTO parametres (cle, valeur, type_donnee, description) VALUES
('FORMAT_MATRICULE', 'EMP-{YYYY}-{SEQ4}', 'STRING', 'Gabarit de génération des matricules collaborateurs'),
('DELAI_MAX_VALIDATION_JOURS', '5', 'INTEGER', 'Délai cible en jours ouvrés pour chaque étape de validation'),
('LIMITE_RENOUVELLEMENT_CDD', '2', 'INTEGER', 'Nombre maximal de renouvellements de CDD selon le code du travail'),
('DUREE_MAX_ESSAI_CDI_JOURS', '90', 'INTEGER', 'Durée maximale légale de période d''essai pour un contrat CDI'),
('DUREE_MAX_ESSAI_CDD_JOURS', '30', 'INTEGER', 'Durée maximale légale de période d''essai pour un CDD'),
('CLOTURE_AUTO_OFFRES', 'TRUE', 'BOOLEAN', 'Clôture automatique des offres dès que tous les postes sont pourvus')
ON CONFLICT (cle) DO UPDATE SET valeur = EXCLUDED.valeur;

-- 2. Référentiels (ET7)
INSERT INTO referentiels (categorie, code, libelle, description, ordre) VALUES
('MOTIF_REFUS', 'BESOIN_NON_JUSTIFIE', 'Besoin non justifié par rapport à la charge', 'Refus RH : justification opérationnelle insuffisante', 1),
('MOTIF_REFUS', 'EFFECTIF_MAX_ATTEINT', 'Effectif autorisé du poste déjà atteint', 'Refus RH : grille d''organisation saturée', 2),
('MOTIF_REFUS', 'BUDGET_INSUFFISANT', 'Dépassement de l''enveloppe budgétaire allouée', 'Refus Finance : budget annuel insuffisant', 3),
('MOTIF_REFUS', 'NON_CONFORME_PRIORITES', 'Non-conformité aux priorités stratégiques', 'Refus Direction : arbitrage en faveur d''autres projets', 4),
('MOTIF_REFUS', 'DOUBLON_DEMANDE', 'Demande similaire déjà en cours de traitement', 'Refus RH : demande redondante', 5),

('MOTIF_RENVOI', 'AJUSTEMENT_BUDGET', 'Ajuster l''estimation budgétaire et la rémunération', 'Renvoi Finance vers Manager', 1),
('MOTIF_RENVOI', 'PRECISER_PROFIL', 'Préciser les compétences et missions requises', 'Renvoi RH vers Manager', 2),
('MOTIF_RENVOI', 'DATE_IRREALISTE', 'Date de prise de poste souhaitée trop proche', 'Renvoi RH vers Manager', 3),

('LIEU_TRAVAIL', 'HQ_ANKORONDRANO', 'Siège Social — Ankorondrano, Antananarivo', 'Campus principal de l''entreprise', 1),
('LIEU_TRAVAIL', 'HUB_TAMATAVE', 'Agence Régionale — Port de Tamatave', 'Bureau opérationnel Est', 2),
('LIEU_TRAVAIL', 'TELETRAVAIL_HYBRIDE', 'Mode Hybride (3j Bureau / 2j Distanciel)', 'Accord télétravail', 3)
ON CONFLICT (categorie, code) DO NOTHING;

-- 3. Utilisateurs et Rôles (Acteurs du SIRH)
-- Passwords hashés (ex: 'admin123', 'manager123', etc.)
INSERT INTO utilisateurs (id, matricule, nom, prenom, email, mot_de_passe_hash, role, actif) VALUES
('11111111-1111-1111-1111-111111111111', 'EMP-2024-0001', 'Système', 'Administrateur', 'admin@sirh-entreprise.mg', crypt('admin123', gen_salt('bf')), 'ADMIN', TRUE),
('22222222-2222-2222-2222-222222222222', 'EMP-2024-0010', 'Randria', 'Steeve', 'manager.tech@sirh-entreprise.mg', crypt('manager123', gen_salt('bf')), 'MANAGER', TRUE),
('33333333-3333-3333-3333-333333333333', 'EMP-2024-0012', 'Rasoa', 'Tanteraka', 'rh.recrutement@sirh-entreprise.mg', crypt('rh123', gen_salt('bf')), 'RH', TRUE),
('44444444-4444-4444-4444-444444444444', 'EMP-2024-0005', 'Andria', 'Tsimbina', 'finance.controle@sirh-entreprise.mg', crypt('finance123', gen_salt('bf')), 'FINANCE', TRUE),
('55555555-5555-5555-5555-555555555555', 'EMP-2024-0002', 'Rajaonah', 'Hery', 'direction.dg@sirh-entreprise.mg', crypt('dg123', gen_salt('bf')), 'DIRECTION', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 4. Départements & Services (EF1.1)
INSERT INTO departements (id, code, nom, description, responsable_id) VALUES
('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'DEP-TECH', 'Direction des Systèmes d''Information & Tech', 'Développement applicatif, infrastructures et cybersécurité', '22222222-2222-2222-2222-222222222222'),
('bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'DEP-RH', 'Ressources Humaines & Développement des Talents', 'Gestion prévisionnelle des emplois, carrières et paie', '33333333-3333-3333-3333-333333333333'),
('cccc3333-cccc-cccc-cccc-cccccccccccc', 'DEP-FIN', 'Direction Financière & Comptabilité', 'Gestion de trésorerie, audit et contrôle de gestion', '44444444-4444-4444-4444-444444444444')
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, departement_id, code, nom, description, responsable_id) VALUES
('d0010000-0000-0000-0000-000000000001', 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'SRV-DEV', 'Développement Web, Mobile & Cloud', 'Ingénierie logicielle et plateformes digitales', '22222222-2222-2222-2222-222222222222'),
('d0010000-0000-0000-0000-000000000002', 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'SRV-DEVOPS', 'Infrastructures & Cloud Ops', 'Hébergement, CI/CD et sécurité des réseaux', '22222222-2222-2222-2222-222222222222'),
('d0010000-0000-0000-0000-000000000003', 'bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'SRV-REC', 'Attraction des Talents & Recrutement', 'Sourcing et sélection des candidats', '33333333-3333-3333-3333-333333333333')
ON CONFLICT (id) DO NOTHING;

-- 5. Postes (EF1.1, RG01)
INSERT INTO postes (id, code, intitule, departement_id, service_id, description, competences_requises, fourchette_salaire_min, fourchette_salaire_max, effectif_autorise, effectif_pourvu) VALUES
('e0010000-0000-0000-0000-000000000001', 'PST-DEV-FS', 'Ingénieur Full-Stack Senior (TypeScript / PostgreSQL)', 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd0010000-0000-0000-0000-000000000001', 'Conception et développement de solutions web robustes et scalables.', ARRAY['React', 'Node.js', 'PostgreSQL', 'Docker', 'Architecture REST'], 3500000.00, 5500000.00, 4, 2),
('e0010000-0000-0000-0000-000000000002', 'PST-DEVOPS', 'Ingénieur DevOps & SRE', 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd0010000-0000-0000-0000-000000000002', 'Administration des pipelines CI/CD, cluster Kubernetes et monitoring.', ARRAY['Kubernetes', 'Terraform', 'Linux', 'AWS/GCP', 'PostgreSQL Admin'], 4000000.00, 6000000.00, 2, 1),
('e0010000-0000-0000-0000-000000000003', 'PST-RH-REC', 'Chargé(e) de Recrutement & Marque Employeur', 'bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'd0010000-0000-0000-0000-000000000003', 'Pilotage complet du cycle de recrutement et onboarding des nouveaux talents.', ARRAY['Sourcing', 'Entretiens', 'Droit du travail malgache', 'SIRH'], 2000000.00, 3200000.00, 3, 2)
ON CONFLICT (id) DO NOTHING;

-- 6. Demandes de recrutement (EF1.2 à EF1.9)
INSERT INTO demandes_recrutement (
    id, numero, type, demandeur_id, poste_id, departement_id, service_id,
    nombre_postes, motif, justification, type_contrat_souhaite, date_souhaitee,
    urgence, budget_estime, statut, etape_validation_actuelle
) VALUES
('f0010000-0000-0000-0000-000000000001', 'DEM-2026-0001', 'CREATION', '22222222-2222-2222-2222-222222222222', 'e0010000-0000-0000-0000-000000000001', 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd0010000-0000-0000-0000-000000000001', 1, 'Renforcement de l''équipe plateforme SIRH pour nouveaux modules', 'Lancement de la phase d''intégration client Q1 2026 nécessitant une expertise avancée', 'CDI', '2026-11-15', 'URGENTE', 4800000.00, 'OUVERTE', 'CLOTURE'),
('f0010000-0000-0000-0000-000000000002', 'DEM-2026-0002', 'REMPLACEMENT', '22222222-2222-2222-2222-222222222222', 'e0010000-0000-0000-0000-000000000002', 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd0010000-0000-0000-0000-000000000002', 1, 'Remplacement de l''ingénieur DevOps titulaire démissionnaire', 'Assurer la continuité de service des serveurs de production 24/7', 'CDI', '2026-12-01', 'NORMALE', 5000000.00, 'VALIDEE_RH', 'FINANCE')
ON CONFLICT (id) DO NOTHING;

-- 7. Offres d'emploi (EF2.1)
INSERT INTO offres_emploi (
    id, reference, demande_id, poste_id, titre, departement_id,
    missions, profil_recherche, competences_requises, type_contrat,
    lieu, salaire_affiche, salaire_min, salaire_max, nombre_postes, postes_pourvus,
    date_publication, date_cloture, statut, cree_par
) VALUES
('f0ff0000-0000-0000-0000-000000000001', 'OFF-2026-0001', 'f0010000-0000-0000-0000-000000000001', 'e0010000-0000-0000-0000-000000000001', 'Ingénieur Full-Stack Senior TypeScript & PostgreSQL', 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
'Concevoir et développer les modules web transactionnels du SIRH. Participer aux revues de code et optimisations de requêtes SQL.',
'Bac+5 en informatique ou expérience équivalente (5 ans minimum). Maîtrise avancée des architectures modulaires.',
ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'], 'CDI',
'Siège Social — Ankorondrano, Antananarivo', TRUE, 4000000.00, 5000000.00, 1, 0,
'2026-10-01', '2026-11-30', 'PUBLIEE', '33333333-3333-3333-3333-333333333333')
ON CONFLICT (id) DO NOTHING;

-- 8. Candidats et Candidatures (EF2.3, EF2.4)
INSERT INTO candidats (
    id, cin, nom, prenom, date_naissance, email, telephone, adresse, cv_url, titre_actuel, annees_experience
) VALUES
('ca010000-0000-0000-0000-000000000001', '101234567890', 'Ranaivo', 'Mamy', '1995-04-12', 'mamy.ranaivo@gmail.com', '+261 34 11 222 33', 'Lot IVM 42 Ambohijatovo, Antananarivo', '/docs/cv_mamy_ranaivo.pdf', 'Développeur Full-Stack Web', 6),
('ca010000-0000-0000-0000-000000000002', '101987654321', 'Rakotoarisoa', 'Faly', '1997-09-24', 'faly.rakoto@gmail.com', '+261 32 44 555 66', 'Lot II B 18 Ankadifotsy, Antananarivo', '/docs/cv_faly_rakoto.pdf', 'Ingénieur Logiciel Junior', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO candidatures (
    id, numero, offre_id, candidat_id, statut, score_preselection, rang_final, commentaires_rh
) VALUES
('a0010000-0000-0000-0000-000000000001', 'CAN-2026-0001', 'f0ff0000-0000-0000-0000-000000000001', 'ca010000-0000-0000-0000-000000000001', 'PROPOSITION_ENVOYEE', 92.50, 1, 'Excellente maîtrise technique démontrée lors du test pratique'),
('a0010000-0000-0000-0000-000000000002', 'CAN-2026-0002', 'f0ff0000-0000-0000-0000-000000000001', 'ca010000-0000-0000-0000-000000000002', 'PRESELECTIONNEE', 78.00, 2, 'Bon profil, retenu en second choix pour la phase d''entretiens')
ON CONFLICT (id) DO NOTHING;

-- 9. Proposition d'embauche active pour démonstration (EF3.1)
INSERT INTO propositions_embauche (
    id, numero, candidature_id, poste_id, version, remuneration_mensuelle,
    type_contrat, date_debut_prevue, periode_essai_jours, horaires_travail,
    lieu_travail, avantages, date_limite_reponse, statut, emise_par
) VALUES
('b0010000-0000-0000-0000-000000000001', 'PROP-2026-0001', 'a0010000-0000-0000-0000-000000000001', 'e0010000-0000-0000-0000-000000000001', 1, 4800000.00,
'CDI', '2026-11-15', 90, '40h/semaine (Lundi au Vendredi de 8h à 17h)',
'Siège Social — Ankorondrano, Antananarivo',
ARRAY['Assurance Santé Groupe 100%', 'Indemnité de transport & repas', 'Prime annuelle sur objectifs', 'Dotation ordinateur portable haut de gamme'],
'2026-10-31', 'PROPOSEE', '33333333-3333-3333-3333-333333333333')
ON CONFLICT (id) DO NOTHING;

-- 10. Modèle d'onboarding par défaut (EF4.6)
INSERT INTO modeles_onboarding (id, code, titre, description, actif) VALUES
('mod-onb-0001-0000-000000000001', 'ONB-STANDARD', 'Parcours d''Intégration Standard Nouveau Collaborateur', 'Checklist d''accueil pluridisciplinaire (RH, IT, Logistique, Paie)', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO elements_modele_onboarding (modele_id, titre, description, responsable, delai_jours_apres_debut, obligatoire, ordre) VALUES
('mod-onb-0001-0000-000000000001', 'Signature du contrat et remise du livret d''accueil', 'Vérification des signatures et remise du règlement intérieur', 'RH', 1, TRUE, 1),
('mod-onb-0001-0000-000000000001', 'Création des comptes email et accès Slack / GitHub', 'Configuration Google Workspace et droits de sécurité', 'IT', 1, TRUE, 2),
('mod-onb-0001-0000-000000000001', 'Attribution de l''ordinateur portable et badge d''accès', 'Remise matérielle signée contre décharge', 'LOGISTIQUE', 1, TRUE, 3),
('mod-onb-0001-0000-000000000001', 'Affiliation CNaPS et mutuelle santé OSTIE', 'Dépôt des formulaires de sécurité sociale et RIB', 'PAIE', 3, TRUE, 4),
('mod-onb-0001-0000-000000000001', 'Point d''étape à 1 mois avec le manager', 'Bilan d''intégration et ajustement des objectifs', 'MANAGER', 30, FALSE, 5);
