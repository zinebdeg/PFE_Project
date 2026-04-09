import { ChevronRight } from 'lucide-react';

interface SeatSelectionCardProps {
  selectedSeat: string;
  onClick: () => void;
}

export default function SeatSelectionCard({ selectedSeat, onClick }: SeatSelectionCardProps) {
  const seats = selectedSeat ? selectedSeat.split(',') : [];
  
  return (
    <div 
      onClick={onClick}
      className={`p-6 rounded-[24px] border ${selectedSeat ? 'border-orange bg-orange/5' : 'border-gray-border bg-white'} flex items-center justify-between cursor-pointer hover:border-orange transition-all group shadow-sm mb-6`}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-black text-dark tracking-tight">Choisir mon siège</h3>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center transition-colors ${selectedSeat ? 'bg-orange text-white' : 'bg-gray-light text-gray-body'}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 11V7a5 5 0 0110 0v4" />
              <rect x="5" y="11" width="14" height="10" rx="2" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-body uppercase tracking-wider leading-none mb-1">Position</span>
            <span className="text-sm font-black text-dark">
              {seats.length > 0 ? `Siège ${seats.join(', ')}` : 'Aucun siège sélectionné'}
            </span>
          </div>
        </div>
      </div>
      <div className="w-10 h-10 rounded-full bg-white border border-gray-border flex items-center justify-center group-hover:border-orange transition-colors">
        <ChevronRight size={20} className="text-gray-body group-hover:text-orange transition-colors" />
      </div>
    </div>
  );
}
