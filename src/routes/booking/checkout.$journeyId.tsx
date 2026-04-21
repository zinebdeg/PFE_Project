import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useJourneySearch } from '../../hooks/use-journeys';
import { useCreateBooking, useMarkBookingPaid } from '../../hooks/use-booking';
import { getSeatMap } from '../../rpc/seat-map';
import { useState, useMemo } from 'react';
import { Phone, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';

// Subcomponents
import SeatSelectionCard from '../../components/booking/seat-selection-card';
import PassengerFormSection from '../../components/booking/passenger-form-section';
import PaymentSection from '../../components/booking/payment-section';
import BookingSidebar from '../../components/booking/booking-sidebar';
import SeatMapModal from '../../components/booking/seat-map-modal';

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

  // REQUÊTE EN ARRIÈRE-PLAN (BACKGROUND REFETCH) :
  // On utilise useJourneySearch ici pour s'assurer que la session de recherche (searchId) 
  // ne va pas expirer si l'utilisateur met du temps à remplir le formulaire.
  // L'API Markoub renouvelle le searchId silencieusement.
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

  const hasSeatMap = journey?.showSeatMap === true;
  console.log("[DEBUG] showSeatMap:", journey?.showSeatMap);

  const handleSeatConfirm = (seats: string[]) => {
    navigate({
      to: '/booking/checkout/$journeyId',
      params: { journeyId },
      search: { ...searchParams, seat: seats.join(',') },
    });
    setIsSeatModalOpen(false);
  };

  const handleProcessBooking = async () => {
    if (!passengerData.name || !passengerData.email || !passengerData.phone) {
      showErrorToast('Veuillez remplir toutes les informations passager.');
      return;
    }

    // Validation optionnelle des sièges :
    // Si l'utilisateur n'a pas sélectionné de sièges, l'API Markoub assignera des sièges par défaut.
    // S'il en a sélectionné, on vérifie qu'il a bien sélectionné le bon nombre.
    if (hasSeatMap && selectedSeat) {
      const selectedSeatsCount = selectedSeat.split(',').filter(Boolean).length;
      if (selectedSeatsCount !== searchParams.nbrOfPassengers) {
        showErrorToast(`Veuillez sélectionner exactement ${searchParams.nbrOfPassengers} siège(s). (Actuellement: ${selectedSeatsCount})`);
        return;
      }
    }

    setIsProcessing(true);
    setProcessingStep('creating');

    try {
      let autoAssignedSeats: number[] = [];

      // Si le trajet nécessite des sièges mais que l'utilisateur n'en a pas sélectionné
      if (hasSeatMap && !selectedSeat) {
        const freshSearchId = searchResult?.searchId || searchId;
        const seatMapResponse = await getSeatMap({ data: { journeyId: Number(journeyId), searchId: freshSearchId } });
        
        // Logique du scanner récursif pour extraire le plan
        const findSeatSource = (obj: any): any => {
          if (!obj || typeof obj !== 'object') return null;
          if (Array.isArray(obj.seatMap)) return obj;
          if (Array.isArray(obj)) {
            for (const item of obj) {
              const found = findSeatSource(item);
              if (found) return found;
            }
          }
          if (obj.data) return findSeatSource(obj.data);
          if (obj.result) return findSeatSource(obj.result);
          return null;
        };

        const source = findSeatSource(seatMapResponse);
        if (source && source.seatMap) {
          const availableSeats: number[] = [];
          source.seatMap.forEach((row: any[]) => {
            row.forEach((seat: any) => {
              if (seat && seat.type === 'available' && seat.seatNumber) {
                availableSeats.push(seat.seatNumber);
              }
            });
          });

          if (availableSeats.length >= searchParams.nbrOfPassengers) {
            autoAssignedSeats = availableSeats.slice(0, searchParams.nbrOfPassengers);
          } else {
            showErrorToast("Désolé, il n'y a pas assez de sièges disponibles pour votre groupe.");
            setIsProcessing(false);
            setProcessingStep(null);
            return;
          }
        } else {
           showErrorToast("Impossible de récupérer le plan des sièges pour l'assignation automatique.");
           setIsProcessing(false);
           setProcessingStep(null);
           return;
        }
      }

      const finalSeats = selectedSeat 
        ? selectedSeat.split(',').map(Number) 
        : autoAssignedSeats;

      // ÉTAPE 1 : CRÉATION DE LA RÉSERVATION (TRANSACTIONNEL)
      // Appel RPC sécurisé (qui contacte l'API Markoub via le serveur)
      // On utilise 'searchResult?.searchId' pour garantir l'utilisation d'une session fraîche.
      const booking = await createBookingMutation.mutateAsync({
        journeyId: journeyId,
        searchId: searchResult?.searchId || searchId,
        name: passengerData.name,
        email: passengerData.email,
        phone: passengerData.phone,
        ...(finalSeats.length > 0 ? { seats: finalSeats } : {}),
      });

      if (booking && booking.code) {
        setProcessingStep('paying');

        // ÉTAPE 2 : PAIEMENT (EXÉCUTÉ SÉQUENTIELLEMENT UNIQUEMENT SI L'ÉTAPE 1 A RÉUSSI)
        // Utilise le token de paiement unique généré lors de la création de la réservation
        await markPaidMutation.mutateAsync({
          code: booking.code,
          paidPrice: booking.totalPrice.toString(),
          referenceNumber: 'REF-' + Math.random().toString(36).substring(7).toUpperCase(),
          additionalInfo: `Paiement ${paymentMethod === 'card' ? 'par Carte' : 'en Espèces'} - Token: ${booking.paymentToken}`,
        });

        // Step 3: Redirect to Confirmation
        navigate({
          to: '/booking/$bookingCode',
          params: { bookingCode: booking.code },
        });
      }
    } catch (e) {
      showErrorToast('Une erreur est survenue lors de la réservation. Veuillez réessayer.');
      console.error(e);
    } finally {
      setIsProcessing(false);
      setProcessingStep(null);
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
            {hasSeatMap ? (
              <SeatSelectionCard
                selectedSeat={selectedSeat}
                onClick={() => setIsSeatModalOpen(true)}
                fromCity={journey.from.cityName}
                toCity={journey.to.cityName}
              />
            ) : (
              <div className="p-6 rounded-[24px] border border-blue/20 bg-blue/5 flex items-center justify-between mb-6 shadow-sm">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-black text-dark tracking-tight">Sélection de siège</h3>
                  <p className="text-xs font-bold text-gray-body">Le choix de siège n'est pas disponible pour ce trajet.</p>
                </div>
                <Button
                  variant="outline"
                  className="rounded-xl border-[#FF6900] text-[#FF6900] font-bold h-11 px-6 hover:bg-[#FF6900] hover:text-white transition-all"
                  onClick={() => {
                    document.getElementById('passenger-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Poursuivre la réservation
                </Button>
              </div>
            )}

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
              journey={journey}
              searchId={searchId}
              passengerCount={searchParams.nbrOfPassengers}
              serviceFee={5}
              onPay={handleProcessBooking}
              loading={isProcessing}
            />
          </div>
        </div>
      </div>

      {hasSeatMap && (
        <SeatMapModal
          isOpen={isSeatModalOpen}
          onClose={() => setIsSeatModalOpen(false)}
          onConfirm={handleSeatConfirm}
          journeyId={Number(journeyId)}
          searchId={searchResult?.searchId || searchId}
          nbrOfPassengers={searchParams.nbrOfPassengers}
          companyName={journey.company.name}
          busName={journey.bus.name}
          fromCity={journey.from.cityName}
          toCity={journey.to.cityName}
          initialSelectedSeats={selectedSeat ? selectedSeat.split(',') : []}
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
