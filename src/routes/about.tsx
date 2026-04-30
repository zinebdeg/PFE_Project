import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="container-app py-8">
        <div className="relative w-full h-[400px] rounded-[32px] overflow-hidden mb-8 shadow-xl">
          <img 
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop" 
            alt="About Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-10">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              Qui sommes-nous
            </h1>
            <svg className="w-20 h-4 mt-2" viewBox="0 0 84 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 12C12.3333 12 18.6667 2 29 2C39.3333 2 45.6667 12 56 12C66.3333 12 72.6667 2 83 2" stroke="#FACC15" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container-app py-16">
        <div className="max-w-5xl">
          <h2 className="text-2xl md:text-4xl font-black text-dark mb-12 leading-[1.1] tracking-tight">
            Une organisation bien rodée pour allier flexibilité et adaptabilité en un temps record
          </h2>
          
          <div className="space-y-10 text-[#4B5563] text-base md:text-[17px] leading-[1.7] font-medium">
            <p>
              Le groupement professionnel GHAZALA est une société de transport spécialisée dans le transport interurbain de voyageurs, 
              le transport touristique, le transport de marchandises et de messagerie express à travers le territoire marocain.
            </p>
            
            <p>
              GHAZALA Transport se nourrie d'une culture basée sur la volonté d'offrir aux clients une qualité de services 
              irréprochables à bon prix. Cette qualité passe par des prospections pour identifier les besoins de nos clients, 
              un travail d'équipe et une grande rigueur à tous les niveaux de la compagnie.
            </p>
            
            <p>
              Les ressources humaines de TRANSPORT GHAZALA ont cumulé une longue expérience dans le domaine du transport et 
              de la messagerie. Grâce à une démarche rigoureuse, basée sur la montée en compétence, formation continue, 
              gestion de carrière, des outils modernes pour sélectionner les bons profils: entretiens multiples, 
              tests psychologiques et psychotechniques, tests de conduite pour les chauffeurs.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
