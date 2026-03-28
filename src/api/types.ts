export interface City {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
}

export interface Bus {
  id: number;
  name: string;
  slug: string;
  image: string;
}

export interface Company {
  id: number;
  name: string;
  logo: string;
}

export interface Station {
  id: number;
  time: string;
  cityId: number;
  cityName: string;
  stationId: number;
  stationName: string;
  stationAddress: string;
  date: string;
  latitude: string;
  longitude: string;
  daysElapsed: number;
  order: number;
}

export interface Price {
  single: number;
  total: number;
  serviceFees: number;
}

export interface Promotion {
  id: number;
  name: string;
  amount: number;
  amountType: 'percentage' | 'fixed';
  markoubAmount: number;
  companyAmount: number;
  firstTime: boolean;
  reason: string;
  sponsoredBy: string;
}

export interface Journey {
  inventory: string;
  id: number;
  name: string;
  bus: Bus;
  company: Company;
  isInRoute: boolean;
  roadType: string;
  chargesForService: boolean;
  departureDate: string;
  arrivalDate: string;
  from: Station;
  to: Station;
  price: Price;
  promotion: Promotion | null;
  stops: any[];
  stations: any[];
  equipments: any[];
  isCancellable: boolean;
  isChangeable: boolean;
  isRefundable: boolean;
  duration: string;
  timeLeft: string;
  closureTime: string;
  seatsLeft: number;
  isAfterMidnight: boolean;
  tags: string[];
  extra: any;
  isMKhyer: boolean;
  isReklam: boolean;
  isPartOfStudentProgram: boolean;
  showSeatMap: boolean;
  busDepartureDate: string;
}

export interface JourneyStop {
  id: number;
  name: string;
  address: string;
  time: string;
  order: number;
}

export interface JourneyEquipment {
  id: number;
  name: string;
  icon: string;
}

export interface JourneySearchResult {
  searchId: string;
  expiresAt: string;
  expiresInMinutes: number;
  journeys: Journey[];
}

export interface Seat {
  type: 'selected' | 'available' | 'reserved' | 'empty' | 'closed';
  index: string;
  seatNumber: number;
}

export interface SeatMapResponse {
  selectedSeats: {
    seatNumber: number;
    index: string;
    ticketNumber?: string;
    tripBusProfileId?: number;
  }[];
  seatMap: Seat[][];
}

export interface BookingRoute {
  id: number;
  routeId: number;
  departureTime: string;
  departureCityId: number;
  departureStationId: number;
  departureCityName: string;
  departureStationName: string;
  arrivalTime: string;
  arrivalCityId: number;
  arrivalStationId: number;
  arrivalCityName: string;
  arrivalStationName: string;
  price: number;
  date: string;
  daysElapsed: number;
  seats: number;
  type: string;
  isCancelled: boolean;
  seatMapShown: boolean;
  departureLat: number;
  departureLng: number;
  arrivalLat: number;
  arrivalLng: number;
}

export interface Ticket {
  id: number;
  code: string;
  bookingId: number;
  routeId: number;
  companyId: number;
  date: string;
  time: string;
  seat: number;
  price: number;
  status: string;
}

export interface Booking {
  id: number;
  externalId: string;
  paymentToken: string;
  paymentTokenExpiresAtMinutes: number;
  code: string;
  type: string;
  inventory: string;
  paidPrice: number;
  status: string;
  totalPrice: number;
  paymentType: string;
  email: string;
  name: string;
  phone: string;
  isCancelled: boolean;
  createdAt: string;
  updatedAt: string;
  routes: BookingRoute[];
  tickets: Ticket[];
}

export interface CreateBookingParams {
  journeyId: string;
  searchId: string;
  name: string;
  phone: string;
  email: string;
  seats: number[];
}

export interface SearchParams {
  departureCityId: number;
  arrivalCityId: number;
  date: string;
  nbrOfPassengers: number;
  previousSearchId?: string;
}
