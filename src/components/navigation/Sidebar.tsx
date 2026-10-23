/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Home,
  Briefcase,
  LayoutDashboard,
  Users,
  Search,
  FileCheck,
  UserCheck,
  ShieldCheck,
  Bell,
  LogIn,
  LogOut,
  UserPlus,
  Menu,
  X,
  Building2,
  ExternalLink,
  ChevronRight,
  Database,
  RefreshCw,
  PlusCircle
} from 'lucide-react';
import { UserRole, Utilisateur, NotificationItem } from '../../types/sirh';
import { ROLE_CONFIGS, getTabLabel } from '../../config/rolePermissions';

interface SidebarProps {
  currentRole: UserRole;
  currentUser: Utilisateur;
  isAuthenticated: boolean;
  notifications: NotificationItem[];
  activeTab: string;
  dbStatus?: 'connecting' | 'connected' | 'fallback' | 'error';
  dbInfo?: any;
  onSyncDb?: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenAuth: (rolePrompt?: string, mode?: 'login' | 'register') => void;
  onLogout: () => void;
  onMarkNotificationRead: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  currentUser,
  isAuthenticated,
  notifications,
  activeTab,
  dbStatus = 'fallback',
  dbInfo,
  onSyncDb,
  onNavigateTab,
  onOpenAuth,
  onLogout,
  onMarkNotificationRead,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.lu);

  // Check if current session is in Back-Office mode
  const isBackOffice =
    isAuthenticated && ['RH', 'MANAGER', 'FINANCE', 'DIRECTION', 'ADMIN'].includes(currentRole);

  const roleConfig = ROLE_CONFIGS[currentRole];

  // Map icon to tab id
  const getTabIcon = (tabId: string) => {
    switch (tabId) {
      case 'employe':
        return Home;
      case 'carrieres':
        return Briefcase;
      case 'dashboard':
        return LayoutDashboard;
      case 'bloc1':
        return Users;
      case 'creation-poste':
        return PlusCircle;
      case 'bloc2':
        return Search;
      case 'bloc3':
        return FileCheck;
      case 'bloc4':
        return UserCheck;
      case 'audit':
        return ShieldCheck;
      default:
        return Home;
    }
  };

  const handleNavClick = (tabId: string) => {
    setMobileOpen(false);
    onNavigateTab(tabId);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 border-r border-slate-800/80">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
        <div
          onClick={() => {
            onNavigateTab(isBackOffice ? roleConfig.defaultTab : 'employe');
            setMobileOpen(false);
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
              SIRH Entreprise
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              {isBackOffice ? `Back-Office ${roleConfig.title.split(' ')[0]}` : 'Portail Collaborateurs'}
            </div>
          </div>
        </div>

        {/* Notifications (available in back-office) */}
        {isBackOffice && (
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-950" />
              )}
            </button>

            {/* Quick Notifications Dropdown */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-3 z-50 animate-fade-in text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <span className="font-semibold text-white">Notifications ({unreadNotifs.length})</span>
                  <button
                    onClick={() => setShowNotifMenu(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="max-h-56 overflow-y-auto space-y-2">
                  {notifications.slice(0, 4).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        onMarkNotificationRead(notif.id);
                        if (notif.lien_onglet) handleNavClick(notif.lien_onglet);
                      }}
                      className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                        notif.lu ? 'bg-slate-800/40 text-slate-400' : 'bg-indigo-950/40 text-indigo-200 border border-indigo-900/50'
                      }`}
                    >
                      <div className="font-semibold text-white text-[11px] truncate">
                        {notif.titre}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                        {notif.message}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Links strictly based on role */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {!isBackOffice ? (
          /* =========================================================================
             FRONT-OFFICE MODE (Visiteur & Salarié)
             Only public & employee pages — NO RH/decision menus at all!
          ========================================================================= */
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Espace Public & Salarié
            </div>
            <div className="space-y-1 pt-1">
              <button
                onClick={() => handleNavClick('employe')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  activeTab === 'employe'
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Home className={`w-4 h-4 ${activeTab === 'employe' ? 'text-white' : 'text-slate-400'}`} />
                  <span>Espace Salarié (Accueil)</span>
                </div>
              </button>

              <button
                onClick={() => handleNavClick('carrieres')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  activeTab === 'carrieres'
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className={`w-4 h-4 ${activeTab === 'carrieres' ? 'text-white' : 'text-slate-400'}`} />
                  <span>Offres d'Emploi</span>
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* =========================================================================
             BACK-OFFICE MODE (RH, MANAGER, FINANCE, DIRECTION, ADMIN)
             Strictly filters allowedTabs defined in rolePermissions.ts
          ========================================================================= */
          <div className="space-y-4">
            <div>
              <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
                {roleConfig.badgeLabel}
              </div>

              <div className="space-y-1 pt-2">
                {roleConfig.allowedTabs.map((tabId) => {
                  const Icon = getTabIcon(tabId);
                  const isActive = activeTab === tabId;
                  const label = getTabLabel(currentRole, tabId);

                  return (
                    <button
                      key={tabId}
                      onClick={() => handleNavClick(tabId)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span className="truncate">{label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick access back to Front-Office (Espace Salarié) for back-office users */}
            <div className="pt-3 border-t border-slate-800/60">
              <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Aperçu Front-Office
              </div>
              <button
                onClick={() => handleNavClick('employe')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  activeTab === 'employe'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>Site Public / Salarié</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Database Connection Status */}
      <div className="px-3 py-2 border-t border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Database className={`w-3.5 h-3.5 shrink-0 ${
              dbStatus === 'connected' ? 'text-emerald-400' : dbStatus === 'connecting' ? 'text-blue-400 animate-spin' : 'text-amber-400'
            }`} />
            <div className="truncate">
              <div className="text-[10px] font-semibold flex items-center gap-1 text-slate-300">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  dbStatus === 'connected' ? 'bg-emerald-400' : dbStatus === 'connecting' ? 'bg-blue-400 animate-pulse' : 'bg-amber-400'
                }`} />
                <span className="truncate">
                  {dbStatus === 'connected' ? 'Neon PostgreSQL' : dbStatus === 'connecting' ? 'Connexion Neon...' : 'Mode Démo / Local'}
                </span>
              </div>
              <p className="text-[9px] text-slate-400 truncate" title={dbInfo?.message || (dbStatus === 'connected' ? 'Base synchronisée' : 'En attente de DATABASE_URL')}>
                {dbStatus === 'connected'
                  ? (dbInfo?.databaseName ? `${dbInfo.databaseName} (Synchro ${dbInfo.lastSyncedAt || 'OK'})` : 'Connecté à Neon')
                  : 'Cache local actif'}
              </p>
            </div>
          </div>
          {onSyncDb && (
            <button
              onClick={onSyncDb}
              disabled={dbStatus === 'connecting'}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 disabled:opacity-50"
              title="Tester la connexion et synchroniser avec Neon"
            >
              <RefreshCw className={`w-3 h-3 ${dbStatus === 'connecting' ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* User / Authentication Status Footer */}
      <div className="p-3 border-t border-slate-800/60 bg-slate-900/40">
        {isBackOffice ? (
          /* Back-Office User Profile with Déconnexion button ONLY (No "changer de rôle") */
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center text-xs font-bold shrink-0">
                  {currentUser.prenom[0]}
                  {currentUser.nom[0]}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {currentUser.prenom} {currentUser.nom}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{currentUser.role}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-950/40 hover:text-rose-300 text-slate-300 text-xs font-medium transition-colors flex items-center justify-center gap-2 border border-slate-700/60"
              title="Quitter le Back-Office et revenir au site public"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Déconnexion</span>
            </button>
          </div>
        ) : (
          /* Front-Office Visitor: Pure Connexion button + Inscription */
          <div className="space-y-2 p-1">
            <div className="text-[11px] text-slate-400 px-1">
              Portail Public & Salariés
            </div>
            <button
              onClick={() => onOpenAuth(undefined, 'login')}
              className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Connexion</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Navigation */}
      <div className="md:hidden bg-slate-950 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40">
        <div
          onClick={() => onNavigateTab(isBackOffice ? roleConfig.defaultTab : 'employe')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold">
            {isBackOffice ? `SIRH ${currentRole}` : 'SIRH Entreprise'}
          </span>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-full h-full shadow-2xl z-10 animate-slide-right">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
