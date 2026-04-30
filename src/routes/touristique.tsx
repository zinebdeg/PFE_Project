import { createFileRoute } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { useState } from 'react';

export const Route = createFileRoute('/touristique')({
  component: TouristiquePage,
});

function TouristiquePage() {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    whatsapp: '',
    email: '',
    message: '',
  });

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="container-app py-8">
        <div className="relative w-full h-[400px] rounded-[32px] overflow-hidden mb-8 shadow-xl">
          <img 
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop" 
            alt="Touristique Bus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-10">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              <span className="text-yellow-400">Ghazala</span> Touristique
            </h1>
          </div>
        </div>
      </section>

      {/* Content Section 1 */}
      <section className="container-app py-16">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/3 relative h-48 w-full md:h-64">
            <div className="absolute top-0 left-0 w-3/4 h-3/4 rounded-2xl overflow-hidden shadow-lg z-10 border-4 border-white">
               <img src="https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Morocco" />
            </div>
            <div className="absolute bottom-0 right-0 w-3/4 h-3/4 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
               <img src="https://images.unsplash.com/photo-1489493512598-d08130f49bea?q=80&w=2067&auto=format&fit=crop" className="w-full h-full object-cover" alt="Morocco Culture" />
            </div>
          </div>
          <div className="md:w-2/3">
            <h2 className="text-3xl font-black text-dark mb-6 tracking-tight">Découvrir la richesse marocaine</h2>
            <p className="text-gray-body font-medium leading-relaxed">
              Le transport touristique est un service qui été spécialement conçu pour les hôtels de luxe, les entreprises, ainsi que les particuliers, ou groupe de particulier ayant besoin de ce service.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section 2 */}
      <section className="container-app py-16 border-t border-gray-50">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/3 relative h-48 w-full md:h-64 order-first md:order-first">
            <div className="absolute top-0 left-0 w-3/4 h-3/4 rounded-2xl overflow-hidden shadow-lg z-10 border-4 border-white">
               <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop" className="w-full h-full object-cover" alt="Bus Interior" />
            </div>
            <div className="absolute bottom-0 right-0 w-3/4 h-3/4 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
               <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop" className="w-full h-full object-cover" alt="Passengers" />
            </div>
          </div>
          <div className="md:w-2/3">
            <h2 className="text-3xl font-black text-dark mb-6 tracking-tight">On vous amène à votre destination</h2>
            <p className="text-gray-body font-bold mb-4">GHAZALA TOURISME a investi dans la qualité du service rendu. Cette qualité passe par :</p>
            <ul className="space-y-2 mb-6">
              {[
                "Une expérience riche et réussie.",
                "Un parc de transport haut de gamme.",
                "Des ressources humaines impliquées et qualifiées.",
                "Le respect de la réglementation sociale.",
                "La ponctualité et la sécurité sont nos engagements.",
                "Une flexibilité accrue."
              ].map((bullet, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-body font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                  {bullet}
                </li>
              ))}
            </ul>
            <p className="text-gray-body font-medium leading-relaxed">
              Nos équipes de professionnels vous font bénéficier d'un service de qualité, et assurent vos voyages en toute sécurité.
            </p>
          </div>
        </div>
      </section>

      {/* Quote/Devis Section */}
      <section className="container-app py-20">
        <div className="bg-white rounded-[48px] border border-gray-100 shadow-2xl overflow-hidden p-8 md:p-12">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Mosaic Images */}
            <div className="lg:w-1/2 grid grid-cols-3 gap-4">
               <div className="col-span-1" />
               <div className="col-span-1 rounded-2xl overflow-hidden shadow-md h-32">
                 <img src="https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=400" className="w-full h-full object-cover" alt="Desert" />
               </div>
               <div className="col-span-1 rounded-2xl bg-gray-50 h-32" />

               <div className="col-span-1 rounded-2xl overflow-hidden shadow-md h-32">
                 <img src="https://images.unsplash.com/photo-1489493512598-d08130f49bea?q=80&w=400" className="w-full h-full object-cover" alt="Mountains" />
               </div>
               <div className="col-span-1 rounded-2xl bg-gray-50 h-32" />
               <div className="col-span-1 rounded-2xl overflow-hidden shadow-md h-32">
                 <img src="https://images.unsplash.com/photo-1528150177508-7cc0c36cda5c?q=80&w=400" className="w-full h-full object-cover" alt="Forest" />
               </div>

               <div className="col-span-1" />
               <div className="col-span-1 rounded-2xl overflow-hidden shadow-md h-32">
                 <img src="https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=400" className="w-full h-full object-cover" alt="City" />
               </div>
               <div className="col-span-1" />
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
                    Je confirme mes données sont correctes pour qu'on puisse vous contacter dans les meilleurs délais.
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
    </main>
  );
}
