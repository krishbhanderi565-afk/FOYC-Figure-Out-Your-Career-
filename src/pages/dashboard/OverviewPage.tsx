import React, { useMemo } from 'react';
import { useCareer } from '../../context/CareerContext';
import { PERSONA_PRESETS } from '../../data/personaPresets';
import { calculateDashboardProgress } from '../../utils/progressCalculator';
import { MyProgressSection } from '../../components/dashboard/MyProgressSection';
import { HabitTrackerSection } from '../../components/dashboard/HabitTrackerSection';
import { GoalChecklistSection } from '../../components/dashboard/GoalChecklistSection';
import { Sparkles, User, Palette } from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const {
    dashboardData,
    dashboardConfig,
    userName,
    userEmail,
    isDemoMode,
    enterDemoMode,
    exitDemoMode,
    toggleTask,
    addTask,
    updateTask,
    deleteTask,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    toggleMilestone,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    currentTheme,
    setTheme,
  } = useCareer();

  const [activePersonaId, setActivePersonaId] = React.useState<string>('student');

  // Determine active data: real user data or persona preset
  const activePreset = isDemoMode
    ? PERSONA_PRESETS[activePersonaId] || PERSONA_PRESETS.student
    : null;

  const currentData = activePreset ? activePreset.data : dashboardData;
  const milestones = currentData?.milestones || [];
  const tasks = currentData?.tasks || [];
  const habits = currentData?.habits || [];

  // Centralized Progress Calculation
  const progressSummary = useMemo(() => {
    return calculateDashboardProgress(milestones, tasks, habits);
  }, [milestones, tasks, habits]);

  // Display Name
  const displayName = isDemoMode
    ? activePreset?.name?.split(' ')[0] || 'Alex'
    : userName || userEmail?.split('@')[0] || 'Explorer';

  const careerTitle =
    currentData?.direction?.primaryTitle ||
    currentData?.primaryCareer?.title ||
    (isDemoMode ? activePreset?.role || 'Personal Direction' : undefined);

  // Smooth scroll anchors for summary card clicks
  const scrollToGoals = () => {
    document.getElementById('goal-checklist-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHabits = () => {
    document.getElementById('habit-tracker-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-neutral-900 pb-16 transition-colors duration-300">
      {/* Top Floating Control Bar for Demo / Persona Validation & Theme */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-neutral-200/70 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-600">Mode:</span>
            {isDemoMode ? (
              <span className="px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-300/60">
                Persona Preview ({activePreset?.archetype})
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                Live Authenticated Workspace
              </span>
            )}

            {isDemoMode ? (
              <button
                type="button"
                onClick={exitDemoMode}
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 underline ml-2"
              >
                Exit Preview
              </button>
            ) : (
              <button
                type="button"
                onClick={enterDemoMode}
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 underline ml-2"
              >
                Explore Personas
              </button>
            )}
          </div>

          {/* Persona selector if in demo/preview mode */}
          {isDemoMode && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-neutral-600 mr-1">Switch Persona:</span>
              {(['student', 'homemaker', 'entrepreneur', 'professional'] as const).map((pKey) => {
                const p = PERSONA_PRESETS[pKey];
                return (
                  <button
                    key={pKey}
                    type="button"
                    onClick={() => setActivePersonaId(pKey)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      activePersonaId === pKey
                        ? 'bg-neutral-900 text-white font-bold shadow-xs'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {p.name.split(' ')[0]} ({p.archetype})
                  </button>
                );
              })}
            </div>
          )}

          {/* Theme Quick Toggle */}
          <div className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-neutral-500" />
            <span className="font-semibold text-neutral-500">Theme:</span>
            {(['green', 'blue', 'purple', 'black'] as const).map((th) => (
              <button
                key={th}
                type="button"
                onClick={() => setTheme(th)}
                className={`w-4 h-4 rounded-full border transition-all ${
                  currentTheme === th ? 'scale-125 ring-2 ring-neutral-900 ring-offset-1' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor:
                    th === 'green' ? '#10B981' : th === 'blue' ? '#3B82F6' : th === 'purple' ? '#8B5CF6' : '#18181B',
                }}
                title={`${th} theme`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area — Strictly Three Core Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-10">
        {/* FEATURE 01: MY PROGRESS */}
        <div id="my-progress-section">
          <MyProgressSection
            summary={progressSummary}
            displayName={displayName}
            careerTitle={careerTitle}
            onNavigateToGoals={scrollToGoals}
            onNavigateToHabits={scrollToHabits}
          />
        </div>

        {/* FEATURE 02: FULLY INTERACTIVE HABIT TRACKER */}
        <div id="habit-tracker-section">
          <HabitTrackerSection
            habits={habits}
            onToggleHabit={toggleHabit}
            onAddHabit={addHabit}
            onUpdateHabit={updateHabit}
            onDeleteHabit={deleteHabit}
          />
        </div>

        {/* FEATURE 03: PERSONALIZED GOAL CHECKLIST */}
        <div id="goal-checklist-section">
          <GoalChecklistSection
            milestones={milestones}
            tasks={tasks}
            onToggleTask={toggleTask}
            onAddTask={addTask}
            onDeleteTask={deleteTask}
            onToggleMilestone={toggleMilestone}
            onAddMilestone={addMilestone}
            onUpdateMilestone={updateMilestone}
            onDeleteMilestone={deleteMilestone}
          />
        </div>
      </main>
    </div>
  );
};
