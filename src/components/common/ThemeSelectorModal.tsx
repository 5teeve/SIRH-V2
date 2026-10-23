/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Palette, Check, Sparkles, X } from 'lucide-react';
import { useTheme, ColorThemeId } from '../../theme/themeContext';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({ isOpen, onClose }) => {
  const { currentTheme, themeId, setTheme, availableThemes } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Palette className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Personnalisation de la Maquette de Couleur
              </h3>
              <p className="text-xs text-slate-500">
                Sélectionnez l'ambiance graphique qui correspond à vos préférences visuelles.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Themes Grid */}
        <div className="mt-6 space-y-3">
          {availableThemes.map((theme) => {
            const isSelected = themeId === theme.id;

            return (
              <div
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50/80 shadow-md ring-2 ring-slate-900/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    {isSelected && <Check className="w-5 h-5 stroke-[2.5]" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{theme.name}</h4>
                      {isSelected && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded-full">
                          Actif
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{theme.tagline}</p>
                  </div>
                </div>

                {/* Color Swatches */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {theme.swatches.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>La palette choisie s'applique immédiatement et est sauvegardée dans vos préférences.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors shadow-xs"
          >
            Appliquer et Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
