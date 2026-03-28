import { STATS } from '#/lib/constants';

export default function StatsSection() {
  return (
    <section className="py-20 bg-white border-b border-gray-border">
      <div className="container-app">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {STATS.map((stat, i) => (
            <div key={i} className="flex flex-col gap-2 group animate-in slide-in-from-bottom border-r border-gray-border last:border-r-0">
              <span className="text-xs font-bold text-gray-body uppercase tracking-widest">{stat.label}</span>
              <span className="text-5xl font-extrabold text-dark group-hover:text-primary transition-colors">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
