import { useQuery } from '@tanstack/react-query';
import { getCities } from '../rpc/cities';

export function useCities(lang = 'fr') {
  return useQuery({
    queryKey: ['cities', lang],
    queryFn: () => getCities({ data: { lang } }),
    staleTime: 24 * 60 * 60 * 1000,
  });
}
