import { createServerFn } from "@tanstack/react-start";
import { cancelBooking as apiCancelBooking } from "../api/bookings.api";

export const cancelBooking = createServerFn({ method: "POST" })
  .handler(async (ctx) => {
    const data = ctx.data as unknown as { code: string };
    try {
      await apiCancelBooking(data.code);
      return { success: true };
    } catch (error: any) {
      console.error("[RPC] Erreur lors de l'annulation:", error);
      // We throw a standard JS Error so that TanStack Start serializes it cleanly 
      // instead of crashing with 'unhandled: true' when it's a custom ApiError.
      throw new Error(error.message || "Erreur interne lors de l'annulation");
    }
  });
