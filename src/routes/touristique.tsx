import { createFileRoute } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { useState } from 'react';
import { CheckCircle2, Map, Bus, Star } from 'lucide-react';

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

  const advantages = [
    "Une expérience riche et réussie.",
    "Un parc de transport haut de gamme.",
    "Des ressources humaines impliquées et qualifiées.",
    "Le respect de la réglementation sociale.",
    "La ponctualité et la sécurité sont nos engagements.",
    "Une flexibilité accrue."
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Premium Hero Section */}
      <section className="container-app py-12">
        <div className="relative w-full h-[500px] rounded-[40px] overflow-hidden mb-16 shadow-2xl group">
          <img 
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop" 
            alt="Touristique Bus"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-12">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 bg-yellow-400 text-black text-xs font-black uppercase tracking-widest rounded-full mb-4">
                Voyage Sur-Mesure
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
                <span className="text-yellow-400">Pullman du Sud</span><br/>Touristique
              </h1>
              <p className="text-white/80 text-lg font-medium max-w-xl leading-relaxed">
                Des solutions de transport haut de gamme pour les hôtels de luxe, entreprises et groupes. Découvrez le Maroc dans un confort absolu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section 1 */}
      <section className="container-app py-16">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2 relative h-[400px] w-full group">
            <div className="absolute top-0 left-0 w-2/3 h-2/3 rounded-[32px] overflow-hidden shadow-2xl z-10 border-8 border-white transition-transform duration-500 group-hover:-translate-y-4 group-hover:-translate-x-4">
               <img src="https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Ouarzazate Kasbah" />
            </div>
            <div className="absolute bottom-0 right-0 w-2/3 h-2/3 rounded-[32px] overflow-hidden shadow-2xl border-8 border-white transition-transform duration-500 group-hover:translate-y-4 group-hover:translate-x-4">
               <img src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Marrakech Koutoubia" />
            </div>
          </div>
          <div className="md:w-1/2 w-full">
            <span className="text-blue-600 font-black text-xs uppercase tracking-widest mb-4 inline-block">Évasion & Découverte</span>
            <h2 className="text-4xl md:text-5xl font-black text-dark mb-6 tracking-tight leading-tight">
              Découvrir la <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">richesse</span> marocaine
            </h2>
            <p className="text-gray-500 text-lg font-medium leading-relaxed mb-8">
              Notre service de transport touristique est spécialement conçu pour répondre aux exigences des hôtels de luxe, des entreprises, ainsi que des groupes de particuliers souhaitant voyager dans des conditions optimales.
            </p>
            <div className="flex gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Map size={24} />
                </div>
                <span className="font-bold text-dark">Circuits VIP</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                  <Star size={24} />
                </div>
                <span className="font-bold text-dark">Flotte Luxe</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section 2 */}
      <section className="bg-gray-50 py-24 border-y border-gray-100">
        <div className="container-app">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2 w-full order-last md:order-first">
              <span className="text-yellow-600 font-black text-xs uppercase tracking-widest mb-4 inline-block">Notre Engagement</span>
              <h2 className="text-4xl md:text-5xl font-black text-dark mb-6 tracking-tight leading-tight">On vous amène à votre destination</h2>
              <p className="text-gray-600 font-bold mb-8 text-lg">PULLMAN DU SUD TOURISME a investi dans la qualité du service rendu. Cette qualité passe par :</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 mb-8">
                {advantages.map((bullet, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <CheckCircle2 className="text-yellow-500 shrink-0 mt-0.5" size={20} />
                    <span className="text-sm text-gray-700 font-bold leading-snug">{bullet}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-500 font-medium leading-relaxed bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm border-l-4 border-l-blue-600">
                Nos équipes de professionnels vous font bénéficier d'un service de qualité, et assurent vos voyages en toute sécurité.
              </p>
            </div>
            <div className="md:w-1/2 relative h-[500px] w-full">
              <div className="absolute inset-0 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
                 <img src="https://images.unsplash.com/photo-1535565454739-863432ea3c0e?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Route de l'Atlas Marocain" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote/Devis Section */}
      <section className="container-app py-24">
        <div className="bg-white rounded-[48px] border border-gray-100 shadow-2xl overflow-hidden p-8 md:p-12 relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row gap-16 relative z-10">
            {/* Mosaic Images (Maroc Authentique) */}
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
               <div className="space-y-4 mt-8">
                 <div className="rounded-[32px] overflow-hidden shadow-lg h-48 transform transition hover:scale-105 duration-300">
                   <img src="https://images.unsplash.com/photo-1553604085-f6749ecba0bd?q=80&w=400" className="w-full h-full object-cover" alt="Sahara Merzouga" />
                 </div>
                 <div className="rounded-[32px] overflow-hidden shadow-lg h-64 transform transition hover:scale-105 duration-300">
                   <img src="https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?q=80&w=400" className="w-full h-full object-cover" alt="Chefchaouen" />
                 </div>
               </div>
               <div className="space-y-4">
                 <div className="rounded-[32px] overflow-hidden shadow-lg h-64 transform transition hover:scale-105 duration-300">
                   <img src="https://images.unsplash.com/photo-1542052125323-e69ad37a47c2?q=80&w=400" className="w-full h-full object-cover" alt="Mosquée Hassan II" />
                 </div>
                 <div className="rounded-[32px] overflow-hidden shadow-lg h-48 transform transition hover:scale-105 duration-300">
                   <img src="https://images.unsplash.com/photo-1563223771-5911da217bb7?q=80&w=400" className="w-full h-full object-cover" alt="Essaouira" />
                 </div>
               </div>
            </div>

            {/* Form */}
            <div className="lg:w-1/2">
              <span className="text-blue-600 font-black text-xs uppercase tracking-widest mb-4 inline-block">Sur-Mesure</span>
              <h2 className="text-3xl md:text-5xl font-black text-dark mb-8 tracking-tight">Demandez un devis</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Nom ou Agence" 
                    className="w-full h-14 px-5 rounded-2xl border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none bg-gray-50/50 text-sm font-medium transition-all"
                  />
                  <input 
                    type="text" 
                    placeholder="Destination(s)" 
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
                  placeholder="Détaillez votre parcours (dates, nombre de passagers, exigences...)" 
                  rows={5}
                  className="w-full p-5 rounded-2xl border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none bg-gray-50/50 text-sm font-medium resize-none transition-all"
                />
                
                <div className="flex items-start gap-3 py-2">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded text-yellow-500 focus:ring-yellow-500 cursor-pointer" />
                  <p className="text-xs font-semibold text-gray-400 leading-tight">
                    Je confirme que mes données sont correctes pour qu'un agent commercial puisse me contacter dans les meilleurs délais.
                  </p>
                </div>

                <Button className="w-full h-14 bg-dark hover:bg-black text-white font-black text-lg rounded-2xl mt-4 shadow-lg transition-transform hover:-translate-y-0.5">
                  Demander un devis
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
