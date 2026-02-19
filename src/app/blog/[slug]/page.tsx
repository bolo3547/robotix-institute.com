'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, Tag, Share2, BookOpen } from 'lucide-react';

const posts = [
  {
    id: 1,
    slug: 'why-every-child-in-zambia-should-learn-to-code',
    title: 'Why Every Child in Zambia Should Learn to Code',
    excerpt: 'In the digital age, coding is becoming as fundamental as reading and writing. Here\'s why starting early gives children a massive advantage...',
    category: 'Parent Guide',
    date: '2026-01-28',
    readTime: '5 min',
    image: '/robotix1.jpg',
    featured: true,
    content: `
In an increasingly digital world, coding has become one of the most valuable skills a child can learn. For children in Zambia, learning to code opens doors to global opportunities and helps bridge the digital divide.

## The Digital Revolution in Africa

Africa is experiencing a technology boom, with tech hubs emerging across the continent. Zambia is no exception — from fintech startups to e-government initiatives, technology is reshaping how we live and work. Children who learn to code today will be the innovators and leaders of tomorrow.

## Why Start Early?

Research shows that children who learn programming concepts before age 12 develop stronger problem-solving skills, logical thinking, and creativity. Just like learning a second language, starting early makes the process more natural and enjoyable.

### Key Benefits of Coding for Kids:

- **Critical Thinking**: Coding teaches children to break complex problems into smaller, manageable parts.
- **Creativity**: Building apps, games, and robots allows children to express their ideas in new ways.
- **Resilience**: Debugging code teaches patience and perseverance — skills that transfer to every area of life.
- **Future-proofing**: Technology jobs are among the fastest-growing sectors globally.

## How Robotix Institute Makes It Fun

At Robotix Institute, we believe coding should be exciting, not intimidating. Our programs combine hands-on robotics with programming languages like Scratch and Python, making abstract concepts tangible and fun.

> "My daughter went from being afraid of computers to building her own robot in just three months." — Parent testimonial

## Getting Started

Whether your child is 6 or 16, there's a perfect starting point. Our age-appropriate programs ensure every child learns at their own pace while having a blast. [Contact us](/contact) to find out which program is right for your child.
    `,
  },
  {
    id: 2,
    slug: '5-robotics-projects-kids-can-build-at-home',
    title: '5 Robotics Projects Kids Can Build at Home',
    excerpt: 'You don\'t need expensive equipment to get started with robotics. Here are 5 fun projects using everyday materials...',
    category: 'Robotics',
    date: '2026-01-20',
    readTime: '7 min',
    image: '/robotix3.jpg',
    featured: false,
    content: `
Robotics doesn't have to be expensive or complicated. With a few household items and a bit of creativity, your child can start building amazing robots right at home!

## 1. Bristlebot — The Vibrating Robot

**Materials needed**: Toothbrush head, small vibrating motor (from an old phone), coin battery, tape.

This simple robot uses vibration to move across surfaces in unpredictable patterns. It's a great introduction to how motors and energy work.

## 2. Cardboard Robotic Arm

**Materials needed**: Cardboard, string, straws, tape, scissors.

Build a working robotic arm that uses strings as tendons to grip and move objects. This project teaches mechanical engineering principles.

## 3. Light-Following Robot

**Materials needed**: Basic Arduino kit, light sensors, motors, wheels.

For kids who are ready for electronics, this project introduces sensors and basic programming. The robot follows a flashlight beam!

## 4. Recycled Material Robot

**Materials needed**: Plastic bottles, bottle caps, straws, rubber bands, any recycled materials.

Let creativity run wild! The goal is to build a robot sculpture and then figure out how to make it move using simple mechanisms.

## 5. Paper Circuit Greeting Card

**Materials needed**: Paper, copper tape, LED, coin battery.

While not strictly a robot, this project introduces electrical circuits in a fun, creative way. Kids can design greeting cards that light up!

## Tips for Parents

- Let your child lead — the learning is in the process, not just the result.
- Take photos and videos to document the journey.
- Join our weekend workshops if you'd like guided support!
    `,
  },
  {
    id: 3,
    slug: 'robotix-institute-wins-best-stem-initiative-2025',
    title: 'Robotix Institute Wins Best STEM Initiative 2025',
    excerpt: 'We\'re proud to announce that Robotix Institute has been awarded the Best STEM Initiative at the Zambia Education Awards...',
    category: 'News',
    date: '2026-01-15',
    readTime: '3 min',
    image: '/students2.jpg',
    featured: false,
    content: `
We are thrilled to share that Robotix Institute has been awarded the **Best STEM Initiative 2025** at the prestigious Zambia Education Awards ceremony!

## A Proud Moment

This award recognizes our commitment to making quality STEM education accessible to children across Zambia. Since our founding, we've trained over 500 students in robotics, coding, and engineering — and we're just getting started.

## What This Means

This recognition validates the hard work of our incredible team of instructors, the dedication of our students, and the trust placed in us by parents and guardians across the country.

## Our Impact in Numbers

- **500+** students trained
- **15+** schools partnered with
- **50+** robots built by students
- **3** national competition wins

## Looking Ahead

This award motivates us to dream bigger. In 2026, we plan to:

- Expand to 5 new locations across Zambia
- Launch online courses for remote learners
- Host the first Zambia Youth Robotics Championship
- Introduce AI and Machine Learning courses for teens

Thank you to everyone who has been part of this journey. The best is yet to come!
    `,
  },
  {
    id: 4,
    slug: 'python-vs-scratch-which-should-your-child-learn-first',
    title: 'Python vs Scratch: Which Should Your Child Learn First?',
    excerpt: 'Both are excellent starting points, but the right choice depends on your child\'s age and learning style...',
    category: 'Coding',
    date: '2026-01-10',
    readTime: '6 min',
    image: '/ai-learning.jpg',
    featured: false,
    content: `
One of the most common questions parents ask us is: "Should my child learn Scratch or Python first?" The answer depends on several factors.

## What is Scratch?

Scratch is a visual programming language developed by MIT. Instead of typing code, children drag and drop colorful blocks to create programs. It's designed for ages 8-16 and is perfect for beginners.

### Scratch is great for:
- Children ages 6-12
- Visual learners
- Kids who love games and animation
- Building confidence with technology

## What is Python?

Python is a text-based programming language used by professionals worldwide — from web developers to data scientists to NASA engineers. It's known for its clean, readable syntax.

### Python is great for:
- Children ages 10 and above
- Kids who are comfortable with typing
- Students who want to build real-world projects
- Preparation for career in technology

## Our Recommendation

**Ages 6-9**: Start with Scratch. The visual blocks make programming concepts intuitive and fun.

**Ages 10-12**: Start with Scratch, then transition to Python. This gives a solid foundation before tackling text-based coding.

**Ages 13+**: Jump straight into Python if they're motivated. Otherwise, a quick Scratch introduction can help build confidence.

## The Robotix Approach

At Robotix Institute, we don't believe in one-size-fits-all. Our instructors assess each child's readiness and create a personalized learning path. Many of our students start with Scratch and naturally progress to Python within months.

The most important thing? **Just start.** The best programming language for your child is the one that gets them excited to learn.
    `,
  },
  {
    id: 5,
    slug: 'how-stem-education-bridges-the-digital-divide-in-africa',
    title: 'How STEM Education Bridges the Digital Divide in Africa',
    excerpt: 'Access to quality STEM education is key to empowering the next generation of African innovators and creators...',
    category: 'STEM Tips',
    date: '2026-01-05',
    readTime: '8 min',
    image: '/digital-divide.jpg',
    featured: false,
    content: `
The digital divide — the gap between those who have access to technology and those who don't — remains one of Africa's biggest challenges. But STEM education is emerging as a powerful bridge.

## Understanding the Digital Divide

In Zambia, only about 30% of the population has regular internet access. In rural areas, that number drops dramatically. This disparity affects education, employment, and economic growth.

## How STEM Education Helps

### 1. Building Local Talent

Instead of relying on imported technology solutions, STEM education empowers young Zambians to create their own. When children learn to code and build robots, they learn to solve local problems with local solutions.

### 2. Creating Economic Opportunities

The global demand for tech talent continues to outpace supply. Young Africans with STEM skills can access remote jobs, freelance opportunities, and entrepreneurial ventures that weren't possible a decade ago.

### 3. Fostering Innovation

Some of the most innovative tech solutions globally have come from Africa — M-Pesa (mobile money), Ushahidi (crisis mapping), and more. The next breakthrough could come from a Zambian child learning to code today.

## Challenges We Face

- Limited infrastructure in rural areas
- Shortage of qualified STEM teachers
- Cost of equipment and technology
- Cultural barriers and gender gaps

## What Robotix Institute Is Doing

We're committed to making STEM education accessible:

- **Scholarship programs** for underprivileged students
- **Mobile labs** that bring robotics to rural schools
- **Teacher training** programs to build capacity
- **Girls in STEM** initiatives to close the gender gap

## How You Can Help

Every child deserves access to quality STEM education. You can support our mission by:

- Enrolling your child in our programs
- Sponsoring a student's education
- Volunteering your skills
- Spreading the word

Together, we can bridge the digital divide — one child at a time.
    `,
  },
  {
    id: 6,
    slug: 'preparing-your-child-for-robotics-competitions',
    title: 'Preparing Your Child for Robotics Competitions',
    excerpt: 'From First LEGO League to World Robot Olympiad — a parent\'s complete guide to competitive robotics...',
    category: 'Parent Guide',
    date: '2025-12-28',
    readTime: '10 min',
    image: '/team1.jpg',
    featured: false,
    content: `
Robotics competitions are one of the most exciting and educational experiences a child can have. Here's everything you need to know to get your child started.

## Why Compete?

Competitions push students beyond their comfort zones and accelerate learning. Benefits include:

- **Teamwork**: Most competitions require teams, teaching collaboration and communication.
- **Time Management**: Working toward a deadline builds discipline.
- **Real-world Skills**: Presenting projects to judges builds public speaking confidence.
- **Networking**: Children meet peers from around the world who share their interests.

## Major Competitions

### First LEGO League (FLL)
- **Ages**: 9-16
- **Focus**: Building and programming LEGO robots to complete challenges
- **How to enter**: Through Robotix Institute's competition teams

### World Robot Olympiad (WRO)
- **Ages**: 8-19
- **Focus**: Creative robot design and programming challenges
- **How to enter**: National qualifiers held annually in Zambia

### RoboCup Junior
- **Ages**: Up to 19
- **Focus**: Robot soccer, rescue, and on-stage performance
- **How to enter**: Regional competitions lead to national and international rounds

## How to Prepare

### 3-6 Months Before
- Join a robotics team or club
- Master basic programming (Scratch or Python)
- Practice building and testing robots regularly

### 1-3 Months Before
- Focus on the specific competition rules and challenges
- Build and iterate on your robot design
- Practice presentations and documentation

### Competition Week
- Test everything multiple times
- Pack spare parts and tools
- Get a good night's sleep!

## The Robotix Competitive Edge

Our competition preparation program includes:

- Weekly practice sessions with competition-experienced mentors
- Access to competition-grade equipment and parts
- Mock competitions to build confidence
- Travel support for national and international events

## Getting Started

Interested in competitive robotics? [Contact us](/contact) to learn about our competition teams and upcoming tryouts.
    `,
  },
];

function renderContent(content: string) {
  // Simple markdown-lite renderer for blog content
  const lines = content.trim().split('\n');
  const elements: JSX.Element[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="list-disc list-inside space-y-2 text-gray-600 mb-6 pl-4">
          {listItems.map((item, i) => {
            const boldMatch = item.match(/^\*\*(.*?)\*\*:?\s*(.*)/);
            if (boldMatch) {
              return (
                <li key={i}>
                  <strong className="text-gray-800">{boldMatch[1]}</strong>{boldMatch[2] ? `: ${boldMatch[2]}` : ''}
                </li>
              );
            }
            return <li key={i}>{item}</li>;
          })}
        </ul>
      );
      listItems = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('- ')) {
      listItems.push(trimmed.slice(2));
      continue;
    }

    flushList();

    if (trimmed === '') continue;

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-xl font-bold text-gray-800 mt-8 mb-3">
          {trimmed.slice(4)}
        </h3>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-2xl font-bold text-gray-900 mt-10 mb-4">
          {trimmed.slice(3)}
        </h2>
      );
    } else if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote key={key++} className="border-l-4 border-accent-400 pl-6 py-2 italic text-gray-600 bg-accent-50/30 rounded-r-lg my-6">
          {trimmed.slice(2)}
        </blockquote>
      );
    } else {
      // Inline bold and link processing
      const processed = trimmed
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-accent-500 hover:text-accent-400 underline">$1</a>');
      elements.push(
        <p key={key++} className="text-gray-600 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: processed }} />
      );
    }
  }

  flushList();
  return elements;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <main className="min-h-screen bg-gray-50 pt-32 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/blog" className="text-accent-500 hover:text-accent-400 font-semibold">
            &larr; Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  const relatedPosts = posts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 2);
  if (relatedPosts.length === 0) {
    const otherPosts = posts.filter((p) => p.id !== post.id).slice(0, 2);
    relatedPosts.push(...otherPosts);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <section className="relative h-[400px] w-full">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-3xl mx-auto">
            <Link href="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-4 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Blog
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{post.title}</h1>
              <div className="flex items-center space-x-4 text-white/70 text-sm">
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {post.readTime} read</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm p-8 md:p-12"
          >
            <p className="text-lg text-gray-700 font-medium mb-8 leading-relaxed border-b border-gray-100 pb-8">
              {post.excerpt}
            </p>
            <div className="prose-like">
              {renderContent(post.content)}
            </div>
          </motion.article>

          {/* Share & Tags */}
          <div className="flex flex-wrap items-center justify-between mt-8 gap-4">
            <div className="flex items-center space-x-2 text-gray-500">
              <Tag className="w-4 h-4" />
              <span className="text-sm font-medium">{post.category}</span>
            </div>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: post.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
              className="flex items-center space-x-2 text-gray-500 hover:text-accent-500 transition-colors"
              aria-label="Share this article"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-accent-500" /> Related Articles
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map((related) => (
                  <Link key={related.id} href={`/blog/${related.slug}`}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-xl shadow-sm overflow-hidden group cursor-pointer"
                    >
                      <div className="relative h-40 w-full">
                        <Image
                          src={related.image}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <span className="text-xs text-accent-500 font-semibold">{related.category}</span>
                        <h4 className="text-sm font-bold text-gray-800 mt-1 group-hover:text-accent-500 transition-colors">
                          {related.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-2 flex items-center">
                          <Clock className="w-3 h-3 mr-1" /> {related.readTime}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
