import { apiRequest } from './client';
import type { City } from './types';

export async function fetchCities(lang: string = 'fr'): Promise<City[]> {
  return apiRequest<City[]>('/cities', { params: { lang } });
}
