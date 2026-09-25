import { NextResponse } from "next/server";
import { VERIFIED_TREATMENTS } from "@/lib/data-store";

export async function GET() {
  const catalog = [
    {
      crop: "Tomato",
      disease: "Early Blight (Alternaria solani)",
      severity: "Medium",
      symptoms: ["Brown circular spots with concentric rings", "Target board lesions on lower leaves", "Yellow chlorotic halo"],
      pathogen: "Fungal",
      benchmarkModel: "EfficientNet-B0 (PlantVillage)"
    },
    {
      crop: "Tomato",
      disease: "Late Blight (Phytophthora infestans)",
      severity: "High",
      symptoms: ["Water-soaked irregular lesions", "White fuzzy mold on underside of leaves", "Rapid stem rot"],
      pathogen: "Oomycete",
      benchmarkModel: "EfficientNet-B0 (PlantVillage)"
    },
    {
      crop: "Potato",
      disease: "Early Blight (Alternaria solani)",
      severity: "Medium",
      symptoms: ["Concentric ringed brown spots", "Yellowing of adjacent tissues", "Tuber lesions"],
      pathogen: "Fungal",
      benchmarkModel: "MobileNetV3 (PlantVillage)"
    },
    {
      crop: "Corn (Maize)",
      disease: "Common Rust (Puccinia sorghi)",
      severity: "Medium",
      symptoms: ["Cinnamon-brown powdery pustules", "Spore dusting on touch", "Chlorotic bands"],
      pathogen: "Fungal",
      benchmarkModel: "ConvNeXt-Tiny (PlantVillage)"
    },
    {
      crop: "Pepper (Bell)",
      disease: "Bacterial Spot (Xanthomonas campestris)",
      severity: "High",
      symptoms: ["Water-soaked dark lesions", "Leaf drop and defoliation", "Rough scabby fruit blisters"],
      pathogen: "Bacterial",
      benchmarkModel: "MobileNetV3 (PlantVillage)"
    }
  ];

  return NextResponse.json({
    catalog,
    disclaimer: "All classifications are transfer-learning model predictions. Real-world validation performed via PlantDoc benchmark."
  });
}
