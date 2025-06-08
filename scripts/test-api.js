/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

const endpoints = [
  { name: 'Health Check', url: '/' },
  { name: 'Get All Products', url: '/getAllProduct' },
  { name: 'Get All Categories', url: '/getAllCategory' },
  { name: 'Get All Reviews', url: '/getAllReview' },
  { name: 'Search Products by Name', url: '/getAllProductsByName?name=jam' }, // ✅ Sudah benar
  {
    name: 'Get Products by Category',
    url: '/getAllProductByCategory?category=1',
  },
  { name: 'Get Reviews by Product', url: '/getAllReviewByProduct?product=1' },
  {
    name: 'Get Reviews by Category',
    url: '/getAllReviewByCategory?category=1',
  },
  { name: 'Get Sentiment by Product', url: '/getSentimentByProduct?product=1' },
];

async function testEndpoint(endpoint) {
  try {
    console.log(`🧪 Testing: ${endpoint.name}`);
    const startTime = Date.now();

    const response = await axios.get(`${API_BASE_URL}${endpoint.url}`, {
      timeout: 10000,
    });

    const duration = Date.now() - startTime;
    console.log(`✅ ${endpoint.name} - ${response.status} (${duration}ms)`);

    if (response.data && typeof response.data === 'object') {
      if (response.data.error !== undefined) {
        console.log(`   Error: ${response.data.error}`);
        console.log(`   Message: ${response.data.message}`);
        if (response.data.data && Array.isArray(response.data.data)) {
          console.log(`   Data Count: ${response.data.data.length}`);
        }
      }
    }

    return { success: true, status: response.status, duration };
  } catch (error) {
    console.log(`❌ ${endpoint.name} - ${error.message}`);

    // Enhanced error reporting
    if (error.code === 'ECONNREFUSED') {
      console.log(
        '   💡 Backend server tidak berjalan atau tidak dapat diakses'
      );
      console.log(`   💡 Pastikan server berjalan di: ${API_BASE_URL}`);
    } else if (error.code === 'ETIMEDOUT') {
      console.log('   💡 Request timeout - server mungkin lambat merespons');
    } else if (error.response) {
      console.log(
        `   💡 HTTP Error: ${error.response.status} - ${error.response.statusText}`
      );
    }

    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  console.log(`Base URL: ${API_BASE_URL}\n`);

  // Check if API_BASE_URL is properly set
  if (!API_BASE_URL || API_BASE_URL === 'undefined') {
    console.error('❌ API_BASE_URL tidak terdefinisi!');
    console.error(
      '💡 Pastikan file .env.local ada dan berisi NEXT_PUBLIC_API_URL'
    );
    process.exit(1);
  }

  const results = [];

  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push({ ...endpoint, ...result });
    console.log(''); // Empty line for readability
  }

  // Summary
  console.log('📊 Test Summary:');
  console.log('================');

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(`✅ Successful: ${successful}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);

  if (failed > 0) {
    console.log('\n🚨 Failed endpoints:');
    results
      .filter((r) => !r.success)
      .forEach((r) => console.log(`   - ${r.name}: ${r.error}`));

    console.log('\n💡 Troubleshooting Tips:');
    console.log('1. Pastikan backend server berjalan di port 5000');
    console.log(
      '2. Verifikasi .env.local berisi NEXT_PUBLIC_API_URL=http://127.0.0.1:5000'
    );
    console.log('3. Cek apakah backend API endpoint tersedia');
    console.log('4. Jalankan health check: npm run health-check');
  }

  console.log('\n🏁 Tests completed!');
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((error) => {
  console.error('💥 Test runner error:', error);
  process.exit(1);
});
