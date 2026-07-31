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
  if (code.startsWith('MOCK-')) {
    let mockData = {
      name: 'Ahmed Alami',
      email: 'ahmed@gmail.com',
      phone: '+212612345678',
      seats: '12',
      from: 'Rabat',
      to: 'Casablanca',
      price: 160.0
    };

    try {
      const b64Data = code.replace('MOCK-', '');
      // Decode base64 to restore the encoded booking details
      const decodedStr = atob(b64Data);
      mockData = JSON.parse(decodedStr);
    } catch (e) {
      console.warn('Failed to parse mock base64 data, using default mock details instead.', e);
    }

    const numericSeats = mockData.seats.split(',').map(Number);

    return {
      id: 999999,
      externalId: 'EXT-' + code,
      paymentToken: 'TOKEN-' + code,
      paymentTokenExpiresAtMinutes: 60,
      code: code,
      type: 'one_way',
      inventory: 'partner',
      paidPrice: mockData.price,
      status: 'paid',
      totalPrice: mockData.price,
      paymentType: 'card',
      email: mockData.email,
      name: mockData.name,
      phone: mockData.phone,
      isCancelled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      routes: [
        {
          id: 1,
          routeId: 101,
          departureTime: '15:30:00',
          departureCityId: 82,
          departureStationId: 1,
          departureCityName: mockData.from,
          departureStationName: 'Gare Routière Kamra',
          arrivalTime: '17:00:00',
          arrivalCityId: 28,
          arrivalStationId: 2,
          arrivalCityName: mockData.to,
          arrivalStationName: 'Gare Routière Ouled Ziane',
          price: mockData.price,
          date: new Date().toISOString().split('T')[0],
          daysElapsed: 0,
          seats: numericSeats.length,
          type: 'aller',
          isCancelled: false,
          seatMapShown: true,
          companyName: 'PULLMAN DU SUD',
          busName: 'Premium Class',
          departureLat: 34.020882,
          departureLng: -6.84165,
          arrivalLat: 33.57311,
          arrivalLng: -7.589843
        }
      ],
      tickets: numericSeats.map((seatNum, idx) => ({
        id: idx + 1,
        code: `TKT-${code}-${seatNum}`,
        bookingId: 999999,
        routeId: 101,
        companyId: 1,
        date: new Date().toISOString().split('T')[0],
        time: '15:30:00',
        seat: seatNum,
        price: mockData.price / numericSeats.length,
        status: 'valid'
      }))
    };
  }
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
