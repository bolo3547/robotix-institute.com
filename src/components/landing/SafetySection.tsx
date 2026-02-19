const safetyFeatures = [
  {
    title: 'Verified Instructors',
    description: 'Background checks and continuous training in child safety protocols.',
  },
  {
    title: 'Real-Time Updates',
    description: 'Live progress updates through our secure parent dashboard.',
  },
  {
    title: 'Small Classes',
    description: 'Maximum 12 students ensures individualized attention.',
  },
  {
    title: 'Secure Data',
    description: 'Enterprise-grade encryption protects your information.',
  },
];

export default function SafetySection() {
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Child&apos;s Safety Comes First
            </h2>
            <p className="text-gray-600 mb-8">
              We maintain the highest standards of safety, security, and transparent 
              communication so you have complete peace of mind.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {safetyFeatures.map((feature) => (
                <div key={feature.title} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-6">Safety Record</h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">Safety incidents</span>
                  <span className="font-semibold text-gray-900">Zero</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-success-500 rounded-full w-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">Parent satisfaction</span>
                  <span className="font-semibold text-gray-900">95%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-brand-500 rounded-full w-[95%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">Instructor certification</span>
                  <span className="font-semibold text-gray-900">100%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-brand-500 rounded-full w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
