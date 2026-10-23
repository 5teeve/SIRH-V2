/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Lock,
  UserPlus,
  LogIn,
  ShieldCheck,
  CheckCircle2,
  Mail,
  KeyRound,
  Info
} from 'lucide-react';
import { sirhStore, SirhState } from '../../store/sirhStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: SirhState;
  targetRolePrompt?: string | null;
  initialTab?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  state,
  targetRolePrompt,
  initialTab = 'login',
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Register form state
  const [regNom, setRegNom] = useState('');
  const [regPrenom, setRegPrenom] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMatricule, setRegMatricule] = useState('');
  const [regDeptId, setRegDeptId] = useState(state.departements[0]?.id || '');
  const [regPassword, setRegPassword] = useState('');
  const [successNotif, setSuccessNotif] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMsg('Veuillez saisir votre adresse email.');
      return;
    }

    const trimmedEmail = emailInput.trim().toLowerCase();
    const foundUser = state.users.find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    if (foundUser) {
      sirhStore.loginUser(foundUser);
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setErrorMsg(
        "Adresse email non reconnue. Utilisez l'un des comptes du système ou inscrivez-vous en tant que collaborateur."
      );
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNom.trim() || !regPrenom.trim() || !regEmail.trim()) {
      setErrorMsg('Le nom, le prénom et l’email sont requis.');
      return;
    }

    const newUser = sirhStore.registerEmploye({
      nom: regNom.trim(),
      prenom: regPrenom.trim(),
      email: regEmail.trim(),
      matricule: regMatricule.trim() || undefined,
      departement_id: regDeptId,
    });

    setSuccessNotif(`Compte créé pour ${newUser.prenom} ${newUser.nom} !`);
    setTimeout(() => {
      if (onSuccess) onSuccess();
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-indigo-400">
              Espace d'Authentification
            </span>
          </div>

          <h2 className="text-lg font-bold tracking-tight">
            {activeTab === 'login' ? 'Connexion Espace Sécurisé' : 'Inscription Nouveau Collaborateur'}
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {targetRolePrompt
              ? `${targetRolePrompt}`
              : "Connectez-vous pour accéder à votre espace de gestion personnalisé."}
          </p>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 mt-4 p-1 bg-slate-800/80 rounded-xl">
            <button
              onClick={() => {
                setActiveTab('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Connexion</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setErrorMsg('');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>S'inscrire (Salarié)</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {errorMsg}
            </div>
          )}

          {successNotif && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotif}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email professionnel
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="ex: rh.recrutement@sirh-entreprise.mg"
                    className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Se Connecter</span>
              </button>

              {/* Discreet Demo Account Hint */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mb-1.5">
                  <Info className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Identifiants de démonstration pour tester :</span>
                </div>
                <div className="text-[10px] text-slate-500 space-y-1 font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div
                    onClick={() => setEmailInput('rh.recrutement@sirh-entreprise.mg')}
                    className="cursor-pointer hover:text-indigo-600 transition-colors flex justify-between"
                  >
                    <span>RH : rh.recrutement@sirh-entreprise.mg</span>
                    <span className="text-slate-400 font-sans">Cliquer</span>
                  </div>
                  <div
                    onClick={() => setEmailInput('manager.tech@sirh-entreprise.mg')}
                    className="cursor-pointer hover:text-indigo-600 transition-colors flex justify-between"
                  >
                    <span>Manager : manager.tech@sirh-entreprise.mg</span>
                    <span className="text-slate-400 font-sans">Cliquer</span>
                  </div>
                  <div
                    onClick={() => setEmailInput('finance.controle@sirh-entreprise.mg')}
                    className="cursor-pointer hover:text-indigo-600 transition-colors flex justify-between"
                  >
                    <span>Finance : finance.controle@sirh-entreprise.mg</span>
                    <span className="text-slate-400 font-sans">Cliquer</span>
                  </div>
                  <div
                    onClick={() => setEmailInput('direction.dg@sirh-entreprise.mg')}
                    className="cursor-pointer hover:text-indigo-600 transition-colors flex justify-between"
                  >
                    <span>Direction : direction.dg@sirh-entreprise.mg</span>
                    <span className="text-slate-400 font-sans">Cliquer</span>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={regPrenom}
                    onChange={(e) => setRegPrenom(e.target.value)}
                    placeholder="Mamy"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={regNom}
                    onChange={(e) => setRegNom(e.target.value)}
                    placeholder="Ranaivo"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email professionnel *
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="mamy.ranaivo@sirh-entreprise.mg"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Matricule (optionnel)
                  </label>
                  <input
                    type="text"
                    value={regMatricule}
                    onChange={(e) => setRegMatricule(e.target.value)}
                    placeholder="EMP-2026-0045"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Département
                  </label>
                  <select
                    value={regDeptId}
                    onChange={(e) => setRegDeptId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                  >
                    {state.departements.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Créer mon Compte Collaborateur</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
