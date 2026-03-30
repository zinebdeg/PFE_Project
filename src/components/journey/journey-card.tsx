import type { Journey } from '../../api/types';
import { Button } from '../ui/button';
import { Clock, User, ChevronRight, Wifi, Snowflake, Briefcase, Frame } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function JourneyCard({ journey, searchId }: { journey: Journey; searchId: string }) {
  return (
    <div className="bg-white border text-left border-gray-200 rounded-[20px] p-6 mb-4 flex flex-col gap-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Top Row: Company & Price */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={journey.company.logo} alt={journey.company.name} className="h-6 object-contain" />
          <span className="text-sm font-bold text-gray-900">{journey.company.name} - بولمان الجنوب</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-sm text-gray-500 font-medium">
            Prix / 1 <User size={14} />
          </div>
          <Link 
            to="/journey/$journeyId"
            params={{ journeyId: journey.id.toString() }}
            search={{ searchId }}
            className="no-underline"
          >
            <Button className="h-9 px-4 text-sm font-bold bg-[#3b82f6] hover:bg-blue-600 text-white rounded-full flex items-center gap-1 shadow-sm transition-all hover:scale-105">
              {journey.price.total} Dhs
              <ChevronRight size={16} />
            </Button>
          </Link>
        </div>
      </div>

      {/* Middle Row: Journey Timeline */}
      <div className="flex items-center justify-between mt-2">
        {/* Departure */}
        <div className="flex flex-col min-w-[100px]">
          <span className="text-[15px] font-bold text-gray-900">{journey.from.cityName}</span>
          <span className="text-[14px] text-gray-600 mt-0.5">{journey.from.time.slice(0, 5)}</span>
        </div>

        {/* Dotted Line connecting the cities */}
        <div className="flex-1 mx-6 flex items-center text-gray-300">
          <div className="h-[1px] flex-1 border-t border-dashed border-gray-300"></div>
          <span className="mx-2 text-gray-300">→</span>
        </div>

        {/* Arrival */}
        <div className="flex flex-col text-right min-w-[100px]">
          <span className="text-[15px] font-bold text-gray-900">{journey.to.cityName}</span>
          <span className="text-[14px] text-gray-600 mt-0.5">{journey.to.time.slice(0, 5)}</span>
        </div>
      </div>

      {/* Bottom Row: Amenities & Duration */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-4 text-gray-500">
          <Wifi size={16} />
          <Snowflake size={16} />
          <Briefcase size={16} />
          <Frame size={16} /> {/* Placeholder for luggage icon */}
        </div>
        
        <div className="flex items-center gap-1.5 text-sm font-bold text-gray-500">
          <Clock size={16} />
          {journey.duration}
        </div>
      </div>
    </div>
  );
}
