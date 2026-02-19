const features = [
  { title: 'Progress Tracking', description: 'See what your child learned today.' },
  { title: 'Achievements', description: 'Celebrate badges and milestones.' },
  { title: 'Messaging', description: 'Direct communication with instructors.' },
  { title: 'Schedule', description: 'Class times and reminders.' },
];

export default function DashboardPreviewSection() {
  return (
    <section className="bg-gray-50 border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Parent Dashboard
            </h2>
            <p className="text-gray-600 mb-8">
              Stay connected to your child&apos;s learning journey with real-time 
              updates, achievements, and direct instructor communication.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">{feature.title}</h3>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-xs text-gray-500">Welcome back</p>
                  <h3 className="font-semibold text-gray-900">Parent Dashboard</h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-brand-600">85%</div>
                  <p className="text-xs text-gray-500">Progress</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-gray-900">12</div>
                  <p className="text-xs text-gray-500">Classes</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-gray-900">8</div>
                  <p className="text-xs text-gray-500">Skills</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-gray-900">3</div>
                  <p className="text-xs text-gray-500">Badges</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-success-600">A</div>
                  <p className="text-xs text-gray-500">Grade</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-brand-100 rounded flex items-center justify-center text-brand-600 text-sm">
                    R
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Robot Assembly</p>
                    <p className="text-xs text-gray-500">Completed motor programming</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-success-100 text-success-700 rounded">
                    Done
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-accent-100 rounded flex items-center justify-center text-accent-600 text-sm">
                    P
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Python Functions</p>
                    <p className="text-xs text-gray-500">Building mini-projects</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-brand-100 text-brand-700 rounded">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
