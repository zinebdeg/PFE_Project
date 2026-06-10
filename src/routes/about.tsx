import { createFileRoute } from '@tanstack/react-router';
import { ShieldCheck, Clock, Users, Bus, Target, Award, Star } from 'lucide-react';

export const Route = createFileRoute('/about')({
  component: AboutPage,
});

function AboutPage() {
  const stats = [
    { label: "Années d'expérience", value: "20+", icon: Clock },
    { label: "Destinations desservies", value: "80+", icon: Bus },
    { label: "Voyageurs par an", value: "1.5M", icon: Users },
    { label: "Taux de satisfaction", value: "98%", icon: Star },
  ];

  const values = [
    {
      title: "Sécurité Absolue",
      description: "Des véhicules de dernière génération soumis à des contrôles rigoureux et des chauffeurs experts régulièrement formés.",
      icon: ShieldCheck,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Qualité & Confort",
      description: "Une flotte moderne offrant un confort optimal pour transformer chaque trajet en une expérience de voyage agréable.",
      icon: Award,
      color: "bg-yellow-50 text-yellow-600"
    },
    {
      title: "Orientation Client",
      description: "Une écoute permanente de vos besoins pour vous offrir un service sur-mesure, réactif et toujours à la hauteur de vos attentes.",
      icon: Target,
      color: "bg-green-50 text-green-600"
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Premium Hero Section */}
      <section className="container-app py-12">
        <div className="relative w-full h-[500px] rounded-[40px] overflow-hidden mb-16 shadow-2xl group">
          <img 
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop" 
            alt="About Hero"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-12">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 bg-yellow-400 text-black text-xs font-black uppercase tracking-widest rounded-full mb-4">
                Notre Histoire
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
                L'excellence du <br/> transport au Maroc.
              </h1>
              <p className="text-white/80 text-lg font-medium max-w-xl leading-relaxed">
                Depuis plus de deux décennies, Pullman du Sud redéfinit les standards du transport interurbain, alliant innovation, confort et sécurité absolue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Mission */}
      <section className="py-16 bg-white">
        <div className="container-app">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-1/2">
              <span className="text-blue-600 font-black text-xs uppercase tracking-widest mb-4 inline-block">Vision & Mission</span>
              <h2 className="text-3xl md:text-5xl font-black text-dark mb-8 leading-tight tracking-tight">
                Une organisation rodée pour allier <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">flexibilité</span> et <span className="relative inline-block"><span className="relative z-10">adaptabilité</span><div className="absolute bottom-2 left-0 w-full h-3 bg-yellow-400/40 -z-10 -rotate-1"></div></span>.
              </h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed font-medium">
                <p>
                  Le groupe Pullman du Sud est le fleuron du transport marocain, spécialisé dans le transport interurbain de voyageurs, le tourisme de luxe, et la messagerie express.
                </p>
                <p>
                  Notre culture d'entreprise est forgée par une volonté inébranlable d'offrir une qualité de service irréprochable. Cette excellence s'obtient par une anticipation constante de vos besoins, un travail d'équipe synergique et une rigueur opérationnelle à tous les niveaux.
                </p>
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full">
              <div className="bg-gray-50 rounded-[32px] p-8 md:p-12 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="text-xl font-black text-dark mb-8 relative z-10">Notre Capital Humain</h3>
                <div className="space-y-8 relative z-10">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
                      <Users className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Expertise Éprouvée</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">Nos équipes cumulent des décennies d'expérience dans la logistique et le transport de personnes.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
                      <Target className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Sélection Rigoureuse</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">Entretiens approfondis, tests psychotechniques et évaluations pratiques pour garantir l'élite.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
                      <Award className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Formation Continue</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">Une montée en compétence permanente pour maintenir nos standards de qualité au plus haut niveau.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop')] opacity-10 object-cover mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-dark/90"></div>
        <div className="container-app relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <stat.icon className="text-yellow-400 mb-4" size={32} strokeWidth={1.5} />
                <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">{stat.value}</div>
                <div className="text-sm font-semibold text-gray-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container-app text-center mb-16">
          <span className="text-blue-600 font-black text-xs uppercase tracking-widest mb-4 inline-block">Nos Valeurs</span>
          <h2 className="text-4xl md:text-5xl font-black text-dark mb-6 tracking-tight">
            Les Piliers de notre Succès
          </h2>
          <div className="w-24 h-1.5 bg-yellow-400 mx-auto rounded-full"></div>
        </div>

        <div className="container-app">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, i) => (
              <div key={i} className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className={`w-16 h-16 rounded-2xl ${val.color} flex items-center justify-center mb-8`}>
                  <val.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-dark mb-4 tracking-tight">{val.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
