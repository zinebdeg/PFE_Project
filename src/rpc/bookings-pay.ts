import { createServerFn } from "@tanstack/react-start";
import { markBookingPaid as apiMarkBookingPaid } from "../api/bookings.api";

export const markBookingPaid = createServerFn({ method: "POST" })
  .handler(async (ctx) => {
    const data = ctx.data as unknown as { 
      code: string; 
      paidPrice: string; 
      referenceNumber: string; 
      additionalInfo?: string 
    };
    const { code, ...payload } = data;
    return apiMarkBookingPaid(code, payload);
  });
