import SearchForm from '#/components/search/search-form';

export default function HeroSection() {
  return (
    <section className="relative w-full h-[500px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: `url('/hero-canyon.png')` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Content */}
      <div className="container-app relative h-full flex flex-col items-center justify-center text-center text-white pb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-2xl rise-in">
          Book Your Bus Tickets in Minutes
        </h1>
        <p className="text-lg md:text-xl font-medium max-w-2xl opacity-90 drop-shadow-lg rise-in delay-100">
          Explorez le Maroc avec confort et facilité. Réservez vos billets auprès des meilleures compagnies de bus.
        </p>
      </div>
    </section>
  );
}
