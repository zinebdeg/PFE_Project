import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useSeatMap } from '../../hooks/use-seat-map';
import { useJourneyStops } from '../../hooks/use-journeys';
import SeatMap from '../../components/seat-map/seat-map';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { Info, AlertCircle, Phone, ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import type { JourneyStop, SeatMapResponse } from '../../api/types';

export const Route = createFileRoute('/journey/$journeyId')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      searchId: (search.searchId as string) || '',
    };
  },
  component: JourneyDetail,
});

function JourneyDetail() {
  const { journeyId } = Route.useParams();
  const { searchId } = Route.useSearch();
  const navigate = useNavigate();
  
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  
  // Real apps would fetch the search context to get number of passengers
  // For now we assume we need the seats for the booking
  
  const { data: seatMapData, isLoading: isLoadingSeatMap } = useSeatMap(Number(journeyId), searchId);
  const { data: journeyStops, isLoading: isLoadingStops } = useJourneyStops(Number(journeyId), searchId);
  
  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    
    navigate({
      to: '/booking/new',
      search: {
        journeyId,
        searchId,
        seats: selectedSeats.join(','),
      },
    });
  };

  return (
    <main className="min-h-screen pt-10 pb-20 bg-gray-light/10">
      <div className="container-app">
        {/* Back button */}
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm font-bold text-gray-body hover:text-dark mb-10 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Retour aux résultats
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Journey Info & Stops */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-border shadow-sm rise-in">
              <h2 className="text-xl font-black text-dark mb-6 flex items-center gap-2">
                <Info size={20} className="text-primary" />
                Détails du trajet
              </h2>
              
              {isLoadingStops ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="w-full h-12" />)}
                </div>
              ) : (
                <div className="space-y-8 relative">
                  {/* Timeline line */}
                  <div className="absolute left-[11px] top-6 bottom-6 w-0.5 border-l-2 border-dashed border-gray-border" />
                  
                  {journeyStops?.map((stop: JourneyStop, i: number) => (
                    <div key={i} className="flex gap-4 relative z-10 transition-colors group">
                      <div className="w-6 h-6 rounded-full bg-white border-4 border-primary mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-dark">{stop.time.slice(0, 5)}</span>
                        <span className="text-sm font-bold text-gray-body">{stop.name}</span>
                        <span className="text-[10px] text-gray-body mt-1">{stop.address}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border-2 border-primary/10 flex flex-col gap-4 rise-in delay-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg">
                  <Phone size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-primary uppercase">Besoin d'aide ?</span>
                  <span className="text font-black text-dark">05 3000 3000</span>
                </div>
              </div>
              <p className="text-xs text-gray-body leading-relaxed">
                Notre équipe est disponible 24/7 pour vous accompagner dans votre réservation.
              </p>
            </div>
          </div>

          {/* Right: Seat Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-3xl border border-gray-border shadow-sm mb-8 rise-in delay-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-dark flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-dark text-white flex items-center justify-center">2</div>
                  Choisir vos sièges
                </h2>
                <div className="px-4 py-2 bg-gray-light rounded-full text-xs font-bold text-gray-body uppercase tracking-widest border border-gray-border">
                  Bus Pullman du Sud
                </div>
              </div>

              {isLoadingSeatMap ? (
                <div className="space-y-4 py-20 px-10">
                  <Skeleton className="w-full h-80 rounded-3xl" />
                </div>
              ) : seatMapData ? (
                <SeatMap 
                  // SeatMap API returns an array, but usually we take the first floor
                  data={Array.isArray(seatMapData) ? (seatMapData[0] as unknown as SeatMapResponse) : (seatMapData as unknown as SeatMapResponse)} 
                  onSelectionChange={setSelectedSeats}
                  maxSeats={1} // Assuming 1 for now or from search
                />
              ) : (
                <div className="text-center py-20 bg-gray-light/30 rounded-3xl border border-gray-border border-dashed">
                  <AlertCircle size={48} className="text-gray-body/30 mx-auto mb-4" />
                  <p className="text-gray-body font-bold">Plan du bus non disponible.</p>
                  <p className="text-xs text-gray-body mt-1">Vous pourrez choisir vos sièges lors de l'embarquement.</p>
                </div>
              )}

              <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-border">
                <div className="flex flex-col text-center md:text-left">
                  <span className="text-xs font-bold text-gray-body uppercase tracking-wider">Sièges sélectionnés</span>
                  <div className="text-xl font-black text-dark">
                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Aucun'}
                  </div>
                </div>

                <Button 
                  onClick={handleContinue}
                  className="w-full md:w-auto px-10 h-14 bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-30"
                  disabled={selectedSeats.length === 0}
                >
                  Continuer
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
