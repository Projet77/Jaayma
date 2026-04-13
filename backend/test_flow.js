const http = require('http');

const loginData = JSON.stringify({ email: "admin@jaayma.com", password: "password123" });

const loginReq = http.request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
    }
}, (loginRes) => {
    let loginBody = '';
    loginRes.on('data', chunk => loginBody += chunk);
    loginRes.on('end', () => {
        console.log("LOGIN Status:", loginRes.statusCode);
        if (loginRes.statusCode !== 200) {
            console.log("LOGIN Body:", loginBody);
            return;
        }
        const token = JSON.parse(loginBody).token;

        // Test Stats
        http.get({
            hostname: 'localhost',
            port: 5000,
            path: '/api/admin/stats',
            headers: { 'Authorization': `Bearer ${token}` }
        }, res => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => console.log('STATS:', res.statusCode, data.substring(0, 50)));
        });

        // Test Users
        http.get({
            hostname: 'localhost',
            port: 5000,
            path: '/api/admin/users',
            headers: { 'Authorization': `Bearer ${token}` }
        }, res => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => console.log('USERS:', res.statusCode, data.substring(0, 50)));
        });
    });
});

loginReq.write(loginData);
loginReq.end();
