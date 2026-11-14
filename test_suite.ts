import { parseHandoffText } from './src/utils/handoffParser';
import { SAMPLE_HANDOFFS } from './src/utils/sampleHandoffs';
import { PERSONA_PRESETS } from './src/data/personaPresets';
import { getChatGPTUrl } from './src/utils/chatGptLauncher';
import { generateDiscoveryPrompt } from './src/utils/promptGenerator';
import { generateClarityChatGptPrompt, generateInitialClarityAssessment } from './src/utils/clarityEngine';
import { generatePossibilityPrompt } from './src/utils/possibilityEngine';
import { generateComparisonPrompt } from './src/utils/comparisonEngine';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, details?: any) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${testName}`, details || '');
  }
}

console.log('======================================================');
console.log('FOYC MASTER QA VERIFICATION & REGRESSION TEST SUITE');
console.log('======================================================\n');

// 1. Handoff Parser Validation
console.log('--- 1. Testing Handoff Parser with Sample Handoffs ---');
assert(SAMPLE_HANDOFFS.length >= 3, `Sample handoffs present (count: ${SAMPLE_HANDOFFS.length})`);

for (const sample of SAMPLE_HANDOFFS) {
  const result = parseHandoffText(sample.rawText);
  assert(result.success, `parseHandoffText for sample "${sample.title}" succeeds`);
  assert(!!result.data?.direction?.primaryTitle, `"${sample.id}" has valid primary career direction: ${result.data?.direction?.primaryTitle}`);
  assert((result.data?.milestones?.length || 0) > 0, `"${sample.id}" contains milestones (count: ${result.data?.milestones?.length})`);
  assert((result.data?.tasks?.length || 0) > 0, `"${sample.id}" contains tasks (count: ${result.data?.tasks?.length})`);
  assert((result.data?.habits?.length || 0) > 0, `"${sample.id}" contains habits (count: ${result.data?.habits?.length})`);
}

// 2. Persona Presets Validation
console.log('\n--- 2. Testing Multi-Persona Presets ---');
const expectedPersonas = ['student', 'homemaker', 'entrepreneur', 'professional'];
for (const pKey of expectedPersonas) {
  const p = PERSONA_PRESETS[pKey];
  assert(!!p, `Persona "${pKey}" exists`);
  assert(!!p.name && !!p.role, `Persona "${pKey}" has name and role: ${p?.name} (${p?.role})`);
  assert(!!p.data?.milestones && p.data.milestones.length > 0, `Persona "${pKey}" has roadmap milestones (count: ${p?.data?.milestones?.length})`);
  assert(!!p.data?.tasks && p.data.tasks.length > 0, `Persona "${pKey}" has assigned tasks (count: ${p?.data?.tasks?.length})`);
  assert(!!p.data?.habits && p.data.habits.length > 0, `Persona "${pKey}" has habits configured (count: ${p?.data?.habits?.length})`);
}

// 3. ChatGPT Launcher & Auto-Paste URL Encoding
console.log('\n--- 3. Testing ChatGPT Launcher URL Generation ---');
const testPrompt = 'Hello ChatGPT, this is a test prompt with & special = characters?';
const gptUrl = getChatGPTUrl(testPrompt);
assert(gptUrl.startsWith('https://chatgpt.com/?q='), 'URL starts with https://chatgpt.com/?q=');
assert(gptUrl.includes(encodeURIComponent(testPrompt)), 'Prompt is correctly URI-encoded');

// 4. ChatGPT Prompt Generation & 5-Question Limit Enforcement
console.log('\n--- 4. Testing 5-Question Cadence in All Feature Prompts ---');
const dummyProfile: any = { preferredName: 'Jordan', currentEducationOrProfession: 'Software Eng', country: 'Global' };

// 4a. Main Assessment Prompt
const mainPrompt = generateDiscoveryPrompt(dummyProfile, {} as any);
assert(mainPrompt.includes('5 questions') || mainPrompt.includes('BATCH') || mainPrompt.includes('QUESTION BUDGET & CADENCE'), 'Main assessment prompt enforces 5-question limit/checkpoint');
assert(mainPrompt.includes('FOYC_DASHBOARD_START'), 'Main assessment prompt specifies FOYC_DASHBOARD_START schema');

// 4b. Clarity Compass Prompt
const initialClarity = generateInitialClarityAssessment('college_student', '', ['career_direction'], '', 'Curious about product design', {});
const clarityPrompt = generateClarityChatGptPrompt('college_student', '', ['career_direction'], '', 'Curious about product design', {}, initialClarity, 'Jordan');
assert(clarityPrompt.includes('5 questions') || clarityPrompt.includes('QUESTION BUDGET & CADENCE') || clarityPrompt.includes('CHECKPOINT'), 'Clarity Compass prompt enforces 5-question limit/checkpoint');

// 4c. Possibility Explorer Prompt
const dummyPossibilityData: any = {
  lifeStage: 'college_student',
  lifeStageOther: '',
  interests: ['Artificial Intelligence', 'Software Development'],
  skillsPossessed: ['Python', 'Problem Solving'],
  skillsToDevelop: ['Machine Learning', 'Cloud Systems'],
  ambitions: ['Lead innovative tech projects'],
};
const possibilityPrompt = generatePossibilityPrompt(dummyPossibilityData, 'Jordan');
assert(possibilityPrompt.includes('5 questions') || possibilityPrompt.includes('QUESTION BUDGET & CADENCE') || possibilityPrompt.includes('CHECKPOINT'), 'Possibility Explorer prompt enforces 5-question limit/checkpoint');

// 4d. Career Comparison Prompt
const dummyComparisonInput: any = {
  userProfile: dummyProfile,
  paths: [
    { title: 'AI Engineer', workStyle: 'Deep Focus', timelineMonths: 6, riskLevel: 'Medium' },
    { title: 'Product Manager', workStyle: 'Collaborative', timelineMonths: 12, riskLevel: 'Low' }
  ],
  priorities: ['High Growth', 'Autonomy']
};
const comparisonPrompt = generateComparisonPrompt(dummyComparisonInput);
assert(comparisonPrompt.includes('5 questions') || comparisonPrompt.includes('QUESTION BUDGET & CADENCE') || comparisonPrompt.includes('CHECKPOINT'), 'Comparison Engine prompt enforces 5-question limit/checkpoint');

// 5. Final Sanity Checks
console.log('\n--- 5. Testing Schema & Parser Robustness ---');
assert(typeof parseHandoffText === 'function', 'parseHandoffText function is exported and accessible');

// Test resilient JSON extraction from markdown code fence
const markdownWrappedJson = `
Here is your personalized roadmap:
\`\`\`json
{
  "profile": { "preferred_name": "Test User" },
  "career_direction": { "primary_career_direction": "Data Scientist" },
  "roadmap": { "milestones": [{ "id": "ms-1", "title": "Math Foundations", "stage": "Foundation", "is_completed": true }] },
  "tasks": [{ "id": "t1", "title": "Linear Algebra", "due_date": "Due Today" }],
  "habits": [{ "id": "h1", "name": "Solve 1 Problem Daily", "frequency": "daily" }]
}
\`\`\`
Hope this helps!
`;
const fencedResult = parseHandoffText(markdownWrappedJson);
assert(fencedResult.success, 'Parser successfully extracts balanced JSON from markdown fences');
assert(fencedResult.data?.direction?.primaryTitle === 'Data Scientist', 'Parser correctly identifies primary direction from fenced JSON');
assert(fencedResult.data?.milestones?.length === 1, 'Parser extracts milestone from fenced JSON');

// 6. Centralized Progress Calculation System Validation (Phase 3 & Phase 13)
console.log('\n--- 6. Testing Centralized Progress Calculations ---');
import { calculateDashboardProgress } from './src/utils/progressCalculator';

// Case 1: Zero goals and Zero habits (Empty state)
const emptySummary = calculateDashboardProgress([], [], []);
assert(emptySummary.hasData === false, 'Zero goals & habits yields hasData = false');
assert(emptySummary.overallProgress === 0, 'Zero goals & habits yields overallProgress = 0%');
assert(emptySummary.calculationBasis === 'none', 'Calculation basis is none when empty');

// Case 2: Only Goals (2 of 4 completed = 50%)
const sampleMilestones: any[] = [
  { id: 'm1', title: 'Goal 1', completed: true, status: 'completed' },
  { id: 'm2', title: 'Goal 2', completed: false, status: 'in_progress' },
];
const sampleTasks: any[] = [
  { id: 't1', title: 'Task 1', category: 'Technical', completed: true },
  { id: 't2', title: 'Task 2', category: 'Technical', completed: true },
  { id: 't3', title: 'Task 3', category: 'Technical', completed: false },
  { id: 't4', title: 'Task 4', category: 'Technical', completed: false },
];
const goalsOnlySummary = calculateDashboardProgress(sampleMilestones, sampleTasks, []);
assert(goalsOnlySummary.hasData === true, 'Goals only yields hasData = true');
assert(goalsOnlySummary.goalCompletionRate === 50, 'Goal completion rate is exactly 50% (2/4)');
assert(goalsOnlySummary.overallProgress === 50, 'Overall progress equals goal rate when habits absent');
assert(goalsOnlySummary.calculationBasis === 'goals_only', 'Calculation basis correctly identified as goals_only');

// Case 3: Both Goals and Habits composite
const todayStr = new Date().toISOString().split('T')[0];
const sampleHabits: any[] = [
  {
    id: 'h1',
    title: 'Daily Practice',
    schedule: 'everyday',
    currentStreak: 5,
    completedToday: true,
    history: { [todayStr]: true },
  },
];
const bothSummary = calculateDashboardProgress(sampleMilestones, sampleTasks, sampleHabits);
assert(bothSummary.hasData === true, 'Composite yields hasData = true');
assert(bothSummary.calculationBasis === 'both', 'Calculation basis correctly identified as both');
assert(bothSummary.overallProgress === Math.round((bothSummary.goalCompletionRate + bothSummary.habitCompletionRate) / 2), 'Overall progress strictly equals (Goal Rate + Habit Rate) / 2');

// 7. Local-First Storage Architecture & Backup Engine Validation (Phase 1 to 5)
console.log('\n--- 7. Testing Local-First Storage Architecture & Sovereign Backup Engine ---');
// Mock localStorage in Node.js test environment
const storeMap = new Map<string, string>();
const mockLocalStorage = {
  getItem: (key: string) => storeMap.get(key) || null,
  setItem: (key: string, val: string) => { storeMap.set(key, String(val)); },
  removeItem: (key: string) => { storeMap.delete(key); },
  clear: () => { storeMap.clear(); },
};
(globalThis as any).window = globalThis;
(globalThis as any).localStorage = mockLocalStorage;

import { localStorageService, CURRENT_SCHEMA_VERSION, STORAGE_KEY } from './src/services/localStorageService';

// 7a. Initial clean load
localStorageService.clearAllData();
const initialStore = localStorageService.load();
assert(initialStore.schema_version === CURRENT_SCHEMA_VERSION, `Store schema version matches CURRENT_SCHEMA_VERSION (${CURRENT_SCHEMA_VERSION})`);
assert(initialStore.preferences.theme === 'green', 'Default theme is green');
assert(Array.isArray(initialStore.assessments) && initialStore.assessments.length === 0, 'Initial assessments is empty array');

// 7b. Legacy data migration
storeMap.clear();
storeMap.set('foyc_profile', JSON.stringify({ preferredName: 'Maya Legacy', country: 'Canada' }));
storeMap.set('foyc_theme', 'ocean');
// Reset internal cache to force re-reading from localStorage
localStorageService.clearAllData();
storeMap.delete(STORAGE_KEY); // Remove primary key so migration triggers
storeMap.set('foyc_profile', JSON.stringify({ preferredName: 'Maya Legacy', country: 'Canada' }));
storeMap.set('foyc_theme', 'ocean');
const migratedStore = localStorageService.load();
assert(migratedStore.profile.preferredName === 'Maya Legacy', `Legacy migration restored profile name: "${migratedStore.profile.preferredName}"`);
assert(migratedStore.preferences.theme === 'ocean', `Legacy migration restored theme: "${migratedStore.preferences.theme}"`);

// 7c. Granular profile updates
localStorageService.updateProfile({ preferredName: 'Alex Sovereign', careerStage: 'transitioning' });
const updatedStore = localStorageService.load();
assert(updatedStore.profile.preferredName === 'Alex Sovereign', 'updateProfile correctly persists new preferred name');
assert(updatedStore.profile.careerStage === 'transitioning', 'updateProfile correctly persists career stage');

// 7d. Granular dashboard updates
localStorageService.updateDashboard({
  direction: { primaryTitle: 'Lead Product Architect' } as any
}, undefined, true);
const dashboardStore = localStorageService.load();
assert(dashboardStore.dashboard.data.direction.primaryTitle === 'Lead Product Architect', 'updateDashboard correctly persists direction title');
assert(dashboardStore.dashboard.hasGenerated === true, 'updateDashboard correctly persists hasGenerated flag');

// 7e. Backup validation
const invalidJsonResult = localStorageService.validateBackup('{ invalid json syntax');
assert(!invalidJsonResult.valid && typeof invalidJsonResult.error === 'string', 'validateBackup correctly rejects malformed JSON');

const missingVersionResult = localStorageService.validateBackup(JSON.stringify({ someData: 123 }));
assert(!missingVersionResult.valid && missingVersionResult.error?.includes('schema_version'), 'validateBackup correctly rejects payload missing schema_version');

const validBackupPayload = JSON.stringify({
  schema_version: 1,
  profile: { preferredName: 'Imported User' },
  dashboard: { configuration: {}, data: { direction: { primaryTitle: 'Imported Title' } } }
});
const validResult = localStorageService.validateBackup(validBackupPayload);
assert(validResult.valid && !!validResult.data, 'validateBackup accepts valid schema payload');

// 7f. Export and Import (Replace mode)
const exportedJson = localStorageService.exportBackup();
assert(typeof exportedJson === 'string' && exportedJson.includes('Alex Sovereign'), 'exportBackup produces string containing current user data');

const replaceImportSuccess = localStorageService.importBackup(validResult.data!, 'replace');
assert(replaceImportSuccess === true, 'importBackup in replace mode succeeds');
const postReplaceStore = localStorageService.load();
assert(postReplaceStore.profile.preferredName === 'Imported User', 'importBackup replace mode overwrote profile with backup data');

// 7g. Import (Merge mode)
const mergeBackupPayload = {
  schema_version: 1,
  profile: { currentField: 'Design Systems' } as any,
  reflection: {} as any,
  preferences: { theme: 'sunset' as any },
  assessments: [],
  reports: [],
  dashboard: {
    configuration: {} as any,
    data: { direction: { primaryTitle: 'Merged Direction' } } as any,
    hasGenerated: true
  },
  activity: [],
  last_updated: new Date().toISOString()
};
const mergeImportSuccess = localStorageService.importBackup(mergeBackupPayload, 'merge');
assert(mergeImportSuccess === true, 'importBackup in merge mode succeeds');
const postMergeStore = localStorageService.load();
assert(postMergeStore.profile.preferredName === 'Imported User', 'Merge mode preserved existing profile preferredName');
assert(postMergeStore.profile.currentField === 'Design Systems', 'Merge mode applied incoming profile field');
assert(postMergeStore.preferences.theme === 'sunset', 'Merge mode applied incoming preference');

// 7h. Clear All Data (Reset)
localStorageService.clearAllData();
assert(mockLocalStorage.getItem(STORAGE_KEY) === null, 'clearAllData removed main STORAGE_KEY from localStorage');
const freshStore = localStorageService.load();
assert(freshStore.profile.preferredName === '', 'clearAllData reset profile preferredName to empty default');

console.log('\n======================================================');
console.log(`TEST SUMMARY: Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);
console.log('======================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
