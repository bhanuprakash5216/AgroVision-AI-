"use client";

import React from "react";
import { 
  Sprout, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Droplets, 
  CloudSun, 
  TrendingUp, 
  History,
  Layers,
  Calendar,
  Eye
} from "lucide-react";
import { CompletePlantAnalysis } from "@/lib/types";

interface FarmerDashboardProps {
  currentAnalysis: CompletePlantAnalysis;
  historyList: CompletePlantAnalysis[];
  onSelectHistory: (analysis: CompletePlantAnalysis) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  currentAnalysis,
  historyList,
  onSelectHistory
}) => {
  // Pre-configured crop monitoring inventory for the farmer
  const farmCrops = [
    {
      name: "Tomato (Hybrid 6242)",
      plot: "Plot A - North Polyhouse",
      acres: "2.4 Acres",
      status: "Needs Attention",
      statusColor: "text-amber-400 bg-amber-500/20 border-amber-500/30",
      indicator: "🟡",
      diseaseNote: "Early Blight spotted on 4% lower canopy",
      wateringNote: "Do not irrigate today (rain expected)"
    },
    {
      name: "Chilli (G4 Green)",
      plot: "Plot B - East Field",
      acres: "1.8 Acres",
      status: "Healthy",
      statusColor: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30",
      indicator: "🟢",
      diseaseNote: "No foliar fungal or bacterial lesions",
      wateringNote: "Drip irrigation scheduled tomorrow morning"
    },
    {
      name: "Brinjal (Eggplant Purple)",
      plot: "Plot C - South Terrace",
      acres: "1.2 Acres",
      status: "Disease Detected",
      statusColor: "text-rose-400 bg-rose-500/20 border-rose-500/30",
      indicator: "🔴",
      diseaseNote: "Phomopsis fruit rot observed in perimeter",
      wateringNote: "Withhold overhead sprinkler to dry canopy"
    }
  ];

  return (
    <section id="farmer-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-emerald-500/20 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>CENTRAL FARM TELEMETRY HUB</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
            Farmer Operations Dashboard
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/70 mt-1">
            Real-time status overview of farm plots, disease monitoring alerts, soil water status, and diagnosis log.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-xs font-mono text-emerald-300">
            Farm ID: #AGRI-CHITTOOR-701
          </div>
        </div>
      </div>

      {/* Top 3 Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="glass-panel p-6 rounded-3xl border-emerald-500/30 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <Sprout className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs text-emerald-200/70 uppercase font-mono">Monitored Acreage</div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-heading">5.4 Acres</div>
            <div className="text-[11px] text-emerald-400">3 Distinct Field Plots</div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border-amber-500/30 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs text-emerald-200/70 uppercase font-mono">Active Disease Alerts</div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-heading">2 Plots</div>
            <div className="text-[11px] text-amber-200/70">Tomato (Early Blight), Brinjal</div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border-cyan-500/30 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Droplets className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs text-cyan-200/70 uppercase font-mono">Water Optimization</div>
            <div className="text-2xl sm:text-3xl font-bold text-cyan-300 font-heading">32,000 L</div>
            <div className="text-[11px] text-cyan-200/70">Estimated water saved this week</div>
          </div>
        </div>
      </div>

      {/* Main Grid: My Crops Status & Live Telemetry Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Column: My Crops Status Table */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border-emerald-500/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <h4 className="text-xl font-bold text-white font-heading">My Crops Field Inventory</h4>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-1 rounded border border-emerald-500/30">
              Live Health Tracking
            </span>
          </div>

          <div className="space-y-4">
            {farmCrops.map((crop, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 hover:border-emerald-500/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <h5 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{crop.indicator}</span>
                      <span>{crop.name}</span>
                    </h5>
                    <div className="text-xs text-emerald-100/60 font-mono">
                      {crop.plot} • {crop.acres}
                    </div>
                  </div>

                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border self-start sm:self-auto ${crop.statusColor}`}>
                    {crop.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-3 border-t border-emerald-500/10">
                  <div>
                    <span className="text-emerald-100/50 block">Health Advisory:</span>
                    <span className="text-emerald-200">{crop.diseaseNote}</span>
                  </div>
                  <div>
                    <span className="text-emerald-100/50 block">Irrigation Plan:</span>
                    <span className="text-cyan-200">{crop.wateringNote}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Environmental & Agronomic Status */}
        <div className="lg:col-span-5 space-y-6">
          {/* Current Live Weather Widget */}
          <div className="glass-panel p-6 rounded-3xl border-emerald-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-amber-400" />
                <h4 className="text-lg font-bold text-white font-heading">Microclimate Weather</h4>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">Open-Meteo High-Res</span>
            </div>

            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="text-4xl font-extrabold text-white font-mono">
                  {currentAnalysis.weather.temperature}°C
                </span>
                <span className="text-xs text-emerald-100/60 block mt-0.5">
                  {currentAnalysis.weather.location_name}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-cyan-300 block">
                  {currentAnalysis.weather.rain_probability}% Rain Chance
                </span>
                <span className="text-xs text-emerald-100/50">
                  Humidity: {currentAnalysis.weather.humidity}%
                </span>
              </div>
            </div>

            <p className="text-xs text-emerald-100/70 bg-black/40 p-3 rounded-xl border border-emerald-500/20 leading-relaxed">
              {currentAnalysis.weather.forecast_summary}
            </p>
          </div>

          {/* Plant Health Scorecard */}
          <div className="glass-panel p-6 rounded-3xl border-emerald-500/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-emerald-400 uppercase">Farm Canopy Health Index</span>
              <span className="text-sm font-bold text-emerald-300 font-mono">78 / 100</span>
            </div>
            <div className="w-full bg-emerald-950 rounded-full h-2.5 overflow-hidden border border-emerald-500/20 mb-3">
              <div className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full w-[78%]" />
            </div>
            <p className="text-xs text-emerald-100/60">
              Composite score computed from visual foliage scans, soil moisture balance, and pathogen pressure.
            </p>
          </div>
        </div>
      </div>

      {/* Analysis History Log */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-emerald-500/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            <h4 className="text-xl font-bold text-white font-heading">Diagnostic Analysis History</h4>
          </div>
          <span className="text-xs font-mono text-emerald-400/80">
            Stored via MongoDB Atlas / In-Memory Store
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-emerald-500/20 text-emerald-400/80">
                <th className="pb-3 pr-4">Timestamp</th>
                <th className="pb-3 px-4">Crop</th>
                <th className="pb-3 px-4">Diagnosis</th>
                <th className="pb-3 px-4">Confidence</th>
                <th className="pb-3 px-4">Nutrient Deficiency</th>
                <th className="pb-3 pl-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/10 text-emerald-100/80">
              {historyList.map((item) => (
                <tr key={item.id} className="hover:bg-emerald-950/40 transition-colors">
                  <td className="py-3.5 pr-4 text-emerald-100/60">
                    {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    {item.cropIdentification.crop}
                  </td>
                  <td className="py-3.5 px-4 text-amber-300">
                    {item.diseaseResult.disease}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">
                    {Math.round(item.diseaseResult.confidence * 100)}%
                  </td>
                  <td className="py-3.5 px-4 text-emerald-200">
                    {item.nutrientIndication.possible_deficiency}
                  </td>
                  <td className="py-3.5 pl-4 text-right">
                    <button
                      onClick={() => onSelectHistory(item)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
