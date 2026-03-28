import { POPULAR_ROUTES } from '#/lib/constants';
import { ChevronRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function PopularRoutes() {
  return (
    <section className="py-24 bg-white">
      <div className="container-app">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-dark mb-4 drop-shadow-sm">Routes Populaires</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {POPULAR_ROUTES.map((route, i) => (
            <Link
              key={i}
              to="/search"
              search={{
                // Mapping should ideally use city IDs, but for popular routes mock search
                // we'll just link to search page or specific IDs if known.
                // Assuming IDs for Casablanca is 2, etc. based on Markoub API docs common IDs
                departureCityId: route.from === 'Casablanca' ? 2 : 1, // Mock logic
                arrivalCityId: route.to === 'Fes' ? 3 : 4,
                date: new Date().toISOString().split('T')[0],
                nbrOfPassengers: 1,
              }}
              className="flex items-center justify-between p-4 border border-gray-border rounded-xl hover:border-primary hover:bg-primary-light transition-all no-underline group"
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-body group-hover:text-primary transition-colors">{route.from} à</span>
                <span className="text-sm font-extrabold text-dark">{route.to}</span>
              </div>
              <ChevronRight size={18} className="text-gray-body group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
