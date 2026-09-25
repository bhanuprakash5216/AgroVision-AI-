"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Farm3DHero } from "@/components/Farm3DHero";
import { PlantAnalysisSection } from "@/components/PlantAnalysisSection";
import { AnalysisResultCards } from "@/components/AnalysisResultCards";
import { WateringCard } from "@/components/WateringCard";
import { MarketCard } from "@/components/MarketCard";
import { InteractiveFarmMap } from "@/components/InteractiveFarmMap";
import { TreatmentSection } from "@/components/TreatmentSection";
import { FarmerDashboard } from "@/components/FarmerDashboard";
import { AgroBotAssistant } from "@/components/AgroBotAssistant";
import { CompletePlantAnalysis, WeatherData } from "@/lib/types";
import { AgriStore } from "@/lib/data-store";
import { UserLocation, reverseGeocode, calculateHaversineDistance } from "@/lib/geo-utils";

export default function Home() {
  const [demoMode, setDemoMode] = useState(true);
  const [currentAnalysis, setCurrentAnalysis] = useState<CompletePlantAnalysis | null>(null);
  const [historyList, setHistoryList] = useState<CompletePlantAnalysis[]>([]);

  // Geolocation state
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [locationToast, setLocationToast] = useState<string | null>(null);

  // Initialize with benchmark analysis record
  useEffect(() => {
    const defaultData = AgriStore.getInstance().getAnalyses();
    if (defaultData && defaultData.length > 0) {
      setCurrentAnalysis(defaultData[0]);
      setHistoryList(defaultData);
    }
  }, []);

  // Recalculate analysis when location changes
  const updateAnalysisForLocation = useCallback(async (loc: UserLocation) => {
    try {
      // 1. Fetch live weather for the detected coordinates
      const weatherRes = await fetch(
        `/api/weather?lat=${loc.latitude}&lng=${loc.longitude}&location=${encodeURIComponent(loc.city + ", " + loc.state)}`
      );
      let updatedWeather: WeatherData | null = null;
      if (weatherRes.ok) {
        updatedWeather = await weatherRes.json();
      }

      setCurrentAnalysis(prev => {
        if (!prev) return null;

        // 2. Recalculate mandi distances based on real user coordinates
        const updatedMarkets = prev.marketIntelligence.markets.map(mandi => {
          const actualDistance = calculateHaversineDistance(
            loc.latitude,
            loc.longitude,
            mandi.lat,
            mandi.lng
          );
          const quantityKg = prev.marketIntelligence.quantity_kg || 500;
          const gross = mandi.modal_price * quantityKg;
          const transportCost = Math.round(200 + (actualDistance * 14.0 * 0.75));
          const cess = Math.round(gross * 0.015);
          const netValue = Math.max(0, gross - transportCost - cess);

          return {
            ...mandi,
            distance_km: actualDistance,
            economics: {
              gross_revenue: gross,
              transport_cost: transportCost,
              mandi_cess: cess,
              net_selling_value: netValue,
              net_price_per_kg: Number((netValue / quantityKg).toFixed(2))
            }
          };
        });

        return {
          ...prev,
          weather: updatedWeather || prev.weather,
          marketIntelligence: {
            ...prev.marketIntelligence,
            markets: updatedMarkets
          }
        };
      });
    } catch (err) {
      console.warn("Error updating agro metrics for detected location:", err);
    }
  }, []);

  // Location Detection Function
  const detectUserLocation = useCallback(async () => {
    setIsDetectingLocation(true);
    setLocationToast("Accessing device GPS hardware...");

    if (!("geolocation" in navigator)) {
      setLocationToast("Geolocation is not supported by your browser.");
      setIsDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const geo = await reverseGeocode(latitude, longitude);
          const detectedLoc: UserLocation = {
            city: geo.city,
            district: geo.district,
            state: geo.state,
            country: geo.country,
            latitude,
            longitude,
            isDetected: true
          };

          setUserLocation(detectedLoc);
          await updateAnalysisForLocation(detectedLoc);
          setLocationToast(`📍 Live Location Active: ${geo.displayName}`);
          setTimeout(() => setLocationToast(null), 5000);
        } catch (err) {
          console.error(err);
          setLocationToast("Coordinates received. Unable to resolve street address.");
        } finally {
          setIsDetectingLocation(false);
        }
      },
      async (err) => {
        console.warn("Geolocation permission error or timeout:", err.message);
        setLocationToast("Browser GPS prompt dismissed. Trying IP-based lookup...");

        // IP-based fallback lookup
        try {
          const ipRes = await fetch("https://ipapi.co/json/");
          if (ipRes.ok) {
            const data = await ipRes.json();
            if (data.latitude && data.longitude) {
              const detectedLoc: UserLocation = {
                city: data.city || "Local City",
                district: data.region || "District",
                state: data.region || "State",
                country: data.country_name || "India",
                latitude: data.latitude,
                longitude: data.longitude,
                isDetected: true
              };
              setUserLocation(detectedLoc);
              await updateAnalysisForLocation(detectedLoc);
              setLocationToast(`📍 Detected via Regional IP: ${detectedLoc.city}, ${detectedLoc.state}`);
              setTimeout(() => setLocationToast(null), 5000);
              setIsDetectingLocation(false);
              return;
            }
          }
        } catch (ipErr) {
          console.warn("IP lookup fallback failed:", ipErr);
        }

        setLocationToast("Please allow location access in your browser bar (top left 🔒 icon).");
        setTimeout(() => setLocationToast(null), 6000);
        setIsDetectingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  }, [updateAnalysisForLocation]);

  // Automatically attempt location detection on mount
  useEffect(() => {
    detectUserLocation();
  }, [detectUserLocation]);

  const handleAnalysisComplete = useCallback(async (newAnalysis: CompletePlantAnalysis) => {
    // First set the new analysis so results appear immediately
    setCurrentAnalysis(newAnalysis);
    setHistoryList(prev => [newAnalysis, ...prev]);
    // Then immediately re-apply GPS location to fix distances & live weather
    // (API returns hardcoded Chittoor distances; we override with real GPS)
    setUserLocation(prev => {
      if (prev?.isDetected) {
        // trigger updateAnalysisForLocation asynchronously with current loc
        updateAnalysisForLocation(prev);
      }
      return prev;
    });
  }, [updateAnalysisForLocation]);

  const scrollToSection = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-[#07120b] text-[#f3f4f6] selection:bg-emerald-500 selection:text-black font-sans relative">
      {/* Toast Notification for Location */}
      {locationToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-emerald-950/95 border border-emerald-400/50 text-emerald-200 text-xs font-mono shadow-[0_0_30px_rgba(16,185,129,0.4)] backdrop-blur-md animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>{locationToast}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        demoMode={demoMode}
        setDemoMode={setDemoMode}
        userLocation={userLocation}
        isDetectingLocation={isDetectingLocation}
        onDetectLocationClick={detectUserLocation}
        onAnalyzeClick={() => scrollToSection("plant-analysis")}
        onDashboardClick={() => scrollToSection("farmer-dashboard")}
        onMarketClick={() => scrollToSection("market-prices")}
        onMapClick={() => scrollToSection("farm-map")}
      />

      {/* 3D Agricultural Field Hero */}
      <Farm3DHero
        userLocation={userLocation}
        isDetectingLocation={isDetectingLocation}
        onDetectLocationClick={detectUserLocation}
        onAnalyzeClick={() => scrollToSection("plant-analysis")}
        onExploreFarmClick={() => scrollToSection("farmer-dashboard")}
      />

      {/* 3D Plant Diagnostic Scanner Section */}
      <PlantAnalysisSection
        onAnalysisComplete={handleAnalysisComplete}
        demoMode={demoMode}
        userLocation={userLocation}
      />

      {/* Analysis Results: 3D Glass Cards */}
      {currentAnalysis && (
        <>
          <AnalysisResultCards analysis={currentAnalysis} />

          {/* Smart Watering Engine Advisory */}
          <WateringCard
            initialWatering={currentAnalysis.watering}
            weather={currentAnalysis.weather}
            cropName={currentAnalysis.cropIdentification.crop}
          />

          {/* Multi-Mandi Price Intelligence & Transport Economics */}
          <MarketCard
            initialMarkets={currentAnalysis.marketIntelligence.markets}
            initialCrop={currentAnalysis.cropIdentification.crop}
            userLocation={userLocation}
          />

          {/* 3D Geospatial Interactive Farm & Mandi Map */}
          <InteractiveFarmMap
            markets={currentAnalysis.marketIntelligence.markets}
            userLocation={userLocation}
            onDetectLocationClick={detectUserLocation}
          />

          {/* Verified Treatment Guidance Section */}
          <TreatmentSection
            treatments={currentAnalysis.treatmentGuidance}
            cropName={currentAnalysis.cropIdentification.crop}
            diseaseName={currentAnalysis.diseaseResult.disease}
          />

          {/* Farmer Operations Dashboard & History Log */}
          <FarmerDashboard
            currentAnalysis={currentAnalysis}
            historyList={historyList}
            onSelectHistory={(analysis) => {
              setCurrentAnalysis(analysis);
              scrollToSection("analysis-results");
            }}
          />

          {/* AgroBot AI Agricultural Conversational Assistant */}
          <AgroBotAssistant currentAnalysis={currentAnalysis} />
        </>
      )}

      {/* Platform Footer */}
      <footer className="border-t border-emerald-500/20 bg-black/60 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xl font-bold font-heading text-white">
              AgroVision <span className="text-emerald-400">AI</span>
            </div>
            <p className="text-xs text-emerald-100/60 mt-1 max-w-md">
              Unified 3D Precision Agriculture Platform. Integrating Kaggle PlantVillage, PlantDoc, Crop Recommendation, Open-Meteo & Agmarknet Datasets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-emerald-400/80">
            <span className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/30">
              PlantVillage Transfer-Learning
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/30">
              PlantDoc Field Validated
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/30">
              Agmarknet Mandi Hubs
            </span>
          </div>

          <div className="text-xs text-emerald-100/40 text-center md:text-right">
            © 2026 AgroVision AI Systems. All agricultural decisions should be validated with local extension agents.
          </div>
        </div>
      </footer>
    </main>
  );
}
