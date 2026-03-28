import { createFileRoute, Link } from '@tanstack/react-router';
import { useJourneySearch } from '../hooks/use-journeys';
import { useCities } from '../hooks/use-cities';
import JourneyCard from '../components/journey/journey-card';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import { Search, AlertCircle, Calendar, MapPin, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Journey, City } from '../api/types';

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

  const fromCity = cities?.find((c: City) => c.id === departureCityId)?.name;
  const toCity = cities?.find((c: City) => c.id === arrivalCityId)?.name;

  return (
    <main className="min-h-screen pt-10 pb-20 bg-gray-light/30">
      <div className="container-app">
        {/* Search header info */}
        <div className="bg-white p-6 rounded-2xl border border-gray-border shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 rise-in">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Search size={24} />
            </div>
            <div className="flex flex-col text-dark">
              <h1 className="text-xl font-black flex items-center gap-2">
                {fromCity} <span className="text-gray-body font-medium">→</span> {toCity}
              </h1>
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-body font-bold uppercase tracking-wide">
                <span className="flex items-center gap-1"><Calendar size={14} /> {date ? format(new Date(date), 'dd MMMM yyyy', { locale: fr }) : ''}</span>
                <span className="flex items-center gap-1"><MapPin size={14} /> {results?.journeys?.length || 0} trajets trouvés</span>
              </div>
            </div>
          </div>
          
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-border rounded-xl text-sm font-bold text-dark hover:bg-gray-light transition-colors">
            <Filter size={18} />
            Filtrer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters sidebar - Placeholder */}
          <div className="hidden md:block col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-gray-border shadow-sm sticky top-24">
              <h3 className="text-sm font-black text-dark uppercase tracking-widest mb-6">Filtres</h3>
              {/* Mock filter categories */}
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-body uppercase mb-3 block">Heure de départ</label>
                  <div className="space-y-2">
                    {['Matin', 'Après-midi', 'Soir'].map((t: string) => (
                      <label key={t} className="flex items-center gap-3 text-sm font-medium text-dark cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-border text-primary" /> {t}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results list */}
          <div className="col-span-1 md:col-span-3">
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
              <div className="bg-white p-12 rounded-2xl border border-gray-border text-center shadow-lg">
                <AlertCircle size={48} className="text-red mx-auto mb-4" />
                <h2 className="text-xl font-bold text-dark mb-2">Une erreur est survenue</h2>
                <p className="text-gray-body mb-6">Impossible de charger les trajets pour le moment.</p>
                <Button onClick={() => refetch()} variant="outline">Réessayer</Button>
              </div>
            ) : results?.journeys?.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-gray-border text-center shadow-lg rise-in">
                <Search size={48} className="text-gray-body/50 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-dark mb-2">Aucun trajet trouvé</h2>
                <p className="text-gray-body mb-6">Essayez une autre date ou d'autres villes de départ/arrivée.</p>
                <Link to="/">
                  <Button className="bg-primary text-white font-bold">Retour à l'accueil</Button>
                </Link>
              </div>
            ) : (
              <div className="fade-in">
                {results?.journeys?.map((journey: Journey) => (
                  <JourneyCard 
                    key={journey.id} 
                    journey={journey} 
                    searchId={results.searchId}
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
