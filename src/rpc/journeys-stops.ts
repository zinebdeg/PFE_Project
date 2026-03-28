import { createServerFn } from "@tanstack/react-start";
import { fetchJourneyStops } from "../api/journeys.api";

export const getJourneyStops = createServerFn({ method: "GET" })
  .handler(async (ctx) => {
    const data = ctx.data as unknown as {
      journeyId: number;
      searchId: string;
    };
    return fetchJourneyStops(data);
  });
