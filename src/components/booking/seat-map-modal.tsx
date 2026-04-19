import { X, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { useSeatMap } from '../../hooks/use-journeys';
import { Skeleton } from '../ui/skeleton';
import { useState, useEffect, useMemo } from 'react';
import type { Seat } from '../../api/types';
import { cn } from '../../lib/utils';

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
  initialSelectedSeats?: string[]; // These will be seat numbers as strings
}

const Wheel = () => (
  <svg
    width="55"
    height="56"
    viewBox="0 0 30 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.2542 20.0002H14.7458C14.7167 19.9968 14.6875 19.9918 14.6583 19.9902C14.0649 19.9711 13.4744 19.8983 12.8942 19.7727C10.5909 19.2719 8.53792 17.9754 7.09583 16.111C5.87364 14.5393 5.15136 12.6369 5.0225 10.6502L5 10.3427V9.65766C5.00417 9.62266 5.01083 9.58766 5.01167 9.55182C5.06708 8.2513 5.37918 6.97458 5.93 5.79516C6.49721 4.57667 7.3041 3.48495 8.3025 2.58516C10.0775 0.972292 12.3756 0.0551456 14.7733 0.00265801C15.5625 -0.0156753 16.3425 0.0609914 17.115 0.227658C18.1317 0.448491 19.0892 0.819325 19.9875 1.34016C21.1484 2.01012 22.1627 2.9068 22.97 3.97682C23.7841 5.04624 24.3719 6.27029 24.6975 7.57432C24.8458 8.16766 24.9408 8.76932 24.9758 9.38099C24.9825 9.50266 24.9925 9.62432 25 9.74682V10.2543C24.9967 10.2793 24.9908 10.3043 24.99 10.3285C24.9504 11.6298 24.653 12.9104 24.115 14.096C23.7073 14.998 23.1681 15.8346 22.515 16.5785C21.1186 18.1735 19.2531 19.2855 17.1858 19.7552C16.6725 19.871 16.1525 19.9468 15.6258 19.976C15.5017 19.9827 15.3783 19.9918 15.2542 20.0002ZM22.5867 8.82016C22.1475 5.50682 19.1883 2.31349 15.0033 2.31099C10.82 2.30849 7.85083 5.49682 7.41167 8.81849H7.48667C8.02 8.78932 8.55167 8.74182 9.08 8.65599C9.75917 8.54682 10.425 8.38432 11.0617 8.12349C11.5825 7.91099 12.0942 7.67349 12.6075 7.44349C13.2908 7.13682 14.0017 6.94932 14.7533 6.92682C15.2988 6.90391 15.8447 6.95635 16.3758 7.08266C16.8633 7.20432 17.3225 7.40099 17.7758 7.61099C18.2508 7.83099 18.7258 8.04932 19.22 8.22432C20.22 8.57766 21.255 8.74099 22.3083 8.80766C22.4 8.81266 22.4933 8.81599 22.5867 8.82016ZM13.4617 17.546V17.4677C13.4617 16.2702 13.4617 15.0735 13.46 13.876C13.46 13.7585 13.4508 13.6393 13.4308 13.5235C13.3492 13.0516 13.1236 12.6164 12.785 12.2777C12.315 11.7927 11.7483 11.531 11.0625 11.5343C9.88417 11.5402 8.70667 11.536 7.52917 11.536H7.45417C7.79444 13.2514 8.71383 14.7977 10.0583 15.916C11.0381 16.7358 12.2089 17.2963 13.4617 17.546ZM16.5358 17.5468C17.9842 17.2468 19.2442 16.5993 20.3092 15.5843C21.4758 14.4727 22.215 13.121 22.5467 11.5385L22.4825 11.536H18.8475C18.65 11.536 18.4558 11.5677 18.2683 11.6293C17.7125 11.8127 17.2783 12.1585 16.945 12.6343C16.6702 13.0209 16.526 13.4851 16.5333 13.9593C16.54 15.126 16.5358 16.2935 16.5358 17.461V17.5468ZM15.0417 11.8502C16.0542 11.821 16.8783 10.9477 16.8458 9.95432C16.8133 8.93516 15.9333 8.10849 14.9375 8.14932C13.9283 8.19099 13.1042 9.07266 13.1458 10.0677C13.1883 11.0602 14.0692 11.8893 15.0417 11.8502Z"
      fill="#E0E0E0"
    />
    <line y1="30.5" x2="30" y2="30.5" stroke="#E0E0E0" />
  </svg>
);

const colors = [
  {
    type: "selected",
    color1: "#FF6900",
    color2: "#FD9023",
    color3: "#FF6900",
    border: "#FFFFFF",
  },
  {
    type: "available",
    color1: "#8DC63F",
    color2: "#39B54A",
    color3: "#0B9444",
    border: "#FFFFFF",
  },
  {
    type: "reserved",
    color1: "#59C3E0",
    color2: "#3D9EB9",
    color3: "#137F9C",
    border: "#FFFFFF",
  },
  {
    type: "empty",
    color1: "#DFDFDF",
    color2: "#DFDFDF",
    color3: "#DFDFDF",
    border: "#B1B1B1",
  },
  {
    type: "closed",
    color1: "#DFDFDF",
    color2: "#DFDFDF",
    color3: "#DFDFDF",
    border: "#B1B1B1",
  },
];

export const SeatModel = ({
  type,
  className,
  number,
  scale,
  size = 50,
}: {
  type: "selected" | "available" | "reserved" | "empty" | "space" | "closed";
  className?: string;
  number?: number;
  scale?: number;
  size?: number;
}) => {
  if (!type) return null;

  if (type === "space") return <div className={cn("size-[50px]", className)} />;

  const selectedColor = colors.find((c) => c.type === type) ?? colors[0];
  const isClosed = type === "closed" || type === "empty";
  const isReserved = type === "reserved";

  return (
    <svg
      className={cn(className, isClosed && "opacity-65")}
      width={scale ? size * scale : size}
      height={scale ? size * scale : size}
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="4.35"
        y="0.35"
        width="29.3"
        height="34.3"
        rx="5.65"
        fill={selectedColor?.color1}
        stroke={selectedColor?.border}
        strokeWidth="0.7"
      />
      <rect
        x="37.65"
        y="9.35"
        width="23.3"
        height="7.3"
        rx="3.65"
        transform="rotate(90 37.65 9.35)"
        fill={selectedColor?.color2}
        stroke={selectedColor?.border}
        strokeWidth="0.7"
      />
      <rect
        x="7.65"
        y="9.35"
        width="23.3"
        height="7.3"
        rx="3.65"
        transform="rotate(90 7.65 9.35)"
        fill={selectedColor?.color2}
        stroke={selectedColor?.border}
        strokeWidth="0.7"
      />
      <rect
        x="3.35"
        y="29.35"
        width="31.3"
        height="8.3"
        rx="3.65"
        fill={selectedColor?.color3}
        stroke={selectedColor?.border}
        strokeWidth="0.7"
      />

      {isClosed && (
        <path
          d="M23.5 13L15 21.5M15 13L23.5 21.5"
          stroke="#B0B0B0"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {number && !isClosed && (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={11}
          fontWeight={600}
          fill="white"
        >
          {number}
        </text>
      )}

      {isReserved && (
        <>
          <rect x="0" y="16" width="100%" height="11" fill="#FFD700"></rect>
          <text
            x="3"
            y="21"
            width="100%"
            height="13"
            alignmentBaseline="central"
            fontSize="6"
            fontWeight="bold"
            fill="#000000"
          >
            RESERVED
          </text>
        </>
      )}
    </svg>
  );
};

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
  const { data: seatData, isLoading, error } = useSeatMap(journeyId, searchId);
  const [selectedIndices, setSelectedIndices] = useState<string[]>([]);

  const seatMapData = useMemo(() => {
    if (!seatData) return null;
    
    // Helper to find the object containing seatMap in any structure
    const findSeatSource = (obj: any): any => {
      if (!obj || typeof obj !== 'object') return null;
      if (Array.isArray(obj.seatMap)) return obj;
      
      if (Array.isArray(obj)) {
        for (const item of obj) {
          const found = findSeatSource(item);
          if (found) return found;
        }
      }
      
      if (obj.data) return findSeatSource(obj.data);
      if (obj.result) return findSeatSource(obj.result);
      
      return null;
    };

    const source = findSeatSource(seatData);
    if (!source) return null;

    return {
      seatMap: source.seatMap as Seat[][] | null,
      preSelectedSeats: source.selectedSeats as { seatNumber: number; index: string }[] | null,
    };
  }, [seatData]);

  const seatMap = seatMapData?.seatMap;
  const preSelectedSeats = seatMapData?.preSelectedSeats;

  // Sync internal selection indices with initial numbers from URL or API preselected
  useEffect(() => {
    if (!seatMap) return;

    const flattenedSeats = seatMap.flat();

    // 1. Priority: Preselected from API (only if first time loading and nothing selected)
    if (preSelectedSeats && preSelectedSeats.length > 0 && selectedIndices.length === 0 && initialSelectedSeats.length === 0) {
      const indices = preSelectedSeats.slice(0, nbrOfPassengers).map(s => s.index);
      setSelectedIndices(indices);
      return;
    }

    // 2. Map initial numbers from URL to indices
    if (initialSelectedSeats.length > 0 && selectedIndices.length === 0) {
      const indices = initialSelectedSeats.map(num => {
        const seat = flattenedSeats.find(s => s.seatNumber.toString() === num);
        return seat?.index;
      }).filter(Boolean) as string[];
      setSelectedIndices(indices);
    }
  }, [seatMap, preSelectedSeats, nbrOfPassengers, initialSelectedSeats]);

  if (!isOpen) return null;

  const handleSeatClick = (seat: Seat) => {
    setSelectedIndices(prev => {
      if (prev.includes(seat.index)) {
        return prev.filter(s => s !== seat.index);
      }
      if (prev.length < nbrOfPassengers) {
        return [...prev, seat.index];
      }
      if (nbrOfPassengers === 1) {
        return [seat.index];
      }
      return prev;
    });
  };

  const handleConfirm = () => {
    if (!seatMap) return;
    const flattenedSeats = seatMap.flat();
    const numbers = selectedIndices.map(idx => {
      const seat = flattenedSeats.find(s => s.index === idx);
      return seat?.seatNumber.toString() || '';
    }).filter(Boolean);
    onConfirm(numbers);
  };

  const isComplete = selectedIndices.length === nbrOfPassengers;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-[420px] rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">

        {/* Header */}
        <div className="px-6 pt-6 pb-2 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-dark tracking-tight">Réservation de siège</h2>
            <p className="text-sm font-medium text-gray-500 mt-0.5">
              {companyName} - {busName}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-body hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Legend */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#DFDFDF] border border-[#B1B1B1]" />
            <span className="text-[11px] font-bold text-gray-500">Siège occupée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#8DC63F]" />
            <span className="text-[11px] font-bold text-gray-500">Siège disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#FF6900]" />
            <span className="text-[11px] font-bold text-gray-500">Votre siège sélectionné</span>
          </div>
        </div>

        {/* Bus Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6 bg-gray-50/30">
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-[32px] border-[3px] border-gray-300 bg-white pb-8 shadow-inner min-h-[400px]">

            <svg
              width="360"
              className="absolute top-0 z-10"
              height="57"
              viewBox="0 0 360 57"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 9.53674e-07C26 5.03328e-07 13.4315 9.53674e-07 30 9.53674e-07H330C346.569 9.53674e-07 332 4.76837e-07 360 0V57C360 57 281 30 179.5 30C78 30 0 57 0 57V9.53674e-07Z"
                fill="#ECECEC"
              />
            </svg>

            <div className="mt-10 flex w-full items-center justify-between p-2 pl-4">
              <Wheel />
            </div>

            <div className="flex flex-col gap-y-2 p-2 w-fit">
              {isLoading ? (
                <div className="flex flex-col gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="flex gap-2">
                      <Skeleton className="h-[50px] w-[50px] rounded-lg" />
                      <Skeleton className="h-[50px] w-[50px] rounded-lg" />
                      <div className="w-[50px]" />
                      <Skeleton className="h-[50px] w-[50px] rounded-lg" />
                      <Skeleton className="h-[50px] w-[50px] rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="py-20 text-center px-4">
                  <Info size={40} className="text-red-400 mx-auto mb-4" />
                  <p className="text-sm font-bold text-gray-body">Erreur lors du chargement des sièges.</p>
                </div>
              ) : !seatMap || seatMap.length === 0 ? (
                <div className="py-20 text-center px-4">
                  <Info size={40} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-sm font-bold text-gray-400">Aucun siège disponible pour ce trajet.</p>
                </div>
              ) : (
                seatMap.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex flex-row items-center gap-x-2">
                    {row.map((seat, seatIndex) => {
                      const isUserSelected = selectedIndices.includes(seat.index);
                      const type = isUserSelected ? 'selected' : seat.type;

                      return seat.type === "space" ? (
                        <div key={seatIndex} className="size-[50px]" />
                      ) : (
                        <button
                          type="button"
                          key={seat.index || seatIndex}
                          disabled={seat.type !== "available" && seat.type !== "selected" && !isUserSelected}
                          onClick={() => handleSeatClick(seat)}
                          className="flex flex-col items-center justify-end disabled:cursor-not-allowed transition-transform active:scale-95"
                        >
                          <SeatModel type={type as any} number={seat.seatNumber} />
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-gray-100">
          <Button
            onClick={handleConfirm}
            disabled={!isComplete}
            className={cn(
              "w-full h-14 font-bold text-lg rounded-2xl transition-all",
              isComplete
                ? "bg-[#FF6900] hover:bg-[#FF8000] text-white shadow-lg shadow-orange-500/20"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            )}
          >
            Confirmer
          </Button>
        </div>
      </div>
    </div>
  );
}
