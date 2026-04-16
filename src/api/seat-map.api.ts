import { apiRequest } from './client';
import type { SeatMapResponse } from './types';

export async function fetchSeatMap(params: {
  journeyId: number;
  searchId: string;
}): Promise<SeatMapResponse[]> {
  return apiRequest<SeatMapResponse[]>('/journeys/seat-map', {
    params: {
      journeyId: params.journeyId,
      searchId: params.searchId,
    },
  });
}
