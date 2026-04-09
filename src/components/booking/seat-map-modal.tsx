import { X, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { useSeatMap } from '../../hooks/use-journeys';
import { Skeleton } from '../ui/skeleton';
import { useState } from 'react';

interface SeatMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (seats: string[]) => void;
  journeyId: number;
  searchId: string;
  nbrOfPassengers: number;
  companyName: string;
  busName: string;
  fromCity: string;
  toCity: string;
  initialSelectedSeats?: string[];
}

export default function SeatMapModal({
  isOpen,
  onClose,
  onConfirm,
  journeyId,
  searchId,
  nbrOfPassengers,
  companyName,
  busName,
  fromCity,
  toCity,
  initialSelectedSeats = []
}: SeatMapModalProps) {
  const { data: seatData, isLoading } = useSeatMap(journeyId, searchId);
  const [selectedSeats, setSelectedSeats] = useState<string[]>(initialSelectedSeats);

  // DEBUG: Log the API response
  if (seatData) {
    console.log("seatMap response:", seatData);
  }

  if (!isOpen) return null;

  const handleSeatClick = (seatIndex: string, type: string) => {
    if (type !== 'available' && !selectedSeats.includes(seatIndex)) return;

    setSelectedSeats(prev => {
      if (prev.includes(seatIndex)) {
        return prev.filter(s => s !== seatIndex);
      }
      if (prev.length < nbrOfPassengers) {
        return [...prev, seatIndex];
      }
      if (nbrOfPassengers === 1) {
        return [seatIndex];
      }
      return prev;
    });
  };

  const isComplete = selectedSeats.length === nbrOfPassengers;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[500px] rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 pb-4 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black text-dark tracking-tight">Réservation de siège</h2>
            <div className="flex flex-col mt-1">
              <p className="text-xs font-black text-primary uppercase tracking-wider">
                {fromCity} <span className="text-gray-body mx-1">→</span> {toCity}
              </p>
              <p className="text-[11px] font-bold text-gray-body opacity-70">
                {companyName} • {busName}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-light flex items-center justify-center text-gray-body hover:bg-gray-border transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Legend */}
        <div className="px-8 pb-6 flex flex-wrap gap-4 border-b border-gray-border/50">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-[4px] bg-gray-border" />
            <span className="text-[11px] font-bold text-gray-body text-nowrap">Siège occupé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-[4px] bg-green" />
            <span className="text-[11px] font-bold text-gray-body text-nowrap">Siège disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-[4px] bg-primary" />
            <span className="text-[11px] font-bold text-gray-body text-nowrap">Votre sélection</span>
          </div>
        </div>

        {/* Seat Map Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gray-light/5">
          {isLoading ? (
            <div className="flex flex-col gap-3 items-center">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="w-10" />
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-10 w-10 rounded-lg" />
                </div>
              ))}
            </div>
          ) : seatData?.seatMap && seatData.seatMap.length > 0 ? (
            <div className="flex flex-col items-center gap-4">
              {seatData.seatMap.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-3">
                  {row.map((seat, colIndex) => {
                    const isSelected = selectedSeats.includes(seat.index);
                    const isOccupied = seat.type === 'reserved' || seat.type === 'closed';
                    const isAvailable = seat.type === 'available';
                    const isEmpty = seat.type === 'empty';

                    if (isEmpty) {
                      return <div key={`${rowIndex}-${colIndex}`} className="w-10 h-10" />;
                    }

                    return (
                      <button
                        key={seat.index}
                        disabled={!isAvailable && !isSelected}
                        onClick={() => handleSeatClick(seat.index, seat.type)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-[11px] font-black transition-all shadow-sm ${
                          isSelected 
                            ? "bg-primary text-white shadow-lg shadow-primary/30 -translate-y-0.5" 
                            : isAvailable 
                            ? "bg-green text-white hover:scale-105" 
                            : "bg-gray-border text-gray-body/40 cursor-not-allowed"
                        }`}
                      >
                        {isOccupied ? 'X' : seat.seatNumber}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-sm font-bold text-gray-body">Aucun siège disponible pour ce trajet.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 pt-4 bg-white border-t border-gray-border/50">
          <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-gray-light/30 border border-gray-border/50">
            <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${isComplete ? 'bg-green/10 text-green' : 'bg-primary/10 text-primary'}`}>
              <Info size={18} />
            </div>
            <p className="text-xs font-bold text-dark leading-tight">
              {isComplete 
                ? `Vous avez sélectionné vos ${nbrOfPassengers} sièges.`
                : `Veuillez sélectionner encore ${nbrOfPassengers - selectedSeats.length} siège(s).`
              }
            </p>
          </div>
          
          <Button 
            onClick={() => onConfirm(selectedSeats)}
            disabled={!isComplete}
            className={`w-full h-14 font-black rounded-2xl transition-all ${
              isComplete ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-gray-border text-gray-body'
            }`}
          >
            Confirmer
          </Button>
        </div>
      </div>
    </div>
  );
}
