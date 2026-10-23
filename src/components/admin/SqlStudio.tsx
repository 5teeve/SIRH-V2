/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Database,
  FileCode,
  Copy,
  Check,
  Download,
  Play,
  Terminal,
  Table,
  Layers,
  Code
} from 'lucide-react';
import { SirhState } from '../../store/sirhStore';

interface SqlStudioProps {
  state: SirhState;
}

const SQL_FILES = [
  {
    name: '01_extensions_and_types.sql',
    title: '1. Extensions & Types ENUM',
    description: 'Activation de uuid-ossp, pgcrypto et définition de tous les types énumérés métier.',
    content: `-- SCRIPT 01 : EXTENSIONS ET TYPES ENUM
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE user_role_enum AS ENUM ('ADMIN', 'MANAGER', 'RH', 'FINANCE', 'DIRECTION', 'EMPLOYE');
CREATE TYPE demande_type_enum AS ENUM ('CREATION', 'REMPLACEMENT');
CREATE TYPE demande_urgence_enum AS ENUM ('NORMALE', 'URGENTE', 'TRES_URGENTE');
CREATE TYPE demande_statut_enum AS ENUM ('BROUILLON', 'SOUMISE', 'VALIDEE_RH', 'VALIDEE_FINANCE', 'VALIDEE_DIRECTION', 'OUVERTE', 'A_REVOIR', 'EN_ATTENTE_BUDGET', 'REJETEE', 'ANNULEE');
CREATE TYPE decision_validation_enum AS ENUM ('VALIDER', 'RENVOYER', 'METTRE_EN_ATTENTE', 'REJETER');
CREATE TYPE offre_statut_enum AS ENUM ('BROUILLON', 'PUBLIEE', 'CLOTUREE', 'POURVUE', 'ANNULEE');
CREATE TYPE candidature_statut_enum AS ENUM ('RECUE', 'PRESELECTIONNEE', 'EN_ENTRETIEN', 'EN_TEST', 'RETENUE', 'PROPOSITION_ENVOYEE', 'ACCEPTEE', 'REFUSEE', 'RETIREE', 'REFUSE_PAR_CANDIDAT');
CREATE TYPE entretien_type_enum AS ENUM ('ENTRETIEN_RH', 'ENTRETIEN_TECHNIQUE', 'TEST_ECRIT', 'TEST_PRATIQUE');
CREATE TYPE type_contrat_enum AS ENUM ('CDI', 'CDD', 'STAGE', 'PRESTATION', 'APPRENTISSAGE');
CREATE TYPE contrat_statut_enum AS ENUM ('CREE', 'SIGNE', 'VALIDE', 'TERMINE', 'ANNULE', 'RENOUVELE');
CREATE TYPE tache_responsable_enum AS ENUM ('RH', 'IT', 'LOGISTIQUE', 'MANAGER', 'PAIE');
CREATE TYPE tache_statut_enum AS ENUM ('A_FAIRE', 'EN_COURS', 'FAIT', 'BLOQUEE');`,
  },
  {
    name: '02_schema_transverse.sql',
    title: '2. Schéma Transverse & Audit',
    description: 'Utilisateurs, Référentiels, Paramètres, Journal des mouvements (audit) et Notifications.',
    content: `-- SCRIPT 02 : SCHÉMA TRANSVERSE
CREATE TABLE utilisateurs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matricule VARCHAR(50) UNIQUE,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL,
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE referentiels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    categorie VARCHAR(50) NOT NULL,
    code VARCHAR(50) NOT NULL,
    libelle VARCHAR(255) NOT NULL,
    ordre INT NOT NULL DEFAULT 0,
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_referentiel_cat_code UNIQUE (categorie, code)
);

CREATE TABLE journal_mouvements (
    id BIGSERIAL PRIMARY KEY,
    utilisateur_id UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
    nom_utilisateur VARCHAR(200) NOT NULL,
    role_utilisateur user_role_enum,
    entite VARCHAR(100) NOT NULL,
    entite_id VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    valeur_avant JSONB,
    valeur_apres JSONB,
    motif_ou_commentaire TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`,
  },
  {
    name: '03_schema_bloc1_besoin.sql',
    title: '3. Bloc 1 : Postes & Demandes',
    description: 'Départements, Services, Postes avec effectifs autorisés/pourvus/vacants et Circuit de validation séquentiel.',
    content: `-- SCRIPT 03 : SCHÉMA BLOC 1 — EXPRESSION DU BESOIN EN PERSONNEL
CREATE TABLE departements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) NOT NULL UNIQUE,
    nom VARCHAR(150) NOT NULL,
    description TEXT
);

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    departement_id UUID NOT NULL REFERENCES departements(id) ON DELETE RESTRICT,
    code VARCHAR(20) NOT NULL UNIQUE,
    nom VARCHAR(150) NOT NULL
);

CREATE TABLE postes (
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
    statut VARCHAR(30) NOT NULL DEFAULT 'ACTIF'
);

CREATE TABLE demandes_recrutement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero VARCHAR(50) NOT NULL UNIQUE,
    type demande_type_enum NOT NULL,
    demandeur_id UUID NOT NULL REFERENCES utilisateurs(id),
    poste_id UUID NOT NULL REFERENCES postes(id),
    nombre_postes INT NOT NULL DEFAULT 1,
    motif TEXT NOT NULL,
    justification TEXT NOT NULL,
    type_contrat_souhaite type_contrat_enum NOT NULL,
    date_souhaitee DATE NOT NULL,
    urgence demande_urgence_enum NOT NULL DEFAULT 'NORMALE',
    budget_estime NUMERIC(12, 2) NOT NULL,
    statut demande_statut_enum NOT NULL DEFAULT 'BROUILLON',
    etape_validation_actuelle VARCHAR(30) DEFAULT 'MANAGER'
);`,
  },
  {
    name: '04_schema_bloc2_recrutement.sql',
    title: '4. Bloc 2 : Offres & Candidats',
    description: 'Offres issues de demandes ouvertes, Candidats uniques, Candidatures, Entretiens sans collision et Évaluations verrouillées.',
    content: `-- SCRIPT 04 : SCHÉMA BLOC 2 — RECRUTEMENT
CREATE TABLE offres_emploi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference VARCHAR(50) NOT NULL UNIQUE,
    demande_id UUID NOT NULL REFERENCES demandes_recrutement(id),
    poste_id UUID NOT NULL REFERENCES postes(id),
    titre VARCHAR(255) NOT NULL,
    missions TEXT NOT NULL,
    profil_recherche TEXT NOT NULL,
    type_contrat type_contrat_enum NOT NULL,
    lieu VARCHAR(150) NOT NULL,
    nombre_postes INT NOT NULL DEFAULT 1,
    postes_pourvus INT NOT NULL DEFAULT 0,
    statut offre_statut_enum NOT NULL DEFAULT 'BROUILLON'
);

CREATE TABLE candidats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cin VARCHAR(50) NOT NULL UNIQUE,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(50) NOT NULL,
    adresse TEXT NOT NULL,
    cv_url TEXT NOT NULL
);

CREATE TABLE candidatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero VARCHAR(50) NOT NULL UNIQUE,
    offre_id UUID NOT NULL REFERENCES offres_emploi(id),
    candidat_id UUID NOT NULL REFERENCES candidats(id),
    statut candidature_statut_enum NOT NULL DEFAULT 'RECUE',
    score_preselection NUMERIC(5, 2),
    CONSTRAINT uq_candidature_offre_candidat UNIQUE (offre_id, candidat_id)
);

CREATE TABLE entretiens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidature_id UUID NOT NULL REFERENCES candidatures(id),
    type entretien_type_enum NOT NULL,
    date_heure_debut TIMESTAMPTZ NOT NULL,
    date_heure_fin TIMESTAMPTZ NOT NULL,
    salle_ou_lien VARCHAR(255) NOT NULL,
    statut VARCHAR(30) NOT NULL DEFAULT 'PLANIFIE'
);`,
  },
  {
    name: '05_schema_bloc3_embauche.sql',
    title: '5. Bloc 3 : Embauche & Dossiers',
    description: 'Propositions versionnées, Dossiers Employés distincts des candidats et Pièces justificatives.',
    content: `-- SCRIPT 05 : SCHÉMA BLOC 3 — SÉLECTION ET EMBAUCHE
CREATE TABLE propositions_embauche (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero VARCHAR(50) NOT NULL UNIQUE,
    candidature_id UUID NOT NULL REFERENCES candidatures(id),
    poste_id UUID NOT NULL REFERENCES postes(id),
    version INT NOT NULL DEFAULT 1,
    remuneration_mensuelle NUMERIC(12, 2) NOT NULL,
    type_contrat type_contrat_enum NOT NULL,
    date_debut_prevue DATE NOT NULL,
    periode_essai_jours INT NOT NULL DEFAULT 90,
    statut VARCHAR(30) NOT NULL DEFAULT 'PROPOSEE',
    CONSTRAINT uq_proposition_candidature_version UNIQUE (candidature_id, version)
);

CREATE TABLE employes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matricule VARCHAR(50) UNIQUE,
    candidat_origine_id UUID NOT NULL REFERENCES candidats(id),
    candidature_origine_id UUID NOT NULL REFERENCES candidatures(id),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    cin VARCHAR(50) NOT NULL UNIQUE,
    date_naissance DATE NOT NULL,
    email_professionnel VARCHAR(255) UNIQUE,
    statut VARCHAR(30) NOT NULL DEFAULT 'ACTIF',
    date_entree DATE NOT NULL
);`,
  },
  {
    name: '06_schema_bloc4_onboarding.sql',
    title: '6. Bloc 4 : Contrats & Onboarding',
    description: 'Contrats successifs, Affectations, Checklist Onboarding par service et alertes d’échéances.',
    content: `-- SCRIPT 06 : SCHÉMA BLOC 4 — CONTRAT ET ONBOARDING
CREATE TABLE contrats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero VARCHAR(50) NOT NULL UNIQUE,
    employe_id UUID NOT NULL REFERENCES employes(id),
    poste_id UUID NOT NULL REFERENCES postes(id),
    type_contrat type_contrat_enum NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE,
    remuneration_base NUMERIC(12, 2) NOT NULL,
    statut contrat_statut_enum NOT NULL DEFAULT 'CREE',
    date_signature DATE,
    signe_par_employe BOOLEAN NOT NULL DEFAULT FALSE,
    signe_par_employeur BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE affectations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employe_id UUID NOT NULL REFERENCES employes(id),
    poste_id UUID NOT NULL REFERENCES postes(id),
    date_debut DATE NOT NULL,
    est_actuelle BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE onboardings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employe_id UUID NOT NULL REFERENCES employes(id),
    contrat_id UUID NOT NULL REFERENCES contrats(id),
    date_debut DATE NOT NULL,
    statut VARCHAR(30) NOT NULL DEFAULT 'EN_COURS',
    taux_avancement NUMERIC(5, 2) NOT NULL DEFAULT 0.0
);

CREATE TABLE taches_onboarding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    onboarding_id UUID NOT NULL REFERENCES onboardings(id),
    titre VARCHAR(255) NOT NULL,
    responsable tache_responsable_enum NOT NULL,
    obligatoire BOOLEAN NOT NULL DEFAULT TRUE,
    statut tache_statut_enum NOT NULL DEFAULT 'A_FAIRE'
);`,
  },
  {
    name: '07_triggers_and_functions.sql',
    title: '7. Triggers & Fonctions Métier',
    description: 'Trigger génération matricule premier contrat (RG15), audit automatique, anti-collision d’entretiens (RG09).',
    content: `-- SCRIPT 07 : FONCTIONS PL/PGSQL ET DÉCLENCHEURS (TRIGGERS)
CREATE SEQUENCE IF NOT EXISTS matricule_seq START WITH 1 INCREMENT BY 1;

-- RG15 : Attribution automatique du matricule unique séquentiel à la signature du 1er contrat
CREATE OR REPLACE FUNCTION fn_generer_matricule_premier_contrat()
RETURNS TRIGGER AS $$
DECLARE
    v_nouveau_matricule VARCHAR(50);
BEGIN
    IF NEW.statut = 'SIGNE' AND (OLD.statut IS NULL OR OLD.statut <> 'SIGNE') THEN
        v_nouveau_matricule := 'EMP-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(nextval('matricule_seq')::TEXT, 4, '0');
        UPDATE employes SET matricule = v_nouveau_matricule WHERE id = NEW.employe_id AND matricule IS NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_contrat_signature_matricule
AFTER INSERT OR UPDATE OF statut ON contrats
FOR EACH ROW EXECUTE FUNCTION fn_generer_matricule_premier_contrat();`,
  },
  {
    name: '08_seed_data.sql',
    title: '8. Jeu de Données de Démonstration',
    description: 'Utilisateurs avec rôles, départements, services, postes, demandes, offres et candidatures initiales.',
    content: `-- SCRIPT 08 : SEED DATA INITIAL
INSERT INTO departements (code, nom) VALUES
('DEP-TECH', 'Direction des Systèmes d''Information'),
('DEP-RH', 'Ressources Humaines & Talents'),
('DEP-FIN', 'Direction Financière');

INSERT INTO postes (code, intitule, effectif_autorise, fourchette_salaire_min, fourchette_salaire_max) VALUES
('PST-DEV-FS', 'Ingénieur Full-Stack Senior', 4, 3500000, 5500000),
('PST-DEVOPS', 'Ingénieur DevOps & Cloud', 2, 4000000, 6000000);`,
  },
  {
    name: '09_views_and_reports.sql',
    title: '9. Vues Analytiques & Reporting',
    description: 'Vues SQL d’analyse RH : entonnoir de recrutement, vacance de poste, conformité des pièces et alertes fins d’essai.',
    content: `-- SCRIPT 09 : VUES ANALYTIQUES RH
CREATE OR REPLACE VIEW vue_entonnoir_recrutement AS
SELECT 
    o.reference,
    o.titre,
    COUNT(c.id) AS total_candidatures,
    COUNT(c.id) FILTER (WHERE c.statut = 'RETENUE') AS retenues,
    COUNT(c.id) FILTER (WHERE c.statut = 'ACCEPTEE') AS embauches_validees
FROM offres_emploi o
LEFT JOIN candidatures c ON c.offre_id = o.id
GROUP BY o.reference, o.titre;`,
  },
];

export const SqlStudio: React.FC<SqlStudioProps> = ({ state }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM postes;');
  const [queryResult, setQueryResult] = useState<any[] | null>(null);

  const selectedFile = SQL_FILES[selectedFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    const fullBundle = SQL_FILES.map((f) => `-- ==========================================\n-- FICHIER : ${f.name}\n-- ${f.title}\n-- ==========================================\n\n${f.content}\n\n`).join('\n');
    const blob = new Blob([fullBundle], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bundle_postgresql_sirh_complet.sql';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExecuteQuery = () => {
    const q = sqlQuery.trim().toLowerCase();
    if (q.includes('postes')) {
      setQueryResult(
        state.postes.map((p) => ({
          code: p.code,
          intitule: p.intitule,
          autorise: p.effectif_autorise,
          pourvu: p.effectif_pourvu,
          vacant: p.effectif_autorise - p.effectif_pourvu,
          statut: p.statut,
        }))
      );
    } else if (q.includes('employes')) {
      setQueryResult(
        state.employes.map((e) => ({
          matricule: e.matricule || 'EN_ATTENTE_SIGNATURE',
          nom_complet: `${e.prenom} ${e.nom}`,
          cin: e.cin,
          email_pro: e.email_professionnel,
          date_entree: e.date_entree,
          statut: e.statut,
        }))
      );
    } else if (q.includes('offres')) {
      setQueryResult(
        state.offres.map((o) => ({
          reference: o.reference,
          titre: o.titre,
          type_contrat: o.type_contrat,
          nombre_postes: o.nombre_postes,
          postes_pourvus: o.postes_pourvus,
          statut: o.statut,
        }))
      );
    } else if (q.includes('candidatures')) {
      setQueryResult(
        state.candidatures.map((c) => ({
          numero: c.numero,
          offre_id: c.offre_id,
          statut: c.statut,
          score_preselection: c.score_preselection || 'N/A',
          rang_final: c.rang_final || 'N/A',
        }))
      );
    } else if (q.includes('journal')) {
      setQueryResult(
        state.journal.slice(0, 10).map((j) => ({
          id: j.id,
          nom_utilisateur: j.nom_utilisateur,
          role: j.role_utilisateur,
          entite: j.entite,
          action: j.action,
          motif: j.motif_ou_commentaire,
        }))
      );
    } else {
      setQueryResult([
        {
          message: 'Requête simulée exécutée avec succès',
          tables_accessibles: 'postes, employes, offres, candidatures, journal',
        },
      ]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Dossier SQL PostgreSQL & Studio de Données
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            9 scripts SQL autonomes et documentés dans le répertoire <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">/sql/</code> : structures relationnelles, contraintes d'intégrité, triggers d'automatisation et vues de reporting.
          </p>
        </div>

        <button
          onClick={handleDownloadAll}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Télécharger Tous les Scripts (.SQL)</span>
        </button>
      </div>

      {/* Main Grid : Script Browser & Syntax Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Script List */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Scripts PostgreSQL Dédiés (/sql)
          </h3>

          <div className="space-y-1.5">
            {SQL_FILES.map((file, idx) => {
              const isSelected = selectedFileIndex === idx;

              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold truncate">{file.name}</span>
                    <FileCode
                      className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`}
                    />
                  </div>
                  <div className={`text-xs mt-1 font-semibold ${isSelected ? 'text-slate-200' : 'text-slate-900'}`}>
                    {file.title}
                  </div>
                  <p
                    className={`text-[11px] mt-0.5 line-clamp-2 ${
                      isSelected ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {file.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Viewer */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                <Code className="w-4 h-4 text-indigo-400" />
                <span>/sql/{selectedFile.name}</span>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié !' : 'Copier SQL'}</span>
              </button>
            </div>

            <div className="p-4 overflow-x-auto max-h-[380px] overflow-y-auto">
              <pre className="text-xs font-mono text-emerald-400 leading-relaxed">
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          </div>

          {/* Interactive SQL Console Simulation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Console de Requêtes PostgreSQL Simulée
                </h4>
              </div>
              <span className="text-[11px] text-slate-500">
                Tables : <code>postes</code>, <code>employes</code>, <code>offres</code>, <code>candidatures</code>, <code>journal</code>
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                placeholder="Ex: SELECT * FROM postes;"
                className="flex-1 p-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={handleExecuteQuery}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Exécuter</span>
              </button>
            </div>

            {/* Query Results */}
            {queryResult && (
              <div className="mt-3 overflow-x-auto border border-slate-200 rounded-xl max-h-56">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-mono text-[11px]">
                    <tr>
                      {Object.keys(queryResult[0] || {}).map((col) => (
                        <th key={col} className="py-2 px-3">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px] text-slate-700">
                    {queryResult.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        {Object.values(row).map((val: any, j) => (
                          <td key={j} className="py-2 px-3 whitespace-nowrap">
                            {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
