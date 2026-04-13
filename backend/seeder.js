const dotenv = require('dotenv');
const products = require('./data/products');

dotenv.config();
const prisma = require('./config/prisma');

const importData = async () => {
    try {
        await prisma.product.deleteMany(); // Efface tous les produits actuels

        await prisma.product.createMany({
            data: products
        });

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await prisma.product.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
