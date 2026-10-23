/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Plus,
  Eye,
  Star,
  FileText,
  UserCheck,
  Send,
  Building,
  Filter,
  Check,
  Clock
} from 'lucide-react';
import { SirhState, sirhStore } from '../../store/sirhStore';
import { OffreEmploi, Candidature, Entretien, Evaluation, EntretienType } from '../../types/sirh';
import { useTheme } from '../../theme/themeContext';

interface Bloc2RecrutementProps {
  state: SirhState;
  onNavigateToBloc3?: (candidatureId: string) => void;
}

export const Bloc2Recrutement: React.FC<Bloc2RecrutementProps> = ({ state, onNavigateToBloc3 }) => {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'offres' | 'candidatures' | 'entretiens'>('offres');
  const [selectedOffre, setSelectedOffre] = useState<OffreEmploi | null>(null);
  const [selectedCandidature, setSelectedCandidature] = useState<Candidature | null>(null);

  // Modals
  const [showPlanifModal, setShowPlanifModal] = useState(false);
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedDemandeToPublish, setSelectedDemandeToPublish] = useState<string>('');
  const [selectedEntretienForEval, setSelectedEntretienForEval] = useState<Entretien | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Planification Form
  const [planifType, setPlanifType] = useState<EntretienType>('ENTRETIEN_TECHNIQUE');
  const [planifDate, setPlanifDate] = useState('2026-11-02');
  const [planifHeureDebut, setPlanifHeureDebut] = useState('10:00');
  const [planifHeureFin, setPlanifHeureFin] = useState('11:30');
  const [planifSalle, setPlanifSalle] = useState('Salle Turing — Siège Ankorondrano');
  const [planifParticipantId, setPlanifParticipantId] = useState(state.users[1]?.id || '');

  // Evaluation Form
  const [recommandation, setRecommandation] = useState<'FAVORABLE' | 'RESERVE' | 'DEFAVORABLE'>('FAVORABLE');
  const [pointsForts, setPointsForts] = useState('');
  const [pointsAmelioration, setPointsAmelioration] = useState('');
  const [commentaireGeneral, setCommentaireGeneral] = useState('');
  const [note1, setNote1] = useState(4.5);
  const [note2, setNote2] = useState(4.0);
  const [note3, setNote3] = useState(4.5);

  const handlePlanifierEntretien = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidature) return;
    setActionError(null);

    const startIso = new Date(`${planifDate}T${planifHeureDebut}:00`).toISOString();
    const endIso = new Date(`${planifDate}T${planifHeureFin}:00`).toISOString();

    try {
      sirhStore.planifierEntretien({
        candidature_id: selectedCandidature.id,
        type: planifType,
        date_heure_debut: startIso,
        date_heure_fin: endIso,
        salle_ou_lien: planifSalle,
        participants_ids: [planifParticipantId],
      });
      setShowPlanifModal(false);
    } catch (err: any) {
      setActionError(err.message || 'Erreur lors de la planification');
    }
  };

  const handleEvaluerEntretien = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntretienForEval) return;
    setActionError(null);

    try {
      sirhStore.evaluerEntretien({
        entretien_id: selectedEntretienForEval.id,
        recommandation,
        points_forts: pointsForts,
        points_amelioration: pointsAmelioration,
        commentaire_general: commentaireGeneral,
        notes: [
          { critere_id: 'crit-tech', libelle: 'Compétences Techniques & PostgreSQL', note: note1, ponderation: 3 },
          { critere_id: 'crit-arch', libelle: 'Architecture Logicielle & Code', note: note2, ponderation: 2 },
          { critere_id: 'crit-soft', libelle: 'Communication & Culture d’entreprise', note: note3, ponderation: 2 },
        ],
        verrouiller: true,
      });
      setShowEvalModal(false);
    } catch (err: any) {
      setActionError(err.message || 'Erreur lors de l’évaluation');
    }
  };

  const handlePreselectionner = (candidatureId: string, retenu: boolean) => {
    try {
      sirhStore.preselectionnerCandidature(
        candidatureId,
        retenu ? 85 : 45,
        retenu,
        retenu ? 'Dossier pré-sélectionné pour entretien' : 'Profil non conforme aux exigences'
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeciderFinale = (candidatureId: string, retenu: boolean) => {
    try {
      sirhStore.deciderCandidature(
        candidatureId,
        retenu ? 'RETENUE' : 'REFUSEE',
        retenu ? 1 : undefined,
        retenu ? 'Candidat retenu après consolidation des évaluations' : 'Candidature non retenue'
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Recrutement & Gestion des Candidatures
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Offres d'emploi en ligne, vivier des talents, planification d'entretiens sans conflit et grilles d'évaluation certifiées.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveTab('offres')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'offres'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Offres d'emploi ({state.offres.length})
          </button>
          <button
            onClick={() => setActiveTab('candidatures')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'candidatures'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Candidatures ({state.candidatures.length})
          </button>
          <button
            onClick={() => setActiveTab('entretiens')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'entretiens'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Entretiens & Évaluations ({state.entretiens.length})
          </button>
        </div>
      </div>

      {/* TAB 1 : OFFRES D'EMPLOI */}
      {activeTab === 'offres' && (() => {
        const demandesOuvertesSansOffre = state.demandes.filter(
          (d) => d.statut === 'OUVERTE' && !state.offres.some((o) => o.demande_id === d.id)
        );

        return (
          <div className="space-y-4">
            {/* Action Bar & Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Catalogue des Offres ({state.offres.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Offres actives, candidatures reçues et suivi du vivier de recrutement.
                </p>
              </div>

              {demandesOuvertesSansOffre.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedDemandeToPublish(demandesOuvertesSansOffre[0]?.id || '');
                    setShowPublishModal(true);
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publier un Besoin Validé ({demandesOuvertesSansOffre.length})</span>
                </button>
              )}
            </div>

            {/* Banner if open requests are waiting */}
            {demandesOuvertesSansOffre.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {demandesOuvertesSansOffre.length}
                  </div>
                  <div className="text-xs text-emerald-900">
                    <strong>Nouveau besoin validé par la Direction !</strong> La demande{' '}
                    <span className="font-mono font-semibold">{demandesOuvertesSansOffre[0]?.numero}</span> est approuvée et prête pour publication.
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedDemandeToPublish(demandesOuvertesSansOffre[0]?.id || '');
                    setShowPublishModal(true);
                  }}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline whitespace-nowrap"
                >
                  Publier l'offre maintenant →
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.offres.map((offre) => {
            const candidaturesAssociees = state.candidatures.filter((c) => c.offre_id === offre.id);

            return (
              <div
                key={offre.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-500">{offre.reference}</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                        offre.statut === 'PUBLIEE'
                          ? 'bg-emerald-50 text-emerald-700'
                          : offre.statut === 'POURVUE'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {offre.statut}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-2 line-clamp-1">{offre.titre}</h3>

                  <div className="mt-2 text-xs text-slate-500 space-y-1">
                    <div>Type de contrat : <span className="font-semibold text-slate-700">{offre.type_contrat}</span></div>
                    <div>Lieu : <span className="text-slate-700">{offre.lieu}</span></div>
                    <div>
                      Postes à pourvoir :{' '}
                      <span className="font-mono font-semibold text-slate-900">
                        {offre.postes_pourvus} / {offre.nombre_postes}
                      </span>
                    </div>
                  </div>

                  {/* Competences */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {offre.competences_requises.slice(0, 4).map((c, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    <strong className="font-mono text-slate-900">{candidaturesAssociees.length}</strong>{' '}
                    candidature(s)
                  </span>

                  <button
                    onClick={() => {
                      setSelectedOffre(offre);
                      setActiveTab('candidatures');
                    }}
                    className="font-semibold transition-colors"
                    style={{ color: currentTheme.accentColor }}
                  >
                    Voir candidatures →
                  </button>
                </div>
              </div>
            );
          })}
            </div>
          </div>
        );
      })()}

      {/* TAB 2 : CANDIDATURES */}
      {activeTab === 'candidatures' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Suivi des Candidatures & Présélection des Profils
              </h3>
              <p className="text-xs text-slate-500">
                Gestion des viviers de talents, grilles d’analyse et passage en phase d’entretien.
              </p>
            </div>

            {selectedOffre && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">Filtré pour l'offre : {selectedOffre.reference}</span>
                <button
                  onClick={() => setSelectedOffre(null)}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  (Réinitialiser)
                </button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="py-3 px-4">Réf Candidature</th>
                  <th className="py-3 px-4">Candidat</th>
                  <th className="py-3 px-4">Offre visée</th>
                  <th className="py-3 px-4">Score Correspondance</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Actions Workflow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {state.candidatures
                  .filter((c) => (selectedOffre ? c.offre_id === selectedOffre.id : true))
                  .map((cand) => {
                    const candidat = state.candidats.find((c) => c.id === cand.candidat_id);
                    const offre = state.offres.find((o) => o.id === cand.offre_id);

                    return (
                      <tr key={cand.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                          {cand.numero}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">
                            {candidat ? `${candidat.prenom} ${candidat.nom}` : 'Candidat'}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {candidat?.email} · {candidat?.telephone}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-slate-900 font-medium">{offre?.titre}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{offre?.reference}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          {cand.score_preselection ? (
                            <span className="font-semibold text-slate-900">
                              {cand.score_preselection}/100
                            </span>
                          ) : (
                            <span className="text-slate-400">Non évalué</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                            {cand.statut}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {cand.statut === 'RECUE' && (
                              <>
                                <button
                                  onClick={() => handlePreselectionner(cand.id, true)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-medium transition-colors"
                                >
                                  ✓ Présélectionner
                                </button>
                                <button
                                  onClick={() => handlePreselectionner(cand.id, false)}
                                  className="px-2 py-1 text-rose-600 hover:bg-rose-50 rounded text-[11px]"
                                >
                                  ✕ Refuser
                                </button>
                              </>
                            )}

                            {['PRESELECTIONNEE', 'EN_ENTRETIEN', 'EN_TEST'].includes(cand.statut) && (
                              <button
                                onClick={() => {
                                  setSelectedCandidature(cand);
                                  setShowPlanifModal(true);
                                }}
                                className="px-2.5 py-1 text-white rounded text-[11px] font-medium transition-colors"
                                style={{ backgroundColor: currentTheme.primaryColor }}
                              >
                                + Planifier Entretien
                              </button>
                            )}

                            {['EN_ENTRETIEN', 'EN_TEST'].includes(cand.statut) && (
                              <button
                                onClick={() => handleDeciderFinale(cand.id, true)}
                                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-medium transition-colors"
                              >
                                Retenir Candidat
                              </button>
                            )}

                            {cand.statut === 'RETENUE' && (
                              <button
                                onClick={() => onNavigateToBloc3 && onNavigateToBloc3(cand.id)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors"
                              >
                                Émettre Proposition d'Embauche ➔
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3 : ENTRETIENS ET ÉVALUATIONS */}
      {activeTab === 'entretiens' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Entretiens Planifiés & Grilles de Notation Certifiées
            </h3>
            <p className="text-xs text-slate-500">
              Contrôle automatique de disponibilité des salles et des intervieweurs. Les évaluations validées sont définitivement scellées.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Candidat</th>
                  <th className="py-3 px-4">Date & Horaire</th>
                  <th className="py-3 px-4">Salle / Lien</th>
                  <th className="py-3 px-4">Évaluateur</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Évaluation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {state.entretiens.map((ent) => {
                  const cand = state.candidatures.find((c) => c.id === ent.candidature_id);
                  const candidat = cand ? state.candidats.find((c) => c.id === cand.candidat_id) : null;
                  const evaluation = state.evaluations.find((e) => e.entretien_id === ent.id);
                  const participant = state.users.find((u) => ent.participants_ids.includes(u.id));

                  return (
                    <tr key={ent.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {ent.type.replace('_', ' ')}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">
                          {candidat ? `${candidat.prenom} ${candidat.nom}` : ''}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">{cand?.numero}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <div>{new Date(ent.date_heure_debut).toLocaleDateString('fr-FR')}</div>
                        <div className="text-[11px] text-slate-500">
                          {new Date(ent.date_heure_debut).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          –{' '}
                          {new Date(ent.date_heure_fin).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">{ent.salle_ou_lien}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {participant ? `${participant.prenom} ${participant.nom}` : 'RH'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-700">
                          {ent.statut}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {evaluation ? (
                          <div className="text-right">
                            <span className="font-mono font-bold text-slate-900 text-xs">
                              {evaluation.note_moyenne_ponderee}/5
                            </span>
                            <div className="text-[10px] text-slate-500 font-medium">
                              Avis : {evaluation.recommandation} (Verrouillée)
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedEntretienForEval(ent);
                              setShowEvalModal(true);
                            }}
                            className="px-2.5 py-1 text-white rounded text-[11px] font-semibold transition-colors"
                            style={{ backgroundColor: currentTheme.primaryColor }}
                          >
                            Évaluer & Noter
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL : Planification Entretien */}
      {showPlanifModal && selectedCandidature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Planifier un Entretien ou Test
              </h3>
              <button onClick={() => setShowPlanifModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handlePlanifierEntretien} className="mt-4 space-y-4 text-xs">
              {actionError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
                  {actionError}
                </div>
              )}

              <div>
                <label className="block font-medium text-slate-700 mb-1">Type d'évaluation *</label>
                <select
                  value={planifType}
                  onChange={(e) => setPlanifType(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="ENTRETIEN_RH">Entretien RH (Personnalité & Soft Skills)</option>
                  <option value="ENTRETIEN_TECHNIQUE">Entretien Technique avec Manager</option>
                  <option value="TEST_ECRIT">Test Écrit</option>
                  <option value="TEST_PRATIQUE">Test Pratique / Live Coding SQL</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={planifDate}
                  onChange={(e) => setPlanifDate(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Heure de début *</label>
                  <input
                    type="time"
                    value={planifHeureDebut}
                    onChange={(e) => setPlanifHeureDebut(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Heure de fin *</label>
                  <input
                    type="time"
                    value={planifHeureFin}
                    onChange={(e) => setPlanifHeureFin(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Salle physique ou lien visio * (Vérification temps réel des créneaux)
                </label>
                <select
                  value={planifSalle}
                  onChange={(e) => setPlanifSalle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Salle Turing — Siège Ankorondrano">Salle Turing — Siège Ankorondrano</option>
                  <option value="Salle Lovelace — Siège Ankorondrano">Salle Lovelace — Siège Ankorondrano</option>
                  <option value="Lounge Recrutement RH — Box 1">Lounge Recrutement RH — Box 1</option>
                  <option value="Google Meet (Visioconférence)">Google Meet (Visioconférence)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Intervieweur principal *
                </label>
                <select
                  value={planifParticipantId}
                  onChange={(e) => setPlanifParticipantId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  {state.users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.prenom} {u.nom} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPlanifModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white font-semibold rounded-lg transition-colors shadow-xs"
                  style={{ backgroundColor: currentTheme.primaryColor }}
                >
                  Confirmer la réservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL : Évaluation et Notation */}
      {showEvalModal && selectedEntretienForEval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Grille d'Évaluation & Recommandation
              </h3>
              <button onClick={() => setShowEvalModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleEvaluerEntretien} className="mt-4 space-y-4 text-xs">
              <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <p className="font-semibold text-slate-900">Critères Pondérés (sur 5) :</p>

                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Compétences Techniques & SQL (Poids 3)</span>
                  <input
                    type="number"
                    step={0.5}
                    min={0}
                    max={5}
                    value={note1}
                    onChange={(e) => setNote1(Number(e.target.value))}
                    className="w-16 p-1 border rounded text-center font-mono font-bold"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Architecture & Conception (Poids 2)</span>
                  <input
                    type="number"
                    step={0.5}
                    min={0}
                    max={5}
                    value={note2}
                    onChange={(e) => setNote2(Number(e.target.value))}
                    className="w-16 p-1 border rounded text-center font-mono font-bold"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Soft Skills & Communication (Poids 2)</span>
                  <input
                    type="number"
                    step={0.5}
                    min={0}
                    max={5}
                    value={note3}
                    onChange={(e) => setNote3(Number(e.target.value))}
                    className="w-16 p-1 border rounded text-center font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Avis du Jury *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRecommandation('FAVORABLE')}
                    className={`p-2 rounded-lg border text-center font-semibold transition-colors ${
                      recommandation === 'FAVORABLE'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    Favorable
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecommandation('RESERVE')}
                    className={`p-2 rounded-lg border text-center font-semibold transition-colors ${
                      recommandation === 'RESERVE'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    Avec Réserve
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecommandation('DEFAVORABLE')}
                    className={`p-2 rounded-lg border text-center font-semibold transition-colors ${
                      recommandation === 'DEFAVORABLE'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    Défavorable
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Points forts constatés :</label>
                <textarea
                  rows={2}
                  value={pointsForts}
                  onChange={(e) => setPointsForts(e.target.value)}
                  placeholder="Ex: Excellente autonomie, rigueur sur les bases de données..."
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Axes de progression :</label>
                <textarea
                  rows={2}
                  value={pointsAmelioration}
                  onChange={(e) => setPointsAmelioration(e.target.value)}
                  placeholder="Ex: Approfondir Kubernetes..."
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Avis motivé :</label>
                <textarea
                  rows={2}
                  value={commentaireGeneral}
                  onChange={(e) => setCommentaireGeneral(e.target.value)}
                  placeholder="Synthèse de l’entretien..."
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEvalModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800"
                >
                  Valider et Sceller l'Évaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL : Publier une offre depuis une demande validée */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Publier une Offre d'Emploi (Besoin Validé)
              </h3>
              <button
                onClick={() => setShowPublishModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Sélectionnez la demande de recrutement validée (OUVERTE) :
                </label>
                <select
                  value={selectedDemandeToPublish}
                  onChange={(e) => setSelectedDemandeToPublish(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-xs font-medium"
                >
                  {state.demandes
                    .filter((d) => d.statut === 'OUVERTE')
                    .map((dem) => {
                      const poste = state.postes.find((p) => p.id === dem.poste_id);
                      const dejaPubliee = state.offres.some((o) => o.demande_id === dem.id);
                      return (
                        <option key={dem.id} value={dem.id}>
                          {dem.numero} · {poste?.intitule} ({dem.type_contrat_souhaite}) {dejaPubliee ? '[Déjà publiée]' : '[À publier]'}
                        </option>
                      );
                    })}
                </select>
              </div>

              {(() => {
                const dem = state.demandes.find((d) => d.id === selectedDemandeToPublish);
                const poste = dem ? state.postes.find((p) => p.id === dem.poste_id) : null;
                const dejaPubliee = dem ? state.offres.some((o) => o.demande_id === dem.id) : false;

                if (!dem) return null;

                return (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-slate-600">
                    <div className="font-semibold text-slate-900 text-sm">{poste?.intitule}</div>
                    <div className="text-[11px] text-slate-500">{poste?.description}</div>
                    <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                      <div>Contrat : <strong className="text-slate-800">{dem.type_contrat_souhaite}</strong></div>
                      <div>Postes : <strong className="text-slate-800">{dem.nombre_postes}</strong></div>
                      <div>Budget : <strong className="text-slate-800 font-mono">{dem.budget_estime.toLocaleString('fr-FR')} Ar</strong></div>
                      <div>Urgence : <strong className="text-slate-800">{dem.urgence}</strong></div>
                    </div>

                    {dejaPubliee && (
                      <div className="mt-2 p-2 bg-amber-50 border border-amber-200 text-amber-800 rounded text-[11px]">
                        Attention : Une offre a déjà été créée pour cette demande.
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-3.5 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedDemandeToPublish) return;
                    try {
                      sirhStore.creerOffre(selectedDemandeToPublish, {});
                      setShowPublishModal(false);
                    } catch (err: any) {
                      alert(err.message);
                    }
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Confirmer et Publier l'Offre ➔
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
