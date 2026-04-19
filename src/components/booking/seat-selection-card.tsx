import { ChevronRight, Armchair } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SeatSelectionCardProps {
  selectedSeat: string;
  onClick: () => void;
  fromCity?: string;
  toCity?: string;
}

export default function SeatSelectionCard({ selectedSeat, onClick, fromCity, toCity }: SeatSelectionCardProps) {
  const seats = selectedSeat ? selectedSeat.split(',') : [];
  const hasSelection = seats.length > 0;
  
  return (
    <div className="bg-white p-8 rounded-[32px] border border-gray-border shadow-sm mb-6 rise-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#FF6900] text-white flex items-center justify-center font-bold shrink-0">2</div>
        <h2 className="text-2xl font-black text-dark tracking-tight">Réservation de siège</h2>
      </div>

      <div 
        onClick={onClick}
        className={cn(
          "p-6 rounded-[24px] border-2 transition-all cursor-pointer group flex items-center justify-between",
          hasSelection 
            ? "border-[#FF6900]/20 bg-[#FF6900]/5 shadow-sm" 
            : "border-gray-border bg-white hover:border-[#FF6900]/50"
        )}
      >
        <div className="flex items-center gap-5">
          {/* Small Preview Box similar to Markoub */}
          <div className="w-20 h-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center relative overflow-hidden shrink-0">
             <div className="absolute inset-0 opacity-10 flex flex-col gap-1 p-1">
               <div className="flex gap-1 justify-center">
                 <div className="w-2 h-2 rounded-sm bg-gray-400" />
                 <div className="w-2 h-2 rounded-sm bg-gray-400" />
                 <div className="w-2 h-2 rounded-sm" />
                 <div className="w-2 h-2 rounded-sm bg-gray-400" />
               </div>
               <div className="flex gap-1 justify-center">
                 <div className="w-2 h-2 rounded-sm bg-gray-400" />
                 <div className="w-2 h-2 rounded-sm bg-[#FF6900]" />
                 <div className="w-2 h-2 rounded-sm" />
                 <div className="w-2 h-2 rounded-sm bg-gray-400" />
               </div>
             </div>
             <Armchair size={24} className={cn("z-10", hasSelection ? "text-[#FF6900]" : "text-gray-body/40")} />
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-black text-gray-body/50 uppercase tracking-widest leading-none mb-1">
              {hasSelection ? 'Siège sélectionné' : 'Emplacement'}
            </span>
            <span className="text-lg font-black text-dark leading-tight">
              {hasSelection ? `Siège ${seats.join(', ')}` : 'Trajet Direct'}
            </span>
            <span className="text-[11px] font-bold text-gray-body">
              {fromCity} → {toCity}
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-white border border-gray-border flex items-center justify-center group-hover:border-[#FF6900] transition-colors shadow-sm">
          <ChevronRight size={20} className="text-gray-body group-hover:text-[#FF6900] transition-colors" />
        </div>
      </div>
    </div>
  );
}
