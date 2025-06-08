const { spawn } = require('child_process');
const axios = require('axios');

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function checkBackend() {
  try {
    console.log('🔍 Checking backend status...');
    const response = await axios.get(`${API_BASE_URL}/`, { timeout: 5000 });
    console.log('✅ Backend is running!');
    return true;
  } catch (error) {
    console.log('❌ Backend is not running');
    console.log('💡 Please start the backend server first:');
    console.log('   cd back-end');
    console.log('   python main.py');
    return false;
  }
}

async function startFrontend() {
  console.log('🚀 Starting frontend development server...');
  
  const child = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });

  child.on('close', (code) => {
    console.log(`Frontend server exited with code ${code}`);
  });
}

async function main() {
  console.log('🎯 Tokopedia Trends - Quick Start');
  console.log('================================\n');

  const backendRunning = await checkBackend();
  
  if (backendRunning) {
    await startFrontend();
  } else {
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Quick start error:', error);
  process.exit(1);
});