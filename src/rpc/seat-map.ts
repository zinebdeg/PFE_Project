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
      // Appel réseau effectué depuis le serveur Node.js vers l'API Markoub.
      // Le navigateur client ne voit jamais cet appel ni le token secret.
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
      // STRATÉGIE DE GESTION D'ERREUR (RÉSILIENCE) :
      // Au lieu de propager l'erreur HTTP (ce qui ferait crasher l'interface utilisateur),
      // on renvoie `null`. Le frontend saura interpréter ce `null` pour afficher
      // gracieusement un message "Le plan des sièges n'est pas disponible pour ce trajet".
      return null;
    }
  });
