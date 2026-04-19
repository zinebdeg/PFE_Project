import { createFileRoute } from '@tanstack/react-router';
import { useBooking, useCancelBooking } from '../../hooks/use-booking';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Download, 
  Printer, 
  XCircle,
  Bus,
  Ticket,
  User,
  Mail,
  Phone,
  AlertCircle,
  CreditCard
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/booking/$bookingCode')({
  component: BookingConfirmation,
});

function BookingConfirmation() {
  const { bookingCode } = Route.useParams();
  const { data: booking, isLoading, error } = useBooking(bookingCode);
  const cancelBookingMutation = useCancelBooking();
  
  const handleCancel = async () => {
    if (!confirm('Voulez-vous vraiment annuler cette réservation ?')) return;
    try {
      await cancelBookingMutation.mutateAsync(bookingCode);
    } catch (e) {
      alert('Erreur lors de l\'annulation');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-20">
        <div className="container-app max-w-4xl mx-auto space-y-6">
          <Skeleton className="w-full h-64 rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="w-full h-48 rounded-3xl" />
            <Skeleton className="w-full h-48 rounded-3xl" />
          </div>
          <Skeleton className="w-full h-96 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[32px] border border-gray-border text-center shadow-xl max-w-lg w-full">
          <AlertCircle size={64} className="text-red mx-auto mb-6" />
          <h1 className="text-2xl font-black text-dark mb-4 tracking-tight">Réservation Introuvable</h1>
          <p className="text-gray-body mb-8">Nous n'avons pas pu trouver la réservation avec le code <span className="font-bold">{bookingCode}</span>.</p>
          <Link to="/">
            <Button className="bg-primary text-white font-black px-8 h-12 rounded-xl">Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = booking.status === 'paid' || booking.status === 'confirmed';
  const isCancelled = booking.status === 'cancelled';
  const firstRoute = booking.routes[0];

  return (
    <main className="min-h-screen pt-12 pb-24 bg-[#F8FAFC]">
      <div className="container-app max-w-4xl mx-auto px-4">
        
        {/* Top Status Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <div className={cn(
                 "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                 isPaid ? "bg-green/10 text-green" : isCancelled ? "bg-red/10 text-red" : "bg-primary/10 text-primary"
               )}>
                 {booking.status}
               </div>
               <span className="text-xs font-bold text-gray-400">Code: {booking.code}</span>
            </div>
            <h1 className="text-3xl font-black text-dark tracking-tighter">
              {isPaid ? 'Réservation Confirmée !' : isCancelled ? 'Trajet Annulé' : 'Confirmation en attente'}
            </h1>
          </div>
          
          <div className="flex gap-3">
            {isPaid && (
              <>
                <Button variant="outline" className="border-gray-200 bg-white text-dark font-bold rounded-2xl h-12 px-6 flex items-center gap-2 hover:bg-gray-50">
                  <Printer size={18} /> Imprimer
                </Button>
                <Button className="bg-dark text-white font-bold rounded-2xl h-12 px-6 flex items-center gap-2 hover:scale-105 transition-transform">
                  <Download size={18} /> Télécharger PDF
                </Button>
              </>
            )}
            {!isPaid && !isCancelled && (
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="border-red/20 text-red font-bold rounded-2xl h-12 px-6 hover:bg-red/5"
              >
                Annuler
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Main Content (Left) */}
          <div className="md:col-span-8 space-y-8">
            
            {/* Trip Summary Card */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden rise-in">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                    <Bus size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-black text-dark tracking-tight">{firstRoute?.companyName || 'Pullman du Sud'}</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{firstRoute?.busName || 'Premium Class'}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date</p>
                   <p className="font-black text-dark">{firstRoute?.date || 'N/A'}</p>
                </div>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start relative">
                  {/* Left Column (Departure) */}
                  <div className="flex-1">
                    <span className="text-[10px] font-black text-primary uppercase tracking-wider block mb-2">Départ</span>
                    <h4 className="text-2xl font-black text-dark tracking-tighter mb-1">{firstRoute?.departureCityName}</h4>
                    <p className="text-sm font-bold text-gray-body flex items-center gap-1.5">
                      <MapPin size={14} className="text-gray-300" /> {firstRoute?.departureStationName}
                    </p>
                    <div className="mt-6 flex items-center gap-2">
                       <div className="px-3 py-1.5 bg-gray-100 rounded-xl text-lg font-black text-dark flex items-center gap-2">
                          <Clock size={16} className="text-gray-400" /> {firstRoute?.departureTime?.slice(0, 5) || '--:--'}
                       </div>
                    </div>
                  </div>

                  {/* Center Visual */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none opacity-20">
                     <div className="w-16 h-px border-t-2 border-dashed border-gray-400" />
                     <Bus size={16} className="my-2" />
                     <div className="w-16 h-px border-t-2 border-dashed border-gray-400" />
                  </div>

                  {/* Right Column (Arrival) */}
                  <div className="flex-1 text-right">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-2">Arrivée</span>
                    <h4 className="text-2xl font-black text-dark tracking-tighter mb-1">{firstRoute?.arrivalCityName}</h4>
                    <p className="text-sm font-bold text-gray-body flex items-center justify-end gap-1.5">
                      {firstRoute?.arrivalStationName} <MapPin size={14} className="text-gray-300" />
                    </p>
                    <div className="mt-6 flex items-center justify-end gap-2">
                       <div className="px-3 py-1.5 bg-gray-50 rounded-xl text-lg font-bold text-gray-400 flex items-center gap-2">
                          {firstRoute?.arrivalTime?.slice(0, 5) || '--:--'} <Clock size={16} />
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tickets/Seats Grid */}
              <div className="bg-gray-50 p-8 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <Ticket size={18} className="text-primary" />
                  <h3 className="text-sm font-black text-dark uppercase tracking-widest">Vos Sièges Selectionnés</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {booking.tickets.map((ticket, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Place</span>
                       <span className="text-2xl font-black text-primary">{ticket.seat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area (Right) */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Passenger Info Card */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm rise-in delay-200">
              <h3 className="text-xs font-black text-dark uppercase tracking-widest mb-6 flex items-center gap-2">
                <User size={16} className="text-primary" /> Voyageur
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Nom Complet</label>
                  <p className="font-black text-dark">{booking.name || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <Mail size={18} />
                   </div>
                   <div className="overflow-hidden">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Email</label>
                      <p className="font-bold text-dark truncate text-sm">{booking.email || 'N/A'}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <Phone size={18} />
                   </div>
                   <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Téléphone</label>
                      <p className="font-bold text-dark text-sm">{booking.phone || 'N/A'}</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-dark p-8 rounded-[32px] border border-dark shadow-xl text-white outline outline-4 outline-white rise-in delay-300">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <CreditCard size={16} className="text-primary" /> Résumé du Paiement
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-bold opacity-60">
                   <span>Prix unitaire × {booking.tickets.length}</span>
                   <span>{Math.round(booking.totalPrice / booking.tickets.length)} DH</span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                   <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Total à payer</span>
                      <span className="text-3xl font-black tracking-tighter">{booking.totalPrice} DH</span>
                   </div>
                </div>
                
                {!isPaid && !isCancelled && (
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white font-black h-14 rounded-2xl mt-4 text-lg shadow-lg">
                    Procéder au paiement
                  </Button>
                )}
              </div>
            </div>

            <div className="text-center">
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Besoin d'aide ?</p>
               <p className="text-sm font-black text-dark mt-1">05 3000 3000</p>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
