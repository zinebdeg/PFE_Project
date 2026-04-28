import { apiRequest } from './client';
import type { Booking, CreateBookingParams } from './types';

export async function createBooking(data: CreateBookingParams): Promise<Booking> {
  return apiRequest<Booking>('/bookings', {
    method: 'POST',
    body: data,
  });
}

export async function markBookingPaid(
  code: string,
  data: { additionalInfo?: string; referenceNumber: string; paidPrice: string },
): Promise<{ success: boolean; code: string }> {
  return apiRequest<{ success: boolean; code: string }>(`/bookings/${code}/paid`, {
    method: 'POST',
    body: data,
  });
}

export async function cancelBooking(code: string): Promise<void> {
  await apiRequest<void>(`/bookings/${code}`, { 
    method: 'DELETE',
    body: {}, // Markoub API might require an empty body for DELETE
  });
}

export async function fetchBooking(code: string): Promise<Booking> {
  return apiRequest<Booking>(`/bookings/${code}`);
}

export async function fetchBookingPdf(code: string): Promise<Blob> {
  const BASE_URL = process.env.MARKOUB_API_URL || 'https://b2b-api.markoub.dev';
  const API_TOKEN = process.env.MARKOUB_API_TOKEN || '';
  const res = await fetch(`${BASE_URL}/bookings/${code}/pdf`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });
  if (!res.ok) throw new Error('Failed to fetch PDF');
  return res.blob();
}
