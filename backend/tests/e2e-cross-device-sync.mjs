import http from 'http';

const BASE_URL = 'http://127.0.0.1:5000/api';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const fullUrl = new URL(`http://127.0.0.1:5000/api${path.startsWith('/') ? path : '/' + path}`);
    const reqOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = http.request(fullUrl, reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTest() {
  console.log('================================================================');
  console.log('🚀 FOYC FULL DATABASE & CROSS-DEVICE SYNCHRONIZATION E2E TEST');
  console.log('   Target Supabase Project: rlrzdvebvbtegxixyfrb');
  console.log('================================================================\n');

  // Device A Session Setup
  const deviceAUserToken = `demo-user-${Date.now()}`;
  const deviceAHeaders = { Authorization: `Bearer ${deviceAUserToken}` };

  console.log('--- PHASE 1: DEVICE A (LAPTOP) ---');

  // 1. Health & Project Pinning
  const health = await request('/health');
  console.log('1. Health check status:', health.status, '| Target Project:', health.data.targetProjectId);
  if (health.data.targetProjectId !== 'rlrzdvebvbtegxixyfrb') {
    throw new Error('Project ID mismatch! Must be rlrzdvebvbtegxixyfrb');
  }

  // 2. Fetch / Create Initial Profile
  const profileInit = await request('/profile', { headers: deviceAHeaders });
  console.log('2. Device A initial profile:', profileInit.data.profile.fullName, '| email:', profileInit.data.profile.email);

  // 3. Update Profile on Device A
  const profileUpdate = await request('/profile', {
    method: 'PUT',
    headers: deviceAHeaders,
    body: {
      fullName: 'Aarav Patel',
      country: 'India',
      education: 'B.Tech in Computer Science',
      profession: 'Full-Stack Software Engineer',
      careerStage: 'pivoting',
      profileSummary: 'Building scalable distributed systems and mastering TypeScript + PostgreSQL.',
    },
  });
  console.log('3. Device A updated profile:', profileUpdate.data.profile.fullName, '| stage:', profileUpdate.data.profile.careerStage);

  // 4. Create and Save Personalized Career Plan
  const mockPlan = {
    direction: {
      primaryTitle: 'Full-Stack Software Engineer (AI Systems)',
      summary: 'Focus on distributed backends, TypeScript interfaces, and resilient data pipelines.',
      matchConfidence: 'High (97%)',
      timeHorizon: '6 Months',
    },
    milestones: [
      { id: 'm-1', title: 'Deploy Full-Stack CRUD with PostgreSQL', stage: 'Foundation', targetDate: 'Month 1', completed: false },
      { id: 'm-2', title: 'Build Microservice Message Broker with Redis', stage: 'Skill Development', targetDate: 'Month 2', completed: false },
    ],
    tasks: [
      { id: 't-1', title: 'Review Database Indexing strategies', category: 'Technical', dueDate: 'Friday', completed: false },
      { id: 't-2', title: 'Setup GitHub Actions CI/CD Pipeline', category: 'Portfolio', dueDate: 'Sunday', completed: false },
    ],
    habits: [
      { id: 'h-1', title: '45 mins focused deep work coding', frequency: 'daily', schedule: 'everyday', currentStreak: 3, bestStreak: 5 },
      { id: 'h-2', title: 'Review 1 system architecture RFC', frequency: 'daily', schedule: 'everyday', currentStreak: 2, bestStreak: 4 },
      { id: 'h-3', title: 'Weekly architectural retrospective', frequency: 'weekly', schedule: 'weekend', currentStreak: 1, bestStreak: 2 },
    ],
    projects: [
      { id: 'p-1', title: 'FOYC Career Intelligence Platform', description: 'Real-time career roadmap tracking with Supabase.', status: 'in-progress' },
    ],
  };

  const planTransfer = await request('/dashboard/transfer', {
    method: 'POST',
    headers: deviceAHeaders,
    body: { approvedPlanDraft: mockPlan },
  });
  console.log('4. Device A transferred plan to account:', planTransfer.data.success, '| message:', planTransfer.data.message);

  // 5. Add 3 Habits on Device A
  const h1 = await request('/habits', {
    method: 'POST',
    headers: deviceAHeaders,
    body: { title: '45 mins focused coding', frequency: 'daily', schedule: 'everyday', targetDaysPerWeek: 7 },
  });
  const h2 = await request('/habits', {
    method: 'POST',
    headers: deviceAHeaders,
    body: { title: 'Review 1 system architecture RFC', frequency: 'daily', schedule: 'everyday', targetDaysPerWeek: 6 },
  });
  const h3 = await request('/habits', {
    method: 'POST',
    headers: deviceAHeaders,
    body: { title: 'Weekly system design retrospective', frequency: 'weekly', schedule: 'weekend', targetDaysPerWeek: 2 },
  });
  console.log('5. Device A created 3 habits:', h1.data.habit.title, ',', h2.data.habit.title, ',', h3.data.habit.title);

  // 6. Complete One Habit on Device A
  const toggleH1 = await request(`/habits/${h1.data.habit.id}/toggle`, {
    method: 'POST',
    headers: deviceAHeaders,
    body: { date: '2026-11-13' },
  });
  console.log('6. Device A completed habit h1:', toggleH1.data.completed, '| Streak:', toggleH1.data.currentStreak);

  // 7. Complete a Task on Device A
  const taskCreated = await request('/tasks', {
    method: 'POST',
    headers: deviceAHeaders,
    body: { title: 'Write integration test for auth middleware', category: 'Technical', dueDate: 'Today' },
  });
  const taskToggled = await request(`/tasks/${taskCreated.data.task.id}`, {
    method: 'PUT',
    headers: deviceAHeaders,
    body: { completed: true },
  });
  console.log('7. Device A created and completed task:', taskToggled.data.task.title, '| completed:', taskToggled.data.task.completed);

  // 8. Update Milestone on Device A
  const mToggle = await request('/milestones/m-1/toggle', {
    method: 'POST',
    headers: deviceAHeaders,
  });
  console.log('8. Device A toggled milestone m-1:', mToggle.data.completed);

  console.log('\n--- PHASE 2: DEVICE B (MOBILE / FRESH SESSION) ---');
  // Device B uses the EXACT same user token (simulating login with same account credentials)
  const deviceBHeaders = { Authorization: `Bearer ${deviceAUserToken}` };

  // 1. Fetch Profile on Device B
  const deviceBProfile = await request('/profile', { headers: deviceBHeaders });
  console.log('1. Device B retrieved profile:', deviceBProfile.data.profile.fullName, '| Country:', deviceBProfile.data.profile.country);
  if (deviceBProfile.data.profile.fullName !== 'Aarav Patel') {
    throw new Error('Device B profile mismatch! Expected Aarav Patel, got: ' + deviceBProfile.data.profile.fullName);
  }

  // 2. Fetch Dashboard & Habits on Device B
  const deviceBHabits = await request('/habits', { headers: deviceBHeaders });
  console.log('2. Device B retrieved habit count:', deviceBHabits.data.habits.length);
  const deviceBH1 = deviceBHabits.data.habits.find((h) => h.id === h1.data.habit.id);
  console.log('   Device B habit h1 completedToday:', deviceBH1?.completedToday, '| streak:', deviceBH1?.currentStreak);
  if (!deviceBH1?.completedToday) {
    throw new Error('Device B did not reflect completed habit from Device A!');
  }

  // 3. Fetch Tasks on Device B
  const deviceBTasks = await request('/tasks', { headers: deviceBHeaders });
  const completedTask = deviceBTasks.data.tasks.find((t) => t.id === taskCreated.data.task.id);
  console.log('3. Device B task verified:', completedTask?.title, '| completed:', completedTask?.completed);
  if (!completedTask?.completed) {
    throw new Error('Device B did not reflect completed task from Device A!');
  }

  // 4. Device B Completes Habit h2
  const toggleH2 = await request(`/habits/${h2.data.habit.id}/toggle`, {
    method: 'POST',
    headers: deviceBHeaders,
    body: { date: '2026-11-13' },
  });
  console.log('4. Device B completed habit h2:', toggleH2.data.completed, '| Streak:', toggleH2.data.currentStreak);

  console.log('\n--- PHASE 3: DEVICE A (LAPTOP RE-LOGIN / RE-FETCH) ---');
  // Device A re-fetches habits
  const deviceAHabitsRefetch = await request('/habits', { headers: deviceAHeaders });
  const refetchedH2 = deviceAHabitsRefetch.data.habits.find((h) => h.id === h2.data.habit.id);
  console.log('1. Device A re-fetched habit h2 completedToday:', refetchedH2?.completedToday, '| streak:', refetchedH2?.currentStreak);
  if (!refetchedH2?.completedToday) {
    throw new Error('Device A did not reflect habit completed on Device B!');
  }
  console.log('   SUCCESS: Both habits h1 and h2 are completed across both devices seamlessly!');

  console.log('\n--- PHASE 4: SECURITY & RLS ENFORCEMENT ---');
  // 1. Attempt unauthenticated access
  const unauthTasks = await request('/tasks');
  console.log('1. Unauthenticated request blocked status:', unauthTasks.status, '| error:', unauthTasks.data?.error);
  if (unauthTasks.status !== 401) {
    throw new Error('Security flaw: Unauthenticated request was not blocked with 401!');
  }

  // 2. Attempt unauthorized access with another user token
  const hackerToken = 'demo-user-hacker-999';
  const hackerHabits = await request('/habits', { headers: { Authorization: `Bearer ${hackerToken}` } });
  console.log('2. Distinct user habits count:', hackerHabits.data.habits.length);
  if (hackerHabits.data.habits.length !== 0) {
    throw new Error('Security flaw: User was able to view another users habits!');
  }

  console.log('\n================================================================');
  console.log('✅ ALL TESTS PASSED: FOYC CLOUD PERSISTENCE & SYNC FULLY VERIFIED');
  console.log('================================================================');
}

runTest().catch((err) => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
