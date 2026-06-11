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
  endOfWeek,
  startOfDay,
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import { cn } from '../../lib/utils';

/**
 * Props for the Calendar component.
 * - `selectedDate` – the currently selected date (optional).
 * - `onSelect` – callback when a day is clicked.
 * - `minDate` – optional earliest selectable date. All dates before this are disabled
 *   and displayed with a line‑through style, mirroring the behaviour on markoub.ma.
 */
interface CalendarProps {
  selectedDate?: Date;
  onSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

/**
 * Minimalist calendar UI.
 * Past dates and dates earlier than `minDate` are disabled and rendered with a line‑through.
 */
export function Calendar({ selectedDate, onSelect, minDate, maxDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 }),
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
          type="button"
          onClick={prevMonth}
          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={16} className="text-gray-600" />
        </button>
        <div className="text-[15px] font-semibold text-gray-900 capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: enUS })}
        </div>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <ChevronRight size={16} className="text-gray-600" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
          <div key={day} className="text-center text-[13px] font-medium text-gray-400 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1 gap-x-1 mb-4">
        {daysInMonth.map((day, i) => {
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const today = startOfDay(new Date());
          const isPast = day < today;
          const isDisabled = isPast || 
                             (minDate && day < startOfDay(minDate)) || 
                             (maxDate && day > startOfDay(maxDate));
          return (
            <button
              key={i}
              type="button"
              disabled={isDisabled}
              onClick={() => handleDaySelect(day)}
              className={cn(
                "h-8 w-8 mx-auto flex items-center justify-center rounded-lg text-[13px] font-medium transition-all",
                !isCurrentMonth && "text-gray-300",
                isCurrentMonth && !isSelected && !isDisabled && "text-gray-700 hover:bg-gray-100",
                isSelected && "bg-[#111827] text-white",
                isDisabled && "text-gray-300 cursor-not-allowed opacity-50 line-through"
              )}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      {/* Quick select */}
      <div className="flex gap-2 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => handleQuickSelect(1)}
          className="flex-1 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Demain
        </button>
        <button
          type="button"
          onClick={() => handleQuickSelect(2)}
          className="flex-1 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Après-demain
        </button>
      </div>
    </div>
  );
}
