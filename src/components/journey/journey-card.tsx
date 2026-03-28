import type { Journey } from '../../api/types';
import { Button } from '../ui/button';
import { Clock, MapPin, Bus, Wifi, Zap, User, ChevronRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function JourneyCard({ journey, searchId }: { journey: Journey; searchId: string }) {
  return (
    <div className="bg-white border border-gray-border rounded-2xl overflow-hidden hover:shadow-lg transition-all p-4 md:p-6 mb-4 flex flex-col md:flex-row gap-6 group">
      {/* Company & Bus Info */}
      <div className="md:w-48 flex flex-col items-center justify-center shrink-0">
        <div className="w-16 h-16 rounded-xl bg-gray-light flex items-center justify-center mb-3">
          <img src={journey.company.logo} alt={journey.company.name} className="max-w-[80%]" />
        </div>
        <span className="text-sm font-bold text-dark text-center">{journey.company.name}</span>
        <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-body font-bold uppercase tracking-wide">
          <Bus size={12} />
          {journey.bus.name}
        </div>
      </div>

      {/* Journey details */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-4">
          {/* Departure */}
          <div className="flex flex-col">
            <span className="text-2xl font-black text-dark">{journey.from.time.slice(0, 5)}</span>
            <span className="text-sm font-bold text-dark">{journey.from.cityName}</span>
            <span className="text-[10px] text-gray-body mt-1 flex items-center gap-1">
              <MapPin size={10} /> {journey.from.stationName}
            </span>
          </div>

          {/* Path visualization */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 w-full">
              <div className="w-3 h-3 rounded-full border-2 border-primary" />
              <div className="flex-1 h-px border-t-2 border-dashed border-gray-border" />
              <div className="w-3 h-3 rounded-full bg-primary" />
            </div>
            <span className="text-[10px] font-bold text-gray-body uppercase tracking-tighter">
              <Clock size={10} className="inline mr-1" />
              {journey.duration}
            </span>
          </div>

          {/* Arrival */}
          <div className="flex flex-col text-right">
            <span className="text-2xl font-black text-dark">{journey.to.time.slice(0, 5)}</span>
            <span className="text-sm font-bold text-dark">{journey.to.cityName}</span>
            <span className="text-[10px] text-gray-body mt-1 flex items-center justify-end gap-1">
              {journey.to.stationName} <MapPin size={10} />
            </span>
          </div>
        </div>

        {/* Equipments & Info */}
        <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-border">
          <div className="flex items-center gap-1 text-[10px] text-green font-bold uppercase py-1 px-2 bg-green/10 rounded-full">
            <Wifi size={10} /> Wifi
          </div>
          <div className="flex items-center gap-1 text-[10px] text-primary font-bold uppercase py-1 px-2 bg-primary/10 rounded-full">
            <Zap size={10} /> Prise
          </div>
          <div className="flex items-center gap-1 text-[10px] text-blue font-bold uppercase py-1 px-2 bg-blue/10 rounded-full">
            <User size={10} /> {journey.seatsLeft} Places
          </div>
        </div>
      </div>

      {/* Price & Action */}
      <div className="md:w-44 flex flex-col items-end justify-center shrink-0 border-l border-gray-border pl-6">
        <div className="text-xs font-bold text-gray-body mb-1">Dès</div>
        <div className="text-3xl font-black text-primary mb-4">
          {journey.price.total} <span className="text-sm">DH</span>
        </div>
        
        <Link 
          to="/journey/$journeyId"
          params={{ journeyId: journey.id.toString() }}
          search={{ searchId }}
          className="w-full no-underline"
        >
          <Button className="w-full font-bold bg-dark hover:bg-dark/90 text-white rounded-xl transition-all group-hover:bg-primary">
            Choisir
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
