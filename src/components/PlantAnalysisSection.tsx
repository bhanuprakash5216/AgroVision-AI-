"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  UploadCloud, 
  Camera, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  FileImage,
  Crosshair,
  Sliders,
  ScanLine
} from "lucide-react";
import { CompletePlantAnalysis } from "@/lib/types";
import { soundFx } from "./AudioEffects";
import { UserLocation } from "@/lib/geo-utils";

interface PlantAnalysisSectionProps {
  onAnalysisComplete: (result: CompletePlantAnalysis) => void;
  demoMode: boolean;
  userLocation?: UserLocation | null;
}

const PRESET_SAMPLES = [
  {
    id: "tomato_early_blight",
    title: "Tomato: Early Blight",
    subtitle: "Concentric target lesions & chlorotic halo",
    src: "/samples/tomato_early_blight.jpg",
    crop: "Tomato",
    condition: "Diseased"
  },
  {
    id: "tomato_healthy",
    title: "Tomato: Healthy Leaf",
    subtitle: "Vibrant emerald green, intact venation",
    src: "/samples/tomato_healthy.jpg",
    crop: "Tomato",
    condition: "Healthy"
  },
  {
    id: "corn_common_rust",
    title: "Corn: Common Rust",
    subtitle: "Elongated cinnamon-brown pustules",
    src: "/samples/corn_common_rust.jpg",
    crop: "Corn",
    condition: "Diseased"
  }
];

export const PlantAnalysisSection: React.FC<PlantAnalysisSectionProps> = ({
  onAnalysisComplete,
  demoMode,
  userLocation
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>("/samples/tomato_early_blight.jpg");
  const [selectedFileName, setSelectedFileName] = useState<string>("tomato_early_blight.jpg");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("tomato_early_blight");
  const [isCustomUpload, setIsCustomUpload] = useState<boolean>(false);
  
  // Scanning state machine
  const [isScanning, setIsScanning] = useState(false);
  const [scanPhase, setScanPhase] = useState<string>("");
  const [scanProgress, setScanProgress] = useState(0);

  // WebRTC Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Soil Sensor parameter overrides (for crop nutrient synthesis)
  const [showSoilControls, setShowSoilControls] = useState(false);
  const [soilN, setSoilN] = useState(38);
  const [soilP, setSoilP] = useState(44);
  const [soilK, setSoilK] = useState(62);
  const [soilPh, setSoilPh] = useState(6.4);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      alert("Unable to access camera. Please check browser permissions or upload an image file.");
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setSelectedImage(dataUrl);
      setSelectedFileName("camera_capture.jpg");
      setSelectedPresetId("");
      setIsCustomUpload(true);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      stopCamera();
      setSelectedFileName(file.name);
      setSelectedPresetId("");
      setIsCustomUpload(true);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset: typeof PRESET_SAMPLES[0]) => {
    stopCamera();
    setSelectedImage(preset.src);
    setSelectedFileName(preset.id + ".jpg");
    setSelectedPresetId(preset.id);
    setIsCustomUpload(false);
  };

  const runAnalysisPipeline = async () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setScanProgress(10);
    soundFx.playScanBeep();

    // Scanning animation sequence
    const phases = [
      { text: "Scanning plant...", progress: 25, delay: 600 },
      { text: "Identifying crop...", progress: 50, delay: 700 },
      { text: "Checking for disease...", progress: 75, delay: 700 },
      { text: "Analyzing visible symptoms...", progress: 95, delay: 600 }
    ];

    for (const phase of phases) {
      setScanPhase(phase.text);
      setScanProgress(phase.progress);
      soundFx.playScanBeep();
      await new Promise(r => setTimeout(r, phase.delay));
    }

    try {
      const formData = new FormData();
      formData.append("samplePreset", selectedPresetId);
      formData.append("isDemo", demoMode ? "true" : "false");
      formData.append("soilN", String(soilN));
      formData.append("soilP", String(soilP));
      formData.append("soilK", String(soilK));
      formData.append("soilPh", String(soilPh));
      // GPS coordinates — send so API can compute accurate distances & live weather
      if (userLocation?.isDetected) {
        formData.append("userLat", String(userLocation.latitude));
        formData.append("userLng", String(userLocation.longitude));
        formData.append("userCity", `${userLocation.city}, ${userLocation.state}`);
      }

      // If it's a blob/base64 from camera or upload
      if (selectedImage.startsWith("data:")) {
        const res = await fetch(selectedImage);
        const blob = await res.blob();
        formData.append("image", blob, selectedFileName);
      } else {
        formData.append("samplePreset", selectedPresetId || "tomato_early_blight");
      }

      const response = await fetch("/api/plant-analysis", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const result: CompletePlantAnalysis = await response.json();
      setScanProgress(100);
      setScanPhase("Analysis Complete!");
      soundFx.playSuccessChime();

      setTimeout(() => {
        setIsScanning(false);
        onAnalysisComplete(result);
        // Scroll smoothly to results
        const resElem = document.getElementById("analysis-results");
        if (resElem) {
          resElem.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);

    } catch (err) {
      console.error(err);
      setIsScanning(false);
      alert("Failed to analyze image. Please try again.");
    }
  };

  return (
    <section id="plant-analysis" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-4">
          <ScanLine className="w-3.5 h-3.5" />
          <span>REAL-TIME DIAGNOSTIC SCANNER</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight mb-4">
          Upload & Diagnose Plant Foliage
        </h2>
        <p className="text-emerald-100/70 text-base">
          Trained on the Kaggle PlantVillage dataset with field-condition validation against PlantDoc. 
          Combines leaf imagery with soil parameters for complete crop intelligence.
        </p>
      </div>

      {/* Main Analysis Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3D Plant Upload Area */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl relative overflow-hidden border-emerald-500/30 shadow-[0_12px_45px_rgba(0,0,0,0.5)]">
          {/* Subtle Ambient Scan Glow */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Camera Viewfinder OR Image Preview */}
          <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-black/60 border border-emerald-500/30 flex items-center justify-center">
            {isCameraActive ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                {/* Viewfinder Reticle */}
                <div className="absolute inset-8 border border-emerald-400/40 pointer-events-none rounded-lg flex items-center justify-center">
                  <Crosshair className="w-12 h-12 text-emerald-400/60 animate-pulse" />
                  <span className="absolute bottom-3 text-xs font-mono text-emerald-300 bg-black/60 px-2 py-0.5 rounded">
                    Position Leaf Within Frame
                  </span>
                </div>
              </div>
            ) : selectedImage ? (
              <div className="relative w-full h-full">
                <Image
                  src={selectedImage}
                  alt="Selected plant foliage"
                  fill
                  className="object-cover"
                />
                {/* Laser Scanning Line Animation */}
                {isScanning && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-laser z-20" />
                )}
                {/* Scanning HUD Overlay */}
                {isScanning && (
                  <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center">
                    <div className="p-4 rounded-full bg-emerald-900/60 border border-emerald-400/50 mb-4 animate-spin">
                      <RefreshCw className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div className="text-xl font-bold text-white font-heading mb-1">{scanPhase}</div>
                    <div className="w-64 h-2 bg-emerald-950 rounded-full overflow-hidden border border-emerald-500/40">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-300 transition-all duration-300"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-emerald-400 mt-2">{scanProgress}% completed</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-8">
                <UploadCloud className="w-14 h-14 text-emerald-400/50 mx-auto mb-3" />
                <p className="text-sm text-emerald-200/80">No leaf image loaded</p>
              </div>
            )}
          </div>

          {/* Capture Controls */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {isCameraActive ? (
                <>
                  <button
                    onClick={capturePhoto}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-colors flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  >
                    <Crosshair className="w-4 h-4" />
                    Capture Photo
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-sm font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={startCamera}
                    className="px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-emerald-400" />
                    Camera Capture
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <FileImage className="w-4 h-4 text-emerald-400" />
                    Browse Photo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </>
              )}
            </div>

            {/* Run Diagnostic Button */}
            {!isCameraActive && (
              <button
                disabled={isScanning || !selectedImage}
                onClick={runAnalysisPipeline}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black font-bold text-sm shadow-[0_0_24px_rgba(16,185,129,0.5)] hover:shadow-[0_0_36px_rgba(16,185,129,0.8)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run Autonomous AI Diagnosis</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Kaggle PlantVillage Demo Presets & Soil Ingestion */}
        <div className="lg:col-span-5 space-y-5">
          {/* Kaggle Demo Presets Card */}
          <div className="glass-panel p-5 rounded-2xl border-emerald-500/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-white font-heading">
                  Kaggle Benchmark Presets
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                PlantVillage & EmmaRex
              </span>
            </div>
            <p className="text-xs text-emerald-100/60 mb-3">
              Instantly test the model using verified reference leaves from the PlantVillage dataset:
            </p>

            <div className="space-y-2.5">
              {PRESET_SAMPLES.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                    selectedPresetId === preset.id
                      ? "bg-emerald-950/80 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                      : "bg-emerald-950/30 border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-950/50"
                  }`}
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-emerald-500/30">
                    <Image
                      src={preset.src}
                      alt={preset.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white truncate">{preset.title}</h4>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        preset.condition === "Healthy" 
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}>
                        {preset.condition}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-100/60 truncate">{preset.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Soil Nutrient Parameter Tuning (Multi-modal synthesis) */}
          <div className="glass-panel p-5 rounded-2xl border-emerald-500/30">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowSoilControls(!showSoilControls)}>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-white font-heading">
                  Soil Nutrient Telemetry (Kaggle Dataset)
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-400">
                {showSoilControls ? "Hide" : "Tune"}
              </span>
            </div>
            
            <p className="text-xs text-emerald-100/60 mt-1 mb-3">
              Image + Soil NPK + pH are combined. AI never diagnoses nutrient deficiency from image alone.
            </p>

            {showSoilControls && (
              <div className="space-y-3 pt-2 border-t border-emerald-500/20">
                <div>
                  <div className="flex justify-between text-xs text-emerald-200 mb-1">
                    <span>Nitrogen (N): {soilN} mg/kg</span>
                    <span className={soilN < 50 ? "text-amber-400" : "text-emerald-400"}>
                      {soilN < 50 ? "Deficient" : "Adequate"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="140"
                    value={soilN}
                    onChange={(e) => setSoilN(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-emerald-200 mb-1">
                    <span>Potassium (K): {soilK} mg/kg</span>
                    <span className="text-emerald-400">Optimal</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    value={soilK}
                    onChange={(e) => setSoilK(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-emerald-200 mb-1">
                    <span>Soil pH: {soilPh}</span>
                    <span className="text-emerald-400">Neutral/Slightly Acidic</span>
                  </div>
                  <input
                    type="range"
                    min="4.5"
                    max="8.5"
                    step="0.1"
                    value={soilPh}
                    onChange={(e) => setSoilPh(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
