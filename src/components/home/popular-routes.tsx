import { POPULAR_ROUTES } from '#/lib/constants';
import { ChevronRight, Loader2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useCities } from '#/hooks/use-cities';
import type { City } from '#/api/types';

export default function PopularRoutes() {
  const { data: cities = [], isLoading } = useCities() as { data: City[], isLoading: boolean };

  const getCityId = (name: string) => {
    // Normalize names for comparison (handle case and accents if necessary)
    const normalizedName = name.toLowerCase().trim();
    return cities.find(city => 
      city.name.toLowerCase().trim() === normalizedName
    )?.id || 0;
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="py-24 bg-white">
      <div className="container-app">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-[#111827] mb-4">Routes Populaires</h2>
          <p className="text-gray-500 font-medium">Découvrez nos trajets les plus demandés à travers le Royaume</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {POPULAR_ROUTES.map((route, i) => {
              const departureId = getCityId(route.from);
              const arrivalId = getCityId(route.to);

              return (
                <Link
                  key={i}
                  to="/search"
                  search={{
                    departureCityId: departureId,
                    arrivalCityId: arrivalId,
                    date: today,
                    nbrOfPassengers: 1,
                  }}
                  className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-primary hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 group no-underline"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold text-[#374151] group-hover:text-primary transition-colors">
                      {route.from} <span className="text-gray-400 mx-1">à</span> {route.to}
                    </span>
                  </div>
                  <ChevronRight 
                    size={18} 
                    className="text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-1" 
                  />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
