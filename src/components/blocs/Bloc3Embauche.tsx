/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileCheck,
  Send,
  RotateCw,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Download,
  AlertCircle,
  Building,
  User,
  ShieldCheck,
  Briefcase,
  FileText
} from 'lucide-react';
import { SirhState, sirhStore } from '../../store/sirhStore';
import { PropositionEmbauche, Employe, Contrat, TypeContrat } from '../../types/sirh';
import { useTheme } from '../../theme/themeContext';

interface Bloc3EmbaucheProps {
  state: SirhState;
  onNavigateToBloc4?: (employeId: string) => void;
}

export const Bloc3Embauche: React.FC<Bloc3EmbaucheProps> = ({ state, onNavigateToBloc4 }) => {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'propositions' | 'salaries' | 'contratPreview'>('propositions');
  const [selectedProposition, setSelectedProposition] = useState<PropositionEmbauche | null>(
    state.propositions[0] || null
  );
  const [selectedEmploye, setSelectedEmploye] = useState<Employe | null>(null);

  // New Proposition Form State
  const [showEmissionModal, setShowEmissionModal] = useState(false);
  const [selectedCandidatureId, setSelectedCandidatureId] = useState(
    state.candidatures.find((c) => c.statut === 'RETENUE')?.id || state.candidatures[0]?.id || ''
  );
  const [remuneration, setRemuneration] = useState(4800000);
  const [typeContrat, setTypeContrat] = useState<TypeContrat>('CDI');
  const [dateDebut, setDateDebut] = useState('2026-11-15');
  const [periodeEssai, setPeriodeEssai] = useState(90);
  const [lieuTravail, setLieuTravail] = useState('Siège Social — Ankorondrano, Antananarivo');
  const [horaires, setHoraires] = useState('40h/semaine (Lundi au Vendredi de 8h à 17h)');
  const [actionError, setActionError] = useState<string | null>(null);

  // Response simulation modal
  const [showReponseModal, setShowReponseModal] = useState(false);
  const [reponseDecision, setReponseDecision] = useState<'ACCEPTEE' | 'NEGOCIATION' | 'REFUSEE'>('ACCEPTEE');
  const [reponseMotif, setReponseMotif] = useState('');

  const handleEmettreProposition = (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    try {
      const prop = sirhStore.emettreProposition(selectedCandidatureId, {
        remuneration_mensuelle: remuneration,
        type_contrat: typeContrat,
        date_debut_prevue: dateDebut,
        periode_essai_jours: periodeEssai,
        horaires_travail: horaires,
        lieu_travail: lieuTravail,
      });
      setSelectedProposition(prop);
      setShowEmissionModal(false);
    } catch (err: any) {
      setActionError(err.message || 'Erreur lors de l’émission de la proposition');
    }
  };

  const handleSimulerReponse = () => {
    if (!selectedProposition) return;
    setActionError(null);
    try {
      sirhStore.repondreProposition(selectedProposition.id, reponseDecision, reponseMotif);
      setShowReponseModal(false);
      setReponseMotif('');
      if (reponseDecision === 'ACCEPTEE') {
        setActiveTab('salaries');
      }
    } catch (err: any) {
      setActionError(err.message || 'Erreur lors de la réponse');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Sélection, Embauche & Dossiers Salariés
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Émission de propositions d'embauche, contractualisation juridique, complétude des dossiers administratifs et création des comptes collaborateurs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveTab('propositions')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'propositions'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Propositions ({state.propositions.length})
            </button>
            <button
              onClick={() => setActiveTab('salaries')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'salaries'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dossiers Salariés ({state.employes.length})
            </button>
            <button
              onClick={() => setActiveTab('contratPreview')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'contratPreview'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Générateur de Contrat Officiel
            </button>
          </div>

          <button
            onClick={() => setShowEmissionModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white rounded-lg transition-colors whitespace-nowrap shadow-xs"
            style={{ backgroundColor: currentTheme.primaryColor }}
          >
            <Send className="w-4 h-4" />
            <span>Nouvelle Proposition</span>
          </button>
        </div>
      </div>

      {/* TAB 1 : PROPOSITIONS VERSIONNÉES */}
      {activeTab === 'propositions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of Propositions */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Propositions Récentes
            </h3>

            {state.propositions.length === 0 ? (
              <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 text-center">
                Aucune proposition émise pour l'instant.
              </div>
            ) : (
              state.propositions.map((prop) => {
                const cand = state.candidatures.find((c) => c.id === prop.candidature_id);
                const candidat = cand ? state.candidats.find((c) => c.id === cand.candidat_id) : null;
                const isSelected = selectedProposition?.id === prop.id;

                return (
                  <div
                    key={prop.id}
                    onClick={() => setSelectedProposition(prop)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50/50 border-indigo-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-slate-900">{prop.numero}</span>
                      <span className="text-[10px] font-mono bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded">
                        v{prop.version}
                      </span>
                    </div>

                    <div className="mt-2">
                      <h4 className="text-xs font-bold text-slate-900">
                        {candidat ? `${candidat.prenom} ${candidat.nom}` : 'Candidat'}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {prop.remuneration_mensuelle.toLocaleString('fr-FR')} Ar · {prop.type_contrat}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px]">
                      <span
                        className={`px-2 py-0.5 rounded font-medium ${
                          prop.statut === 'ACCEPTEE'
                            ? 'bg-emerald-50 text-emerald-700'
                            : prop.statut === 'REFUSEE'
                            ? 'bg-rose-50 text-rose-700'
                            : prop.statut === 'NEGOCIATION'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {prop.statut}
                      </span>
                      <span className="text-slate-400">Échéance : {prop.date_limite_reponse}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Proposition Detail & Simulation Card */}
          <div className="lg:col-span-2">
            {selectedProposition ? (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div className="flex items-start justify-between pb-4 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {selectedProposition.numero}
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono font-semibold">
                        Version {selectedProposition.version}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      Proposition d'Embauche Officielle
                    </h3>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      selectedProposition.statut === 'ACCEPTEE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedProposition.statut === 'REFUSEE'
                        ? 'bg-rose-100 text-rose-800'
                        : selectedProposition.statut === 'NEGOCIATION'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {selectedProposition.statut}
                  </span>
                </div>

                {/* Offer terms */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-500">Rémunération Mensuelle Brute :</span>
                    <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                      {selectedProposition.remuneration_mensuelle.toLocaleString('fr-FR')} Ar
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-500">Type de Contrat & Période d'Essai :</span>
                    <div className="font-semibold text-slate-900 text-sm mt-0.5">
                      {selectedProposition.type_contrat} ({selectedProposition.periode_essai_jours} jours d'essai)
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-500">Date de Début Prévue :</span>
                    <div className="font-semibold text-slate-900 mt-0.5">
                      {selectedProposition.date_debut_prevue}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-500">Lieu de Travail :</span>
                    <div className="font-semibold text-slate-900 mt-0.5">
                      {selectedProposition.lieu_travail}
                    </div>
                  </div>
                </div>

                {/* Avantages */}
                <div className="text-xs">
                  <span className="font-semibold text-slate-800">Avantages Sociaux & Dotation :</span>
                  <ul className="mt-2 space-y-1 text-slate-600 list-disc list-inside">
                    {selectedProposition.avantages.map((av, i) => (
                      <li key={i}>{av}</li>
                    ))}
                  </ul>
                </div>

                {/* Action button if still PROPOSEE */}
                {selectedProposition.statut === 'PROPOSEE' && (
                  <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Enregistrement de la décision du candidat
                      </p>
                      <p className="text-[11px] text-slate-600">
                        L’accord du candidat déclenche automatiquement la création du dossier salarié, du contrat et de la checklist d'onboarding.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowReponseModal(true)}
                      className="px-4 py-2 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
                      style={{ backgroundColor: currentTheme.primaryColor }}
                    >
                      Enregistrer la Réponse ➔
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
                Sélectionnez une proposition pour afficher ses détails.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2 : DOSSIERS SALARIÉS */}
      {activeTab === 'salaries' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Dossiers Collaborateurs & Pièces Justificatives
            </h3>
            <p className="text-xs text-slate-500">
              Chaque collaborateur dispose d'une fiche complète et du suivi de conformité de ses documents administratifs.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="py-3 px-4">Matricule</th>
                  <th className="py-3 px-4">Collaborateur</th>
                  <th className="py-3 px-4">CIN & Contact</th>
                  <th className="py-3 px-4">Date d'Entrée</th>
                  <th className="py-3 px-4">Pièces Justificatives</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {state.employes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Aucun dossier salarié créé pour le moment. Acceptez une proposition d'embauche pour déclencher la contractualisation.
                    </td>
                  </tr>
                ) : (
                  state.employes.map((emp) => {
                    const pieces = state.piecesDossiers.filter((p) => p.employe_id === emp.id);
                    const piecesValides = pieces.filter((p) => p.statut === 'VALIDE').length;

                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {emp.matricule || <span className="text-slate-400 font-normal">Attribué à la signature</span>}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">{emp.prenom} {emp.nom}</div>
                          <div className="text-[11px] text-slate-500">{emp.email_professionnel || emp.email_personnel}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px]">
                          <div>CIN: {emp.cin}</div>
                          <div className="text-slate-500">{emp.telephone}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono">{emp.date_entree}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold">
                              {piecesValides} / {pieces.length}
                            </span>
                            <span className="text-[10px] text-slate-400">pièces validées</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700">
                            {emp.statut}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => onNavigateToBloc4 && onNavigateToBloc4(emp.id)}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-medium transition-colors"
                          >
                            Parcours Onboarding ➔
                          </button>
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

      {/* TAB 3 : GÉNÉRATEUR & APERÇU DE CONTRAT DE TRAVAIL */}
      {activeTab === 'contratPreview' && (
        <div className="bg-white rounded-2xl border border-slate-300 p-8 shadow-sm max-w-4xl mx-auto space-y-6 print:border-none print:shadow-none">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 no-print">
            <div>
              <span className="text-xs font-mono text-slate-400">Document Juridique Officiel</span>
              <h3 className="text-lg font-bold text-slate-900">
                Contrat de Travail à Durée Indéterminée
              </h3>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / Exporter PDF</span>
            </button>
          </div>

          {/* Legal Contract Document Format */}
          <div className="space-y-6 text-xs text-slate-800 leading-relaxed font-serif">
            <div className="text-center pb-4 border-b border-slate-200">
              <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
                RÉPUBLIQUE DE MADAGASCAR
              </h2>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Code du Travail — Loi N° 2003-044
              </p>
              <h1 className="text-lg font-bold uppercase tracking-wide text-slate-950 mt-3">
                CONTRAT DE TRAVAIL
              </h1>
              <p className="font-mono text-xs text-slate-500 mt-1">
                Réf : {state.contrats[0]?.numero || 'CTR-2026-0001'}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-950 uppercase tracking-wide">
                ENTRE LES SOUSSIGNÉS :
              </h4>
              <p className="mt-1">
                <strong>La Société SIRH ENTREPRISE S.A.</strong>, immatriculée au Registre du Commerce sous le N° 2024 B 00412, dont le siège social est situé à Ankorondrano, Antananarivo, représentée par Monsieur <strong>Hery Rajaonah</strong>, Directeur Général, ci-après dénommée <em>« L’Employeur »</em>, d’une part,
              </p>
              <p className="mt-2">
                ET Monsieur / Madame{' '}
                <strong>
                  {state.candidats[0]?.prenom} {state.candidats[0]?.nom}
                </strong>
                , né(e) le {state.candidats[0]?.date_naissance}, titulaire de la CIN N°{' '}
                <span className="font-mono">{state.candidats[0]?.cin}</span>, demeurant au{' '}
                {state.candidats[0]?.adresse}, ci-après dénommé(e) <em>« Le Salarié »</em>, d’autre part.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-950 uppercase tracking-wide">
                ARTICLE 1 : ENGAGEMENT ET FONCTIONS
              </h4>
              <p className="mt-1">
                L’Employeur engage le Salarié en qualité de{' '}
                <strong>Ingénieur Full-Stack Senior TypeScript & PostgreSQL</strong>. Le Salarié exercera ses fonctions sous l'autorité hiérarchique de la Direction Technique.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-950 uppercase tracking-wide">
                ARTICLE 2 : DURÉE DU CONTRAT ET PÉRIODE D’ESSAI
              </h4>
              <p className="mt-1">
                Le présent contrat est conclu pour une durée indéterminée (CDI) à compter du{' '}
                <strong>15 Novembre 2026</strong>. Il deviendra définitif à l'issue d'une période d'essai de <strong>90 jours</strong>, renouvelable une fois conformément aux dispositions légales en vigueur.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-950 uppercase tracking-wide">
                ARTICLE 3 : RÉMUNÉRATION ET AVANTAGES
              </h4>
              <p className="mt-1">
                En contrepartie de ses prestations, le Salarié percevra un salaire mensuel brut de{' '}
                <strong>4.800.000 Ariary (Quatre millions huit cent mille Ariary)</strong>, assujetti aux cotisations sociales légales (CNaPS et OSTIE) et à l’IRSA.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-950 uppercase tracking-wide">
                ARTICLE 4 : HORAIRES ET LIEU DE TRAVAIL
              </h4>
              <p className="mt-1">
                La durée hebdomadaire de travail est fixée à <strong>40 heures par semaine</strong>, du lundi au vendredi. Le lieu de travail habituel est situé au siège social à Ankorondrano, avec aménagement en télétravail partiel selon la charte d'entreprise.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-950 uppercase tracking-wide">
                ARTICLE 5 : CONFIDENTIALITÉ ET RÈGLEMENT INTÉRIEUR
              </h4>
              <p className="mt-1">
                Le Salarié s'engage à respecter une stricte confidentialité quant aux données, schémas relationnels et codes sources de l'entreprise.
              </p>
            </div>

            {/* Signatures Zones */}
            <div className="pt-8 grid grid-cols-2 gap-12 border-t border-slate-200 mt-8">
              <div>
                <p className="font-bold text-slate-950">Pour l'Employeur :</p>
                <p className="text-[11px] text-slate-500">Direction Générale</p>
                <div className="h-16 mt-2 border-b border-dashed border-slate-300 flex items-end">
                  <span className="text-[10px] text-emerald-700 font-mono italic">
                    [Signature & Cachet Électronique Approuvés]
                  </span>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-950">Pour le Salarié :</p>
                <p className="text-[11px] text-slate-500">Mention manuscrite « Lu et approuvé »</p>
                <div className="h-16 mt-2 border-b border-dashed border-slate-300 flex items-end">
                  <span className="text-[10px] text-slate-400 font-mono italic">
                    Zone de signature du collaborateur
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL : Nouvelle Proposition */}
      {showEmissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Émettre une Proposition d'Embauche
              </h3>
              <button onClick={() => setShowEmissionModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleEmettreProposition} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Candidat retenu *</label>
                <select
                  value={selectedCandidatureId}
                  onChange={(e) => setSelectedCandidatureId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  required
                >
                  {state.candidatures.map((c) => {
                    const cand = state.candidats.find((item) => item.id === c.candidat_id);
                    return (
                      <option key={c.id} value={c.id}>
                        {c.numero} — {cand?.prenom} {cand?.nom} ({c.statut})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Salaire Mensuel Brut *</label>
                  <input
                    type="number"
                    step={100000}
                    value={remuneration}
                    onChange={(e) => setRemuneration(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Type de contrat *</label>
                  <select
                    value={typeContrat}
                    onChange={(e) => setTypeContrat(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="STAGE">Stage</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Date d'intégration *</label>
                  <input
                    type="date"
                    value={dateDebut}
                    onChange={(e) => setDateDebut(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Période d'essai (jours) *</label>
                  <input
                    type="number"
                    value={periodeEssai}
                    onChange={(e) => setPeriodeEssai(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEmissionModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white font-semibold rounded-lg transition-colors shadow-xs"
                  style={{ backgroundColor: currentTheme.primaryColor }}
                >
                  Transmettre la Proposition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL : Simulation Réponse Candidat */}
      {showReponseModal && selectedProposition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Enregistrement de la Réponse du Candidat
              </h3>
              <button onClick={() => setShowReponseModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <p className="text-slate-600">
                Sélectionnez le retour formel transmis par le candidat :
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setReponseDecision('ACCEPTEE')}
                  className={`w-full p-3 rounded-xl border text-left transition-colors flex items-center justify-between ${
                    reponseDecision === 'ACCEPTEE'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div>✓ Accepter l'offre d'embauche</div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      Crée simultanément le dossier salarié, le contrat et le parcours d'onboarding.
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setReponseDecision('NEGOCIATION')}
                  className={`w-full p-3 rounded-xl border text-left transition-colors flex items-center justify-between ${
                    reponseDecision === 'NEGOCIATION'
                      ? 'bg-amber-50 border-amber-500 text-amber-950 font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div>↺ Négociation des conditions</div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      Permet d'émettre une révision (version 2) de la proposition.
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setReponseDecision('REFUSEE')}
                  className={`w-full p-3 rounded-xl border text-left transition-colors flex items-center justify-between ${
                    reponseDecision === 'REFUSEE'
                      ? 'bg-rose-50 border-rose-500 text-rose-950 font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div>✕ Décliner la proposition</div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      Clôture le dossier et notifie l'équipe pour examiner le candidat suivant.
                    </div>
                  </div>
                </button>
              </div>

              {reponseDecision !== 'ACCEPTEE' && (
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Remarque ou souhait du candidat :
                  </label>
                  <textarea
                    rows={2}
                    value={reponseMotif}
                    onChange={(e) => setReponseMotif(e.target.value)}
                    placeholder="Ex: Demande de revalorisation salariale..."
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowReponseModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={handleSimulerReponse}
                  className="px-4 py-2 text-white font-semibold rounded-lg transition-colors shadow-xs"
                  style={{ backgroundColor: currentTheme.primaryColor }}
                >
                  Valider la décision
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
