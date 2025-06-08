require('dotenv').config({ path: '.env.local' });
const { spawn } = require('child_process');
const axios = require('axios');

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

async function checkBackend() {
  try {
    console.log('🔍 Checking backend status...');
    console.log(`URL: ${API_BASE_URL}`);

    const response = await axios.get(`${API_BASE_URL}/`, { timeout: 5000 });
    console.log('✅ Backend is running!');
    console.log(`Status: ${response.status}`);
    return true;
  } catch (error) {
    console.log('❌ Backend is not running');
    console.log(`Error: ${error.message}`);
    console.log('\n💡 Please start the backend server first:');
    console.log('   cd back-end');
    console.log('   python main.py');
    console.log(`\n💡 Current API URL: ${API_BASE_URL}`);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Make sure the backend server is running on port 5000');
      console.log(
        '2. Check if .env.local contains NEXT_PUBLIC_API_URL=http://127.0.0.1:5000'
      );
      console.log('3. Verify the backend is accessible at the URL above');
    }

    return false;
  }
}

async function startFrontend() {
  console.log('🚀 Starting frontend development server...');

  const child = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
  });

  child.on('close', (code) => {
    console.log(`Frontend server exited with code ${code}`);
  });

  child.on('error', (error) => {
    console.error('Error starting frontend server:', error);
  });
}

async function main() {
  console.log('🎯 Tokopedia Trends - Quick Start');
  console.log('================================\n');

  // Check if API_BASE_URL is properly configured
  if (!API_BASE_URL || API_BASE_URL === 'undefined') {
    console.error('❌ API_BASE_URL tidak terdefinisi!');
    console.error('💡 Pastikan file .env.local ada dan berisi:');
    console.error('   NEXT_PUBLIC_API_URL=http://127.0.0.1:5000');
    process.exit(1);
  }

  const backendRunning = await checkBackend();

  if (backendRunning) {
    console.log('\n✅ Backend verification successful!');
    console.log('📱 Starting frontend development server...\n');
    await startFrontend();
  } else {
    console.log('\n❌ Backend verification failed!');
    console.log('🛑 Cannot start frontend without backend connection.');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('💥 Quick start error:', error);
  process.exit(1);
});
