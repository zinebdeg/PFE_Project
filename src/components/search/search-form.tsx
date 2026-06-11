import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCities } from '../../hooks/use-cities';
import type { City } from '../../api/types';
import { Button } from '../ui/button';
import { MapPin, Calendar as CalendarIcon, Users, Search } from 'lucide-react';
import { format, isToday, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import { Calendar } from '../ui/calendar';

interface SearchFormProps {
  initialFromId?: number;
  initialToId?: number;
  initialDate?: string;
  initialReturnDate?: string;
  initialPassengers?: number;
}

export default function SearchForm({
  initialFromId = undefined,
  initialToId = undefined,
  initialDate,
  initialReturnDate,
  initialPassengers = 1
}: SearchFormProps = {}) {
  const navigate = useNavigate();
  // APPEL À L'API :
  const { data: rawCities = [] } = useCities();

  // Nettoyage des noms (ex: enlever "(Rabat)" de Temara) et déduplication
  const cities = useMemo(() => {
    const map = new Map<string, City>();
    rawCities.forEach((c: City) => {
      let cleanName = c.name;
      // Nettoyer spécifiquement Temara (Rabat)
      if (cleanName.toLowerCase().includes('temara')) {
        cleanName = cleanName.replace(/\s*\(Rabat\)/i, '');
      }
      // Utiliser le nom en minuscules comme clé pour éviter les doublons (ex: 2 fois Temara)
      if (!map.has(cleanName.toLowerCase())) {
        map.set(cleanName.toLowerCase(), { ...c, name: cleanName });
      }
    });
    return Array.from(map.values());
  }, [rawCities]);

  const [fromId, setFromId] = useState<number | undefined>(initialFromId);
  const [toId, setToId] = useState<number | undefined>(initialToId);
  const [date, setDate] = useState<string>(initialDate || format(new Date(), 'yyyy-MM-dd'));
  const [returnDate, setReturnDate] = useState<string>(initialReturnDate || '');
  const [passengers, setPassengers] = useState(initialPassengers);

  const [showFromMenu, setShowFromMenu] = useState(false);
  const [showToMenu, setShowToMenu] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);

  // Ensure return date is not before departure
  useEffect(() => {
    if (returnDate) {
      const dep = new Date(date);
      const ret = new Date(returnDate);
      if (ret < dep) {
        setReturnDate(format(dep, 'yyyy-MM-dd'));
      }
    }
  }, [date]);
  // On s'assure que la date de retour, si fournie, est postérieure à la date de départ.
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromId || !toId) return;

    // Convertir les dates en objets Date pour la comparaison
    const departure = new Date(date);
    let retDate = returnDate ? new Date(returnDate) : undefined;

    if (retDate) {
      // Si la date de retour est antérieure à la date de départ, on la corrige
      if (retDate < departure) {
        // On met la même date que le départ
        retDate = departure;
        setReturnDate(format(retDate, 'yyyy-MM-dd'));
      }
    }

    const searchParams: Record<string, any> = {
      departureCityId: fromId,
      arrivalCityId: toId,
      date,
      nbrOfPassengers: passengers,
    };
    if (retDate) {
      searchParams.returnDate = format(retDate, 'yyyy-MM-dd');
    }
    // @ts-ignore
    navigate({
      to: '/search',
      search: searchParams,
    });
  };

  const getCityName = (id: number | undefined) =>
    cities.find((c: City) => c.id === id)?.name || '';

  const [fromSearchText, setFromSearchText] = useState('');
  const [toSearchText, setToSearchText] = useState('');

  // Initialize search texts when cities are loaded or on first mount
  useEffect(() => {
    if (cities.length > 0 && fromId && !fromSearchText) {
      setFromSearchText(getCityName(fromId));
    }
  }, [cities, fromId]);

  useEffect(() => {
    if (cities.length > 0 && toId && !toSearchText) {
      setToSearchText(getCityName(toId));
    }
  }, [cities, toId]);

  // LOGIQUE DE RECHERCHE LOCALE (FILTRAGE) :
  // Pour éviter d'afficher 100 villes, on filtre le tableau `cities` (téléchargé depuis l'API)
  // en temps réel selon ce que l'utilisateur tape dans l'input (fromSearchText).
  const filteredFromCities = cities.filter((c: City) => c.name.toLowerCase().includes(fromSearchText.toLowerCase()));
  const filteredToCities = cities.filter((c: City) => c.name.toLowerCase().includes(toSearchText.toLowerCase()));

  return (
    <div className="bg-white rounded-[24px] shadow-sm p-6 w-full max-w-md relative z-10 border border-gray-200">
      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        {/* Departure City */}
        <div className="relative">
          <div
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl focus-within:border-primary transition-colors cursor-text"
          >
            <MapPin size={20} className="text-gray-500 shrink-0" />
            <input
              type="text"
              placeholder="Ville de départ"
              value={fromSearchText}
              onChange={(e) => {
                setFromSearchText(e.target.value);
                setFromId(undefined); // Reset specific ID since user is typing
                setShowFromMenu(true);
              }}
              onFocus={() => {
                setShowFromMenu(true);
                setShowToMenu(false);
                setShowDatePicker(false);
                setShowReturnPicker(false);
              }}
              onBlur={() => setTimeout(() => setShowFromMenu(false), 150)}
              className="w-full bg-transparent outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {showFromMenu && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-border shadow-2xl rounded-xl z-50 overflow-hidden fade-in">
              <div className="p-2 border-b border-gray-border bg-gray-light">
                <span className="text-[10px] font-bold text-gray-body uppercase">
                  {filteredFromCities.length > 0 ? 'Villes' : 'Aucun résultat'}
                </span>
              </div>
              <div className="max-h-60 overflow-y-auto w-full">
                {filteredFromCities.map((city: City) => (
                  <div
                    key={city.id}
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevents input from losing focus early
                      setFromId(city.id);
                      setFromSearchText(city.name);
                      setShowFromMenu(false);
                    }}
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
        <div className="relative">
          <div
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl focus-within:border-primary transition-colors cursor-text"
          >
            <MapPin size={20} className="text-gray-500 shrink-0" />
            <input
              type="text"
              placeholder="Ville d'arrivée"
              value={toSearchText}
              onChange={(e) => {
                setToSearchText(e.target.value);
                setToId(undefined); // Reset specific ID since user is typing
                setShowToMenu(true);
              }}
              onFocus={() => {
                setShowToMenu(true);
                setShowFromMenu(false);
                setShowDatePicker(false);
                setShowReturnPicker(false);
              }}
              onBlur={() => setTimeout(() => setShowToMenu(false), 150)}
              className="w-full bg-transparent outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {showToMenu && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-border shadow-2xl rounded-xl z-50 overflow-hidden fade-in">
              <div className="p-2 border-b border-gray-border bg-gray-light">
                <span className="text-[10px] font-bold text-gray-body uppercase">
                  {filteredToCities.length > 0 ? 'Villes' : 'Aucun résultat'}
                </span>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredToCities.map((city: City) => (
                  <div
                    key={city.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setToId(city.id);
                      setToSearchText(city.name);
                      setShowToMenu(false);
                    }}
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

        {/* Dates row */}
        <div className="grid grid-cols-2 gap-4 relative">
          {/* Departure Date */}
          <div className="relative">
            <div
              onClick={() => { setShowDatePicker(!showDatePicker); setShowReturnPicker(false); setShowFromMenu(false); setShowToMenu(false); }}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-primary transition-colors cursor-pointer bg-white"
            >
              <CalendarIcon size={20} className="text-gray-500 shrink-0" />
              <span className="text-sm truncate text-gray-600 font-medium">
                {date ? (isToday(new Date(date)) ? "Aujourd'hui" : format(new Date(date), 'dd MMMM yyyy', { locale: fr })) : "Aujourd'hui"}
              </span>
            </div>
          </div>

          {/* Return Date */}
          <div className="relative">
            <div
              onClick={() => { setShowReturnPicker(!showReturnPicker); setShowDatePicker(false); setShowFromMenu(false); setShowToMenu(false); }}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-primary transition-colors cursor-pointer bg-white"
            >
              <CalendarIcon size={20} className="text-gray-500 shrink-0" />
              <span className={cn("text-sm truncate font-medium text-gray-400 capitalize", returnDate && "text-gray-600")}>
                {returnDate ? format(new Date(returnDate), 'dd MMMM yyyy', { locale: fr }) : 'Date de retour'}
              </span>
            </div>
          </div>

          {/* Popovers relative to the whole dates row */}
          {showDatePicker && (
            <div className="absolute top-full left-[-20px] mt-2 z-[100] animate-in fade-in zoom-in-95 shadow-2xl overflow-visible">
              <Calendar
                selectedDate={date ? new Date(date) : undefined}
                maxDate={returnDate ? new Date(returnDate) : undefined}
                onSelect={(d) => {
                  setDate(format(d, 'yyyy-MM-dd'));
                  setShowDatePicker(false);
                }}
              />
            </div>
          )}

          {showReturnPicker && (
            <div className="absolute top-full right-0 mt-2 z-[100] animate-in fade-in zoom-in-95 shadow-2xl overflow-visible">
              <Calendar
                selectedDate={returnDate ? new Date(returnDate) : undefined}
                minDate={new Date(date)}
                onSelect={(d) => {
                  const dep = new Date(date);
                  const chosen = d < dep ? dep : d;
                  setReturnDate(format(chosen, 'yyyy-MM-dd'));
                  setShowReturnPicker(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Passengers */}
        <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-primary transition-colors cursor-pointer relative">
          <Users size={20} className="text-gray-500 shrink-0" />
          <select
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          >
            {[1, 2, 3, 4, 5, 6].map(n => (
              <option key={n} value={n}>{n} Passagers</option>
            ))}
          </select>
          <span className="text-sm truncate text-gray-600 font-medium">{passengers} Passagers</span>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full h-[52px] text-[15px] font-bold bg-[#3b82f6] hover:bg-blue-600 text-white rounded-full shadow-md transition-all active:scale-[0.98]"
            disabled={!fromId || !toId}
          >
            Trouver mon ticket
          </Button>
        </div>
      </form>
    </div>
  );
}
