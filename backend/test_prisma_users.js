const prisma = require('./config/prisma');

async function testUsersQuery() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
            // Removed createdAt and orderBy
        });
        console.log("SUCCESS:", users);
    } catch (err) {
        console.error("PRISMA ERROR:", err);
    } finally {
        await prisma.$disconnect();
    }
}

testUsersQuery();
