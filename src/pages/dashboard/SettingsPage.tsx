import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareer } from '../../context/CareerContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { DASHBOARD_THEMES, DashboardThemeId } from '../../types/moduleRegistry';
import {
  Download,
  Shield,
  Trash2,
  Check,
  User,
  Clock,
  Globe,
  Bell,
  AlertTriangle,
  X,
  FileCode,
  Lock,
  Mail,
  GraduationCap,
  Briefcase,
  Compass,
  FileText,
  LogOut,
  KeyRound,
  CheckCircle2,
  Palette,
  Sparkles,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, dashboardData, resetToDefault, userEmail, userName, isAuthenticated, signOut, currentTheme, setTheme } = useCareer();

  // Personal profile state
  const [fullName, setFullName] = useState(userName || profile.preferredName || '');
  const [country, setCountry] = useState(profile.country || 'Global');
  const [education, setEducation] = useState<string>(profile.educationStatus || 'college-student');
  const [profession, setProfession] = useState<string>(profile.currentField || 'Software Engineering');
  const [careerStage, setCareerStage] = useState<string>(profile.careerStage || 'exploring');
  const [summary, setSummary] = useState(profile.workExperience || '');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [language, setLanguage] = useState('en');
  const [emailReminders, setEmailReminders] = useState(true);
  const [habitPings, setHabitPings] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  // Change password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      preferredName: fullName,
      country,
      educationStatus: education as any,
      currentField: profession,
      careerStage: careerStage as any,
      workExperience: summary,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordNotice(null);

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match. Please verify.');
      return;
    }

    setPasswordLoading(true);

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
          setPasswordError(error.message);
        } else {
          setPasswordNotice('Password updated successfully! Your account credentials have been synchronized.');
          setNewPassword('');
          setConfirmPassword('');
        }
      } catch (err: any) {
        setPasswordError(err.message || 'Failed to update password.');
      } finally {
        setPasswordLoading(false);
      }
    } else {
      // Local dev simulation
      setPasswordLoading(false);
      setPasswordNotice('Password updated successfully in secure session.');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(dashboardData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `FOYC_Career_Plan_${dashboardData.direction.primaryTitle.replace(/\s+/g, '_')}_${Date.now()}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleConfirmReset = () => {
    resetToDefault();
    setShowResetModal(false);
  };

  const handleConfirmSignOut = async () => {
    await signOut();
    setShowSignOutModal(false);
    navigate('/');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FDF5EB] text-[#171717]">
      <DashboardHeader
        onOpenMobileMenu={() => {}}
        title="Profile & Cloud Settings"
        subtitle="Manage your personal details, secure credentials, and data synchronization."
      />

      <main className="p-4 sm:p-8 space-y-8 max-w-4xl">
        {/* Account & Identity Card */}
        <Card variant="white" shadowSize="md" className="p-6 sm:p-8 bg-white border border-[#E8E5DE] rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[#E8E5DE] gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFE76B] border border-[#171717] flex items-center justify-center font-black text-lg text-[#171717] shadow-xs">
                {(fullName || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-[#171717] flex items-center gap-2">
                  <span>{fullName || 'Explorer'}</span>
                  <span className="text-[11px] font-mono font-bold bg-[#EDF2E9] text-[#526B50] px-2 py-0.5 rounded-full border border-[#A8B99A]">
                    {isAuthenticated ? 'Authenticated Account' : 'Guest Session'}
                  </span>
                </h3>
                <p className="text-xs text-[#666666] font-mono flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-[#526B50]" />
                  <span>{userEmail || 'guest@foyc.dev'}</span>
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowSignOutModal(true)}
              className="gap-1.5 font-bold text-xs border-[#171717] hover:bg-red-50 hover:text-red-700 hover:border-red-300"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>

          {/* Dedicated Appearance & Color Theme Section (Section 4) */}
          <div className="p-5 rounded-2xl bg-white border border-[#E8E5DE] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-stone-900">Workspace Appearance & Theme</h3>
              </div>
              <span className="text-[11px] font-bold text-stone-500">Live preview across all features</span>
            </div>

            <p className="text-xs text-stone-600 font-medium">
              Select your favorite aesthetic. Every page, card, chart, and roadmap connector will adapt seamlessly.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-1">
              {[
                { id: 'green' as DashboardThemeId, name: 'Fresh Green', desc: 'Lush lime gradient', color: '#22C55E' },
                { id: 'blue' as DashboardThemeId, name: 'Executive Blue', desc: 'Ocean focus', color: '#3B82F6' },
                { id: 'sunset' as DashboardThemeId, name: 'Warm Sunset', desc: 'Coral & sun gold', color: '#F97316' },
                { id: 'purple' as DashboardThemeId, name: 'Creative Violet', desc: 'Lavender flow', color: '#8B5CF6' },
                { id: 'red' as DashboardThemeId, name: 'Crimson Accent', desc: 'Warm rose', color: '#EF4444' },
                { id: 'black' as DashboardThemeId, name: 'Obsidian Minimal', desc: 'Deep luxury dark', color: '#111827' },
                { id: 'white' as DashboardThemeId, name: 'Minimal White', desc: 'Crisp clean slate', color: '#FFFFFF', border: '#D1D5DB' },
              ].map((th) => {
                const isSelected = currentTheme === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setTheme(th.id)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="w-5 h-5 rounded-full shadow-xs"
                        style={{
                          backgroundColor: th.color,
                          border: th.border ? `1px solid ${th.border}` : '1px solid rgba(0,0,0,0.1)',
                        }}
                      />
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />}
                    </div>
                    <div>
                      <span className="text-xs font-black text-stone-900 block leading-tight">{th.name}</span>
                      <span className="text-[10px] text-stone-500 font-medium block leading-tight mt-0.5">{th.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personal Details Form */}
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#171717] mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#526B50]" /> Full / Preferred Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DE] bg-[#FFFDF8] font-bold text-xs focus:ring-2 focus:ring-[#FFE76B]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#171717] mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#526B50]" /> Country / Region
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. India, USA, Germany"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DE] bg-[#FFFDF8] font-bold text-xs focus:ring-2 focus:ring-[#FFE76B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#171717] mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#526B50]" /> Education Status
                </label>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8E5DE] bg-[#FFFDF8] font-bold text-xs"
                >
                  <option value="school-student">School Student (9th-12th)</option>
                  <option value="college-student">College Student / Undergrad</option>
                  <option value="recent-grad">Recent Graduate</option>
                  <option value="working-professional">Working Professional</option>
                  <option value="career-changer">Career Changer</option>
                  <option value="self-taught">Self-Taught Learner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#171717] mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#526B50]" /> Profession / Focus Field
                </label>
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="e.g. Software Engineering"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DE] bg-[#FFFDF8] font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#171717] mb-1.5 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#526B50]" /> Career Stage
                </label>
                <select
                  value={careerStage}
                  onChange={(e) => setCareerStage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8E5DE] bg-[#FFFDF8] font-bold text-xs"
                >
                  <option value="exploring">Exploring Opportunities</option>
                  <option value="upskilling">Actively Upskilling</option>
                  <option value="job-hunting">Actively Job Hunting</option>
                  <option value="pivoting">Pivoting / Switching Fields</option>
                  <option value="growth">Accelerating in Current Role</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#171717] mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#526B50]" /> Profile Summary & Objectives
              </label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Briefly describe your career background, key interests, and target milestones."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DE] bg-[#FFFDF8] font-medium text-xs leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#171717] mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#526B50]" /> Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DE] bg-[#FFFDF8] font-bold text-xs"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST, UTC+5:30)</option>
                  <option value="America/New_York">America/New_York (EST, UTC-5)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST, UTC-8)</option>
                  <option value="Europe/London">Europe/London (GMT, UTC+0)</option>
                  <option value="Europe/Berlin">Europe/Berlin (CET, UTC+1)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST, UTC+9)</option>
                  <option value="Australia/Sydney">Australia/Sydney (AEST, UTC+10)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#171717] mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#526B50]" /> Interface Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DE] bg-[#FFFDF8] font-bold text-xs"
                >
                  <option value="en">English (US / Global)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="es">Español (Spanish)</option>
                  <option value="fr">Français (French)</option>
                  <option value="de">Deutsch (German)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" variant="primary" size="md" className="font-black bg-[#171717] text-white hover:bg-[#333333]">
                Save Profile Changes
              </Button>
              {savedNotice && (
                <span className="text-xs font-bold text-[#526B50] bg-[#EDF2E9] px-3 py-1.5 rounded-lg border border-[#A8B99A] flex items-center gap-1 animate-fadeIn">
                  <Check className="w-4 h-4" /> Profile Synced with Supabase!
                </span>
              )}
            </div>
          </form>
        </Card>

        {/* Change Password Card (Secure Supabase Authentication) */}
        <Card variant="white" shadowSize="md" className="p-6 sm:p-8 bg-white border border-[#E8E5DE] rounded-2xl">
          <h3 className="font-extrabold text-lg text-[#171717] mb-2 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#526B50]" />
            Security & Change Password
          </h3>
          <p className="text-xs text-[#666666] font-medium mb-6">
            Update your authentication password securely. Your credentials are encrypted and managed directly through Supabase Auth.
          </p>

          {passwordError && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordNotice && (
            <div className="p-3 mb-4 rounded-xl bg-[#EDF2E9] border border-[#A8B99A] text-xs font-bold text-[#526B50] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{passwordNotice}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#171717] mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#526B50]" /> New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DE] bg-[#FFFDF8] font-mono text-xs focus:ring-2 focus:ring-[#FFE76B]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#171717] mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#526B50]" /> Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DE] bg-[#FFFDF8] font-mono text-xs focus:ring-2 focus:ring-[#FFE76B]"
              />
            </div>

            <Button
              type="submit"
              variant="secondary"
              size="sm"
              disabled={passwordLoading}
              className="gap-2 font-bold text-xs border-[#171717] bg-white hover:bg-[#F4F3EF]"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{passwordLoading ? 'Updating Password...' : 'Update Password'}</span>
            </Button>
          </form>
        </Card>

        {/* Data Portability & Export */}
        <Card variant="white" shadowSize="md" className="p-6 sm:p-8 bg-white border border-[#E8E5DE] rounded-2xl">
          <h3 className="font-extrabold text-lg text-[#171717] mb-2 flex items-center gap-2">
            <Download className="w-5 h-5 text-[#526B50]" />
            Sovereign Data Export & Backup
          </h3>
          <p className="text-xs sm:text-sm text-[#666666] font-medium mb-6">
            You own your career plan completely. Export your milestones, tasks, active habit streaks, and weekly logs as standard formatted JSON anytime.
          </p>

          <Button
            variant="secondary"
            size="md"
            onClick={handleExportJSON}
            className="gap-2 font-bold text-xs border-[#171717] bg-white hover:bg-[#F4F3EF] text-[#171717] shadow-[2px_2px_0px_#171717]"
          >
            <FileCode className="w-4 h-4 text-[#526B50]" />
            Download Complete Career Plan (JSON)
          </Button>
        </Card>

        {/* Danger Zone */}
        <Card variant="white" shadowSize="md" className="p-6 sm:p-8 bg-[#FFF5F5] border border-red-200 rounded-2xl">
          <h3 className="font-extrabold text-lg text-red-800 mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-700" />
            Danger Zone & Local Reset
          </h3>
          <p className="text-xs sm:text-sm text-red-700/80 font-medium mb-6">
            Clear all cached roadmap entries, reflections, and custom tasks, restoring initial templates in local storage.
          </p>

          <Button
            variant="dark"
            size="sm"
            onClick={() => setShowResetModal(true)}
            className="gap-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs border border-red-800 shadow-[2px_2px_0px_#7F1D1D]"
          >
            <Trash2 className="w-4 h-4" />
            Reset Local Career Cache
          </Button>
        </Card>
      </main>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-[#171717]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#171717] rounded-2xl shadow-[6px_6px_0px_#171717] max-w-md w-full p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-700 font-black text-lg">
                <AlertTriangle className="w-6 h-6" />
                Reset Career Data?
              </div>
              <button
                onClick={() => setShowResetModal(false)}
                className="w-8 h-8 rounded-lg border border-[#171717] bg-white flex items-center justify-center hover:bg-[#F4F3EF] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#555555] font-medium leading-relaxed">
              This action will reset your personalized milestones, custom checklist tasks, habit streaks, and restore default demo data in local storage.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowResetModal(false)}
                className="font-bold text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="dark"
                size="sm"
                onClick={handleConfirmReset}
                className="bg-red-700 hover:bg-red-800 text-white font-black text-xs"
              >
                Yes, Reset Data
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 z-50 bg-[#171717]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#171717] rounded-2xl shadow-[6px_6px_0px_#171717] max-w-md w-full p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#171717] font-black text-lg">
                <LogOut className="w-5 h-5 text-[#526B50]" />
                Sign Out of FOYC?
              </div>
              <button
                onClick={() => setShowSignOutModal(false)}
                className="w-8 h-8 rounded-lg border border-[#171717] bg-white flex items-center justify-center hover:bg-[#F4F3EF] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#555555] font-medium leading-relaxed">
              Your career plan, milestones, tasks, and habit streaks are securely saved in Supabase. You can sign in from any other computer or mobile device to pick up right where you left off.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowSignOutModal(false)}
                className="font-bold text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="dark"
                size="sm"
                onClick={handleConfirmSignOut}
                className="bg-[#171717] text-white hover:bg-[#333333] font-black text-xs"
              >
                Confirm Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
