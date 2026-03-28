import { useQuery } from '@tanstack/react-query';
import { searchJourneys } from '../rpc/journeys-search';
import { getJourneyStops } from '../rpc/journeys-stops';

export function useJourneySearch(params: {
  departureCityId: number;
  arrivalCityId: number;
  date: string;
  nbrOfPassengers: number;
  previousSearchId?: string;
}) {
  return useQuery({
    queryKey: ['journeys', params],
    queryFn: () => searchJourneys({ data: params }),
    enabled: !!params.departureCityId && !!params.arrivalCityId && !!params.date,
  });
}

export function useJourneyStops(journeyId: number | null, searchId: string | null) {
  return useQuery({
    queryKey: ['journey-stops', journeyId, searchId],
    queryFn: () => getJourneyStops({ data: { journeyId: journeyId!, searchId: searchId! } }),
    enabled: !!journeyId && !!searchId,
  });
}
