import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';

interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  skillsDeveloped: string[];
  status: 'planned' | 'in-progress' | 'completed';
  targetDate: string;
  projectUrl?: string;
  achievements?: string[];
}

const projectStore = new Map<string, Project[]>();

export const getProjects = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const projects = projectStore.get(userId) || [];
  res.json({ success: true, projects });
};

export const createProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const { title, description, skillsDeveloped, status, targetDate, projectUrl, achievements } = req.body;

  if (!title) {
    res.status(400).json({ success: false, error: 'Project title is required.' });
    return;
  }

  const newProject: Project = {
    id: `p-${Date.now()}`,
    userId,
    title: title.trim(),
    description: description || '',
    skillsDeveloped: Array.isArray(skillsDeveloped) ? skillsDeveloped : [],
    status: status || 'planned',
    targetDate: targetDate || 'Month 2',
    projectUrl,
    achievements: Array.isArray(achievements) ? achievements : [],
  };

  const userProjects = projectStore.get(userId) || [];
  userProjects.push(newProject);
  projectStore.set(userId, userProjects);

  res.status(201).json({ success: true, project: newProject });
};

export const updateProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const { projectId } = req.params;
  const updates = req.body;

  const userProjects = projectStore.get(userId) || [];
  const idx = userProjects.findIndex((p) => p.id === projectId);

  if (idx === -1) {
    res.status(404).json({ success: false, error: 'Project not found.' });
    return;
  }

  userProjects[idx] = { ...userProjects[idx], ...updates };
  projectStore.set(userId, userProjects);

  res.json({ success: true, project: userProjects[idx] });
};

export const deleteProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const { projectId } = req.params;

  const userProjects = projectStore.get(userId) || [];
  projectStore.set(userId, userProjects.filter((p) => p.id !== projectId));

  res.json({ success: true, message: 'Project removed successfully.' });
};
