export default function PartnersLogoBar() {
  const partners = [
    { name: 'BongoHive', subtitle: 'Technology & Innovation Hub' },
    { name: 'Stanbic Bank', subtitle: 'Zambia' },
    { name: 'Northmead Primary', subtitle: 'School Partnership' },
    { name: 'Hive Coworking', subtitle: 'Lusaka' },
    { name: 'UNZA', subtitle: 'University of Zambia' },
    { name: 'ZICTA', subtitle: 'ICT Authority' },
  ];

  return (
    <section className="bg-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest text-center mb-8">
          Trusted by Leading Organizations
        </p>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex flex-col items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center mb-2">
                <span className="text-sm font-bold text-brand-600">{partner.name.slice(0, 3).toUpperCase()}</span>
              </div>
              <span className="text-[11px] text-gray-600 font-medium text-center leading-tight">{partner.name}</span>
            </div>
          ))}
        </div>

        {/* Award badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-10 pt-8 border-t border-gray-200">
          {[
            { icon: '🏆', label: 'Best STEM Initiative 2023' },
            { icon: '⭐', label: 'Top Rated by Parents' },
            { icon: '🎓', label: 'Certified Curriculum' },
            { icon: '🛡️', label: 'Child Safety Certified' },
          ].map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs text-gray-700 font-medium shadow-sm"
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
