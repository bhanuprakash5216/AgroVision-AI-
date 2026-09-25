"use client";

import React, { useState, useEffect } from "react";
import { 
  Droplets, 
  CloudRain, 
  Thermometer, 
  Wind, 
  Cpu, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { WateringRecommendation, WeatherData } from "@/lib/types";

interface WateringCardProps {
  initialWatering: WateringRecommendation;
  weather: WeatherData;
  cropName: string;
}

export const WateringCard: React.FC<WateringCardProps> = ({
  initialWatering,
  weather,
  cropName
}) => {
  const [watering, setWatering] = useState<WateringRecommendation>(initialWatering);
  const [soilMoisture, setSoilMoisture] = useState(initialWatering.soil_moisture);
  const [growthStage, setGrowthStage] = useState(initialWatering.growth_stage);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setWatering(initialWatering);
    setSoilMoisture(initialWatering.soil_moisture);
    setGrowthStage(initialWatering.growth_stage);
  }, [initialWatering]);

  const recomputeWatering = async (newMoisture: number, stage: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/watering", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: cropName,
          growth_stage: stage,
          soil_moisture: newMoisture,
          temperature: weather.temperature,
          humidity: weather.humidity,
          rain_probability: weather.rain_probability,
          rainfall_mm: weather.rainfall_mm,
          esp32_device_id: "ESP32-AGRI-PROBE-01"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setWatering(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMoistureChange = (val: number) => {
    setSoilMoisture(val);
    recomputeWatering(val, growthStage);
  };

  const handleStageChange = (stage: any) => {
    setGrowthStage(stage);
    recomputeWatering(soilMoisture, stage);
  };

  return (
    <section id="smart-watering" className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-emerald-500/30 relative overflow-hidden">
        {/* Ambient Water Drop Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-emerald-500/20 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>FAO EVAPOTRANSPIRATION & WEATHER RULE ENGINE</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Smart Watering Advisory
            </h3>
            <p className="text-xs text-emerald-100/70 mt-1">
              Agronomic decision engine combining soil moisture, ambient temperature, humidity, and rain forecast.
            </p>
          </div>

          {/* ESP32 Hardware Telemetry Badge */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>ESP32 Sensor: Ready / Telemetry Active</span>
          </div>
        </div>

        {/* Main Advisory Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Key Metric Tiles */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Soil Moisture */}
            <div className="glass-panel p-4 rounded-2xl border-cyan-500/30 bg-cyan-950/20">
              <div className="flex items-center gap-2 text-xs text-cyan-400 mb-1">
                <Droplets className="w-4 h-4" />
                <span>Soil Moisture</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white font-heading font-mono">
                {soilMoisture}%
              </div>
              <span className="text-[11px] text-cyan-200/60">
                {soilMoisture < 20 ? "Critically Dry" : soilMoisture > 45 ? "Moist" : "Moderate"}
              </span>
            </div>

            {/* Ambient Temperature */}
            <div className="glass-panel p-4 rounded-2xl border-emerald-500/30">
              <div className="flex items-center gap-2 text-xs text-emerald-400 mb-1">
                <Thermometer className="w-4 h-4" />
                <span>Temperature</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white font-heading font-mono">
                {weather.temperature}°C
              </div>
              <span className="text-[11px] text-emerald-200/60">Open-Meteo Live</span>
            </div>

            {/* Relative Humidity */}
            <div className="glass-panel p-4 rounded-2xl border-emerald-500/30">
              <div className="flex items-center gap-2 text-xs text-emerald-400 mb-1">
                <Wind className="w-4 h-4" />
                <span>Humidity</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white font-heading font-mono">
                {weather.humidity}%
              </div>
              <span className="text-[11px] text-emerald-200/60">High Foliar Wetness</span>
            </div>

            {/* Rain Probability */}
            <div className="glass-panel p-4 rounded-2xl border-cyan-500/30 bg-cyan-950/20">
              <div className="flex items-center gap-2 text-xs text-cyan-400 mb-1">
                <CloudRain className="w-4 h-4" />
                <span>Rain Prob</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-cyan-300 font-heading font-mono">
                {weather.rain_probability}%
              </div>
              <span className="text-[11px] text-cyan-200/60">Next 12 Hours</span>
            </div>

            {/* Interactive ESP32 / Moisture Simulator Slider */}
            <div className="col-span-2 sm:col-span-4 p-4 rounded-2xl bg-black/40 border border-emerald-500/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-emerald-200 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  Live Soil Moisture Telemetry / Simulator: {soilMoisture}%
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-100/60">Growth Stage:</span>
                  <select
                    value={growthStage}
                    onChange={(e) => handleStageChange(e.target.value)}
                    className="bg-emerald-950/80 border border-emerald-500/40 rounded-lg text-xs text-white px-2 py-1 outline-none"
                  >
                    <option value="Vegetative">Vegetative</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Fruiting">Fruiting</option>
                    <option value="Maturity">Maturity</option>
                  </select>
                </div>
              </div>
              <input
                type="range"
                min="5"
                max="85"
                value={soilMoisture}
                onChange={(e) => handleMoistureChange(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-emerald-100/40 font-mono mt-1">
                <span>5% Dry Wilting</span>
                <span>24% Current Field Telemetry</span>
                <span>50% Field Capacity</span>
                <span>85% Saturated</span>
              </div>
            </div>
          </div>

          {/* Recommendation Banner */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-emerald-950/80 via-emerald-900/60 to-black/90 border border-cyan-500/30 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
                Dynamic Irrigation Verdict
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white font-heading">
                    {watering.recommendation}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-cyan-200">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Preferred time: <strong>{watering.preferred_time}</strong></span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-emerald-100/80 leading-relaxed mb-4">
                {watering.reason}
              </p>
            </div>

            <div className="pt-3 border-t border-emerald-500/20 flex items-center justify-between text-[11px] text-emerald-400/80 font-mono">
              <span>Sensor: {watering.esp32_sensor_status}</span>
              <span>Updated: Just now</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
