#!/usr/bin/env node

/**
 * Setup Environment Variables Helper
 * 
 * This script helps you create the .env.local file
 * Run with: node setup-env.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n========================================');
console.log('🚀 Catalix Environment Setup');
console.log('========================================\n');

console.log('This will create your .env.local file.\n');
console.log('You can skip any field by pressing Enter.\n');

const questions = [
  {
    key: 'VITE_SUPABASE_URL',
    prompt: '📦 Enter your Supabase Project URL\n   (e.g., https://xxxxx.supabase.co)\n   > ',
    default: ''
  },
  {
    key: 'VITE_SUPABASE_ANON_KEY',
    prompt: '\n🔑 Enter your Supabase Anon Key\n   (starts with eyJ...)\n   > ',
    default: ''
  }
];

const answers = {
  VITE_RAZORPAY_KEY_ID: 'rzp_test_ROysXhPNhStyyy'
};

let currentQuestion = 0;

function askQuestion() {
  if (currentQuestion >= questions.length) {
    createEnvFile();
    return;
  }

  const question = questions[currentQuestion];
  rl.question(question.prompt, (answer) => {
    answers[question.key] = answer.trim() || question.default;
    currentQuestion++;
    askQuestion();
  });
}

function createEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  let content = `# ========================================
# Catalix E-commerce - Environment Variables
# Auto-generated on ${new Date().toLocaleString()}
# ========================================

# Supabase Configuration
VITE_SUPABASE_URL=${answers.VITE_SUPABASE_URL || 'https://your-project.supabase.co'}
VITE_SUPABASE_ANON_KEY=${answers.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here'}

# Razorpay Configuration (Test Mode)
VITE_RAZORPAY_KEY_ID=${answers.VITE_RAZORPAY_KEY_ID}

# Google OAuth Client ID: 176363690527-5u61mmur3v6jdht688mghdegtu6ouqjl.apps.googleusercontent.com
# Configure in Supabase Dashboard -> Authentication -> Providers -> Google

# SMS Service (Optional)
# VITE_SMS_API_KEY=your-sms-api-key
# VITE_SMS_PROVIDER=fast2sms
`;

  try {
    if (fs.existsSync(envPath)) {
      console.log('\n⚠️  .env.local already exists!');
      rl.question('Overwrite? (y/N): ', (answer) => {
        if (answer.toLowerCase() === 'y') {
          fs.writeFileSync(envPath, content);
          showSuccess();
        } else {
          console.log('\n❌ Cancelled. Existing file not modified.\n');
        }
        rl.close();
      });
    } else {
      fs.writeFileSync(envPath, content);
      showSuccess();
      rl.close();
    }
  } catch (error) {
    console.error('\n❌ Error creating .env.local:', error.message);
    rl.close();
  }
}

function showSuccess() {
  console.log('\n========================================');
  console.log('✅ .env.local created successfully!');
  console.log('========================================\n');
  
  if (!answers.VITE_SUPABASE_URL || answers.VITE_SUPABASE_URL === '') {
    console.log('⚠️  You still need to add your Supabase credentials:');
    console.log('   1. Create Supabase project at https://supabase.com');
    console.log('   2. Get credentials from Settings → API');
    console.log('   3. Edit .env.local with your values\n');
  }
  
  console.log('📝 Next steps:');
  console.log('   1. Restart your development server:');
  console.log('      Press Ctrl+C to stop');
  console.log('      Run: npm run dev');
  console.log('   2. Check console for Supabase status');
  console.log('   3. Test your application!\n');
  
  console.log('📖 Documentation:');
  console.log('   - See YOUR_GOOGLE_OAUTH_STEPS.txt');
  console.log('   - See QUICK_GOOGLE_OAUTH_SETUP.md');
  console.log('   - See env.local.template\n');
}

console.log('Press Ctrl+C to cancel at any time.\n');
askQuestion();

