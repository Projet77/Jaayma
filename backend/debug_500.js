const prisma = require('./config/prisma');

async function testUpdate() {
    try {
        const product = await prisma.product.findFirst();
        if (!product) {
            console.log('No product found');
            return;
        }

        console.log('Product to update:', product.id);

        // Simulate update logic with potentially problematic values
        const dataToUpdate = {
            name: product.name,
            brand: product.brand,
            price: parseFloat(product.price),
            originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
            category: product.category,
            description: product.description,
            image: product.image,
            images: product.images,
            inStock: product.inStock === 'true' || product.inStock === true,
            stock: parseInt(product.stock, 10),
            reviews: parseInt(product.reviews, 10),
            rating: parseFloat(product.rating)
        };

        console.log('Data to update:', dataToUpdate);

        const updatedProduct = await prisma.product.update({
            where: { id: product.id },
            data: dataToUpdate
        });

        console.log('Update successful!');
    } catch (err) {
        console.error('PRISMA ERROR:', err);
    } finally {
        await prisma.$disconnect();
    }
}

testUpdate();
