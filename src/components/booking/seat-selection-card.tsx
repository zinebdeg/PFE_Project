import { ChevronRight, Armchair } from 'lucide-react';
import { SeatModel } from './seat-map-modal';
import { cn } from '../../lib/utils';

interface SeatSelectionCardProps {
  selectedSeat: string;
  onClick: () => void;
  fromCity?: string;
  toCity?: string;
}

export default function SeatSelectionCard({ selectedSeat, onClick, fromCity, toCity }: SeatSelectionCardProps) {
  const seats = selectedSeat ? selectedSeat.split(',') : [];
  
  return (
    <div className="mb-6">
      <div 
        onClick={onClick}
        className="bg-white p-3 pr-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-gray-300 transition-colors"
      >
        {seats.length > 0 ? (
          <div className="flex flex-col gap-3 p-2">
            <span className="text-sm font-semibold text-gray-900">Vos sièges sélectionnés</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                <Armchair size={14} className="text-white" />
              </div>
              <span className="text-sm text-gray-600">Siège {seats.join(', ')}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <div className="w-[88px] h-[56px] overflow-hidden rounded-lg flex items-center justify-center opacity-90">
               <div className="grid grid-cols-2 gap-x-2 gap-y-1 transform -translate-y-2">
                  <SeatModel type="closed" size={28} />
                  <SeatModel type="closed" size={28} />
                  <SeatModel type="available" size={28} />
                  <SeatModel type="closed" size={28} />
                  <SeatModel type="closed" size={28} />
                  <SeatModel type="closed" size={28} />
               </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-semibold text-blue-700">Choisir mon siège</span>
              <span className="text-[15px] font-medium text-gray-900">{fromCity || 'Tanger'} &rarr; {toCity || 'Rabat'}</span>
            </div>
          </div>
        )}
        <ChevronRight size={20} className="text-gray-400" />
      </div>
    </div>
  );
}
