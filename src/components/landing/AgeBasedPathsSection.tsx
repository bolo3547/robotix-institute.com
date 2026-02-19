const learningPaths = [
  {
    ageRange: '6–9 Years',
    title: 'Foundation',
    skills: ['Block-based coding', 'Basic robotics', 'Problem-solving through play'],
  },
  {
    ageRange: '10–13 Years',
    title: 'Skill Building',
    skills: ['Python & JavaScript', 'Advanced robotics', 'Project-based learning'],
  },
  {
    ageRange: '14–18 Years',
    title: 'Advanced',
    skills: ['Web development', 'AI/ML fundamentals', 'Real-world projects'],
  },
];

export default function AgeBasedPathsSection() {
  return (
    <section className="bg-gray-50 border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Learning Paths</h2>
          <p className="text-gray-600">Programs that grow with your child.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {learningPaths.map((path, index) => (
            <div
              key={path.title}
              className="bg-white p-6 rounded-xl border border-gray-100 hover:border-gray-200 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="text-xs text-gray-500">{path.ageRange}</p>
                  <h3 className="font-semibold text-gray-900">{path.title}</h3>
                </div>
              </div>

              <ul className="space-y-2">
                {path.skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-success-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
