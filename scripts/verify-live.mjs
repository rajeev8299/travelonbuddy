import https from 'node:https';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function verifyDeployment() {
  console.log('Testing Live Website: https://rajeev8299.github.io/travelonbuddy/');
  const page = await fetchUrl('https://rajeev8299.github.io/travelonbuddy/');
  console.log('• HTML Status:', page.status);

  // Extract CSS
  const cssMatch = page.body.match(/href="(\/travelonbuddy\/assets\/[^"]+\.css)"/);
  // Extract JS
  const jsMatch = page.body.match(/src="(\/travelonbuddy\/assets\/[^"]+\.js)"/);

  console.log('• Referenced CSS:', cssMatch ? cssMatch[1] : 'NONE');
  console.log('• Referenced JS:', jsMatch ? jsMatch[1] : 'NONE');

  if (cssMatch) {
    const cssRes = await fetchUrl('https://rajeev8299.github.io' + cssMatch[1]);
    console.log('• CSS Status:', cssRes.status);
    console.log('• CSS Content-Type:', cssRes.headers['content-type']);
    console.log('• CSS Content-Length:', cssRes.headers['content-length'], 'bytes');
  }

  if (jsMatch) {
    const jsRes = await fetchUrl('https://rajeev8299.github.io' + jsMatch[1]);
    console.log('• JS Status:', jsRes.status);
    console.log('• JS Content-Type:', jsRes.headers['content-type']);
    console.log('• JS Content-Length:', jsRes.headers['content-length'], 'bytes');
  }

  // Test 404 fallback on direct nested routes
  const loginRes = await fetchUrl('https://rajeev8299.github.io/travelonbuddy/login');
  console.log('• Direct /login Route Status:', loginRes.status, '(SPA Fallback working?:', loginRes.body.includes('root'), ')');
}

verifyDeployment();
