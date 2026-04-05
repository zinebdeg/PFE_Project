import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useJourneySearch } from '../../hooks/use-journeys';
import { useCreateBooking } from '../../hooks/use-booking';
import { useState, useMemo } from 'react';
import { Info, Phone, Clock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';

// Subcomponents
import SeatSelectionCard from '../../components/booking/seat-selection-card';
import PassengerFormSection from '../../components/booking/passenger-form-section';
import PaymentSection from '../../components/booking/payment-section';
import BookingSidebar from '../../components/booking/booking-sidebar';

export const Route = createFileRoute('/booking/checkout/$journeyId')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      searchId: (search.searchId as string) || '',
      selectedSeat: (search.seat as string) || '',
      departureCityId: Number(search.departureCityId) || 0,
      arrivalCityId: Number(search.arrivalCityId) || 0,
      date: (search.date as string) || '',
      nbrOfPassengers: Number(search.nbrOfPassengers) || 1,
    };
  },
  component: BookingPage,
});

function BookingPage() {
  const { journeyId } = Route.useParams();
  const searchParams = Route.useSearch();
  const { searchId, selectedSeat } = searchParams;
  const navigate = useNavigate();
  const createBookingMutation = useCreateBooking();

  const [passengerData, setPassengerData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');

  // Using the search hook with the parameters passed from search results
  const { data: searchResult, isLoading } = useJourneySearch({
    departureCityId: searchParams.departureCityId,
    arrivalCityId: searchParams.arrivalCityId,
    date: searchParams.date,
    nbrOfPassengers: searchParams.nbrOfPassengers,
    previousSearchId: searchId,
  });

  const journey = useMemo(() => 
    searchResult?.journeys.find(j => j.id.toString() === journeyId),
    [searchResult, journeyId]
  );

  const handlePay = async () => {
    if (!journey || !passengerData.name || !passengerData.email || !passengerData.phone) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      const response = await createBookingMutation.mutateAsync({
        journeyId: journey.id.toString(),
        searchId: searchId,
        name: passengerData.name,
        email: passengerData.email,
        phone: passengerData.phone,
        seats: selectedSeat ? [Number(selectedSeat)] : [],
      });

      if (response && response.code) {
        navigate({
          to: '/booking/$bookingCode',
          params: { bookingCode: response.code },
        });
      }
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la réservation.');
    }
  };

  if (isLoading && !journey) {
    return (
      <div className="container-app py-20">
        <Skeleton className="w-full h-[600px] rounded-[32px]" />
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="container-app py-40 text-center">
        <div className="max-w-md mx-auto bg-white p-10 rounded-[32px] border border-gray-border shadow-sm">
          <h1 className="text-2xl font-black text-dark mb-4">Trajet introuvable</h1>
          <p className="text-gray-body mb-8">Nous n'avons pas pu charger les détails de ce voyage.</p>
          <Link to="/search" search={searchParams}>
            <Button className="w-full h-14 bg-primary text-white font-bold rounded-xl">Retour aux résultats</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-10 pb-20 bg-gray-light/10">
      <div className="container-app">
        
        {/* Page Grid - Matching specific 3-column-like text instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Détails du trajet & Help Box */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-gray-border shadow-sm rise-in">
              <h2 className="text-sm font-black text-dark uppercase tracking-widest mb-8 flex items-center gap-2">
                <Info size={16} className="text-blue" />
                Détails du trajet
              </h2>
              
              <div className="space-y-8 relative">
                <div className="absolute left-[7px] top-6 bottom-6 w-0.5 border-l-2 border-dashed border-gray-border/50" />
                
                <div className="flex gap-4 relative z-10 group">
                  <div className="w-4 h-4 rounded-full bg-white border-2 border-blue mt-1 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-dark">{journey.from.cityName}</span>
                    <span className="text-[11px] text-gray-body font-medium uppercase">{journey.from.time.slice(0, 5)}</span>
                  </div>
                </div>

                <div className="flex gap-4 relative z-10 group">
                  <div className="w-4 h-4 rounded-full bg-white border-2 border-blue mt-1 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-dark">{journey.to.cityName}</span>
                    <span className="text-[11px] text-gray-body font-medium uppercase">{journey.to.time.slice(0, 5)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-border/50">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-body uppercase tracking-wider">
                  <Clock size={16} className="text-blue" />
                  Durée: {journey.duration}
                </div>
              </div>
            </div>

            <div className="bg-[#f0f7ff] p-8 rounded-[32px] border border-blue/10 flex flex-col gap-4 rise-in delay-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[16px] bg-blue text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue/20">
                  <Phone size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-blue uppercase tracking-widest leading-none mb-1">Besoin d'aide ?</span>
                  <span className="text-xl font-black text-dark tracking-tight">05 3000 3000</span>
                </div>
              </div>
              <p className="text-[11px] text-gray-body font-medium leading-relaxed">
                Notre équipe est disponible 24/7 pour vous accompagner dans votre réservation.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Seat Card, Passenger Form, Payment Section */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <SeatSelectionCard 
              selectedSeat={selectedSeat} 
              onClick={() => navigate({ 
                to: '/journey/$journeyId', 
                params: { journeyId }, 
                search: searchParams 
              })} 
            />

            <PassengerFormSection 
              data={passengerData} 
              onChange={(f, v) => setPassengerData(p => ({ ...p, [f]: v }))} 
            />

            <PaymentSection 
              onSelect={(m) => setPaymentMethod(m)} 
            />
          </div>

          {/* SIDEBAR (RIGHT SIDE): Journey summary & Price box */}
          <div className="lg:col-span-3 sticky top-24">
            <BookingSidebar 
              journey={journey}
              passengerCount={searchParams.nbrOfPassengers}
              serviceFee={5.00}
              onPay={handlePay}
              loading={createBookingMutation.isPending}
            />
          </div>

        </div>
      </div>
    </main>
  );
}

