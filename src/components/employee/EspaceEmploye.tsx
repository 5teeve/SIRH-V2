/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User,
  FileText,
  Clock,
  ShieldCheck,
  Briefcase,
  Check,
  ChevronRight,
  Download,
  ExternalLink,
  Send,
  Sparkles,
  ArrowRight,
  UserPlus,
  LogIn,
  CheckCircle2,
  Calendar,
  Building2,
  Award
} from 'lucide-react';
import { sirhStore, SirhState } from '../../store/sirhStore';
import landingBgImg from '../../assets/images/sirh_landing_bg_1792736875672.jpg';

interface EspaceEmployeProps {
  state: SirhState;
  onNavigateTab: (tab: string) => void;
  onOpenAuth: (prompt?: string, mode?: 'login' | 'register') => void;
}

export const EspaceEmploye: React.FC<EspaceEmployeProps> = ({
  state,
  onNavigateTab,
  onOpenAuth,
}) => {
  const [showContractModal, setShowContractModal] = useState(false);
  const [quickRequestType, setQuickRequestType] = useState('CONGES');
  const [quickRequestSent, setQuickRequestSent] = useState(false);

  const [selectedEmployeId, setSelectedEmployeId] = useState<string>('');

  // Active or sample employee data (priorise le dernier candidat embauché si disponible)
  const employe =
    (selectedEmployeId && state.employes.find((e) => e.id === selectedEmployeId)) ||
    (state.derniereEmbaucheEmployeId && state.employes.find((e) => e.id === state.derniereEmbaucheEmployeId)) ||
    state.employes.find((e) => e.matricule === state.currentUser.matricule) ||
    state.employes.find((e) => e.email_professionnel === state.currentUser.email || e.email_personnel === state.currentUser.email) ||
    state.employes[0];
  const contrat =
    state.contrats.find((c) => c.employe_id === employe?.id) || state.contrats[0];
  const onboarding =
    state.onboardings.find((o) => o.employe_id === employe?.id) || state.onboardings[0];
  const poste = state.postes.find((p) => p.id === contrat?.poste_id);
  const dept = state.departements.find((d) => d.id === (poste?.departement_id || state.currentUser.departement_id));

  const employeNomComplet = employe ? `${employe.prenom} ${employe.nom}` : `${state.currentUser.prenom} ${state.currentUser.nom}`;

  // Days remaining in probation period
  const dateFinEssai = new Date(contrat?.periode_essai_fin || '2027-01-15');
  const today = new Date('2026-10-23');
  const diffTime = dateFinEssai.getTime() - today.getTime();
  const joursRestants = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const handleSendQuickRequest = (e: React.FormEvent) => {
    e.preventDefault();
    sirhStore.pushNotification(
      `Demande ${quickRequestType}`,
      `Demande soumise par ${employeNomComplet} (${employe?.matricule || 'EMP-2026-0001'})`,
      'ACTION_REQUISE',
      'RH'
    );
    setQuickRequestSent(true);
    setTimeout(() => setQuickRequestSent(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Impressive Hero with Architectural Background Image */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 min-h-[380px] flex flex-col justify-between">
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url(${landingBgImg})` }}
        />

        {/* Cinematic Subtle Dark Glass Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-slate-950/60 backdrop-blur-[1px]" />

        {/* Hero Top Content */}
        <div className="relative z-10 p-6 sm:p-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-wide uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Portail Collaborateurs & Carrières</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Bienvenue sur votre <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-sky-200">
              Espace Salarié Moderne
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
            Suivi personnalisé de votre contrat, documents administratifs conformes au Code du Travail,
            parcours d'intégration et opportunités de carrière interne.
          </p>

          {/* Minimal CTA Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {!state.isAuthenticated ? (
              <>
                <button
                  onClick={() => onOpenAuth('Accès Espace Personnel', 'login')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-2 hover:translate-y-[-1px]"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Se Connecter</span>
                </button>
                <button
                  onClick={() => onOpenAuth(undefined, 'register')}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-semibold text-xs transition-colors flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>S'inscrire (Nouveau collaborateur)</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowContractModal(true)}
                className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs transition-all shadow-md flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Consulter Mon Contrat CDI</span>
              </button>
            )}

            <button
              onClick={() => onNavigateTab('carrieres')}
              className="px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-slate-200 border border-slate-700/60 backdrop-blur-md font-medium text-xs transition-colors flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>Postes Ouverts en Mobilité</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Hero Bottom Metric Strip (Zero Pills, Pure Typography Math) */}
        <div className="relative z-10 bg-slate-950/70 border-t border-white/10 backdrop-blur-md px-6 sm:px-10 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400">Période d'Essai</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{joursRestants} jours</div>
            <div className="text-[10px] text-slate-400">Échéance 15 Janv. 2027</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400">Protection Sociale</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">100% Conforme</div>
            <div className="text-[10px] text-slate-400">CNaPS : {employe?.numero_cnaps || '98451203'}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400">Onboarding Salarié</div>
            <div className="text-xl font-bold font-mono text-indigo-300 mt-0.5">{onboarding?.taux_avancement || 60}%</div>
            <div className="text-[10px] text-slate-400">3/5 étapes validées</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400">Traitement RH</div>
            <div className="text-xl font-bold font-mono text-sky-300 mt-0.5">&lt; 24h</div>
            <div className="text-[10px] text-slate-400">Support collaborateur actif</div>
          </div>
        </div>
      </div>

      {/* Collaborator Profile Selector (Si plusieurs salariés sont enregistrés) */}
      {state.employes.length > 1 && (
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs">
            <User className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-700">Dossier Salarié Actif :</span>
            <span className="font-bold text-slate-900">{employeNomComplet}</span>
            {employe?.matricule && (
              <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-600">
                {employe.matricule}
              </span>
            )}
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              {employe?.statut || 'EN_ONBOARDING'}
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 whitespace-nowrap">Changer de collaborateur :</span>
            <select
              value={employe?.id || ''}
              onChange={(e) => {
                setSelectedEmployeId(e.target.value);
                sirhStore.selectEmploye(e.target.value);
              }}
              className="p-1.5 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-800"
            >
              {state.employes.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.prenom} {emp.nom} ({emp.matricule || 'Sans matricule'})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Lightweight Status & Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Contrat & Statut */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
              <span className="font-semibold text-slate-700">Statut du Salarié</span>
              <span className="font-mono text-[11px] text-indigo-600 font-bold">
                {employe?.matricule || 'EMP-2026-0001'}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-sm font-bold text-slate-900">
                {employeNomComplet}
              </div>
              <div className="text-xs text-slate-500">
                {poste?.intitule || 'Ingénieur Full-Stack Senior'} · {contrat?.type_contrat || 'CDI'}
              </div>
              <div className="text-xs text-slate-500">
                Département : <strong className="text-slate-800">{dept?.nom || 'Technique'}</strong>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Rémunération de base</span>
            <span className="text-xs font-mono font-bold text-slate-900">
              {contrat?.remuneration_base.toLocaleString('fr-FR')} Ar
            </span>
          </div>
        </div>

        {/* Card 2: Intégration & Matériel */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
              <span className="font-semibold text-slate-700">Équipements & Accès</span>
              <span className="text-[11px] text-emerald-600 font-semibold">Attribué</span>
            </div>

            <div className="mt-4 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Ordinateur & Poste</span>
                <span className="font-medium text-slate-900">MacBook Pro M3</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Badge d'accès Siège</span>
                <span className="font-medium text-slate-900">Badge #8831</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Email & Slack Pro</span>
                <span className="font-medium text-emerald-600">Actif</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Manager de référence</span>
            <span className="font-medium text-slate-900">Steeve Randria</span>
          </div>
        </div>

        {/* Card 3: Demande RH Express */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
              <span className="font-semibold text-slate-700">Demande RH Rapide</span>
              <span className="text-[11px] text-slate-400">Réponse sous 24h</span>
            </div>

            <form onSubmit={handleSendQuickRequest} className="mt-3 space-y-2.5">
              <div>
                <select
                  value={quickRequestType}
                  onChange={(e) => setQuickRequestType(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="CONGES">Demande de Congés Payés (CP)</option>
                  <option value="ATTESTATION">Attestation d'emploi pour banque</option>
                  <option value="FORMATION">Demande de Formation Pro</option>
                  <option value="FRAIS">Note de frais de déplacement</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmettre au service RH</span>
              </button>
            </form>
          </div>

          {quickRequestSent ? (
            <div className="mt-3 text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-lg text-center font-medium">
              Demande enregistrée avec succès !
            </div>
          ) : (
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
              Traitement confidentiel conforme RGPD & Code du Travail
            </div>
          )}
        </div>
      </div>

      {/* Two Columns: Checklist d'Onboarding & Documents Téléchargeables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Onboarding Steps */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Parcours d'Intégration Collaborateur
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Étapes clés réalisées avec le service RH, le responsable IT et votre manager.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500">
              5 étapes officielles
            </span>
          </div>

          <div className="space-y-3">
            {onboarding?.taches.map((tache, index) => {
              const isDone = tache.statut === 'FAIT';
              const isPending = tache.statut === 'EN_COURS';

              return (
                <div
                  key={tache.id}
                  className={`p-3.5 rounded-xl border transition-colors flex items-center justify-between gap-3 ${
                    isDone
                      ? 'bg-slate-50/60 border-slate-200'
                      : isPending
                      ? 'bg-amber-50/30 border-amber-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : isPending
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : index + 1}
                    </div>

                    <div>
                      <div
                        className={`text-xs font-bold ${
                          isDone ? 'text-slate-700 line-through decoration-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {tache.titre}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Responsable : {tache.responsable} · {tache.description}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${
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
              );
            })}
          </div>
        </div>

        {/* Documents Téléchargeables */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-sm font-bold text-slate-900">
                Documents & Justificatifs
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Téléchargement direct en format PDF certifié.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Fiche de Paie (Mois M-1)</div>
                    <div className="text-[10px] text-slate-400">PDF certifié · 1.4 Mo</div>
                  </div>
                </div>
                <button
                  onClick={() => alert('Téléchargement du bulletin de salaire simulé.')}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Télécharger"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Attestation d'Emploi</div>
                    <div className="text-[10px] text-slate-400">Pour démarches administratives</div>
                  </div>
                </div>
                <button
                  onClick={() => alert('Génération de l’attestation d’emploi en cours.')}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Télécharger"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Livret d'Accueil Entreprise</div>
                    <div className="text-[10px] text-slate-400">Guide interne & charte IT</div>
                  </div>
                </div>
                <button
                  onClick={() => alert('Ouverture du livret d’accueil.')}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Télécharger"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => onNavigateTab('carrieres')}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center justify-center gap-1 mx-auto"
            >
              <span>Découvrir la mobilité interne</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Contract Detail Modal */}
      {showContractModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Contrat de Travail {contrat?.type_contrat || 'CDI'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Réf : {contrat?.numero || 'CTR-2026-0001'} · Conforme Code du Travail
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowContractModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold"
              >
                Fermer
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 block text-[11px]">Collaborateur</span>
                  <span className="font-bold text-slate-900">
                    {employeNomComplet}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Poste</span>
                  <span className="font-bold text-slate-900">
                    {poste?.intitule || 'Ingénieur Full-Stack Senior'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Date de Début</span>
                  <span className="font-semibold text-slate-900">
                    {new Date(contrat?.date_debut || '2026-10-15').toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Fin Période d'Essai</span>
                  <span className="font-semibold text-slate-900">
                    {dateFinEssai.toLocaleDateString('fr-FR')} (90j)
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Rémunération Mensuelle</span>
                  <span className="font-bold font-mono text-slate-900">
                    {contrat?.remuneration_base.toLocaleString('fr-FR')} Ar
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Lieu de Travail</span>
                  <span className="font-semibold text-slate-900">
                    {contrat?.lieu_travail || 'Siège Social — Ankorondrano, Antananarivo'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Clause de Confidentialité</h4>
                <p className="text-slate-600">
                  Le salarié s'engage formellement au secret professionnel et à la stricte non-divulgation
                  des données applicatives, techniques, financières et stratégiques de l'entreprise.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Préavis de Rupture</h4>
                <p className="text-slate-600">
                  Conformément à la convention d'entreprise et au Code du Travail, la durée du préavis
                  réciproque est fixée à 3 mois pour le statut cadre après validation de la période d'essai.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4 stroke-[3]" />
                Contrat signé électroniquement
              </span>
              <button
                onClick={() => setShowContractModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
