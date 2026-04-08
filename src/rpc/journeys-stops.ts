import { createServerFn } from "@tanstack/react-start";
import { fetchJourneyStops } from "../api/journeys.api";
import { z } from "zod";

export const getJourneyStops = createServerFn({ method: "GET" })
  .handler(async (ctx) => {
    const data = ctx.data as unknown as {
      journeyId: number;
      searchId: string;
    };
    
    // Add safety check
    if (!data?.journeyId || !data?.searchId) {
      console.error("[RPC] Missing required parameters:", data);
      return [];
    }

    try {
      return await fetchJourneyStops(data);
    } catch (error) {
      console.error("[RPC] Error fetching stops:", error);
      throw error;
    }
  });
