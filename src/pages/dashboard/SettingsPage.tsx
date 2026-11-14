import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareer } from '../../context/CareerContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { DASHBOARD_THEMES, DashboardThemeId } from '../../types/moduleRegistry';
import {
  Download,
  Upload,
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
  CheckCircle2,
  Palette,
  Sparkles,
  Database,
  RefreshCw,
  HardDrive,
} from 'lucide-react';
import { localStorageService } from '../../services/localStorageService';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    profile,
    updateProfile,
    dashboardData,
    currentTheme,
    setTheme,
    exportLocalBackup,
    importLocalBackup,
    clearLocalData,
  } = useCareer();

  // Personal profile state
  const [fullName, setFullName] = useState(profile.preferredName || '');
  const [country, setCountry] = useState(profile.country || 'Global');
  const [education, setEducation] = useState<string>(profile.educationStatus || 'college-student');
  const [profession, setProfession] = useState<string>(profile.currentField || 'Software Engineering');
  const [careerStage, setCareerStage] = useState<string>(profile.careerStage || 'exploring');
  const [summary, setSummary] = useState(profile.workExperience || '');
  const [savedNotice, setSavedNotice] = useState(false);

  // Data management state
  const [showClearModal, setShowClearModal] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [pendingImportData, setPendingImportData] = useState<any | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
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

  const handleExport = () => {
    exportLocalBackup();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportNotice(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const validation = localStorageService.validateBackup(content);
        if (!validation.valid || !validation.data) {
          setImportError(validation.error || 'The selected file is not a valid FOYC backup.');
          return;
        }
        setPendingImportData(validation.data);
      } catch (err: any) {
        setImportError(`Failed to read file: ${err.message}`);
      }
    };
    reader.readAsText(file);
    // Reset file input value so user can re-select the same file if needed
    e.target.value = '';
  };

  const handleConfirmImport = () => {
    if (!pendingImportData) return;
    const success = importLocalBackup(pendingImportData, importMode);
    if (success) {
      setImportNotice(`Data successfully imported in ${importMode} mode!`);
      setPendingImportData(null);
      setTimeout(() => setImportNotice(null), 4000);
    } else {
      setImportError('Failed to import backup into local storage.');
    }
  };

  const handleConfirmClear = () => {
    clearLocalData();
    setShowClearModal(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-neutral-900 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Settings & Appearance</h1>
          <p className="text-sm text-neutral-500 mt-1 font-medium">
            Customize your local profile, visual theme, and sovereign data backups.
          </p>
        </div>

        {/* 1. Local Profile & Vision */}
        <Card variant="white" shadowSize="md" className="p-6 sm:p-8 bg-white border border-neutral-200/80 rounded-2xl">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-100">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                Local Profile
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                Stored privately in your browser. No account registration needed.
              </p>
            </div>
            {savedNotice && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-fade-in">
                Saved to Browser ✓
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  Display / Preferred Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-sm font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  Region / Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. India, United States, Global"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-sm font-medium outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  Current Field / Interest
                </label>
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="e.g. Product Design, AI Engineering, Entrepreneurship"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-sm font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  Career Stage
                </label>
                <select
                  value={careerStage}
                  onChange={(e) => setCareerStage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-medium text-neutral-800 bg-white outline-none"
                >
                  <option value="exploring">Exploring / Self-Discovery</option>
                  <option value="student">Student / Early Career</option>
                  <option value="transition">Career Switcher</option>
                  <option value="professional">Working Professional</option>
                  <option value="entrepreneur">Founder / Independent Builder</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Personal Vision / Experience Summary
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Briefly state your core motivations or background context."
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-800 outline-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="font-bold text-xs bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl shadow-sm"
              >
                Save Profile
              </Button>
            </div>
          </form>
        </Card>

        {/* 2. Theme Selection */}
        <Card variant="white" shadowSize="md" className="p-6 sm:p-8 bg-white border border-neutral-200/80 rounded-2xl">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-100">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-600" />
                Color Theme
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                Choose a palette that inspires your daily focus and routine.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {Object.values(DASHBOARD_THEMES).map((theme) => {
              const isSelected = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setTheme(theme.id as DashboardThemeId)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    isSelected
                      ? 'border-neutral-900 ring-2 ring-neutral-900 bg-neutral-50'
                      : 'border-neutral-200 hover:border-neutral-400 bg-white'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full shadow-inner flex items-center justify-center text-white"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                  <span className="text-xs font-bold text-neutral-800 capitalize">
                    {theme.name}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* 3. My FOYC Data — Backup, Export & Restore (Phase 8) */}
        <Card variant="white" shadowSize="md" className="p-6 sm:p-8 bg-white border border-neutral-200/80 rounded-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-emerald-600" />
                My FOYC Data & Sovereign Backup
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                You own your career blueprint completely. Export or restore your local records anytime.
              </p>
            </div>
          </div>

          {/* Feedback Banners */}
          {importNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{importNotice}</span>
            </div>
          )}

          {importError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Option 1: Export */}
            <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <Download className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-neutral-900">Export My Data</h3>
                <p className="text-xs text-neutral-500 mt-1 font-medium leading-relaxed">
                  Download a validated JSON file containing your local profile, goals, checklist items, habits, streaks, and preferences.
                </p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleExport}
                className="gap-2 font-bold text-xs border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-900 shadow-xs"
              >
                <FileCode className="w-4 h-4 text-emerald-600" />
                <span>Download Backup (.json)</span>
              </Button>
            </div>

            {/* Option 2: Import */}
            <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                  <Upload className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-neutral-900">Import My Data</h3>
                <p className="text-xs text-neutral-500 mt-1 font-medium leading-relaxed">
                  Restore an existing backup from your computer. Validates file schema before applying.
                </p>
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json,application/json"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2 font-bold text-xs border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-900 shadow-xs"
                >
                  <Upload className="w-4 h-4 text-indigo-600" />
                  <span>Choose Backup File</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* 4. Danger Zone & Permanent Reset */}
        <Card variant="white" shadowSize="md" className="p-6 sm:p-8 bg-rose-50/40 border border-rose-200/80 rounded-2xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-rose-200/50">
            <div>
              <h2 className="text-lg font-bold text-rose-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-rose-600" />
                Danger Zone
              </h2>
              <p className="text-xs text-rose-700/80 mt-0.5 font-medium">
                Permanent actions affecting local browser records.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Clear All Stored Data</h3>
              <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                Permanently wipes all locally saved FOYC goals, habits, milestones, and reflections from this browser.
              </p>
            </div>

            <Button
              variant="dark"
              size="sm"
              onClick={() => setShowClearModal(true)}
              className="gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm self-start sm:self-auto"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear My Data</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Import Confirmation Modal */}
      {pendingImportData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                Confirm Data Import
              </h3>
              <button
                type="button"
                onClick={() => setPendingImportData(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed font-medium">
              A valid FOYC backup was detected containing profile, goals, and habits. How would you like to apply it?
            </p>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  className="text-neutral-900"
                />
                <div>
                  <div className="font-bold text-neutral-900">Replace Everything</div>
                  <div className="text-neutral-500 text-[11px]">Overwrites current browser state with this backup file.</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'merge'}
                  onChange={() => setImportMode('merge')}
                  className="text-neutral-900"
                />
                <div>
                  <div className="font-bold text-neutral-900">Merge with Current Data</div>
                  <div className="text-neutral-500 text-[11px]">Appends imported goals and habits without wiping existing records.</div>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setPendingImportData(null)}
                className="px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-sm"
              >
                Confirm Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Data Destructive Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 space-y-4 animate-scale-up">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Clear All Local Data?</h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed font-medium">
                This will permanently delete all your custom goals, checklist items, habit streaks, and reflections from this browser. This action cannot be undone unless you have exported a JSON backup.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm"
              >
                Yes, Clear Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
