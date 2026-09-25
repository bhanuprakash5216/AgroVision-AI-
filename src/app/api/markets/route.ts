import { NextResponse } from "next/server";
import { HISTORICAL_MANDI_PRICES } from "@/lib/data-store";
import { MandiPriceRecord } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const crop = searchParams.get("crop") || "Tomato";
  const state = searchParams.get("state") || "Andhra Pradesh";
  const district = searchParams.get("district") || "Chittoor";
  const quantityKg = parseFloat(searchParams.get("quantity") || "500");

  const cropLower = crop.toLowerCase();
  
  // Filter or match mandis for commodity
  let matched = HISTORICAL_MANDI_PRICES.filter(m => 
    m.commodity.toLowerCase().includes(cropLower) || cropLower.includes(m.commodity.toLowerCase())
  );

  if (matched.length === 0) {
    matched = HISTORICAL_MANDI_PRICES.slice(0, 4);
  }

  // Calculate transport costs and net values dynamically
  const analyzedMarkets: MandiPriceRecord[] = matched.map(mandi => {
    const gross = mandi.modal_price * quantityKg;
    // Transport model: Base loading/unloading (₹200) + (distance_km * ₹14/km * 0.75 capacity allocation)
    const transportCost = 200 + (mandi.distance_km * 14.0 * 0.75);
    const cess = gross * 0.015; // 1.5% APMC market yard cess
    const netValue = Math.max(0, gross - transportCost - cess);
    const netPricePerKg = Number((netValue / quantityKg).toFixed(2));

    return {
      ...mandi,
      economics: {
        gross_revenue: Math.round(gross),
        transport_cost: Math.round(transportCost),
        mandi_cess: Math.round(cess),
        net_selling_value: Math.round(netValue),
        net_price_per_kg: netPricePerKg
      }
    };
  });

  return NextResponse.json({
    crop,
    state,
    district,
    quantity_kg: quantityKg,
    markets: analyzedMarkets,
    disclaimer: "Every market price shown is Historical/reference data from Agmarknet / Kaggle records with explicit data dates. Connect to real-time e-NAM / APMC feeds for same-day trading decisions.",
    pricing_model_note: "Transport costs reflect standard rural freight tariffs (₹14/km light commercial vehicle). Farmers retain autonomy to choose optimal mandi."
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const crop = body.crop || "Tomato";
    const state = body.state || "Andhra Pradesh";
    const district = body.district || "Chittoor";
    const quantityKg = parseFloat(body.quantity || "500");

    const response = await GET(new Request(`http://localhost/api/markets?crop=${encodeURIComponent(crop)}&state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}&quantity=${quantityKg}`));
    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to query markets", details: String(err) }, { status: 400 });
  }
}
