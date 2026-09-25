"use client";

import React from "react";
import { 
  Sprout, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  MapPin, 
  Navigation, 
  Loader2 
} from "lucide-react";
import { soundFx } from "./AudioEffects";
import { UserLocation } from "@/lib/geo-utils";

interface NavbarProps {
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  userLocation: UserLocation | null;
  isDetectingLocation: boolean;
  onDetectLocationClick: () => void;
  onAnalyzeClick: () => void;
  onDashboardClick: () => void;
  onMarketClick: () => void;
  onMapClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  demoMode,
  setDemoMode,
  userLocation,
  isDetectingLocation,
  onDetectLocationClick,
  onAnalyzeClick,
  onDashboardClick,
  onMarketClick,
  onMapClick
}) => {
  const [muted, setMuted] = React.useState(false);

  const toggleSound = () => {
    const nextState = !muted;
    setMuted(nextState);
    soundFx.setMuted(nextState);
    if (!nextState) {
      soundFx.playScanBeep();
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#07120b]/85 border-b border-emerald-500/20 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 via-emerald-600/30 to-green-900/40 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.35)] group-hover:shadow-[0_0_28px_rgba(16,185,129,0.6)] transition-all">
            <Sprout className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold font-heading tracking-tight text-white">
                AgroVision <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">AI</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                v2.4 Pro
              </span>
            </div>
            <p className="text-[11px] text-emerald-400/70 font-medium hidden sm:block">
              Precision 3D Agricultural Intelligence Platform
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-emerald-100/80">
          <button onClick={onAnalyzeClick} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Scan Crop
          </button>
          <button onClick={onDashboardClick} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer">
            <Activity className="w-4 h-4 text-emerald-400" />
            Farm Dashboard
          </button>
          <button onClick={onMarketClick} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer">
            Mandi Prices
          </button>
          <button onClick={onMapClick} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer">
            3D Farm Map
          </button>
        </div>

        {/* Controls & Actions */}
        <div className="flex items-center gap-3">
          {/* GPS Live Location Detector Button */}
          <button
            onClick={onDetectLocationClick}
            disabled={isDetectingLocation}
            title={userLocation?.isDetected ? `Detected: ${userLocation.city}, ${userLocation.state} (${userLocation.latitude.toFixed(2)}°, ${userLocation.longitude.toFixed(2)}°)` : "Click to detect your live location"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
              userLocation?.isDetected
                ? "bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                : "bg-emerald-950/50 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/60"
            }`}
          >
            {isDetectingLocation ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span className="hidden sm:inline">Locating GPS...</span>
              </>
            ) : userLocation?.isDetected ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate max-w-[110px] sm:max-w-[150px] font-semibold text-white">
                  {userLocation.city || userLocation.state}
                </span>
              </>
            ) : (
              <>
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Detect GPS</span>
                <span className="sm:hidden">GPS</span>
              </>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={muted ? "Unmute Sound Feedback" : "Mute Sound Feedback"}
            className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/60 hover:text-emerald-300 transition-all cursor-pointer"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Demo Mode Toggle */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-200 hidden sm:inline">Demo Mode</span>
            <button
              onClick={() => setDemoMode(!demoMode)}
              className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
                demoMode ? "bg-emerald-500" : "bg-zinc-700"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  demoMode ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* CTA Scan Button */}
          <button
            onClick={onAnalyzeClick}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black font-semibold text-xs sm:text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_28px_rgba(16,185,129,0.7)] transition-all cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Analyze Plant</span>
            <span className="sm:hidden">Scan</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
