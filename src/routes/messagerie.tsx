import { createFileRoute } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { useState } from 'react';
import { createQuote } from '../api/quotes.api';
import { MapPin, Phone } from 'lucide-react';
import { PhoneInput } from '../components/ui/phone-input';

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
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createQuote({
        type: 'messagerie',
        ...formData
      });
      setSuccess(true);
      setFormData({ name: '', subject: '', whatsapp: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error(error);
    }
  };

  const agencies = [
    { city: 'Casablanca (Siège)', address: '115 Boulevard Brahim Roudani, Casablanca', phone: '05 22 25 49 19' },
    { city: 'Agadir (Messagerie)', address: '44, Avenue Ahmed El Mansour Eddahbi, Cité Dakhla, Agadir', phone: '05 28 23 30 95' },
    { city: 'Agadir (Talborjt)', address: '5, rue Yaacoub Al Mansour, Agadir', phone: '05 28 84 60 40' },
    { city: 'Safi', address: 'Gare Routière de Safi', phone: '05 24 62 28 95' },
    { city: 'Marrakech', address: 'Agence Bab Doukkala (Immeuble Alahbasse), Marrakech', phone: '05 24 43 33 22' },
  ];

  const [selectedAgency, setSelectedAgency] = useState(agencies[0]);

  return (
    <main className="min-h-screen bg-white">
      {/* Premium Hero Section */}
      <section className="container-app py-12">
        <div className="relative w-full h-[500px] rounded-[40px] overflow-hidden mb-16 shadow-2xl group">
          <img 
            src="/images/messagerie-hero.jpg" 
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
                    src="/images/messagerie-entrepot.jpg" 
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
              {success && (
                <p className="text-green-600 font-medium mb-4">Votre demande a été envoyée avec succès !</p>
              )}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nom complet ou Société" 
                    className="w-full h-14 px-5 rounded-2xl border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none bg-gray-50/50 text-sm font-medium transition-all"
                    required
                  />
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Sujet de la demande" 
                    className="w-full h-14 px-5 rounded-2xl border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none bg-gray-50/50 text-sm font-medium transition-all"
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
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Adresse Email" 
                    className="w-full h-14 px-5 rounded-2xl border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none bg-gray-50/50 text-sm font-medium transition-all"
                    required
                  />
                </div>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Détaillez votre besoin (poids, volume, destination...)" 
                  rows={5}
                  className="w-full p-5 rounded-2xl border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none bg-gray-50/50 text-sm font-medium resize-none transition-all"
                  required
                />
                
                <div className="flex items-start gap-3 py-2">
                  <input type="checkbox" required className="mt-1 w-4 h-4 rounded text-yellow-500 focus:ring-yellow-500 cursor-pointer" />
                  <p className="text-xs font-semibold text-gray-400 leading-tight">
                    J'accepte que mes données soient traitées conformément à la politique de confidentialité pour répondre à ma demande commerciale.
                  </p>
                </div>

                <Button type="submit" className="w-full h-14 bg-dark hover:bg-black text-white font-black text-lg rounded-2xl mt-4 shadow-lg transition-transform hover:-translate-y-0.5">
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
            {/* Interactive Map */}
            <div className="lg:w-1/2 w-full sticky top-24">
              <div className="rounded-[40px] overflow-hidden shadow-2xl border border-gray-200 bg-white relative h-[500px] flex items-center justify-center bg-gray-50">
                <iframe 
                  src={`https://www.google.com/maps?q=${encodeURIComponent(selectedAgency.address)}&output=embed`}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                  title="Carte de l'agence"
                ></iframe>
              </div>
            </div>

            {/* Agency List */}
            <div className="lg:w-1/2 w-full grid grid-cols-1 gap-4">
              {agencies.map((agency, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedAgency(agency)}
                  className={`bg-white p-6 rounded-[24px] border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col gap-3 group cursor-pointer ${selectedAgency.city === agency.city ? 'border-yellow-500 ring-2 ring-yellow-500/20' : 'border-gray-100 hover:-translate-y-1'}`}
                >
                  <h3 className={`text-lg font-black transition-colors ${selectedAgency.city === agency.city ? 'text-yellow-600' : 'text-dark group-hover:text-blue-600'}`}>{agency.city}</h3>
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
