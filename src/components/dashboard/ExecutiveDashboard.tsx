/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Users,
  Briefcase,
  FileCheck,
  Rocket,
  ArrowRight,
  TrendingUp,
  Building2,
  Clock,
  ShieldAlert,
  Compass,
  FileText
} from 'lucide-react';
import { SirhState } from '../../store/sirhStore';
import { useTheme } from '../../theme/themeContext';

interface ExecutiveDashboardProps {
  state: SirhState;
  onNavigateTab: (tab: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  state,
  onNavigateTab,
}) => {
  const { currentTheme } = useTheme();

  // Calculations
  const totalPostesAutorises = state.postes.reduce((acc, p) => acc + p.effectif_autorise, 0);
  const totalPostesPourvus = state.postes.reduce((acc, p) => acc + p.effectif_pourvu, 0);
  const totalPostesVacants = totalPostesAutorises - totalPostesPourvus;

  const demandesOuvertes = state.demandes.filter((d) => d.statut === 'OUVERTE').length;
  const demandesEnValidation = state.demandes.filter((d) =>
    ['SOUMISE', 'VALIDEE_RH', 'VALIDEE_FINANCE'].includes(d.statut)
  ).length;

  const offresPubliees = state.offres.filter((o) => o.statut === 'PUBLIEE').length;
  const totalCandidatures = state.candidatures.length;
  const candidaturesRetenues = state.candidatures.filter((c) =>
    ['RETENUE', 'PROPOSITION_ENVOYEE', 'ACCEPTEE'].includes(c.statut)
  ).length;

  const contratsActifs = state.contrats.filter((c) => ['VALIDE', 'SIGNE'].includes(c.statut)).length;
  const onboardingsEnCours = state.onboardings.filter((o) => o.statut === 'EN_COURS').length;

  return (
    <div className="space-y-6">
      {/* Welcome Kicker & Role Callout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded-md"
              style={{ backgroundColor: currentTheme.badgeBg, color: currentTheme.badgeText }}
            >
              Tableau de Bord Exécutif · Espace {state.currentRole}
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
            Gestion des Ressources Humaines & Pipeline de Talents
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Vue consolidée des 4 blocs : Besoins en personnel, Recrutement, Embauche et Parcours d'Onboarding.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('campus3d')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors border"
            style={{
              backgroundColor: currentTheme.badgeBg,
              borderColor: currentTheme.borderColor,
              color: currentTheme.badgeText,
            }}
          >
            <Compass className="w-4 h-4" />
            <span>Visite 3D Campus</span>
          </button>
          <button
            onClick={() => onNavigateTab('carrieres')}
            className="flex items-center gap-2 px-3.5 py-2 text-white text-xs font-semibold rounded-lg transition-colors"
            style={{ backgroundColor: currentTheme.primaryColor }}
          >
            <span>Portail Carrières</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4-Column KPI Grid with Tabular Figures (constitution compliance) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 : Besoins & Postes */}
        <div
          onClick={() => onNavigateTab('bloc1')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">1. Besoins & Postes</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-mono text-2xl font-bold tracking-tight text-slate-900">
              {totalPostesVacants} <span className="text-sm font-normal text-slate-400">/ {totalPostesAutorises}</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Postes vacants · <span className="font-semibold text-blue-700">{demandesEnValidation}</span> en validation
            </div>
          </div>
        </div>

        {/* KPI 2 : Recrutement */}
        <div
          onClick={() => onNavigateTab('bloc2')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">2. Recrutement Actif</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-mono text-2xl font-bold tracking-tight text-slate-900">
              {totalCandidatures} <span className="text-sm font-normal text-slate-400">candidatures</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Sur <span className="font-semibold text-indigo-700">{offresPubliees}</span> offre(s) publiée(s)
            </div>
          </div>
        </div>

        {/* KPI 3 : Embauche & Propositions */}
        <div
          onClick={() => onNavigateTab('bloc3')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">3. Embauche & Contrats</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-mono text-2xl font-bold tracking-tight text-slate-900">
              {candidaturesRetenues} <span className="text-sm font-normal text-slate-400">retenus</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              <span className="font-semibold text-teal-700">{contratsActifs}</span> contrat(s) en vigueur
            </div>
          </div>
        </div>

        {/* KPI 4 : Onboarding */}
        <div
          onClick={() => onNavigateTab('bloc4')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">4. Onboarding & Intégration</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Rocket className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-mono text-2xl font-bold tracking-tight text-slate-900">
              {onboardingsEnCours} <span className="text-sm font-normal text-slate-400">parcours</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Checklists réparties RH, IT, Logistique
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Split : Interactive Pipeline Funnel + Vacancy & Organisation Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Entonnoir de Recrutement */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Entonnoir de Conversion Recrutement
              </h3>
              <p className="text-xs text-slate-500">
                Taux de passage de la réception de candidature jusqu’à l’intégration finale.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('bloc2')}
              className="text-xs font-semibold hover:underline"
              style={{ color: currentTheme.accentColor }}
            >
              Gérer les candidatures →
            </button>
          </div>

          {/* Funnel Steps */}
          <div className="space-y-3 pt-2">
            {[
              { label: '1. Candidatures Reçues', count: totalCandidatures, pct: 100, color: 'bg-indigo-600' },
              {
                label: '2. Présélectionnées (sur critères)',
                count: state.candidatures.filter((c) => c.statut !== 'RECUE').length,
                pct: totalCandidatures > 0 ? Math.round((state.candidatures.filter((c) => c.statut !== 'RECUE').length / totalCandidatures) * 100) : 0,
                color: 'bg-blue-600',
              },
              {
                label: '3. En Entretiens / Évaluations Pratiques',
                count: state.entretiens.length,
                pct: totalCandidatures > 0 ? Math.round((state.entretiens.length / totalCandidatures) * 100) : 0,
                color: 'bg-purple-600',
              },
              {
                label: '4. Candidats Retenus & Propositions Fermes',
                count: candidaturesRetenues,
                pct: totalCandidatures > 0 ? Math.round((candidaturesRetenues / totalCandidatures) * 100) : 0,
                color: 'bg-teal-600',
              },
              {
                label: '5. Embauches Finalisées & Contrats Signés',
                count: state.employes.length,
                pct: totalCandidatures > 0 ? Math.round((state.employes.length / totalCandidatures) * 100) : 0,
                color: 'bg-emerald-600',
              },
            ].map((step, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800">{step.label}</span>
                  <span className="font-mono text-slate-600">
                    {step.count} ({step.pct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${step.color} rounded-full`} style={{ width: `${step.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Center / Circuit Validation Queue */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              File d'Attente de Décision ({state.currentRole})
            </h3>
            <span
              className="text-xs px-2 py-0.5 rounded font-medium"
              style={{ backgroundColor: currentTheme.badgeBg, color: currentTheme.badgeText }}
            >
              Validation Requise
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Demandes de recrutement nécessitant actuellement une action de validation pour votre rôle :
          </p>

          <div className="space-y-2.5">
            {state.demandes.filter((d) => d.statut !== 'OUVERTE' && d.statut !== 'REJETEE').length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                Toutes les demandes de votre service sont traitées !
              </div>
            ) : (
              state.demandes
                .filter((d) => d.statut !== 'OUVERTE' && d.statut !== 'REJETEE')
                .slice(0, 3)
                .map((dem) => {
                  const poste = state.postes.find((p) => p.id === dem.poste_id);

                  return (
                    <div
                      key={dem.id}
                      onClick={() => onNavigateTab('bloc1')}
                      className="p-3.5 bg-slate-50 hover:bg-indigo-50/50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-900">{dem.numero}</span>
                        <span className="text-[11px] font-semibold text-indigo-700">
                          Étape : {dem.etape_validation_actuelle}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-1">{poste?.intitule}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                        Budget : {dem.budget_estime.toLocaleString('fr-FR')} Ar · {dem.type}
                      </div>
                    </div>
                  );
                })
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateTab('bloc1')}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors text-center"
            >
              Voir toutes les demandes en cours →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
