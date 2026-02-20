export default function PartnersLogoBar() {
  const partners = [
    { name: 'BongoHive', subtitle: 'Technology & Innovation Hub' },
    { name: 'Stanbic Bank', subtitle: 'Zambia' },
    { name: 'Northmead Primary', subtitle: 'School Partnership' },
    { name: 'Hive Coworking', subtitle: 'Lusaka' },
    { name: 'UNZA', subtitle: 'University of Zambia' },
    { name: 'ZICTA', subtitle: 'ICT Authority' },
  ];

  // Duplicate for seamless loop
  const doubled = [...partners, ...partners];

  return (
    <section className="bg-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest text-center mb-8">
          Trusted by Leading Organizations
        </p>
      </div>

      {/* Infinite marquee */}
      <div className="relative overflow-hidden py-4">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10" />

        <div className="marquee-track">
          {doubled.map((partner, i) => (
            <div
              key={`${partner.name}-${i}`}
              className="flex flex-col items-center justify-center mx-8 sm:mx-12 opacity-60 hover:opacity-100 transition-opacity duration-300 shrink-0"
            >
              <div className="w-14 h-14 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center mb-2">
                <span className="text-sm font-bold text-brand-600">{partner.name.slice(0, 3).toUpperCase()}</span>
              </div>
              <span className="text-[11px] text-gray-600 font-medium text-center leading-tight whitespace-nowrap">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Award badges */}
      <div className="max-w-6xl mx-auto px-6 pb-10">
        <div className="flex flex-wrap justify-center gap-4 mt-6 pt-8 border-t border-gray-200">
          {[
            { icon: '🏆', label: 'Best STEM Initiative 2023' },
            { icon: '⭐', label: 'Top Rated by Parents' },
            { icon: '🎓', label: 'Certified Curriculum' },
            { icon: '🛡️', label: 'Child Safety Certified' },
          ].map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs text-gray-700 font-medium shadow-sm hover:shadow-md hover:border-brand-200 transition-all cursor-default"
            >
              <span className="text-base">{badge.icon}</span>
              {badge.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
