/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  Filter,
  Clock,
  ShieldCheck,
  User,
  Database
} from 'lucide-react';
import { JournalMouvement } from '../../types/sirh';

interface JournalAuditProps {
  journal: JournalMouvement[];
}

export const JournalAudit: React.FC<JournalAuditProps> = ({ journal }) => {
  const [filterEntite, setFilterEntite] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = journal.filter((m) => {
    if (filterEntite !== 'ALL' && m.entite !== filterEntite) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        m.nom_utilisateur.toLowerCase().includes(q) ||
        m.action.toLowerCase().includes(q) ||
        m.entite_id.toLowerCase().includes(q) ||
        (m.motif_ou_commentaire && m.motif_ou_commentaire.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Utilisateur', 'Role', 'Entite', 'Entite_ID', 'Action', 'Motif_ou_Commentaire'];
    const rows = filtered.map((m) => [
      m.id,
      m.created_at,
      `"${m.nom_utilisateur}"`,
      m.role_utilisateur,
      m.entite,
      m.entite_id,
      m.action,
      `"${(m.motif_ou_commentaire || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `journal_mouvements_sirh_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filtered, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `journal_audit_sirh_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Journal d'Audit & Traçabilité Réglementaire
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Historique complet non altérable : chaque validation, transition d’état, création ou signature est tracée avec son auteur et son horodatage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Exporter JSON</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par auteur, action, motif..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">Entité :</span>
          <select
            value={filterEntite}
            onChange={(e) => setFilterEntite(e.target.value)}
            className="p-1.5 border border-slate-300 rounded-lg bg-white"
          >
            <option value="ALL">Toutes les entités</option>
            <option value="demandes_recrutement">Demandes de Recrutement</option>
            <option value="offres_emploi">Offres d'Emploi</option>
            <option value="candidatures">Candidatures</option>
            <option value="entretiens">Entretiens</option>
            <option value="evaluations">Évaluations</option>
            <option value="propositions_embauche">Propositions d'Embauche</option>
            <option value="employes">Employés</option>
            <option value="contrats">Contrats</option>
            <option value="taches_onboarding">Tâches d'Onboarding</option>
            <option value="pieces_dossier">Pièces du Dossier</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-3 px-4">Date & Heure</th>
                <th className="py-3 px-4">Utilisateur & Rôle</th>
                <th className="py-3 px-4">Entité & Réf</th>
                <th className="py-3 px-4">Action Réalisée</th>
                <th className="py-3 px-4">Motif / Commentaire</th>
                <th className="py-3 px-4">Deltas JSON</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-sans">
                    Aucun événement journalisé correspondant aux filtres.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('fr-FR')}
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-semibold text-slate-900">{log.nom_utilisateur}</div>
                      <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                        {log.role_utilisateur}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-800 font-medium font-sans">{log.entite}</span>
                      <div className="text-[11px] text-slate-400 font-mono">{log.entite_id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-900 font-semibold">{log.action}</span>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-slate-600 max-w-xs">
                      {log.motif_ou_commentaire || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-[10px] text-slate-500 max-w-xs truncate">
                      {log.valeur_apres ? JSON.stringify(log.valeur_apres) : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
