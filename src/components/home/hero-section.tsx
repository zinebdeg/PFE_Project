import SearchForm from '#/components/search/search-form';

export default function HeroSection() {
  return (
    <section className="container-app py-8">
      <div className="flex flex-col md:flex-row gap-8 items-stretch h-auto md:h-[500px]">
        {/* Left: Image Card */}
        <div className="relative flex-1 rounded-[32px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
            style={{ backgroundImage: `url('/hero-canyon.png')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-10 left-10 md:bottom-12 md:left-12 right-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-md rise-in">
              Book Your Bus Tickets in Minutes
            </h1>
          </div>
        </div>
        
        {/* Right: Search Form */}
        <div className="w-full md:w-[420px] flex-shrink-0 flex items-center justify-center">
          <SearchForm />
        </div>
      </div>
    </section>
  );
}
