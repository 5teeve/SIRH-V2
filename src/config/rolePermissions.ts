/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole } from '../types/sirh';

export interface RoleConfig {
  role: UserRole;
  title: string;
  subtitle: string;
  badgeLabel: string;
  badgeClass: string;
  defaultTab: string;
  allowedTabs: string[];
  tabLabels?: Record<string, string>;
  description: string;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  RH: {
    role: 'RH',
    title: 'Direction des Ressources Humaines',
    subtitle: 'Pilotage central du recrutement, des contrats et de l’intégration',
    badgeLabel: 'Espace RH & Talents',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    defaultTab: 'dashboard',
    allowedTabs: ['dashboard', 'bloc1', 'bloc2', 'bloc3', 'bloc4', 'carrieres', 'audit'],
    tabLabels: {
      dashboard: 'Tableau de bord',
      bloc1: 'Besoins en personnel',
      bloc2: 'Recrutement',
      bloc3: 'Embauche',
      bloc4: 'Onboarding',
      carrieres: 'Portail Carrières',
      audit: 'Journal d’Audit',
    },
    description: 'Gestion intégrale des 4 blocs SIRH, diffusion des offres et conformité légale.',
  },
  MANAGER: {
    role: 'MANAGER',
    title: 'Manager Technique & Opérationnel',
    subtitle: 'Expression des besoins, conduite des entretiens et accueil des équipes',
    badgeLabel: 'Espace Management & Équipe',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    defaultTab: 'dashboard',
    allowedTabs: ['dashboard', 'bloc1', 'bloc2', 'bloc4'],
    tabLabels: {
      dashboard: 'Espace Équipe',
      bloc1: 'Besoins de mon équipe',
      bloc2: 'Mes Entretiens Techniques',
      bloc4: 'Intégration équipe',
    },
    description: 'Exprime les besoins de recrutement du service, évalue les compétences techniques en entretien et parraine les nouveaux arrivants.',
  },
  FINANCE: {
    role: 'FINANCE',
    title: 'Direction Financière & Contrôle Budgétaire',
    subtitle: 'Arbitrage des enveloppes de masse salariale et visas budgétaires',
    badgeLabel: 'Espace Finance & Budgets',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    defaultTab: 'dashboard',
    allowedTabs: ['dashboard', 'bloc1', 'bloc3'],
    tabLabels: {
      dashboard: 'Pilotage Budgétaire',
      bloc1: 'Visas Budgétaires',
      bloc3: 'Validation Salaires',
    },
    description: 'Vérification de la conformité budgétaire des demandes et validation des packages de rémunération avant signature des contrats.',
  },
  DIRECTION: {
    role: 'DIRECTION',
    title: 'Direction Générale (DG)',
    subtitle: 'Supervision stratégique des effectifs et validation finale des postes',
    badgeLabel: 'Espace Gouvernance DG',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    defaultTab: 'dashboard',
    allowedTabs: ['dashboard', 'bloc1', 'carrieres', 'audit'],
    tabLabels: {
      dashboard: 'Tableau Stratégique',
      bloc1: 'Arbitrages DG',
      carrieres: 'Portail Carrières',
      audit: 'Audit & Conformité',
    },
    description: 'Pilotage macro-économique des ressources, validation des créations de postes et suivi des indicateurs de turnover.',
  },
  ADMIN: {
    role: 'ADMIN',
    title: 'Administrateur Système SIRH',
    subtitle: 'Configuration technique, schémas de données, audit et sécurité',
    badgeLabel: 'Console Administration',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
    defaultTab: 'dashboard',
    allowedTabs: ['dashboard', 'bloc1', 'bloc2', 'bloc3', 'bloc4', 'carrieres', 'audit', 'sql'],
    tabLabels: {
      dashboard: 'Console Système',
      bloc1: 'Besoins',
      bloc2: 'Recrutement',
      bloc3: 'Embauche',
      bloc4: 'Onboarding',
      carrieres: 'Portail Carrières',
      audit: 'Journal d’Audit',
      sql: 'Dossier SQL',
    },
    description: 'Supervision globale de l’infrastructure, dictionnaire SQL, référentiels et droits d’accès.',
  },
  EMPLOYE: {
    role: 'EMPLOYE',
    title: 'Espace Salarié & Collaborateur',
    subtitle: 'Mon contrat de travail, mon parcours d’intégration et mes opportunités',
    badgeLabel: 'Mon Espace Collaborateur',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    defaultTab: 'espace_employe',
    allowedTabs: ['espace_employe', 'carrieres'],
    tabLabels: {
      espace_employe: 'Mon Espace Collaborateur',
      carrieres: 'Offres & Mobilité',
    },
    description: 'Consultation du contrat de travail, suivi des étapes d’onboarding personnel et candidature aux opportunités de mobilité interne.',
  },
};

export function isTabAllowed(role: UserRole, tab: string): boolean {
  const config = ROLE_CONFIGS[role];
  if (!config) return false;
  return config.allowedTabs.includes(tab);
}

export function getDefaultTabForRole(role: UserRole): string {
  const config = ROLE_CONFIGS[role];
  return config ? config.defaultTab : 'dashboard';
}

export function getTabLabel(role: UserRole, tabId: string): string {
  const config = ROLE_CONFIGS[role];
  if (config && config.tabLabels && config.tabLabels[tabId]) {
    return config.tabLabels[tabId];
  }
  const defaultLabels: Record<string, string> = {
    dashboard: 'Tableau de bord',
    bloc1: 'Besoins en personnel',
    bloc2: 'Recrutement',
    bloc3: 'Embauche',
    bloc4: 'Onboarding',
    carrieres: 'Portail Carrières',
    audit: 'Journal d’Audit',
    sql: 'Dossier SQL',
    espace_employe: 'Mon Espace Collaborateur',
  };
  return defaultLabels[tabId] || tabId;
}
