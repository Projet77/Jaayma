
export const mockAdminData = {
  sales: {
    today: 1250000,
    week: 8500000,
    month: 32000000,
    growth: 15.6
  },
  products: {
    total: 1247,
    pending: 23,
    outOfStock: 45,
    newToday: 8
  },
  users: {
    total: 8923,
    active: 6742,
    newToday: 123,
    sellers: 156
  },
  orders: {
    total: 2345,
    pending: 189,
    processing: 67,
    shipped: 145,
    delivered: 1944
  }
};

export const mockAdminProducts = [
  {
    id: 101,
    name: "Téléphone Smartphone Galaxy S21",
    price: 350000,
    category: "Électronique",
    seller: "ElectroDakar",
    sellerId: 201,
    dateAdded: "2024-01-15",
    status: "approved",
    image: "https://placehold.co/100x100/3b82f6/ffffff?text=Galaxy+S21",
    views: 1250,
    sales: 45
  },
  {
    id: 102,
    name: "Boubou Traditionnel en Wax",
    price: 15000,
    category: "Mode",
    seller: "ModeLocale",
    sellerId: 202,
    dateAdded: "2024-01-14",
    status: "pending",
    image: "https://placehold.co/100x100/ef4444/ffffff?text=Boubou+Wax",
    views: 890,
    sales: 23
  },
  {
    id: 103,
    name: "Machine à Laver Samsung 8kg",
    price: 180000,
    category: "Électroménager",
    seller: "ElectroDakar",
    sellerId: 201,
    dateAdded: "2024-01-13",
    status: "approved",
    image: "https://placehold.co/100x100/10b981/ffffff?text=Machine+à+laver",
    views: 670,
    sales: 18
  },
  {
    id: 104,
    name: "Sac à Main en Cuir Artisanal",
    price: 25000,
    category: "Mode",
    seller: "CuirSenegal",
    sellerId: 203,
    dateAdded: "2024-01-12",
    status: "rejected",
    rejectionReason: "Images de mauvaise qualité",
    image: "https://placehold.co/100x100/f59e0b/ffffff?text=Sac+à+main",
    views: 450,
    sales: 8
  }
];

export const mockAdminUsers = [
  {
    id: 1,
    name: "Fatou Diop",
    email: "fatou@email.com",
    role: "customer",
    location: "Dakar",
    phone: "77 123 45 67",
    joinDate: "2023-05-12",
    status: "active",
    totalSpent: 450000,
    orders: 12
  },
  {
    id: 2,
    name: "Aliou Sow",
    email: "aliou@email.com",
    role: "seller",
    location: "Thiès",
    phone: "76 987 65 43",
    joinDate: "2023-03-08",
    status: "active",
    totalSales: 2800000,
    products: 15
  },
  {
    id: 3,
    name: "Moussa Diallo",
    email: "moussa@email.com",
    role: "seller",
    location: "Dakar",
    phone: "78 555 44 33",
    joinDate: "2024-01-10",
    status: "pending",
    totalSales: 0,
    products: 0
  },
  {
    id: 4,
    name: "Awa Ba",
    email: "awa@email.com",
    role: "customer",
    location: "Saint-Louis",
    phone: "70 111 22 33",
    joinDate: "2023-12-05",
    status: "suspended",
    totalSpent: 120000,
    orders: 5,
    suspensionReason: "Paiements non réglés"
  }
];

export const mockAdminOrders = [
  {
    id: 1001,
    orderId: "JM1001",
    customer: "Fatou Diop",
    customerEmail: "fatou@email.com",
    date: "2024-01-15",
    status: "pending",
    total: 365000,
    items: 3,
    paymentMethod: "Orange Money",
    shippingAddress: "Avenue Cheikh Anta Diop, Dakar"
  },
  {
    id: 1002,
    orderId: "JM1002",
    customer: "Aliou Sow",
    customerEmail: "aliou@email.com",
    date: "2024-01-15",
    status: "processing",
    total: 180000,
    items: 1,
    paymentMethod: "Wave",
    shippingAddress: "Route de Rufisque, Thiès"
  },
  {
    id: 1003,
    orderId: "JM1003",
    customer: "Moussa Diallo",
    customerEmail: "moussa@email.com",
    date: "2024-01-14",
    status: "shipped",
    total: 25000,
    items: 1,
    paymentMethod: "Cash on Delivery",
    shippingAddress: "Plateau, Dakar"
  },
  {
    id: 1004,
    orderId: "JM1004",
    customer: "Awa Ba",
    customerEmail: "awa@email.com",
    date: "2024-01-14",
    status: "delivered",
    total: 15000,
    items: 1,
    paymentMethod: "Orange Money",
    shippingAddress: "Saint-Louis"
  },
  {
    id: 1005,
    orderId: "JM1005",
    customer: "Fatou Diop",
    customerEmail: "fatou@email.com",
    date: "2024-01-13",
    status: "dispute",
    total: 350000,
    items: 1,
    paymentMethod: "Card",
    shippingAddress: "Avenue Cheikh Anta Diop, Dakar",
    disputeReason: "Produit non reçu",
    disputeDate: "2024-01-15"
  }
];

export const mockAdminReviews = [
  {
    id: 2001,
    productId: 101,
    productName: "Téléphone Smartphone Galaxy S21",
    customer: "Fatou Diop",
    rating: 5,
    comment: "Excellent produit, livraison rapide. Très satisfait de mon achat!",
    date: "2024-01-14",
    status: "approved",
    helpful: 12
  },
  {
    id: 2002,
    productId: 102,
    productName: "Boubou Traditionnel en Wax",
    customer: "Awa Ba",
    rating: 4,
    comment: "Très beau boubou, la couleur est exactement comme sur la photo.",
    date: "2024-01-13",
    status: "pending",
    helpful: 8
  },
  {
    id: 2003,
    productId: 101,
    productName: "Téléphone Smartphone Galaxy S21",
    customer: "Moussa Diallo",
    rating: 2,
    comment: "Le téléphone a des rayures visibles. Pas satisfait du tout.",
    date: "2024-01-12",
    status: "flagged",
    flagReason: "Contenu inapproprié",
    helpful: 3
  }
];
