import type { SeatMapResponse, Seat as SeatData } from '../../api/types';
import Seat from './seat';
import { useState, useEffect } from 'react';
import { AlertCircle, Square } from 'lucide-react';

interface SeatMapProps {
  data: SeatMapResponse;
  onSelectionChange: (selectedSeats: number[]) => void;
  maxSeats: number;
}

export default function SeatMap({ data, onSelectionChange, maxSeats }: SeatMapProps) {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  useEffect(() => {
    // Initial selection from API if any
    const initial = data.selectedSeats.map(s => s.seatNumber);
    setSelectedSeats(initial);
  }, [data]);

  const toggleSeat = (seat: SeatData) => {
    if (seat.type !== 'available' && seat.type !== 'selected') return;
    
    setSelectedSeats(prev => {
      let next;
      if (prev.includes(seat.seatNumber)) {
        next = prev.filter(s => s !== seat.seatNumber);
      } else {
        if (prev.length >= maxSeats) return prev;
        next = [...prev, seat.seatNumber];
      }
      onSelectionChange(next);
      return next;
    });
  };

  return (
    <div className="flex flex-col items-center gap-8 py-10 bg-gray-light/30 rounded-3xl border-2 border-gray-border overflow-hidden rise-in">
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 px-4">
        <div className="flex items-center gap-2">
          <Square size={16} className="text-green fill-green/10" />
          <span className="text-xs font-bold text-gray-body uppercase">Libre</span>
        </div>
        <div className="flex items-center gap-2">
          <Square size={16} className="text-primary fill-primary" />
          <span className="text-xs font-bold text-gray-body uppercase">Sélectionné</span>
        </div>
        <div className="flex items-center gap-2">
          <Square size={16} className="text-red fill-red/10" />
          <span className="text-xs font-bold text-gray-body uppercase">Occupé</span>
        </div>
        <div className="flex items-center gap-2">
          <Square size={16} className="text-gray-border fill-gray-light" />
          <span className="text-xs font-bold text-gray-body uppercase">Fermé</span>
        </div>
      </div>

      <div className="relative p-6 bg-white rounded-3xl shadow-2xl border-4 border-gray-border flex flex-col items-center">
        {/* Steering Wheel (Bus front indicator) */}
        <div className="w-full flex justify-end mb-10 px-4">
          <div className="w-10 h-10 rounded-full border-4 border-gray-border flex items-center justify-center text-gray-body">
            <div className="w-6 h-1 bg-gray-border rotate-45 rounded-full" />
            <div className="w-6 h-1 bg-gray-border -rotate-45 absolute rounded-full" />
          </div>
        </div>

        {/* The Grid */}
        <div className="flex flex-col gap-2">
          {data.seatMap.map((row, i) => (
            <div key={i} className="flex gap-2">
              {row.map((seat, j) => (
                <Seat 
                  key={seat.index}
                  seat={seat}
                  isSelected={selectedSeats.includes(seat.seatNumber)}
                  onToggle={toggleSeat}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {selectedSeats.length === 0 && (
        <div className="flex items-center gap-2 text-primary font-bold animate-pulse text-sm">
          <AlertCircle size={16} />
          Veuillez choisir votre siège
        </div>
      )}
    </div>
  );
}
