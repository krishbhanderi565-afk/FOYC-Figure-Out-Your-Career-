import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CareerProvider } from './context/CareerContext';
import { SplashScreen } from './components/common/SplashScreen';
import { ScrollToTop } from './components/common/ScrollToTop';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { AboutPage } from './pages/AboutPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { MindReflectionPage } from './pages/MindReflectionPage';
import { PromptReadyPage } from './pages/PromptReadyPage';
import { HandoffImportPage } from './pages/HandoffImportPage';
import { HandoffPreviewPage } from './pages/HandoffPreviewPage';
import { AuthPage } from './pages/AuthPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { MyCareerPage } from './pages/dashboard/MyCareerPage';
import { RoadmapPage } from './pages/dashboard/RoadmapPage';
import { SkillDevelopmentPage } from './pages/dashboard/SkillDevelopmentPage';
import { ChecklistPage } from './pages/dashboard/ChecklistPage';
import { HabitTrackerPage as DashboardHabitTrackerPage } from './pages/dashboard/HabitTrackerPage';
import { HabitTrackerPage } from './pages/HabitTrackerPage';
import { ProjectsPage } from './pages/dashboard/ProjectsPage';
import { ResourcesPage } from './pages/dashboard/ResourcesPage';
import { WeeklyReviewPage } from './pages/dashboard/WeeklyReviewPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';

export function App() {
  return (
    <CareerProvider>
      <SplashScreen>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Discovery Flow */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/habit-tracker" element={<HabitTrackerPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/reflection" element={<MindReflectionPage />} />
            <Route path="/mind" element={<Navigate to="/reflection" replace />} />
            <Route path="/prompt-ready" element={<PromptReadyPage />} />
            <Route path="/import" element={<HandoffImportPage />} />
            <Route path="/import-preview" element={<HandoffPreviewPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/profile" element={<Navigate to="/dashboard/settings" replace />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />

            {/* Universal Personalized Dashboard Engine (10 Modules) */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<OverviewPage />} />
              <Route path="career" element={<MyCareerPage />} />
              <Route path="roadmap" element={<RoadmapPage />} />
              <Route path="skills" element={<SkillDevelopmentPage />} />
              <Route path="tasks" element={<ChecklistPage />} />
              <Route path="habits" element={<DashboardHabitTrackerPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="resources" element={<ResourcesPage />} />
              <Route path="review" element={<WeeklyReviewPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <MobileBottomNav />
        </BrowserRouter>
      </SplashScreen>
    </CareerProvider>
  );
}

export default App;
