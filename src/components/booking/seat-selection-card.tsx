import { ChevronRight } from 'lucide-react';

interface SeatSelectionCardProps {
  selectedSeat: string;
  onClick: () => void;
}

export default function SeatSelectionCard({ selectedSeat, onClick }: SeatSelectionCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-6 rounded-[24px] border border-gray-border flex items-center justify-between cursor-pointer hover:border-primary transition-all group shadow-sm mb-6"
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-bold text-dark">Choisir mon siège</h3>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <div className="w-4 h-4 rounded-[2px] border-2 border-primary" />
          </div>
          <span className="text-sm font-bold text-gray-body">
            Siège <span className="text-dark">{selectedSeat || '--'}</span>
          </span>
        </div>
      </div>
      <ChevronRight size={20} className="text-gray-body group-hover:text-primary transition-colors" />
    </div>
  );
}
