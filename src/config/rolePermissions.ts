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
    allowedTabs: ['dashboard', 'bloc1', 'creation-poste', 'bloc2', 'bloc3', 'bloc4', 'carrieres', 'audit'],
    tabLabels: {
      dashboard: 'Tableau de bord',
      bloc1: 'Besoins en personnel',
      'creation-poste': 'Créer un Poste',
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
    allowedTabs: ['dashboard', 'bloc1', 'creation-poste', 'bloc2', 'bloc4'],
    tabLabels: {
      dashboard: 'Espace Équipe',
      bloc1: 'Besoins de mon équipe',
      'creation-poste': 'Créer un Poste',
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
    allowedTabs: ['dashboard', 'bloc1', 'creation-poste', 'carrieres', 'audit'],
    tabLabels: {
      dashboard: 'Tableau Stratégique',
      bloc1: 'Arbitrages DG',
      'creation-poste': 'Créer un Poste',
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
    allowedTabs: ['dashboard', 'bloc1', 'creation-poste', 'bloc2', 'bloc3', 'bloc4', 'carrieres', 'audit'],
    tabLabels: {
      dashboard: 'Console Système',
      bloc1: 'Besoins en personnel',
      'creation-poste': 'Créer un Poste',
      bloc2: 'Recrutement & Candidats',
      bloc3: 'Embauche & Contrats',
      bloc4: 'Onboarding & Parcours',
      carrieres: 'Portail Carrières',
      audit: 'Journal d’Audit',
    },
    description: 'Supervision globale de l’infrastructure, référentiels et droits d’accès.',
  },
  EMPLOYE: {
    role: 'EMPLOYE',
    title: 'Espace Salarié & Collaborateur',
    subtitle: 'Mon contrat de travail, mon parcours d’intégration et mes opportunités',
    badgeLabel: 'Mon Espace Collaborateur',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    defaultTab: 'employe',
    allowedTabs: ['employe', 'carrieres'],
    tabLabels: {
      employe: 'Espace Salarié (Accueil)',
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
  return config ? config.defaultTab : 'employe';
}

export function getTabLabel(role: UserRole, tabId: string): string {
  const config = ROLE_CONFIGS[role];
  if (config && config.tabLabels && config.tabLabels[tabId]) {
    return config.tabLabels[tabId];
  }
  const defaultLabels: Record<string, string> = {
    employe: 'Espace Salarié (Accueil)',
    dashboard: 'Tableau de bord',
    bloc1: 'Besoins en personnel',
    bloc2: 'Recrutement & Candidats',
    bloc3: 'Embauche & Contrats',
    bloc4: 'Onboarding & Parcours',
    carrieres: 'Portail Carrières',
    audit: 'Journal d’Audit',
  };
  return defaultLabels[tabId] || tabId;
}
