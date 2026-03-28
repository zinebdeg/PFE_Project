import { createServerFn } from "@tanstack/react-start";
import { fetchBooking } from "../api/bookings.api";

export const getBooking = createServerFn({ method: "GET" })
  .handler(async (ctx) => {
    const data = ctx.data as unknown as { code: string };
    return fetchBooking(data.code);
  });
