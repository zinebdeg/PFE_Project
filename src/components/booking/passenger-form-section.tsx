import { Info, ChevronDown } from 'lucide-react';
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
    <div className="bg-white p-8 rounded-[32px] border border-gray-border shadow-sm mb-8 rise-in">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl bg-[#FF6900] text-white flex items-center justify-center font-bold shrink-0">1</div>
        <h2 className="text-2xl font-black text-dark tracking-tight">Passagers</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-dark">Nom *</label>
          <input
            type="text"
            placeholder="Entrer votre nom"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="h-16 px-6 bg-white border-2 border-gray-border rounded-xl focus:border-[#FF6900] focus:outline-none transition-all placeholder:text-gray-body/40 font-medium"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-dark">Email *</label>
          <input
            type="email"
            placeholder="Entrer votre Email"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            className="h-16 px-6 bg-white border-2 border-gray-border rounded-xl focus:border-[#FF6900] focus:outline-none transition-all placeholder:text-gray-body/40 font-medium"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-dark">Numéro WhatsApp *</label>
        <div className="flex gap-4">
          <div className="h-16 px-4 flex items-center gap-2 bg-white border-2 border-gray-border rounded-xl min-w-[120px] cursor-pointer hover:border-gray-body/30 transition-colors">
            <span className="text-xl">🇲🇦</span>
            <span className="text-sm font-bold text-dark">+212</span>
            <ChevronDown size={16} className="text-gray-body" />
          </div>
          <input
            type="tel"
            placeholder="Ex: 655667788"
            value={data.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className="flex-1 h-16 px-6 bg-white border-2 border-gray-border rounded-xl focus:border-[#FF6900] focus:outline-none transition-all placeholder:text-gray-body/40 font-medium text-left"
          />
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 p-4 bg-gray-light/50 rounded-2xl border border-gray-border/50 text-[11px] text-gray-body leading-relaxed">
        <Info size={14} className="shrink-0 mt-0.5 text-[#FF6900]" />
        <p>Votre numéro WhatsApp est nécessaire pour que nous puissions vous envoyer votre billet de bus.</p>
      </div>
    </div>
  );
}
