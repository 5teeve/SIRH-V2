/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  UserCheck,
  UserMinus,
  Briefcase,
  Activity,
  Layers,
  Calendar,
  Filter,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { SirhState } from '../../store/sirhStore';
import { useTheme } from '../../theme/themeContext';

interface AnalyticsChartsProps {
  state: SirhState;
  onNavigateTab?: (tab: string) => void;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ state, onNavigateTab }) => {
  const { currentTheme } = useTheme();
  const [timeRange, setTimeRange] = useState<'6m' | '12m' | 'q3'>('6m');
  const [recruitmentChartType, setRecruitmentChartType] = useState<'area' | 'bar'>('area');
  const [activeTabMetric, setActiveTabMetric] = useState<'all' | 'cadres' | 'technique'>('all');

  // Real-time metrics computed directly from state
  const totalCandidaturesNow = state.candidatures.length;
  const totalEntretiensNow = state.entretiens.length;
  const totalEmbauchesNow = state.employes.length;
  const totalContratsSignes = state.contrats.filter((c) => ['SIGNE', 'VALIDE'].includes(c.statut)).length;
  const effectifTotalEnPoste = state.postes.reduce((acc, p) => acc + p.effectif_pourvu, 0) + totalEmbauchesNow;

  // Monthly recruitment trend dataset reactive to current state for the current month (Octobre 2026)
  const recruitmentMonthlyData = [
    {
      mois: 'Mai 2026',
      court: 'Mai',
      candidatures: 16,
      entretiens: 9,
      embauches: 3,
      tauxConversion: 18.7,
    },
    {
      mois: 'Juin 2026',
      court: 'Juin',
      candidatures: 24,
      entretiens: 14,
      embauches: 5,
      tauxConversion: 20.8,
    },
    {
      mois: 'Juil 2026',
      court: 'Juil',
      candidatures: 19,
      entretiens: 11,
      embauches: 3,
      tauxConversion: 15.7,
    },
    {
      mois: 'Août 2026',
      court: 'Août',
      candidatures: 14,
      entretiens: 8,
      embauches: 2,
      tauxConversion: 14.2,
    },
    {
      mois: 'Sept 2026',
      court: 'Sept',
      candidatures: 28,
      entretiens: 15,
      embauches: 6,
      tauxConversion: 21.4,
    },
    {
      mois: 'Oct 2026 (En cours)',
      court: 'Oct (Live)',
      candidatures: Math.max(22, totalCandidaturesNow + 18),
      entretiens: Math.max(12, totalEntretiensNow + 9),
      embauches: Math.max(4, totalEmbauchesNow + totalContratsSignes + 2),
      tauxConversion: 22.5,
    },
  ];

  // Turnover (taux de rotation du personnel) monthly data
  // Turnover = ((Arrivées + Départs) / 2) / Effectif Moyen * 100
  const turnoverMonthlyData = [
    {
      mois: 'Mai 2026',
      court: 'Mai',
      arrivees: 3,
      departs: 1,
      soldeNet: 2,
      effectifFinMois: 42,
      turnoverPct: 4.8,
      retentionPct: 95.2,
      seuilAlerte: 6.0,
    },
    {
      mois: 'Juin 2026',
      court: 'Juin',
      arrivees: 5,
      departs: 0,
      soldeNet: 5,
      effectifFinMois: 47,
      turnoverPct: 5.4,
      retentionPct: 94.6,
      seuilAlerte: 6.0,
    },
    {
      mois: 'Juil 2026',
      court: 'Juil',
      arrivees: 3,
      departs: 1,
      soldeNet: 2,
      effectifFinMois: 49,
      turnoverPct: 4.1,
      retentionPct: 95.9,
      seuilAlerte: 6.0,
    },
    {
      mois: 'Août 2026',
      court: 'Août',
      arrivees: 2,
      departs: 1,
      soldeNet: 1,
      effectifFinMois: 50,
      turnoverPct: 3.0,
      retentionPct: 97.0,
      seuilAlerte: 6.0,
    },
    {
      mois: 'Sept 2026',
      court: 'Sept',
      arrivees: 6,
      departs: 1,
      soldeNet: 5,
      effectifFinMois: 55,
      turnoverPct: 3.8,
      retentionPct: 96.2,
      seuilAlerte: 6.0,
    },
    {
      mois: 'Oct 2026',
      court: 'Oct (Live)',
      arrivees: Math.max(4, totalEmbauchesNow + 2),
      departs: 1,
      soldeNet: Math.max(3, totalEmbauchesNow + 1),
      effectifFinMois: 55 + Math.max(3, totalEmbauchesNow + 1),
      turnoverPct: 3.4,
      retentionPct: 96.6,
      seuilAlerte: 6.0,
    },
  ];

  // Department distribution
  const deptData = state.departements.map((dept) => {
    const postesDept = state.postes.filter((p) => p.departement_id === dept.id);
    const autorise = postesDept.reduce((acc, p) => acc + p.effectif_autorise, 0);
    const pourvu = postesDept.reduce((acc, p) => acc + p.effectif_pourvu, 0);
    const demandes = state.demandes.filter((d) => d.departement_id === dept.id).length;

    return {
      nom: dept.nom.replace('Direction ', 'Dir. '),
      code: dept.code,
      autorise,
      pourvu,
      vacant: Math.max(0, autorise - pourvu),
      demandes,
      tauxRemplissage: autorise > 0 ? Math.round((pourvu / autorise) * 100) : 0,
    };
  });

  // Global aggregate KPIs
  const avgTurnover = (
    turnoverMonthlyData.reduce((acc, d) => acc + d.turnoverPct, 0) / turnoverMonthlyData.length
  ).toFixed(1);
  const avgRetention = (100 - Number(avgTurnover)).toFixed(1);
  const totalArrivees = turnoverMonthlyData.reduce((acc, d) => acc + d.arrivees, 0);
  const totalDeparts = turnoverMonthlyData.reduce((acc, d) => acc + d.departs, 0);
  const soldeNetCumule = totalArrivees - totalDeparts;

  // Custom tooltips for elegant corporate styling
  const CustomRecruitmentTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[200px]">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1">{label}</div>
          {payload.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}:
              </span>
              <span className="font-mono font-bold text-white">{item.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomTurnoverTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[210px]">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1">{label}</div>
          {payload.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}:
              </span>
              <span className="font-mono font-bold text-white">
                {typeof item.value === 'number' && item.name.includes('%') ? `${item.value}%` : item.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Section Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Indicateurs Visuels & Tendances RH (Recharts Analytics)
            </h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded-full">
              Temps Réel
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Évolution chronologique des flux d'embauche, volume des candidatures et rotation du personnel (turnover).
          </p>
        </div>

        {/* Timeframe Controls */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setTimeRange('6m')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              timeRange === '6m' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            6 Derniers Mois
          </button>
          <button
            onClick={() => setTimeRange('12m')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              timeRange === '12m' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Année 2026
          </button>
          <button
            onClick={() => setTimeRange('q3')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              timeRange === 'q3' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Vue Trimestrielle
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Micro-Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Taux de Rotation Global</span>
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-slate-900">{avgTurnover}%</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Sain (&lt; 5%)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Moyenne semestrielle stabilisée
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Taux de Rétention</span>
            <UserCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-slate-900">{avgRetention}%</span>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
              Élevé
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Fidélisation des talents clés
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Solde Net des Effectifs</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-slate-900">+{soldeNetCumule}</span>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
              +{totalArrivees} / -{totalDeparts}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Croissance nette de la masse salariale
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Délai Moyen d'Embauche</span>
            <Briefcase className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-slate-900">21 j</span>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
              Cible &le; 25j
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Du dépôt d'offre au contrat signé
          </div>
        </div>
      </div>

      {/* 2 Main Visual Analytics Charts (Grid 2-cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: Évolution des Recrutements */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: currentTheme.accentColor }}
                />
                <h4 className="text-sm font-bold text-slate-900">
                  Évolution des Recrutements & Pipeline Candidats
                </h4>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Volume mensuel des candidatures, entretiens passés et embauches finalisées
              </p>
            </div>

            {/* Toggle Area vs Bar */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setRecruitmentChartType('area')}
                className={`px-2 py-1 rounded-md transition-all ${
                  recruitmentChartType === 'area'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Aires
              </button>
              <button
                onClick={() => setRecruitmentChartType('bar')}
                className={`px-2 py-1 rounded-md transition-all ${
                  recruitmentChartType === 'bar'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Barres
              </button>
            </div>
          </div>

          {/* Recharts Area / Bar Chart Container */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {recruitmentChartType === 'area' ? (
                <AreaChart data={recruitmentMonthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCandidatures" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorEntretiens" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorEmbauches" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="court" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomRecruitmentTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
                    iconType="circle"
                    formatter={(val) => <span className="text-slate-600 font-medium">{val}</span>}
                  />
                  <Area
                    type="monotone"
                    dataKey="candidatures"
                    name="Candidatures Reçues"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCandidatures)"
                  />
                  <Area
                    type="monotone"
                    dataKey="entretiens"
                    name="Entretiens & Évaluations"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorEntretiens)"
                  />
                  <Area
                    type="monotone"
                    dataKey="embauches"
                    name="Embauches Finalisées"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorEmbauches)"
                  />
                </AreaChart>
              ) : (
                <BarChart data={recruitmentMonthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="court" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomRecruitmentTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
                    iconType="circle"
                    formatter={(val) => <span className="text-slate-600 font-medium">{val}</span>}
                  />
                  <Bar dataKey="candidatures" name="Candidatures Reçues" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="entretiens" name="Entretiens & Évaluations" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="embauches" name="Embauches Finalisées" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Footer Insight */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>
              Taux de conversion global candidatures &rarr; embauches :{' '}
              <strong className="text-slate-800 font-mono">20.4%</strong>
            </span>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('bloc2')}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Gérer les viviers &rarr;
              </button>
            )}
          </div>
        </div>

        {/* CHART 2: Taux de Rotation du Personnel (Turnover & Flux) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <h4 className="text-sm font-bold text-slate-900">
                  Taux de Rotation (Turnover) & Flux d'Arrivées / Départs
                </h4>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Indice de renouvellement mensuel et balance des entrées / sorties
              </p>
            </div>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 font-mono">
              Seuil d'alerte : 6.0%
            </span>
          </div>

          {/* Recharts Composed Chart (Bars for Arrivals/Departures + Line for Turnover %) */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={turnoverMonthlyData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="court" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  label={{ value: 'Collaborateurs', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94a3b8' }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 10]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  unit="%"
                />
                <Tooltip content={<CustomTurnoverTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
                  iconType="circle"
                  formatter={(val) => <span className="text-slate-600 font-medium">{val}</span>}
                />
                <ReferenceLine
                  yAxisId="right"
                  y={6.0}
                  label={{ value: 'Seuil max recommandé (6%)', fill: '#f43f5e', fontSize: 10, position: 'insideTopRight' }}
                  stroke="#f43f5e"
                  strokeDasharray="4 4"
                />
                <Bar yAxisId="left" dataKey="arrivees" name="Nouvelles Arrivées" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="left" dataKey="departs" name="Départs & Démissions" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="turnoverPct"
                  name="Taux de Turnover (%)"
                  stroke="#d97706"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#d97706' }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Footer Insight */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>
              Turnover maîtrisé :{' '}
              <strong className="text-emerald-700 font-mono">3.4%</strong> ce mois (en-dessous de la limite sectorielle)
            </span>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('bloc4')}
                className="text-rose-600 font-semibold hover:underline"
              >
                Parcours d'intégration &rarr;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CHART 3: Répartition par Département & Taux de Remplissage */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Effectifs & Vacance par Département
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparatif des postes pourvus par rapport aux postes autorisés par la Direction Générale
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-sm bg-slate-900" />
              Effectif Pourvu
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-sm bg-blue-200" />
              Postes Vacants
            </span>
          </div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={deptData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis
                dataKey="nom"
                type="category"
                tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                width={160}
              />
              <Tooltip
                formatter={(value: any, name: any) => [
                  `${value} postes`,
                  name === 'pourvu' ? 'Pourvus' : name === 'vacant' ? 'Vacants' : 'Autorisés',
                ]}
              />
              <Bar dataKey="pourvu" name="pourvu" stackId="a" fill="#0f172a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="vacant" name="vacant" stackId="a" fill="#93c5fd" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
