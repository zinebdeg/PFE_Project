import { createFileRoute } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { useState } from 'react';

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
    { city: 'Casablanca', address: 'Hay Omar Ibn El Khattab, Rue 24, N°17', phone: '06 66 77 88 99 00' },
    { city: 'Agadir', address: 'Hay Omar Ibn El Khattab, Rue 24, N°17', phone: '06 66 77 88 99 00' },
    { city: 'Tanger', address: 'Hay Omar Ibn El Khattab, Rue 24, N°17', phone: '06 66 77 88 99 00' },
    { city: 'Rabat', address: 'Hay Omar Ibn El Khattab, Rue 24, N°17', phone: '06 66 77 88 99 00' },
    { city: 'Tanger', address: 'Hay Omar Ibn El Khattab, Rue 24, N°17', phone: '06 66 77 88 99 00' },
    { city: 'Rabat', address: 'Hay Omar Ibn El Khattab, Rue 24, N°17', phone: '06 66 77 88 99 00' },
    { city: 'Tanger', address: 'Hay Omar Ibn El Khattab, Rue 24, N°17', phone: '06 66 77 88 99 00' },
    { city: 'Rabat', address: 'Hay Omar Ibn El Khattab, Rue 24, N°17', phone: '06 66 77 88 99 00' },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="container-app py-8">
        <div className="relative w-full h-[400px] rounded-[32px] overflow-hidden mb-8 shadow-xl">
          <img 
            src="https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?q=80&w=2070&auto=format&fit=crop" 
            alt="Messagerie Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-10">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              <span className="text-yellow-400">Ghazala</span> Messagerie
            </h1>
          </div>
        </div>

        <div className="max-w-4xl">
          <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed">
            Particulier ou professionnel, la société GHAZALA Messagerie Express vous assure un envoi de colis, palettes et tous types de marchandises à travers différentes destinations sur le territoire marocain. Alliant à la fois qualité et prix, la société GHAZALA Messagerie Express permet un envoi rapide et sécurisé. De même nous proposons des solutions adaptées aux besoins de tous nos clients afin de les satisfaire quel que soit leur domaine d'activité.
          </p>
        </div>
      </section>

      {/* Quote Section */}
      <section className="container-app py-20">
        <div className="bg-white rounded-[48px] border border-gray-100 shadow-2xl overflow-hidden p-8 md:p-12">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Warehouse Image */}
            <div className="lg:w-1/2">
               <div className="rounded-[40px] overflow-hidden shadow-2xl h-[450px]">
                 <img 
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" 
                    className="w-full h-full object-cover" 
                    alt="Warehouse" 
                 />
               </div>
            </div>

            {/* Form */}
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-black text-dark mb-8 tracking-tight">Demandez un devis</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Nom" 
                    className="w-full h-12 px-5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none bg-gray-50/50 text-sm font-medium"
                  />
                  <input 
                    type="text" 
                    placeholder="Sujet" 
                    className="w-full h-12 px-5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none bg-gray-50/50 text-sm font-medium"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex gap-2">
                    <div className="w-20 h-12 flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50/50 text-xs font-bold text-gray-500">
                      +212
                    </div>
                    <input 
                      type="text" 
                      placeholder="WhatsApp" 
                      className="flex-1 h-12 px-5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none bg-gray-50/50 text-sm font-medium"
                    />
                  </div>
                  <input 
                    type="email" 
                    placeholder="Adresse Email" 
                    className="w-full h-12 px-5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none bg-gray-50/50 text-sm font-medium"
                  />
                </div>
                <textarea 
                  placeholder="Message" 
                  rows={5}
                  className="w-full p-5 rounded-2xl border border-gray-200 focus:border-yellow-500 focus:outline-none bg-gray-50/50 text-sm font-medium resize-none"
                />
                
                <div className="flex items-start gap-3 py-2">
                  <input type="checkbox" className="mt-1 accent-yellow-500" />
                  <p className="text-[11px] font-semibold text-gray-400 leading-tight">
                    J'accepte que mes données soient traitées conformément à la politique de confidentialité pour répondre à ma demande.
                  </p>
                </div>

                <Button className="w-full h-14 bg-dark hover:bg-dark/90 text-white font-black text-lg rounded-2xl mt-4">
                  Envoyer
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Network Section */}
      <section className="bg-gray-50 py-20 border-t border-gray-100">
        <div className="container-app text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-dark tracking-tight">Nos réseaux</h2>
        </div>

        <div className="container-app">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Map Placeholder */}
            <div className="lg:w-1/2">
              <div className="rounded-[40px] overflow-hidden shadow-xl border border-gray-200 bg-white">
                <img 
                  src="/images/map-reseau.png" 
                  className="w-full h-auto object-contain" 
                  alt="Notre réseau" 
                />
              </div>
            </div>

            {/* Agency List */}
            <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {agencies.map((agency, i) => (
                <div 
                  key={i} 
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-2"
                >
                  <h3 className="text-sm font-black text-dark">{agency.city}</h3>
                  <p className="text-[11px] font-semibold text-gray-500 leading-tight">
                    {agency.address}
                  </p>
                  <p className="text-[11px] font-bold text-dark">
                    {agency.phone}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
