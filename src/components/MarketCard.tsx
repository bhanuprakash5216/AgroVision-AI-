"use client";

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  MapPin, 
  Truck, 
  Calendar, 
  Info, 
  ShieldCheck, 
  ArrowRight,
  Calculator,
  Building2,
  DollarSign
} from "lucide-react";
import { MandiPriceRecord } from "@/lib/types";
import { UserLocation } from "@/lib/geo-utils";

interface MarketCardProps {
  initialMarkets: MandiPriceRecord[];
  initialCrop: string;
  userLocation?: UserLocation | null;
}

export const MarketCard: React.FC<MarketCardProps> = ({
  initialMarkets,
  initialCrop,
  userLocation
}) => {
  const [crop, setCrop] = useState(initialCrop || "Tomato");
  const [state, setState] = useState("Andhra Pradesh");
  const [district, setDistrict] = useState("Chittoor");
  const [quantityKg, setQuantityKg] = useState(500);
  const [markets, setMarkets] = useState<MandiPriceRecord[]>(initialMarkets);
  const [isLoading, setIsLoading] = useState(false);

  // Sync markets and crop state when parent recalculates or new analysis is run
  useEffect(() => {
    if (initialMarkets && initialMarkets.length > 0) {
      setMarkets(initialMarkets);
    }
  }, [initialMarkets]);

  useEffect(() => {
    if (initialCrop) {
      setCrop(initialCrop);
    }
  }, [initialCrop]);

  useEffect(() => {
    if (userLocation?.isDetected) {
      if (userLocation.state) setState(userLocation.state);
      if (userLocation.district) setDistrict(userLocation.district);
    }
  }, [userLocation]);

  const fetchMarkets = async (c: string, s: string, d: string, q: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/markets?crop=${encodeURIComponent(c)}&state=${encodeURIComponent(s)}&district=${encodeURIComponent(d)}&quantity=${q}`);
      if (res.ok) {
        const data = await res.json();
        setMarkets(data.markets || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (val: number) => {
    setQuantityKg(val);
    fetchMarkets(crop, state, district, val);
  };

  const handleCropChange = (newCrop: string) => {
    setCrop(newCrop);
    fetchMarkets(newCrop, state, district, quantityKg);
  };

  return (
    <section id="market-prices" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>AGMARKNET APMC MANDI INTELLIGENCE</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
            Multi-Market Price Discovery & Freight Economics
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/70 mt-1 max-w-2xl">
            Compare regional APMC mandis transparently. Factoring distance, fuel costs, and cess reveals your true net realized profit per kilogram.
          </p>
        </div>

        {/* Data Authenticity + Distance Accuracy Notice */}
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-200/90 max-w-md space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-amber-400">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Mandatory Market Data Transparency</span>
          </div>
          <p>All quotes display <strong>Historical/reference data</strong> with verified dates. AI provides neutral comparisons; the farmer retains full autonomy.</p>
          <p className={`flex items-center gap-1 ${userLocation?.isDetected ? "text-emerald-300" : "text-zinc-400"}`}>
            <MapPin className="w-3 h-3 shrink-0" />
            {userLocation?.isDetected
              ? `✅ Distances computed via Haversine formula from your GPS (${userLocation.city}: ${userLocation.latitude.toFixed(4)}°N, ${userLocation.longitude.toFixed(4)}°E).`
              : "⚠️ Demo distances shown. Allow browser GPS to get precise distances from your farm."}
          </p>
        </div>
      </div>

      {/* Filter / Selector Bar */}
      <div className="glass-panel p-5 rounded-2xl border-emerald-500/30 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        {/* Crop Selector */}
        <div>
          <label className="text-xs text-emerald-200 block mb-1.5 font-medium">Selected Commodity</label>
          <select
            value={crop}
            onChange={(e) => handleCropChange(e.target.value)}
            className="w-full bg-[#0a1f13] border border-emerald-500/40 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-400"
          >
            <option value="Tomato">Tomato (Hybrid / Local)</option>
            <option value="Potato">Potato (Kufri Jyoti)</option>
            <option value="Corn">Corn / Maize</option>
            <option value="Chilli">Chilli (Green / Dry)</option>
          </select>
        </div>

        {/* State Selector */}
        <div>
          <label className="text-xs text-emerald-200 block mb-1.5 font-medium">State</label>
          <select
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              fetchMarkets(crop, e.target.value, district, quantityKg);
            }}
            className="w-full bg-[#0a1f13] border border-emerald-500/40 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-400"
          >
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Punjab">Punjab</option>
          </select>
        </div>

        {/* District Selector */}
        <div>
          <label className="text-xs text-emerald-200 block mb-1.5 font-medium">District</label>
          <select
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              fetchMarkets(crop, state, e.target.value, quantityKg);
            }}
            className="w-full bg-[#0a1f13] border border-emerald-500/40 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-400"
          >
            <option value="Chittoor">Chittoor</option>
            <option value="Kolar">Kolar</option>
            <option value="Nashik">Nashik</option>
            <option value="Jalandhar">Jalandhar</option>
          </select>
        </div>

        {/* Quantity Slider */}
        <div>
          <div className="flex justify-between text-xs text-emerald-200 mb-1.5 font-medium">
            <span>Harvest Quantity:</span>
            <span className="text-emerald-400 font-bold font-mono">{quantityKg} kg</span>
          </div>
          <input
            type="range"
            min="100"
            max="3000"
            step="50"
            value={quantityKg}
            onChange={(e) => handleQuantityChange(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Mandi Cards Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {markets.map((mandi, idx) => {
          const econ = mandi.economics || {
            gross_revenue: mandi.modal_price * quantityKg,
            transport_cost: 200 + mandi.distance_km * 10,
            mandi_cess: mandi.modal_price * quantityKg * 0.015,
            net_selling_value: mandi.modal_price * quantityKg - (200 + mandi.distance_km * 10),
            net_price_per_kg: mandi.modal_price - 1.5
          };

          return (
            <div
              key={mandi.id || idx}
              className="glass-panel glass-panel-hover p-6 rounded-3xl border-emerald-500/30 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Card Top Details */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    Mandi #{idx + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1 text-xs text-cyan-300 font-mono">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="font-bold">{mandi.distance_km} km</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${
                      userLocation?.isDetected
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-zinc-800/60 text-zinc-400 border-zinc-600/40"
                    }`}>
                      {userLocation?.isDetected ? "📍 GPS Measured" : "Est. (Demo)"}
                    </span>
                  </div>
                </div>

                <h4 className="text-xl font-bold text-white font-heading mb-1">{mandi.market}</h4>
                <div className="text-xs text-emerald-100/60 mb-4">
                  {mandi.district}, {mandi.state} • Grade: {mandi.grade}
                </div>

                {/* Price Display */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/20 mb-4">
                  <div className="text-xs text-emerald-300/80 mb-0.5">Modal Trading Price:</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white font-mono">
                      ₹{mandi.modal_price}
                    </span>
                    <span className="text-xs text-emerald-200">/ kg</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-emerald-100/50 mt-1 font-mono">
                    <span>Min: ₹{mandi.min_price}</span>
                    <span>Max: ₹{mandi.max_price}</span>
                  </div>
                </div>

                {/* Transportation & Net Value Breakdown */}
                <div className="space-y-2 text-xs mb-5">
                  <div className="flex justify-between text-emerald-100/80">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-amber-400" />
                      Transport Overhead:
                    </span>
                    <span className="font-mono text-rose-300">-₹{econ.transport_cost}</span>
                  </div>

                  <div className="flex justify-between text-emerald-100/80">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                      APMC Cess (1.5%):
                    </span>
                    <span className="font-mono text-rose-300">-₹{econ.mandi_cess}</span>
                  </div>

                  <div className="pt-2 border-t border-emerald-500/20 flex justify-between items-baseline">
                    <span className="font-semibold text-white">Estimated Net Profit:</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      ₹{econ.net_selling_value.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-[11px] text-emerald-300/70 font-mono">
                    <span>Realized Net Rate:</span>
                    <span className="font-bold text-emerald-300">₹{econ.net_price_per_kg}/kg</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Mandatory Historical Data Tags */}
              <div className="pt-4 border-t border-emerald-500/20 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400/80">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Data date: {mandi.data_date}
                  </span>
                  <span className="bg-emerald-500/10 px-1.5 py-0.5 rounded text-emerald-300 border border-emerald-500/20">
                    {mandi.data_type}
                  </span>
                </div>
                <div className="text-[10px] text-emerald-100/40 truncate">
                  Source: {mandi.source}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
