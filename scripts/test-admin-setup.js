const https = require('https');
const http = require('http');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testAdminSetup() {
  console.log('Testing admin setup...');
  
  // Get the base URL from environment variables
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const setupEndpoint = `${baseUrl}/api/admin/setup`;
  
  console.log('Setup endpoint:', setupEndpoint);
  
  // Parse the URL to determine which HTTP module to use
  const url = new URL(setupEndpoint);
 const isHttps = url.protocol === 'https:';
  const client = isHttps ? https : http;
  
  const options = {
    hostname: url.hostname,
    port: url.port || (isHttps ? 443 : 80),
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  // Make the request
  const req = client.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`Status Code: ${res.statusCode}`);
      console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
      
      try {
        const response = JSON.parse(data);
        console.log('Response:', JSON.stringify(response, null, 2));
        
        if (response.message && response.message.includes('created')) {
          console.log('✅ Admin setup successful!');
        } else if (response.message && response.message.includes('already exists')) {
          console.log('ℹ️ Admin already exists');
        } else if (response.error) {
          console.log('❌ Admin setup failed:', response.error);
        }
      } catch (error) {
        console.log('Response (raw):', data);
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('❌ Request error:', error);
  });
  
  req.end();
}

testAdminSetup();