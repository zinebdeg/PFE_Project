import { createFileRoute } from '@tanstack/react-router';
import { useBooking, useMarkBookingPaid, useCancelBooking } from '../../hooks/use-booking';
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
  Ticket
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';

export const Route = createFileRoute('/booking/$bookingCode')({
  component: BookingConfirmation,
});

function BookingConfirmation() {
  const { bookingCode } = Route.useParams();
  const { data: booking, isLoading, refetch } = useBooking(bookingCode);
  const markPaidMutation = useMarkBookingPaid();
  const cancelBookingMutation = useCancelBooking();
  
  const [paying, setPaying] = useState(false);

  // Simulated payment handler
  const handlePayment = async () => {
    if (!booking) return;
    setPaying(true);
    try {
      await markPaidMutation.mutateAsync({
        code: bookingCode,
        paidPrice: booking.totalPrice.toString(),
        referenceNumber: 'DEMO-' + Math.random().toString(36).substring(7).toUpperCase(),
        additionalInfo: 'Simulation de paiement par carte bancaire',
      });
      refetch();
    } catch (e) {
      alert('Erreur de paiement');
    } finally {
      setPaying(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Voulez-vous vraiment annuler cette réservation ?')) return;
    try {
      await cancelBookingMutation.mutateAsync(bookingCode);
      refetch();
    } catch (e) {
      alert('Erreur lors de l\'annulation');
    }
  };

  if (isLoading) {
    return (
      <div className="container-app py-20">
        <Skeleton className="w-full h-96 rounded-3xl" />
      </div>
    );
  }

  if (!booking) return (
    <div className="container-app py-20 text-center">
      <XCircle size={64} className="text-red mx-auto mb-4" />
      <h1 className="text-2xl font-black">Réservation Introuvable</h1>
    </div>
  );

  const isPaid = booking.status === 'paid' || booking.status === 'confirmed';
  const isCancelled = booking.status === 'cancelled';

  return (
    <main className="min-h-screen pt-10 pb-20 bg-gray-light/10">
      <div className="container-app">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Status Banner */}
          <div className={cn(
            "p-10 rounded-[32px] text-center shadow-xl border-b-8 transition-colors rise-in",
            isPaid ? "bg-white border-green" : isCancelled ? "bg-white border-red" : "bg-white border-primary"
          )}>
            {isPaid ? (
              <CheckCircle2 size={64} className="text-green mx-auto mb-6 drop-shadow-sm" />
            ) : isCancelled ? (
              <XCircle size={64} className="text-red mx-auto mb-6 drop-shadow-sm" />
            ) : (
              <Clock size={64} className="text-primary animate-pulse mx-auto mb-6 drop-shadow-sm" />
            )}
            
            <h1 className="text-3xl font-black text-dark mb-2 tracking-tight">
              {isPaid ? 'Réservation Confirmée !' : isCancelled ? 'Réservation Annulée' : 'Réservation En Attente'}
            </h1>
            <p className="text-sm font-bold text-gray-body mb-8 uppercase tracking-widest">
              Code de réservation: <span className="text-dark font-black">{booking.code}</span>
            </p>

            {!isPaid && !isCancelled && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handlePayment} 
                  disabled={paying}
                  className="bg-primary text-white font-black px-10 h-14 rounded-2xl shadow-lg hover:scale-105 transition-transform"
                >
                  {paying ? 'Traitement...' : 'Payer maintenant'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="border-gray-border text-gray-body font-bold h-14 rounded-2xl"
                >
                  Annuler la réservation
                </Button>
              </div>
            )}

            {isPaid && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-dark text-white font-black px-8 h-12 rounded-xl flex items-center gap-2">
                  <Download size={18} /> Télécharger PDF
                </Button>
                <Button variant="outline" className="border-gray-border text-gray-body font-bold h-12 rounded-xl flex items-center gap-2">
                  <Printer size={18} /> Imprimer
                </Button>
              </div>
            )}
          </div>

          {/* Ticket Information */}
          <div className="bg-white rounded-[32px] border border-gray-border shadow-sm divide-y divide-gray-border rise-in delay-100">
            {/* Header Info */}
            <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Bus size={28} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-body uppercase tracking-widest">Compagnie</span>
                  <h2 className="text-xl font-black text-dark tracking-tight">Pullman du Sud</h2>
                </div>
              </div>
              <div className="flex flex-col md:text-right">
                <span className="text-[10px] font-bold text-gray-body uppercase tracking-widest">Total Payé</span>
                <span className="text-2xl font-black text-primary">{booking.totalPrice} DH</span>
              </div>
            </div>

            {/* Travel Path */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 relative overflow-hidden">
               <div className="md:col-span-1">
                  <span className="text-[10px] font-bold text-gray-body uppercase tracking-widest">Départ</span>
                  <div className="text-xl font-black text-dark mt-1">{booking.routes[0].departureCityName}</div>
                  <div className="text-sm font-bold text-gray-body flex items-center gap-1 mt-1">
                    <MapPin size={14} /> {booking.routes[0].departureStationName}
                  </div>
                  <div className="mt-4 text font-bold text-dark flex items-center gap-2">
                    <Clock size={16} /> {booking.routes[0].departureTime.slice(0, 5)}
                  </div>
               </div>

               <div className="flex flex-col items-center justify-center py-4">
                  <div className="w-full flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="flex-1 h-px border-t-2 border-dashed border-gray-border" />
                    <div className="w-2 h-2 rounded-full border-2 border-primary" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-body uppercase mt-2">Trajet Direct</span>
               </div>

               <div className="md:col-span-1 md:text-right">
                  <span className="text-[10px] font-bold text-gray-body uppercase tracking-widest">Arrivée</span>
                  <div className="text-xl font-black text-dark mt-1">{booking.routes[0].arrivalCityName}</div>
                  <div className="text-sm font-bold text-gray-body flex items-center justify-end gap-1 mt-1">
                    {booking.routes[0].arrivalStationName} <MapPin size={14} />
                  </div>
                  <div className="mt-4 text font-bold text-dark flex items-center justify-end gap-2">
                    {booking.routes[0].arrivalTime.slice(0, 5)} <Clock size={16} />
                  </div>
               </div>
            </div>

            {/* Tickets */}
            <div className="p-8">
              <h3 className="text-sm font-black text-dark uppercase tracking-widest mb-6 flex items-center gap-2">
                <Ticket size={18} className="text-primary" /> Vos Billets
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {booking.tickets.map((ticket: Ticket, idx: number) => (
                  <div key={idx} className="p-6 bg-gray-light/50 border border-gray-border rounded-2xl flex flex-col gap-2 group hover:border-primary transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-body uppercase tracking-widest">Place N°</span>
                      <span className="text-lg font-black text-dark">{ticket.seat}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-border pt-2 mt-2">
                      <span className="text-[10px] font-bold text-gray-body uppercase tracking-widest">Code Billet</span>
                      <code className="text-xs font-bold text-primary">{ticket.code}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center pb-10">
            <p className="text-xs text-gray-body">
              Besoin d'aide ? Contactez notre support au <span className="font-bold text-dark">05 3000 3000</span>
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
