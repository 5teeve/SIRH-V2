/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User,
  FileText,
  CheckCircle2,
  Clock,
  Calendar,
  Building,
  Briefcase,
  ShieldCheck,
  Download,
  ExternalLink,
  ChevronRight,
  Info,
  Check
} from 'lucide-react';
import { SirhState } from '../../store/sirhStore';
import { useTheme } from '../../theme/themeContext';

interface EspaceEmployeProps {
  state: SirhState;
  onNavigateTab: (tab: string) => void;
}

export const EspaceEmploye: React.FC<EspaceEmployeProps> = ({ state, onNavigateTab }) => {
  const { currentTheme } = useTheme();
  const [showContractModal, setShowContractModal] = useState(false);

  // Find employee corresponding to current user
  const employe = state.employes.find((e) => e.matricule === state.currentUser.matricule) || state.employes[0];
  const contrat = state.contrats.find((c) => c.employe_id === employe?.id) || state.contrats[0];
  const onboarding = state.onboardings.find((o) => o.employe_id === employe?.id) || state.onboardings[0];
  const poste = state.postes.find((p) => p.id === contrat?.poste_id);
  const dept = state.departements.find((d) => d.id === state.currentUser.departement_id);

  // Calculate days remaining in probation period
  const dateDebut = new Date(contrat?.date_debut || '2026-10-15');
  const dateFinEssai = new Date(contrat?.periode_essai_fin || '2027-01-15');
  const today = new Date('2026-10-23');
  const diffTime = dateFinEssai.getTime() - today.getTime();
  const joursRestants = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  return (
    <div className="space-y-6">
      {/* Employee Workspace Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-sm shrink-0"
            style={{ backgroundColor: currentTheme.primaryColor }}
          >
            {state.currentUser.prenom[0]}
            {state.currentUser.nom[0]}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                Espace Salarié & Collaborateur
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-800">
                {state.currentUser.matricule || employe?.matricule || 'EMP-2026-0001'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Bienvenue, {state.currentUser.prenom} {state.currentUser.nom}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {poste?.intitule || 'Ingénieur Full-Stack Senior'} · {dept?.nom || 'Direction Technique & Systèmes'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigateTab('carrieres')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Briefcase className="w-4 h-4 text-slate-500" />
            <span>Mobilité Interne</span>
          </button>
          <button
            onClick={() => setShowContractModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-opacity shadow-xs hover:opacity-90"
            style={{ backgroundColor: currentTheme.primaryColor }}
          >
            <FileText className="w-4 h-4" />
            <span>Mon Contrat CDI</span>
          </button>
        </div>
      </div>

      {/* Grid: Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Probation / Trial Period */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-2">
              <span>Période d'Essai Légale</span>
              <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                En cours
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {joursRestants} <span className="text-sm font-normal text-slate-500">jours restants</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Échéance légale fixée au{' '}
              <strong className="text-slate-700">
                {dateFinEssai.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </strong>
              .
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Durée réglementaire 90 jours (Code du Travail)</span>
          </div>
        </div>

        {/* Card 2: Affiliations Légales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-2">
              <span>Protection & Affiliations</span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Conforme
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">CNaPS :</span>
                <span className="font-mono font-semibold">{employe?.numero_cnaps || '98451203'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service Médical :</span>
                <span className="font-semibold text-slate-900">{employe?.numero_ostie || 'OST-77412'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rémunération :</span>
                <span className="font-mono font-bold text-slate-900">
                  {contrat?.remuneration_base.toLocaleString('fr-FR')} Ar / mois
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Déclarations sociales enregistrées</span>
          </div>
        </div>

        {/* Card 3: Progression Intégration */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-2">
              <span>Parcours d'Onboarding</span>
              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                {onboarding?.taux_avancement || 60}% complété
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 my-2 overflow-hidden">
              <div
                className="h-2.5 rounded-full transition-all"
                style={{
                  width: `${onboarding?.taux_avancement || 60}%`,
                  backgroundColor: currentTheme.primaryColor,
                }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              3 des 5 étapes d'accueil ont été validées avec succès par l'équipe RH et votre manager.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
            <User className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Manager de référence : Steeve Randria</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Onboarding Checklist & Administrative Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 & 2: Onboarding Steps */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Mon Parcours d'Intégration Collaborateur
              </h2>
              <p className="text-xs text-slate-500">
                Suivi des étapes d'accueil, remise des équipements et bilans d'étonnement.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
              5 étapes planifiées
            </span>
          </div>

          <div className="space-y-3.5">
            {onboarding?.taches.map((tache, index) => {
              const isDone = tache.statut === 'FAIT';
              const isPending = tache.statut === 'EN_COURS';

              return (
                <div
                  key={tache.id}
                  className={`p-4 rounded-xl border transition-colors flex items-start gap-3.5 ${
                    isDone
                      ? 'bg-slate-50/70 border-slate-200'
                      : isPending
                      ? 'bg-amber-50/40 border-amber-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isPending
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <span className="text-xs font-bold">{index + 1}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`text-xs font-bold ${
                          isDone ? 'text-slate-800 line-through decoration-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {tache.titre}
                      </h3>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isDone
                            ? 'bg-emerald-50 text-emerald-700'
                            : isPending
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isDone ? 'Validé' : isPending ? 'En cours' : 'À venir'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{tache.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                      <span>Pôle référent : <strong>{tache.responsable}</strong></span>
                      <span>·</span>
                      <span>Échéance : <strong>{tache.date_echeance}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: Contact RH & Quick Resources */}
        <div className="space-y-6">
          {/* Quick Support & Referent Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Vos Référents en Entreprise
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">
                  SR
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Steeve Randria</div>
                  <div className="text-[11px] text-slate-500">Manager Technique (N+1)</div>
                  <div className="text-[11px] text-indigo-600">manager.tech@sirh-entreprise.mg</div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs font-bold">
                  TR
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Tanteraka Rasoa</div>
                  <div className="text-[11px] text-slate-500">Direction RH & Onboarding</div>
                  <div className="text-[11px] text-indigo-600">rh.recrutement@sirh-entreprise.mg</div>
                </div>
              </div>
            </div>
          </div>

          {/* Practical Information */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
              <Building className="w-4 h-4 text-slate-400" />
              <span>Campus Siège Social</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              Immeuble Ariane 5B, Ankorondrano
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Horaires contractuels : 08h00 - 17h00 du lundi au vendredi. Restaurant d'entreprise & espaces de détente accessibles avec votre badge d'accès.
            </p>
            <button
              onClick={() => onNavigateTab('carrieres')}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              <span>Consulter les opportunités internes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Contract Viewer Modal */}
      {showContractModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Contrat de Travail à Durée Indéterminée (CDI)
                </h3>
              </div>
              <button
                onClick={() => setShowContractModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
              >
                ✕ Fermer
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">Référence légale : {contrat?.numero || 'CTR-2026-0001'}</div>
                <div>Employeur : <strong>SIRH Entreprise Madagascar S.A.</strong></div>
                <div>Salarié : <strong>Mamy Ranaivo</strong> (Matricule : {employe?.matricule})</div>
                <div>Poste : <strong>{poste?.intitule}</strong></div>
                <div>Lieu d'exécution : <strong>{contrat?.lieu_travail}</strong></div>
                <div>Rémunération de base : <strong>{contrat?.remuneration_base.toLocaleString('fr-FR')} Ariary brut mensuel</strong></div>
              </div>

              <div className="border border-slate-100 p-3 rounded-lg text-slate-600">
                <p className="font-semibold text-slate-800 mb-1">Article 1 — Engagement & Période d'essai :</p>
                <p>
                  Le présent contrat est conclu pour une durée indéterminée à compter du 15 octobre 2026. Conformément au Code du Travail, une période d'essai de 90 jours calendaires est convenue, expirant le 15 janvier 2027.
                </p>
              </div>

              <div className="border border-slate-100 p-3 rounded-lg text-slate-600">
                <p className="font-semibold text-slate-800 mb-1">Article 2 — Horaires & Temps de travail :</p>
                <p>
                  La durée hebdomadaire de travail est fixée à 40 heures par semaine, réparties du lundi au vendredi selon les plages en vigueur dans l'entreprise.
                </p>
              </div>

              <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-xs">
                  Contrat signé électroniquement et validé par la Direction RH et le Collaborateur le 14/10/2026.
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setShowContractModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl"
              >
                Fermer la consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
