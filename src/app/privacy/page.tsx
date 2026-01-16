import Link from "next/link";
import { Shield } from "lucide-react";
import { Header, Footer } from "@/components";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-10 h-10 text-orange-500" />
          <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
        </div>

        <p className="text-zinc-400 mb-8">
          Last updated: January 2026
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              1. Information We Collect
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                We collect the following information to provide our services:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Account information:</strong> Name, email, encrypted password</li>
                <li><strong className="text-white">Job preferences:</strong> Sought positions, location, salary range</li>
                <li><strong className="text-white">Monitored companies:</strong> List of companies you want to follow</li>
                <li><strong className="text-white">API Keys:</strong> Encrypted OpenAI API key for the matching service</li>
                <li><strong className="text-white">Usage data:</strong> How you interact with our platform</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              2. How We Use Your Information
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>Your information is used to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Search and analyze job offers that match your profile</li>
                <li>Send you email alerts when there are relevant offers</li>
                <li>Improve our services and matching algorithms</li>
                <li>Provide technical support when you need it</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              3. Data Protection
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                We implement robust security measures to protect your information:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Encryption:</strong> All sensitive data is encrypted at rest and in transit</li>
                <li><strong className="text-white">Authentication:</strong> Passwords hashed with bcrypt</li>
                <li><strong className="text-white">API Keys:</strong> Stored with AES-256 encryption</li>
                <li><strong className="text-white">Limited access:</strong> Only authorized personnel can access the data</li>
                <li><strong className="text-white">Audit:</strong> Logs of all data accesses</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              4. Data Sharing
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                <strong className="text-white">We do not sell</strong> your personal information to third parties.
              </p>
              <p>
                We only share data in the following cases:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">With your consent:</strong> When you explicitly authorize us</li>
                <li><strong className="text-white">Service providers:</strong> OpenAI (for matching), AWS (infrastructure)</li>
                <li><strong className="text-white">Legal requirements:</strong> When the law requires it</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              5. Your Rights
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Access:</strong> Request a copy of your data</li>
                <li><strong className="text-white">Rectify:</strong> Correct inaccurate information</li>
                <li><strong className="text-white">Delete:</strong> Request the deletion of your data</li>
                <li><strong className="text-white">Export:</strong> Receive your data in a portable format</li>
                <li><strong className="text-white">Object:</strong> Object to the processing of your data</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, contact{" "}
                <a href="mailto:privacy@neuralflow.ai" className="text-orange-500 hover:text-orange-400">
                  privacy@neuralflow.ai
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              6. Data Retention
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                We keep your data while you use our services. After closing your
                account, we delete:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Personal data within 30 days</li>
                <li>Usage data within 90 days</li>
                <li>System logs within 1 year</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              7. Cookies and Tracking
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                We use essential cookies for authentication and preferences. We do not use
                third-party tracking cookies for advertising.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              8. Changes to This Policy
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                We may update this privacy policy. We will notify you by email
                when there are significant changes.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              9. Contact
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                For questions about this policy or your personal data:
              </p>
              <ul className="list-none space-y-2">
                <li>Email: <a href="mailto:privacy@neuralflow.ai" className="text-orange-500 hover:text-orange-400">privacy@neuralflow.ai</a></li>
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
