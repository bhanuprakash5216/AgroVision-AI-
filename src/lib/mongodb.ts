/**
 * AgroVision AI MongoDB Connector & Abstraction Layer
 * Supports MongoDB Atlas / Local MongoDB connections via standard driver.
 * When MONGODB_URI is not provided, seamlessly delegates to our in-memory AgriStore.
 */

import { AgriStore } from "./data-store";
import { CompletePlantAnalysis } from "./types";

const MONGODB_URI = process.env.MONGODB_URI || "";

export async function saveAnalysisRecord(analysis: CompletePlantAnalysis): Promise<CompletePlantAnalysis> {
  if (MONGODB_URI) {
    try {
      // Dynamic import to prevent hard build crash if mongodb client is omitted
      const { MongoClient } = await import("mongodb");
      const client = new MongoClient(MONGODB_URI);
      await client.connect();
      const db = client.db("agrovision_db");
      
      // Store in respective collections as per requirement 19
      await db.collection("plantAnalyses").insertOne({
        ...analysis,
        _id: analysis.id as any
      });
      await db.collection("diseaseResults").insertOne({
        analysisId: analysis.id,
        ...analysis.diseaseResult
      });
      await db.collection("nutrientResults").insertOne({
        analysisId: analysis.id,
        ...analysis.nutrientIndication
      });
      await db.collection("wateringRecommendations").insertOne({
        analysisId: analysis.id,
        ...analysis.watering
      });
      await db.collection("weatherData").insertOne({
        analysisId: analysis.id,
        ...analysis.weather
      });

      await client.close();
      return analysis;
    } catch (err) {
      console.warn("[MongoDB Error] Fallback to in-memory store:", err);
    }
  }

  // Fallback to thread-safe AgriStore
  return AgriStore.getInstance().addAnalysis(analysis);
}

export async function fetchAnalysisHistory(): Promise<CompletePlantAnalysis[]> {
  if (MONGODB_URI) {
    try {
      const { MongoClient } = await import("mongodb");
      const client = new MongoClient(MONGODB_URI);
      await client.connect();
      const db = client.db("agrovision_db");
      const records = await db.collection("plantAnalyses").find().sort({ timestamp: -1 }).limit(20).toArray();
      await client.close();
      if (records && records.length > 0) {
        return records as any;
      }
    } catch (err) {
      console.warn("[MongoDB Error] Fallback to in-memory store history:", err);
    }
  }

  return AgriStore.getInstance().getAnalyses();
}
