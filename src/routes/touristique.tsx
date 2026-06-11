import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { createQuote } from '../api/quotes.api';
import { Button } from '../components/ui/button';
import { PhoneInput } from '../components/ui/phone-input';
import { CheckCircle2, Map, Star } from 'lucide-react';

function TouristiquePage() {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    whatsapp: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createQuote({
        name: formData.name,
        subject: formData.subject,
        whatsapp: formData.whatsapp,
        email: formData.email,
        message: formData.message,
      });
      setSuccess(true);
      setFormData({ name: '', subject: '', whatsapp: '', email: '', message: '' });
    } catch (err) {
      console.error('Quote request failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  const advantages = [
    "Une expérience riche et réussie.",
    "Un parc de transport haut de gamme.",
    "Des ressources humaines impliquées et qualifiées.",
    "Le respect de la réglementation sociale.",
    "La ponctualité et la sécurité sont nos engagements.",
    "Une flexibilité accrue.",
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="container-app py-12">
        <div className="relative w-full h-[500px] rounded-[40px] overflow-hidden mb-16 shadow-2xl group">
          <img
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop"
            alt="Touristique Bus"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-12">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 bg-yellow-400 text-black text-xs font-black uppercase rounded-full mb-4">
                Voyage Sur-Mesure
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
                <span className="text-yellow-400">Pullman du Sud</span><br/>Touristique
              </h1>
              <p className="text-white/80 text-lg font-medium max-w-xl">
                Des solutions de transport haut de gamme pour les hôtels de luxe, entreprises et groupes. Découvrez le Maroc dans un confort absolu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="container-app py-16">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2 w-full order-last md:order-first">
            <span className="text-yellow-600 font-black text-xs uppercase mb-4 inline-block">
              Notre Engagement
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-dark mb-6">On vous amène à votre destination</h2>
            <p className="text-gray-600 font-bold mb-8">
              PULLMAN DU SUD TOURISME a investi dans la qualité du service rendu. Cette qualité passe par :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 mb-8">
              {advantages.map((bullet, i) => (
                <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <CheckCircle2 className="text-yellow-500 shrink-0 mt-0.5" size={20} />
                  <span className="text-sm text-gray-700 font-bold">{bullet}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-500 font-medium p-6 rounded-[24px] border-l-4 border-l-blue-600 bg-white shadow-sm">
              Nos équipes de professionnels vous font bénéficier d'un service de qualité, et assurent vos voyages en toute sécurité.
            </p>
          </div>
          <div className="md:w-1/2 relative h-[500px]">
            <div className="absolute inset-0 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
              <img src="/images/route-atlas.jpg" className="w-full h-full object-cover" alt="Route de l'Atlas Marocain" />
            </div>
          </div>
        </div>
      </section>

      {/* Devis Form */}
      <section className="container-app py-24">
        <div className="bg-white rounded-[48px] p-8 md:p-12 shadow-2xl relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="flex flex-col lg:flex-row gap-16 relative z-10">
            {/* Mosaic Images */}
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
               <div className="space-y-4 mt-8">
                 <div className="rounded-[32px] overflow-hidden shadow-lg h-48 transform transition hover:scale-105 duration-300">
                   <img src="/images/marrakech.jpg" className="w-full h-full object-cover" alt="Marrakech" />
                 </div>
                 <div className="rounded-[32px] overflow-hidden shadow-lg h-64 transform transition hover:scale-105 duration-300">
                   <img src="/images/chefchaouen.jpg" className="w-full h-full object-cover" alt="Chefchaouen" />
                 </div>
               </div>
               <div className="space-y-4">
                 <div className="rounded-[32px] overflow-hidden shadow-lg h-64 transform transition hover:scale-105 duration-300">
                   <img src="/images/casablanca.jpg" className="w-full h-full object-cover" alt="Mosquée Hassan II" />
                 </div>
                 <div className="rounded-[32px] overflow-hidden shadow-lg h-48 transform transition hover:scale-105 duration-300">
                   <img src="/images/essaouira.jpg" className="w-full h-full object-cover" alt="Essaouira" />
                 </div>
               </div>
            </div>
            <div className="lg:w-1/2">
              <span className="text-blue-600 font-black text-xs uppercase mb-4 inline-block">Sur-Mesure</span>
              <h2 className="text-3xl md:text-5xl font-black text-dark mb-8">Demandez un devis</h2>
              {success && (
                <p className="text-green-600 font-medium mb-4">Votre demande a été envoyée avec succès !</p>
              )}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="name"
                    type="text"
                    placeholder="Nom ou Agence"
                    className="w-full h-14 px-5 rounded-2xl border focus:border-yellow-500 bg-gray-50 text-sm"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="subject"
                    type="text"
                    placeholder="Sujet"
                    className="w-full h-14 px-5 rounded-2xl border focus:border-yellow-500 bg-gray-50 text-sm"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PhoneInput
                    name="whatsapp"
                    placeholder="Numéro WhatsApp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Adresse Email"
                    className="w-full h-14 px-5 rounded-2xl border focus:border-yellow-500 bg-gray-50 text-sm"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <textarea
                  name="message"
                  placeholder="Détaillez votre parcours (dates, nombre de passagers, exigences…)"
                  rows={5}
                  className="w-full p-5 rounded-2xl border focus:border-yellow-500 bg-gray-50 text-sm resize-none"
                  value={formData.message}
                  onChange={handleChange}
                />
                <div className="flex items-start gap-3 py-2">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded text-yellow-500" required />
                  <p className="text-xs font-semibold text-gray-400">
                    Je confirme que mes données sont correctes pour qu'un agent commercial puisse me contacter dans les meilleurs délais.
                  </p>
                </div>
                <Button type="submit" disabled={submitting} className="w-full h-14 bg-dark hover:bg-black text-white font-black text-lg rounded-2xl mt-4 shadow-lg">
                  {submitting ? 'Envoi...' : 'Demander un devis'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export const Route = createFileRoute('/touristique')({
  component: TouristiquePage,
});
