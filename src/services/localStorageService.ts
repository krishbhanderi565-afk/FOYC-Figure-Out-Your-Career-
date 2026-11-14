import {
  UserProfile,
  UserReflection,
  CareerDashboardData,
  Milestone,
  TaskItem,
  HabitItem,
} from '../types/career';
import {
  DashboardConfiguration,
  DashboardThemeId,
  DEFAULT_DASHBOARD_CONFIG,
} from '../types/moduleRegistry';

export const CURRENT_SCHEMA_VERSION = 1;
export const STORAGE_KEY = 'foyc_local_data_v1';

export interface StoredAssessment {
  id: string;
  type: 'clarity' | 'possibility' | 'comparison' | 'discovery';
  createdAt: string;
  data: any;
}

export interface StoredReport {
  id: string;
  type: 'clarity' | 'possibility' | 'comparison' | 'career';
  title: string;
  createdAt: string;
  data: any;
}

export interface StoredActivity {
  id: string;
  timestamp: string;
  action: string;
  details?: string;
}

export interface FoycLocalData {
  schema_version: number;
  profile: UserProfile;
  reflection: UserReflection;
  preferences: {
    theme: DashboardThemeId;
    notificationsEnabled?: boolean;
  };
  assessments: StoredAssessment[];
  reports: StoredReport[];
  dashboard: {
    configuration: DashboardConfiguration;
    data: CareerDashboardData;
    hasGenerated: boolean;
  };
  activity: StoredActivity[];
  last_updated: string;
}

export const DEFAULT_LOCAL_PROFILE: UserProfile = {
  preferredName: '',
  ageRange: '18-22',
  country: 'Global',
  educationStatus: 'college-student',
  currentField: 'Undecided / Exploring',
  careerStage: 'exploring',
  workExperience: '',
  preferredLanguage: 'English',
  availableHoursPerWeek: 15,
};

export const DEFAULT_LOCAL_REFLECTION: UserReflection = {
  mindText: '',
  questionnaireAnswers: {},
  keyInterests: [],
  keyStruggles: [],
};

export const DEFAULT_LOCAL_DASHBOARD_DATA: CareerDashboardData = {
  profile: DEFAULT_LOCAL_PROFILE,
  reflection: DEFAULT_LOCAL_REFLECTION,
  direction: {
    primaryTitle: '',
    summary: '',
    matchReason: '',
    longTermGoal: '',
    shortTermObjective: '',
    alternativeTitles: [],
    strengths: [],
    existingSkills: [],
    skillGaps: [],
    reassessmentQuestions: [],
    assumptions: [],
    lastReassessedDate: '',
  },
  milestones: [],
  tasks: [],
  habits: [],
  projects: [],
  resources: [],
};

export const INITIAL_LOCAL_STORE: FoycLocalData = {
  schema_version: CURRENT_SCHEMA_VERSION,
  profile: DEFAULT_LOCAL_PROFILE,
  reflection: DEFAULT_LOCAL_REFLECTION,
  preferences: {
    theme: 'green',
    notificationsEnabled: false,
  },
  assessments: [],
  reports: [],
  dashboard: {
    configuration: DEFAULT_DASHBOARD_CONFIG,
    data: DEFAULT_LOCAL_DASHBOARD_DATA,
    hasGenerated: false,
  },
  activity: [],
  last_updated: new Date().toISOString(),
};

/**
 * Migration helper: Imports old fragmented localStorage keys into the new versioned unified store.
 */
function migrateLegacyStorage(): FoycLocalData {
  const store: FoycLocalData = JSON.parse(JSON.stringify(INITIAL_LOCAL_STORE));

  try {
    const oldProfile = localStorage.getItem('foyc_profile');
    if (oldProfile) {
      store.profile = { ...store.profile, ...JSON.parse(oldProfile) };
    }

    const oldReflection = localStorage.getItem('foyc_reflection');
    if (oldReflection) {
      store.reflection = { ...store.reflection, ...JSON.parse(oldReflection) };
    }

    const oldConfig = localStorage.getItem('foyc_dashboard_config');
    if (oldConfig) {
      store.dashboard.configuration = { ...store.dashboard.configuration, ...JSON.parse(oldConfig) };
      if (store.dashboard.configuration.theme) {
        store.preferences.theme = store.dashboard.configuration.theme;
      }
    }

    const oldTheme = localStorage.getItem('foyc_theme') as DashboardThemeId | null;
    if (oldTheme) {
      store.preferences.theme = oldTheme;
    }

    const oldData = localStorage.getItem('foyc_dashboard_data');
    const oldGenerated = localStorage.getItem('foyc_dashboard_generated') === 'true';
    if (oldData && oldGenerated) {
      const parsedData = JSON.parse(oldData);
      store.dashboard.data = parsedData;
      store.dashboard.hasGenerated = true;
    }

    store.last_updated = new Date().toISOString();
  } catch (err) {
    console.warn('[FOYC Storage] Legacy migration partial error:', err);
  }

  return store;
}

class LocalStorageService {
  private memoryCache: FoycLocalData | null = null;

  /**
   * Loads the complete local FOYC dataset safely.
   */
  public load(): FoycLocalData {
    if (this.memoryCache) {
      return this.memoryCache;
    }

    if (typeof window === 'undefined' || !window.localStorage) {
      return INITIAL_LOCAL_STORE;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Attempt legacy migration
        const migrated = migrateLegacyStorage();
        this.save(migrated);
        this.memoryCache = migrated;
        return migrated;
      }

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid storage format');
      }

      // Schema version check and future migrations
      if (parsed.schema_version !== CURRENT_SCHEMA_VERSION) {
        parsed.schema_version = CURRENT_SCHEMA_VERSION;
      }

      // Ensure all top-level sections exist
      const safeStore: FoycLocalData = {
        schema_version: CURRENT_SCHEMA_VERSION,
        profile: { ...DEFAULT_LOCAL_PROFILE, ...(parsed.profile || {}) },
        reflection: { ...DEFAULT_LOCAL_REFLECTION, ...(parsed.reflection || {}) },
        preferences: { theme: 'green', ...(parsed.preferences || {}) },
        assessments: Array.isArray(parsed.assessments) ? parsed.assessments : [],
        reports: Array.isArray(parsed.reports) ? parsed.reports : [],
        dashboard: {
          configuration: parsed.dashboard?.configuration || DEFAULT_DASHBOARD_CONFIG,
          data: parsed.dashboard?.data || DEFAULT_LOCAL_DASHBOARD_DATA,
          hasGenerated: Boolean(parsed.dashboard?.hasGenerated),
        },
        activity: Array.isArray(parsed.activity) ? parsed.activity : [],
        last_updated: parsed.last_updated || new Date().toISOString(),
      };

      this.memoryCache = safeStore;
      return safeStore;
    } catch (err) {
      console.error('[FOYC Storage] Failed to load local storage, using fallback:', err);
      const fallback = JSON.parse(JSON.stringify(INITIAL_LOCAL_STORE));
      this.memoryCache = fallback;
      return fallback;
    }
  }

  /**
   * Saves data to localStorage with quota overflow safeguards.
   */
  public save(data: FoycLocalData): boolean {
    data.last_updated = new Date().toISOString();
    this.memoryCache = data;

    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (err: any) {
      console.error('[FOYC Storage] LocalStorage save failure (quota or disabled):', err);
      // If quota exceeded, trim older activities or report caches
      if (err?.name === 'QuotaExceededError' || err?.code === 22) {
        try {
          data.activity = data.activity.slice(0, 10);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }
  }

  // --- Granular Updaters ---

  public updateProfile(updates: Partial<UserProfile>): FoycLocalData {
    const store = this.load();
    store.profile = { ...store.profile, ...updates };
    this.save(store);
    return store;
  }

  public updateReflection(updates: Partial<UserReflection>): FoycLocalData {
    const store = this.load();
    store.reflection = { ...store.reflection, ...updates };
    this.save(store);
    return store;
  }

  public updatePreferences(updates: Partial<FoycLocalData['preferences']>): FoycLocalData {
    const store = this.load();
    store.preferences = { ...store.preferences, ...updates };
    this.save(store);
    return store;
  }

  public updateDashboard(
    dataUpdates?: Partial<CareerDashboardData>,
    configUpdates?: Partial<DashboardConfiguration>,
    hasGenerated?: boolean
  ): FoycLocalData {
    const store = this.load();
    if (dataUpdates) {
      store.dashboard.data = { ...store.dashboard.data, ...dataUpdates };
    }
    if (configUpdates) {
      store.dashboard.configuration = { ...store.dashboard.configuration, ...configUpdates };
    }
    if (hasGenerated !== undefined) {
      store.dashboard.hasGenerated = hasGenerated;
    }
    this.save(store);
    return store;
  }

  public addReport(report: Omit<StoredReport, 'id' | 'createdAt'>): StoredReport {
    const store = this.load();
    const newReport: StoredReport = {
      ...report,
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    store.reports = [newReport, ...(store.reports || []).slice(0, 29)]; // retain top 30 reports
    this.save(store);
    return newReport;
  }

  public addAssessment(assessment: Omit<StoredAssessment, 'id' | 'createdAt'>): StoredAssessment {
    const store = this.load();
    const newAss: StoredAssessment = {
      ...assessment,
      id: `ass-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    store.assessments = [newAss, ...(store.assessments || []).slice(0, 29)];
    this.save(store);
    return newAss;
  }

  public recordActivity(action: string, details?: string): void {
    const store = this.load();
    const act: StoredActivity = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      details,
    };
    store.activity = [act, ...(store.activity || []).slice(0, 49)];
    this.save(store);
  }

  // --- Backup, Export, Import, Reset ---

  /**
   * Generates a downloadable JSON backup.
   */
  public exportBackup(): string {
    const store = this.load();
    const jsonString = JSON.stringify(store, null, 2);

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `foyc-backup-${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    return jsonString;
  }

  /**
   * Validates a JSON backup string before importing.
   */
  public validateBackup(rawJson: string): { valid: boolean; error?: string; data?: FoycLocalData } {
    try {
      if (!rawJson || typeof rawJson !== 'string') {
        return { valid: false, error: 'Backup content is empty or invalid.' };
      }
      const parsed = JSON.parse(rawJson);
      if (!parsed || typeof parsed !== 'object') {
        return { valid: false, error: 'File does not contain a valid JSON object.' };
      }
      if (!parsed.schema_version) {
        return { valid: false, error: 'Missing schema_version in backup file.' };
      }
      if (!parsed.profile || typeof parsed.profile !== 'object') {
        return { valid: false, error: 'Backup is missing required profile section.' };
      }
      if (!parsed.dashboard || typeof parsed.dashboard !== 'object') {
        return { valid: false, error: 'Backup is missing required dashboard section.' };
      }
      return { valid: true, data: parsed as FoycLocalData };
    } catch (e: any) {
      return { valid: false, error: `JSON Parse error: ${e?.message || 'Invalid syntax'}` };
    }
  }

  /**
   * Imports validated backup data.
   */
  public importBackup(backupData: FoycLocalData, mode: 'replace' | 'merge' = 'replace'): boolean {
    const current = this.load();
    let finalStore: FoycLocalData;

    if (mode === 'replace') {
      finalStore = {
        ...backupData,
        schema_version: CURRENT_SCHEMA_VERSION,
        profile: { ...DEFAULT_LOCAL_PROFILE, ...(backupData.profile || {}) },
        reflection: { ...DEFAULT_LOCAL_REFLECTION, ...(backupData.reflection || {}) },
        preferences: backupData.preferences ? { ...backupData.preferences } : { theme: 'green' },
        dashboard: {
          configuration: backupData.dashboard?.configuration || DEFAULT_DASHBOARD_CONFIG,
          data: backupData.dashboard?.data || DEFAULT_LOCAL_DASHBOARD_DATA,
          hasGenerated: Boolean(backupData.dashboard?.hasGenerated),
        },
        assessments: Array.isArray(backupData.assessments) ? backupData.assessments : [],
        reports: Array.isArray(backupData.reports) ? backupData.reports : [],
        activity: Array.isArray(backupData.activity) ? backupData.activity : [],
        last_updated: new Date().toISOString(),
      };
    } else {
      // Merge mode
      finalStore = {
        ...current,
        profile: { ...current.profile, ...backupData.profile },
        reflection: { ...current.reflection, ...backupData.reflection },
        preferences: { ...current.preferences, ...backupData.preferences },
        dashboard: {
          configuration: backupData.dashboard?.configuration || current.dashboard.configuration,
          data: backupData.dashboard?.data || current.dashboard.data,
          hasGenerated: backupData.dashboard?.hasGenerated ?? current.dashboard.hasGenerated,
        },
        assessments: [...(backupData.assessments || []), ...current.assessments],
        reports: [...(backupData.reports || []), ...current.reports],
        last_updated: new Date().toISOString(),
      };
    }

    const saved = this.save(finalStore);
    if (saved) {
      this.recordActivity('Imported backup', `Imported in ${mode} mode`);
    }
    return saved;
  }

  /**
   * Clears all local FOYC data and resets to initial defaults.
   */
  public clearAllData(): void {
    this.memoryCache = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(STORAGE_KEY);
      // Clear old legacy keys
      localStorage.removeItem('foyc_profile');
      localStorage.removeItem('foyc_reflection');
      localStorage.removeItem('foyc_dashboard_config');
      localStorage.removeItem('foyc_dashboard_data');
      localStorage.removeItem('foyc_dashboard_generated');
      localStorage.removeItem('foyc_theme');
      localStorage.removeItem('foyc_auth');
      localStorage.removeItem('foyc_auth_token');
      localStorage.removeItem('foyc_user_email');
      localStorage.removeItem('foyc_user_name');
      localStorage.removeItem('foyc_user_avatar');
      localStorage.removeItem('foyc_user_id');
      localStorage.removeItem('foyc_demo_mode');
    }
  }
}

export const localStorageService = new LocalStorageService();
