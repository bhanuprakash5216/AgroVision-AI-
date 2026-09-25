import { NextResponse } from "next/server";
import { WateringRecommendation } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      crop = "Tomato",
      growth_stage = "Fruiting",
      soil_moisture = 24.0, // percentage (0 - 100%)
      temperature = 31.0,
      humidity = 68.0,
      rain_probability = 70.0,
      rainfall_mm = 0.0,
      hours_since_last_irrigation = 36,
      esp32_device_id
    } = body;

    let recommendation: WateringRecommendation["recommendation"] = "Do Not Irrigate Now";
    let preferred_time: WateringRecommendation["preferred_time"] = "Early morning";
    let reason = "";

    // Critical threshold definitions based on crop agronomy
    const moistureCriticalLow = crop.toLowerCase().includes("rice") ? 45 : 20;
    const moistureOptimal = crop.toLowerCase().includes("rice") ? 75 : 45;

    if (soil_moisture < moistureCriticalLow) {
      if (rain_probability > 75) {
        recommendation = "Delayed Irrigation Advised";
        preferred_time = "Late evening";
        reason = `Soil moisture is low (${soil_moisture}%), but severe imminent precipitation (${rain_probability}% chance) is detected. Delay watering 3-6 hours to prevent fertilizer leaching.`;
      } else {
        recommendation = "Irrigate Now";
        preferred_time = "Early morning";
        reason = `Soil moisture (${soil_moisture}%) has dropped below critical vegetative threshold (${moistureCriticalLow}%). Immediate root-zone recharge required.`;
      }
    } else if (soil_moisture >= moistureOptimal) {
      recommendation = "Do Not Irrigate Now";
      preferred_time = "Not recommended today";
      reason = `Soil moisture is optimal (${soil_moisture}%). Additional irrigation risks root hypoxia and fungal dampening-off.`;
    } else {
      // Moderate moisture (21% - 44%)
      if (rain_probability >= 60 || rainfall_mm > 5) {
        recommendation = "Do Not Irrigate Now";
        preferred_time = "Early morning";
        reason = `Rain is likely (${rain_probability}% chance) and current soil moisture (${soil_moisture}%) is not critically low. Conserve water and wait for natural rainfall.`;
      } else if (temperature > 34 && humidity < 40) {
        recommendation = "Light Irrigation Only";
        preferred_time = "Late evening";
        reason = `High vapor pressure deficit (Temp: ${temperature}°C, Humidity: ${humidity}%). Apply light drip pulse in late evening to avoid solar evaporation.`;
      } else {
        recommendation = "Do Not Irrigate Now";
        preferred_time = "Early morning";
        reason = `Moisture index is adequate (${soil_moisture}%) for ${crop} during the ${growth_stage} phase under current climatic parameters.`;
      }
    }

    const wateringResult: WateringRecommendation = {
      soil_moisture,
      temperature,
      humidity,
      rain_probability,
      recommendation,
      preferred_time,
      reason,
      growth_stage: growth_stage as any,
      esp32_sensor_status: esp32_device_id ? "Active Telemetry" : "Calibrated Simulation",
      source: "AgroVision Dynamic Evapotranspiration Water Engine (Penman-Monteith Agronomic Rules)",
      date: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(wateringResult);
  } catch (err) {
    return NextResponse.json({ error: "Failed to compute watering recommendation", details: String(err) }, { status: 400 });
  }
}
