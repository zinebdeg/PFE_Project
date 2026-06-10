import { ChevronRight, Armchair } from 'lucide-react';
import { SeatModel } from './seat-map-modal';
import { cn } from '../../lib/utils';

interface SeatSelectionCardProps {
  selectedSeat: string;
  onClick: () => void;
  fromCity?: string;
  toCity?: string;
  label?: string;
}

export default function SeatSelectionCard({ selectedSeat, onClick, fromCity, toCity, label }: SeatSelectionCardProps) {
  const seats = selectedSeat ? selectedSeat.split(',') : [];
  
  return (
    <div 
      onClick={onClick}
      className="bg-white p-4 pr-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-gray-300 transition-all hover:shadow-md group"
    >
      {seats.length > 0 ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label || 'Sélection'}</span>
            <span className="text-sm font-semibold text-gray-900 mt-0.5">Sièges sélectionnés</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
              <Armchair size={14} className="text-white" />
            </div>
            <span className="text-sm text-gray-600 font-medium">Siège {seats.join(', ')}</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-5">
          <div className="w-[88px] h-[56px] overflow-hidden rounded-lg flex items-center justify-center bg-gray-50 group-hover:bg-blue-50 transition-colors">
             <div className="grid grid-cols-2 gap-x-2 gap-y-1 transform -translate-y-2 opacity-40 group-hover:opacity-100 transition-opacity">
                <SeatModel type="closed" size={28} />
                <SeatModel type="closed" size={28} />
                <SeatModel type="available" size={28} />
                <SeatModel type="closed" size={28} />
                <SeatModel type="closed" size={28} />
                <SeatModel type="closed" size={28} />
             </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider">{label || 'Choisir mon siège'}</span>
            </div>
            <span className="text-[15px] font-bold text-dark">{fromCity} → {toCity}</span>
          </div>
        </div>
      )}
      <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
    </div>
  );
}
