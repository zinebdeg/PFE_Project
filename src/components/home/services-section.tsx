import { SERVICES } from '#/lib/constants';
import { Bus, Route, Globe, Package } from 'lucide-react';
import { cn } from '#/lib/utils';

export default function ServicesSection() {
  const getIcon = (name: string) => {
    switch (name) {
      case 'bus': return <Bus size={28} />;
      case 'route': return <Route size={28} />;
      case 'globe': return <Globe size={28} />;
      case 'package': return <Package size={28} />;
      default: return null;
    }
  };

  return (
    <section id="services" className="py-24 bg-white">
      <div className="container-app">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-dark mb-4">Nos Services</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service, i) => (
            <div 
              key={i} 
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 group"
            >
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500"
                style={{ 
                  backgroundColor: `${service.color}20`,
                  color: service.color 
                }}
              >
                {getIcon(service.icon)}
              </div>
              <h3 className="text-xl font-bold text-dark mb-4">{service.title}</h3>
              <p className="text-[15px] text-gray-500 leading-relaxed font-medium">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
