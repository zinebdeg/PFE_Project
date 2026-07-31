import { createFileRoute, Link } from '@tanstack/react-router';
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
  CreditCard,
  Hourglass,
  ArrowRight,
  Building2,
  QrCode,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const Route = createFileRoute('/booking/$bookingCode')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      secondCode: (search.secondCode as string) || undefined,
    };
  },
  component: BookingConfirmation,
});

function BookingConfirmation() {
  const { bookingCode } = Route.useParams();
  const { secondCode } = Route.useSearch();
  const { data: booking, isLoading, error } = useBooking(bookingCode);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container-app max-w-5xl mx-auto space-y-6">
          <Skeleton className="w-full h-40 rounded-[32px]" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <Skeleton className="col-span-8 h-[500px] rounded-[32px]" />
            <Skeleton className="col-span-4 h-[500px] rounded-[32px]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[32px] border border-gray-200 text-center shadow-sm max-w-md w-full">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-black text-gray-900 mb-2">Réservation Introuvable</h1>
          <p className="text-sm text-gray-500 mb-8">Nous n'avons pas pu trouver la réservation avec le code <span className="font-bold text-gray-900">{bookingCode}</span>.</p>
          <Link to="/">
            <Button className="bg-dark hover:bg-black text-white font-bold px-8 h-12 rounded-2xl w-full">Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = booking.status === 'paid' || booking.status === 'confirmed';
  const isCancelled = booking.status === 'cancelled';
  const firstRoute = booking.routes[0];

  // QR Code content
  const qrContent = `PULLMAN-DU-SUD|${booking.code}|${booking.name}|${firstRoute?.departureCityName}>${firstRoute?.arrivalCityName}|${firstRoute?.date}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrContent)}&bgcolor=ffffff&color=000000&margin=10`;

  const handlePrint = () => window.print();

  return (
    <main className="min-h-screen py-12 bg-gray-50">
      <div className="container-app max-w-5xl mx-auto px-4">

        {/* Top Banner */}
        <div className={cn(
          "rounded-[32px] p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6",
          isPaid ? "bg-gradient-to-r from-green-500 to-emerald-600" :
          isCancelled ? "bg-gradient-to-r from-red-500 to-rose-600" :
          "bg-gradient-to-r from-blue-500 to-cyan-500"
        )}>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              {isPaid ? <CheckCircle2 size={36} className="text-white" /> :
               isCancelled ? <AlertCircle size={36} className="text-white" /> :
               <Hourglass size={36} className="text-white" />}
            </div>
            <div className="text-white">
              <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-1">
                {isPaid ? '✅ Billet Confirmé' : isCancelled ? '❌ Annulé' : '⏳ En attente de paiement'}
              </p>
              <h1 className="text-3xl font-black leading-tight">
                {isPaid ? 'Bon Voyage !' : isCancelled ? 'Réservation Annulée' : 'Réservez Votre Place !'}
              </h1>
              <p className="text-white/80 text-sm font-medium mt-1">
                {isPaid 
                  ? `Code de réservation : ${booking.code}${secondCode ? ` & ${secondCode}` : ''}`
                  : isCancelled 
                  ? `La réservation ${booking.code} a été annulée.`
                  : `Payez en agence avec le code : ${booking.code} — Valable 4h`
                }
              </p>
            </div>
          </div>
          {isPaid && (
            <div className="flex gap-3 shrink-0">
              <Button onClick={handlePrint} variant="outline" className="bg-white/10 hover:bg-white/20 border-white/30 text-white font-bold rounded-2xl h-12 px-6 flex items-center gap-2">
                <Printer size={18} /> Imprimer
              </Button>
              <Button className="bg-white text-green-700 hover:bg-green-50 font-black rounded-2xl h-12 px-6 flex items-center gap-2">
                <Download size={18} /> Télécharger
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Main Ticket Card */}
          <div className="md:col-span-8 space-y-6">

            {/* Electronic Ticket */}
            <div className={cn(
              "bg-white rounded-[32px] border-2 overflow-hidden shadow-sm",
              isPaid ? "border-green-200" : "border-gray-100"
            )}>
              {/* Ticket Header */}
              <div className="bg-dark p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                    <Bus size={24} className="text-dark" />
                  </div>
                  <div>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Opérateur</p>
                    <h3 className="font-black text-white text-lg">{firstRoute?.companyName || 'Pullman du Sud'}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Bus</p>
                  <p className="font-bold text-white">{firstRoute?.busName || 'Premium Class'}</p>
                </div>
              </div>

              {/* Route Display */}
              <div className="p-8">
                <div className="flex justify-between items-center relative">
                  {/* Departure */}
                  <div className="flex-1">
                    <span className="text-xs font-black text-primary uppercase tracking-widest block mb-2">Départ</span>
                    <h4 className="text-3xl font-black text-dark mb-2">{firstRoute?.departureCityName}</h4>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5">
                      <MapPin size={14} /> {firstRoute?.departureStationName}
                    </p>
                    <div className="inline-flex mt-4 px-4 py-2 bg-dark text-white rounded-2xl text-xl font-black items-center gap-2">
                      <Clock size={18} className="text-primary" /> {firstRoute?.departureTime?.slice(0, 5) || '--:--'}
                    </div>
                  </div>

                  {/* Center */}
                  <div className="flex flex-col items-center mx-6">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-px border-t-2 border-dashed border-gray-200" />
                      <ArrowRight className="text-primary" size={24} />
                      <div className="w-16 h-px border-t-2 border-dashed border-gray-200" />
                    </div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">{firstRoute?.date}</p>
                  </div>

                  {/* Arrival */}
                  <div className="flex-1 text-right">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2">Arrivée</span>
                    <h4 className="text-3xl font-black text-dark mb-2">{firstRoute?.arrivalCityName}</h4>
                    <p className="text-sm text-gray-500 flex items-center justify-end gap-1.5">
                      {firstRoute?.arrivalStationName} <MapPin size={14} />
                    </p>
                    <div className="inline-flex mt-4 px-4 py-2 bg-gray-50 border-2 border-gray-100 text-dark rounded-2xl text-xl font-black items-center gap-2">
                      {firstRoute?.arrivalTime?.slice(0, 5) || '--:--'} <Clock size={18} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tear line + QR */}
              <div className="relative">
                <div className="flex items-center gap-2 px-6">
                  <div className="w-8 h-8 bg-gray-50 rounded-full border-2 border-gray-100 shrink-0 -ml-10" />
                  <div className="flex-1 border-t-2 border-dashed border-gray-200" />
                  <div className="w-8 h-8 bg-gray-50 rounded-full border-2 border-gray-100 shrink-0 -mr-10" />
                </div>
              </div>

              {/* Bottom: Seats + QR code */}
              <div className="p-8 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Ticket size={18} className="text-dark" />
                    <h3 className="text-sm font-black text-dark uppercase tracking-widest">Sièges Réservés</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {booking.tickets.map((ticket, idx) => (
                      <div key={idx} className="bg-white px-5 py-3 rounded-2xl border-2 border-gray-200 shadow-sm flex flex-col items-center">
                        <span className="text-xs text-gray-400 font-bold mb-0.5">Siège</span>
                        <span className="text-2xl font-black text-dark">{ticket.seat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QR Code - only for paid */}
                {isPaid ? (
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <img 
                      src={qrUrl}
                      alt="QR Code du billet"
                      className="w-32 h-32 rounded-xl border-2 border-gray-200"
                    />
                    <p className="text-xs text-gray-500 font-bold text-center">Scanner à bord</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 shrink-0 w-32 h-32 bg-blue-50 border-2 border-blue-200 rounded-xl justify-center">
                    <QrCode size={40} className="text-blue-400" />
                    <p className="text-xs text-blue-500 font-bold text-center">Généré après paiement</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cash payment instructions */}
            {!isPaid && !isCancelled && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-[24px] p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-200 rounded-2xl flex items-center justify-center shrink-0">
                    <Building2 className="text-amber-700" size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-amber-800 text-lg mb-2">Comment payer en agence ?</h3>
                    <ol className="space-y-2 text-sm text-amber-700 font-medium">
                      <li>1. Rendez-vous dans une agence Pullman du Sud, Wafacash, Cashplus ou MT Cash.</li>
                      <li>2. Mentionnez votre <strong>code de réservation : {booking.code}</strong></li>
                      <li>3. Payez le montant de <strong>{booking.totalPrice} MAD</strong></li>
                      <li>4. Votre billet électronique avec QR Code sera généré immédiatement.</li>
                    </ol>
                    <p className="text-xs text-amber-600 font-bold mt-4 flex items-center gap-1">
                      ⏰ Attention : Cette réservation expire dans 4 heures si elle n'est pas réglée.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-4 space-y-5">

            {/* Passenger Card */}
            <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
              <h3 className="text-sm font-black text-dark mb-5 flex items-center gap-2 uppercase tracking-widest">
                <User size={16} className="text-primary" /> Voyageur
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-0.5 uppercase tracking-wider">Nom Complet</label>
                  <p className="text-base font-black text-dark">{booking.name || 'N/A'}</p>
                </div>
                <hr className="border-gray-100" />
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400 shrink-0" />
                  <div className="overflow-hidden">
                    <label className="text-xs font-bold text-gray-400 block mb-0.5">Email</label>
                    <p className="text-sm font-bold text-dark truncate">{booking.email || 'N/A'}</p>
                  </div>
                </div>
                <hr className="border-gray-100" />
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-400 shrink-0" />
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-0.5">Téléphone</label>
                    <p className="text-sm font-black text-dark">{booking.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
              <h3 className="text-sm font-black text-dark mb-5 flex items-center gap-2 uppercase tracking-widest">
                <CreditCard size={16} className="text-primary" /> Résumé du Paiement
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Prix × {booking.tickets.length} passager(s)</span>
                  <span className="font-bold text-dark">{Math.round(booking.totalPrice)} MAD</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Frais de service</span>
                  <span className="font-bold text-dark">5 MAD</span>
                </div>
                <hr className="border-gray-100 my-2" />
                <div className="flex justify-between items-center">
                  <span className="font-black text-dark">Total</span>
                  <span className="text-2xl font-black text-dark">{booking.totalPrice + 5} MAD</span>
                </div>
                <div className={cn(
                  "mt-3 py-2.5 px-4 rounded-2xl text-center text-sm font-black",
                  isPaid ? "bg-green-100 text-green-700" :
                  isCancelled ? "bg-red-100 text-red-700" :
                  "bg-blue-100 text-blue-700"
                )}>
                  {isPaid ? '✅ Paiement reçu' : isCancelled ? '❌ Annulé' : '⏳ Paiement en attente'}
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-dark rounded-[24px] p-6 text-center">
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Besoin d'aide ?</p>
              <p className="text-white font-black text-xl">05 22 25 49 19</p>
              <p className="text-white/50 text-xs mt-1">Pullman du Sud — Service Client</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
