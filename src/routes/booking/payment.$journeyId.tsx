import { useNavigate, useSearch, useParams, createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useJourneySearch } from '../../hooks/use-journeys';
import { useCreateBooking, useMarkBookingPaid } from '../../hooks/use-booking';
import { sendBookingEmail } from '../../rpc/send-booking-email';


export const Route = createFileRoute('/booking/payment/$journeyId')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      amount: (search.amount as string) || '0',
      allerSearchId: (search.allerSearchId as string) || '',
      retourSearchId: (search.retourSearchId as string) || '',
      selectedSeat: (search.seat as string) || (search.selectedSeat as string) || '',
      selectedReturnSeat: (search.returnSeat as string) || (search.selectedReturnSeat as string) || '',
      departureCityId: Number(search.departureCityId) || 0,
      arrivalCityId: Number(search.arrivalCityId) || 0,
      date: (search.date as string) || '',
      returnDate: (search.returnDate as string) || '',
      retourJourneyId: (search.retourJourneyId as string) || undefined,
      nbrOfPassengers: Number(search.nbrOfPassengers) || 1,
      passengerName: (search.passengerName as string) || (search.name as string) || '',
      passengerEmail: (search.passengerEmail as string) || (search.email as string) || '',
      passengerPhone: (search.passengerPhone as string) || (search.phone as string) || '',
    };
  },
  component: PaymentPage,
});

function PaymentPage() {
  const { journeyId } = Route.useParams();
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  // Load journey details for displaying booking details
  const { data: searchResult } = useJourneySearch({
    departureCityId: searchParams.departureCityId,
    arrivalCityId: searchParams.arrivalCityId,
    date: searchParams.date,
    nbrOfPassengers: searchParams.nbrOfPassengers,
    previousSearchId: searchParams.allerSearchId,
  });

  const allerJourney = searchResult?.journeys.find(j => j.id.toString() === journeyId);

  const amount = Number(searchParams.amount) || 0;
  const todayStr = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(new Date());

  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('01');
  const [expYear, setExpYear] = useState('2026');
  const [cvv, setCvv] = useState('');
  const [cgvAccepted, setCgvAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const createBookingMutation = useCreateBooking();
  const markPaidMutation = useMarkBookingPaid();

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length <= 16) {
      setCardNumber(val);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length <= 3) {
      setCvv(val);
    }
  };

  const handlePayment = async () => {
    if (!cardHolder || !cardNumber || !cvv || !cgvAccepted) {
      alert('Veuillez remplir tous les champs et accepter les conditions générales.');
      return;
    }
    
    setIsProcessing(true);

    try {
      // Étape 1 : Créer la réservation via l'API Markoub
      // On utilise le searchId récent (searchResult?.searchId) car Markoub expire l'ancien lors d'une nouvelle recherche
      const booking = await createBookingMutation.mutateAsync({
        journeyId: journeyId,
        searchId: searchResult?.searchId || searchParams.allerSearchId,
        name: searchParams.passengerName,
        email: searchParams.passengerEmail,
        phone: searchParams.passengerPhone,
        seats: searchParams.selectedSeat ? searchParams.selectedSeat.split(',').map(Number) : [],
      });

      const bookingCode = typeof booking === 'string' ? booking : booking.code;
      console.log('[PAIEMENT] Réservation créée via API, code:', bookingCode);

      // Étape 2 : Marquer la réservation comme payée via l'API
      const referenceNumber = 'CMI-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      
      await markPaidMutation.mutateAsync({
        code: bookingCode,
        paidPrice: amount.toFixed(2),
        referenceNumber: referenceNumber,
        additionalInfo: `Carte: ****${cardNumber.slice(-4)} | Titulaire: ${cardHolder}`,
      });

      console.log('[PAIEMENT] Réservation marquée comme payée via API, ref:', referenceNumber);

      // Étape 3 : Envoyer l'email de confirmation au voyageur
      try {
        await sendBookingEmail({
          data: {
            email: searchParams.passengerEmail,
            name: searchParams.passengerName,
            bookingCode: bookingCode,
            from: allerJourney?.from.cityName || 'Départ',
            to: allerJourney?.to.cityName || 'Arrivée',
            date: allerJourney?.departureDate || searchParams.date,
            departureTime: allerJourney?.departureTime || '--:--',
            amount: amount,
            seats: searchParams.selectedSeat || 'N/A',
          },
        });
        console.log('[EMAIL] Email de confirmation envoyé à', searchParams.passengerEmail);
      } catch (emailErr) {
        // L'email ne bloque pas la confirmation
        console.warn('[EMAIL] Échec envoi email (non bloquant):', emailErr);
      }

      setPaymentSuccess(true);
      setIsProcessing(false);
      // On ne redirige plus, on laisse l'utilisateur sur la page de succès
    } catch (err: any) {
      console.error('[PAIEMENT] Erreur API:', err);
      alert(err.message || 'Une erreur est survenue lors du paiement. Veuillez réessayer.');
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
        </div>
        <h4 className="text-xl font-bold text-gray-800 mb-2">Authentification en cours...</h4>
        <p className="text-sm text-gray-500 font-medium">Connexion à votre banque (3D Secure)...</p>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6 animate-in zoom-in duration-500">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h4 className="text-2xl font-bold text-gray-800 mb-2">Paiement Validé ! 🎉</h4>
        <p className="text-base text-gray-600 font-medium mb-1">Votre réservation a été confirmée avec succès.</p>
        <p className="text-sm text-blue-600 font-semibold mb-8">
          Votre billet a été envoyé par email à <strong>{searchParams.passengerEmail}</strong>
        </p>
        <button 
          onClick={() => navigate({ to: '/' })}
          className="px-8 py-3 bg-dark hover:bg-black text-white font-bold rounded-xl transition-colors"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#333] flex flex-col">
      {/* Top Header / Branding */}
      <header className="px-8 py-4 max-w-6xl w-full mx-auto flex flex-col items-start border-b border-gray-100">
        <img 
          src="/images/logo-pullman.png" 
          alt="Pullman du Sud" 
          className="h-16 object-contain" 
        />
      </header>

      {/* Main Form Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Detail de Paiement Form */}
        <section className="lg:col-span-7 bg-white border border-[#E5E5E5] rounded-sm overflow-hidden flex flex-col">
          <div className="bg-[#F6F6F6] px-4 py-3 border-b border-[#E5E5E5] flex justify-between items-center">
            <h2 className="text-[#E25C24] font-bold text-xs uppercase tracking-wide">Détail de paiement</h2>
            <span className="text-[11px] text-gray-500">{todayStr}</span>
          </div>

          <div className="p-6 space-y-6">
            {/* Payment Methods Info */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#666]">Méthode de paiement :</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 border border-gray-300 text-[10px] font-black text-blue-800 rounded bg-white">VISA</span>
                <span className="px-2 py-0.5 border border-gray-300 text-[10px] font-black text-red-600 rounded bg-white">MasterCard</span>
                <span className="px-2 py-0.5 border border-gray-300 text-[10px] font-black text-[#E25C24] rounded bg-white">CMI</span>
              </div>
            </div>

            {/* Radio Select */}
            <div className="flex items-center gap-2 text-xs font-bold">
              <input type="radio" defaultChecked id="carte_bancaire" className="accent-[#E25C24]" />
              <label htmlFor="carte_bancaire" className="cursor-pointer">Carte bancaire</label>
            </div>

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase text-[#444]">Nom du porteur de la carte</label>
              <input 
                type="text" 
                placeholder="Nom du porteur de la carte"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                className="w-full h-10 px-3 border border-gray-300 text-sm focus:outline-none focus:border-[#004B87] rounded-sm"
              />
            </div>

            {/* Card Number Input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase text-[#444]">Numéro de carte de paiement</label>
              <input 
                type="text" 
                placeholder="Numéro de carte de paiement"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className="w-full h-10 px-3 border border-gray-300 text-sm tracking-widest font-mono focus:outline-none focus:border-[#004B87] rounded-sm"
              />
            </div>

            {/* Expiry Date Selects */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase text-[#444]">Date d'expiration</label>
              <div className="flex gap-4">
                <select 
                  value={expMonth} 
                  onChange={(e) => setExpMonth(e.target.value)}
                  className="h-10 px-3 border border-gray-300 text-sm focus:outline-none focus:border-[#004B87] bg-white rounded-sm w-24"
                >
                  {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select 
                  value={expYear} 
                  onChange={(e) => setExpYear(e.target.value)}
                  className="h-10 px-3 border border-gray-300 text-sm focus:outline-none focus:border-[#004B87] bg-white rounded-sm w-32"
                >
                  {Array.from({ length: 10 }, (_, i) => String(2026 + i)).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Verification Code Input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase text-[#444]">Code de vérification (CVV)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="password" 
                  placeholder="CVV"
                  value={cvv}
                  onChange={handleCvvChange}
                  className="w-20 h-10 px-3 border border-gray-300 text-sm text-center focus:outline-none focus:border-[#004B87] rounded-sm"
                />
                <span className="text-[10px] text-blue-600 font-semibold cursor-pointer">(?)</span>
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start gap-2 pt-2">
              <input 
                type="checkbox" 
                id="cgv"
                checked={cgvAccepted}
                onChange={(e) => setCgvAccepted(e.target.checked)}
                className="mt-1 accent-[#E25C24]" 
              />
              <label htmlFor="cgv" className="text-xs text-gray-600 leading-tight cursor-pointer">
                Confirmer l'acceptation des <span className="text-blue-600 hover:underline">conditions générales d'utilisation du service</span>
              </label>
            </div>
          </div>

          {/* Form Bottom Alert Info */}
          <div className="mt-auto bg-[#F6F6F6] px-4 py-3 border-t border-[#E5E5E5] text-center">
            <span className="text-[11px] font-medium text-gray-500">
              Les informations sur le paiement vous concernant resteront confidentielles.
            </span>
          </div>
        </section>

        {/* Right Side: Informational Blocks */}
        <section className="lg:col-span-5 space-y-6">
          
          {/* Detail de la Commande */}
          <div className="border border-[#E5E5E5] rounded-sm overflow-hidden bg-white">
            <div className="bg-[#F6F6F6] px-4 py-2 border-b border-[#E5E5E5]">
              <h3 className="text-[#E25C24] font-bold text-xs uppercase tracking-wide">Détail de la commande</h3>
            </div>
            <div className="p-4 space-y-2 text-xs font-semibold text-[#555]">
              <div className="flex">
                <span className="w-24 text-gray-400">Identifiant</span>
                <span>: {Math.floor(1000000000 + Math.random() * 9000000000)}</span>
              </div>
              <div className="flex">
                <span className="w-24 text-gray-400">Trajet</span>
                <span>: {allerJourney ? `${allerJourney.from.cityName} → ${allerJourney.to.cityName}` : 'Aller simple'}</span>
              </div>
              <div className="flex text-sm font-bold text-[#333]">
                <span className="w-24 text-gray-400">Montant</span>
                <span className="text-lg font-black text-[#004B87]">: {amount.toFixed(2)} MAD</span>
              </div>
            </div>
          </div>

          {/* Detail du Voyage */}
          <div className="border border-[#E5E5E5] rounded-sm overflow-hidden bg-white">
            <div className="bg-[#F6F6F6] px-4 py-2 border-b border-[#E5E5E5]">
              <h3 className="text-[#E25C24] font-bold text-xs uppercase tracking-wide">Détail du voyage</h3>
            </div>
            <div className="p-4 space-y-2 text-xs font-semibold text-[#555]">
              <div className="flex">
                <span className="w-36 text-gray-400">Compagnie de voyage</span>
                <span>: {allerJourney?.company.name || 'PULLMAN DU SUD'}</span>
              </div>
              <div className="flex">
                <span className="w-36 text-gray-400">Date de départ</span>
                <span>: {allerJourney?.departureDate || searchParams.date}</span>
              </div>
              <div className="flex">
                <span className="w-36 text-gray-400">Heure de départ</span>
                <span>: {allerJourney?.departureTime || 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="w-36 text-gray-400">Adresse de départ</span>
                <span>: {allerJourney?.from.address || 'Gare routière'}</span>
              </div>
            </div>
          </div>

          {/* Informations du Client */}
          <div className="border border-[#E5E5E5] rounded-sm overflow-hidden bg-white">
            <div className="bg-[#F6F6F6] px-4 py-2 border-b border-[#E5E5E5]">
              <h3 className="text-[#E25C24] font-bold text-xs uppercase tracking-wide">Informations du client</h3>
            </div>
            <div className="p-4 space-y-2 text-xs font-semibold text-[#555]">
              <div className="flex items-center">
                <span className="w-20 text-gray-400">E-mail</span>
                <span className="font-mono text-gray-700">: {searchParams.passengerEmail || (searchParams as any).email || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Submit / Cancel Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              onClick={handlePayment}
              className="flex-1 h-12 bg-[#4CAF50] hover:bg-[#43A047] text-white font-bold text-sm rounded-sm transition-colors uppercase tracking-wider"
            >
              Valider le paiement
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-1/3 h-12 bg-[#D32F2F] hover:bg-[#C62828] text-white font-bold text-sm rounded-sm transition-colors uppercase tracking-wider"
            >
              Annuler
            </button>
          </div>
        </section>
      </main>

      {/* Secure badges / logos */}
      <footer className="mt-auto bg-[#F6F6F6] border-t border-[#E5E5E5] px-8 py-6">
        <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-semibold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 border border-gray-300 text-[10px] font-black text-[#E25C24] rounded bg-white">CMI</span>
            <span>Centre Monétique Interbancaire</span>
          </div>
          <div className="flex gap-4">
            <span>Verified by VISA</span>
            <span>MasterCard ID Check</span>
            <span>PCI-DSS Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
