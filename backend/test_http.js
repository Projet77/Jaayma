const http = require('http');

http.get('http://localhost:5000/api/products/1c4260e7-9a0a-46ac-80d8-ec82ce361488', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log(`Status: ${res.statusCode} | Body: ${data}`));
}).on('error', err => console.error('Fetch error:', err.message));
