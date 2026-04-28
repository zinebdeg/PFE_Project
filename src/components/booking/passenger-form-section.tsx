import { Info, ChevronDown, User } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PassengerFormSectionProps {
  data: {
    name: string;
    email: string;
    phone: string;
  };
  onChange: (field: string, value: string) => void;
}

export default function PassengerFormSection({ data, onChange }: PassengerFormSectionProps) {
  return (
    <div className="mb-8 mt-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded border border-gray-900 flex items-center justify-center shrink-0">
          <User size={18} className="text-gray-900" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Passagers</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-900">Nom *</label>
          <input
            type="text"
            placeholder="Entrer votre nom"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="h-11 px-4 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-gray-400 text-sm"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-900">Email *</label>
          <input
            type="email"
            placeholder="Entrer votre Email"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            className="h-11 px-4 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-gray-400 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-900">Numéro WhatsApp *</label>
        <div className="flex items-center w-full max-w-sm h-11 bg-white border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
          <div className="flex items-center gap-1.5 px-3 bg-white cursor-pointer hover:bg-gray-50 h-full border-r border-gray-200">
            <span className="text-base leading-none">🇲🇦</span>
            <span className="text-sm font-medium text-gray-700">+212</span>
            <ChevronDown size={14} className="text-gray-500" />
          </div>
          <input
            type="tel"
            placeholder="Ex: 655667788"
            value={data.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className="flex-1 h-full px-4 border-none focus:outline-none placeholder:text-gray-400 text-sm"
          />
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 text-sm text-gray-500">
        <Info size={16} className="shrink-0 mt-0.5 text-gray-400" />
        <p>Votre numéro WhatsApp est nécessaire pour que nous puissions vous envoyer votre billet de bus.</p>
      </div>

      <hr className="my-8 border-gray-100" />
    </div>
  );
}
