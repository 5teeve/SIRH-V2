/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  Calendar,
  Send,
  CheckCircle2,
  Search,
  Building,
  UserCheck,
  Upload,
  ArrowRight
} from 'lucide-react';
import { SirhState, sirhStore } from '../../store/sirhStore';
import { OffreEmploi } from '../../types/sirh';
import { useTheme } from '../../theme/themeContext';

interface PortailCarrieresProps {
  state: SirhState;
}

export const PortailCarrieres: React.FC<PortailCarrieresProps> = ({ state }) => {
  const { currentTheme } = useTheme();
  const [selectedOffre, setSelectedOffre] = useState<OffreEmploi | null>(
    state.offres.find((o) => o.statut === 'PUBLIEE') || null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState<string>('ALL');

  // Form State
  const [cin, setCin] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [dateNaissance, setDateNaissance] = useState('1996-05-18');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('+261 34 00 000 00');
  const [adresse, setAdresse] = useState('Antananarivo');
  const [titreActuel, setTitreActuel] = useState('');
  const [anneesExperience, setAnneesExperience] = useState(4);
  const [cvName, setCvName] = useState('CV_collaborateur_2026.pdf');
  const [lettreMotivation, setLettreMotivation] = useState('');

  const [postulationSuccess, setPostulationSuccess] = useState<{
    numero: string;
    candidatNom: string;
    estExistant: boolean;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const publishedOffers = state.offres.filter((o) => {
    if (o.statut !== 'PUBLIEE') return false;
    if (filterDept !== 'ALL' && o.departement_id !== filterDept) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return o.titre.toLowerCase().includes(q) || o.missions.toLowerCase().includes(q);
    }
    return true;
  });

  const handlePostuler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffre) return;
    setErrorMessage(null);

    try {
      const result = sirhStore.postulerOffre(selectedOffre.id, {
        cin,
        nom,
        prenom,
        date_naissance: dateNaissance,
        email,
        telephone,
        adresse,
        cv_url: cvName,
        lettre_motivation_url: lettreMotivation ? 'lettre_motivation.pdf' : undefined,
        titre_actuel: titreActuel,
        annees_experience: anneesExperience,
      });

      setPostulationSuccess({
        numero: result.candidature.numero,
        candidatNom: `${result.candidat.prenom} ${result.candidat.nom}`,
        estExistant: result.estExistant,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur lors de la postulation');
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner with Theme Gradient */}
      <div
        className={`text-white rounded-2xl p-8 sm:p-10 shadow-lg relative overflow-hidden bg-gradient-to-r ${currentTheme.heroGradient}`}
      >
        <div className="relative z-10 max-w-2xl">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider inline-block"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF' }}
          >
            Portail Carrières & Opportunités
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2">
            Rejoignez notre équipe d'ingénierie et d'experts
          </h2>
          <p className="text-sm text-slate-200 mt-2 leading-relaxed">
            Consultez nos postes ouverts et postulez directement en quelques minutes, sans création préalable de compte.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un poste, une compétence..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 whitespace-nowrap">Département :</span>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="p-2 text-xs border border-slate-300 rounded-lg bg-white w-full sm:w-auto"
          >
            <option value="ALL">Tous les départements</option>
            {state.departements.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Layout : Offers List + Selected Offer Application Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Offers List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Postes Disponibles ({publishedOffers.length})
          </h3>

          {publishedOffers.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
              Aucune offre publiée ne correspond à vos critères.
            </div>
          ) : (
            publishedOffers.map((offre) => {
              const isSelected = selectedOffre?.id === offre.id;

              return (
                <div
                  key={offre.id}
                  onClick={() => {
                    setSelectedOffre(offre);
                    setPostulationSuccess(null);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/50 border-indigo-300 shadow-xs ring-1 ring-indigo-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500">{offre.reference}</span>
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {offre.type_contrat}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-2">{offre.titre}</h4>

                  <div className="mt-2 text-xs text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{offre.lieu}</span>
                    </div>
                    {offre.salaire_affiche && offre.salaire_min && offre.salaire_max && (
                      <div className="font-mono text-slate-700 font-semibold">
                        {offre.salaire_min.toLocaleString('fr-FR')} –{' '}
                        {offre.salaire_max.toLocaleString('fr-FR')} Ar / mois
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {offre.competences_requises.map((c, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Offer Detail & Application Form */}
        <div className="lg:col-span-7">
          {selectedOffre ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              {/* Offer Header */}
              <div className="pb-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded">
                    {selectedOffre.reference} · {selectedOffre.type_contrat}
                  </span>
                  <span className="text-xs text-slate-400">
                    Clôture le {selectedOffre.date_cloture}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-2">{selectedOffre.titre}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedOffre.lieu}</p>
              </div>

              {/* Missions & Profil */}
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Missions du poste :</h4>
                  <p className="text-slate-600 leading-relaxed">{selectedOffre.missions}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Profil recherché :</h4>
                  <p className="text-slate-600 leading-relaxed">{selectedOffre.profil_recherche}</p>
                </div>
              </div>

              {/* Success Notification */}
              {postulationSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Candidature enregistrée avec succès !</span>
                  </div>
                  <p className="text-slate-700">
                    Merci <strong>{postulationSuccess.candidatNom}</strong>. Votre candidature porte la référence{' '}
                    <strong className="font-mono text-slate-900">{postulationSuccess.numero}</strong>.
                  </p>
                  {postulationSuccess.estExistant && (
                    <p className="text-slate-600 italic text-[11px]">
                      (Votre profil existant a été reconnu et vos informations de contact ont été synchronisées automatiquement).
                    </p>
                  )}
                  <p className="text-slate-600 text-[11px]">
                    L'équipe RH examine votre dossier dans le cadre du processus de sélection.
                  </p>
                </div>
              )}

              {/* Formulaire de Candidature */}
              {!postulationSuccess && (
                <form onSubmit={handlePostuler} className="pt-4 border-t border-slate-200 space-y-4 text-xs">
                  <h4 className="text-sm font-bold text-slate-900">
                    Postuler à cette offre (Sans création de compte)
                  </h4>

                  {errorMessage && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Numéro CIN ou Passeport *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 101234567890"
                        value={cin}
                        onChange={(e) => setCin(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Adresse Email *</label>
                      <input
                        type="email"
                        placeholder="nom.prenom@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Nom de famille *</label>
                      <input
                        type="text"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Prénom(s) *</label>
                      <input
                        type="text"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Date de naissance *</label>
                      <input
                        type="date"
                        value={dateNaissance}
                        onChange={(e) => setDateNaissance(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Numéro de téléphone *</label>
                      <input
                        type="tel"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Adresse de résidence *</label>
                      <input
                        type="text"
                        value={adresse}
                        onChange={(e) => setAdresse(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Poste actuel ou spécialité :</label>
                      <input
                        type="text"
                        placeholder="Ex: Développeur Full-Stack, Analyste..."
                        value={titreActuel}
                        onChange={(e) => setTitreActuel(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Années d'expérience * :</label>
                      <input
                        type="number"
                        min={0}
                        value={anneesExperience}
                        onChange={(e) => setAnneesExperience(Number(e.target.value))}
                        className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Curriculum Vitae (CV) *</label>
                    <div className="p-3 border border-dashed border-slate-300 rounded-lg bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-slate-400" />
                        <span className="font-mono text-slate-800">{cvName}</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                        Prêt pour soumission
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Lettre de motivation ou message au recruteur :
                    </label>
                    <textarea
                      rows={3}
                      value={lettreMotivation}
                      onChange={(e) => setLettreMotivation(e.target.value)}
                      placeholder="Expliquez brièvement vos motivations pour ce poste..."
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 text-white font-semibold rounded-lg transition-colors shadow-xs"
                      style={{ backgroundColor: currentTheme.primaryColor }}
                    >
                      <Send className="w-4 h-4" />
                      <span>Transmettre ma Candidature</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
              Sélectionnez une offre pour postuler en ligne.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
