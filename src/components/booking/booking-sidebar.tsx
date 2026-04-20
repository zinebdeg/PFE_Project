import { Bus, Clock, Info, CheckCircle2, ChevronDown, ChevronUp, Map, Thermometer, Briefcase, Sun, ShieldPlus } from 'lucide-react';
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
  const ticketTotal = journey.price.total * passengerCount;
  const grandTotal = ticketTotal + serviceFee;

  // Consolidate all stops (from, intermediate stops, to)
  const allStops = [
    { ...journey.from, type: 'DEPARTURE' },
    ...(journey.stops || []).map((s: any) => ({ ...s, type: 'STOP' })),
    { ...journey.to, type: 'ARRIVAL' }
  ];

  return (
    <div className="space-y-6">
      {/* Journey Summary Card */}
      <div className="bg-white rounded-[32px] border border-gray-border overflow-hidden shadow-sm flex flex-col transition-all duration-300">
        {/* Header Image with Tag */}
        <div className="relative h-40 overflow-hidden group">
          <img 
            src={journey.bus.image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800"} 
            alt="Bus" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white rounded-full text-[10px] font-black text-dark uppercase tracking-widest shadow-lg">
              Trajet {journey.stops?.length ? 'avec arrêts' : 'direct'}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white shadow-lg border border-gray-border/30",
                isExpanded ? "bg-primary text-white border-primary" : "text-gray-body hover:bg-gray-light"
              )}
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>
        
        <div className="p-8">
          <div className="flex flex-col gap-2 mb-6">
            <h3 className="text-xl font-black text-[#FF6900] flex items-center gap-2">
              {journey.from.cityName}
              <span className="text-gray-body/30 font-light">→</span>
              {journey.to.cityName}
            </h3>
            <div className="flex items-center gap-4 text-xs font-bold text-gray-body uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-blue" />
                Durée: {journey.duration}
              </div>
              <div className="flex items-center gap-1.5">
                <Bus size={14} className="text-blue" />
                {passengerCount} {passengerCount > 1 ? 'passagers' : 'passager'}
              </div>
            </div>
          </div>

          {/* DÉPART / ARRIVÉE Visualization Box (Static Summary) */}
          <div className="bg-[#fcfdfe] p-5 rounded-2xl border border-gray-border/30 mb-0 group hover:border-blue/20 transition-colors">
            <div className="flex justify-between relative">
              <div className="flex flex-col gap-1 items-start z-10">
                <span className="text-[10px] font-black text-gray-body/50 uppercase tracking-widest">Départ</span>
                <span className="text-xl font-black text-dark leading-none">{journey.from.time.slice(0, 5)}</span>
                <span className="text-[11px] font-bold text-blue">{journey.from.cityName}</span>
              </div>

              {/* Connecting Line */}
              <div className="absolute left-[25%] right-[25%] top-[45%] h-[1px] border-t border-dashed border-gray-border/50 group-hover:border-blue/30 transition-colors" />

              <div className="flex flex-col gap-1 items-end z-10 text-right">
                <span className="text-[10px] font-black text-gray-body/50 uppercase tracking-widest">Arrivée</span>
                <span className="text-xl font-black text-dark leading-none">{journey.to.time.slice(0, 5)}</span>
                <span className="text-[11px] font-bold text-blue">{journey.to.cityName}</span>
              </div>
            </div>
          </div>

          {/* Expandable Details Section */}
          <div className={cn(
            "grid transition-all duration-300 ease-in-out",
            isExpanded ? "grid-rows-[1fr] opacity-100 mt-6" : "grid-rows-[0fr] opacity-0"
          )}>
            <div className="overflow-hidden">
              {/* Amenities Section */}
              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  { icon: Thermometer, label: 'Climatisation' },
                  { icon: Briefcase, label: 'Services bagages' },
                  { icon: Sun, label: 'Lumière' },
                  { icon: Map, label: 'Auto-Route' },
                  { icon: ShieldPlus, label: 'Boite à Pharmacie' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-light/50 rounded-lg text-[10px] font-bold text-gray-body whitespace-nowrap">
                    <item.icon size={12} className="text-blue/70" /> {item.label}
                  </div>
                ))}
              </div>

              {/* Timeline Section */}
              <div className="space-y-0 relative pl-6 pb-2">
                <div className="absolute left-[7px] top-2 bottom-6 w-0.5 bg-gray-border/50" />
                
                {allStops.map((stop, idx) => (
                  <div key={idx} className="relative pb-8 last:pb-0 group">
                    {/* Timeline Dot */}
                    <div className={cn(
                      "absolute -left-[23px] top-1 w-4 h-4 rounded-full border-2 bg-white transition-all z-10",
                      stop.type === 'DEPARTURE' || stop.type === 'ARRIVAL' 
                        ? "border-blue scale-110 shadow-sm" 
                        : "border-gray-border group-hover:border-blue"
                    )}>
                      {(stop.type === 'DEPARTURE' || stop.type === 'ARRIVAL') && (
                        <div className="absolute inset-0.5 rounded-full bg-blue/20" />
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between pr-2">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-sm font-black",
                            stop.type === 'DEPARTURE' || stop.type === 'ARRIVAL' ? "text-blue" : "text-dark"
                          )}>
                            {stop.time.slice(0, 5)}
                          </span>
                          <span className="text-gray-body/30">•</span>
                          <span className="text-sm font-black text-dark">{stop.cityName || stop.name}</span>
                        </div>
                        {stop.type === 'DEPARTURE' && <span className="text-[9px] font-black text-blue/40 uppercase tracking-widest">Départ</span>}
                        {stop.type === 'ARRIVAL' && <span className="text-[9px] font-black text-blue/40 uppercase tracking-widest">Arrivée</span>}
                      </div>
                      
                      {stop.stationName && (
                        <p className="text-[11px] text-gray-body font-medium leading-tight">
                          {stop.stationName}
                        </p>
                      )}
                      
                      {/* Optional Map Link for Cities/Stations */}
                      {(stop.latitude && stop.longitude) && (
                        <button className="flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-md border border-gray-border/50 hover:bg-gray-light transition-colors w-fit">
                          <Map size={10} className="text-blue" />
                          <span className="text-[10px] font-bold text-dark">Carte</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {(!journey.stops || journey.stops.length === 0) && (
                  <div className="mt-2 pl-2">
                    <span className="text-[11px] text-gray-body italic border-l-2 border-primary/20 pl-3">
                      Ceci est un trajet direct sans arrêts intermédiaires.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Details Card */}
      <div className="bg-white p-8 rounded-[32px] border border-gray-border shadow-sm">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-body">{passengerCount} passager</span>
            <span className="text-sm font-black text-dark">{ticketTotal.toFixed(2)} Dhs</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-body">Frais de service ({passengerCount})</span>
              <Info size={14} className="text-gray-body" />
            </div>
            <span className="text-sm font-black text-dark">{serviceFee.toFixed(2)} Dhs</span>
          </div>

          <div className="pt-6 border-t border-gray-border flex justify-between items-center">
            <span className="text-sm font-bold text-dark">Totale</span>
            <span className="text-xl font-black text-dark tracking-tight">{grandTotal.toFixed(2)} Dhs</span>
          </div>

          <div className="flex items-start gap-3 py-2" onClick={() => setTermsAccepted(!termsAccepted)}>
            <div className={cn(
              "w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-colors shrink-0",
              termsAccepted ? "bg-primary border-primary" : "border-gray-border hover:border-primary border-dashed"
            )}>
              {termsAccepted && <CheckCircle2 size={14} className="text-white" />}
            </div>
            <p className="text-[10px] text-gray-body leading-tight cursor-pointer">
              J'ai lu et j'accepte les <a href="#" className="text-blue underline" onClick={(e) => e.stopPropagation()}>Conditions de vente et d'utilisation</a>, notamment la mention relative à la protection des données personnelles.
            </p>
          </div>

          <Button 
            onClick={() => {
              if (!termsAccepted) {
                alert("Veuillez accepter les Conditions de vente et d'utilisation avant de procéder au paiement.");
                return;
              }
              onPay();
            }}
            disabled={loading}
            className="w-full h-16 bg-[#FF6900] hover:bg-[#FF8000] text-white font-black text-lg rounded-[20px] shadow-xl shadow-orange-500/20 transition-all active:scale-[0.98]"
          >
            {loading ? 'Traitement...' : 'Passer au paiement'}
          </Button>
        </div>
      </div>
    </div>
  );
}
