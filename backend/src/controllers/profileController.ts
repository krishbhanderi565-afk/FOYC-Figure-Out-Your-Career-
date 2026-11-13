import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { getSupabaseAdminClient } from '../config/supabase.js';

interface UserProfileRecord {
  id: string;
  fullName?: string;
  preferredName?: string;
  email?: string;
  country?: string;
  education?: string;
  educationStatus?: string;
  profession?: string;
  careerStage?: string;
  experienceLevel?: string;
  profileSummary?: string;
  avatarUrl?: string;
  availableHours?: number;
  timezone?: string;
  updatedAt?: string;
}

const profileStore = new Map<string, UserProfileRecord>();

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const supabase = getSupabaseAdminClient();

  if (supabase && userId !== 'default-user' && !userId.startsWith('mock-')) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data) {
        res.json({
          success: true,
          profile: {
            id: data.id,
            fullName: data.full_name || data.preferred_name,
            preferredName: data.preferred_name || data.full_name,
            email: data.email || req.userEmail,
            country: data.country || '',
            education: data.education || data.education_status || '',
            educationStatus: data.education_status || data.education || '',
            profession: data.profession || '',
            careerStage: data.career_stage || data.experience_level || '',
            experienceLevel: data.experience_level || data.career_stage || '',
            profileSummary: data.profile_summary || '',
            avatarUrl: data.avatar_url || '',
            availableHours: data.available_hours || 15,
            timezone: data.timezone || 'UTC',
            updatedAt: data.updated_at,
          },
        });
        return;
      }
    } catch {}
  }

  const cached = profileStore.get(userId) || {
    id: userId,
    fullName: req.userEmail?.split('@')[0] || 'User',
    preferredName: req.userEmail?.split('@')[0] || 'User',
    email: req.userEmail || 'user@foyc.dev',
    country: 'India',
    education: 'Bachelor of Technology',
    educationStatus: 'College Student',
    profession: 'Software Engineering',
    careerStage: 'Aspiring Professional',
    experienceLevel: 'Entry Level',
    profileSummary: 'Passionate learner focused on modern software systems and career growth.',
    availableHours: 15,
    timezone: 'Asia/Kolkata',
  };

  res.json({ success: true, profile: cached });
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const updates = req.body;
  const supabase = getSupabaseAdminClient();

  if (supabase && userId !== 'default-user' && !userId.startsWith('mock-')) {
    try {
      const dbPayload: any = {
        updated_at: new Date().toISOString(),
      };
      if (updates.fullName !== undefined) dbPayload.full_name = updates.fullName;
      if (updates.preferredName !== undefined) dbPayload.preferred_name = updates.preferredName;
      if (updates.email !== undefined) dbPayload.email = updates.email;
      if (updates.country !== undefined) dbPayload.country = updates.country;
      if (updates.education !== undefined) {
        dbPayload.education = updates.education;
        dbPayload.education_status = updates.education;
      }
      if (updates.profession !== undefined) dbPayload.profession = updates.profession;
      if (updates.careerStage !== undefined) {
        dbPayload.career_stage = updates.careerStage;
        dbPayload.experience_level = updates.careerStage;
      }
      if (updates.profileSummary !== undefined) dbPayload.profile_summary = updates.profileSummary;
      if (updates.avatarUrl !== undefined) dbPayload.avatar_url = updates.avatarUrl;
      if (updates.availableHours !== undefined) dbPayload.available_hours = updates.availableHours;
      if (updates.timezone !== undefined) dbPayload.timezone = updates.timezone;

      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: userId, ...dbPayload }, { onConflict: 'id' })
        .select()
        .single();

      if (!error && data) {
        res.json({ success: true, profile: data });
        return;
      }
    } catch {}
  }

  const existing = profileStore.get(userId) || { id: userId };
  const updated: UserProfileRecord = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  profileStore.set(userId, updated);

  res.json({ success: true, profile: updated });
};
