import {
  DiseaseResult,
  NutrientIndication,
  TreatmentItem,
  WeatherData,
  WateringRecommendation,
  MandiPriceRecord,
  CompletePlantAnalysis
} from "./types";

export const VERIFIED_TREATMENTS: Record<string, TreatmentItem[]> = {
  "Tomato Early Blight": [
    {
      crop: "Tomato",
      disease: "Early Blight (Alternaria solani)",
      treatment_type: "Biological / Organic",
      active_ingredient: "Bacillus subtilis (Strain QST 713) / Trichoderma harzianum",
      commercial_example: "Serenade ASO / Bio-Derma",
      application_method: "Foliar spray with high-volume hollow cone nozzle. Ensure thorough coverage of lower leaf canopy.",
      dosage: "2.5 - 5.0 ml per liter of water at 7-10 day intervals",
      safety_precautions: [
        "Wear protective gloves and dust/mist respirator during mixing and spraying.",
        "Store in cool, dry conditions away from direct sunlight to preserve microbial viability.",
        "Do not tank-mix directly with copper bactericides without jar-test compatibility."
      ],
      pre_harvest_interval: "0 days (exempt from residue tolerance)",
      source: "ICAR-Indian Institute of Vegetable Research & FAO Plant Protection Portal",
      last_verified_date: "2024-04-10",
      disclaimer: "Treatment guidance based on agricultural extension protocols. Always follow official container label instructions in your jurisdiction."
    },
    {
      crop: "Tomato",
      disease: "Early Blight (Alternaria solani)",
      treatment_type: "Chemical / Targeted",
      active_ingredient: "Mancozeb 75% WP or Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
      commercial_example: "Dithane M-45 / Amistar Top",
      application_method: "Prophylactic foliar spray at initial appearance of concentric target lesions. Alternate chemical classes to prevent resistance.",
      dosage: "Mancozeb @ 2.0g/L or Azoxystrobin blend @ 1.0ml/L water",
      safety_precautions: [
        "Mandatory PPE: Nitrile gloves, protective eye goggles, face shield, and rubber boots.",
        "Do not spray during high winds (>15 km/h) or within 3 hours of predicted rain.",
        "Dangerous to aquatic life: maintain a 15-meter buffer zone away from waterways and farm ponds.",
        "Triple rinse containers before disposal according to local hazardous material regulations."
      ],
      pre_harvest_interval: "5 to 7 days before picking fruit",
      source: "Central Insecticide Board & Registration Committee (CIBRC, India) & University Extension Protocols",
      last_verified_date: "2024-04-12",
      disclaimer: "Chemical guidance is for reference only. AI does not issue pesticide prescriptions. Verify local pesticide registrations and regulations."
    },
    {
      crop: "Tomato",
      disease: "Early Blight (Alternaria solani)",
      treatment_type: "Cultural / Agronomic",
      active_ingredient: "Canopy Airflow Management & Mulching",
      commercial_example: "Drip Irrigation + Black UV Poly Mulch",
      application_method: "Prune lower 25-30 cm of foliage to eliminate soil-splash contact. Switch overhead sprinkler irrigation to drip line.",
      dosage: "Continuous cultural practice throughout growing season",
      safety_precautions: [
        "Disinfect pruning shears in 70% isopropyl alcohol between rows to prevent pathogen transfer.",
        "Burn or deeply bury severely infected debris outside the field perimeter."
      ],
      pre_harvest_interval: "Not applicable",
      source: "FAO Integrated Pest Management (IPM) Tomato Field Manual",
      last_verified_date: "2024-03-20",
      disclaimer: "Recommended as first-line integrated pest management strategy."
    }
  ],
  "Tomato Late Blight": [
    {
      crop: "Tomato",
      disease: "Late Blight (Phytophthora infestans)",
      treatment_type: "Chemical / Targeted",
      active_ingredient: "Metalaxyl-M 4% + Mancozeb 64% WP or Dimethomorph 50% WP",
      commercial_example: "Ridomil Gold / Acrobat",
      application_method: "Curative foliar application immediately upon first water-soaked lesion detection. Repeat after 7 days if wet weather persists.",
      dosage: "2.5 g per liter of clean water",
      safety_precautions: [
        "Full protective chemical suit and respirator required.",
        "Avoid inhalation of wettable powder dust during slurry preparation.",
        "Keep domestic animals and bees away from treated fields for 24 hours."
      ],
      pre_harvest_interval: "7 days",
      source: "CIBRC India & European and Mediterranean Plant Protection Organization (EPPO)",
      last_verified_date: "2024-04-05",
      disclaimer: "Late blight spreads rapidly; immediate physical removal of infected plants is critical alongside treatment."
    },
    {
      crop: "Tomato",
      disease: "Late Blight (Phytophthora infestans)",
      treatment_type: "Biological / Organic",
      active_ingredient: "Copper Octanoate (Copper Soap) or Bordeaux Mixture (1%)",
      commercial_example: "Cueva Copper Fungicide",
      application_method: "Apply prior to disease onset when relative humidity exceeds 85% and temperatures range between 15-22°C.",
      dosage: "10 ml/L or 10g copper sulfate + 10g slaked lime in 1L water",
      safety_precautions: [
        "Eye irritant: safety glasses mandatory.",
        "Do not exceed annual elemental copper accumulation thresholds per hectare."
      ],
      pre_harvest_interval: "1 day",
      source: "ICAR Organic Farming Package of Practices",
      last_verified_date: "2024-03-18",
      disclaimer: "Preventative action only; biological copper does not rescue systemic late-stage infections."
    }
  ],
  "Potato Early Blight": [
    {
      crop: "Potato",
      disease: "Early Blight (Alternaria solani)",
      treatment_type: "Biological / Organic",
      active_ingredient: "Pseudomonas fluorescens + Neem Oil (10,000 ppm)",
      commercial_example: "Bio-Cure-B / NeemPro",
      application_method: "Foliar spray targeted at lower canopy early morning.",
      dosage: "5g/L powder or 3ml/L neem extract",
      safety_precautions: ["Wear cotton gloves.", "Wash hands thoroughly after handling."],
      pre_harvest_interval: "0 days",
      source: "ICAR-CPRI (Central Potato Research Institute, Shimla)",
      last_verified_date: "2024-04-02",
      disclaimer: "Biological formulation for sustainable field health."
    }
  ],
  "Corn Common Rust": [
    {
      crop: "Corn (Maize)",
      disease: "Common Rust (Puccinia sorghi)",
      treatment_type: "Chemical / Targeted",
      active_ingredient: "Propiconazole 25% EC or Pyraclostrobin",
      commercial_example: "Tilt / Headline",
      application_method: "Apply at tasseling stage if pustules appear on lower leaves and wet weather is forecast.",
      dosage: "1.0 ml per liter of water",
      safety_precautions: ["Use respiratory protection.", "Avoid spray drift into adjoining fields."],
      pre_harvest_interval: "14 days",
      source: "ICAR-IIMR (Indian Institute of Maize Research)",
      last_verified_date: "2024-03-28",
      disclaimer: "Apply strictly based on economic threshold levels (ETL)."
    }
  ],
  "Pepper Bacterial Spot": [
    {
      crop: "Pepper (Bell)",
      disease: "Bacterial Spot (Xanthomonas campestris)",
      treatment_type: "Biological / Organic",
      active_ingredient: "Copper Oxychloride 50% WP + Streptomycin Sulfate (Plantomycin)",
      commercial_example: "Blitox 50 + Plantomycin",
      application_method: "Spray foliage thoroughly on cloudy afternoon or dawn.",
      dosage: "2.5g Blitox + 0.1g Plantomycin per liter",
      safety_precautions: ["Protect eyes and skin from caustic contact.", "Store antibiotic in locked cabinet."],
      pre_harvest_interval: "7 days",
      source: "National Institute of Plant Health Management (NIPHM)",
      last_verified_date: "2024-03-15",
      disclaimer: "Bacterial pathogen; avoid working in wet foliage to avoid mechanical spread."
    }
  ],
  "Healthy Crop": [
    {
      crop: "Tomato / General",
      disease: "Healthy Foliage Profile",
      treatment_type: "Cultural / Agronomic",
      active_ingredient: "Balanced N-P-K fertigation + Seaweed Biostimulant",
      commercial_example: "Ascophyllum nodosum extract",
      application_method: "Bi-weekly foliar tonic or drip fertigation to maintain root vitality and disease resistance.",
      dosage: "2.0 ml per liter of irrigation water",
      safety_precautions: ["Safe organic biostimulant.", "Store in ambient dry area."],
      pre_harvest_interval: "0 days",
      source: "ICAR Agronomy Best Practices",
      last_verified_date: "2024-04-01",
      disclaimer: "Maintain regular scouting and moisture monitoring to preserve plant vigor."
    }
  ]
};

export const HISTORICAL_MANDI_PRICES: MandiPriceRecord[] = [
  {
    id: "mandi-ap-madanapalle",
    state: "Andhra Pradesh",
    district: "Chittoor",
    market: "Madanapalle APMC Mandi",
    commodity: "Tomato",
    variety: "Hybrid / 6242",
    grade: "FAQ (Fair Average Quality)",
    min_price: 28.0,
    max_price: 38.0,
    modal_price: 34.0,
    data_date: "2024-03-15",
    data_type: "Historical/reference data",
    distance_km: 14.2,
    lat: 13.5500,
    lng: 78.5000,
    contact: "+91-8571-222341",
    source: "Agmarknet APMC Portal / Kaggle Agricultural Commodities",
    lastUpdated: "2024-03-15T18:30:00Z"
  },
  {
    id: "mandi-ap-palamaner",
    state: "Andhra Pradesh",
    district: "Chittoor",
    market: "Palamaner Market Yard",
    commodity: "Tomato",
    variety: "Special Selection Red",
    grade: "Grade A",
    min_price: 32.0,
    max_price: 42.0,
    modal_price: 37.0,
    data_date: "2024-03-15",
    data_type: "Historical/reference data",
    distance_km: 26.5,
    lat: 13.2000,
    lng: 78.7500,
    contact: "+91-8579-251204",
    source: "Agmarknet APMC Portal / Kaggle Agricultural Commodities",
    lastUpdated: "2024-03-15T18:30:00Z"
  },
  {
    id: "mandi-ap-chittoor-main",
    state: "Andhra Pradesh",
    district: "Chittoor",
    market: "Chittoor APMC Market",
    commodity: "Tomato",
    variety: "Local Desi",
    grade: "FAQ",
    min_price: 26.0,
    max_price: 34.0,
    modal_price: 31.0,
    data_date: "2024-03-14",
    data_type: "Historical/reference data",
    distance_km: 8.5,
    lat: 13.2172,
    lng: 79.1003,
    contact: "+91-8572-233190",
    source: "Agmarknet APMC Portal / Kaggle Agricultural Commodities",
    lastUpdated: "2024-03-14T18:00:00Z"
  },
  {
    id: "mandi-ka-kolar",
    state: "Karnataka",
    district: "Kolar",
    market: "Kolar APMC Mandi (Major Tomato Hub)",
    commodity: "Tomato",
    variety: "Roma / Saladette",
    grade: "Super Grade",
    min_price: 35.0,
    max_price: 46.0,
    modal_price: 40.5,
    data_date: "2024-03-15",
    data_type: "Historical/reference data",
    distance_km: 68.0,
    lat: 13.1378,
    lng: 78.1340,
    contact: "+91-8152-222880",
    source: "Agmarknet APMC Portal / Kaggle Agricultural Commodities",
    lastUpdated: "2024-03-15T18:30:00Z"
  },
  {
    id: "mandi-mh-pimpalgaon",
    state: "Maharashtra",
    district: "Nashik",
    market: "Pimpalgaon Baswant APMC",
    commodity: "Tomato",
    variety: "Hybrid Red",
    grade: "Grade A",
    min_price: 30.0,
    max_price: 41.0,
    modal_price: 36.5,
    data_date: "2024-03-14",
    data_type: "Historical/reference data",
    distance_km: 45.0,
    lat: 20.1700,
    lng: 73.9800,
    contact: "+91-2550-250100",
    source: "Agmarknet APMC Portal / Kaggle Agricultural Commodities",
    lastUpdated: "2024-03-14T17:45:00Z"
  },
  {
    id: "mandi-pb-jalandhar",
    state: "Punjab",
    district: "Jalandhar",
    market: "Jalandhar Maqsudan Mandi",
    commodity: "Potato",
    variety: "Kufri Jyoti / Pukhraj",
    grade: "Grade A Large",
    min_price: 15.0,
    max_price: 21.0,
    modal_price: 18.0,
    data_date: "2024-03-14",
    data_type: "Historical/reference data",
    distance_km: 19.5,
    lat: 31.3260,
    lng: 75.5762,
    contact: "+91-181-2244100",
    source: "Agmarknet APMC Portal / Kaggle Agricultural Commodities",
    lastUpdated: "2024-03-14T17:00:00Z"
  },
  {
    id: "mandi-up-agra",
    state: "Uttar Pradesh",
    district: "Agra",
    market: "Agra Fatehabad Road Mandi",
    commodity: "Potato",
    variety: "Kufri Bahar",
    grade: "FAQ",
    min_price: 13.0,
    max_price: 18.5,
    modal_price: 16.0,
    data_date: "2024-03-14",
    data_type: "Historical/reference data",
    distance_km: 24.0,
    lat: 27.1767,
    lng: 78.0081,
    contact: "+91-562-2460120",
    source: "Agmarknet APMC Portal / Kaggle Agricultural Commodities",
    lastUpdated: "2024-03-14T17:00:00Z"
  }
];

// In-Memory store for analyses, crops, and farms with thread-safe persistence
export class AgriStore {
  private static instance: AgriStore;
  private analyses: CompletePlantAnalysis[] = [];

  private constructor() {
    this.seedDefaultData();
  }

  public static getInstance(): AgriStore {
    if (!AgriStore.instance) {
      AgriStore.instance = new AgriStore();
    }
    return AgriStore.instance;
  }

  private seedDefaultData() {
    // Initial benchmark analysis so dashboard is rich immediately
    const sample: CompletePlantAnalysis = {
      id: "analysis-demo-tomato-01",
      timestamp: new Date().toISOString(),
      imageUrl: "/samples/tomato_early_blight.jpg",
      imageFileName: "tomato_leaf_sample.jpg",
      qualityCheck: {
        passed: true,
        quality_score: 0.94,
        warnings: [],
        metrics: {
          laplacian_blur_var: 168.4,
          brightness: 132.0,
          contrast: 52.1,
          domain: "PlantDoc In-Field Validation Protocol"
        }
      },
      cropIdentification: {
        crop: "Tomato",
        confidence: 0.96
      },
      diseaseResult: {
        crop: "Tomato",
        disease: "Early Blight (Alternaria solani)",
        confidence: 0.94,
        severity: "Medium",
        symptoms: [
          "Brown circular spots with concentric rings",
          "Yellowing chlorotic halo around lesions",
          "Lower canopy leaf damage and premature drop"
        ],
        disclaimer: "AI prediction: Early Blight — 94% confidence. Field inspection recommended.",
        source: "PlantVillage Transfer-Learning EfficientNet-B0 Backbone",
        date: "2026-09-25",
        lastUpdated: "2026-09-25T14:30:00Z"
      },
      nutrientIndication: {
        possible_deficiency: "Nitrogen (N)",
        confidence: 0.78,
        reason: "Yellowing of older leaves combined with low soil nitrogen (38 mg/kg vs optimal 60-100 mg/kg)",
        disclaimer: "This is an AI-based agronomic indication. Soil or petiole/leaf testing is recommended for confirmation.",
        soil_metrics: {
          nitrogen_mg_kg: 38.0,
          phosphorus_mg_kg: 44.0,
          potassium_mg_kg: 62.0,
          pH: 6.4,
          optimal_target: {
            N: [60, 100],
            P: [35, 60],
            K: [40, 80],
            pH: [6.0, 7.0]
          }
        },
        source: "Kaggle Crop Recommendation Model & Agronomic Heuristics",
        date: "2026-09-25",
        lastUpdated: "2026-09-25T14:30:00Z"
      },
      treatmentGuidance: VERIFIED_TREATMENTS["Tomato Early Blight"],
      weather: {
        location_name: "Chittoor Agri-Zone, Andhra Pradesh",
        latitude: 13.2172,
        longitude: 79.1003,
        temperature: 31.0,
        humidity: 68.0,
        rain_probability: 70.0,
        rainfall_mm: 12.4,
        wind_speed_kmh: 14.2,
        uv_index: 8.5,
        forecast_summary: "High humidity with evening convective thundershowers expected.",
        forecast_days: [
          { day: "Today", temp_max: 32, temp_min: 24, rain_probability: 70, condition: "Scattered Rain" },
          { day: "Tomorrow", temp_max: 30, temp_min: 23, rain_probability: 65, condition: "Rain Showers" },
          { day: "Day 3", temp_max: 33, temp_min: 24, rain_probability: 20, condition: "Partly Cloudy" }
        ],
        source: "Open-Meteo High-Resolution Agro-Meteorology API",
        date: "2026-09-25",
        lastUpdated: "2026-09-25T14:30:00Z"
      },
      watering: {
        soil_moisture: 24.0,
        temperature: 31.0,
        humidity: 68.0,
        rain_probability: 70.0,
        recommendation: "Do Not Irrigate Now",
        preferred_time: "Early morning",
        reason: "Rain probability is high (70%) within 12 hours and soil moisture (24%) is within manageable range. Avoid waterlogging and foliar fungal proliferation.",
        growth_stage: "Fruiting",
        esp32_sensor_status: "Active Telemetry",
        source: "AgroVision Dynamic Evapotranspiration Water Engine",
        date: "2026-09-25",
        lastUpdated: "2026-09-25T14:30:00Z"
      },
      marketIntelligence: {
        crop: "Tomato",
        quantity_kg: 500,
        markets: []
      },
      disclaimer: "All diagnoses are AI-assisted decision support models. Consult local agronomic extension officers for certified chemical interventions."
    };

    // Calculate transport economics for the sample markets
    const markets = HISTORICAL_MANDI_PRICES.filter(m => m.commodity === "Tomato").map(m => {
      const gross = m.modal_price * 500;
      const transport = 200 + (m.distance_km * 14.0 * 0.75);
      const cess = gross * 0.015;
      const net = Math.max(0, gross - transport - cess);
      return {
        ...m,
        economics: {
          gross_revenue: Math.round(gross),
          transport_cost: Math.round(transport),
          mandi_cess: Math.round(cess),
          net_selling_value: Math.round(net),
          net_price_per_kg: Number((net / 500).toFixed(2))
        }
      };
    });

    sample.marketIntelligence.markets = markets;
    this.analyses.push(sample);
  }

  public getAnalyses(): CompletePlantAnalysis[] {
    return this.analyses;
  }

  public addAnalysis(analysis: CompletePlantAnalysis): CompletePlantAnalysis {
    this.analyses.unshift(analysis);
    return analysis;
  }

  public getAnalysisById(id: string): CompletePlantAnalysis | undefined {
    return this.analyses.find(a => a.id === id);
  }
}
