/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Building2,
  Layers,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  ArrowLeft,
  DollarSign,
  Users,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { SirhState, sirhStore } from '../../store/sirhStore';
import { Poste } from '../../types/sirh';
import { useTheme } from '../../theme/themeContext';

interface CreationPosteProps {
  state: SirhState;
  onNavigateTab: (tab: string) => void;
  onPosteCreated?: (poste: Poste) => void;
}

const COMMON_SKILLS = [
  'React',
  'TypeScript',
  'Node.js',
  'PostgreSQL',
  'Docker',
  'Kubernetes',
  'DevOps',
  'Architecture Logicielle',
  'API REST',
  'Management d\'équipe',
  'Droit du travail',
  'Sourcing & Recrutement',
  'Contrôle de Gestion',
  'Gestion de Projet Agile',
  'Cybersécurité',
];

export const CreationPoste: React.FC<CreationPosteProps> = ({
  state,
  onNavigateTab,
  onPosteCreated,
}) => {
  const { currentTheme } = useTheme();

  // Role verification
  const isAuthorized = ['MANAGER', 'DIRECTION', 'RH', 'ADMIN'].includes(state.currentRole);

  // Form states
  const [intitule, setIntitule] = useState('');
  const [code, setCode] = useState('');
  const [codeManuallyEdited, setCodeManuallyEdited] = useState(false);
  const [departementId, setDepartementId] = useState(state.departements[0]?.id || '');
  const [serviceId, setServiceId] = useState(
    state.services.find((s) => s.departement_id === state.departements[0]?.id)?.id || ''
  );
  const [description, setDescription] = useState('');
  const [competences, setCompetences] = useState<string[]>(['TypeScript', 'PostgreSQL']);
  const [skillInput, setSkillInput] = useState('');
  const [salaireMin, setSalaireMin] = useState<number>(3000000);
  const [salaireMax, setSalaireMax] = useState<number>(4500000);
  const [effectifAutorise, setEffectifAutorise] = useState<number>(2);
  const [statut, setStatut] = useState<'ACTIF' | 'GELE'>('ACTIF');
  const [creerDemandeDirecte, setCreerDemandeDirecte] = useState(false);

  // Submission feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdPoste, setCreatedPoste] = useState<Poste | null>(null);

  // Filter services by selected department
  const filteredServices = useMemo(() => {
    return state.services.filter((s) => s.departement_id === departementId);
  }, [state.services, departementId]);

  // Handle department change & auto-select first matching service
  const handleDepartementChange = (newDeptId: string) => {
    setDepartementId(newDeptId);
    const firstService = state.services.find((s) => s.departement_id === newDeptId);
    setServiceId(firstService ? firstService.id : '');
  };

  // Auto-generate code when intitule changes (if user hasn't typed a custom code)
  const handleIntituleChange = (val: string) => {
    setIntitule(val);
    if (!codeManuallyEdited) {
      const words = val
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^A-Z0-9\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 2)
        .slice(0, 3)
        .join('-');
      setCode(words ? `PST-${words}` : 'PST-');
    }
  };

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (!competences.includes(trimmed)) {
      setCompetences([...competences, trimmed]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setCompetences(competences.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!intitule.trim()) {
        throw new Error("L'intitulé du poste est requis.");
      }
      if (!code.trim()) {
        throw new Error("Le code normalisé du poste est requis.");
      }
      if (!departementId || !serviceId) {
        throw new Error("Veuillez sélectionner un département et un service valide.");
      }
      if (salaireMin > salaireMax) {
        throw new Error("Le salaire minimum ne peut pas dépasser le salaire maximum.");
      }
      if (effectifAutorise < 1) {
        throw new Error("L'effectif autorisé doit être supérieur ou égal à 1.");
      }
      if (competences.length === 0) {
        throw new Error("Veuillez renseigner au moins une compétence requise.");
      }

      const nouveauPoste = sirhStore.creerPoste({
        code: code.trim().toUpperCase(),
        intitule: intitule.trim(),
        departement_id: departementId,
        service_id: serviceId,
        description: description.trim() || `Poste de ${intitule.trim()} au sein du service.`,
        competences_requises: competences,
        fourchette_salaire_min: salaireMin,
        fourchette_salaire_max: salaireMax,
        effectif_autorise: effectifAutorise,
        statut,
      });

      setCreatedPoste(nouveauPoste);
      if (onPosteCreated) {
        onPosteCreated(nouveauPoste);
      }

      // If requested, navigate to bloc1 to view or create request
      if (creerDemandeDirecte) {
        setTimeout(() => {
          onNavigateTab('bloc1');
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la création du poste.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Selected department and service objects for preview
  const currentDept = state.departements.find((d) => d.id === departementId);
  const currentSrv = state.services.find((s) => s.id === serviceId);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button
              onClick={() => onNavigateTab('bloc1')}
              className="hover:text-slate-900 transition-colors flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Besoins en personnel</span>
            </button>
            <span>/</span>
            <span className="font-semibold text-slate-700">Création de poste</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <span>Créer un Nouveau Poste</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Formulaire réservé aux Managers Opérationnels et à la Direction Générale pour étendre la cartographie des emplois.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center gap-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span className="text-slate-600">Rôle :</span>
            <span className="font-bold text-indigo-700 uppercase">{state.currentRole}</span>
          </div>

          <button
            onClick={() => onNavigateTab('bloc1')}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Retour aux besoins
          </button>
        </div>
      </div>

      {/* Permission Warning if not authorized */}
      {!isAuthorized && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-amber-900">Accès restreint aux gestionnaires</p>
            <p className="mt-0.5">
              La création d'un poste organisationnel est réservée aux profils <strong>MANAGER</strong>, <strong>DIRECTION</strong> ou <strong>RH</strong>.
              Veuillez vous authentifier avec l'un de ces rôles pour soumettre ce formulaire.
            </p>
          </div>
        </div>
      )}

      {/* Success Banner */}
      {createdPoste && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-start justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-emerald-950">
                Poste « {createdPoste.intitule} » ({createdPoste.code}) créé avec succès !
              </p>
              <p className="mt-1 text-emerald-800">
                Le poste a été intégré à la cartographie des effectifs et synchronisé avec la base PostgreSQL Neon.
                {creerDemandeDirecte ? " Redirection vers le circuit de validation..." : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateTab('bloc1')}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              Voir dans la Cartographie ➔
            </button>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-rose-950">Erreur lors de la validation</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            {/* Section 1: Intitulé & Code */}
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span>Identification du Poste</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">
                    Intitulé du poste *
                  </label>
                  <input
                    type="text"
                    value={intitule}
                    onChange={(e) => handleIntituleChange(e.target.value)}
                    placeholder="Ex: Ingénieur Full-Stack Senior, Lead DevOps, Chef de Projet"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-xs"
                    required
                    disabled={!isAuthorized || isSubmitting}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Nom fonctionnel clair et explicite pour les candidats et les collaborateurs.
                  </p>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Code Poste (Unique) *
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase());
                      setCodeManuallyEdited(true);
                    }}
                    placeholder="Ex: PST-DEV-FS"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs uppercase focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    required
                    disabled={!isAuthorized || isSubmitting}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Format recommandé : PST-XXX
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Rattachement organisationnel */}
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>Rattachement Hiérarchique & Organisationnel</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Département *
                  </label>
                  <select
                    value={departementId}
                    onChange={(e) => handleDepartementChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-xs"
                    required
                    disabled={!isAuthorized || isSubmitting}
                  >
                    {state.departements.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.code} · {d.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Service de rattachement *
                  </label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-xs"
                    required
                    disabled={!isAuthorized || isSubmitting || filteredServices.length === 0}
                  >
                    {filteredServices.length === 0 ? (
                      <option value="">Aucun service dans ce département</option>
                    ) : (
                      filteredServices.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.code} · {s.nom}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Description & Missions */}
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Fiche Descriptive & Missions</span>
              </h2>

              <div className="mt-4 text-xs">
                <label className="block font-medium text-slate-700 mb-1">
                  Description des responsabilités et livrables attendus *
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez les objectifs clés du poste, le périmètre technique ou managérial, et les livrables principaux..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-xs"
                  required
                  disabled={!isAuthorized || isSubmitting}
                />
              </div>
            </div>

            {/* Section 4: Compétences requises (Chips) */}
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Compétences Requises (Skills Matrix)</span>
              </h2>

              <div className="mt-4 text-xs space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(skillInput);
                      }
                    }}
                    placeholder="Ajouter une compétence (ex: React, SQL, Management...)"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    disabled={!isAuthorized || isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill(skillInput)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                    disabled={!isAuthorized || isSubmitting || !skillInput.trim()}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter</span>
                  </button>
                </div>

                {/* Selected Skills Chips */}
                <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 border border-slate-200/80 rounded-xl min-h-[46px] items-center">
                  {competences.length === 0 ? (
                    <span className="text-slate-400 text-[11px] italic">
                      Aucune compétence renseignée pour le moment.
                    </span>
                  ) : (
                    competences.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-medium text-[11px]"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-indigo-400 hover:text-rose-600 transition-colors ml-0.5"
                          title="Supprimer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Quick suggestions */}
                <div>
                  <span className="text-[11px] text-slate-500 font-medium mr-1.5">
                    Suggestions rapides :
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {COMMON_SKILLS.filter((s) => !competences.includes(s)).map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleAddSkill(skill)}
                        className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-600 transition-colors"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Effectif & Grille Salariale */}
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                <DollarSign className="w-4 h-4 text-indigo-600" />
                <span>Effectif Autorisé & Grille de Rémunération</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Effectif autorisé (places) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={effectifAutorise}
                    onChange={(e) => setEffectifAutorise(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    required
                    disabled={!isAuthorized || isSubmitting}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Nombre maximal de postes ouverts dans l'organigramme (RG01).
                  </p>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Salaire mensuel min (Ar) *
                  </label>
                  <input
                    type="number"
                    step={100000}
                    min={500000}
                    value={salaireMin}
                    onChange={(e) => setSalaireMin(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    required
                    disabled={!isAuthorized || isSubmitting}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    {(salaireMin || 0).toLocaleString('fr-FR')} Ar / mois
                  </p>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Salaire mensuel max (Ar) *
                  </label>
                  <input
                    type="number"
                    step={100000}
                    min={salaireMin}
                    value={salaireMax}
                    onChange={(e) => setSalaireMax(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    required
                    disabled={!isAuthorized || isSubmitting}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    {(salaireMax || 0).toLocaleString('fr-FR')} Ar / mois
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Statut initial du poste
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="statut"
                        checked={statut === 'ACTIF'}
                        onChange={() => setStatut('ACTIF')}
                        className="text-indigo-600"
                      />
                      <span className="text-slate-800 font-medium">Actif (Ouvert aux recrutements)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="statut"
                        checked={statut === 'GELE'}
                        onChange={() => setStatut('GELE')}
                        className="text-indigo-600"
                      />
                      <span className="text-slate-800 font-medium">Gelé (Inactif temporairement)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick transition checkbox */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <input
                type="checkbox"
                id="creerDemandeDirecte"
                checked={creerDemandeDirecte}
                onChange={(e) => setCreerDemandeDirecte(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
              />
              <label htmlFor="creerDemandeDirecte" className="text-xs text-slate-700 font-medium cursor-pointer">
                Lancer immédiatement une demande de recrutement pour ce poste dès sa création
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => onNavigateTab('bloc1')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
                disabled={isSubmitting}
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={!isAuthorized || isSubmitting}
                className="px-6 py-2.5 rounded-xl text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all disabled:opacity-50"
                style={{ backgroundColor: currentTheme.primaryColor }}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Enregistrement en base...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Créer et Publier le Poste</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Card (1 col) */}
        <div className="space-y-4">
          <div className="sticky top-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Aperçu de la Fiche de Poste</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                statut === 'ACTIF' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
              }`}>
                {statut}
              </span>
            </div>

            {/* Simulated Card in Cartography */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono font-semibold text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded">
                  {code || 'PST-CODE'}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  {intitule || 'Intitulé du poste à définir'}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-3">
                  {description || 'Description du poste, missions opérationnelles et responsabilités...'}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Département :</span>
                  <span className="font-medium text-slate-800">{currentDept?.nom || 'Non défini'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service :</span>
                  <span className="font-medium text-slate-800">{currentSrv?.nom || 'Non défini'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Effectif autorisé :</span>
                  <span className="font-bold text-slate-900">{effectifAutorise} place{effectifAutorise > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Grille salariale :</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {(salaireMin || 0).toLocaleString('fr-FR')} – {(salaireMax || 0).toLocaleString('fr-FR')} Ar
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] font-semibold text-slate-600 block mb-1">
                  Compétences exigées ({competences.length}) :
                </span>
                <div className="flex flex-wrap gap-1">
                  {competences.slice(0, 6).map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-700 font-medium"
                    >
                      {c}
                    </span>
                  ))}
                  {competences.length > 6 && (
                    <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
                      +{competences.length - 6} autres
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Compliance Info */}
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-[11px] text-slate-600 space-y-1">
              <div className="font-semibold text-indigo-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" />
                <span>Règles de Gestion & Conformité</span>
              </div>
              <p>
                <strong>RG01 :</strong> Un poste existe de manière autonome indépendamment de tout collaborateur.
              </p>
              <p>
                <strong>Traçabilité :</strong> La création est immédiatement auditée dans le journal immuable des mouvements (RG18).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
