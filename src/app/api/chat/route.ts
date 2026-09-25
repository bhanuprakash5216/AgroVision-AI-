import { NextResponse } from "next/server";
import { VERIFIED_TREATMENTS, HISTORICAL_MANDI_PRICES } from "@/lib/data-store";

export async function POST(request: Request) {
  try {
    const { message, activeAnalysis } = await request.json();
    const query = (message || "").toLowerCase().trim();

    let responseText = "";
    let dataCategory: "AI prediction" | "Historical data" | "Live data" | "Verified Agronomic Knowledge" = "Verified Agronomic Knowledge";
    let referenceTag = "";

    // 1. Disease inquiries
    if (query.includes("disease") || query.includes("what is wrong") || query.includes("early blight") || query.includes("infection")) {
      dataCategory = "AI prediction";
      if (activeAnalysis?.diseaseResult) {
        const d = activeAnalysis.diseaseResult;
        responseText = `🤖 **AI Prediction**: Based on our transfer-learning vision model, the current diagnosis is **${d.disease}** with **${Math.round(d.confidence * 100)}% confidence** (Severity: ${d.severity}).\n\n` +
          `• **Visible Symptoms**: ${d.symptoms.join("; ")}.\n` +
          `• **Safety Note**: This is an AI prediction, not a definitive laboratory confirmation. Field scouting is advised.`;
        referenceTag = `Model: ${d.source} | Date: ${d.date}`;
      } else {
        responseText = `🤖 **AI Prediction**: AgroVision uses an EfficientNet/MobileNet model trained on PlantVillage and validated against PlantDoc field imagery. When you upload a leaf photo, it classifies symptoms such as Early Blight, Late Blight, Common Rust, and Bacterial Spot.\n\nUpload an image in the Analysis tab to run diagnostic scanning.`;
        referenceTag = "PlantVillage & PlantDoc In-Field Protocol";
      }
    }
    // 2. Yellow leaves / nutrient deficiency inquiries
    else if (query.includes("yellow") || query.includes("nutrient") || query.includes("deficiency") || query.includes("nitrogen") || query.includes("fertilizer")) {
      dataCategory = "AI prediction";
      if (activeAnalysis?.nutrientIndication) {
        const n = activeAnalysis.nutrientIndication;
        responseText = `🌿 **Possible Deficiency Assessment**:\n` +
          `• **Indication**: **${n.possible_deficiency}** (AI Confidence: ${Math.round(n.confidence * 100)}%)\n` +
          `• **Agronomic Rationale**: ${n.reason}\n` +
          `• **Soil Context**: Nitrogen: ${n.soil_metrics.nitrogen_mg_kg} mg/kg | P: ${n.soil_metrics.phosphorus_mg_kg} | K: ${n.soil_metrics.potassium_mg_kg} | pH: ${n.soil_metrics.pH}\n\n` +
          `⚠️ **Crucial Rule**: Never rely solely on an image for fertilizer decisions. A certified soil test or petiole sap test is recommended.`;
        referenceTag = `Dataset: Kaggle Crop Recommendation | Date: ${n.date}`;
      } else {
        responseText = `🌿 **Why do leaves turn yellow?**\n` +
          `1. **Nitrogen (N) Deficiency**: Yellowing (chlorosis) begins on older lower leaves as mobile nitrogen is moved to new growth.\n` +
          `2. **Overwatering / Root Hypoxia**: Saturated soil suffocates roots, preventing mineral uptake.\n` +
          `3. **Early Blight**: Fungal chlorosis halos forming around concentric brown spots.\n\n` +
          `⚠️ AI indicates **Possible deficiency** only. Soil testing is required for confirmation.`;
        referenceTag = "ICAR Agronomy Leaf Diagnosis Handbook";
      }
    }
    // 3. Watering inquiries
    else if (query.includes("water") || query.includes("irrigate") || query.includes("moisture") || query.includes("rain")) {
      dataCategory = "Live data";
      if (activeAnalysis?.watering && activeAnalysis?.weather) {
        const w = activeAnalysis.watering;
        const met = activeAnalysis.weather;
        responseText = `💧 **Smart Watering Recommendation**:\n` +
          `• **Recommendation**: **${w.recommendation}**\n` +
          `• **Preferred Timing**: ${w.preferred_time}\n` +
          `• **Live Environmental Factors**: Soil Moisture: ${w.soil_moisture}% | Ambient Temp: ${met.temperature}°C | Rain Probability: ${met.rain_probability}%\n` +
          `• **Reasoning**: ${w.reason}\n\n` +
          `📡 Ready for continuous telemetry integration via ESP32 soil moisture probes.`;
        referenceTag = `Telemetry: ${w.esp32_sensor_status} | Live Weather: ${met.source}`;
      } else {
        responseText = `💧 **Irrigation Guidelines**:\n` +
          `We calculate watering needs using Crop Type + Growth Stage + Soil Moisture (e.g. from ESP32 sensor) + Ambient Temperature + Rain Probability Forecast.\n\n` +
          `If soil moisture is at 24% and rain probability is 70%, the system advises **Do not irrigate now** to conserve water and prevent fungal diseases.`;
        referenceTag = "AgroVision Dynamic Evapotranspiration Water Engine";
      }
    }
    // 4. Market price inquiries
    else if (query.includes("price") || query.includes("market") || query.includes("mandi") || query.includes("sell") || query.includes("apmc")) {
      dataCategory = "Historical data";
      const cropQuery = query.includes("potato") ? "Potato" : "Tomato";
      const mandis = HISTORICAL_MANDI_PRICES.filter(m => m.commodity.toLowerCase().includes(cropQuery.toLowerCase()));
      
      responseText = `📊 **Market Intelligence (${cropQuery})**:\n` +
        `*Notice: All price records are Historical/reference data with explicit collection dates.*\n\n` +
        mandis.slice(0, 3).map(m => 
          `• **${m.market}** (${m.district}, ${m.state}): Modal Price **₹${m.modal_price}/kg** (Range: ₹${m.min_price} - ₹${m.max_price})\n` +
          `   Distance: ${m.distance_km} km | Data date: ${m.data_date} [Historical/reference data]`
        ).join("\n\n") +
        `\n\n🚚 **Net Price Calculation**: AgroVision deducts transport costs (₹14/km) and APMC cess to show net earnings so you can choose transparently.`;
      referenceTag = "Agmarknet APMC Commodity Price Archive";
    }
    // 5. Treatment inquiries
    else if (query.includes("treatment") || query.includes("spray") || query.includes("cure") || query.includes("pesticide") || query.includes("organic")) {
      dataCategory = "Verified Agronomic Knowledge";
      const items = VERIFIED_TREATMENTS["Tomato Early Blight"];
      responseText = `💊 **Verified Treatment Guidance (Non-Prescriptive)**:\n\n` +
        `🌱 **Biological / Organic Option**:\n` +
        `• Active Ingredient: *${items[0].active_ingredient}*\n` +
        `• Application: ${items[0].application_method}\n` +
        `• Safety: ${items[0].safety_precautions[0]}\n` +
        `• Pre-Harvest Interval (PHI): ${items[0].pre_harvest_interval}\n\n` +
        `🧪 **Chemical / Targeted Option**:\n` +
        `• Active Ingredient: *${items[1].active_ingredient}*\n` +
        `• Application: ${items[1].application_method}\n` +
        `• Safety: ${items[1].safety_precautions[0]}\n` +
        `• Pre-Harvest Interval (PHI): ${items[1].pre_harvest_interval}\n\n` +
        `⚠️ AI does not prescribe chemicals. Refer to container labels and local regulations.`;
      referenceTag = "ICAR & CIBRC Certified Agricultural Guidelines";
    }
    // 6. Default response
    else {
      responseText = `Hello! I am **AgroBot**, your agricultural intelligence assistant. I can assist you with:\n\n` +
        `1. **Plant Disease Diagnostics**: "What disease does this plant have?"\n` +
        `2. **Nutrient Checks**: "Why are my leaves yellow? What nutrients may be missing?"\n` +
        `3. **Smart Watering**: "When should I water my tomato crop?"\n` +
        `4. **Mandi Prices**: "What are the available tomato prices in nearby markets?"\n\n` +
        `Every answer strictly specifies whether it is based on **AI prediction**, **Historical data**, **Live data**, or **User-provided information**.`;
      referenceTag = "AgroVision AI System";
    }

    return NextResponse.json({
      reply: responseText,
      category: dataCategory,
      referenceTag,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return NextResponse.json({ error: "AgroBot assistant error", details: String(err) }, { status: 500 });
  }
}
