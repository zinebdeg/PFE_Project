import { createFileRoute, Link } from '@tanstack/react-router';
import { useJourneySearch } from '../hooks/use-journeys';
import { useCities } from '../hooks/use-cities';
import JourneyCard from '../components/journey/journey-card';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import { Search, AlertCircle } from 'lucide-react';
import type { Journey, City } from '../api/types';
import SearchForm from '../components/search/search-form';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const Route = createFileRoute('/search')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      departureCityId: Number(search.departureCityId) || 0,
      arrivalCityId: Number(search.arrivalCityId) || 0,
      date: (search.date as string) || '',
      returnDate: (search.returnDate as string) || '',
      nbrOfPassengers: Number(search.nbrOfPassengers) || 1,
      allerJourneyId: (search.allerJourneyId as string) || undefined,
      allerSearchId: (search.allerSearchId as string) || undefined,
    };
  },
  component: SearchResults,
});

function SearchResults() {
  const searchParams = Route.useSearch();
  const { departureCityId, arrivalCityId, date, returnDate, nbrOfPassengers, allerJourneyId, allerSearchId } = searchParams;
  const { data: cities = [] } = useCities() as { data: City[] };

  const isReturnFlow = !!returnDate;
  const isSelectingRetour = isReturnFlow && !!allerJourneyId;

  // Si on choisit le retour, on inverse les villes et on utilise la date de retour
  const currentDepartureId = isSelectingRetour ? arrivalCityId : departureCityId;
  const currentArrivalId = isSelectingRetour ? departureCityId : arrivalCityId;
  const currentDate = isSelectingRetour ? returnDate : date;
  
  const { 
    data: results, 
    isLoading, 
    error,
    refetch 
  } = useJourneySearch({
    departureCityId: currentDepartureId,
    arrivalCityId: currentArrivalId,
    date: currentDate,
    nbrOfPassengers,
  });

  // Pour afficher le résumé de l'aller
  const { data: allerResults } = useJourneySearch({
    departureCityId,
    arrivalCityId,
    date,
    nbrOfPassengers,
  }, { enabled: isSelectingRetour });

  const selectedAllerJourney = isSelectingRetour 
    ? allerResults?.journeys?.find((j: Journey) => j.id.toString() === allerJourneyId)
    : null;

  return (
    <main className="min-h-screen pt-10 pb-20 bg-[#f4f7fc]">
      <div className="container-app">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <div className="md:col-span-4 lg:col-span-3 sticky top-24 z-20">
            <SearchForm 
              initialFromId={departureCityId}
              initialToId={arrivalCityId}
              initialDate={date}
              initialReturnDate={returnDate}
              initialPassengers={nbrOfPassengers}
            />
          </div>

          {/* Results list */}
          <div className="md:col-span-8 lg:col-span-9">
            
            {/* Stepper */}
            <div className="mb-10 flex items-center justify-center">
              <div className="flex items-center gap-4 text-[13px] font-bold">
                <div className="flex items-center gap-2 text-orange-500">
                  <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px]">✓</div>
                  <span>Choisir l'itinéraire</span>
                </div>
                <div className="w-12 h-[1px] bg-gray-200"></div>
                
                <div className={cn("flex items-center gap-2", !isSelectingRetour ? "text-orange-500" : "text-orange-500")}>
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px]", !isSelectingRetour ? "bg-orange-500 text-white" : "bg-orange-500 text-white")}>
                    {isSelectingRetour ? "✓" : "2"}
                  </div>
                  <span>Aller</span>
                </div>
                <div className="w-12 h-[1px] bg-gray-200"></div>

                <div className={cn("flex items-center gap-2", isSelectingRetour ? "text-orange-500" : "text-gray-400")}>
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px]", isSelectingRetour ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400")}>
                    3
                  </div>
                  <span>Retour</span>
                </div>
                <div className="w-12 h-[1px] bg-gray-200"></div>

                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px]">4</div>
                  <span>Confirmer et payer</span>
                </div>
              </div>
            </div>

            {/* Selected Aller Summary */}
            {isSelectingRetour && selectedAllerJourney && (
              <div className="mb-8 bg-gray-50 border border-gray-200 rounded-2xl p-6 relative animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="text-[12px] font-bold text-gray-500 uppercase mb-4 tracking-wider">Trajet aller sélectionné</div>
                <div className="flex flex-col gap-1">
                  <div className="text-[14px] font-bold text-gray-900">
                    {format(new Date(date), 'EEEE, dd MMMM yyyy', { locale: fr })} • {selectedAllerJourney.from.time.slice(0, 5)} — {selectedAllerJourney.to.time.slice(0, 5)}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-2 h-2 rounded-full border-2 border-blue-500 bg-white" />
                      <div className="w-[1px] h-4 bg-blue-200" />
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="text-[14px] font-medium text-gray-700">{selectedAllerJourney.from.cityName}</div>
                      <div className="text-[14px] font-medium text-gray-700">{selectedAllerJourney.to.cityName}</div>
                    </div>
                  </div>
                </div>
                <Link 
                  to="/search" 
                  search={{ departureCityId, arrivalCityId, date, returnDate, nbrOfPassengers }}
                  className="absolute top-6 right-6 text-[12px] font-bold text-blue-600 hover:underline"
                >
                  Modifier
                </Link>
              </div>
            )}

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-gray-900">
                {isSelectingRetour ? "Retour" : "Aller"} - {results?.journeys?.length || 0} résultats
              </h2>

            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i: number) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-gray-border flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <Skeleton className="w-32 h-6" />
                      <Skeleton className="w-16 h-4" />
                    </div>
                    <Skeleton className="w-full h-24" />
                    <div className="flex justify-end">
                      <Skeleton className="w-40 h-10" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-white p-12 rounded-2xl border border-gray-border text-center shadow-sm">
                <AlertCircle size={48} className="text-red mx-auto mb-4" />
                <h2 className="text-xl font-bold text-dark mb-2">Une erreur est survenue</h2>
                <p className="text-gray-body mb-6">Impossible de charger les trajets pour le moment.</p>
                <Button onClick={() => refetch()} variant="outline">Réessayer</Button>
              </div>
            ) : results?.journeys?.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-gray-border text-center shadow-sm rise-in">
                <Search size={48} className="text-gray-body/50 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-dark mb-2">Aucun trajet trouvé</h2>
                <p className="text-gray-body mb-6">Essayez une autre date ou d'autres villes de départ/arrivée.</p>
                <Link to="/">
                  <Button className="bg-primary text-white font-bold">Retour à l'accueil</Button>
                </Link>
              </div>
            ) : (
              <div className="fade-in space-y-4">
                {results?.journeys?.map((journey: Journey) => (
                  <JourneyCard 
                    key={journey.id} 
                    journey={journey} 
                    searchId={results.searchId}
                    searchParams={{ 
                      departureCityId, 
                      arrivalCityId, 
                      date, 
                      returnDate, 
                      nbrOfPassengers, 
                      allerJourneyId,
                      allerSearchId: isSelectingRetour ? (searchParams.allerSearchId) : results.searchId
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
