import { createServerFn } from "@tanstack/react-start";
import { fetchJourneys } from "../api/journeys.api";

export const searchJourneys = createServerFn({ method: "GET" })
  .handler(async (ctx) => {
    const data = ctx.data as unknown as {
      departureCityId: number;
      arrivalCityId: number;
      date: string;
      nbrOfPassengers: number;
      previousSearchId?: string;
    };
    return fetchJourneys(data);
  });
