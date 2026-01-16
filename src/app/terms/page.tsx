import Link from "next/link";
import { FileText } from "lucide-react";
import { Header, Footer } from "@/components";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-10 h-10 text-orange-500" />
          <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
        </div>

        <p className="text-zinc-400 mb-8">
          Last updated: January 2026
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                By accessing and using Carmen Job Search ("the Service"), you accept these
                terms of service ("Terms") and our privacy policy. If you do not agree
                with these terms, do not use the Service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              2. Service Description
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                Carmen Job Search is an automated job search platform
                that includes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Automated search of offers on LinkedIn, Indeed and other sites</li>
                <li>AI matching of offers with your profile</li>
                <li>Email alerts of relevant opportunities</li>
                <li>Monitoring of specific companies</li>
                <li>Dashboard and statistics of your search</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              3. User Responsibilities
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>As a user, you commit to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide truthful and updated information</li>
                <li>Keep your password and account secure</li>
                <li>Not share your account with third parties</li>
                <li>Use the service only for personal job search</li>
                <li>Not do abusive scraping of monitored platforms</li>
                <li>Respect the terms of service of job platforms</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              4. Prohibited Use
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>It is prohibited to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the service for illegal or unauthorized purposes</li>
                <li>Reverse engineer or hack the service</li>
                <li>Interrupt or overload the servers</li>
                <li>Create multiple abusive accounts</li>
                <li>Use the service for mass recruitment without authorization</li>
                <li>Share offer data with third parties commercially</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              5. Intellectual Property
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                The Service and its original content, features and functionalities are
                exclusive property of Neuralflow and are protected by intellectual
                property laws.
              </p>
              <p>
                The job offers found are property of their respective
                publishers. We only act as a technological intermediary.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              6. Service Termination
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                <strong className="text-white">Free Service:</strong> Carmen Job Search is
                provided free of charge. You may stop using the service at any time.
              </p>
              <p>
                <strong className="text-white">Account termination:</strong> You can close your
                account at any time through your dashboard settings.
              </p>
              <p>
                <strong className="text-white">Data retention:</strong> Upon account closure,
                your data will be deleted within 30 days unless required by law.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              7. Limitation of Liability
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                The Service is provided "as is" without warranties of any kind. We
                are not responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The accuracy or validity of found offers</li>
                <li>Final hiring by companies</li>
                <li>Temporary service interruptions</li>
                <li>Indirect, incidental or consequential damages</li>
                <li>Third-party content on monitored platforms</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              8. Termination
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                We may suspend or terminate your account if you violate these terms or use
                the service in an abusive manner. You can also close your account at
                any time from your dashboard.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              9. Service Modifications
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                We reserve the right to modify, suspend or discontinue
                any aspect of the service at any time. We will notify you of
                significant changes with at least 30 days advance notice.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              10. Applicable Law
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                These terms are governed by the laws of Colombia. Any dispute will be
                resolved in the courts of Bogotá, Colombia.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              11. Contact
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                For questions about these terms:
              </p>
              <ul className="list-none space-y-2">
                <li>Email: <a href="mailto:legal@neuralflow.ai" className="text-orange-500 hover:text-orange-400">legal@neuralflow.ai</a></li>
                <li>Dirección: Neuralflow AI, Calle 123 #45-67, Bogotá, Colombia</li>
              </ul>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
