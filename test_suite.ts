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

console.log('\n======================================================');
console.log(`TEST SUMMARY: Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);
console.log('======================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
