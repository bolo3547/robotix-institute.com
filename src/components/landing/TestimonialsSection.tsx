const testimonials = [
  {
    name: 'Mukamba Chanda',
    text: 'My daughter went from being shy to presenting her robotics project confidently. ROBOTIX transformed her completely!',
    childName: 'Zainab',
    program: 'Robotics Basics',
  },
  {
    name: 'David Mwale',
    text: 'The instructors genuinely care about each child\'s progress. Worth every kwacha!',
    childName: 'Chanda',
    program: 'Advanced Coding',
  },
  {
    name: 'Grace Banda',
    text: 'Outstanding safety protocols. I always know what my son is learning and how he\'s progressing.',
    childName: 'Mulenga',
    program: 'Python Programming',
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">What Parents Say</h2>
          <p className="text-gray-600">Real stories from families who trust us.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-gray-50 p-6 rounded-xl border border-gray-200"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-warning-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-700 mb-6">&ldquo;{testimonial.text}&rdquo;</p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-medium text-sm">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">Parent of {testimonial.childName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
