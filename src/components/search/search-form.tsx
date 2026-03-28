import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCities } from '../../hooks/use-cities';
import type { City } from '../../api/types';
import { Button } from '../ui/button';
import { MapPin, Calendar, Users, Search } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '../../lib/utils';

export default function SearchForm() {
  const navigate = useNavigate();
  const { data: cities = [] } = useCities();
  
  const [fromId, setFromId] = useState<number | null>(null);
  const [toId, setToId] = useState<number | null>(null);
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [returnDate, setReturnDate] = useState<string>('');
  const [passengers, setPassengers] = useState(1);
  
  const [showFromMenu, setShowFromMenu] = useState(false);
  const [showToMenu, setShowToMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromId || !toId) return;
    
    navigate({
      to: '/search',
      search: {
        departureCityId: fromId,
        arrivalCityId: toId,
        date,
        nbrOfPassengers: passengers,
      },
    });
  };

  const getCityName = (id: number | null) => 
    cities.find((c: City) => c.id === id)?.name || '';

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 w-full max-w-4xl mx-auto -mt-24 relative z-10 border border-gray-border">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Departure City */}
        <div className="md:col-span-1 relative">
          <label className="text-[10px] font-bold text-gray-body uppercase mb-1 block">Ville de départ</label>
          <div 
            onClick={() => setShowFromMenu(!showFromMenu)}
            className="flex items-center gap-2 p-3 border border-gray-border rounded-xl hover:border-primary transition-colors cursor-pointer"
          >
            <MapPin size={18} className="text-gray-body shrink-0" />
            <span className={cn("text-sm truncate", !fromId && "text-gray-400")}>
              {getCityName(fromId) || 'Ville de départ'}
            </span>
          </div>
          
          {showFromMenu && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-border shadow-2xl rounded-xl z-50 overflow-hidden fade-in">
              <div className="p-2 border-b border-gray-border bg-gray-light">
                <span className="text-[10px] font-bold text-gray-body uppercase">Villes populaires</span>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {cities.map(city => (
                  <div 
                    key={city.id}
                    onClick={() => { setFromId(city.id); setShowFromMenu(false); }}
                    className="p-3 text-sm hover:bg-gray-light cursor-pointer flex items-center gap-2"
                  >
                    <MapPin size={14} className="text-gray-body" />
                    {city.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Arrival City */}
        <div className="md:col-span-1 relative">
          <label className="text-[10px] font-bold text-gray-body uppercase mb-1 block">Ville d'arrivée</label>
          <div 
            onClick={() => setShowToMenu(!showToMenu)}
            className="flex items-center gap-2 p-3 border border-gray-border rounded-xl hover:border-primary transition-colors cursor-pointer"
          >
            <MapPin size={18} className="text-gray-body shrink-0" />
            <span className={cn("text-sm truncate", !toId && "text-gray-400")}>
              {getCityName(toId) || 'Ville d\'arrivée'}
            </span>
          </div>
          
          {showToMenu && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-border shadow-2xl rounded-xl z-50 overflow-hidden fade-in">
              <div className="p-2 border-b border-gray-border bg-gray-light">
                <span className="text-[10px] font-bold text-gray-body uppercase">Villes populaires</span>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {cities.map(city => (
                  <div 
                    key={city.id}
                    onClick={() => { setToId(city.id); setShowToMenu(false); }}
                    className="p-3 text-sm hover:bg-gray-light cursor-pointer flex items-center gap-2"
                  >
                    <MapPin size={14} className="text-gray-body" />
                    {city.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Date */}
        <div className="md:col-span-1">
          <label className="text-[10px] font-bold text-gray-body uppercase mb-1 block">Aujourd'hui</label>
          <div className="flex items-center gap-2 p-3 border border-gray-border rounded-xl hover:border-primary transition-colors cursor-pointer relative">
            <Calendar size={18} className="text-gray-body shrink-0" />
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <span className="text-sm truncate">
              {format(new Date(date), 'dd/MM/yyyy', { locale: fr })}
            </span>
          </div>
        </div>

        {/* Return Date */}
        <div className="md:col-span-1">
          <label className="text-[10px] font-bold text-gray-body uppercase mb-1 block">Date de retour</label>
          <div className="flex items-center gap-2 p-3 border border-gray-border rounded-xl hover:border-primary transition-colors cursor-pointer relative">
            <Calendar size={18} className="text-gray-body shrink-0" />
            <input 
              type="date" 
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <span className={cn("text-sm truncate", !returnDate && "text-gray-400")}>
              {returnDate ? format(new Date(returnDate), 'dd/MM/yyyy', { locale: fr }) : 'Date de retour'}
            </span>
          </div>
        </div>

        {/* Passengers */}
        <div className="md:col-span-1">
          <label className="text-[10px] font-bold text-gray-body uppercase mb-1 block">Passagers</label>
          <div className="flex items-center gap-2 p-3 border border-gray-border rounded-xl hover:border-primary transition-colors cursor-pointer relative">
            <Users size={18} className="text-gray-body shrink-0" />
            <select 
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            >
              {[1, 2, 3, 4, 5, 6].map(n => (
                <option key={n} value={n}>{n} Passagers</option>
              ))}
            </select>
            <span className="text-sm truncate">{passengers} Passagers</span>
          </div>
        </div>

        <div className="md:col-span-5 pt-2">
          <Button 
            type="submit" 
            className="w-full h-14 text-base font-bold bg-blue hover:bg-blue/90 text-white rounded-xl shadow-lg transition-all active:scale-[0.98]"
            disabled={!fromId || !toId}
          >
            <Search size={20} className="mr-2" />
            Trouver mon ticket
          </Button>
        </div>
      </form>
    </div>
  );
}
