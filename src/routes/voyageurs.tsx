import { createFileRoute } from '@tanstack/react-router';
import { MapPin, Phone, Quote } from 'lucide-react';

export const Route = createFileRoute('/voyageurs')({
  component: VoyageursPage,
});

function VoyageursPage() {
  const agencies = Array.from({ length: 12 }).map((_, i) => ({
    city: 'CASA - DERB MILAN',
    address: 'Hay Omar Ibn El Khattab, Rue 24, N°17',
    phone: '06 66 77 88 99 00',
  }));

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="container-app py-8">
        <div className="relative w-full h-[400px] rounded-[32px] overflow-hidden mb-8 shadow-xl">
          <img 
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop" 
            alt="Ghazala Bus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-10">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              <span className="text-yellow-400">Ghazala</span> voyageurs
            </h1>
          </div>
        </div>

        <div className="max-w-4xl">
          <Quote className="text-yellow-500 mb-4 h-10 w-10 rotate-180" fill="currentColor" />
          <p className="text-lg md:text-xl text-gray-600 italic leading-relaxed font-medium">
            "A cause d'une concurrence accrue, émanant de différents moyens de transport : Avion, train, particulier accrédité. 
            La société transport GHAZALA a investi en une stratégie originale axée sur une qualité absolue et une efficacité sans faille, 
            par ailleurs, cela permettra de se différencier et pérenniser dans le secteur du transport en commun. 
            Notre objectif est avant tout d'assurer un voyage sûr et agréable pour nos clients, réduire en toute sécurité les distances 
            et offrir un service de qualité."
          </p>
        </div>
      </section>

      {/* Network Section */}
      <section className="bg-gray-50 py-20 border-t border-gray-100">
        <div className="container-app text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-dark mb-4 tracking-tight">
            Notre réseau voyageurs
          </h2>
          <p className="text-gray-body max-w-2xl mx-auto font-medium leading-relaxed">
            Proximité, qualité, et fiabilité du service sont des préoccupations constantes de l'ensemble des 
            collaborateurs du réseau dont l'enthousiasme et de servir et satisfaire nos clients.
          </p>
        </div>

        <div className="container-app">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {agencies.map((agency, i) => (
              <div 
                key={i} 
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
              >
                <h3 className="text-sm font-black text-dark tracking-wider uppercase border-b border-gray-50 pb-2">
                  {agency.city}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-yellow-500 shrink-0 mt-0.5" size={16} />
                    <p className="text-xs font-semibold text-gray-500 leading-tight">
                      {agency.address}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="text-yellow-500 shrink-0" size={16} />
                    <p className="text-xs font-bold text-dark">
                      {agency.phone}
                    </p>
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
