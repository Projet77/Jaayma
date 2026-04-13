const products = [
    {
        name: "iPhone 15 Pro Max - 256Go",
        brand: "Apple",
        price: 850000,
        originalPrice: 950000,
        category: "Électronique",
        rating: 4.9,
        reviews: 320,
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80",
        inStock: true,
        description: "Le tout nouvel iPhone 15 Pro Max avec puce A17 Pro et appareil photo 48 Mpx pour des clichés époustouflants."
    },
    {
        name: "Télévision Smart TV Samsung Crystal UHD 55\"",
        brand: "Samsung",
        price: 350000,
        originalPrice: 420000,
        category: "Maison & Électroménager",
        rating: 4.7,
        reviews: 85,
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80",
        inStock: true,
        description: "Profitez d'une qualité d'image exceptionnelle avec la technologie Crystal UHD 4K et un design ultra-fin."
    },
    {
        name: "Baskets Nike Air Force 1 '07",
        brand: "Nike",
        price: 45000,
        category: "Mode & Chaussures",
        rating: 4.8,
        reviews: 512,
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80",
        inStock: true,
        description: "L'incontournable Nike Air Force 1, un style classique et intemporel pour votre quotidien."
    },
    {
        name: "Robe Maxi en Tissu Wax Africain",
        brand: "AfroChic",
        price: 25000,
        originalPrice: 35000,
        category: "Mode & Vêtements",
        rating: 4.6,
        reviews: 45,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80",
        inStock: true,
        description: "Superbe robe élégante confectionnée avec des motifs Wax authentiques et vibrants."
    },
    {
        name: "Parfum Chanel N°5 - Eau de Parfum 100ml",
        brand: "Chanel",
        price: 95000,
        category: "Beauté & Santé",
        rating: 4.9,
        reviews: 1045,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80",
        inStock: true,
        description: "L'essence même de la féminité, ce bouquet floral poudré est un classique absolu."
    },
    {
        name: "Ensemble de 8 Casseroles Tefal Antiadhésives",
        brand: "Tefal",
        price: 65000,
        originalPrice: 80000,
        category: "Maison & Électroménager",
        rating: 4.5,
        reviews: 74,
        image: "https://images.unsplash.com/photo-1588607675583-937229cc3f97?w=500&q=80",
        inStock: true,
        description: "Cuisinez sans matière grasse grâce à ce lot de casseroles et poêles 100% antiadhésives."
    },
    {
        name: "Sac de Riz Parfumé Brisures 50kg",
        brand: "Royal Umbrellas",
        price: 23500,
        category: "Supermarché & Alimentation",
        rating: 4.9,
        reviews: 2000,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=500&q=80",
        inStock: true,
        description: "Le fameux riz parfumé idéal pour accompagner tous vos plats traditionnels (Thiéboudienne, Yassa)."
    },
    {
        name: "Apple Watch Series 9 GPS",
        brand: "Apple",
        price: 280000,
        category: "Électronique",
        rating: 4.8,
        reviews: 156,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        inStock: true,
        description: "Surveillez votre santé avec la nouvelle puce de la Series 9, écran deux fois plus lumineux."
    },
    {
        name: "PC Portable Dell XPS 15",
        brand: "Dell",
        price: 1100000,
        originalPrice: 1250000,
        category: "Ordinateurs",
        rating: 4.7,
        reviews: 98,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80",
        inStock: true,
        description: "Un ordinateur portable premium avec processeur Intel Core i7 13e gén, 16Go RAM et écran OLED."
    },
    {
        name: "Canapé d'Angle Moderne 5 Places",
        brand: "HomeLuxe",
        price: 450000,
        category: "Maison & Meubles",
        rating: 4.4,
        reviews: 32,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80",
        inStock: false,
        description: "Un canapé spacieux et très confortable en velours côtelé pour habiller votre salon."
    },
    {
        name: "Lot de 5 Bidons Huile Végétale (1L)",
        brand: "Niinal",
        price: 8500,
        category: "Supermarché & Alimentation",
        rating: 4.8,
        reviews: 580,
        image: "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=500&q=80",
        inStock: true,
        description: "Huile végétale 100% raffinée pour une cuisson saine et sans odeur."
    },
    {
        name: "Lait de Corps Hydratant Karité",
        brand: "Natura Afrique",
        price: 3500,
        category: "Beauté & Santé",
        rating: 4.6,
        reviews: 215,
        image: "https://images.unsplash.com/photo-1608248593842-8d7d3d231e34?w=500&q=80",
        inStock: true,
        description: "Hydratation profonde de la peau durant 24h grâce au pur beurre de karité bio."
    },
    {
        name: "PlayStation 5 Slim - 1To",
        brand: "Sony",
        price: 380000,
        category: "Électronique",
        rating: 4.9,
        reviews: 420,
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80",
        inStock: true,
        description: "Console nouvelle génération, ultra-rapide et au design épuré."
    },
    {
        name: "Climatiseur Split 1.5 CV",
        brand: "LG",
        price: 245000,
        originalPrice: 280000,
        category: "Maison & Électroménager",
        rating: 4.8,
        reviews: 112,
        image: "https://plus.unsplash.com/premium_photo-1663047248162-421b8fcc04da?w=500&q=80",
        inStock: true,
        description: "Refroidissement rapide et silencieux, idéal pour rafraîchir la chambre pendant les fortes chaleurs."
    },
    {
        name: "Chemise Manches Longues H&M",
        brand: "H&M",
        price: 15000,
        category: "Mode & Vêtements",
        rating: 4.5,
        reviews: 88,
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80",
        inStock: true,
        description: "Idéale pour les grandes occasions ou le bureau, coupe ajustée."
    },
    {
        name: "Casque Audio Sony WH-1000XM4",
        brand: "Sony",
        price: 180000,
        category: "Électronique",
        rating: 4.9,
        reviews: 310,
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80",
        inStock: true,
        description: "La meilleure réduction de bruit active du marché pour une immersion musicale totale."
    }
];

module.exports = products;
