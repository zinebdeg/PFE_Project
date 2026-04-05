'use client';
import { Bus, Clock, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import type { Journey } from '../../api/types';

interface BookingSidebarProps {
  journey: Journey;
  passengerCount: number;
  serviceFee: number;
  onPay: () => void;
  loading?: boolean;
}

export default function BookingSidebar({ journey, passengerCount, serviceFee, onPay, loading }: BookingSidebarProps) {
  const ticketTotal = journey.price.total * passengerCount;
  const grandTotal = ticketTotal + serviceFee;

  return (
    <div className="space-y-6">
      {/* Journey Summary Card */}
      <div className="bg-white rounded-[32px] border border-gray-border overflow-hidden shadow-sm">
        <div className="relative h-32 overflow-hidden">
          <img 
            src="/pullman-bus-thumbnail.jpg" 
            alt="Bus" 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800';
            }}
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-dark uppercase tracking-widest">
            Trajet direct
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-blue">{journey.from.cityName}</span>
                <span className="text-gray-body">→</span>
                <span className="text-sm font-black text-blue">{journey.to.cityName}</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs font-bold text-gray-body">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  Durée: {journey.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Bus size={12} />
                  {passengerCount} passager
                </div>
              </div>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-light transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
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

          <div className="flex items-start gap-3 py-2">
            <div className="w-5 h-5 rounded-md border-2 border-gray-border border-dashed flex items-center justify-center cursor-pointer hover:border-primary">
              <CheckCircle2 size={12} className="text-white fill-white" />
            </div>
            <p className="text-[10px] text-gray-body leading-tight">
              J'ai lu et j'accepte les <a href="#" className="text-blue underline">Conditions de vente et d'utilisation</a>, notamment la mention relative à la protection des données personnelles.
            </p>
          </div>

          <Button 
            onClick={onPay}
            disabled={loading}
            className="w-full h-16 bg-blue hover:bg-blue/90 text-white font-black text-lg rounded-[20px] shadow-xl shadow-blue/20 transition-all active:scale-[0.98]"
          >
            {loading ? 'Traitement...' : 'Passer au paiement'}
          </Button>
        </div>
      </div>
    </div>
  );
}
