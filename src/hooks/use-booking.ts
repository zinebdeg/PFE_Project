import { useMutation, useQuery } from '@tanstack/react-query';
import { createBooking } from '../rpc/bookings-create';
import { markBookingPaid } from '../rpc/bookings-pay';
import { cancelBooking } from '../rpc/bookings-cancel';
import { getBooking } from '../rpc/bookings-get';
import type { CreateBookingParams } from '../api/types';

export function useCreateBooking() {
  return useMutation({
    mutationFn: (data: CreateBookingParams) => createBooking({ data }),
  });
}

export function useMarkBookingPaid() {
  return useMutation({
    mutationFn: (data: { 
      code: string; 
      paidPrice: string; 
      referenceNumber: string; 
      additionalInfo?: string 
    }) => markBookingPaid({ data }),
  });
}

export function useCancelBooking() {
  return useMutation({
    mutationFn: (code: string) => cancelBooking({ data: { code } }),
  });
}

export function useBooking(code: string | null) {
  return useQuery({
    queryKey: ['booking', code],
    queryFn: () => getBooking({ data: { code: code! } }),
    enabled: !!code,
  });
}
