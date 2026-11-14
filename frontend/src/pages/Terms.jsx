import './Privacy.css';

export default function Terms() {
  return (
    <main className="legal-page">
      <div className="container">
        <div className="legal-content">
          <h1>Terms and Conditions</h1>
          <p className="last-updated">Last updated: January 2025</p>

          <nav className="toc">
            <h2>Table of Contents</h2>
            <ol>
              <li><a href="#acceptance">Acceptance of Terms</a></li>
              <li><a href="#eligibility">Eligibility</a></li>
              <li><a href="#account">Account Responsibility</a></li>
              <li><a href="#use">Acceptable Use</a></li>
              <li><a href="#ai-disclaimer">AI-Generated Content Disclaimer</a></li>
              <li><a href="#booking">No Booking or Agent Relationship</a></li>
              <li><a href="#third-party">Third-Party Services</a></li>
              <li><a href="#user-content">User Content and PDFs</a></li>
              <li><a href="#ip">Intellectual Property</a></li>
              <li><a href="#availability">Availability and Changes</a></li>
              <li><a href="#liability">Limitation of Liability</a></li>
              <li><a href="#termination">Termination</a></li>
              <li><a href="#governing-law">Governing Law</a></li>
              <li><a href="#contact">Contact</a></li>
            </ol>
          </nav>

          <section id="acceptance">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using TripTuner, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree, do not use the service.</p>
          </section>

          <section id="eligibility">
            <h2>2. Eligibility</h2>
            <p>You must be at least 13 years old to create an account. If you are under 18, you must have permission from a parent or guardian to use TripTuner. By creating an account, you confirm that you meet these requirements.</p>
          </section>

          <section id="account">
            <h2>3. Account Responsibility</h2>
            <p>You are responsible for maintaining the security of your account credentials. Do not share your password. You are responsible for all activity that occurs under your account. Notify us immediately if you suspect unauthorized access.</p>
          </section>

          <section id="use">
            <h2>4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use TripTuner for any unlawful purpose or in violation of these Terms.</li>
              <li>Attempt to gain unauthorized access to any part of the service or other users' accounts.</li>
              <li>Upload or transmit viruses, malware, or any harmful code.</li>
              <li>Scrape, copy, or automate access to the service beyond normal use.</li>
              <li>Misrepresent your identity or affiliation.</li>
              <li>Use the service to harass, abuse, or harm others.</li>
            </ul>
            <p>We reserve the right to suspend or terminate accounts that violate these rules.</p>
          </section>

          <section id="ai-disclaimer">
            <h2>5. AI-Generated Content Disclaimer</h2>
            <p><strong>Important:</strong> TripTuner uses Google Gemini AI to generate travel itineraries, budget estimates, train routes, hotel suggestions, and other trip information. This content is automatically generated and may contain errors, inaccuracies, or outdated information.</p>
            <p>You must independently verify all information before making travel decisions or bookings. This includes:</p>
            <ul>
              <li>Prices, availability, and operating hours.</li>
              <li>Train and flight schedules and routes.</li>
              <li>Hotel ratings, reviews, and actual amenities.</li>
              <li>Local regulations, visa requirements, and travel advisories.</li>
              <li>Weather conditions and seasonal closures.</li>
            </ul>
            <p>TripTuner is a planning tool, not a booking agent or travel advisor. We are not liable for any losses, expenses, or harm resulting from reliance on AI-generated content.</p>
          </section>

          <section id="booking">
            <h2>6. No Booking or Agent Relationship</h2>
            <p>TripTuner does not book travel, make reservations, or act as a travel agent. We do not have partnerships with hotels, airlines, or tour operators unless explicitly stated. You are responsible for making your own bookings and confirming all details directly with service providers.</p>
          </section>

          <section id="third-party">
            <h2>7. Third-Party Services</h2>
            <p>TripTuner links to or integrates with third-party services, including:</p>
            <ul>
              <li>Supabase for authentication and storage.</li>
              <li>Google Gemini for AI itinerary generation.</li>
              <li>Unsplash for destination images.</li>
              <li>External websites for destination information and bookings.</li>
            </ul>
            <p>We are not responsible for the content, availability, or practices of third-party services. Your use of them is governed by their own terms and privacy policies.</p>
          </section>

          <section id="user-content">
            <h2>8. User Content and Saved PDFs</h2>
            <p>When you save trip itineraries as PDFs, you retain ownership of that content. By saving trips on TripTuner, you grant us a limited license to store, display, and process your saved trips for the purpose of providing the service.</p>
            <p>[[REPLACE: note about public bucket]] Currently, saved PDFs are stored in a public bucket. Anyone with the link can access them. Do not save trips containing sensitive or private information. You are responsible for the content you save.</p>
          </section>

          <section id="ip">
            <h2>9. Intellectual Property</h2>
            <p>TripTuner's code, design, branding, and original content are owned by [[REPLACE: owner or business name]] or licensed to us. The TripTuner codebase is released under the MIT License (see repository for full license text). This means you may use, modify, and distribute the code under the terms of that license. However, our branding, name, and logo remain our property and may not be used without permission.</p>
            <p>Destination data and images are sourced from public datasets and Unsplash. AI-generated itineraries are created using Google Gemini and are subject to Google's terms.</p>
          </section>

          <section id="availability">
            <h2>10. Availability and Changes</h2>
            <p>We strive to keep TripTuner available and up to date, but we do not guarantee uninterrupted access. We may suspend the service for maintenance, updates, or other reasons without notice.</p>
            <p>We may modify, add, or remove features at any time. We may also update these Terms and will notify you of significant changes. Continued use after changes indicates acceptance.</p>
          </section>

          <section id="liability">
            <h2>11. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, TripTuner, its developers, and contributors are not liable for:</p>
            <ul>
              <li>Any indirect, incidental, consequential, or punitive damages.</li>
              <li>Loss of profits, data, or business opportunities.</li>
              <li>Errors or inaccuracies in AI-generated content.</li>
              <li>Issues arising from third-party services.</li>
              <li>Any harm resulting from your use of the service.</li>
            </ul>
            <p>TripTuner is provided "as is" without warranties of any kind, express or implied. Use it at your own risk.</p>
          </section>

          <section id="termination">
            <h2>12. Termination</h2>
            <p>You may delete your account at any time through the account settings page. We may suspend or terminate your account if you violate these Terms or engage in harmful behavior.</p>
            <p>Upon termination, your saved trips and account data will be deleted according to our Privacy Policy.</p>
          </section>

          <section id="governing-law">
            <h2>13. Governing Law and Jurisdiction</h2>
            <p>These Terms are governed by the laws of India. Any disputes arising from your use of TripTuner will be subject to the exclusive jurisdiction of the courts in [[REPLACE: jurisdiction, e.g., "Mumbai, Maharashtra" or "Bangalore, Karnataka"]].</p>
          </section>

          <section id="contact">
            <h2>14. Contact</h2>
            <p>If you have questions or concerns about these Terms, contact us at:</p>
            <p>[[REPLACE: business or owner name]]<br />
            Email: [[REPLACE: contact email]]<br />
            Address: [[REPLACE: business address or registered office, if applicable]]</p>
          </section>
        </div>
      </div>
    </main>
  );
}
