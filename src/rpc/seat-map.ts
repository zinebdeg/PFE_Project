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
      console.log('donnee recu du serveur', result);
      console.log("[RPC] Seat map result: array=", Array.isArray(result), "length=", Array.isArray(result) ? result.length : 'N/A');

      // Normalize: the API should return SeatMapResponse[] per the docs
      // If the API returns a single object instead of an array, wrap it
      if (result && !Array.isArray(result)) {
        return [result];
      }

      return result;
    } catch (error: any) {
      console.error("[RPC] Seat map fetch error:", error.message || error);
      // Return null so the UI can show a proper error state
      return null;
    }
  });
