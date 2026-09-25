"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Truck, Store, Info, Compass, Maximize2 } from "lucide-react";
import { MandiPriceRecord } from "@/lib/types";

import { UserLocation } from "@/lib/geo-utils";

interface InteractiveFarmMapProps {
  markets: MandiPriceRecord[];
  userLocation: UserLocation | null;
  onDetectLocationClick?: () => void;
}

export const InteractiveFarmMap: React.FC<InteractiveFarmMapProps> = ({
  markets,
  userLocation,
  onDetectLocationClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedMandi, setSelectedMandi] = useState<MandiPriceRecord | null>(markets[0] || null);

  useEffect(() => {
    if (markets && markets.length > 0) {
      setSelectedMandi(markets[0]);
    }
  }, [markets]);

  // Farm coordinate origin - uses detected user location if available
  const farm = {
    name: userLocation?.isDetected ? `${userLocation.city} Farm Hub` : "AgroVision Pilot Farm (Greenhouse Hub)",
    lat: userLocation?.latitude ?? 13.2172,
    lng: userLocation?.longitude ?? 79.1003,
    state: userLocation?.state ?? "Andhra Pradesh"
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width * 0.35;
      const centerY = canvas.height * 0.55;

      // Draw Topographic Radial Grid Rings (Distance Rings: 10km, 25km, 50km)
      const rings = [60, 130, 210];
      rings.forEach((r, i) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(16, 185, 129, 0.12)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();

        ctx.fillStyle = "rgba(16, 185, 129, 0.4)";
        ctx.font = "10px JetBrains Mono";
        ctx.fillText(`${(i + 1) * 15} km radius`, centerX + r - 35, centerY - 6);
      });
      ctx.setLineDash([]);

      // Plot Markets
      markets.slice(0, 4).forEach((mandi, idx) => {
        // Compute pseudo visual positions around center based on index
        const angle = (idx * Math.PI * 0.55) - 0.4;
        const distScale = Math.min(220, Math.max(70, mandi.distance_km * 3.8));
        const mx = centerX + Math.cos(angle) * distScale;
        const my = centerY + Math.sin(angle) * distScale;

        // Animated Transit Route Line
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(mx, my);
        ctx.strokeStyle = selectedMandi?.market === mandi.market ? "rgba(52, 211, 153, 0.7)" : "rgba(16, 185, 129, 0.25)";
        ctx.lineWidth = selectedMandi?.market === mandi.market ? 2.5 : 1.5;
        ctx.setLineDash([6, 6]);
        ctx.lineDashOffset = -offset;
        ctx.stroke();
        ctx.setLineDash([]);

        // Mandi Node Circle
        ctx.beginPath();
        ctx.arc(mx, my, selectedMandi?.market === mandi.market ? 12 : 9, 0, Math.PI * 2);
        ctx.fillStyle = selectedMandi?.market === mandi.market ? "#10b981" : "#065f46";
        ctx.fill();
        ctx.strokeStyle = "#34d399";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px Outfit";
        ctx.fillText(mandi.market.split(" ")[0], mx + 14, my - 2);

        ctx.fillStyle = "rgba(110, 231, 183, 0.8)";
        ctx.font = "10px JetBrains Mono";
        ctx.fillText(`₹${mandi.modal_price}/kg • ${mandi.distance_km}km`, mx + 14, my + 11);
      });

      // Farm Home Hub (Center Pin)
      ctx.beginPath();
      ctx.arc(centerX, centerY, 14, 0, Math.PI * 2);
      ctx.fillStyle = "#10b981";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Pulsing Radar Ring around Farm
      const pulseRadius = 14 + (Math.sin(offset * 0.08) + 1) * 8;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(16, 185, 129, ${0.8 - (pulseRadius - 14) / 16})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px Outfit";
      ctx.fillText("📍 My Farm", centerX - 26, centerY - 22);

      offset += 0.8;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [markets, selectedMandi]);

  return (
    <section id="farm-map" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-emerald-500/30 relative overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-emerald-500/20 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>GEOSPATIAL AG-LOGISTICS MAP</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              3D Interactive Farm & Mandi Transport Routes
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/70 mt-1">
              Visualizes routes from your farm to regional APMC agricultural mandis with freight overhead calculations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onDetectLocationClick && !userLocation?.isDetected && (
              <button
                onClick={onDetectLocationClick}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Navigation className="w-3 h-3 text-emerald-400" />
                <span>Sync Real GPS</span>
              </button>
            )}
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 bg-emerald-950/70 px-3.5 py-1.5 rounded-xl border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>
                {userLocation?.isDetected
                  ? `${userLocation.city}: ${farm.lat.toFixed(4)}°N, ${farm.lng.toFixed(4)}°E`
                  : `Coordinates: ${farm.lat.toFixed(4)}° N, ${farm.lng.toFixed(4)}° E`}
              </span>
            </div>
          </div>
        </div>

        {/* Map Canvas and Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Interactive Vector Canvas */}
          <div className="lg:col-span-8 relative aspect-[16/10] w-full rounded-2xl bg-[#051009] border border-emerald-500/30 overflow-hidden shadow-inner">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="w-full h-full object-cover"
            />
            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-black/70 backdrop-blur-md border border-emerald-500/30 text-xs space-y-1.5 font-mono">
              <div className="flex items-center gap-2 text-white">
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                <span>📍 My Farm Hub</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-200">
                <span className="w-3 h-3 rounded-full bg-emerald-600 border border-emerald-300 inline-block" />
                <span>🏪 APMC Mandi Node</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300">
                <span className="w-4 h-0.5 border-t border-dashed border-emerald-400 inline-block" />
                <span>🚚 Freight Transit Route</span>
              </div>
            </div>
          </div>

          {/* Mandi Selection & Route Breakdown Panel */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white font-heading uppercase tracking-wider text-emerald-400">
              Select Mandi Route:
            </h4>

            {markets.slice(0, 4).map((mandi) => {
              const isSelected = selectedMandi?.market === mandi.market;
              const transportCost = 200 + Math.round(mandi.distance_km * 14 * 0.75);

              return (
                <div
                  key={mandi.market}
                  onClick={() => setSelectedMandi(mandi)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-emerald-950/80 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      : "bg-emerald-950/30 border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-950/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-semibold text-white truncate">{mandi.market}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {mandi.distance_km} km
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-emerald-500/10">
                    <div>
                      <span className="text-emerald-100/50 block">Modal Rate:</span>
                      <span className="text-white font-bold font-mono">₹{mandi.modal_price}/kg</span>
                    </div>
                    <div>
                      <span className="text-emerald-100/50 block">Est. Freight:</span>
                      <span className="text-amber-300 font-mono">₹{transportCost}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
