import { useQuery } from '@tanstack/react-query';
import { searchJourneys } from '../rpc/journeys-search';
import { getJourneyStops } from '../rpc/journeys-stops';
import { getSeatMap } from '../rpc/seat-map';

export function useJourneySearch(params: {
  departureCityId: number;
  arrivalCityId: number;
  date: string;
  nbrOfPassengers: number;
  previousSearchId?: string;
}, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['journeys', params],
    queryFn: () => searchJourneys({ data: params }),
    enabled: !!params.departureCityId && !!params.arrivalCityId && !!params.date && (options?.enabled !== false),
  });
}

export function useJourneyStops(journeyId: number | null, searchId: string | null) {
  return useQuery({
    queryKey: ['journey-stops', journeyId, searchId],
    queryFn: () => getJourneyStops({ data: { journeyId: journeyId!, searchId: searchId! } }),
    enabled: !!journeyId && !!searchId,
  });
}

export function useSeatMap(journeyId: number | null, searchId: string | null) {
  return useQuery({
    queryKey: ['seat-map', journeyId, searchId],
    queryFn: () => getSeatMap({ data: { journeyId: journeyId!, searchId: searchId! } }),
    enabled: !!journeyId && !!searchId,
  });
}
