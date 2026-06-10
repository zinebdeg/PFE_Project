import { createFileRoute } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { useState } from 'react';
import { MapPin, Phone } from 'lucide-react';

export const Route = createFileRoute('/messagerie')({
  component: MessageriePage,
});

function MessageriePage() {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    whatsapp: '',
    email: '',
    message: '',
  });

  const agencies = [
    { city: 'Casablanca (Siège)', address: 'Gare Routière Oulad Ziane, Guichet 12, Casablanca', phone: '05 22 44 55 66' },
    { city: 'Agadir', address: 'Gare Routière Al Massira, Avenue Abderrahim Bouabid', phone: '05 28 84 14 14' },
    { city: 'Tanger', address: 'Gare Routière Nouvelle de Tanger, Place de la Ligue Arabe', phone: '05 39 30 11 22' },
    { city: 'Marrakech', address: 'Gare Routière Bab Doukkala, Guichet 8', phone: '05 24 43 33 22' },
    { city: 'Rabat', address: 'Gare Routière Kamra, Avenue Hassan II', phone: '05 37 79 55 44' },
    { city: 'Fès', address: 'Gare Routière de Fès, Avenue des Almohades', phone: '05 35 62 10 10' },
    { city: 'Oujda', address: 'Gare Routière Sidi Yahya, Bd Mohammed V', phone: '05 36 68 22 33' },
    { city: 'Laâyoune', address: 'Avenue de la Mecque, Centre-ville, Laâyoune', phone: '05 28 89 44 55' },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Premium Hero Section */}
      <section className="container-app py-12">
        <div className="relative w-full h-[500px] rounded-[40px] overflow-hidden mb-16 shadow-2xl group">
          <img 
            src="https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?q=80&w=2070&auto=format&fit=crop" 
            alt="Messagerie Hero"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-12">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 bg-yellow-400 text-black text-xs font-black uppercase tracking-widest rounded-full mb-4">
                Service Pro & Particulier
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
                <span className="text-yellow-400">Pullman du Sud</span><br/>Messagerie
              </h1>
              <p className="text-white/80 text-lg font-medium max-w-xl leading-relaxed">
                Expédition rapide et sécurisée de colis et marchandises à travers tout le Maroc. Alliez qualité, prix et tranquillité d'esprit avec notre réseau national.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="container-app py-20">
        <div className="bg-white rounded-[48px] border border-gray-100 shadow-2xl overflow-hidden p-8 md:p-12">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Warehouse Image */}
            <div className="lg:w-1/2">
               <div className="rounded-[40px] overflow-hidden shadow-2xl h-[450px] relative">
                 <img 
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" 
                    className="w-full h-full object-cover" 
                    alt="Warehouse" 
                 />
                 <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
               </div>
            </div>

            {/* Form */}
            <div className="lg:w-1/2 w-full">
              <span className="text-blue-600 font-black text-xs uppercase tracking-widest mb-4 inline-block">Contactez-nous</span>
              <h2 className="text-3xl md:text-5xl font-black text-dark mb-8 tracking-tight">Demandez un devis</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Nom complet ou Société" 
                    className="w-full h-14 px-5 rounded-2xl border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none bg-gray-50/50 text-sm font-medium transition-all"
                  />
                  <input 
                    type="text" 
                    placeholder="Sujet de la demande" 
                    className="w-full h-14 px-5 rounded-2xl border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none bg-gray-50/50 text-sm font-medium transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex gap-2">
                    <div className="w-20 h-14 flex items-center justify-center rounded-2xl border border-gray-200 bg-gray-100 text-xs font-black text-gray-500 shrink-0">
                      +212
                    </div>
                    <input 
                      type="text" 
                      placeholder="Numéro WhatsApp" 
                      className="flex-1 h-14 px-5 rounded-2xl border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none bg-gray-50/50 text-sm font-medium transition-all"
                    />
                  </div>
                  <input 
                    type="email" 
                    placeholder="Adresse Email" 
                    className="w-full h-14 px-5 rounded-2xl border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none bg-gray-50/50 text-sm font-medium transition-all"
                  />
                </div>
                <textarea 
                  placeholder="Détaillez votre besoin (poids, volume, destination...)" 
                  rows={5}
                  className="w-full p-5 rounded-2xl border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none bg-gray-50/50 text-sm font-medium resize-none transition-all"
                />
                
                <div className="flex items-start gap-3 py-2">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded text-yellow-500 focus:ring-yellow-500 cursor-pointer" />
                  <p className="text-xs font-semibold text-gray-400 leading-tight">
                    J'accepte que mes données soient traitées conformément à la politique de confidentialité pour répondre à ma demande commerciale.
                  </p>
                </div>

                <Button className="w-full h-14 bg-dark hover:bg-black text-white font-black text-lg rounded-2xl mt-4 shadow-lg transition-transform hover:-translate-y-0.5">
                  Envoyer la demande
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Network Section */}
      <section className="bg-gray-50 py-24 border-t border-gray-100">
        <div className="container-app text-center mb-16">
          <span className="text-blue-600 font-black text-xs uppercase tracking-widest mb-4 inline-block">Couverture Nationale</span>
          <h2 className="text-4xl md:text-5xl font-black text-dark tracking-tight mb-6">Notre réseau d'agences</h2>
          <div className="w-24 h-1.5 bg-yellow-400 mx-auto rounded-full"></div>
        </div>

        <div className="container-app">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Map Placeholder */}
            <div className="lg:w-1/2 w-full sticky top-24">
              <div className="rounded-[40px] overflow-hidden shadow-2xl border border-gray-200 bg-white relative group">
                <div className="absolute inset-0 bg-blue-900/5 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
                <img 
                  src="/images/map-reseau.png" 
                  className="w-full h-auto object-contain" 
                  alt="Carte du réseau Pullman du Sud" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1539650116574-8efeb43e2b50?q=80&w=2070&auto=format&fit=crop";
                  }}
                />
              </div>
            </div>

            {/* Agency List */}
            <div className="lg:w-1/2 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              {agencies.map((agency, i) => (
                <div 
                  key={i} 
                  className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3 group"
                >
                  <h3 className="text-lg font-black text-dark group-hover:text-blue-600 transition-colors">{agency.city}</h3>
                  <div className="flex items-start gap-2">
                    <MapPin className="text-gray-400 shrink-0 mt-0.5" size={16} />
                    <p className="text-xs font-semibold text-gray-500 leading-relaxed">
                      {agency.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-auto pt-2">
                    <Phone className="text-yellow-500" size={16} />
                    <p className="text-sm font-black text-dark tracking-wide">
                      {agency.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
