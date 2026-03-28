import { createServerFn } from "@tanstack/react-start";
import { fetchSeatMap } from "../api/seat-map.api";

export const getSeatMap = createServerFn({ method: "GET" })
  .inputValidator((data: {
    journeyId: number;
    searchId: string;
  }) => data)
  .handler(async (ctx) => {
    const data = ctx.data as unknown as {
      journeyId: number;
      searchId: string;
    };
    return fetchSeatMap(data);
  });
