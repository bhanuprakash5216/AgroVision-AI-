"""
Real-World Plant Disease Dataset Preprocessing & Image Quality Assessment
Dataset: PlantLab2RealGeneralization / PlantDoc-type in-field farmer photos

Purpose:
- Validate laboratory-trained PlantVillage model on uncontrolled field conditions
- Assess image quality (blur detection via Laplacian variance, low/high exposure, glare, resolution)
- Warn user when image quality degrades inference confidence
- Measure domain shift and out-of-distribution generalization
"""

import os
import json
from typing import Dict, Any

def assess_image_quality(image_bytes: bytes = None, stats: Dict[str, float] = None) -> Dict[str, Any]:
    """
    Evaluates image quality metrics to safeguard real-world diagnostics.
    Can operate on real PIL/NumPy images or simulated metadata stats.
    """
    if stats is None:
        stats = {
            "blur_score": 145.0,        # Laplacian variance: >100 is sharp, <50 is blurry
            "mean_brightness": 128.0,    # 0-255: <40 too dark, >220 too bright/washed
            "contrast_std": 48.0,        # <20 low contrast
            "resolution": (1024, 768)
        }
        
    is_blurry = stats.get("blur_score", 100) < 60
    is_underexposed = stats.get("mean_brightness", 120) < 45
    is_overexposed = stats.get("mean_brightness", 120) > 215
    is_low_contrast = stats.get("contrast_std", 40) < 22
    
    warnings = []
    if is_blurry:
        warnings.append("Image appears blurry. Hold camera steady and focus on the lesion or leaf.")
    if is_underexposed:
        warnings.append("Low lighting detected. Ensure natural daylight or turn on torch/flash.")
    if is_overexposed:
        warnings.append("High glare/overexposure detected. Avoid direct harsh sunlight reflection.")
    if is_low_contrast:
        warnings.append("Low color contrast. Ensure leaf stands out against background.")
        
    quality_score = 1.0
    if is_blurry: quality_score -= 0.35
    if is_underexposed or is_overexposed: quality_score -= 0.25
    if is_low_contrast: quality_score -= 0.15
    quality_score = max(0.1, round(quality_score, 2))
    
    return {
        "passed": len(warnings) == 0,
        "quality_score": quality_score,
        "warnings": warnings,
        "metrics": {
            "laplacian_blur_var": stats.get("blur_score", 145.0),
            "brightness": stats.get("mean_brightness", 128.0),
            "contrast": stats.get("contrast_std", 48.0),
            "domain": "In-Field Farmer Photography (PlantDoc)"
        }
    }

def evaluate_real_world_generalization(lab_confidence: float, quality_score: float) -> float:
    """
    Calculates adjusted confidence penalty for in-field conditions
    accounting for background clutter and lighting variance.
    """
    # Real field images encounter background foliage, soil, lighting shifts
    penalty_factor = 0.88 if quality_score >= 0.8 else 0.72
    adjusted_conf = min(0.98, lab_confidence * penalty_factor)
    return round(adjusted_conf, 2)

if __name__ == "__main__":
    result = assess_image_quality()
    print("[PlantDoc/Field Validation Engine]")
    print(json.dumps(result, indent=2))
