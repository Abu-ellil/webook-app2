const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testEventsAPI() {
  console.log('Testing events API...');
  
  try {
    const response = await fetch('http://localhost:3000/api/events');
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Events count:', data.length);
      if (data.length > 0) {
        console.log('First event:', JSON.stringify(data[0], null, 2));
      }
    } else {
      console.error('Failed to fetch events:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error testing events API:', error);
  }
}

testEventsAPI();