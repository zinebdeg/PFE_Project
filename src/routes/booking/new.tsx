import { createFileRoute } from '@tanstack/react-router';
import PassengerForm from '../../components/booking/passenger-form';
import { ReceiptText, Info, ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/booking/new')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      journeyId: (search.journeyId as string) || '',
      searchId: (search.searchId as string) || '',
      seats: (search.seats as string) || '',
    };
  },
  component: BookingNew,
});

function BookingNew() {
  const { journeyId, searchId, seats } = Route.useSearch();
  const seatList = seats ? seats.split(',').map(Number) : [];

  return (
    <main className="min-h-screen pt-10 pb-20 bg-gray-light/10">
      <div className="container-app">
        {/* Back button */}
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm font-bold text-gray-body hover:text-dark mb-10 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Retour à la sélection des sièges
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            <PassengerForm 
              journeyId={journeyId} 
              searchId={searchId} 
              seats={seatList} 
            />
          </div>

          {/* Sidebar: Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl border border-gray-border shadow-sm sticky top-24 rise-in delay-100">
              <h3 className="text-xl font-black text-dark mb-6 flex items-center gap-2">
                <ReceiptText size={20} className="text-primary" />
                Détails du paiement
              </h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-body font-medium">Nombre de passagers</span>
                  <span className="text-dark font-bold">{seatList.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-body font-medium">Sièges</span>
                  <span className="text-dark font-bold">{seatList.join(', ')}</span>
                </div>
                <div className="border-t border-gray-border pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-dark">Total à payer</span>
                    <span className="text-2xl font-black text-primary">-- DH</span>
                  </div>
                  <p className="text-[10px] text-gray-body mt-2 leading-tight">
                    * Le prix exact est calculé selon les tarifs de la compagnie Pullman du Sud.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-light rounded-xl border border-gray-border">
                <div className="flex items-start gap-2 text-[10px] text-gray-body">
                  <Info size={12} className="shrink-0 mt-0.5 text-blue" />
                  <span>
                    En confirmant la réservation, vous acceptez les conditions générales de vente et de transport.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
