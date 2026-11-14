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

console.log('\n======================================================');
console.log(`TEST SUMMARY: Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);
console.log('======================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
