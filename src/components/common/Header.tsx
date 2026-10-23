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
  Palette,
  Briefcase,
  Layers,
  Sparkles
} from 'lucide-react';
import { UserRole, Utilisateur, NotificationItem } from '../../types/sirh';
import { useTheme } from '../../theme/themeContext';
import { ThemeSelectorModal } from './ThemeSelectorModal';
import { ROLE_CONFIGS, getTabLabel, getDefaultTabForRole } from '../../config/rolePermissions';

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

  const roleConfig = ROLE_CONFIGS[currentRole] || ROLE_CONFIGS.RH;
  const unreadCount = notifications.filter((n) => !n.lu).length;

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-6">
            {/* Zone 1 : Brand Title & Role Badge */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigateTab(roleConfig.defaultTab)}
                className="flex items-center gap-2.5 text-left group"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs transition-colors"
                  style={{ backgroundColor: currentTheme.primaryColor }}
                >
                  <Building className="w-5 h-5 text-white/90" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
                      SIRH Entreprise
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border hidden sm:inline-block ${roleConfig.badgeClass}`}
                    >
                      {roleConfig.badgeLabel}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block sm:hidden">
                    {roleConfig.badgeLabel}
                  </span>
                </div>
              </button>
            </div>

            {/* Zone 2 : Dynamic Role-Filtered Navigation Tabs */}
            <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600">
              {roleConfig.allowedTabs.map((tabId) => {
                const isActive = activeTab === tabId;
                const label = getTabLabel(currentRole, tabId);
                const isCarriere = tabId === 'carrieres';

                return (
                  <button
                    key={tabId}
                    onClick={() => onNavigateTab(tabId)}
                    className={`transition-colors whitespace-nowrap shrink-0 py-2 px-1 relative ${
                      isActive
                        ? 'text-slate-950 font-bold'
                        : isCarriere
                        ? 'text-indigo-600 hover:text-indigo-800'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    <span>{label}</span>
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                        style={{ backgroundColor: currentTheme.primaryColor }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3 : Theme Switcher, Notifications & Role Switcher */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Palette / Theme Chooser Button */}
              <button
                onClick={() => setShowThemeModal(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                title="Personnaliser la maquette de couleur"
              >
                <div
                  className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                  style={{ backgroundColor: currentTheme.primaryColor }}
                />
                <span className="hidden xl:inline">Thème</span>
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
                        Centre de notifications ({unreadCount} non lues)
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

              {/* Interactive Role Switcher Dropdown with Clear Context */}
              <div className="relative">
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-colors text-left"
                >
                  <div
                    className="w-6 h-6 rounded-md text-white flex items-center justify-center text-xs font-semibold shrink-0"
                    style={{ backgroundColor: currentTheme.primaryColor }}
                  >
                    {currentUser.prenom[0]}
                  </div>
                  <div className="hidden md:block">
                    <div className="text-xs font-semibold text-slate-900 leading-tight">
                      {currentUser.prenom} {currentUser.nom}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {roleConfig.title}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showRoleMenu && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          Changer d'Espace & Profil SIRH
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Chaque rôle dispose de son propre espace de travail et de ses prérogatives exclusives.
                        </p>
                      </div>
                    </div>
                    <div className="py-1.5 divide-y divide-slate-100/70 max-h-96 overflow-y-auto">
                      {(Object.keys(ROLE_CONFIGS) as UserRole[]).map((roleKey) => {
                        const itemConfig = ROLE_CONFIGS[roleKey];
                        const isCurrent = currentRole === roleKey;
                        const matchingUser = allUsers.find((u) => u.role === roleKey);

                        return (
                          <button
                            key={roleKey}
                            onClick={() => {
                              onSwitchRole(roleKey);
                              onNavigateTab(getDefaultTabForRole(roleKey));
                              setShowRoleMenu(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-xs flex items-start gap-3 hover:bg-slate-50 transition-colors ${
                              isCurrent ? 'bg-slate-100/80' : ''
                            }`}
                          >
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                isCurrent ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {roleKey[0]}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className={`font-semibold ${isCurrent ? 'text-slate-950 font-bold' : 'text-slate-800'}`}>
                                  {itemConfig.title}
                                </span>
                                {isCurrent && (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                    Actif
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                {itemConfig.description}
                              </p>
                              {matchingUser && (
                                <p className="text-[10px] text-indigo-600 mt-1 font-medium">
                                  Utilisateur : {matchingUser.prenom} {matchingUser.nom}
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navigation Strip (allowed tabs only) */}
          <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
            {roleConfig.allowedTabs.map((tabId) => {
              const isActive = activeTab === tabId;
              const label = getTabLabel(currentRole, tabId);
              return (
                <button
                  key={tabId}
                  onClick={() => onNavigateTab(tabId)}
                  className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Theme Selector Modal */}
      <ThemeSelectorModal isOpen={showThemeModal} onClose={() => setShowThemeModal(false)} />
    </>
  );
};
