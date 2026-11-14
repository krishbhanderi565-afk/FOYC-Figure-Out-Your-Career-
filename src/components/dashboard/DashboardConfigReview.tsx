import React, { useState } from 'react';
import {
  Compass,
  Check,
  Plus,
  Trash2,
  ArrowRight,
  Sparkles,
  Palette,
  Layers,
  Info,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Button } from '../common/Button';
import {
  DashboardConfiguration,
  DASHBOARD_MODULE_REGISTRY,
  DASHBOARD_THEMES,
  DashboardThemeId,
} from '../../types/moduleRegistry';

interface DashboardConfigReviewProps {
  initialConfig: DashboardConfiguration;
  onConfirm: (finalConfig: DashboardConfiguration) => void;
  onBack: () => void;
}

export const DashboardConfigReview: React.FC<DashboardConfigReviewProps> = ({
  initialConfig,
  onConfirm,
  onBack,
}) => {
  const [config, setConfig] = useState<DashboardConfiguration>(initialConfig);
  const [selectedTheme, setSelectedTheme] = useState<DashboardThemeId>(initialConfig.theme || 'green');
  const [activeTab, setActiveTab] = useState<'modules' | 'theme'>('modules');

  const allModuleKeys = Object.keys(DASHBOARD_MODULE_REGISTRY);

  // Group A: Recommended
  const recommendedKeys = (config.required_modules || ['personal_vision', 'personal_goals', 'daily_priorities']).filter(
    (k) => DASHBOARD_MODULE_REGISTRY[k]
  );

  // Group B: Optional (configured in selected_modules but not in required)
  const optionalKeys = config.selected_modules.filter(
    (k) => !recommendedKeys.includes(k) && DASHBOARD_MODULE_REGISTRY[k]
  );

  // Group C: Not Included (modules in registry that are currently neither required nor selected)
  const notIncludedKeys = allModuleKeys.filter(
    (k) => !config.selected_modules.includes(k) && !recommendedKeys.includes(k)
  );

  const toggleModule = (moduleId: string) => {
    // If it's a strictly required module, don't allow disabling
    if (config.required_modules.includes(moduleId)) {
      return;
    }

    if (config.selected_modules.includes(moduleId)) {
      setConfig((prev) => ({
        ...prev,
        selected_modules: prev.selected_modules.filter((m) => m !== moduleId),
        module_order: prev.module_order.filter((m) => m !== moduleId),
      }));
    } else {
      setConfig((prev) => ({
        ...prev,
        selected_modules: [...prev.selected_modules, moduleId],
        module_order: [...prev.module_order, moduleId],
      }));
    }
  };

  const handleSelectTheme = (themeId: DashboardThemeId) => {
    setSelectedTheme(themeId);
    setConfig((prev) => ({ ...prev, theme: themeId }));
  };

  const handleConfirm = () => {
    onConfirm({
      ...config,
      theme: selectedTheme,
      updated_at: new Date().toISOString(),
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 border-[#171717] bg-white shadow-[2px_2px_0px_#171717] mb-3">
          <Sparkles className="w-4 h-4 text-[#D97706]" />
          <span className="text-xs font-black uppercase tracking-wider text-[#171717]">
            Adaptive Workspace Architect
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#171717] tracking-tight">
          Your Personalized Dashboard Configuration
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#555555] font-medium leading-relaxed">
          We tailored this workspace around your goals and daily reality. Review what you want enabled before generating your command center.
        </p>

        {/* Tab Switcher */}
        <div className="mt-6 inline-flex p-1 rounded-full bg-[#EAE6DF] border border-[#D5D0C7]">
          <button
            type="button"
            onClick={() => setActiveTab('modules')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'modules' ? 'bg-[#171717] text-white shadow-xs' : 'text-[#555555] hover:text-[#171717]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Modules & Layout ({config.selected_modules.length} Active)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('theme')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'theme' ? 'bg-[#171717] text-white shadow-xs' : 'text-[#555555] hover:text-[#171717]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Color Theme ({DASHBOARD_THEMES[selectedTheme].name})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MODULES CONFIGURATION */}
      {activeTab === 'modules' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Workspace Title & Description Quick Edit */}
          <div className="bg-white rounded-3xl border-2 border-[#171717] p-5 sm:p-6 shadow-[3px_3px_0px_#171717]">
            <h3 className="text-xs font-black uppercase text-[#666666] tracking-wider mb-2">
              Workspace Identity
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                value={config.dashboard_title}
                onChange={(e) => setConfig({ ...config, dashboard_title: e.target.value })}
                placeholder="Dashboard Title"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D5D0C7] font-black text-base text-[#171717] focus:border-[#171717] focus:outline-none"
              />
              <input
                type="text"
                value={config.primary_purpose}
                onChange={(e) => setConfig({ ...config, primary_purpose: e.target.value })}
                placeholder="Core Purpose or Target Outcome"
                className="w-full px-4 py-2 text-xs text-[#555555] font-medium rounded-xl border border-[#D5D0C7] focus:border-[#171717] focus:outline-none"
              />
            </div>
          </div>

          {/* GROUP A: RECOMMENDED MODULES */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#171717] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#526B50]" />
                <span>Group A — Essential Starting Modules ({recommendedKeys.length})</span>
              </h3>
              <span className="text-[11px] text-[#666666] font-medium">Recommended for your focus</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {recommendedKeys.map((key) => {
                const mod = DASHBOARD_MODULE_REGISTRY[key];
                if (!mod) return null;
                const ModIcon = mod.icon;
                const reason = config.module_reasons?.[key];

                return (
                  <div
                    key={key}
                    className="p-4 rounded-2xl border-2 border-[#171717] bg-white shadow-[2px_2px_0px_#171717] flex items-start gap-3.5 justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#EDF2E9] border border-[#A8B99A] text-[#526B50] flex items-center justify-center shrink-0 mt-0.5">
                        <ModIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-[#171717]">{mod.name}</h4>
                          <span className="text-[9px] font-black uppercase bg-[#FFE76B] px-1.5 py-0.5 rounded text-[#171717]">
                            Core
                          </span>
                        </div>
                        <p className="text-[11px] text-[#555555] leading-snug mt-0.5">{mod.shortDescription}</p>
                        {reason && (
                          <p className="text-[10px] text-[#526B50] font-bold mt-1.5 italic bg-[#F7FAF5] px-2 py-0.5 rounded border border-[#E0EBD8]">
                            "{reason}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GROUP B: OPTIONAL ENABLED MODULES */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#171717] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                <span>Group B — Active Optional Modules ({optionalKeys.length})</span>
              </h3>
              <span className="text-[11px] text-[#666666] font-medium">Click to remove if unneeded</span>
            </div>

            {optionalKeys.length === 0 ? (
              <div className="p-4 rounded-2xl border-2 border-dashed border-[#CCCCCC] text-center text-xs text-[#777777]">
                No optional modules currently active. You can add modules from Group C below.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {optionalKeys.map((key) => {
                  const mod = DASHBOARD_MODULE_REGISTRY[key];
                  if (!mod) return null;
                  const ModIcon = mod.icon;

                  return (
                    <div
                      key={key}
                      className="p-4 rounded-2xl border-2 border-[#171717] bg-[#FFFDF8] shadow-[2px_2px_0px_#171717] flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] border border-[#FCD34D] text-[#D97706] flex items-center justify-center shrink-0 mt-0.5">
                          <ModIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-black text-[#171717]">{mod.name}</h4>
                            <span className="text-[9px] font-bold uppercase bg-[#EAE6DF] px-1.5 py-0.5 rounded text-[#555555]">
                              Optional
                            </span>
                          </div>
                          <p className="text-[11px] text-[#555555] leading-snug mt-0.5">{mod.shortDescription}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleModule(key)}
                        className="text-xs font-bold text-[#999999] hover:text-[#DC2626] transition-colors p-1"
                        title="Remove from dashboard"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* GROUP C: AVAILABLE MODULE CATALOGUE (NOT INCLUDED) */}
          {notIncludedKeys.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#666666] flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#666666]" />
                  <span>Group C — Available in Catalogue ({notIncludedKeys.length})</span>
                </h3>
                <span className="text-[11px] text-[#666666] font-medium">Click + Add to include</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {notIncludedKeys.map((key) => {
                  const mod = DASHBOARD_MODULE_REGISTRY[key];
                  if (!mod) return null;
                  const ModIcon = mod.icon;

                  return (
                    <div
                      key={key}
                      className="p-3.5 rounded-2xl border border-[#D5D0C7] bg-[#FAF8F5] hover:border-[#171717] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <ModIcon className="w-4 h-4 text-[#666666]" />
                          <h4 className="text-xs font-bold text-[#171717]">{mod.name}</h4>
                        </div>
                        <p className="text-[10px] text-[#666666] leading-tight mb-3">{mod.shortDescription}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleModule(key)}
                        className="w-full py-1.5 rounded-xl border border-[#171717] bg-white hover:bg-[#FFE76B] text-[11px] font-black text-[#171717] transition-colors flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Module</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COLOR THEME SELECTOR */}
      {activeTab === 'theme' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl border-2 border-[#171717] p-6 shadow-[3px_3px_0px_#171717]">
            <h3 className="text-base font-black text-[#171717] mb-1">Select Your Dashboard Color Theme</h3>
            <p className="text-xs text-[#555555] mb-6">
              Personalize the visual atmosphere of your workspace. Colors apply dynamically across your sidebar, badges, and progress cards.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(Object.keys(DASHBOARD_THEMES) as DashboardThemeId[]).map((tId) => {
                const t = DASHBOARD_THEMES[tId];
                const selected = selectedTheme === tId;

                return (
                  <button
                    key={tId}
                    type="button"
                    onClick={() => handleSelectTheme(tId)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                      selected
                        ? 'border-[#171717] shadow-[3px_3px_0px_#171717] bg-[#FAF8F5]'
                        : 'border-[#E8E5DE] bg-white hover:border-[#171717]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-5 h-5 rounded-full border border-black/20"
                            style={{ backgroundColor: t.badgeColor }}
                          />
                          <span className="text-xs font-black text-[#171717]">{t.name}</span>
                        </div>
                        {selected && (
                          <div className="w-5 h-5 rounded-full bg-[#171717] text-white flex items-center justify-center text-[11px] font-bold">
                            ✓
                          </div>
                        )}
                      </div>

                      {/* Mini Preview Swatches */}
                      <div className="flex items-center gap-1.5 p-2 rounded-xl bg-gray-50 border border-gray-200">
                        <span className="w-4 h-4 rounded" style={{ backgroundColor: t.primaryColor }} />
                        <span className="w-4 h-4 rounded" style={{ backgroundColor: t.accentBg, border: `1px solid ${t.accentBorder}` }} />
                        <span className="w-4 h-4 rounded" style={{ backgroundColor: t.pillBg }} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Actions Bar */}
      <div className="mt-8 pt-4 border-t-2 border-[#171717]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button variant="secondary" size="md" onClick={onBack} className="w-full sm:w-auto font-bold border-[#171717]">
          Back to Raw Text
        </Button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="primary"
            size="lg"
            onClick={handleConfirm}
            className="w-full sm:w-auto gap-2.5 font-black bg-[#FFE76B] text-[#171717] border-2 border-[#171717] shadow-[4px_4px_0px_#171717] hover:bg-[#FADB3D]"
          >
            <span>Generate My Personalized Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
