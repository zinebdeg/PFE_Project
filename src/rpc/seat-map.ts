import { createServerFn } from "@tanstack/react-start";
import { fetchSeatMap } from "../api/seat-map.api";

export const getSeatMap = createServerFn({ method: "GET" })
  .handler(async (ctx) => {
    const data = ctx.data as unknown as {
      journeyId: number;
      searchId: string;
    };

    console.log("[RPC] getSeatMap CALLED with:", data);
    try {
      const result = await fetchSeatMap(data);
      console.log('[RPC] API RAW RESULT:', JSON.stringify(result).slice(0, 200));

      // Handle potential { data: ... } wrapper from some API versions
      const actualData = (result as any)?.data || result;

      if (actualData && !Array.isArray(actualData)) {
        return [actualData];
      }

      return actualData;
    } catch (error: any) {
      console.error("[RPC] Seat map fetch error:", error.message || error);
      // STRATÉGIE DE GESTION D'ERREUR (RÉSILIENCE) :
      // Au lieu de propager l'erreur HTTP (ce qui ferait crasher l'interface utilisateur),
      // on renvoie `null`. Le frontend saura interpréter ce `null` pour afficher
      // gracieusement un message "Le plan des sièges n'est pas disponible pour ce trajet".
      return null;
    }
  });
