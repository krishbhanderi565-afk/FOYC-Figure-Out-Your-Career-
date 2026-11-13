import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCareer } from '../context/CareerContext';
import { Navbar } from '../components/common/Navbar';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Highlight } from '../components/common/Highlight';
import { Badge } from '../components/common/Badge';
import { ShieldCheck, Mail, Lock, ArrowRight, Sparkles, CheckCircle, ArrowLeft } from 'lucide-react';
import { Logo } from '../components/common/Logo';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginDemo, dashboardData } = useCareer();
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginDemo(email || 'alex.chen@example.com');
    navigate('/dashboard');
  };

  const handleInstantDemo = () => {
    loginDemo('alex.chen@example.com');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FFF8E9] flex flex-col text-[#17172B]">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Back Link */}
        <Link to="/import-preview" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#17172B]/60 hover:text-[#17172B] mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Plan Review
        </Link>

        <Card variant="white" shadowSize="lg" className="p-8 sm:p-10 relative border-3 bg-[#FFFDF8]">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Logo size="sm" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8E986] border border-[#17172B] text-xs font-black uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#17172B]" />
              Save & Launch Your Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#17172B] tracking-tight leading-tight">
              {isSignUp ? 'Your career dashboard is' : 'Welcome back to your'}{' '}
              <Highlight color="#B8E986">{isSignUp ? 'ready to save.' : 'workspace.'}</Highlight>
            </h1>
            <p className="text-xs sm:text-sm text-[#17172B]/75 font-semibold mt-2 leading-relaxed">
              Create your free FOYC account to save your career roadmap, track your progress and continue developing your future.
            </p>
          </div>

          {/* Direction summary badge */}
          <div className="bg-[#FFF8E9] p-3.5 rounded-xl border-2 border-[#17172B] flex items-center justify-between mb-6 shadow-[2px_2px_0px_#17172B]">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#17172B]/60 block">
                Approved Career Direction
              </span>
              <span className="text-sm font-extrabold text-[#17172B]">
                {dashboardData.direction.primaryTitle}
              </span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#B8E986] border border-[#17172B]">
              Ready
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#FFE76B] shadow-[2px_2px_0px_#17172B]"
                />
                <Mail className="absolute right-3.5 top-3 w-4 h-4 text-[#17172B]/40 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-[#17172B]">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => alert('Password reset link would be dispatched in production.')}
                    className="text-[11px] font-bold text-[#17172B]/60 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#FFE76B] shadow-[2px_2px_0px_#17172B]"
                />
                <Lock className="absolute right-3.5 top-3 w-4 h-4 text-[#17172B]/40 pointer-events-none" />
              </div>
            </div>

            {isSignUp && (
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-[#17172B] accent-[#17172B]"
                />
                <label htmlFor="agree" className="text-xs text-[#17172B]/75 font-medium leading-snug">
                  I consent to saving my personalized roadmap and agree to FOYC's privacy-first framework.
                </label>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              className="mt-4 gap-2 font-black shadow-[4px_4px_0px_#17172B]"
            >
              <span>{isSignUp ? 'Create Free Account & Open Dashboard' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Quick Demo Bypass */}
          <div className="mt-6 pt-6 border-t-2 border-[#17172B]/20 text-center">
            <span className="text-xs font-bold text-[#17172B]/60 block mb-3">
              Reviewing or testing the frontend?
            </span>
            <Button
              type="button"
              variant="green"
              size="sm"
              onClick={handleInstantDemo}
              className="gap-2 w-full text-xs font-extrabold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Instant 1-Click Demo Access (Skip Login Form)
            </Button>
          </div>

          {/* Toggle between Signup and Login */}
          <div className="mt-6 text-center text-xs font-bold text-[#17172B]/70">
            {isSignUp ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-[#17172B] underline font-extrabold"
                >
                  Sign in here
                </button>
              </p>
            ) : (
              <p>
                Need to create a new profile?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-[#17172B] underline font-extrabold"
                >
                  Create free account
                </button>
              </p>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};
