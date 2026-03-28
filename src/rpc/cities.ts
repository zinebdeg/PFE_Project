import { createServerFn } from "@tanstack/react-start";
import { fetchCities } from "../api/cities.api";

export const getCities = createServerFn({ method: "GET" })
  .inputValidator((data: { lang?: string }) => data)
  .handler(async (ctx) => {
    const data = ctx.data as unknown as { lang?: string };
    const lang = data?.lang || "fr";
    return fetchCities(lang);
  });
