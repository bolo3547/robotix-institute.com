const trustStats = [
  { value: '2,500+', label: 'Students Trained' },
  { value: '8+ Years', label: 'Experience' },
  { value: '95%', label: 'Parent Satisfaction' },
  { value: '6', label: 'Awards Won' },
];

export default function TrustSection() {
  return (
    <section className="bg-gray-50 border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Trusted by Families</h2>
          <p className="text-gray-600">Empowering young minds since 2016</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
