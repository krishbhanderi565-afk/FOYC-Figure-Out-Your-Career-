import { createApp } from './app.js';
import { ENV } from './config/env.js';

const app = createApp();

app.listen(ENV.PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 FOYC Express Backend active on port ${ENV.PORT}`);
  console.log(`   Target Supabase Project: ${ENV.PROJECT_ID}`);
  console.log(`   Environment: ${ENV.NODE_ENV}`);
  console.log(`   Health Check: http://127.0.0.1:${ENV.PORT}/api/health`);
  console.log(`=================================================`);
});
