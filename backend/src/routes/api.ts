import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  createOrGetSession,
  updateSession,
  getSessionDraft,
} from '../controllers/sessionController.js';
import { generatePrompt } from '../controllers/promptController.js';
import { importHandoff } from '../controllers/handoffController.js';
import {
  getDashboardData,
  transferAnonymousDraftToUser,
  reassessDirection,
} from '../controllers/dashboardController.js';
import {
  getProfile,
  updateProfile,
} from '../controllers/profileController.js';
import {
  getMilestones,
  toggleMilestone,
} from '../controllers/milestoneController.js';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import {
  getHabits,
  createHabit,
  updateHabit,
  toggleHabitLog,
  deleteHabit,
} from '../controllers/habitController.js';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import {
  getReviews,
  createReview,
} from '../controllers/reviewController.js';
import {
  saveAssessmentDraft,
  getAssessment,
  finalizeReport,
  transferClarityToDashboard,
} from '../controllers/clarityController.js';
import {
  savePossibilityDraft,
  getPossibilityExploration,
  finalizePossibilityReport,
  transferPossibilityToDashboard,
} from '../controllers/possibilityController.js';
import { isLiveSupabaseActive } from '../config/supabase.js';

const router = Router();

// 1. Health & Status
router.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    product: 'FOYC (Figure Out Your Career)',
    version: '1.0.0',
    targetProjectId: 'rlrzdvebvbtegxixyfrb',
    liveDatabaseConnected: isLiveSupabaseActive(),
    timestamp: new Date().toISOString(),
  });
});

// 2. Anonymous Discovery Sessions
router.post('/discovery/session', createOrGetSession);
router.put('/discovery/session/:sessionId', updateSession);
router.get('/discovery/session/:sessionId', getSessionDraft);

// 3. Prompt Generation
router.post('/prompt/generate', generatePrompt);

// 4. Handoff Import & Parsing
router.post('/handoff/import', importHandoff);

// 5. User Profile
router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);

// 6. Authenticated Dashboard & Data Transfer
router.get('/dashboard', requireAuth, getDashboardData);
router.post('/dashboard/transfer', requireAuth, transferAnonymousDraftToUser);
router.post('/dashboard/reassess', requireAuth, reassessDirection);

// 7. Milestones
router.get('/milestones', requireAuth, getMilestones);
router.post('/milestones/:milestoneId/toggle', requireAuth, toggleMilestone);

// 8. Tasks
router.get('/tasks', requireAuth, getTasks);
router.post('/tasks', requireAuth, createTask);
router.put('/tasks/:taskId', requireAuth, updateTask);
router.delete('/tasks/:taskId', requireAuth, deleteTask);

// 9. Habits
router.get('/habits', requireAuth, getHabits);
router.post('/habits', requireAuth, createHabit);
router.put('/habits/:habitId', requireAuth, updateHabit);
router.post('/habits/:habitId/toggle', requireAuth, toggleHabitLog);
router.delete('/habits/:habitId', requireAuth, deleteHabit);

// 10. Projects
router.get('/projects', requireAuth, getProjects);
router.post('/projects', requireAuth, createProject);
router.put('/projects/:projectId', requireAuth, updateProject);
router.delete('/projects/:projectId', requireAuth, deleteProject);

// 11. Weekly Reviews
router.get('/reviews', requireAuth, getReviews);
router.post('/reviews', requireAuth, createReview);

// 12. Clarity Compass
router.post('/clarity/assessment', saveAssessmentDraft);
router.get('/clarity/assessment', getAssessment);
router.post('/clarity/finalize', finalizeReport);
router.post('/clarity/to-dashboard', requireAuth, transferClarityToDashboard);

// 13. Possibility Explorer
router.post('/possibility/exploration', savePossibilityDraft);
router.get('/possibility/exploration', getPossibilityExploration);
router.post('/possibility/finalize', finalizePossibilityReport);
router.post('/possibility/to-dashboard', requireAuth, transferPossibilityToDashboard);

export default router;
