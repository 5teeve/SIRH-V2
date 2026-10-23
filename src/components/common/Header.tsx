/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  UserCheck,
  Building,
  ShieldCheck,
  ChevronDown,
  Palette
} from 'lucide-react';
import { UserRole, Utilisateur, NotificationItem } from '../../types/sirh';
import { useTheme } from '../../theme/themeContext';
import { ThemeSelectorModal } from './ThemeSelectorModal';

interface HeaderProps {
  currentRole: UserRole;
  currentUser: Utilisateur;
  allUsers: Utilisateur[];
  notifications: NotificationItem[];
  onSwitchRole: (role: UserRole) => void;
  onMarkNotificationRead: (id: string) => void;
  activeTab: string;
  onNavigateTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  currentUser,
  allUsers,
  notifications,
  onSwitchRole,
  onMarkNotificationRead,
  activeTab,
  onNavigateTab,
}) => {
  const { currentTheme } = useTheme();
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

  const unreadCount = notifications.filter((n) => !n.lu).length;

  const roleLabels: Record<UserRole, { label: string; desc: string }> = {
    ADMIN: { label: 'Administrateur', desc: 'Gestion des référentiels, paramètres et journal d’audit' },
    MANAGER: { label: 'Manager Technique', desc: 'Expression des besoins, avis sur les entretiens' },
    RH: { label: 'Direction des Ressources Humaines', desc: 'Pilotage complet du recrutement et de l’onboarding' },
    FINANCE: { label: 'Direction Financière', desc: 'Validation budgétaire des demandes de recrutement' },
    DIRECTION: { label: 'Direction Générale', desc: 'Approbation stratégique finale' },
    EMPLOYE: { label: 'Espace Candidat / Collaborateur', desc: 'Consultation des offres et signature de contrat' },
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-8">
            {/* Zone 1 : Brand Title (Clean, no pseudo-technical clutter) */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigateTab('dashboard')}
                className="flex items-center gap-2.5 text-left group"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs transition-colors"
                  style={{ backgroundColor: currentTheme.primaryColor }}
                >
                  <Building className="w-5 h-5 text-white/90" />
                </div>
                <div>
                  <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
                    SIRH Entreprise
                  </span>
                  <span className="hidden sm:inline-block text-xs text-slate-400 ml-2">
                    Plateforme RH & Talents
                  </span>
                </div>
              </button>
            </div>

            {/* Zone 2 : Concise Navigation Links (natural, clean French) */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
              <button
                onClick={() => onNavigateTab('dashboard')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'dashboard' ? 'text-slate-950 font-bold' : ''
                }`}
              >
                Tableau de bord
              </button>
              <button
                onClick={() => onNavigateTab('bloc1')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'bloc1' ? 'text-slate-950 font-bold' : ''
                }`}
              >
                Besoins en personnel
              </button>
              <button
                onClick={() => onNavigateTab('bloc2')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'bloc2' ? 'text-slate-950 font-bold' : ''
                }`}
              >
                Recrutement
              </button>
              <button
                onClick={() => onNavigateTab('bloc3')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'bloc3' ? 'text-slate-950 font-bold' : ''
                }`}
              >
                Embauche
              </button>
              <button
                onClick={() => onNavigateTab('bloc4')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'bloc4' ? 'text-slate-950 font-bold' : ''
                }`}
              >
                Onboarding
              </button>
              <button
                onClick={() => onNavigateTab('carrieres')}
                className={`hover:text-indigo-600 text-indigo-700 transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'carrieres' ? 'font-bold' : ''
                }`}
              >
                Portail Carrières
              </button>
              <button
                onClick={() => onNavigateTab('campus3d')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'campus3d' ? 'text-slate-950 font-bold' : ''
                }`}
              >
                Campus 3D
              </button>
              <button
                onClick={() => onNavigateTab('sql')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 font-medium ${
                  activeTab === 'sql' ? 'text-slate-950 font-bold' : ''
                }`}
              >
                Dossier SQL
              </button>
            </nav>

            {/* Zone 3 : Theme Switcher, Notifications & Role Selection */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Palette / Theme Chooser Button */}
              <button
                onClick={() => setShowThemeModal(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                title="Choisir la maquette de couleur"
              >
                <div
                  className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                  style={{ backgroundColor: currentTheme.primaryColor }}
                />
                <span className="hidden md:inline">Thème visuel</span>
              </button>

              {/* Notifications Button */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifDrawer(!showNotifDrawer)}
                  className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-rose-600 text-[10px] font-bold text-white rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifDrawer && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900">
                        Centre de notifications ({unreadCount} nouvelles)
                      </span>
                      <span className="text-[11px] text-slate-400">Temps réel</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-xs text-center text-slate-500">Aucune notification</div>
                      ) : (
                        notifications.slice(0, 6).map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                              !notif.lu ? 'bg-indigo-50/40' : ''
                            }`}
                            onClick={() => {
                              onMarkNotificationRead(notif.id);
                              if (notif.lien_onglet) {
                                onNavigateTab(notif.lien_onglet);
                                setShowNotifDrawer(false);
                              }
                            }}
                          >
                            <div className="flex items-start gap-2.5">
                              {notif.type === 'ACTION_REQUISE' ? (
                                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              ) : notif.type === 'ALERTE' ? (
                                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                              ) : (
                                <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-slate-900 leading-snug">
                                  {notif.titre}
                                </p>
                                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                                  {notif.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Role Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-colors text-left"
                >
                  <div
                    className="w-6 h-6 rounded-md text-white flex items-center justify-center text-xs font-semibold"
                    style={{ backgroundColor: currentTheme.primaryColor }}
                  >
                    {currentUser.prenom[0]}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-semibold text-slate-900 leading-tight">
                      {currentUser.prenom} {currentUser.nom}
                    </div>
                    <div className="text-[10px] text-slate-500">{roleLabels[currentRole].label}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showRoleMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50">
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Changer d'Espace de Travail
                      </p>
                    </div>
                    <div className="py-1">
                      {(Object.keys(roleLabels) as UserRole[]).map((roleKey) => (
                        <button
                          key={roleKey}
                          onClick={() => {
                            onSwitchRole(roleKey);
                            setShowRoleMenu(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs flex items-start gap-2.5 hover:bg-slate-50 transition-colors ${
                            currentRole === roleKey ? 'bg-slate-100/80 text-slate-900 font-semibold' : 'text-slate-700'
                          }`}
                        >
                          <UserCheck
                            className={`w-4 h-4 mt-0.5 shrink-0 ${
                              currentRole === roleKey ? 'text-indigo-600' : 'text-slate-400'
                            }`}
                          />
                          <div>
                            <div>{roleLabels[roleKey].label}</div>
                            <div className="text-[10px] text-slate-500 font-normal">{roleLabels[roleKey].desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Theme Selector Modal */}
      <ThemeSelectorModal isOpen={showThemeModal} onClose={() => setShowThemeModal(false)} />
    </>
  );
};
