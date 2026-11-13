import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  Settings,
  Download,
  RotateCcw,
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
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { profile, updateProfile, dashboardData, resetToDefault } = useCareer();
  const [name, setName] = useState(profile.preferredName || '');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [language, setLanguage] = useState('en');
  const [emailReminders, setEmailReminders] = useState(true);
  const [habitPings, setHabitPings] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ preferredName: name });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
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

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        onOpenMobileMenu={() => {}}
        title="Settings & Preferences"
        subtitle="Manage personal preferences, export your career roadmap, and privacy configurations."
      />

      <main className="p-4 sm:p-8 space-y-8 max-w-4xl">
        {/* Profile & Regional Settings */}
        <Card variant="white" shadowSize="md" className="p-6 sm:p-8">
          <h3 className="font-extrabold text-lg text-[#17172B] mb-4 pb-2 border-b-2 border-[#17172B]/10 flex items-center gap-2">
            <User className="w-5 h-5 text-[#17172B]" />
            Personal & Regional Profile
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1.5">
                Preferred Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Chen"
                className="w-full max-w-md px-4 py-2.5 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-bold text-sm focus:ring-2 focus:ring-[#FFE76B]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#17172B]" /> Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-bold text-xs focus:ring-2 focus:ring-[#FFE76B]"
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
                <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[#17172B]" /> Interface Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-bold text-xs focus:ring-2 focus:ring-[#FFE76B]"
                >
                  <option value="en">English (US / Global)</option>
                  <option value="es">Español (Spanish)</option>
                  <option value="fr">Français (French)</option>
                  <option value="de">Deutsch (German)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" variant="primary" size="md" className="font-black">
                Save Preferences
              </Button>
              {savedNotice && (
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300 flex items-center gap-1 animate-fadeIn">
                  <Check className="w-4 h-4" /> Preferences Updated!
                </span>
              )}
            </div>
          </form>
        </Card>

        {/* Notification Reminders */}
        <Card variant="white" shadowSize="md" className="p-6 sm:p-8">
          <h3 className="font-extrabold text-lg text-[#17172B] mb-4 pb-2 border-b-2 border-[#17172B]/10 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#17172B]" />
            Reminders & Accountability
          </h3>

          <div className="space-y-4 max-w-xl">
            <label className="flex items-start gap-3 p-3.5 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] cursor-pointer hover:bg-[#FFE76B]/20 transition-colors">
              <input
                type="checkbox"
                checked={emailReminders}
                onChange={(e) => setEmailReminders(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-[#17172B] accent-[#17172B]"
              />
              <div className="text-xs">
                <span className="font-black text-[#17172B] block">Sunday Weekly Calibration Reminder</span>
                <span className="text-[#17172B]/75 font-medium">Receive an email prompt every Sunday evening to log accomplishments and review upcoming priorities.</span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] cursor-pointer hover:bg-[#FFE76B]/20 transition-colors">
              <input
                type="checkbox"
                checked={habitPings}
                onChange={(e) => setHabitPings(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-[#17172B] accent-[#17172B]"
              />
              <div className="text-xs">
                <span className="font-black text-[#17172B] block">Daily Habit Streak Notifications</span>
                <span className="text-[#17172B]/75 font-medium">Get a gentle nudge when your daily 45-minute deep work streak is at risk of resetting.</span>
              </div>
            </label>
          </div>
        </Card>

        {/* Data Portability & Export */}
        <Card variant="white" shadowSize="md" className="p-6 sm:p-8">
          <h3 className="font-extrabold text-lg text-[#17172B] mb-2 flex items-center gap-2">
            <Download className="w-5 h-5 text-[#17172B]" />
            Sovereign Data Export & Backup
          </h3>
          <p className="text-xs sm:text-sm text-[#17172B]/75 font-medium mb-6">
            You own your career plan completely. Export your milestones, tasks, active habit streaks, and weekly logs as standard formatted JSON anytime.
          </p>

          <Button
            variant="secondary"
            size="md"
            onClick={handleExportJSON}
            className="gap-2 font-black shadow-[3px_3px_0px_#17172B]"
          >
            <FileCode className="w-4 h-4 text-[#17172B]" />
            Download Complete Career Plan (JSON)
          </Button>
        </Card>

        {/* Danger Zone */}
        <Card variant="pink" shadowSize="md" className="p-6 sm:p-8">
          <h3 className="font-extrabold text-lg text-[#17172B] mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-700" />
            Danger Zone & Local Reset
          </h3>
          <p className="text-xs sm:text-sm text-[#17172B]/80 font-medium mb-6">
            Clear all cached roadmap entries, reflections, custom tasks, and reset to initial software engineering template.
          </p>

          <Button
            variant="dark"
            size="sm"
            onClick={() => setShowResetModal(true)}
            className="gap-2 bg-red-700 hover:bg-red-800 text-white font-bold"
          >
            <Trash2 className="w-4 h-4" />
            Reset All Local Data
          </Button>
        </Card>
      </main>

      {/* Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-[#17172B]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFF8E9] border-3 border-[#17172B] rounded-2xl shadow-[6px_6px_0px_#17172B] max-w-md w-full p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-700 font-black text-lg">
                <AlertTriangle className="w-6 h-6" />
                Reset Career Data?
              </div>
              <button
                onClick={() => setShowResetModal(false)}
                className="w-8 h-8 rounded-lg border-2 border-[#17172B] bg-white flex items-center justify-center hover:bg-[#FFD9E8] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#17172B]/85 font-medium leading-relaxed">
              This action will reset your personalized milestones, custom checklist tasks, habit streaks, and restore default demo data in local storage.
            </p>

            <div className="p-3 bg-[#FFD9E8] rounded-xl border border-red-300 text-xs font-bold text-[#17172B]">
              Tip: You can export your current data as JSON before resetting.
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowResetModal(false)}
                className="font-bold"
              >
                Cancel
              </Button>
              <Button
                variant="dark"
                size="sm"
                onClick={handleConfirmReset}
                className="bg-red-700 hover:bg-red-800 text-white font-black"
              >
                Yes, Reset All Data
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
