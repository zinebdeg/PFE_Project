import { createFileRoute, Link } from '@tanstack/react-router';
import { useJourneySearch } from '../hooks/use-journeys';
import { useCities } from '../hooks/use-cities';
import JourneyCard from '../components/journey/journey-card';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import { Search, AlertCircle } from 'lucide-react';
import type { Journey, City } from '../api/types';
import SearchForm from '../components/search/search-form';

export const Route = createFileRoute('/search')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      departureCityId: Number(search.departureCityId) || 0,
      arrivalCityId: Number(search.arrivalCityId) || 0,
      date: (search.date as string) || '',
      nbrOfPassengers: Number(search.nbrOfPassengers) || 1,
    };
  },
  component: SearchResults,
});

function SearchResults() {
  const { departureCityId, arrivalCityId, date, nbrOfPassengers } = Route.useSearch();
  const { data: cities = [] } = useCities() as { data: City[] };
  
  const { 
    data: results, 
    isLoading, 
    error,
    refetch 
  } = useJourneySearch({
    departureCityId,
    arrivalCityId,
    date,
    nbrOfPassengers,
  });

  return (
    <main className="min-h-screen pt-10 pb-20 bg-[#f4f7fc]">
      <div className="container-app">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <div className="md:col-span-4 lg:col-span-3 sticky top-24">
            <SearchForm 
              initialFromId={departureCityId}
              initialToId={arrivalCityId}
              initialDate={date}
              initialPassengers={nbrOfPassengers}
            />
          </div>

          {/* Results list */}
          <div className="md:col-span-8 lg:col-span-9">
            <div className="mb-6">
              <h2 className="text-[14px] font-bold text-gray-500">
                {results?.journeys?.length || 0} résultats
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
                    searchParams={{ departureCityId, arrivalCityId, date, nbrOfPassengers }}
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
