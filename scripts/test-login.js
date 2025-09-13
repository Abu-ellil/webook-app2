const https = require('https');
const http = require('http');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testLogin() {
  console.log('Testing admin login...');
  
  // Default credentials from documentation
  const credentials = {
    username: 'admin',
    password: 'admin123'
  };
  
  console.log('Using credentials:', credentials);
  
  // Get the base URL from environment variables
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const loginEndpoint = `${baseUrl}/api/admin/login`;
  
  console.log('Login endpoint:', loginEndpoint);
  
  // Prepare the request data
  const postData = JSON.stringify(credentials);
  
  // Parse the URL to determine which HTTP module to use
  const url = new URL(loginEndpoint);
  const isHttps = url.protocol === 'https:';
  const client = isHttps ? https : http;
  
  const options = {
    hostname: url.hostname,
    port: url.port || (isHttps ? 443 : 80),
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
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
        
        if (response.token) {
          console.log('✅ Login successful! JWT token received.');
        } else if (response.error) {
          console.log('❌ Login failed:', response.error);
        }
      } catch (error) {
        console.log('Response (raw):', data);
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('❌ Request error:', error);
  });
  
  // Write the request data
  req.write(postData);
  req.end();
}

testLogin();