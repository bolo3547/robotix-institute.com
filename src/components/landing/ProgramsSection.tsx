import Link from 'next/link';

const programs = [
  {
    id: 1,
    name: 'Little Einsteins',
    ageGroup: 'Pre-Elementary (Ages 4-6)',
    level: 'Beginner',
    description: 'Introduction to robotics and coding concepts through play-based learning for our youngest learners.',
    highlights: ['Play-based learning', 'Motor skills development', 'Basic problem solving'],
    price: '2,500',
  },
  {
    id: 2,
    name: 'Byte Buddies',
    ageGroup: 'Ages 7-10',
    level: 'Beginner',
    description: 'Fun introduction to coding and robotics with block-based programming and hands-on activities.',
    highlights: ['Block-based coding', 'Simple robotics', 'Creative projects'],
    price: '3,000',
  },
  {
    id: 3,
    name: 'Imagineering',
    ageGroup: 'Ages 11-14',
    level: 'Intermediate',
    description: 'Advanced robotics with sensors (IR, LDR, ultrasonic), drones, and introduction to AI & IoT.',
    highlights: ['Advanced sensors', 'Drone programming', 'AI & IoT basics'],
    price: '3,500',
  },
  {
    id: 4,
    name: 'Code Quest',
    ageGroup: 'Ages 15-18',
    level: 'Advanced',
    description: 'Script-based coding with Python and advanced programming concepts for high school students.',
    highlights: ['Python programming', 'Text-based coding', 'Real-world projects'],
    price: '4,000',
  },
  {
    id: 5,
    name: 'Summer Camps',
    ageGroup: 'All Ages',
    level: 'All Levels',
    description: 'Exciting summer camps with programming, robotics, and game development during school holidays.',
    highlights: ['Holiday programs', 'Game development', 'Team projects'],
    price: '2,000',
  },
  {
    id: 6,
    name: 'Community Initiatives',
    ageGroup: 'All Ages',
    level: 'All Levels',
    description: 'Programs for underserved communities including public schools and orphanages through the Lazarus Project.',
    highlights: ['Public school programs', 'Lazarus Project', 'Digital literacy'],
    price: 'Free',
  },
];

export default function ProgramsSection() {
  return (
    <section id="programs" className="bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Programs</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            From robotics basics to advanced AI, find the perfect program for your child.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                    {program.name}
                  </h3>
                  <p className="text-sm text-gray-500">{program.ageGroup}</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  {program.level}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4">{program.description}</p>

              <ul className="space-y-1.5 mb-5">
                {program.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-success-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {highlight}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <span className="text-lg font-bold text-gray-900">{program.price}</span>
                  <span className="text-sm text-gray-500"> ZMW/mo</span>
                </div>
                <Link 
                  href="/auth/signup" 
                  className="text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  Enroll →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
