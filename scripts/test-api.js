const axios = require('axios');

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const endpoints = [
  { name: 'Health Check', url: '/' },
  { name: 'Get All Products', url: '/getAllProduct' },
  { name: 'Get All Categories', url: '/getAllCategory' },
  { name: 'Get All Reviews', url: '/getAllReview' },
  { name: 'Search Products', url: '/searchProduct?query=jam' },
  { name: 'Get Products by Category', url: '/getAllProductByCategory?category=1' },
  { name: 'Get Reviews by Product', url: '/getAllReviewByProduct?product=1' },
  { name: 'Get Sentiment by Product', url: '/getSentimentByProduct?product=1' }
];

async function testEndpoint(endpoint) {
  try {
    console.log(`🧪 Testing: ${endpoint.name}`);
    const startTime = Date.now();
    
    const response = await axios.get(`${API_BASE_URL}${endpoint.url}`, {
      timeout: 10000
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
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  console.log(`Base URL: ${API_BASE_URL}\n`);
  
  const results = [];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push({ ...endpoint, ...result });
    console.log(''); // Empty line for readability
  }
  
  // Summary
  console.log('📊 Test Summary:');
  console.log('================');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successful: ${successful}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);
  
  if (failed > 0) {
    console.log('\n🚨 Failed endpoints:');
    results
      .filter(r => !r.success)
      .forEach(r => console.log(`   - ${r.name}: ${r.error}`));
  }
  
  console.log('\n🏁 Tests completed!');
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(error => {
  console.error('💥 Test runner error:', error);
  process.exit(1);
});