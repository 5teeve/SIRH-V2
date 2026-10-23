/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  PlusCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  XCircle,
  Send,
  Building,
  Briefcase,
  Layers,
  Filter,
  Check
} from 'lucide-react';
import { SirhState, sirhStore } from '../../store/sirhStore';
import { DemandeRecrutement, DecisionValidation, TypeContrat } from '../../types/sirh';
import { useTheme } from '../../theme/themeContext';

interface Bloc1BesoinProps {
  state: SirhState;
  onNavigateToBloc2?: (demandeId: string) => void;
}

export const Bloc1Besoin: React.FC<Bloc1BesoinProps> = ({ state, onNavigateToBloc2 }) => {
  const { currentTheme } = useTheme();
  const [activeSubTab, setActiveSubTab] = useState<'demandes' | 'postes'>('demandes');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState<DemandeRecrutement | null>(null);
  const [validationDecision, setValidationDecision] = useState<DecisionValidation>('VALIDER');
  const [validationComment, setValidationComment] = useState('');
  const [dateReexamen, setDateReexamen] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  // Modal Publication d'offre
  const [demandeToPublish, setDemandeToPublish] = useState<DemandeRecrutement | null>(null);
  const [publishTitre, setPublishTitre] = useState('');
  const [publishLieu, setPublishLieu] = useState('Siège Social — Ankorondrano, Antananarivo');
  const [publishMissions, setPublishMissions] = useState('');
  const [publishProfil, setPublishProfil] = useState('');
  const [publishDateCloture, setPublishDateCloture] = useState('');
  const [publishSalaireMin, setPublishSalaireMin] = useState(0);
  const [publishSalaireMax, setPublishSalaireMax] = useState(0);

  const handleOpenPublishModal = (dem: DemandeRecrutement) => {
    const poste = state.postes.find((p) => p.id === dem.poste_id);
    setDemandeToPublish(dem);
    setPublishTitre(poste ? poste.intitule : 'Offre de recrutement');
    setPublishMissions(dem.motif || (poste ? poste.description : ''));
    setPublishProfil(dem.justification || '');
    setPublishLieu('Siège Social — Ankorondrano, Antananarivo');
    const in30Days = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    setPublishDateCloture(in30Days);

    const maxBudget = dem.budget_estime || (poste ? poste.fourchette_salaire_max : 4500000);
    const minBudget = (poste && poste.fourchette_salaire_min < maxBudget)
      ? poste.fourchette_salaire_min
      : Math.round((maxBudget * 0.85) / 10000) * 10000;
    setPublishSalaireMin(minBudget);
    setPublishSalaireMax(maxBudget);
  };

  const handleConfirmPublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demandeToPublish) return;
    try {
      sirhStore.creerOffre(demandeToPublish.id, {
        titre: publishTitre,
        lieu: publishLieu,
        missions: publishMissions,
        profil_recherche: publishProfil,
        date_cloture: publishDateCloture,
        salaire_min: publishSalaireMin,
        salaire_max: publishSalaireMax,
      });
      const publishedId = demandeToPublish.id;
      setDemandeToPublish(null);
      if (onNavigateToBloc2) {
        onNavigateToBloc2(publishedId);
      }
    } catch (err: any) {
      setActionError(err.message || 'Erreur lors de la publication de l’offre');
    }
  };

  // Form State
  const [nouveauPosteId, setNouveauPosteId] = useState(state.postes[0]?.id || '');
  const [typeDemande, setTypeDemande] = useState<'CREATION' | 'REMPLACEMENT'>('CREATION');
  const [ancienTitulaire, setAncienTitulaire] = useState('');
  const [nombrePostes, setNombrePostes] = useState(1);
  const [motif, setMotif] = useState('');
  const [justification, setJustification] = useState('');
  const [typeContrat, setTypeContrat] = useState<TypeContrat>('CDI');
  const [dateSouhaitee, setDateSouhaitee] = useState('2026-12-01');
  const [urgence, setUrgence] = useState<'NORMALE' | 'URGENTE' | 'TRES_URGENTE'>('NORMALE');
  const [budgetEstime, setBudgetEstime] = useState(4500000);
  const [soumettreDirect, setSoumettreDirect] = useState(true);

  // Filter state
  const [filterStatut, setFilterStatut] = useState<string>('ALL');

  const filteredDemandes = state.demandes.filter((d) => {
    if (filterStatut === 'ALL') return true;
    return d.statut === filterStatut;
  });

  const canUserValidate = (dem: DemandeRecrutement) => {
    if (state.currentRole === 'ADMIN') return true;
    if (dem.etape_validation_actuelle === 'RH' && state.currentRole === 'RH') return true;
    if (dem.etape_validation_actuelle === 'FINANCE' && state.currentRole === 'FINANCE') return true;
    if (dem.etape_validation_actuelle === 'DIRECTION' && state.currentRole === 'DIRECTION') return true;
    return false;
  };

  const handleCreateDemande = (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    try {
      sirhStore.creerDemande({
        type: typeDemande,
        poste_id: nouveauPosteId,
        nombre_postes: nombrePostes,
        motif,
        justification,
        type_contrat_souhaite: typeContrat,
        date_souhaitee: dateSouhaitee,
        urgence,
        budget_estime: budgetEstime,
        ancien_titulaire_ref: typeDemande === 'REMPLACEMENT' ? ancienTitulaire : undefined,
        soumettreImmediatement: soumettreDirect,
      });
      setShowCreateModal(false);
      setMotif('');
      setJustification('');
    } catch (err: any) {
      setActionError(err.message || 'Erreur lors de la création de la demande');
    }
  };

  const handleValiderDecision = (demandeId: string) => {
    setActionError(null);
    try {
      sirhStore.validerEtapeDemande(
        demandeId,
        validationDecision,
        validationComment,
        validationDecision === 'METTRE_EN_ATTENTE' ? dateReexamen : undefined
      );
      setSelectedDemande(null);
      setValidationComment('');
    } catch (err: any) {
      setActionError(err.message || 'Erreur lors de la validation');
    }
  };

  const handleSoumettreBrouillon = (demandeId: string) => {
    try {
      sirhStore.soumettreDemande(demandeId);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const statutBadges: Record<string, { label: string; bg: string; text: string }> = {
    BROUILLON: { label: 'Brouillon', bg: 'bg-slate-100', text: 'text-slate-700' },
    SOUMISE: { label: 'En attente validation RH', bg: 'bg-blue-50', text: 'text-blue-700' },
    VALIDEE_RH: { label: 'En attente validation Finance', bg: 'bg-indigo-50', text: 'text-indigo-700' },
    VALIDEE_FINANCE: { label: 'En attente approbation Direction', bg: 'bg-purple-50', text: 'text-purple-700' },
    VALIDEE_DIRECTION: { label: 'Approuvée Direction', bg: 'bg-teal-50', text: 'text-teal-700' },
    OUVERTE: { label: 'Ouverte au recrutement', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    A_REVOIR: { label: 'À réviser', bg: 'bg-amber-50', text: 'text-amber-700' },
    EN_ATTENTE_BUDGET: { label: 'Mise en attente budgétaire', bg: 'bg-orange-50', text: 'text-orange-700' },
    REJETEE: { label: 'Non retenue', bg: 'bg-rose-50', text: 'text-rose-700' },
    ANNULEE: { label: 'Annulée', bg: 'bg-slate-100', text: 'text-slate-500' },
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Expression des Besoins en Personnel
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestion prévisionnelle des effectifs, vacance des postes et circuit séquentiel d’approbation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sub-tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveSubTab('demandes')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeSubTab === 'demandes'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Demandes de recrutement ({state.demandes.length})
            </button>
            <button
              onClick={() => setActiveSubTab('postes')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeSubTab === 'postes'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Référentiel des Postes ({state.postes.length})
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white rounded-lg transition-colors whitespace-nowrap shadow-xs"
            style={{ backgroundColor: currentTheme.primaryColor }}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nouvelle Demande</span>
          </button>
        </div>
      </div>

      {/* Sub-tab 1 : Demandes */}
      {activeSubTab === 'demandes' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap bg-white p-3 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Filter className="w-4 h-4" />
              <span>Filtrer par statut :</span>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto py-0.5">
              {[
                { id: 'ALL', label: 'Toutes' },
                { id: 'SOUMISE', label: 'À Valider RH' },
                { id: 'VALIDEE_RH', label: 'À Valider Finance' },
                { id: 'VALIDEE_FINANCE', label: 'À Valider Direction' },
                { id: 'OUVERTE', label: 'Ouvertes' },
                { id: 'A_REVOIR', label: 'À Réviser' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatut(tab.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                    filterStatut === tab.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Demandes Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="py-3 px-4">Référence</th>
                    <th className="py-3 px-4">Poste & Département</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Urgence</th>
                    <th className="py-3 px-4">Budget Estimé</th>
                    <th className="py-3 px-4">Étape Actuelle</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredDemandes.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        Aucune demande trouvée avec ce statut.
                      </td>
                    </tr>
                  ) : (
                    filteredDemandes.map((dem) => {
                      const poste = state.postes.find((p) => p.id === dem.poste_id);
                      const dept = state.departements.find((d) => d.id === dem.departement_id);
                      const badge = statutBadges[dem.statut] || {
                        label: dem.statut,
                        bg: 'bg-slate-100',
                        text: 'text-slate-600',
                      };
                      const userCanAct = canUserValidate(dem);

                      return (
                        <tr key={dem.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                            {dem.numero}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900">
                              {poste ? poste.intitule : 'Poste non spécifié'}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {dept ? dept.nom : ''} · {dem.nombre_postes} poste(s)
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-slate-600">
                              {dem.type === 'CREATION' ? 'Création de poste' : 'Remplacement'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[11px] font-medium ${
                                dem.urgence === 'TRES_URGENTE'
                                  ? 'text-rose-600 font-semibold'
                                  : dem.urgence === 'URGENTE'
                                  ? 'text-amber-600'
                                  : 'text-slate-500'
                              }`}
                            >
                              {dem.urgence}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-medium">
                            {dem.budget_estime.toLocaleString('fr-FR')} Ar
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-800">
                              {dem.etape_validation_actuelle}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${badge.bg} ${badge.text}`}
                            >
                              {badge.label}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {dem.statut === 'OUVERTE' && (() => {
                                const offreExistante = state.offres.find((o) => o.demande_id === dem.id);
                                if (offreExistante) {
                                  return (
                                    <button
                                      onClick={() => onNavigateToBloc2 && onNavigateToBloc2(dem.id)}
                                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-[11px] font-medium transition-colors"
                                      title={`Offre publiée sous la référence ${offreExistante.reference}`}
                                    >
                                      Offre ({offreExistante.reference}) ➔
                                    </button>
                                  );
                                }
                                return (
                                  <button
                                    onClick={() => handleOpenPublishModal(dem)}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors shadow-xs"
                                  >
                                    Publier Offre ➔
                                  </button>
                                );
                              })()}

                              {userCanAct && dem.etape_validation_actuelle !== 'CLOTURE' && (
                                <button
                                  onClick={() => {
                                    setSelectedDemande(dem);
                                    setValidationDecision('VALIDER');
                                    setValidationComment('');
                                  }}
                                  className="px-2.5 py-1 text-white rounded text-[11px] font-semibold transition-colors"
                                  style={{ backgroundColor: currentTheme.accentColor }}
                                >
                                  Statuer
                                </button>
                              )}

                              {dem.statut === 'BROUILLON' && (
                                <button
                                  onClick={() => handleSoumettreBrouillon(dem.id)}
                                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-medium transition-colors"
                                >
                                  Soumettre
                                </button>
                              )}

                              <button
                                onClick={() => setSelectedDemande(dem)}
                                className="px-2 py-1 text-slate-500 hover:text-slate-800 text-xs font-medium"
                              >
                                Consulter
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2 : Référentiel des Postes */}
      {activeSubTab === 'postes' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900">
              Cartographie des Postes & Analyse des Effectifs
            </h3>
            <p className="text-xs text-slate-500">
              Chaque poste est défini avec ses compétences requises, sa grille de rémunération et ses postes vacants calculés automatiquement.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Intitulé du Poste</th>
                  <th className="py-3 px-4">Département & Service</th>
                  <th className="py-3 px-4">Compétences Requises</th>
                  <th className="py-3 px-4">Grille Salariale</th>
                  <th className="py-3 px-4 text-center">Autorisé</th>
                  <th className="py-3 px-4 text-center">Pourvu</th>
                  <th className="py-3 px-4 text-center">Vacant</th>
                  <th className="py-3 px-4">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {state.postes.map((p) => {
                  const dept = state.departements.find((d) => d.id === p.departement_id);
                  const srv = state.services.find((s) => s.id === p.service_id);
                  const vacant = p.effectif_autorise - p.effectif_pourvu;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-900">{p.code}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{p.intitule}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{p.description}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800">{dept?.nom}</div>
                        <div className="text-[11px] text-slate-500">{srv?.nom}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {p.competences_requises.map((c, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                        {p.fourchette_salaire_min.toLocaleString('fr-FR')} –{' '}
                        {p.fourchette_salaire_max.toLocaleString('fr-FR')} Ar
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-900">
                        {p.effectif_autorise}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-emerald-700 font-semibold">
                        {p.effectif_pourvu}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-700">
                        {vacant}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-medium">
                          {p.statut}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL : Création de Demande de Recrutement */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Créer une Demande de Recrutement
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDemande} className="mt-4 space-y-4 text-xs">
              {actionError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
                  {actionError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Poste concerné *</label>
                  <select
                    value={nouveauPosteId}
                    onChange={(e) => setNouveauPosteId(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    required
                  >
                    {state.postes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.intitule} ({p.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Type de besoin *</label>
                  <select
                    value={typeDemande}
                    onChange={(e) => setTypeDemande(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="CREATION">Création de poste (développement activité)</option>
                    <option value="REMPLACEMENT">Remplacement (départ, mutation)</option>
                  </select>
                </div>
              </div>

              {typeDemande === 'REMPLACEMENT' && (
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Référence de l'ancien titulaire *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: EMP-2023-0009 ou Nom du partant"
                    value={ancienTitulaire}
                    onChange={(e) => setAncienTitulaire(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    required={typeDemande === 'REMPLACEMENT'}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nombre de postes *</label>
                  <input
                    type="number"
                    min={1}
                    value={nombrePostes}
                    onChange={(e) => setNombrePostes(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Contrat souhaité *</label>
                  <select
                    value={typeContrat}
                    onChange={(e) => setTypeContrat(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="STAGE">Stage professionnel</option>
                    <option value="PRESTATION">Prestation / Freelance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Urgence *</label>
                  <select
                    value={urgence}
                    onChange={(e) => setUrgence(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="NORMALE">Normale</option>
                    <option value="URGENTE">Urgente</option>
                    <option value="TRES_URGENTE">Très urgente</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Date souhaitée d'entrée *</label>
                  <input
                    type="date"
                    value={dateSouhaitee}
                    onChange={(e) => setDateSouhaitee(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Budget mensuel alloué (Ariary) *
                  </label>
                  <input
                    type="number"
                    step={100000}
                    value={budgetEstime}
                    onChange={(e) => setBudgetEstime(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Motif de la demande *</label>
                <textarea
                  rows={2}
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                  placeholder="Ex: Renfort sur le module PostgreSQL et refonte du socle SIRH"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Justification opérationnelle *</label>
                <textarea
                  rows={2}
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Ex: Augmentation de 30% des demandes de fonctionnalités, saturation des capacités actuelles"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="soumettre"
                  checked={soumettreDirect}
                  onChange={(e) => setSoumettreDirect(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <label htmlFor="soumettre" className="text-slate-700">
                  Soumettre immédiatement pour approbation RH (sinon conserver en brouillon)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white font-medium rounded-lg transition-colors shadow-xs"
                  style={{ backgroundColor: currentTheme.primaryColor }}
                >
                  {soumettreDirect ? 'Soumettre au circuit d’approbation' : 'Enregistrer brouillon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL : Détail & Validation d'une Demande */}
      {selectedDemande && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono text-slate-500">{selectedDemande.numero}</span>
                <h3 className="text-base font-bold text-slate-900">
                  Fiche de Demande de Recrutement
                </h3>
              </div>
              <button
                onClick={() => setSelectedDemande(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {actionError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
                  {actionError}
                </div>
              )}

              {/* Summary card */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Demandeur :</span>
                  <span className="font-semibold text-slate-900">{selectedDemande.demandeur_nom}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Budget prévu :</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {selectedDemande.budget_estime.toLocaleString('fr-FR')} Ar
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Statut :</span>
                  <span className="font-semibold text-indigo-700">{selectedDemande.statut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Étape en cours :</span>
                  <span className="font-semibold text-slate-900">
                    {selectedDemande.etape_validation_actuelle}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <p className="font-medium text-slate-800">Motif :</p>
                  <p className="text-slate-600 mt-0.5">{selectedDemande.motif}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-800">Justification :</p>
                  <p className="text-slate-600 mt-0.5">{selectedDemande.justification}</p>
                </div>
              </div>

              {/* Circuit Progression Visualizer */}
              <div>
                <p className="font-semibold text-slate-900 mb-2">
                  Circuit Séquentiel d'Approbation :
                </p>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                  <div
                    className={`p-2 rounded-lg border ${
                      selectedDemande.statut !== 'BROUILLON'
                        ? 'bg-blue-50 border-blue-200 text-blue-800 font-medium'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    1. Soumission
                  </div>
                  <div
                    className={`p-2 rounded-lg border ${
                      ['VALIDEE_RH', 'VALIDEE_FINANCE', 'VALIDEE_DIRECTION', 'OUVERTE'].includes(
                        selectedDemande.statut
                      )
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium'
                        : selectedDemande.etape_validation_actuelle === 'RH'
                        ? 'bg-amber-50 border-amber-200 text-amber-800 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    2. Direction RH
                  </div>
                  <div
                    className={`p-2 rounded-lg border ${
                      ['VALIDEE_FINANCE', 'VALIDEE_DIRECTION', 'OUVERTE'].includes(selectedDemande.statut)
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium'
                        : selectedDemande.etape_validation_actuelle === 'FINANCE'
                        ? 'bg-amber-50 border-amber-200 text-amber-800 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    3. Direction Finance
                  </div>
                  <div
                    className={`p-2 rounded-lg border ${
                      selectedDemande.statut === 'OUVERTE'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                        : selectedDemande.etape_validation_actuelle === 'DIRECTION'
                        ? 'bg-amber-50 border-amber-200 text-amber-800 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    4. Direction Générale
                  </div>
                </div>
              </div>

              {/* Historique des avis émis */}
              {selectedDemande.validations.length > 0 && (
                <div>
                  <p className="font-semibold text-slate-900 mb-1.5">Historique des Validations :</p>
                  <div className="space-y-2">
                    {selectedDemande.validations.map((val) => (
                      <div
                        key={val.id}
                        className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between"
                      >
                        <div>
                          <div className="font-semibold text-slate-800">{val.valideur_nom}</div>
                          <div className="text-slate-600 mt-0.5">{val.commentaire || 'Aucun commentaire'}</div>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {val.decision}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Form if user is allowed to validate */}
              {canUserValidate(selectedDemande) && selectedDemande.etape_validation_actuelle !== 'CLOTURE' && (
                <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-3">
                  <p className="font-bold text-slate-900">
                    Statuer pour l’étape en cours ({selectedDemande.etape_validation_actuelle}) :
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setValidationDecision('VALIDER')}
                      className={`p-2 rounded-lg border text-xs font-semibold transition-colors ${
                        validationDecision === 'VALIDER'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      ✓ Approuver
                    </button>
                    <button
                      type="button"
                      onClick={() => setValidationDecision('RENVOYER')}
                      className={`p-2 rounded-lg border text-xs font-semibold transition-colors ${
                        validationDecision === 'RENVOYER'
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      ↺ Renvoyer (À réviser)
                    </button>
                    <button
                      type="button"
                      onClick={() => setValidationDecision('METTRE_EN_ATTENTE')}
                      className={`p-2 rounded-lg border text-xs font-semibold transition-colors ${
                        validationDecision === 'METTRE_EN_ATTENTE'
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      ⏸ Mettre en attente
                    </button>
                    <button
                      type="button"
                      onClick={() => setValidationDecision('REJETER')}
                      className={`p-2 rounded-lg border text-xs font-semibold transition-colors ${
                        validationDecision === 'REJETER'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      ✕ Rejeter
                    </button>
                  </div>

                  {validationDecision === 'METTRE_EN_ATTENTE' && (
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Date de réexamen du budget :
                      </label>
                      <input
                        type="date"
                        value={dateReexamen}
                        onChange={(e) => setDateReexamen(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Commentaire explicatif ou motif de décision :
                    </label>
                    <textarea
                      rows={2}
                      value={validationComment}
                      onChange={(e) => setValidationComment(e.target.value)}
                      placeholder={
                        validationDecision === 'VALIDER'
                          ? 'Observations éventuelles...'
                          : 'Précisez obligatoirement le motif...'
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                      required={validationDecision !== 'VALIDER'}
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => handleValiderDecision(selectedDemande.id)}
                      className="px-4 py-2 text-white font-medium rounded-lg transition-colors shadow-xs"
                      style={{ backgroundColor: currentTheme.primaryColor }}
                    >
                      Enregistrer la décision ({validationDecision})
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL : Publication d'une Offre d'Emploi issue d'un Besoin Validé */}
      {demandeToPublish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Demande Validée · {demandeToPublish.numero}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Publier l'Offre de Recrutement
                </h3>
              </div>
              <button
                onClick={() => setDemandeToPublish(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmPublish} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Intitulé public de l'offre *
                </label>
                <input
                  type="text"
                  value={publishTitre}
                  onChange={(e) => setPublishTitre(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Lieu d'affectation *</label>
                  <input
                    type="text"
                    value={publishLieu}
                    onChange={(e) => setPublishLieu(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Date limite de candidature *</label>
                  <input
                    type="date"
                    value={publishDateCloture}
                    onChange={(e) => setPublishDateCloture(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Missions principales *</label>
                <textarea
                  rows={3}
                  value={publishMissions}
                  onChange={(e) => setPublishMissions(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Profil recherché & Compétences *</label>
                <textarea
                  rows={3}
                  value={publishProfil}
                  onChange={(e) => setPublishProfil(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              {/* Rémunération proposée sur l'offre */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-emerald-50/60 p-3 rounded-lg border border-emerald-200/80">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Salaire minimum (Ar / mois) *
                  </label>
                  <input
                    type="number"
                    step="10000"
                    value={publishSalaireMin}
                    onChange={(e) => setPublishSalaireMin(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono font-semibold text-slate-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Salaire maximum (Ar / mois) *
                  </label>
                  <input
                    type="number"
                    step="10000"
                    value={publishSalaireMax}
                    onChange={(e) => setPublishSalaireMax(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono font-semibold text-emerald-800 bg-white"
                    required
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Aligné par défaut sur le budget validé ({demandeToPublish.budget_estime.toLocaleString('fr-FR')} Ar)
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-600 flex items-center justify-between text-[11px]">
                <span>Contrat : <strong className="text-slate-900">{demandeToPublish.type_contrat_souhaite}</strong></span>
                <span>Postes : <strong className="text-slate-900">{demandeToPublish.nombre_postes}</strong></span>
                <span>Budget initial : <strong className="text-slate-900 font-mono">{demandeToPublish.budget_estime.toLocaleString('fr-FR')} Ar</strong></span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDemandeToPublish(null)}
                  className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Confirmer et Publier l'Offre ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
