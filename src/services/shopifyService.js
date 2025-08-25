// Shopify Admin API service
class ShopifyService {
  constructor() {
    this.shopDomain = import.meta.env?.VITE_SHOPIFY_STORE_URL;
    this.accessToken = import.meta.env?.VITE_SHOPIFY_ACCESS_TOKEN;
  }

  // Simulate Shopify data fetching
  // In production, this would be replaced with actual Shopify Admin API calls
  async getTopProducts(limit = 5) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const products = [
      {
        id: '1',
        name: 'Smartphone Pro Max',
        revenue: Math.floor(Math.random() * 50000) + 75000,
        orders: Math.floor(Math.random() * 200) + 350,
        averagePrice: 599.99,
        trend: 'up',
        category: 'Electrónicos'
      },
      {
        id: '2',
        name: 'Auriculares Inalámbricos',
        revenue: Math.floor(Math.random() * 30000) + 45000,
        orders: Math.floor(Math.random() * 300) + 280,
        averagePrice: 179.99,
        trend: 'up',
        category: 'Accesorios'
      },
      {
        id: '3',
        name: 'Laptop Gaming',
        revenue: Math.floor(Math.random() * 40000) + 38000,
        orders: Math.floor(Math.random() * 50) + 45,
        averagePrice: 1299.99,
        trend: 'down',
        category: 'Computadoras'
      },
      {
        id: '4',
        name: 'Cámara Digital',
        revenue: Math.floor(Math.random() * 25000) + 32000,
        orders: Math.floor(Math.random() * 80) + 85,
        averagePrice: 449.99,
        trend: 'up',
        category: 'Fotografía'
      },
      {
        id: '5',
        name: 'Smart Watch',
        revenue: Math.floor(Math.random() * 20000) + 28000,
        orders: Math.floor(Math.random() * 120) + 95,
        averagePrice: 299.99,
        trend: 'stable',
        category: 'Wearables'
      }
    ];

    return products?.slice(0, limit)?.sort((a, b) => b?.revenue - a?.revenue);
  }

  async getOrderMetrics(dateRange = '30days') {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      totalOrders: Math.floor(Math.random() * 500) + 1200,
      totalRevenue: Math.floor(Math.random() * 100000) + 280000,
      averageOrderValue: Math.floor(Math.random() * 50) + 180,
      returningCustomers: Math.floor(Math.random() * 200) + 450,
      newCustomers: Math.floor(Math.random() * 300) + 380,
      refunds: Math.floor(Math.random() * 20) + 15,
      conversionRate: (Math.random() * 1.5 + 2.8)?.toFixed(2)
    };
  }

  async getInventoryStatus() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      totalProducts: Math.floor(Math.random() * 200) + 450,
      lowStock: Math.floor(Math.random() * 20) + 12,
      outOfStock: Math.floor(Math.random() * 8) + 5,
      mostViewed: [
        { name: 'Smartphone Pro Max', views: Math.floor(Math.random() * 1000) + 2500 },
        { name: 'Auriculares Inalámbricos', views: Math.floor(Math.random() * 800) + 1800 },
        { name: 'Laptop Gaming', views: Math.floor(Math.random() * 600) + 1200 }
      ]
    };
  }

  async getCustomerMetrics() {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return {
      totalCustomers: Math.floor(Math.random() * 1000) + 5500,
      activeCustomers: Math.floor(Math.random() * 500) + 2200,
      newCustomersThisMonth: Math.floor(Math.random() * 200) + 180,
      customerLifetimeValue: Math.floor(Math.random() * 200) + 450,
      repeatPurchaseRate: (Math.random() * 20 + 25)?.toFixed(1), // 25-45%
      topCustomers: [
        { email: 'customer1@example.com', totalSpent: Math.floor(Math.random() * 2000) + 3500 },
        { email: 'customer2@example.com', totalSpent: Math.floor(Math.random() * 1500) + 2800 },
        { email: 'customer3@example.com', totalSpent: Math.floor(Math.random() * 1000) + 2200 }
      ]
    };
  }
}

export default ShopifyService;