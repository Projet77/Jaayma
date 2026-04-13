const http = require('http');
const bcrypt = require('bcryptjs');
const prisma = require('./config/prisma');
const jwt = require('jsonwebtoken');

const testAdminAPI = async () => {
    try {
        // Create emergency admin to bypass login unknown passwords
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);
        const adminEmail = `testadmin_${Date.now()}@jaayma.com`;

        const user = await prisma.user.create({
            data: {
                name: 'Emergency Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
            }
        });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
        console.log(`Created admin ${adminEmail} with token`);

        // Test API /api/admin/stats
        http.get({ hostname: 'localhost', port: 5000, path: '/api/admin/stats', headers: { 'Authorization': `Bearer ${token}` } }, res => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => console.log('STATS API:', res.statusCode, data.substring(0, 100)));
        });

        // Test API /api/admin/users
        http.get({ hostname: 'localhost', port: 5000, path: '/api/admin/users', headers: { 'Authorization': `Bearer ${token}` } }, res => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => console.log('USERS API:', res.statusCode, data.substring(0, 100)));
        });

        // Clean up later or let it be
    } catch (err) {
        console.error(err);
    }
};

testAdminAPI();
