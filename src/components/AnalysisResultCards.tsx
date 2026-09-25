"use client";

import React from "react";
import { 
  Sprout, 
  Bug, 
  AlertTriangle, 
  FlaskConical, 
  Camera, 
  ShieldCheck, 
  CheckCircle2, 
  Info,
  Calendar,
  Layers
} from "lucide-react";
import { CompletePlantAnalysis } from "@/lib/types";

interface AnalysisResultCardsProps {
  analysis: CompletePlantAnalysis;
}

export const AnalysisResultCards: React.FC<AnalysisResultCardsProps> = ({ analysis }) => {
  const { cropIdentification, diseaseResult, nutrientIndication, qualityCheck } = analysis;

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "Critical":
      case "High":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40";
      case "Medium":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "Low":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      default:
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    }
  };

  return (
    <section id="analysis-results" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Result Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-emerald-500/20 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>AI DIAGNOSIS DOSSIER — ID: {analysis.id}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Multimodal Crop Diagnostic Report
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-200/70 bg-emerald-950/70 px-3.5 py-2 rounded-xl border border-emerald-500/30">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>Analyzed: {new Date(analysis.timestamp).toLocaleDateString()}</span>
        </div>
      </div>

      {/* 4 Separate 3D Glass Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CARD 1: CROP IDENTIFICATION */}
        <div className="glass-panel glass-panel-hover p-6 rounded-2xl border-emerald-500/30 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Crop Species</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Sprout className="w-5 h-5" />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-white font-heading mb-1">{cropIdentification.crop}</h4>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-emerald-100/70">Confidence:</span>
              <span className="text-base font-bold text-emerald-400 font-mono">
                {Math.round(cropIdentification.confidence * 100)}%
              </span>
            </div>
            <div className="w-full bg-emerald-950/80 rounded-full h-1.5 overflow-hidden border border-emerald-500/20">
              <div
                className="bg-emerald-400 h-full rounded-full"
                style={{ width: `${cropIdentification.confidence * 100}%` }}
              />
            </div>
          </div>
          <div className="mt-6 pt-3 border-t border-emerald-500/20 text-[11px] font-mono text-emerald-300/60">
            Model: Transfer-Learning Classifier
          </div>
        </div>

        {/* CARD 2: DISEASE CLASSIFICATION */}
        <div className="glass-panel glass-panel-hover p-6 rounded-2xl border-emerald-500/30 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Disease Pathogen</span>
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Bug className="w-5 h-5" />
              </div>
            </div>
            <h4 className="text-xl font-bold text-white font-heading mb-2 leading-snug">
              {diseaseResult.disease}
            </h4>
            <div className="flex items-center gap-3 mb-3">
              <div>
                <span className="text-xs text-emerald-100/70 block">Confidence:</span>
                <span className="text-base font-bold text-amber-400 font-mono">
                  {Math.round(diseaseResult.confidence * 100)}%
                </span>
              </div>
              <div className="h-6 w-px bg-emerald-500/20" />
              <div>
                <span className="text-xs text-emerald-100/70 block">Severity:</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getSeverityBadge(diseaseResult.severity)}`}>
                  {diseaseResult.severity}
                </span>
              </div>
            </div>
            <p className="text-xs text-emerald-100/70 italic">
              {diseaseResult.disclaimer}
            </p>
          </div>
          <div className="mt-6 pt-3 border-t border-emerald-500/20 text-[11px] font-mono text-emerald-300/60">
            Dataset: Kaggle PlantVillage Benchmark
          </div>
        </div>

        {/* CARD 3: VISIBLE SYMPTOMS */}
        <div className="glass-panel glass-panel-hover p-6 rounded-2xl border-emerald-500/30 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Visible Symptoms</span>
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <ul className="space-y-2 mb-4">
              {diseaseResult.symptoms.map((symptom, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-emerald-100/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 pt-3 border-t border-emerald-500/20 text-[11px] font-mono text-emerald-300/60">
            Pathology: {diseaseResult.disease.includes("Healthy") ? "Normal foliage morphology" : diseaseResult.disease.includes("Rust") ? "Pustule formation & urediniospores" : diseaseResult.disease.includes("Blight") ? "Necrotic foliar lesions & chlorosis" : "Visible tissue lesion markers"}
          </div>
        </div>

        {/* CARD 4: POSSIBLE NUTRIENT DEFICIENCY */}
        <div className="glass-panel glass-panel-hover p-6 rounded-2xl border-emerald-500/30 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">Nutrient Indication</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <FlaskConical className="w-5 h-5" />
              </div>
            </div>
            <div className="text-xs text-emerald-300 font-mono mb-1">Possible Deficiency:</div>
            <h4 className="text-xl font-bold text-white font-heading mb-2">
              {nutrientIndication.possible_deficiency}
            </h4>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-emerald-100/70">Confidence:</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                {Math.round(nutrientIndication.confidence * 100)}%
              </span>
            </div>
            <p className="text-xs text-emerald-100/70 mb-3 leading-relaxed">
              {nutrientIndication.reason}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-200/90 leading-tight">
            <div className="flex items-center gap-1 font-semibold text-amber-400 mb-0.5">
              <Info className="w-3 h-3 shrink-0" />
              <span>Mandatory Agronomic Disclaimer</span>
            </div>
            This is an AI-based indication. Soil/leaf testing is recommended for confirmation.
          </div>
        </div>
      </div>

      {/* Field Generalization & Image Quality Bar (PlantLab2Real / PlantDoc) */}
      <div className="mt-6 glass-panel p-4 rounded-xl border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">
              Real-World Field Generalization Audit (PlantDoc Standard)
            </div>
            <div className="text-[11px] text-emerald-100/60">
              Laplacian Blur Var: {qualityCheck.metrics.laplacian_blur_var} | Quality Score: {Math.round(qualityCheck.quality_score * 100)}% | Domain: In-field farm photo
            </div>
          </div>
        </div>

        {qualityCheck.passed ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Image Quality Certified for Field Diagnostic</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Confidence penalized due to motion blur or low lighting</span>
          </div>
        )}
      </div>
    </section>
  );
};
