import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Highlight } from '../components/common/Highlight';
import { Scale, AlertTriangle, ShieldCheck, FileCheck, ArrowLeft } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FDF5EB] flex flex-col font-sans text-[#171717]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#17172B]/70 hover:text-[#17172B] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="yellow" size="md">Terms of Service</Badge>
            <span className="text-xs font-bold text-[#17172B]/60">Effective Date: November 2026</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#17172B] tracking-tight mb-4">
            FOYC <Highlight>Terms of Service</Highlight>
          </h1>
          <p className="text-base sm:text-lg text-[#17172B]/80 font-medium leading-relaxed">
            Please read these terms carefully before utilizing Figure Out Your Career (FOYC) software, discovery prompts, and personalized dashboard tools.
          </p>
        </div>

        {/* Advisory Box */}
        <Card variant="pink" shadowSize="sm" className="p-5 mb-8 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-black text-sm text-[#17172B]">Important Career Guidance Disclaimer</h3>
            <p className="text-xs text-[#17172B]/85 font-medium leading-relaxed">
              FOYC and its associated AI prompts provide educational guidance, structured milestone frameworks, and self-reflection exercises. FOYC does not guarantee job offers, hiring outcomes, salary figures, or university admissions. Career decisions remain the sole responsibility of the individual.
            </p>
          </div>
        </Card>

        {/* Detailed Sections */}
        <Card variant="white" shadowSize="md" className="p-6 sm:p-10 space-y-8">
          <section className="space-y-3">
            <h2 className="text-xl font-black text-[#17172B] flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#FFE76B] border border-[#17172B] flex items-center justify-center text-xs">1</span>
              Acceptance of Terms
            </h2>
            <p className="text-sm text-[#17172B]/80 leading-relaxed font-medium">
              By accessing or using the FOYC platform, creating an account, or downloading generated career roadmaps, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t-2 border-[#17172B]/10">
            <h2 className="text-xl font-black text-[#17172B] flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#FFE76B] border border-[#17172B] flex items-center justify-center text-xs">2</span>
              User Rights and Content Ownership
            </h2>
            <p className="text-sm text-[#17172B]/80 leading-relaxed font-medium">
              You retain 100% intellectual property ownership of your personal reflections, career notes, weekly reviews, and custom milestone descriptions. FOYC claims no ownership over your career strategies, portfolio code, or written goals.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t-2 border-[#17172B]/10">
            <h2 className="text-xl font-black text-[#17172B] flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#FFE76B] border border-[#17172B] flex items-center justify-center text-xs">3</span>
              Acceptable Use
            </h2>
            <p className="text-sm text-[#17172B]/80 leading-relaxed font-medium">
              You agree not to:
            </p>
            <ul className="space-y-2 text-sm text-[#17172B]/85 font-medium ml-4 list-disc">
              <li>Use FOYC to generate malicious code, spam, or misleading credentials.</li>
              <li>Attempt to reverse engineer, decompile, or tamper with the backend rate limiters or authentication guards.</li>
              <li>Upload malformed payloads with the intent to disrupt service availability.</li>
              <li>Falsely represent FOYC recommendations as official state-licensed psychological counseling or accredited degree conferrals.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-6 border-t-2 border-[#17172B]/10">
            <h2 className="text-xl font-black text-[#17172B] flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#FFE76B] border border-[#17172B] flex items-center justify-center text-xs">4</span>
              Third-Party Services (OpenAI ChatGPT)
            </h2>
            <p className="text-sm text-[#17172B]/80 leading-relaxed font-medium">
              FOYC prepares structured prompt instructions designed to be executed within OpenAI's ChatGPT. When using OpenAI services, you are simultaneously governed by OpenAI's Terms of Use and Privacy Policy. FOYC is not affiliated with, endorsed by, or sponsored by OpenAI.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t-2 border-[#17172B]/10">
            <h2 className="text-xl font-black text-[#17172B] flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#FFE76B] border border-[#17172B] flex items-center justify-center text-xs">5</span>
              Limitation of Liability
            </h2>
            <p className="text-sm text-[#17172B]/80 leading-relaxed font-medium">
              In no event shall FOYC, its creators, or contributors be liable for any indirect, incidental, or consequential damages resulting from career choices, missed deadlines, employment decisions, or software interruptions. The platform is provided on an "as is" and "as available" basis.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t-2 border-[#17172B]/10">
            <h2 className="text-xl font-black text-[#17172B] flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#FFE76B] border border-[#17172B] flex items-center justify-center text-xs">6</span>
              Modifications to Terms
            </h2>
            <p className="text-sm text-[#17172B]/80 leading-relaxed font-medium">
              We may revise these Terms of Service from time to time. Your continued use of the platform following the posting of revised terms indicates your acceptance of the changes.
            </p>
          </section>
        </Card>
      </main>

      <Footer />
    </div>
  );
};
