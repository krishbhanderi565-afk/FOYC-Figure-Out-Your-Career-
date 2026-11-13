import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Highlight } from '../components/common/Highlight';
import { Shield, Lock, EyeOff, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#B8E986] flex flex-col font-sans text-[#17172B]">
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
            <Badge variant="blue" size="md">Privacy & Trust</Badge>
            <span className="text-xs font-bold text-[#17172B]/60">Last updated: November 2026</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#17172B] tracking-tight mb-4">
            FOYC <Highlight>Privacy Policy</Highlight>
          </h1>
          <p className="text-base sm:text-lg text-[#17172B]/80 font-medium leading-relaxed">
            Your career ambitions, personal doubts, and reflections belong to you. We built FOYC with a privacy-first architecture where your personal introspection never becomes training data for third-party models.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Card variant="pink" shadowSize="sm" className="p-5">
            <div className="w-9 h-9 rounded-xl bg-white border-2 border-[#17172B] flex items-center justify-center mb-3">
              <EyeOff className="w-5 h-5 text-[#17172B]" />
            </div>
            <h3 className="font-black text-sm text-[#17172B] mb-1">Zero Session Snooping</h3>
            <p className="text-xs text-[#17172B]/80 font-medium">
              We never access or snoop on private ChatGPT accounts. The handoff is 100% transparent and user-directed.
            </p>
          </Card>

          <Card variant="green" shadowSize="sm" className="p-5">
            <div className="w-9 h-9 rounded-xl bg-white border-2 border-[#17172B] flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-emerald-800" />
            </div>
            <h3 className="font-black text-sm text-[#17172B] mb-1">Row Level Security</h3>
            <p className="text-xs text-[#17172B]/80 font-medium">
              Database records in Supabase PostgreSQL are strictly guarded by PostgreSQL RLS. Only your token can access your data.
            </p>
          </Card>

          <Card variant="lavender" shadowSize="sm" className="p-5">
            <div className="w-9 h-9 rounded-xl bg-white border-2 border-[#17172B] flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-purple-800" />
            </div>
            <h3 className="font-black text-sm text-[#17172B] mb-1">100% Data Portability</h3>
            <p className="text-xs text-[#17172B]/80 font-medium">
              Export your entire career roadmap, milestones, and habit history in standard JSON whenever you choose.
            </p>
          </Card>
        </div>

        {/* Detailed Sections */}
        <Card variant="white" shadowSize="md" className="p-6 sm:p-10 space-y-8">
          <section className="space-y-3">
            <h2 className="text-xl font-black text-[#17172B] flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#FFE76B] border border-[#17172B] flex items-center justify-center text-xs">1</span>
              Information We Collect
            </h2>
            <p className="text-sm text-[#17172B]/80 leading-relaxed font-medium">
              During your career discovery journey, you may provide:
            </p>
            <ul className="space-y-2 text-sm text-[#17172B]/85 font-medium ml-4 list-disc">
              <li><strong>Profile Context:</strong> Your preferred name, educational stage, career situation, and target hours per week.</li>
              <li><strong>Introspection Reflections:</strong> The open-ended thoughts you type or speak into the What’s On Your Mind prompt composer.</li>
              <li><strong>Handoff JSON:</strong> The structured career roadmap payload you paste back into FOYC after your ChatGPT conversation.</li>
              <li><strong>Account Credentials:</strong> If you choose to register, an email and password hash managed securely via Supabase Auth. Anonymous sessions do not require any personal identifiers.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-6 border-t-2 border-[#17172B]/10">
            <h2 className="text-xl font-black text-[#17172B] flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#FFE76B] border border-[#17172B] flex items-center justify-center text-xs">2</span>
              How We Use Your Information
            </h2>
            <p className="text-sm text-[#17172B]/80 leading-relaxed font-medium">
              We use your provided information solely to:
            </p>
            <ul className="space-y-2 text-sm text-[#17172B]/85 font-medium ml-4 list-disc">
              <li>Generate your personalized ChatGPT Discovery Coach system prompt.</li>
              <li>Parse and populate your career command centre (milestones, checklist, habits, and portfolio capstones).</li>
              <li>Calculate your habit streaks and weekly review calibrations.</li>
              <li>Maintain your personalized experience across browser refreshes and authenticated sessions.</li>
            </ul>
            <p className="text-sm font-bold text-[#17172B] bg-[#FFF8E9] p-3 rounded-xl border border-[#17172B]/30">
              We do not sell, rent, monetize, or broker your personal reflections to any advertisers or data brokers.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t-2 border-[#17172B]/10">
            <h2 className="text-xl font-black text-[#17172B] flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#FFE76B] border border-[#17172B] flex items-center justify-center text-xs">3</span>
              The ChatGPT Boundary & Data Handshake
            </h2>
            <p className="text-sm text-[#17172B]/80 leading-relaxed font-medium">
              FOYC uses an explicit, privacy-first manual copy-paste handoff mechanism:
            </p>
            <ul className="space-y-2 text-sm text-[#17172B]/85 font-medium ml-4 list-disc">
              <li>FOYC crafts a structured coach prompt in your browser that you copy and paste into your own ChatGPT account.</li>
              <li>FOYC has no API access, web scrapers, or session tokens connecting to your ChatGPT account.</li>
              <li>Only the structured JSON block that you explicitly copy from ChatGPT and paste into FOYC is received by our import parser.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-6 border-t-2 border-[#17172B]/10">
            <h2 className="text-xl font-black text-[#17172B] flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#FFE76B] border border-[#17172B] flex items-center justify-center text-xs">4</span>
              Data Retention and Deletion
            </h2>
            <p className="text-sm text-[#17172B]/80 leading-relaxed font-medium">
              You maintain sovereign ownership of your career data:
            </p>
            <ul className="space-y-2 text-sm text-[#17172B]/85 font-medium ml-4 list-disc">
              <li>Anonymous sessions are saved in your local browser `localStorage` and can be wiped instantly by clicking "Reset All Local Data" in Dashboard Settings.</li>
              <li>Authenticated users can request complete account and database record deletion at any time, which triggers cascading deletion across all 11 Supabase tables.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-6 border-t-2 border-[#17172B]/10">
            <h2 className="text-xl font-black text-[#17172B] flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#FFE76B] border border-[#17172B] flex items-center justify-center text-xs">5</span>
              Contact and Privacy Inquiries
            </h2>
            <p className="text-sm text-[#17172B]/80 leading-relaxed font-medium">
              If you have any questions or data portability requests regarding this Privacy Policy, please contact our team at:
            </p>
            <div className="p-4 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] inline-block font-mono text-xs font-black text-[#17172B]">
              privacy@figureoutyourcareer.com
            </div>
          </section>
        </Card>
      </main>

      <Footer />
    </div>
  );
};
