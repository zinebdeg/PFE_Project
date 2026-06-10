import { useCities } from '#/hooks/use-cities';
import { useState, useEffect, useMemo } from 'react';
import type { City } from '#/api/types';

// Composant utilitaire pour animer les compteurs
function AnimatedCounter({ endValue, duration, suffix = '' }: { endValue: number, duration: number, suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = Math.ceil(endValue / (duration / 20));

    const timer = setInterval(() => {
      start += increment;
      if (start >= endValue) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [endValue, duration]);

  return <>{count}{suffix}</>;
}

export default function StatsSection() {
  // On récupère la vraie liste des villes depuis l'API en temps réel
  const { data: rawCities } = useCities('fr');

  // Même logique de déduplication que le formulaire de recherche
  const uniqueCityCount = useMemo(() => {
    if (!rawCities) return 80;
    const map = new Map<string, boolean>();
    rawCities.forEach((c: City) => {
      let name = c.name;
      // Nettoyer les noms avec parenthèses régionales ex: "Temara (Rabat)"
      name = name.replace(/\s*\([^)]+\)/g, '').trim();
      map.set(name.toLowerCase(), true);
    });
    return map.size;
  }, [rawCities]);


  return (
    <section className="py-20 bg-white border-b border-gray-border overflow-hidden">
      <div className="container-app">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
          
          <div className="flex flex-col gap-2 group animate-in slide-in-from-bottom border-b md:border-b-0 md:border-r border-gray-border pb-8 md:pb-0">
            <span className="text-xs font-bold text-gray-body uppercase tracking-widest">Tickets réservés chaque jour</span>
            <span className="text-5xl font-extrabold text-dark group-hover:text-primary transition-colors">
              +<AnimatedCounter endValue={15} duration={1500} suffix="K" />
            </span>
          </div>

          <div className="flex flex-col gap-2 group animate-in slide-in-from-bottom border-b md:border-b-0 md:border-r border-gray-border pb-8 md:pb-0" style={{ animationDelay: '100ms' }}>
            <span className="text-xs font-bold text-gray-body uppercase tracking-widest">Destinations (Temps Réel)</span>
            <span className="text-5xl font-extrabold text-dark group-hover:text-primary transition-colors">
              +<AnimatedCounter endValue={uniqueCityCount} duration={2000} />
            </span>
          </div>

          <div className="flex flex-col gap-2 group animate-in slide-in-from-bottom" style={{ animationDelay: '200ms' }}>
            <span className="text-xs font-bold text-gray-body uppercase tracking-widest">Clients satisfaits</span>
            <span className="text-5xl font-extrabold text-dark group-hover:text-primary transition-colors">
              +<AnimatedCounter endValue={50} duration={2500} suffix="K" />
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
