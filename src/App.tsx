import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CareerProvider } from './context/CareerContext';
import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { MindReflectionPage } from './pages/MindReflectionPage';
import { PromptReadyPage } from './pages/PromptReadyPage';
import { HandoffImportPage } from './pages/HandoffImportPage';
import { HandoffPreviewPage } from './pages/HandoffPreviewPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { MyCareerPage } from './pages/dashboard/MyCareerPage';
import { RoadmapPage } from './pages/dashboard/RoadmapPage';
import { ChecklistPage } from './pages/dashboard/ChecklistPage';
import { HabitTrackerPage } from './pages/dashboard/HabitTrackerPage';
import { ProjectsPage } from './pages/dashboard/ProjectsPage';
import { ResourcesPage } from './pages/dashboard/ResourcesPage';
import { WeeklyReviewPage } from './pages/dashboard/WeeklyReviewPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';

export function App() {
  return (
    <CareerProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Discovery Flow */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/reflection" element={<MindReflectionPage />} />
          <Route path="/mind" element={<Navigate to="/reflection" replace />} />
          <Route path="/prompt-ready" element={<PromptReadyPage />} />
          <Route path="/import" element={<HandoffImportPage />} />
          <Route path="/import-preview" element={<HandoffPreviewPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />

          {/* Universal Personalized Dashboard Engine */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="career" element={<MyCareerPage />} />
            <Route path="roadmap" element={<RoadmapPage />} />
            <Route path="tasks" element={<ChecklistPage />} />
            <Route path="habits" element={<HabitTrackerPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="review" element={<WeeklyReviewPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CareerProvider>
  );
}

export default App;
