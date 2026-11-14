import './Privacy.css';

export default function Privacy() {
  return (
    <main className="legal-page">
      <div className="container">
        <div className="legal-content">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last updated: January 2025</p>

          <nav className="toc">
            <h2>Table of Contents</h2>
            <ol>
              <li><a href="#what-we-collect">What Data We Collect</a></li>
              <li><a href="#why">Why We Collect It</a></li>
              <li><a href="#third-parties">Third Parties</a></li>
              <li><a href="#retention">Data Retention</a></li>
              <li><a href="#your-rights">Your Rights</a></li>
              <li><a href="#cookies">Cookies and Storage</a></li>
              <li><a href="#children">Children</a></li>
              <li><a href="#security">Security</a></li>
              <li><a href="#changes">Changes to This Policy</a></li>
              <li><a href="#contact">Contact</a></li>
            </ol>
          </nav>

          <section id="what-we-collect">
            <h2>1. What Data We Collect</h2>
            <p>When you use TripTuner, we collect the following information:</p>
            <ul>
              <li><strong>Account data:</strong> Email address and optional full name when you create an account through Supabase Auth.</li>
              <li><strong>Saved trips:</strong> Trip itineraries and PDF files you save to your account, stored in Supabase Storage (bucket: trip-pdfs).</li>
              <li><strong>Trip prompts:</strong> Destination preferences, travel dates, group size, budget, and interests you provide to generate itineraries. These are sent to Google Gemini API to produce personalized plans.</li>
              <li><strong>Location data:</strong> Approximate or precise location if you use the Near Me feature to find destinations. Location access requires your explicit permission.</li>
              <li><strong>Server logs:</strong> Basic usage data collected automatically by Vercel (frontend hosting) and the backend server, including IP address, browser type, access times, and pages visited.</li>
            </ul>
          </section>

          <section id="why">
            <h2>2. Why We Collect It</h2>
            <p>We use your data only for the following purposes:</p>
            <ul>
              <li>To create and manage your account.</li>
              <li>To generate personalized travel itineraries using AI.</li>
              <li>To save and retrieve your trip plans.</li>
              <li>To show nearby destinations when you use the Near Me feature.</li>
              <li>To maintain and improve the service, fix bugs, and understand usage patterns.</li>
            </ul>
            <p>We do not sell your data. We do not use it for advertising or marketing purposes beyond the service itself.</p>
          </section>

          <section id="third-parties">
            <h2>3. Third Parties</h2>
            <p>TripTuner uses the following third-party services:</p>
            <ul>
              <li><strong>Supabase:</strong> Handles user authentication, stores account data, and hosts saved trip PDFs. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase Privacy Policy</a></li>
              <li><strong>Google Gemini (Google AI):</strong> Processes your trip prompts to generate itineraries. Google may process this data according to their terms. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
              <li><strong>Vercel:</strong> Hosts the frontend and collects basic server logs. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel Privacy Policy</a></li>
              <li><strong>Backend host:</strong> [[REPLACE: backend hosting provider, e.g., Railway, Render]] hosts the API server and may collect server logs.</li>
              <li><strong>Unsplash:</strong> Provides destination images. Images are loaded from Unsplash CDN. <a href="https://unsplash.com/privacy" target="_blank" rel="noopener noreferrer">Unsplash Privacy Policy</a></li>
            </ul>
            <p>Each service processes data according to its own privacy policy. We recommend reviewing them.</p>
          </section>

          <section id="retention">
            <h2>4. Data Retention</h2>
            <p>We keep your data for as long as your account is active. If you delete your account or specific saved trips, the associated data is removed from our database. [[REPLACE: specific retention period for logs and backups, e.g., "Server logs are retained for 30 days. Database backups are retained for 90 days."]]</p>
          </section>

          <section id="your-rights">
            <h2>5. Your Rights</h2>
            <p>Under India's Digital Personal Data Protection Act 2023 and general data protection principles, you have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> Update or correct your account information.</li>
              <li><strong>Erasure:</strong> Delete your account and all associated data, including saved trips.</li>
              <li><strong>Withdraw consent:</strong> Stop using features that require data collection (e.g., Near Me, AI itinerary generation).</li>
            </ul>
            <p>To exercise these rights, use the account settings page or contact us at [[REPLACE: contact email]].</p>
            <p><strong>Grievance Officer:</strong> For complaints or concerns regarding data handling, contact [[REPLACE: Grievance Officer name and email]] as required under DPDP Act 2023.</p>
          </section>

          <section id="cookies">
            <h2>6. Cookies and Local Storage</h2>
            <p>TripTuner uses the following browser storage:</p>
            <ul>
              <li><strong>Local storage:</strong> Stores your language preference (key: tripi-lang) and theme preference to persist settings across sessions.</li>
              <li><strong>Session cookies:</strong> Supabase Auth uses cookies to maintain your login session.</li>
            </ul>
            <p>We do not use third-party advertising or analytics cookies. You can clear browser storage at any time through your browser settings.</p>
          </section>

          <section id="children">
            <h2>7. Children</h2>
            <p>TripTuner is not intended for children under 13 years of age. We do not knowingly collect personal data from children. If you are a parent or guardian and believe your child has provided us with personal data, contact us to have it removed.</p>
          </section>

          <section id="security">
            <h2>8. Security</h2>
            <p>We take reasonable measures to protect your data, including:</p>
            <ul>
              <li>HTTPS encryption for all data in transit.</li>
              <li>Supabase Row Level Security (RLS) policies to ensure users can only access their own data.</li>
              <li>Environment variable protection for API keys and secrets (not exposed in frontend code).</li>
            </ul>
            <p>However, no system is perfectly secure. We cannot guarantee absolute security. [[REPLACE: note about public PDF bucket]] Currently, saved trip PDFs are stored in a public Supabase Storage bucket, meaning anyone with the URL can access them. Do not save trips containing sensitive personal information until this is changed to a private bucket with signed URLs.</p>
          </section>

          <section id="changes">
            <h2>9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. When we make significant changes, we will update the "Last updated" date at the top and notify users by email (if provided) or through a notice on the site. Continued use of TripTuner after changes indicates acceptance of the updated policy.</p>
          </section>

          <section id="contact">
            <h2>10. Contact</h2>
            <p>If you have questions about this Privacy Policy or how we handle your data, contact us at:</p>
            <p>[[REPLACE: business or owner name]]<br />
            Email: [[REPLACE: contact email]]<br />
            Address: [[REPLACE: business address or registered office, if applicable]]</p>
          </section>
        </div>
      </div>
    </main>
  );
}
