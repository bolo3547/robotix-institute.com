'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  const lastUpdated = 'February 8, 2026';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
      {/* Hero */}
      <section className="pt-32 pb-12 px-4 bg-white border-b">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Terms of Service
          </motion.h1>
          <p className="text-gray-600">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto prose prose-lg prose-blue">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using ROBOTIX INSTITUTE's website, services, or programs, you agree to be bound by these 
              Terms of Service. If you disagree with any part of these terms, you may not access our services.
            </p>

            <h2>2. Services Description</h2>
            <p>
              ROBOTIX INSTITUTE provides robotics and coding education services for children aged 5-16. Our services include:
            </p>
            <ul>
              <li>In-person and online classes</li>
              <li>Robotics kits and learning materials</li>
              <li>Summer camps and workshops</li>
              <li>Competition preparation and coaching</li>
              <li>Parent dashboard and progress tracking</li>
            </ul>

            <h2>3. Enrollment and Registration</h2>
            <h3>3.1 Eligibility</h3>
            <p>
              To enroll a child in our programs, you must be the parent or legal guardian of the child. The child must 
              meet the age requirements for the specific program.
            </p>

            <h3>3.2 Registration Process</h3>
            <ul>
              <li>Complete the online registration form</li>
              <li>Provide accurate information about parent/guardian and child</li>
              <li>Pay the applicable tuition fees</li>
              <li>Agree to these Terms of Service and our Privacy Policy</li>
            </ul>

            <h2>4. Payment Terms</h2>
            <h3>4.1 Tuition and Fees</h3>
            <ul>
              <li>Tuition is due before the start of each term/month</li>
              <li>Payment methods: MTN Mobile Money, Airtel Money, bank transfer, cash</li>
              <li>Prices are subject to change with 30 days notice</li>
            </ul>

            <h3>4.2 Refund Policy</h3>
            <ul>
              <li><strong>30-day money-back guarantee</strong> for new students</li>
              <li>Pro-rated refunds available within first 50% of the program</li>
              <li>No refunds after 50% of the program has elapsed</li>
              <li>Materials and kits are non-refundable once opened</li>
            </ul>

            <h2>5. Attendance and Participation</h2>
            <h3>5.1 Class Attendance</h3>
            <ul>
              <li>Regular attendance is essential for learning progress</li>
              <li>Notify us at least 24 hours before missing a class</li>
              <li>Makeup classes are available based on schedule availability</li>
            </ul>

            <h3>5.2 Student Conduct</h3>
            <p>Students are expected to:</p>
            <ul>
              <li>Treat instructors and fellow students with respect</li>
              <li>Handle equipment and materials responsibly</li>
              <li>Follow safety guidelines at all times</li>
              <li>Participate actively in class activities</li>
            </ul>

            <h2>6. Safety and Supervision</h2>
            <p>
              We are committed to providing a safe learning environment. Our safety measures include:
            </p>
            <ul>
              <li>Background-checked and trained instructors</li>
              <li>Small class sizes for adequate supervision</li>
              <li>Age-appropriate equipment and materials</li>
              <li>Emergency procedures and first aid readiness</li>
              <li>Secure premises with controlled access</li>
            </ul>

            <h2>7. Intellectual Property</h2>
            <h3>7.1 Our Content</h3>
            <p>
              All curriculum, materials, software, and content provided by ROBOTIX INSTITUTE are our intellectual 
              property and may not be reproduced or distributed without permission.
            </p>

            <h3>7.2 Student Work</h3>
            <p>
              Students retain ownership of their projects and creations. By enrolling, parents grant us permission 
              to use student work for educational and promotional purposes (with names anonymized unless explicit 
              consent is given).
            </p>

            <h2>8. Liability Limitations</h2>
            <p>
              While we take all reasonable precautions, ROBOTIX INSTITUTE is not liable for:
            </p>
            <ul>
              <li>Minor injuries that may occur during normal activities</li>
              <li>Loss or damage to personal belongings</li>
              <li>Technical issues beyond our control during online classes</li>
            </ul>
            <p>
              Parents are responsible for ensuring their child has no medical conditions that would prevent 
              participation in our programs.
            </p>

            <h2>9. Termination</h2>
            <p>We reserve the right to terminate enrollment if:</p>
            <ul>
              <li>Payment is not received within 30 days of the due date</li>
              <li>Student conduct repeatedly violates our policies</li>
              <li>False information was provided during registration</li>
            </ul>

            <h2>10. Communication</h2>
            <p>
              By registering, you consent to receive communications from us regarding your child's enrollment, 
              including:
            </p>
            <ul>
              <li>Class schedules and updates</li>
              <li>Progress reports and feedback</li>
              <li>Important announcements</li>
              <li>Marketing communications (opt-out available)</li>
            </ul>

            <h2>11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Zambia. Any disputes 
              shall be resolved in the courts of Lusaka, Zambia.
            </p>

            <h2>12. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. Continued use of our services after changes constitutes 
              acceptance of the modified terms.
            </p>

            <h2>13. Contact Information</h2>
            <p>For questions about these Terms, contact us:</p>
            <ul>
              <li>Email: info@robotixinstitute.io</li>
              <li>Phone: +260 956 355 117</li>
              <li>Address: No. 7 Mistry Court, Great East Road, Lusaka, Zambia</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-white border-t">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 mb-4">Ready to start learning?</p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enroll Now
          </Link>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  );
}
