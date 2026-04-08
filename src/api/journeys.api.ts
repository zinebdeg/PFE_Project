import { apiRequest } from './client';
import type { JourneySearchResult } from './types';

export interface JourneyStop {
  name: string;
  address: string;
  time: string;
  type: string;
  latitude: number;
  longitude: number;
  daysElapsed: number;
}

export async function fetchJourneys(params: {
  departureCityId: number;
  arrivalCityId: number;
  date: string;
  nbrOfPassengers: number;
  previousSearchId?: string;
}): Promise<JourneySearchResult> {
  return apiRequest<JourneySearchResult>('/journeys', {
    params: {
      departureCityId: params.departureCityId,
      arrivalCityId: params.arrivalCityId,
      date: params.date,
      nbrOfPassengers: params.nbrOfPassengers,
      searchId: params.previousSearchId,
    },
  });
}

export async function fetchJourneyStops(params: {
  journeyId: number;
  searchId: string;
}): Promise<JourneyStop[]> {
  return apiRequest<JourneyStop[]>('/journeys/stops', {
    params: {
      journeyId: params.journeyId,
      searchId: params.searchId,
    },
  });
}
