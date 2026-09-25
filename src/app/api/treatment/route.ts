import { NextResponse } from "next/server";
import { VERIFIED_TREATMENTS } from "@/lib/data-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const crop = searchParams.get("crop") || "Tomato";
  const disease = searchParams.get("disease") || "Early Blight";

  const key = `${crop} ${disease}`.trim();
  
  // Find matching treatment key
  const matchingKey = Object.keys(VERIFIED_TREATMENTS).find(k => 
    k.toLowerCase().includes(crop.toLowerCase()) && 
    (k.toLowerCase().includes(disease.toLowerCase()) || disease.toLowerCase().includes(k.toLowerCase()))
  );

  const treatments = matchingKey 
    ? VERIFIED_TREATMENTS[matchingKey] 
    : (VERIFIED_TREATMENTS["Tomato Early Blight"] || []);

  return NextResponse.json({
    crop,
    disease,
    guidance_type: "Treatment guidance (Non-prescriptive)",
    treatments,
    disclaimer: "Treatment guidance is compiled strictly from verified agricultural extension sources (ICAR, FAO, CIBRC). The AI does not prescribe chemical formulations. Always consult certified container labels and local agronomic authorities."
  });
}
