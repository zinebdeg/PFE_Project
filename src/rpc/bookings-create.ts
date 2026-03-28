import { createServerFn } from "@tanstack/react-start";
import { createBooking as apiCreateBooking } from "../api/bookings.api";

export const createBooking = createServerFn({ method: "POST" })
  .handler(async (ctx) => {
    const data = ctx.data as unknown as {
      journeyId: string;
      searchId: string;
      name: string;
      phone: string;
      email: string;
      seats: number[];
    };
    return apiCreateBooking(data);
  });
