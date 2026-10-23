/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { sirhStore, SirhState } from './store/sirhStore';
import { ThemeProvider } from './theme/themeContext';
import { Sidebar } from './components/navigation/Sidebar';
import { AuthModal } from './components/auth/AuthModal';
import { EspaceEmploye } from './components/employee/EspaceEmploye';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { Bloc1Besoin } from './components/blocs/Bloc1Besoin';
import { Bloc2Recrutement } from './components/blocs/Bloc2Recrutement';
import { Bloc3Embauche } from './components/blocs/Bloc3Embauche';
import { Bloc4Onboarding } from './components/blocs/Bloc4Onboarding';
import { PortailCarrieres } from './components/public/PortailCarrieres';
import { JournalAudit } from './components/admin/JournalAudit';
import { SirhChatbot } from './components/chat/SirhChatbot';
import { RotateCcw, Building } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<SirhState>(sirhStore.getState());
  // Default role is EMPLOYE and default landing page is 'employe'
  const [activeTab, setActiveTab] = useState<string>('employe');

  // Auth modal control
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authPromptRole, setAuthPromptRole] = useState<string | null>(null);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('login');
  const [pendingTab, setPendingTab] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = sirhStore.subscribe(() => {
      setState({ ...sirhStore.getState() });
    });
    return unsubscribe;
  }, []);

  const handleOpenAuth = (rolePrompt?: string, mode: 'login' | 'register' = 'login') => {
    setAuthPromptRole(rolePrompt || null);
    setAuthInitialTab(mode);
    setAuthModalOpen(true);
  };

  const handleNavigateTab = (tab: string) => {
    const restrictedTabs = ['dashboard', 'bloc1', 'bloc2', 'bloc3', 'bloc4', 'audit'];
    const isManagementRole = ['RH', 'MANAGER', 'FINANCE', 'DIRECTION', 'ADMIN'].includes(state.currentRole);

    if (restrictedTabs.includes(tab) && (!state.isAuthenticated || !isManagementRole)) {
      setPendingTab(tab);
      handleOpenAuth(`Accès restreint à l'espace de gestion (${tab.toUpperCase()})`, 'login');
      return;
    }
    setActiveTab(tab);
  };

  const handleAuthSuccess = () => {
    const freshState = sirhStore.getState();
    const isManagementRole = ['RH', 'MANAGER', 'FINANCE', 'DIRECTION', 'ADMIN'].includes(freshState.currentRole);
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    } else if (isManagementRole) {
      setActiveTab('dashboard');
    } else {
      setActiveTab('employe');
    }
  };

  const handleLogout = () => {
    sirhStore.logoutUser();
    setActiveTab('employe');
  };

  const handleMarkNotificationRead = (id: string) => {
    sirhStore.markNotificationRead(id);
  };

  const handleResetData = () => {
    if (window.confirm('Voulez-vous réinitialiser toutes les données de démonstration du SIRH ?')) {
      sirhStore.resetAll();
      setActiveTab('employe');
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row antialiased">
        {/* Navigation Sidebar */}
        <Sidebar
          currentRole={state.currentRole}
          currentUser={state.currentUser}
          isAuthenticated={state.isAuthenticated}
          notifications={state.notifications}
          activeTab={activeTab}
          onNavigateTab={handleNavigateTab}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          onMarkNotificationRead={handleMarkNotificationRead}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {activeTab === 'employe' && (
              <EspaceEmploye
                state={state}
                onNavigateTab={handleNavigateTab}
                onOpenAuth={handleOpenAuth}
              />
            )}

            {activeTab === 'carrieres' && (
              <PortailCarrieres state={state} />
            )}

            {activeTab === 'dashboard' && (
              <ExecutiveDashboard
                state={state}
                onNavigateTab={handleNavigateTab}
              />
            )}

            {activeTab === 'bloc1' && (
              <Bloc1Besoin
                state={state}
                onNavigateToBloc2={() => handleNavigateTab('bloc2')}
              />
            )}

            {activeTab === 'bloc2' && (
              <Bloc2Recrutement
                state={state}
                onNavigateToBloc3={() => handleNavigateTab('bloc3')}
              />
            )}

            {activeTab === 'bloc3' && (
              <Bloc3Embauche
                state={state}
                onNavigateToBloc4={() => handleNavigateTab('bloc4')}
              />
            )}

            {activeTab === 'bloc4' && (
              <Bloc4Onboarding state={state} />
            )}

            {activeTab === 'audit' && (
              <JournalAudit journal={state.journal} />
            )}
          </main>

          {/* Clean, Lightweight Footer without SQL console */}
          <footer className="border-t border-slate-200/80 bg-white py-3.5 mt-auto no-print">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  SIRH Entreprise · Portail RH & Salariés · Conforme Code du Travail
                </span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleNavigateTab('audit')}
                  className="hover:text-slate-900 font-medium transition-colors"
                >
                  Journal d'Audit & Traçabilité
                </button>
                <button
                  onClick={handleResetData}
                  className="flex items-center gap-1 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Réinitialiser les données initiales"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Réinitialiser démo</span>
                </button>
              </div>
            </div>
          </footer>
        </div>

        {/* Global Authentication Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          state={state}
          targetRolePrompt={authPromptRole}
          initialTab={authInitialTab}
          onSuccess={handleAuthSuccess}
        />

        {/* Persistent AI Chatbot across all pages */}
        <SirhChatbot />
      </div>
    </ThemeProvider>
  );
}
