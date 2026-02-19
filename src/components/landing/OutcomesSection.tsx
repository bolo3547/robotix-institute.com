const outcomes = [
  { title: 'Problem-Solving', description: 'Break down complex problems and find creative solutions.' },
  { title: 'Technical Skills', description: 'Master robotics and coding with hands-on projects.' },
  { title: 'Leadership', description: 'Collaborate and develop communication skills.' },
  { title: 'Competition Ready', description: 'Prepare for national and international competitions.' },
];

const stats = [
  { value: '95%', label: 'Increase confidence in STEM' },
  { value: '18%', label: 'Average grade improvement' },
  { value: '150+', label: 'Awards won annually' },
];

export default function OutcomesSection() {
  return (
    <section className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Real Outcomes</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Your child develops confidence, skills, and mindset for tomorrow.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {outcomes.map((outcome) => (
            <div
              key={outcome.title}
              className="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900 mb-1">{outcome.title}</h3>
              <p className="text-sm text-gray-600">{outcome.description}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-brand-600 to-accent-600 rounded-xl p-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <p className="text-sm text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
