import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useBooking } from '../../hooks/use-booking';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Download, 
  Printer, 
  Bus,
  Ticket,
  User,
  Mail,
  Phone,
  AlertCircle,
  CreditCard
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const Route = createFileRoute('/booking/$bookingCode')({
  component: BookingConfirmation,
});

function BookingConfirmation() {
  const { bookingCode } = Route.useParams();
  const { data: booking, isLoading, error } = useBooking(bookingCode);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container-app max-w-5xl mx-auto space-y-6">
          <Skeleton className="w-full h-32 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <Skeleton className="col-span-8 h-[400px] rounded-2xl" />
            <Skeleton className="col-span-4 h-[400px] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-2xl border border-gray-200 text-center shadow-sm max-w-md w-full">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Réservation Introuvable</h1>
          <p className="text-sm text-gray-500 mb-8">Nous n'avons pas pu trouver la réservation avec le code <span className="font-bold text-gray-900">{bookingCode}</span>.</p>
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 h-11 rounded-full w-full">Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = booking.status === 'paid' || booking.status === 'confirmed';
  const isCancelled = booking.status === 'cancelled';
  const firstRoute = booking.routes[0];

  return (
    <main className="min-h-screen py-12 bg-gray-50">
      <div className="container-app max-w-5xl mx-auto px-4">
        
        {/* Top Status Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className={cn(
                 "px-2.5 py-1 rounded-md text-xs font-semibold",
                 isPaid ? "bg-green-100 text-green-700" : isCancelled ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
               )}>
                 {booking.status}
               </div>
               <span className="text-sm font-medium text-gray-500">Code: {booking.code}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isPaid ? 'Réservation Confirmée !' : isCancelled ? 'Trajet Annulé' : 'Confirmation en attente'}
            </h1>
          </div>
          
          <div className="flex gap-3">
            {isPaid && (
              <>
                <Button variant="outline" className="border-gray-200 bg-white text-gray-700 font-medium rounded-full h-10 px-5 flex items-center gap-2 hover:bg-gray-50">
                  <Printer size={16} /> Imprimer
                </Button>
                <Button className="bg-blue-600 text-white font-medium rounded-full h-10 px-5 flex items-center gap-2 hover:bg-blue-700 transition-colors">
                  <Download size={16} /> Télécharger PDF
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Main Content (Left) */}
          <div className="md:col-span-8 space-y-6">
            
            {/* Trip Summary Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                    <Bus size={24} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{firstRoute?.companyName || 'Pullman du Sud'}</h3>
                    <p className="text-xs text-gray-500">{firstRoute?.busName || 'Premium Class'}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-xs text-gray-500 mb-0.5">Date de départ</p>
                   <p className="font-semibold text-gray-900">{firstRoute?.date || 'N/A'}</p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center relative px-4">
                  {/* Left Column (Departure) */}
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-blue-500 block mb-1">Départ</span>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{firstRoute?.departureCityName}</h4>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-4">
                      <MapPin size={14} /> {firstRoute?.departureStationName}
                    </p>
                    <div className="inline-flex px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-lg font-bold text-gray-900 items-center gap-2">
                      <Clock size={16} className="text-gray-400" /> {firstRoute?.departureTime?.slice(0, 5) || '--:--'}
                    </div>
                  </div>

                  {/* Center Visual */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                     <div className="w-24 h-px border-t-2 border-dashed border-gray-200" />
                     <Bus size={20} className="my-2 text-gray-300" />
                     <div className="w-24 h-px border-t-2 border-dashed border-gray-200" />
                  </div>

                  {/* Right Column (Arrival) */}
                  <div className="flex-1 text-right">
                    <span className="text-xs font-semibold text-gray-500 block mb-1">Arrivée</span>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{firstRoute?.arrivalCityName}</h4>
                    <p className="text-sm text-gray-500 flex items-center justify-end gap-1.5 mb-4">
                      {firstRoute?.arrivalStationName} <MapPin size={14} />
                    </p>
                    <div className="inline-flex px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-lg font-bold text-gray-900 items-center gap-2">
                      {firstRoute?.arrivalTime?.slice(0, 5) || '--:--'} <Clock size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tickets/Seats Grid */}
              <div className="bg-gray-50 p-6 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Ticket size={18} className="text-gray-900" />
                  <h3 className="text-sm font-bold text-gray-900">Vos Sièges Selectionnés</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {booking.tickets.map((ticket, idx) => (
                    <div key={idx} className="bg-white px-6 py-3 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
                       <span className="text-xs text-gray-500 mb-0.5">Siège</span>
                       <span className="text-lg font-bold text-blue-600">{ticket.seat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area (Right) */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Passenger Info Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-5 flex items-center gap-2">
                <div className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center shrink-0">
                  <User size={16} className="text-gray-900" />
                </div>
                Voyageur
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-0.5">Nom Complet</label>
                  <p className="text-sm font-medium text-gray-900">{booking.name || 'N/A'}</p>
                </div>
                <hr className="border-gray-100" />
                <div className="flex items-center gap-3">
                   <Mail size={16} className="text-gray-400 shrink-0" />
                   <div className="overflow-hidden">
                      <label className="text-xs font-semibold text-gray-500 block mb-0.5">Email</label>
                      <p className="text-sm font-medium text-gray-900 truncate">{booking.email || 'N/A'}</p>
                   </div>
                </div>
                <hr className="border-gray-100" />
                <div className="flex items-center gap-3">
                   <Phone size={16} className="text-gray-400 shrink-0" />
                   <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-0.5">Téléphone</label>
                      <p className="text-sm font-medium text-gray-900">{booking.phone || 'N/A'}</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-5 flex items-center gap-2">
                <div className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center shrink-0">
                  <CreditCard size={16} className="text-gray-900" />
                </div>
                Résumé du Paiement
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-600">Prix unitaire × {booking.tickets.length}</span>
                   <span className="text-gray-900 font-medium">{Math.round(booking.totalPrice / booking.tickets.length)} Dhs</span>
                </div>
                
                <hr className="border-gray-100" />
                
                <div className="flex justify-between items-center">
                   <span className="text-sm font-semibold text-gray-900">Total payé</span>
                   <span className="text-xl font-bold text-gray-900">{booking.totalPrice} Dhs</span>
                </div>
                
                {!isPaid && !isCancelled && (
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-11 rounded-full mt-2 transition-colors">
                    Procéder au paiement
                  </Button>
                )}
              </div>
            </div>

            <div className="text-center mt-6">
               <p className="text-xs text-gray-500">Besoin d'aide ?</p>
               <p className="text-sm font-bold text-gray-900 mt-0.5">05 3000 3000</p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
