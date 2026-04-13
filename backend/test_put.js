const http = require('http');

const data = JSON.stringify({
    name: "Télévision Smart TV Samsung Crystal UHD 55\"",
    price: 350000,
    originalPrice: 420000,
    stock: 10,
    inStock: true,
    rating: 4.7,
    reviews: 85
});

const req = http.request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/products/1c4260e7-9a0a-46ac-80d8-ec82ce361488',
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        // we need admin auth token here! Oh wait, I don't have a token.
    }
}, (res) => {
    let resData = '';
    res.on('data', chunk => resData += chunk);
    res.on('end', () => console.log(`Status: ${res.statusCode} | Body: ${resData}`));
});

req.on('error', err => console.error('Fetch error:', err.message));
req.write(data);
req.end();
