import { SERVICES } from '#/lib/constants';
import { Bus, Network, Globe, Mail } from 'lucide-react';
import { cn } from '#/lib/utils';

export default function ServicesSection() {
  const getIcon = (name: string) => {
    switch (name) {
      case 'bus': return <Bus size={28} />;
      case 'network': return <Network size={28} />;
      case 'globe': return <Globe size={28} />;
      case 'mail': return <Mail size={28} />;
      default: return null;
    }
  };

  return (
    <section id="services" className="py-24 bg-gray-light/50">
      <div className="container-app">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-dark mb-4">Nos Services</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service, i) => (
            <div 
              key={i} 
              className="bg-white p-8 rounded-2xl border border-gray-border shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform"
                style={{ backgroundColor: service.color }}
              >
                {getIcon(service.icon)}
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">{service.title}</h3>
              <p className="text-sm text-gray-body leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
