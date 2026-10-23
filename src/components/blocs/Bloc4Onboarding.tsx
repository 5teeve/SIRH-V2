/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Rocket,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileSignature,
  FileText,
  ShieldCheck,
  RefreshCw,
  Plus,
  Send,
  UserCheck,
  Briefcase,
  Layers,
  Sparkles
} from 'lucide-react';
import { SirhState, sirhStore } from '../../store/sirhStore';
import { TacheResponsable, TacheStatut, Contrat, Onboarding } from '../../types/sirh';
import { useTheme } from '../../theme/themeContext';

interface Bloc4OnboardingProps {
  state: SirhState;
}

export const Bloc4Onboarding: React.FC<Bloc4OnboardingProps> = ({ state }) => {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'onboarding' | 'contrats' | 'alertes' | 'pieces'>('onboarding');
  const [filterResponsable, setFilterResponsable] = useState<string>('ALL');
  const [selectedOnboarding, setSelectedOnboarding] = useState<Onboarding | null>(
    state.onboardings[0] || null
  );

  // Contract Signature simulation modal
  const [showSignModal, setShowSignModal] = useState(false);
  const [contractToSign, setContractToSign] = useState<Contrat | null>(null);

  // Contract Renewal Modal
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [renewalContractId, setRenewalContractId] = useState<string>('');
  const [renewalType, setRenewalType] = useState<'CDI' | 'CDD'>('CDI');
  const [renewalRemun, setRenewalRemun] = useState(5200000);
  const [renewalDateDebut, setRenewalDateDebut] = useState('2027-02-15');

  const handleSignerContrat = () => {
    if (!contractToSign) return;
    try {
      sirhStore.signerContrat(contractToSign.id);
      setShowSignModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleValiderContrat = (contratId: string) => {
    try {
      sirhStore.validerContrat(contratId);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleTache = (tacheId: string, currentStatut: TacheStatut) => {
    const nextStatut: TacheStatut = currentStatut === 'FAIT' ? 'EN_COURS' : 'FAIT';
    try {
      sirhStore.majTacheOnboarding(tacheId, nextStatut);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRenouvelerContrat = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      sirhStore.renouvelerContrat(renewalContractId, {
        type_contrat: renewalType,
        date_debut: renewalDateDebut,
        remuneration_base: renewalRemun,
      });
      setShowRenewalModal(false);
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
            Contrats & Parcours Onboarding Collaborateurs
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Génération des matricules collaborateurs, checklists d’intégration par service, alertes d’échéances et conformité des dossiers.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveTab('onboarding')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'onboarding'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Checklist d'Intégration ({state.onboardings.length})
          </button>
          <button
            onClick={() => setActiveTab('contrats')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'contrats'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Gestion des Contrats ({state.contrats.length})
          </button>
          <button
            onClick={() => setActiveTab('pieces')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'pieces'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pièces du Dossier ({state.piecesDossiers.length})
          </button>
          <button
            onClick={() => setActiveTab('alertes')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'alertes'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Alertes Fins d'Essai & CDD
          </button>
        </div>
      </div>

      {/* TAB 1 : ONBOARDING CHECKLIST */}
      {activeTab === 'onboarding' && (
        <div className="space-y-6">
          {state.onboardings.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
              Aucun parcours d'onboarding actif. Le parcours est automatiquement créé dès l'acceptation d'une proposition d'embauche.
            </div>
          ) : (
            state.onboardings.map((onb) => {
              const employe = state.employes.find((e) => e.id === onb.employe_id);
              const contrat = state.contrats.find((c) => c.id === onb.contrat_id);

              const tachesFiltrees = onb.taches.filter((t) => {
                if (filterResponsable === 'ALL') return true;
                return t.responsable === filterResponsable;
              });

              return (
                <div
                  key={onb.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6"
                >
                  {/* Onboarding Header with Progress Bar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          Intégration de {employe?.prenom} {employe?.nom}
                        </h3>
                        {employe?.matricule && (
                          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded">
                            {employe.matricule}
                          </span>
                        )}
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded font-bold ${
                            onb.statut === 'COMPLETE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {onb.statut}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Date d'effet : {onb.date_debut} · Contrat : {contrat?.numero} ({contrat?.type_contrat})
                      </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="w-full md:w-64 space-y-1">
                      <div className="flex justify-between text-xs font-mono font-semibold">
                        <span className="text-slate-600">Avancement Global</span>
                        <span className="text-slate-900">{onb.taux_avancement}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${onb.taux_avancement}%`,
                            backgroundColor: currentTheme.primaryColor,
                          }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Clôture conditionnée à l'accomplissement des tâches obligatoires.
                      </div>
                    </div>
                  </div>

                  {/* Filter by Role / Team */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-slate-500">Filtrer par service responsable :</span>
                    {(['ALL', 'RH', 'IT', 'LOGISTIQUE', 'PAIE', 'MANAGER'] as const).map((resp) => (
                      <button
                        key={resp}
                        onClick={() => setFilterResponsable(resp)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                          filterResponsable === resp
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {resp === 'ALL' ? 'Tous les services' : resp}
                      </button>
                    ))}
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-2.5">
                    {tachesFiltrees.map((tache) => {
                      const isFait = tache.statut === 'FAIT';

                      return (
                        <div
                          key={tache.id}
                          className={`p-3.5 rounded-xl border flex items-start justify-between gap-4 transition-all ${
                            isFait
                              ? 'bg-emerald-50/40 border-emerald-200 text-slate-600'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => handleToggleTache(tache.id, tache.statut)}
                              className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                isFait
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'border-slate-300 hover:border-slate-400 bg-white'
                              }`}
                            >
                              {isFait && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </button>

                            <div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-xs font-bold ${
                                    isFait ? 'line-through text-slate-500' : 'text-slate-900'
                                  }`}
                                >
                                  {tache.titre}
                                </span>
                                {tache.obligatoire && (
                                  <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">
                                    Requis
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                                {tache.description}
                              </p>
                              {tache.commentaire_execution && (
                                <p className="text-[10px] text-emerald-700 italic mt-1 font-mono">
                                  ✓ {tache.commentaire_execution}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                              {tache.responsable}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              Échéance : {tache.date_echeance}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2 : GESTION DES CONTRATS */}
      {activeTab === 'contrats' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Cycle de Vie des Contrats de Travail
            </h3>
            <p className="text-xs text-slate-500">
              Circuit de signature, validation administrative et gestion des renouvellements.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="py-3 px-4">N° Contrat</th>
                  <th className="py-3 px-4">Salarié</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Rémunération Brute</th>
                  <th className="py-3 px-4">Période</th>
                  <th className="py-3 px-4">Fin d'Essai</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {state.contrats.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      Aucun contrat créé. Acceptez une proposition d'embauche pour générer le contrat initial.
                    </td>
                  </tr>
                ) : (
                  state.contrats.map((ctr) => {
                    const emp = state.employes.find((e) => e.id === ctr.employe_id);

                    return (
                      <tr key={ctr.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{ctr.numero}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">{emp?.prenom} {emp?.nom}</div>
                          <div className="font-mono text-[11px] text-slate-500">
                            {emp?.matricule || '(Matricule généré à la signature)'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">{ctr.type_contrat}</td>
                        <td className="py-3.5 px-4 font-mono">
                          {ctr.remuneration_base.toLocaleString('fr-FR')} Ar
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          Du {ctr.date_debut} {ctr.date_fin ? `au ${ctr.date_fin}` : '(Indéterminée)'}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-amber-700 font-medium">
                          {ctr.periode_essai_fin || 'N/A'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              ctr.statut === 'VALIDE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ctr.statut === 'SIGNE'
                                ? 'bg-indigo-100 text-indigo-800'
                                : ctr.statut === 'RENOUVELE'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {ctr.statut}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {ctr.statut === 'CREE' && (
                              <button
                                onClick={() => {
                                  setContractToSign(ctr);
                                  setShowSignModal(true);
                                }}
                                className="px-2.5 py-1 text-white rounded text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-xs"
                                style={{ backgroundColor: currentTheme.primaryColor }}
                              >
                                <FileSignature className="w-3.5 h-3.5" />
                                <span>Signer & Générer Matricule</span>
                              </button>
                            )}

                            {ctr.statut === 'SIGNE' && (
                              <button
                                onClick={() => handleValiderContrat(ctr.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors"
                              >
                                ✓ Valider Contrat RH
                              </button>
                            )}

                            {ctr.statut === 'VALIDE' && (
                              <button
                                onClick={() => {
                                  setRenewalContractId(ctr.id);
                                  setShowRenewalModal(true);
                                }}
                                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-medium transition-colors"
                              >
                                + Renouveler / Avenant
                              </button>
                            )}
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
      )}

      {/* TAB 3 : PIÈCES DU DOSSIER */}
      {activeTab === 'pieces' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Contrôle de Conformité des Pièces Justificatives
            </h3>
            <p className="text-xs text-slate-500">
              Vérification des pièces administratives : Carte d'identité, diplômes, RIB et certificat médical.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="py-3 px-4">Salarié</th>
                  <th className="py-3 px-4">Document / Pièce</th>
                  <th className="py-3 px-4">Caractère Requis</th>
                  <th className="py-3 px-4">Date de Réception</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Validation RH</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {state.piecesDossiers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Aucune pièce enregistrée. Les pièces obligatoires sont générées à l’embauche.
                    </td>
                  </tr>
                ) : (
                  state.piecesDossiers.map((piece) => {
                    const emp = state.employes.find((e) => e.id === piece.employe_id);

                    return (
                      <tr key={piece.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {emp?.prenom} {emp?.nom} ({emp?.matricule || 'Nouveau'})
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800">{piece.libelle}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{piece.type_piece}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          {piece.obligatoire ? (
                            <span className="text-rose-600 font-semibold">Obligatoire</span>
                          ) : (
                            <span className="text-slate-400">Optionnel</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono">{piece.date_reception || 'En attente de transmission'}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              piece.statut === 'VALIDE'
                                ? 'bg-emerald-50 text-emerald-700'
                                : piece.statut === 'RECU'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {piece.statut}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {piece.statut !== 'VALIDE' && (
                            <button
                              onClick={() => sirhStore.validerPieceDossier(piece.id, 'VALIDE')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-medium transition-colors"
                            >
                              ✓ Valider Document
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4 : ALERTES ÉCHÉANCES */}
      {activeTab === 'alertes' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Tableau de Bord des Échéances Juridiques
            </h3>
            <p className="text-xs text-slate-500">
              Suivi proactif des fins de période d’essai et des échéances de contrats à durée déterminée.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Périodes d'Essai en Cours</span>
              </div>
              <p className="text-xs text-slate-600">
                {state.contrats.filter((c) => c.periode_essai_fin).length} collaborateur(s) sous période probatoire. Notification transmise 15 jours avant terme.
              </p>
              <div className="pt-2 text-xs font-mono text-slate-800">
                Exemple suivi : Contrat CTR-2026-0001 (Fin d'essai : 15 Février 2027)
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                <RefreshCw className="w-4 h-4 text-slate-700" />
                <span>Plafond de Renouvellement des CDD</span>
              </div>
              <p className="text-xs text-slate-600">
                Règle de conformité : 2 renouvellements maximum avant requalification obligatoire en contrat indéterminé (CDI).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL : Signature du contrat (Attribution matricule) */}
      {showSignModal && contractToSign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Signature Officielle & Attribution du Matricule
              </h3>
              <button onClick={() => setShowSignModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 space-y-1">
                <p className="font-bold">Attribution du matricule salarié :</p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Le matricule unique officiel (ex : <code>EMP-2026-0043</code>) est généré de manière séquentielle et pérenne dès la signature du contrat.
                </p>
              </div>

              <div className="space-y-1 text-slate-700">
                <div>Contrat : <strong className="font-mono">{contractToSign.numero}</strong></div>
                <div>Rémunération mensuelle brute : <strong className="font-mono">{contractToSign.remuneration_base.toLocaleString()} Ar</strong></div>
                <div>Date de prise d'effet : <strong>{contractToSign.date_debut}</strong></div>
              </div>

              <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl text-center bg-slate-50">
                <FileSignature className="w-8 h-8 text-slate-700 mx-auto mb-1" />
                <span className="font-semibold text-slate-800">Certificat de Signature Électronique Certifié</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Horodatage sécurisé</p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSignModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSignerContrat}
                  className="px-4 py-2 text-white font-semibold rounded-lg transition-colors shadow-xs"
                  style={{ backgroundColor: currentTheme.primaryColor }}
                >
                  Signer & Attribuer Matricule ➔
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL : Renouvellement ou Avenant */}
      {showRenewalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Renouvellement ou Avenant de Contrat
              </h3>
              <button onClick={() => setShowRenewalModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleRenouvelerContrat} className="mt-4 space-y-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nouveau type de contrat *</label>
                <select
                  value={renewalType}
                  onChange={(e) => setRenewalType(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="CDI">Passage en CDI (Pérénisation)</option>
                  <option value="CDD">Renouvellement CDD</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Nouvelle rémunération mensuelle brute *</label>
                <input
                  type="number"
                  step={100000}
                  value={renewalRemun}
                  onChange={(e) => setRenewalRemun(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Date d'effet du nouveau contrat *</label>
                <input
                  type="date"
                  value={renewalDateDebut}
                  onChange={(e) => setRenewalDateDebut(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRenewalModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white font-semibold rounded-lg transition-colors shadow-xs"
                  style={{ backgroundColor: currentTheme.primaryColor }}
                >
                  Créer le Nouveau Contrat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
