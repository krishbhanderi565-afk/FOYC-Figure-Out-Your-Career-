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
  Sparkles,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { profile, updateProfile, dashboardData, resetToDefault } = useCareer();
  const [name, setName] = useState(profile.preferredName || '');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ preferredName: name });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dashboardData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `FOYC_Career_Plan_${dashboardData.direction.primaryTitle.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleReset = () => {
    if (window.confirm('Reset all local career data and return to initial software engineering template?')) {
      resetToDefault();
      alert('Reset completed.');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        onOpenMobileMenu={() => {}}
        title="Settings & Privacy"
        subtitle="Manage personal preferences, export career data, and privacy settings."
      />

      <main className="p-4 sm:p-8 space-y-8 max-w-4xl">
        {/* Profile Settings */}
        <Card variant="white" shadowSize="md" className="p-6 sm:p-8">
          <h3 className="font-extrabold text-lg text-[#17172B] mb-4 pb-2 border-b-2 border-[#17172B]/20 flex items-center gap-2">
            <User className="w-5 h-5 text-[#17172B]" />
            Profile Preferences
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1">
                Preferred Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full max-w-md px-4 py-2.5 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-bold text-sm focus:ring-2 focus:ring-[#FFE76B]"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" variant="primary" size="sm" className="font-black">
                Update Profile
              </Button>
              {savedNotice && (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Changes Saved!
                </span>
              )}
            </div>
          </form>
        </Card>

        {/* Data Export Card */}
        <Card variant="white" shadowSize="md" className="p-6 sm:p-8">
          <h3 className="font-extrabold text-lg text-[#17172B] mb-2 flex items-center gap-2">
            <Download className="w-5 h-5 text-[#17172B]" />
            Data Portability & Export
          </h3>
          <p className="text-xs sm:text-sm text-[#17172B]/75 font-medium mb-6">
            You own your data completely. Download your full career plan, milestones, and habit history as structured JSON.
          </p>

          <Button
            variant="secondary"
            size="md"
            onClick={handleExportJSON}
            className="gap-2 font-bold"
          >
            <Download className="w-4 h-4" />
            Download Complete Career Plan (JSON)
          </Button>
        </Card>

        {/* Privacy & Session Reset */}
        <Card variant="pink" shadowSize="md" className="p-6 sm:p-8">
          <h3 className="font-extrabold text-lg text-[#17172B] mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-700" />
            Danger Zone & Local Reset
          </h3>
          <p className="text-xs sm:text-sm text-[#17172B]/80 font-medium mb-6">
            Clear all cached roadmap entries, reflections, and tasks from your browser storage.
          </p>

          <Button
            variant="dark"
            size="sm"
            onClick={handleReset}
            className="gap-2 bg-red-700 hover:bg-red-800 text-white font-bold"
          >
            <Trash2 className="w-4 h-4" />
            Reset All Local Data
          </Button>
        </Card>
      </main>
    </div>
  );
};
