export interface QualityCheck {
  passed: boolean;
  quality_score: number;
  warnings: string[];
  metrics: {
    laplacian_blur_var: number;
    brightness: number;
    contrast: number;
    domain: string;
  };
}

export interface DiseaseResult {
  crop: string;
  disease: string;
  confidence: number;
  severity: "None" | "Low" | "Medium" | "High" | "Critical";
  symptoms: string[];
  disclaimer: string;
  source: string;
  date: string;
  lastUpdated: string;
}

export interface NutrientIndication {
  possible_deficiency: string;
  confidence: number;
  reason: string;
  disclaimer: string;
  soil_metrics: {
    nitrogen_mg_kg: number;
    phosphorus_mg_kg: number;
    potassium_mg_kg: number;
    pH: number;
    optimal_target?: {
      N: [number, number];
      P: [number, number];
      K: [number, number];
      pH: [number, number];
    };
  };
  source: string;
  date: string;
  lastUpdated: string;
}

export interface TreatmentItem {
  crop: string;
  disease: string;
  treatment_type: "Biological / Organic" | "Chemical / Targeted" | "Cultural / Agronomic";
  active_ingredient: string;
  commercial_example: string;
  application_method: string;
  dosage: string;
  safety_precautions: string[];
  pre_harvest_interval: string; // e.g. "3 days"
  source: string;
  last_verified_date: string;
  disclaimer: string;
}

export interface WeatherData {
  location_name: string;
  latitude: number;
  longitude: number;
  temperature: number;
  humidity: number;
  rain_probability: number;
  rainfall_mm: number;
  wind_speed_kmh: number;
  uv_index: number;
  forecast_summary: string;
  forecast_days: {
    day: string;
    temp_max: number;
    temp_min: number;
    rain_probability: number;
    condition: string;
  }[];
  source: string;
  date: string;
  lastUpdated: string;
}

export interface WateringRecommendation {
  soil_moisture: number; // percentage
  temperature: number;
  humidity: number;
  rain_probability: number;
  recommendation: "Irrigate Now" | "Do Not Irrigate Now" | "Delayed Irrigation Advised" | "Light Irrigation Only";
  preferred_time: "Early morning" | "Late evening" | "Not recommended today";
  reason: string;
  growth_stage: "Vegetative" | "Flowering" | "Fruiting" | "Maturity";
  esp32_sensor_status: "Active Telemetry" | "Calibrated Simulation";
  source: string;
  date: string;
  lastUpdated: string;
}

export interface MandiPriceRecord {
  id: string;
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  grade: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  data_date: string; // "YYYY-MM-DD"
  data_type: "Historical/reference data" | "Live Mandi Stream";
  distance_km: number;
  lat: number;
  lng: number;
  contact?: string;
  source: string;
  lastUpdated: string;
  economics?: {
    gross_revenue: number;
    transport_cost: number;
    mandi_cess: number;
    net_selling_value: number;
    net_price_per_kg: number;
  };
}

export interface CompletePlantAnalysis {
  id: string;
  timestamp: string;
  imageUrl: string;
  imageFileName: string;
  qualityCheck: QualityCheck;
  cropIdentification: {
    crop: string;
    confidence: number;
  };
  diseaseResult: DiseaseResult;
  nutrientIndication: NutrientIndication;
  treatmentGuidance: TreatmentItem[];
  weather: WeatherData;
  watering: WateringRecommendation;
  marketIntelligence: {
    crop: string;
    quantity_kg: number;
    markets: MandiPriceRecord[];
  };
  disclaimer: string;
}
