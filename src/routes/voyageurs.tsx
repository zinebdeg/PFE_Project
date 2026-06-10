import { createFileRoute } from '@tanstack/react-router';
import { MapPin, Phone, Quote } from 'lucide-react';

export const Route = createFileRoute('/voyageurs')({
  component: VoyageursPage,
});

function VoyageursPage() {
  const agencies = [
    { city: 'Casablanca - Centre', address: 'Gare Routière Ouled Ziane, Bureau N°12', phone: '05 22 44 55 66' },
    { city: 'Rabat - Agdal', address: 'Avenue de France, Agence Rabat Agdal', phone: '05 37 66 77 88' },
    { city: 'Marrakech - Gueliz', address: 'Rue de Serbie, Face à la Gare Ferroviaire', phone: '05 24 33 44 55' },
    { city: 'Tanger - Port', address: 'Avenue Mohammed VI, Résidence Al Manar', phone: '05 39 99 88 77' },
    { city: 'Agadir - Al Massira', address: 'Gare Routière Inezgane, Bureau N°5', phone: '05 28 22 33 44' },
    { city: 'Fès - Ville Nouvelle', address: 'Place Florence, Avenue des FAR', phone: '05 35 66 55 44' },
    { city: 'Meknès - Hamria', address: 'Avenue Mohammed V, Immeuble Volubilis', phone: '05 35 55 44 33' },
    { city: 'Oujda - Centre', address: 'Boulevard Mohammed V, Agence Oujda', phone: '05 36 66 77 88' },
    { city: 'Tétouan - Wilaya', address: 'Avenue de la Wilaya, Résidence El Khalil', phone: '05 39 77 66 55' },
    { city: 'Kénitra - Ville', address: 'Avenue Mohammed V, Proche de la Poste', phone: '05 37 33 22 11' },
    { city: 'Laâyoune - Centre', address: 'Avenue Mekka, Résidence Sahara', phone: '05 28 88 99 00' },
    { city: 'Nador - Port', address: 'Boulevard Prince Sidi Mohammed, Nador', phone: '05 36 33 44 55' },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Premium Feel */}
      <section className="container-app py-12">
        <div className="relative w-full h-[500px] rounded-[40px] overflow-hidden mb-12 shadow-2xl group">
          <img 
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop" 
            alt="Pullman du Sud Bus"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-12">
            <div className="max-w-2xl">
              <span className="inline-block px-4 py-1.5 bg-yellow-400 text-black text-xs font-black uppercase tracking-widest rounded-full mb-4">
                Expérience Premium
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4">
                <span className="text-yellow-400 italic">PULLMAN DU SUD</span><br/>VOYAGEURS
              </h1>
              <p className="text-white/80 text-lg font-medium max-w-lg">
                Redéfinir le voyage en car au Maroc avec un confort absolu et une sécurité sans compromis.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl relative">
          <Quote className="text-yellow-500/20 absolute -top-10 -left-10 h-32 w-32 -z-10" fill="currentColor" />
          <p className="text-xl md:text-2xl text-gray-700 italic leading-relaxed font-semibold">
            "Notre stratégie est axée sur une <span className="text-dark underline decoration-yellow-400 decoration-4">qualité absolue</span> et une efficacité sans faille. 
            Nous investissons pour nous différencier et pérenniser notre leadership. 
            Notre objectif : assurer un voyage sûr et agréable pour nos clients, tout en réduisant les distances en toute sécurité."
          </p>
          <div className="mt-6 flex items-center gap-4">
            <div className="w-12 h-px bg-yellow-400"></div>
            <span className="text-sm font-black uppercase tracking-widest text-dark">Direction Générale</span>
          </div>
        </div>
      </section>

      {/* Network Section with Enhanced Grid */}
      <section className="bg-gray-50 py-24 border-t border-gray-100">
        <div className="container-app text-center mb-20">
          <span className="text-blue-600 font-black text-xs uppercase tracking-widest mb-4 inline-block">Proximité & Service</span>
          <h2 className="text-4xl md:text-5xl font-black text-dark mb-6 tracking-tight">
            Notre Réseau National
          </h2>
          <div className="w-24 h-1.5 bg-yellow-400 mx-auto mb-8 rounded-full"></div>
          <p className="text-gray-body max-w-2xl mx-auto font-medium text-lg leading-relaxed">
            Un réseau d'agences modernes réparties sur tout le royaume pour vous servir avec enthousiasme et professionnalisme.
          </p>
        </div>

        <div className="container-app">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {agencies.map((agency, i) => (
              <div 
                key={i} 
                className="group bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col gap-6"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-base font-black text-dark tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                    {agency.city}
                  </h3>
                  <div className="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <MapPin size={18} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 shrink-0"></div>
                    <p className="text-sm font-medium text-gray-500 leading-snug">
                      {agency.address}
                    </p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="text-blue-600" size={14} />
                      <span className="text-xs font-black text-dark tracking-tighter">{agency.phone}</span>
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">
                      Appeler
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
