const prisma = require('./config/prisma');

async function check() {
    try {
        const product = await prisma.product.findUnique({
            where: { id: '1c4260e7-9a0a-46ac-80d8-ec82ce361488' },
            include: { vendor: { select: { name: true } } }
        });
        console.log('Product Query Result:', product ? 'Found' : 'Not Found');

        const users = await prisma.user.findMany({
            select: { email: true, role: true }
        });
        console.log('Available Users:', users);
    } catch (err) {
        console.error('Prisma Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}
check();
