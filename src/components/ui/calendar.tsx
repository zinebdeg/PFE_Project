import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  addMonths, 
  subMonths, 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addDays,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import { cn } from '../../lib/utils';

interface CalendarProps {
  selectedDate?: Date;
  onSelect: (date: Date) => void;
}

export function Calendar({ selectedDate, onSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 })
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleDaySelect = (day: Date) => {
    onSelect(day);
  };

  const handleQuickSelect = (daysToAdd: number) => {
    onSelect(addDays(new Date(), daysToAdd));
  };

  return (
    <div className="w-[300px] bg-white border border-gray-200 rounded-3xl shadow-2xl p-4 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={prevMonth} 
          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={16} className="text-gray-600" />
        </button>
        <div className="text-[15px] font-semibold text-gray-900 capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: enUS })}
        </div>
        <button 
          onClick={nextMonth} 
          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <ChevronRight size={16} className="text-gray-600" />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
          <div key={day} className="text-center text-[13px] font-medium text-gray-400 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-y-1 gap-x-1 mb-4">
        {daysInMonth.map((day, i) => {
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));

          return (
            <button
              key={i}
              disabled={isPast}
              onClick={() => handleDaySelect(day)}
              className={cn(
                "h-8 w-8 mx-auto flex items-center justify-center rounded-lg text-[13px] font-medium transition-all",
                !isCurrentMonth && "text-gray-300",
                isCurrentMonth && !isSelected && !isPast && "text-gray-700 hover:bg-gray-100",
                isSelected && "bg-[#111827] text-white", // Dark selected state based on screenshot "15"
                isPast && "text-gray-300 cursor-not-allowed opacity-50"
              )}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      {/* Quick Select Buttons */}
      <div className="flex gap-2 border-t border-gray-100 pt-4">
        <button 
          onClick={() => handleQuickSelect(1)}
          className="flex-1 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Demain
        </button>
        <button 
          onClick={() => handleQuickSelect(2)}
          className="flex-1 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Après-demain
        </button>
      </div>
    </div>
  );
}
