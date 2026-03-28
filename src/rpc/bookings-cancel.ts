import { createServerFn } from "@tanstack/react-start";
import { cancelBooking as apiCancelBooking } from "../api/bookings.api";

export const cancelBooking = createServerFn({ method: "POST" })
  .handler(async (ctx) => {
    const data = ctx.data as unknown as { code: string };
    return apiCancelBooking(data.code);
  });
