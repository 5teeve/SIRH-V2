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
  FileText,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Calendar,
  Layers,
  Sparkles,
  Database,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { SirhState } from '../../store/sirhStore';
import { useTheme } from '../../theme/themeContext';
import { AnalyticsCharts } from './AnalyticsCharts';
import { ROLE_CONFIGS } from '../../config/rolePermissions';

interface ExecutiveDashboardProps {
  state: SirhState;
  onNavigateTab: (tab: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  state,
  onNavigateTab,
}) => {
  const { currentTheme } = useTheme();
  const role = state.currentRole;
  const roleConfig = ROLE_CONFIGS[role] || ROLE_CONFIGS.RH;

  // Global calculations
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

  // Role-specific calculations
  // Manager: Tech Department focus
  const myDeptId = state.currentUser.departement_id;
  const myPostes = state.postes.filter((p) => !myDeptId || p.departement_id === myDeptId);
  const myPostesAutorises = myPostes.reduce((acc, p) => acc + p.effectif_autorise, 0);
  const myPostesPourvus = myPostes.reduce((acc, p) => acc + p.effectif_pourvu, 0);
  const myDemandes = state.demandes.filter(
    (d) => d.demandeur_id === state.currentUser.id || (myDeptId && d.departement_id === myDeptId)
  );

  // Finance: Budget focus
  const demandesVisaFinance = state.demandes.filter((d) => d.etape_validation_actuelle === 'FINANCE');
  const budgetEngageTotal = state.contrats.reduce((sum, c) => sum + (c.remuneration_base * 12), 0);
  const budgetPrevisionnelDemandes = state.demandes
    .filter((d) => ['SOUMISE', 'VALIDEE_RH', 'VALIDEE_FINANCE', 'OUVERTE'].includes(d.statut))
    .reduce((sum, d) => sum + (d.budget_estime * 12), 0);

  // Direction: Strategic DG focus
  const demandesVisaDirection = state.demandes.filter((d) => d.etape_validation_actuelle === 'DIRECTION');

  return (
    <div className="space-y-6">
      {/* Top Banner with Clear Role Identity */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${roleConfig.badgeClass}`}
            >
              {roleConfig.badgeLabel}
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">
              Connecté en tant que <strong>{state.currentUser.prenom} {state.currentUser.nom}</strong>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            {role === 'MANAGER' && 'Espace Management Opérationnel & Équipe Technique'}
            {role === 'FINANCE' && 'Tableau de Bord Financier & Visas Budgétaires'}
            {role === 'DIRECTION' && 'Gouvernance Stratégique & Arbitrage Direction Générale'}
            {role === 'ADMIN' && 'Console d’Administration & Supervision Système'}
            {role === 'RH' && 'Pilotage Consolidé des Ressources Humaines & Talents'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {roleConfig.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {role === 'MANAGER' && (
            <button
              onClick={() => onNavigateTab('bloc1')}
              className="flex items-center gap-2 px-3.5 py-2 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs hover:opacity-90"
              style={{ backgroundColor: currentTheme.primaryColor }}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Exprimer un besoin d'équipe</span>
            </button>
          )}

          {role === 'FINANCE' && (
            <button
              onClick={() => onNavigateTab('bloc1')}
              className="flex items-center gap-2 px-3.5 py-2 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs hover:opacity-90"
              style={{ backgroundColor: currentTheme.primaryColor }}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Viser les demandes ({demandesVisaFinance.length})</span>
            </button>
          )}

          {role === 'DIRECTION' && (
            <button
              onClick={() => onNavigateTab('bloc1')}
              className="flex items-center gap-2 px-3.5 py-2 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs hover:opacity-90"
              style={{ backgroundColor: currentTheme.primaryColor }}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Arbitrages en attente ({demandesVisaDirection.length})</span>
            </button>
          )}

          {role === 'ADMIN' && (
            <button
              onClick={() => onNavigateTab('sql')}
              className="flex items-center gap-2 px-3.5 py-2 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs hover:opacity-90"
              style={{ backgroundColor: currentTheme.primaryColor }}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Dossier & Scripts SQL</span>
            </button>
          )}

          {role === 'RH' && (
            <button
              onClick={() => onNavigateTab('carrieres')}
              className="flex items-center gap-2 px-3.5 py-2 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs hover:opacity-90"
              style={{ backgroundColor: currentTheme.primaryColor }}
            >
              <span>Portail Carrières</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          WORKSPACE MANAGER
      ========================================================================= */}
      {role === 'MANAGER' && (
        <div className="space-y-6">
          {/* 4 KPIs tailored for Manager */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => onNavigateTab('bloc1')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Effectifs de mon Service</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="mt-3">
                <div className="font-mono text-2xl font-bold tracking-tight text-slate-900">
                  {myPostesPourvus} <span className="text-sm font-normal text-slate-400">/ {myPostesAutorises}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {myPostesAutorises - myPostesPourvus} poste(s) vacant(s) à pourvoir
                </div>
              </div>
            </div>

            <div
              onClick={() => onNavigateTab('bloc1')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Mes Demandes de Recrutement</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="mt-3">
                <div className="font-mono text-2xl font-bold tracking-tight text-slate-900">
                  {myDemandes.length}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  <span className="font-semibold text-blue-700">
                    {myDemandes.filter((d) => d.statut !== 'OUVERTE').length}
                  </span>{' '}
                  en circuit d'approbation
                </div>
              </div>
            </div>

            <div
              onClick={() => onNavigateTab('bloc2')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Entretiens Techniques à mener</span>
                <UserCheck className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="mt-3">
                <div className="font-mono text-2xl font-bold tracking-tight text-slate-900">
                  {state.entretiens.filter((e) => e.statut === 'PLANIFIE').length}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Candidats qualifiés pour la Direction Tech
                </div>
              </div>
            </div>

            <div
              onClick={() => onNavigateTab('bloc4')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Nouveaux Arrivants dans l'Équipe</span>
                <Rocket className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-3">
                <div className="font-mono text-2xl font-bold tracking-tight text-slate-900">
                  {state.onboardings.length}
                </div>
                <div className="text-xs text-slate-500 mt-1 truncate">
                  {state.onboardings.length > 0 ? (() => {
                    const latestOnb = state.onboardings[0];
                    const latestEmp = state.employes.find((e) => e.id === latestOnb.employe_id);
                    const latestCtr = state.contrats.find((c) => c.id === latestOnb.contrat_id);
                    const latestPoste = state.postes.find((p) => p.id === latestCtr?.poste_id);
                    return latestEmp
                      ? `${latestEmp.prenom} ${latestEmp.nom} (${latestPoste?.intitule || 'Collaborateur'} · ${latestOnb.taux_avancement}%)`
                      : 'Aucun nouvel arrivant';
                  })() : 'Aucun arrivant'}
                </div>
              </div>
            </div>
          </div>

          {/* Manager Action Center: Demandes & Entretiens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Mes Demandes d'équipe */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Mes Demandes de Recrutement & Circuit d'Approbation
                  </h3>
                  <p className="text-xs text-slate-500">
                    Statut en temps réel des validations RH, Financière et Direction.
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('bloc1')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Voir tout ➔
                </button>
              </div>

              <div className="space-y-3">
                {myDemandes.map((dem) => {
                  const poste = state.postes.find((p) => p.id === dem.poste_id);
                  return (
                    <div
                      key={dem.id}
                      className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-900">{dem.numero}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            dem.statut === 'OUVERTE'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {dem.statut === 'OUVERTE' ? 'Ouverte au recrutement' : `Étape : ${dem.etape_validation_actuelle}`}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-1">
                        {poste?.intitule}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                        <span>{dem.nombre_postes} poste(s) · {dem.type}</span>
                        <span>Budget : {dem.budget_estime.toLocaleString('fr-FR')} Ar</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Mes Entretiens Techniques */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Mes Entretiens Techniques Planifiés
                  </h3>
                  <p className="text-xs text-slate-500">
                    Candidatures transmises par les RH pour évaluation technique.
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('bloc2')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Grille d'évaluation ➔
                </button>
              </div>

              <div className="space-y-3">
                {state.candidatures.slice(0, 3).map((cand) => {
                  const candidat = state.candidats.find((c) => c.id === cand.candidat_id);
                  const offre = state.offres.find((o) => o.id === cand.offre_id);

                  return (
                    <div
                      key={cand.id}
                      className="p-3.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {candidat?.prenom} {candidat?.nom}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {offre?.titre || 'Poste technique'} · Score IA : <strong>{cand.score_adequation_ia || cand.score_preselection || 85}%</strong>
                        </div>
                        <div className="text-[10px] text-indigo-600 mt-1 font-medium">
                          Statut : {cand.statut}
                        </div>
                      </div>
                      <button
                        onClick={() => onNavigateTab('bloc2')}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
                      >
                        Évaluer
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          WORKSPACE FINANCE
      ========================================================================= */}
      {role === 'FINANCE' && (
        <div className="space-y-6">
          {/* Financial KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Masse Salariale Annuelle Engagée</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-3 font-mono text-2xl font-bold tracking-tight text-slate-900">
                {(budgetEngageTotal / 1000000).toFixed(1)} M <span className="text-sm font-normal text-slate-500">Ar/an</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {contratsActifs} contrat(s) en cours d'exécution
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Enveloppe Prévisionnelle Recrutement</span>
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div className="mt-3 font-mono text-2xl font-bold tracking-tight text-slate-900">
                {(budgetPrevisionnelDemandes / 1000000).toFixed(1)} M <span className="text-sm font-normal text-slate-500">Ar/an</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Postes ouverts & en cours de recrutement
              </div>
            </div>

            <div
              onClick={() => onNavigateTab('bloc1')}
              className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs cursor-pointer hover:border-amber-300 transition-all"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-amber-800">
                <span>Visas Budgétaires Requis</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="mt-3 font-mono text-2xl font-bold tracking-tight text-amber-900">
                {demandesVisaFinance.length}
              </div>
              <div className="text-xs text-amber-700 mt-1 font-medium">
                Demandes nécessitant votre visa financier
              </div>
            </div>

            <div
              onClick={() => onNavigateTab('bloc3')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Packages Salaires en Négociation</span>
                <FileCheck className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="mt-3 font-mono text-2xl font-bold tracking-tight text-slate-900">
                {state.propositions.length}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Propositions d'embauche soumises
              </div>
            </div>
          </div>

          {/* Pending Financial Approvals Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Demandes de Recrutement en Attente de Visa Financier
                </h3>
                <p className="text-xs text-slate-500">
                  Validation de l'enveloppe budgétaire avant transmission à la Direction Générale.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('bloc1')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Ouvrir le module Besoins ➔
              </button>
            </div>

            {demandesVisaFinance.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                Toutes les demandes de recrutement ont reçu leur visa financier.
              </div>
            ) : (
              <div className="space-y-3">
                {demandesVisaFinance.map((dem) => {
                  const poste = state.postes.find((p) => p.id === dem.poste_id);
                  const dept = state.departements.find((d) => d.id === dem.departement_id);

                  return (
                    <div
                      key={dem.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900">{dem.numero}</span>
                          <span className="text-xs font-semibold text-slate-800">
                            {poste?.intitule}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {dept?.nom} · Demandeur : {dem.demandeur_nom} · {dem.nombre_postes} poste(s)
                        </div>
                        <div className="text-xs font-semibold text-emerald-700 mt-1">
                          Budget prévisionnel : {dem.budget_estime.toLocaleString('fr-FR')} Ar / mois ({dem.type_contrat_souhaite})
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onNavigateTab('bloc1')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          Accorder le Visa Budgétaire ➔
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          WORKSPACE DIRECTION GÉNÉRALE
      ========================================================================= */}
      {role === 'DIRECTION' && (
        <div className="space-y-6">
          {/* Strategic Macro KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Effectif Global Entreprise</span>
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div className="mt-3 font-mono text-2xl font-bold tracking-tight text-slate-900">
                {totalPostesPourvus} <span className="text-sm font-normal text-slate-400">/ {totalPostesAutorises}</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Taux de vacance global : {((totalPostesVacants / totalPostesAutorises) * 100).toFixed(0)}%
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Taux de Rotation Global (Turnover)</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-3 font-mono text-2xl font-bold tracking-tight text-emerald-700">
                4.1% <span className="text-xs font-semibold text-slate-500">/ Seuil 6.0%</span>
              </div>
              <div className="text-xs text-emerald-600 mt-1 font-medium">
                Indice conforme au barème stratégique
              </div>
            </div>

            <div
              onClick={() => onNavigateTab('bloc1')}
              className="bg-white p-5 rounded-2xl border border-purple-200 bg-purple-50/20 shadow-xs cursor-pointer hover:border-purple-300 transition-all"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-purple-800">
                <span>Arbitrages Stratégiques DG Requis</span>
                <ShieldCheck className="w-4 h-4 text-purple-600" />
              </div>
              <div className="mt-3 font-mono text-2xl font-bold tracking-tight text-purple-900">
                {demandesVisaDirection.length}
              </div>
              <div className="text-xs text-purple-700 mt-1 font-medium">
                Prêtes pour approbation finale & ouverture
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Taux de Rétention Talents</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-3 font-mono text-2xl font-bold tracking-tight text-slate-900">
                95.9%
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Fidélisation des profils cadres & experts
              </div>
            </div>
          </div>

          {/* Pending Strategic Direction Approvals */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Dossiers en Attente de Visa Stratégique Direction Générale
                </h3>
                <p className="text-xs text-slate-500">
                  Validation finale autorisant l'ouverture du poste et la publication de l'offre sur le marché.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('bloc1')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Gérer les arbitrages ➔
              </button>
            </div>

            {demandesVisaDirection.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                Aucun dossier en attente d'arbitrage de la Direction Générale.
              </div>
            ) : (
              <div className="space-y-3">
                {demandesVisaDirection.map((dem) => {
                  const poste = state.postes.find((p) => p.id === dem.poste_id);
                  const dept = state.departements.find((d) => d.id === dem.departement_id);

                  return (
                    <div
                      key={dem.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900">{dem.numero}</span>
                          <span className="text-xs font-bold text-slate-900">
                            {poste?.intitule}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          {dept?.nom} · Validé préalablement par <strong>RH</strong> et <strong>Finance</strong>.
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Motif : {dem.motif} · Urgence : <span className="font-semibold">{dem.urgence}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onNavigateTab('bloc1')}
                        className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
                      >
                        Signer & Ouvrir au Recrutement ➔
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          WORKSPACE ADMIN
      ========================================================================= */}
      {role === 'ADMIN' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Comptes Utilisateurs SIRH</span>
                <Users className="w-4 h-4 text-slate-700" />
              </div>
              <div className="mt-3 font-mono text-2xl font-bold tracking-tight text-slate-900">
                {state.users.length}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                6 profils opérationnels configurés
              </div>
            </div>

            <div
              onClick={() => onNavigateTab('audit')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Journal d'Audit Système</span>
                <FileText className="w-4 h-4 text-slate-700" />
              </div>
              <div className="mt-3 font-mono text-2xl font-bold tracking-tight text-slate-900">
                {state.journal.length}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Événements tracés et horodatés
              </div>
            </div>

            <div
              onClick={() => onNavigateTab('sql')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Schémas & Scripts SQL</span>
                <Database className="w-4 h-4 text-slate-700" />
              </div>
              <div className="mt-3 font-mono text-2xl font-bold tracking-tight text-slate-900">
                10 Tables
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Structure conforme 3NF & contraintes
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Intégrité des Données</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-3 font-mono text-2xl font-bold tracking-tight text-emerald-700">
                100%
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Contraintes d'intégrité respectées
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          WORKSPACE RH (DIRECTION RH & EXÉCUTIF)
      ========================================================================= */}
      {role === 'RH' && (
        <div className="space-y-6">
          {/* 4-Column KPI Grid with Tabular Figures */}
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

            {/* KPI 3 : Embauche */}
            <div
              onClick={() => onNavigateTab('bloc3')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">3. Embauche & Contrats</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="font-mono text-2xl font-bold tracking-tight text-slate-900">
                  {candidaturesRetenues} <span className="text-sm font-normal text-slate-400">retenus</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  <span className="font-semibold text-emerald-700">{contratsActifs}</span> contrat(s) en vigueur
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
                  {state.onboardings.length} <span className="text-sm font-normal text-slate-400">parcours</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Checklists réparties RH, IT, Logistique
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          RECHARTS ANALYTICS SECTION (For RH, DIRECTION, and FINANCE)
      ========================================================================= */}
      {['RH', 'DIRECTION', 'FINANCE'].includes(role) && (
        <AnalyticsCharts state={state} />
      )}
    </div>
  );
};
