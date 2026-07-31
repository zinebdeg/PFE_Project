import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useJourneySearch } from '../../hooks/use-journeys';
import { useCreateBooking, useMarkBookingPaid } from '../../hooks/use-booking';
import { getSeatMap } from '../../rpc/seat-map';
import { useState, useMemo } from 'react';
import { Phone, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import type { Journey } from '../../api/types';

// Subcomponents
import SeatSelectionCard from '../../components/booking/seat-selection-card';
import PassengerFormSection from '../../components/booking/passenger-form-section';
import PaymentSection from '../../components/booking/payment-section';
import BookingSidebar from '../../components/booking/booking-sidebar';
import SeatMapModal from '../../components/booking/seat-map-modal';

export const Route = createFileRoute('/booking/checkout/$journeyId')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      allerSearchId: (search.allerSearchId as string) || '',
      retourSearchId: (search.retourSearchId as string) || '',
      selectedSeat: (search.seat as string) || '',
      selectedReturnSeat: (search.returnSeat as string) || '',
      departureCityId: Number(search.departureCityId) || 0,
      arrivalCityId: Number(search.arrivalCityId) || 0,
      date: (search.date as string) || '',
      returnDate: (search.returnDate as string) || '',
      retourJourneyId: (search.retourJourneyId as string) || undefined,
      nbrOfPassengers: Number(search.nbrOfPassengers) || 1,
    };
  },
  component: BookingPage,
});

function BookingPage() {
  const { journeyId } = Route.useParams();
  const searchParams = Route.useSearch();
  const { allerSearchId, retourSearchId, selectedSeat, selectedReturnSeat } = searchParams;
  const navigate = useNavigate();

  const createBookingMutation = useCreateBooking();
  const markPaidMutation = useMarkBookingPaid();

  const [passengerData, setPassengerData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<'creating' | 'paying' | null>(null);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [toastError, setToastError] = useState<string | null>(null);

  const showErrorToast = (msg: string) => {
    setToastError(msg);
    setTimeout(() => setToastError(null), 4000);
  };

  // Fetch Aller Results
  const { data: searchResult, isLoading: isLoadingAller } = useJourneySearch({
    departureCityId: searchParams.departureCityId,
    arrivalCityId: searchParams.arrivalCityId,
    date: searchParams.date,
    nbrOfPassengers: searchParams.nbrOfPassengers,
    previousSearchId: allerSearchId,
  });

  // Fetch Retour Results
  const { data: retourSearchResult, isLoading: isLoadingRetour } = useJourneySearch({
    departureCityId: searchParams.arrivalCityId,
    arrivalCityId: searchParams.departureCityId,
    date: searchParams.returnDate,
    nbrOfPassengers: searchParams.nbrOfPassengers,
    previousSearchId: retourSearchId,
  }, { enabled: !!searchParams.retourJourneyId });

  const isLoading = isLoadingAller || (!!searchParams.retourJourneyId && isLoadingRetour);

  const allerJourney = useMemo(() =>
    searchResult?.journeys.find(j => j.id.toString() === journeyId),
    [searchResult, journeyId]
  );

  const retourJourney = useMemo(() =>
    retourSearchResult?.journeys.find(j => j.id.toString() === searchParams.retourJourneyId),
    [retourSearchResult, searchParams.retourJourneyId]
  );

  const hasSeatMap = !!(allerJourney?.showSeatMap || retourJourney?.showSeatMap);
  console.log("[DEBUG] showSeatMap:", allerJourney?.showSeatMap);

  const handleSeatConfirm = (seats: string[], target: 'aller' | 'retour' = 'aller') => {
    navigate({
      to: '/booking/checkout/$journeyId',
      params: { journeyId },
      search: { 
        ...searchParams, 
        [target === 'aller' ? 'seat' : 'returnSeat']: seats.join(',') 
      },
    });
    setIsSeatModalOpen(false);
  };

  const [activeSeatSelection, setActiveSeatSelection] = useState<'aller' | 'retour'>('aller');

  const handleProcessBooking = () => {
    if (!passengerData.name || !passengerData.email || !passengerData.phone) {
      showErrorToast('Veuillez remplir toutes les informations passager.');
      return;
    }

    const validateSeats = (journey: Journey | undefined, selected: string) => {
      if (journey?.showSeatMap && selected) {
        const count = selected.split(',').filter(Boolean).length;
        if (count !== searchParams.nbrOfPassengers) {
          return `Veuillez sélectionner exactement ${searchParams.nbrOfPassengers} siège(s) pour le trajet ${journey.from.cityName} → ${journey.to.cityName}.`;
        }
      }
      return null;
    };

    const seatError = validateSeats(allerJourney, selectedSeat) || (retourJourney ? validateSeats(retourJourney, selectedReturnSeat) : null);
    if (seatError) {
      showErrorToast(seatError);
      return;
    }

    const amount = ((allerJourney?.price.total ?? 0) + (retourJourney?.price.total || 0)) * searchParams.nbrOfPassengers + 5;

    navigate({
      to: '/booking/payment/$journeyId',
      params: { journeyId },
      search: {
        ...searchParams,
        amount: amount.toString(),
        passengerName: passengerData.name,
        passengerEmail: passengerData.email,
        passengerPhone: passengerData.phone,
      },
    });
  };

  if (isLoading && !allerJourney) {
    return (
      <div className="container-app py-20">
        <Skeleton className="w-full h-[600px] rounded-[32px]" />
      </div>
    );
  }

  if (!allerJourney) {
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

  const currentJourneyForModal = activeSeatSelection === 'aller' ? allerJourney : retourJourney;
  const currentSeatSelection = activeSeatSelection === 'aller' ? selectedSeat : selectedReturnSeat;

  return (
    <main className="min-h-screen pt-10 pb-20 bg-gray-light/10">
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-[100] flex items-center justify-center transition-all animate-in fade-in">
          <div className="bg-white p-10 rounded-[40px] shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full mx-4 rise-in">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="text-primary animate-pulse" size={32} />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black text-dark mb-2 tracking-tight">
                {processingStep === 'creating' ? 'Réservation en cours' : 'Traitement du paiement'}
              </h3>
              <p className="text-sm text-gray-body font-medium leading-relaxed">
                {processingStep === 'creating'
                  ? 'Nous préparons votre billet...'
                  : 'Sécurisation de la transaction avec votre banque...'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="container-app">
        {/* Page Grid - Modern 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* MAIN COLUMN (LEFT): Seat Card, Passenger Form, Payment Section */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Choisir mon siège section */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-border shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xl font-black text-dark tracking-tight">Choisir mon siège</h2>
              </div>

              <div className={cn(
                "grid gap-4",
                retourJourney ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
              )}>
                {/* Aller Seat selection */}
                <SeatSelectionCard
                  label={allerJourney.stops?.length ? "Trajet avec arrêts" : "Trajet Direct"}
                  selectedSeat={selectedSeat}
                  onClick={() => { setActiveSeatSelection('aller'); setIsSeatModalOpen(true); }}
                  fromCity={allerJourney.from.cityName}
                  toCity={allerJourney.to.cityName}
                />

                {/* Retour Seat selection */}
                {retourJourney && (
                  <SeatSelectionCard
                    label="Retour"
                    selectedSeat={selectedReturnSeat}
                    onClick={() => { setActiveSeatSelection('retour'); setIsSeatModalOpen(true); }}
                    fromCity={retourJourney.from.cityName}
                    toCity={retourJourney.to.cityName}
                  />
                )}
              </div>
            </div>

            <PassengerFormSection
              data={passengerData}
              onChange={(f, v) => setPassengerData(p => ({ ...p, [f]: v }))}
            />

            <PaymentSection
              onSelect={(m) => setPaymentMethod(m)}
            />
          </div>

          {/* SIDEBAR (RIGHT SIDE): Journey summary & Price box */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <BookingSidebar
              journey={allerJourney}
              retourJourney={retourJourney}
              searchId={allerSearchId}
              passengerCount={searchParams.nbrOfPassengers}
              serviceFee={5}
              onPay={handleProcessBooking}
              loading={isProcessing}
            />
          </div>
        </div>
      </div>

      {currentJourneyForModal && (
        <SeatMapModal
          isOpen={isSeatModalOpen}
          onClose={() => setIsSeatModalOpen(false)}
          onConfirm={(seats) => handleSeatConfirm(seats, activeSeatSelection)}
          journeyId={Number(activeSeatSelection === 'aller' ? journeyId : searchParams.retourJourneyId)}
          searchId={activeSeatSelection === 'aller' ? (searchResult?.searchId || allerSearchId) : (retourSearchResult?.searchId || retourSearchId)}
          nbrOfPassengers={searchParams.nbrOfPassengers}
          companyName={currentJourneyForModal.company.name}
          busName={currentJourneyForModal.bus.name}
          fromCity={currentJourneyForModal.from.cityName}
          toCity={currentJourneyForModal.to.cityName}
          initialSelectedSeats={currentSeatSelection ? currentSeatSelection.split(',') : []}
        />
      )}

      {/* Custom Markoub-style Toast Error for Checkout */}
      {toastError && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#fff1f2] border border-[#fecdd3] px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 max-w-sm">
            <AlertCircle size={22} className="text-[#e11d48] shrink-0 fill-red-100" />
            <p className="text-[#e11d48] font-semibold text-sm">
              {toastError}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
