"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Leaf, 
  FlaskConical, 
  AlertTriangle, 
  Clock, 
  BookOpen, 
  Info,
  CheckCircle,
  FileCheck2
} from "lucide-react";
import { TreatmentItem } from "@/lib/types";

interface TreatmentSectionProps {
  treatments: TreatmentItem[];
  cropName: string;
  diseaseName: string;
}

export const TreatmentSection: React.FC<TreatmentSectionProps> = ({
  treatments,
  cropName,
  diseaseName
}) => {
  const [activeTab, setActiveTab] = useState<string>("All");

  const filteredTreatments = activeTab === "All"
    ? treatments
    : treatments.filter(t => t.treatment_type.includes(activeTab));

  return (
    <section id="treatment-guidance" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-2">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>VERIFIED AGRICULTURAL EXTENSION PROTOCOLS</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
            Treatment Guidance for {cropName} — {diseaseName}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/70 mt-1 max-w-2xl">
            Sourced strictly from certified ICAR, FAO, and CIBRC registration schedules. Biological and organic interventions prioritized.
          </p>
        </div>

        {/* Regulatory Labeling Compliance */}
        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-200/90 max-w-md">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-0.5">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Non-Prescriptive Treatment Guidance</span>
          </div>
          AI does not prescribe chemicals or endorse unverified pesticides. Always inspect manufacturer packaging and consult certified agricultural extension officers.
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {["All", "Biological / Organic", "Chemical / Targeted", "Cultural / Agronomic"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab
                ? "bg-emerald-500 text-black font-semibold shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                : "bg-emerald-950/40 text-emerald-200/80 hover:bg-emerald-900/60 border border-emerald-500/20"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Treatment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTreatments.map((treatment, idx) => {
          const isBio = treatment.treatment_type.includes("Biological");
          const isChem = treatment.treatment_type.includes("Chemical");

          return (
            <div
              key={idx}
              className="glass-panel glass-panel-hover p-6 rounded-3xl border-emerald-500/30 flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                {/* Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] uppercase font-mono px-2.5 py-1 rounded-md border ${
                    isBio 
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" 
                      : isChem 
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40" 
                      : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                  }`}>
                    {treatment.treatment_type}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-cyan-300 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>PHI: {treatment.pre_harvest_interval}</span>
                  </div>
                </div>

                {/* Active Ingredient */}
                <div className="text-xs text-emerald-300/80 font-mono mb-1">Active Ingredient:</div>
                <h4 className="text-lg font-bold text-white font-heading mb-2 leading-snug">
                  {treatment.active_ingredient}
                </h4>
                <div className="text-xs text-emerald-200/70 mb-4">
                  Reference: <span className="text-white font-medium">{treatment.commercial_example}</span>
                </div>

                {/* Application & Dosage */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/20 space-y-2 mb-4 text-xs">
                  <div>
                    <span className="text-emerald-400 font-semibold block mb-0.5">Application Protocol:</span>
                    <p className="text-emerald-100/80 leading-relaxed">{treatment.application_method}</p>
                  </div>
                  <div>
                    <span className="text-emerald-400 font-semibold block mb-0.5">Recommended Dosage:</span>
                    <p className="text-white font-mono">{treatment.dosage}</p>
                  </div>
                </div>

                {/* Safety Precautions */}
                <div className="mb-4">
                  <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5 mb-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Safety Precautions:
                  </span>
                  <ul className="space-y-1">
                    {treatment.safety_precautions.map((safe, sIdx) => (
                      <li key={sIdx} className="text-[11px] text-emerald-100/70 flex items-start gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                        <span>{safe}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Source & Verification Metadata */}
              <div className="pt-4 border-t border-emerald-500/20 text-[10px] font-mono text-emerald-400/80 space-y-1">
                <div className="flex justify-between">
                  <span>Source: {treatment.source}</span>
                  <span>Verified: {treatment.last_verified_date}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
