import { useQuery } from '@tanstack/react-query';
import { getSeatMap } from '../rpc/seat-map';

export function useSeatMap(journeyId: number | null, searchId: string | null) {
  return useQuery({
    queryKey: ['seat-map', journeyId, searchId],
    queryFn: () => getSeatMap({ data: { journeyId: journeyId!, searchId: searchId! } }),
    enabled: !!journeyId && !!searchId,
  });
}
