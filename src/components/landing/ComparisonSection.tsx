const features = [
  'Hands-on robotics and creative coding education',
  'Programs for ages 6-18 (visual coding to Python & C++)',
  'Weekend & after-school programs at schools across Lusaka',
  'Cohort-based learning in partnership with BongoHive',
  'Project-based curriculum: build robots, write code, solve problems',
  'Boosting creativity, confidence & problem-solving skills',
];

export default function ComparisonSection() {
  return (
    <section id="about" className="bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              More Than Traditional Education
            </h2>
            <p className="text-gray-600 mb-8">
              We focus on building skills for tomorrow—problem-solving, creativity, 
              teamwork, and technological fluency.
            </p>

            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-success-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quote Card */}
          <div className="bg-brand-50 rounded-xl p-8 border border-brand-100">
            <blockquote className="text-lg text-gray-700 mb-4">
              &ldquo;Every child learns differently and we&apos;re here for all of them. 
              Empower your child with the skills of the future &mdash; learn programming, 
              build robots, and boost creativity &amp; confidence.&rdquo;
            </blockquote>
            <p className="text-sm text-gray-500">&mdash; Robotix Institute</p>
          </div>
        </div>
      </div>
    </section>
  );
}
