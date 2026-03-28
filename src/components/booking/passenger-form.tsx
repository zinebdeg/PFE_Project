import { useState } from 'react';
import { useCreateBooking } from '../../hooks/use-booking';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { User, Phone, Mail, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface PassengerFormProps {
  journeyId: string;
  searchId: string;
  seats: number[];
}

export default function PassengerForm({ journeyId, searchId, seats }: PassengerFormProps) {
  const navigate = useNavigate();
  const createBookingMutation = useCreateBooking();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) return;

    try {
      const response = await createBookingMutation.mutateAsync({
        journeyId,
        searchId,
        ...formData,
        seats,
      });

      if (response && response.code) {
        navigate({
          to: '/booking/$bookingCode',
          params: { bookingCode: response.code },
        });
      }
    } catch (error) {
      console.error('Booking failed', error);
      alert('Erreur lors de la réservation. Veuillez réessayer.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-border shadow-sm rise-in">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl bg-dark text-white flex items-center justify-center font-bold">3</div>
        <h2 className="text-2xl font-black text-dark tracking-tight">Informations Voyageur</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-gray-body uppercase tracking-widest flex items-center gap-1">
              <User size={12} /> Nom Complet
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Ahmed Alami"
              value={formData.name}
              onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
              className="p-4 border-2 border-gray-border rounded-xl focus:border-primary focus:outline-none transition-colors text-sm font-medium"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-gray-body uppercase tracking-widest flex items-center gap-1">
              <Phone size={12} /> Téléphone
            </label>
            <input
              type="tel"
              required
              placeholder="Ex: 06 12 34 56 78"
              value={formData.phone}
              onChange={(e) => setFormData(f => ({ ...f, phone: e.target.value }))}
              className="p-4 border-2 border-gray-border rounded-xl focus:border-primary focus:outline-none transition-colors text-sm font-medium"
            />
          </div>

          <div className="flex flex-col md:col-span-2 gap-2">
            <label className="text-[10px] font-bold text-gray-body uppercase tracking-widest flex items-center gap-1">
              <Mail size={12} /> Email de réception
            </label>
            <input
              type="email"
              required
              placeholder="Ex: ahmed@example.com"
              value={formData.email}
              onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
              className="p-4 border-2 border-gray-border rounded-xl focus:border-primary focus:outline-none transition-colors text-sm font-medium"
            />
          </div>
        </div>

        <div className="p-6 bg-blue/5 rounded-2xl border border-blue/10 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue/10 text-blue flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-blue">Paiement Sécurisé</span>
            <p className="text-[10px] text-gray-body leading-relaxed mt-1">
              Vos informations sont cryptées et protégées. Pullman du Sud ne stocke pas vos données bancaires.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          disabled={createBookingMutation.isPending}
          className="w-full h-16 bg-primary text-white font-black text-xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {createBookingMutation.isPending ? 'Réservation en cours...' : 'Procéder au paiement'}
          <CreditCard size={20} className="ml-2" />
        </Button>
      </form>
    </div>
  );
}
