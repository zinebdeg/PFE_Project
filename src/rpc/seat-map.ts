import { createServerFn } from "@tanstack/react-start";
import { fetchSeatMap } from "../api/seat-map.api";

export const getSeatMap = createServerFn({ method: "GET" })
  .handler(async (ctx) => {
    const data = ctx.data as unknown as {
      journeyId: number;
      searchId: string;
    };
    
    console.log("[RPC] Fetching seat map for:", data);
    try {
      const result = await fetchSeatMap(data);
      console.log("[RPC] Seat map result received successfully.");
      return result;
    } catch (error) {
      console.error("[RPC] Seat map fetch error:", error);
      throw error;
    }
  });
