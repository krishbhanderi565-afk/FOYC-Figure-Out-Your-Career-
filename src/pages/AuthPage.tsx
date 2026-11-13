import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCareer } from '../context/CareerContext';
import { Navbar } from '../components/common/Navbar';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Highlight } from '../components/common/Highlight';
import {
  Mail,
  Lock,
  ArrowRight,
  Compass,
  CheckCircle,
  Eye,
  EyeOff,
  AlertCircle,
  User,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Logo } from '../components/common/Logo';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, signIn, signInWithGoogle, resetPassword, isAuthenticated, dashboardData } = useCareer();

  // Initialize mode based on pathname or query
  const [isSignUp, setIsSignUp] = useState<boolean>(() => {
    if (location.pathname === '/login') return false;
    if (location.pathname === '/signup') return true;
    const params = new URLSearchParams(location.search);
    return params.get('mode') !== 'login';
  });

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    setErrorMsg(null);
    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return false;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return false;
    }
    if (isSignUp) {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return false;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please verify your password.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (isSignUp) {
        const res = await signUp(email.trim(), password, fullName.trim());
        if (res.success) {
          navigate('/dashboard');
        } else {
          setErrorMsg(res.error || 'Failed to create account. Please check your details.');
        }
      } else {
        const res = await signIn(email.trim(), password);
        if (res.success) {
          navigate('/dashboard');
        } else {
          setErrorMsg(res.error || 'Invalid email or password.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await signInWithGoogle();
      if (!res.success) {
        setErrorMsg(res.error || 'Google Sign-In is not configured.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setErrorMsg('Please enter your email to receive recovery instructions.');
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword(forgotEmail.trim());
      if (res.success) {
        setSuccessMsg(`Password reset instructions sent to ${forgotEmail}. Please check your inbox.`);
        setForgotPasswordOpen(false);
      } else {
        setErrorMsg(res.error || 'Unable to send recovery email.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF5EB] flex flex-col text-[#171717]">
      <Navbar />

      <main className="flex-1 max-w-lg w-full mx-auto px-4 sm:px-6 py-10 sm:py-16 pb-24 md:pb-16">
        <Card
          variant="white"
          shadowSize="lg"
          className="p-8 sm:p-10 border-2 border-[#171717] bg-white relative"
        >
          {/* Logo & Heading */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <Logo size="md" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF2E9] border border-[#A8B99A] text-xs font-black uppercase tracking-wider mb-3 text-[#526B50]">
              <Compass className="w-3.5 h-3.5" />
              <span>Career Discovery Account</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
              {isSignUp ? (
                <>Save Your <Highlight color="#FFE76B">Career Plan</Highlight></>
              ) : (
                <>Welcome back to <Highlight color="#FFE76B">FOYC</Highlight></>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-[#555555] font-medium mt-1.5">
              {isSignUp
                ? 'Create your account to persist your milestones, habits and progress across all devices.'
                : 'Sign in to access your personal career command centre and active habits.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#F4F3EF] rounded-xl border border-[#E8E5DE] mb-6">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-black rounded-lg transition-all ${
                !isSignUp
                  ? 'bg-white text-[#171717] shadow-[2px_2px_0px_#171717] border border-[#171717]'
                  : 'text-[#666666] hover:text-[#171717]'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-black rounded-lg transition-all ${
                isSignUp
                  ? 'bg-white text-[#171717] shadow-[2px_2px_0px_#171717] border border-[#171717]'
                  : 'text-[#666666] hover:text-[#171717]'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error & Success Alerts */}
          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border-2 border-red-300 text-red-700 text-xs font-bold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-green-50 border-2 border-green-300 text-green-800 text-xs font-bold flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#171717] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Chen"
                    required
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border-2 border-[#171717] bg-[#FFFDF8] font-semibold text-xs text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#FFE76B] shadow-[2px_2px_0px_#171717]"
                  />
                  <User className="absolute right-3.5 top-3 w-4 h-4 text-[#888888] pointer-events-none" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#171717] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border-2 border-[#171717] bg-[#FFFDF8] font-semibold text-xs text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#FFE76B] shadow-[2px_2px_0px_#171717]"
                />
                <Mail className="absolute right-3.5 top-3 w-4 h-4 text-[#888888] pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-[#171717]">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setForgotPasswordOpen(true);
                    }}
                    className="text-[11px] font-bold text-[#526B50] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border-2 border-[#171717] bg-[#FFFDF8] font-semibold text-xs text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#FFE76B] shadow-[2px_2px_0px_#171717]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#888888] hover:text-[#171717]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#171717] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border-2 border-[#171717] bg-[#FFFDF8] font-semibold text-xs text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#FFE76B] shadow-[2px_2px_0px_#171717]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-[#888888] hover:text-[#171717]"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <Button
              variant="dark"
              type="submit"
              size="lg"
              fullWidth
              disabled={loading}
              className="mt-6 py-3 bg-[#171717] hover:bg-[#333333] text-white font-black text-sm rounded-xl border-2 border-[#171717] shadow-[3px_3px_0px_#526B50]"
            >
              {loading ? (
                <span>Processing...</span>
              ) : isSignUp ? (
                <span className="flex items-center justify-center gap-2">
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Social Auth */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8E5DE]"></div>
            </div>
            <span className="relative px-3 bg-white text-[10px] font-black uppercase tracking-wider text-[#888888]">
              Or continue with
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl border-2 border-[#171717] bg-white hover:bg-[#F4F3EF] text-[#171717] font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-[2px_2px_0px_#171717] active:translate-y-0.5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Privacy Note */}
          <div className="mt-6 pt-4 border-t border-[#E8E5DE] text-center text-[11px] text-[#666666]">
            By continuing, you agree to FOYC's{' '}
            <Link to="/terms" className="underline font-bold text-[#171717]">Terms</Link> and{' '}
            <Link to="/privacy" className="underline font-bold text-[#171717]">Privacy Policy</Link>.
          </div>
        </Card>
      </main>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-[#171717] shadow-[6px_6px_0px_#171717] max-w-md w-full p-6 sm:p-8 space-y-4 animate-scaleUp">
            <h3 className="text-xl font-black text-[#171717]">Reset Your Password</h3>
            <p className="text-xs text-[#555555] font-medium leading-relaxed">
              Enter your email address and we'll send you a secure link to reset your account password.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full px-4 py-2.5 rounded-xl border-2 border-[#171717] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FFE76B]"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#555555] hover:text-[#171717]"
                >
                  Cancel
                </button>
                <Button
                  variant="dark"
                  type="submit"
                  size="sm"
                  disabled={loading}
                >
                  Send Recovery Link
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
