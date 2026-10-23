/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { sirhStore, SirhState } from './store/sirhStore';
import { ThemeProvider } from './theme/themeContext';
import { Header } from './components/common/Header';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { Bloc1Besoin } from './components/blocs/Bloc1Besoin';
import { Bloc2Recrutement } from './components/blocs/Bloc2Recrutement';
import { Bloc3Embauche } from './components/blocs/Bloc3Embauche';
import { Bloc4Onboarding } from './components/blocs/Bloc4Onboarding';
import { PortailCarrieres } from './components/public/PortailCarrieres';
import { CorporateCampus3D } from './components/three/CorporateCampus3D';
import { JournalAudit } from './components/admin/JournalAudit';
import { SqlStudio } from './components/admin/SqlStudio';
import { SirhChatbot } from './components/chat/SirhChatbot';
import { RotateCcw, ShieldCheck, Database, Building } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<SirhState>(sirhStore.getState());
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  useEffect(() => {
    const unsubscribe = sirhStore.subscribe(() => {
      setState({ ...sirhStore.getState() });
    });
    return unsubscribe;
  }, []);

  const handleSwitchRole = (role: any) => {
    sirhStore.switchRole(role);
  };

  const handleMarkNotificationRead = (id: string) => {
    sirhStore.markNotificationRead(id);
  };

  const handleResetData = () => {
    if (window.confirm('Voulez-vous réinitialiser toutes les données de démonstration du SIRH ?')) {
      sirhStore.resetAll();
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        {/* Universal Top Bar */}
        <Header
          currentRole={state.currentRole}
          currentUser={state.currentUser}
          allUsers={state.users}
          notifications={state.notifications}
          onSwitchRole={handleSwitchRole}
          onMarkNotificationRead={handleMarkNotificationRead}
          activeTab={activeTab}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <ExecutiveDashboard
            state={state}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'bloc1' && (
          <Bloc1Besoin
            state={state}
            onNavigateToBloc2={(demandeId) => setActiveTab('bloc2')}
          />
        )}

        {activeTab === 'bloc2' && (
          <Bloc2Recrutement
            state={state}
            onNavigateToBloc3={(candidatureId) => setActiveTab('bloc3')}
          />
        )}

        {activeTab === 'bloc3' && (
          <Bloc3Embauche
            state={state}
            onNavigateToBloc4={(employeId) => setActiveTab('bloc4')}
          />
        )}

        {activeTab === 'bloc4' && (
          <Bloc4Onboarding state={state} />
        )}

        {activeTab === 'carrieres' && (
          <PortailCarrieres state={state} />
        )}

        {activeTab === 'campus3d' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Campus Digital Twin 3D — Siège Social & Pôles SIRH
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visualisation 3D temps réel du siège social d'Ankorondrano. Cliquez sur un pavillon pour inspecter ses métriques ou naviguez via le dock inférieur.
                </p>
              </div>
            </div>

            <CorporateCampus3D
              state={state}
              onSelectHub={(hub) => setActiveTab(hub)}
            />
          </div>
        )}

        {activeTab === 'audit' && (
          <JournalAudit journal={state.journal} />
        )}

        {activeTab === 'sql' && (
          <SqlStudio state={state} />
        )}
      </main>

      {/* Clean Footer with Secondary Links & Reset */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-400" />
            <span>
              SIRH Entreprise · Plateforme de Gestion des Ressources Humaines · Conforme Code du Travail
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('audit')}
              className="hover:text-slate-900 font-medium transition-colors"
            >
              Journal d'Audit & Traçabilité
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className="hover:text-slate-900 font-medium font-mono transition-colors"
            >
              Schémas & Scripts SQL
            </button>
            <button
              onClick={handleResetData}
              className="flex items-center gap-1 text-slate-400 hover:text-rose-600 transition-colors"
              title="Réinitialiser les données initiales"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser démo</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Persistent AI Chatbot across all pages */}
      <SirhChatbot />
    </div>
    </ThemeProvider>
  );
}
