import { Bus, Clock, Info, User, CheckCircle2, ChevronDown, ChevronUp, Map, Thermometer, Briefcase, Sun, ShieldPlus, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import type { Journey } from '../../api/types';
import { useState } from 'react';
import { cn } from '../../lib/utils';

interface BookingSidebarProps {
  journey: Journey;
  searchId: string;
  passengerCount: number;
  serviceFee: number;
  onPay: () => void;
  loading?: boolean;
}

export default function BookingSidebar({ journey, searchId, passengerCount, serviceFee, onPay, loading }: BookingSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showError, setShowError] = useState(false);
  const ticketTotal = journey.price.total * passengerCount;
  const grandTotal = ticketTotal + serviceFee;

  // Consolidate all stops (from, intermediate stops, to)
  const allStops = [
    { ...journey.from, type: 'DEPARTURE' },
    ...(journey.stops || []).map((s: any) => ({ ...s, type: 'STOP' })),
    { ...journey.to, type: 'ARRIVAL' }
  ];

  return (
    <div className="space-y-4">
      {/* Journey Summary Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-3">
        {/* Header Section */}
        <div 
          className="flex items-center justify-between cursor-pointer group"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-100">
              <img 
                src={journey.bus.image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800"} 
                alt="Bus" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-gray-900 mb-0.5">Trajet {journey.stops?.length ? 'avec arrêts' : 'direct'}</span>
              <span className="text-xs text-blue-500 mb-0.5">{journey.from.cityName} → {journey.to.cityName}</span>
              <span className="text-xs text-gray-500 flex items-center gap-1">Durée: {journey.duration.replace('h00', 'h')} · {passengerCount} <User size={10} /></span>
            </div>
          </div>
          {isExpanded ? <ChevronUp size={18} className="text-gray-500 mr-1" /> : <ChevronDown size={18} className="text-gray-500 mr-1 group-hover:text-gray-900 transition-colors" />}
        </div>

        {/* Expandable Details Section */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in duration-200">
             {/* Amenities Tags */}
             <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { icon: Thermometer, label: 'Climatisation' },
                  { icon: Briefcase, label: 'Services bagages' },
                  { icon: Sun, label: 'Lumière' },
                  { icon: Map, label: 'Auto-Route' },
                  { icon: ShieldPlus, label: 'Boite à Pharmacie' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full border border-gray-100 text-[10px] font-medium text-gray-700 whitespace-nowrap">
                    <item.icon size={12} className="text-gray-600" /> {item.label}
                  </div>
                ))}
              </div>

              {/* Timeline Section */}
              <div className="relative pl-3 pb-2 space-y-6">
                <div className="absolute left-[16.5px] top-2 bottom-6 w-px bg-gray-200" />
                
                {allStops.map((stop, idx) => {
                  const isFirstOrLast = stop.type === 'DEPARTURE' || stop.type === 'ARRIVAL';
                  return (
                    <div key={idx} className="relative z-10 flex gap-4">
                      {/* Timeline Dot */}
                      <div className="mt-1 shrink-0 bg-white">
                        <div className={cn(
                          "w-2.5 h-2.5 rounded-full border-2 bg-white flex items-center justify-center relative",
                          isFirstOrLast ? "border-blue-500" : "border-gray-400"
                        )}>
                          {isFirstOrLast && <div className="absolute w-1 h-1 bg-blue-500 rounded-full" />}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-sm font-semibold",
                            isFirstOrLast ? "text-blue-500" : "text-blue-500" // Keep blue for all times matching design
                          )}>
                            {stop.time.slice(0, 5)}
                          </span>
                          <span className="text-gray-900 text-sm font-semibold">·</span>
                          <span className="text-sm font-semibold text-gray-900">{stop.stationName || stop.cityName}</span>
                        </div>
                        
                        {/* Optional extra address info */}
                        {stop.stationAddress && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {stop.stationAddress}
                          </p>
                        )}
                        
                        {/* Map Link */}
                        {(stop.latitude && stop.longitude) && (
                          <button className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors w-fit text-gray-700">
                            <Map size={12} className="text-gray-700" />
                            <span className="text-xs font-medium">Carte</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
          </div>
        )}
      </div>

      {/* Price Details Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="space-y-4 mb-5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{passengerCount} passager{passengerCount > 1 ? 's' : ''}</span>
            <span className="text-sm text-gray-600">{ticketTotal.toFixed(2)} Dhs</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-gray-600">Frais de service ({passengerCount})</span>
              <Info size={14} className="text-gray-400" />
            </div>
            <span className="text-sm text-gray-600">{serviceFee.toFixed(2)} Dhs</span>
          </div>
        </div>

        <hr className="border-gray-100 mb-5" />

        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-gray-900">Totale</span>
          <span className="text-sm font-bold text-gray-900">{grandTotal.toFixed(2)} Dhs</span>
        </div>

        <div className="flex items-start gap-3 mb-6">
          <input 
            type="checkbox" 
            checked={termsAccepted}
            onChange={() => {
              setTermsAccepted(!termsAccepted);
              if (!termsAccepted) setShowError(false);
            }}
            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer shrink-0"
          />
          <p className="text-[11px] text-gray-600 leading-relaxed cursor-pointer" onClick={() => {
            setTermsAccepted(!termsAccepted);
            if (!termsAccepted) setShowError(false);
          }}>
            J'ai lu et j'accepte les <a href="#" className="text-blue-500 underline" onClick={(e) => e.stopPropagation()}>Conditions de vente et d'utilisation</a>, notamment la mention relative à la protection des données personnelles.
          </p>
        </div>

        <Button 
          onClick={() => {
            if (!termsAccepted) {
              setShowError(true);
              setTimeout(() => setShowError(false), 4000);
              return;
            }
            onPay();
          }}
          disabled={loading}
          className="w-full h-11 bg-[#2563EB] hover:bg-blue-600 text-white font-medium rounded-full transition-colors"
        >
          {loading ? 'Traitement...' : 'Passer au paiement'}
        </Button>
      </div>

      {/* Custom Markoub-style Toast Error */}
      {showError && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#fff1f2] border border-[#fecdd3] px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 max-w-sm">
            <AlertCircle size={22} className="text-[#e11d48] shrink-0 fill-red-100" />
            <p className="text-[#e11d48] font-semibold text-sm">
              Veuillez remplir tous les champs requis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
