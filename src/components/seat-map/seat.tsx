import { type Seat as SeatData } from '../../api/types';
import { cn } from '../../lib/utils';
import { Armchair } from 'lucide-react';

interface SeatProps {
  seat: SeatData;
  isSelected?: boolean;
  onToggle?: (seat: SeatData) => void;
  disabled?: boolean;
}

export default function Seat({ seat, isSelected, onToggle, disabled }: SeatProps) {
  if (seat.type === 'empty') return <div className="w-10 h-10 m-1" />;

  const baseClasses = "w-10 h-10 m-1 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all relative group";
  
  const typeClasses = {
    available: "bg-green/10 border-2 border-green text-green hover:bg-green hover:text-white cursor-pointer",
    selected: "bg-primary border-2 border-primary text-white cursor-default",
    reserved: "bg-red/10 border-2 border-red text-red cursor-not-allowed",
    closed: "bg-gray-light border-2 border-gray-border text-gray-body cursor-not-allowed",
    empty: ""
  };

  const selectedClasses = isSelected ? "bg-primary border-2 border-primary text-white scale-110 shadow-lg" : "";

  return (
    <button
      type="button"
      disabled={disabled || seat.type === 'reserved' || seat.type === 'closed'}
      onClick={() => onToggle?.(seat)}
      className={cn(
        baseClasses, 
        typeClasses[seat.type],
        selectedClasses,
        "active:scale-95"
      )}
    >
      <Armchair size={16} />
      <span className="absolute -top-1 -right-1 bg-white border border-inherit rounded-full w-4 h-4 flex items-center justify-center text-[8px] font-black group-hover:scale-110 transition-transform">
        {seat.seatNumber}
      </span>
    </button>
  );
}
