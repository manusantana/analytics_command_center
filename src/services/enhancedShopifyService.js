import AdminConfigService from './adminConfigService';

class EnhancedShopifyService {
  constructor() {
    this.adminService = new AdminConfigService();
  }

  // Get customer configuration and validate access
  async getCustomerConfig(customerId) {
    try {
      const { data: config } = await this.adminService?.getCustomerServiceConfig(
        customerId, 
        'shopify'
      );

      if (!config || !config?.is_active) {
        throw new Error('Shopify not configured for this customer');
      }

      return config?.config_data;
    } catch (error) {
      throw new Error(`Failed to get customer configuration: ${error?.message}`);
    }
  }

  // Enhanced method to get store info with customer-specific config
  async getStoreInfo(customerId) {
    try {
      const config = await this.getCustomerConfig(customerId);
      
      // In a real implementation, you would use the config to make actual API calls
      // For now, we'll return mock data
      const mockData = {
        shop_domain: config?.shop_domain,
        name: `${config?.shop_domain?.split('.')?.[0]} Store`,
        email: 'store@example.com',
        currency: 'USD',
        timezone: 'America/New_York',
        plan_name: 'shopify_plus',
        created_at: '2022-01-15T10:00:00Z'
      };

      return mockData;
    } catch (error) {
      throw new Error(`Failed to get store info: ${error?.message}`);
    }
  }

  async getProducts(customerId, limit = 50) {
    try {
      const config = await this.getCustomerConfig(customerId);

      // Mock products data
      const mockProducts = Array.from({ length: limit }, (_, index) => ({
        id: `prod_${index + 1}`,
        title: `Product ${index + 1}`,
        handle: `product-${index + 1}`,
        vendor: 'Your Store',
        product_type: ['Electronics', 'Clothing', 'Home & Garden', 'Sports']?.[Math.floor(Math.random() * 4)],
        status: Math.random() > 0.1 ? 'active' : 'draft',
        price: (Math.random() * 200 + 10)?.toFixed(2),
        inventory_quantity: Math.floor(Math.random() * 100),
        created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)?.toISOString()
      }));

      return mockProducts;
    } catch (error) {
      throw new Error(`Failed to get products: ${error?.message}`);
    }
  }

  async getOrders(customerId, limit = 50) {
    try {
      const config = await this.getCustomerConfig(customerId);

      // Mock orders data
      const mockOrders = Array.from({ length: limit }, (_, index) => ({
        id: `order_${index + 1}`,
        order_number: 1000 + index,
        financial_status: ['paid', 'pending', 'refunded']?.[Math.floor(Math.random() * 3)],
        fulfillment_status: ['fulfilled', 'partial', 'unfulfilled']?.[Math.floor(Math.random() * 3)],
        total_price: (Math.random() * 500 + 20)?.toFixed(2),
        currency: 'USD',
        customer: {
          first_name: ['John', 'Jane', 'Mike', 'Sarah']?.[Math.floor(Math.random() * 4)],
          last_name: ['Doe', 'Smith', 'Johnson', 'Williams']?.[Math.floor(Math.random() * 4)],
          email: `customer${index}@example.com`
        },
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)?.toISOString(),
        line_items: Math.floor(Math.random() * 3) + 1
      }));

      return mockOrders;
    } catch (error) {
      throw new Error(`Failed to get orders: ${error?.message}`);
    }
  }

  async getCustomers(customerId, limit = 50) {
    try {
      const config = await this.getCustomerConfig(customerId);

      // Mock customers data
      const mockCustomers = Array.from({ length: limit }, (_, index) => ({
        id: `customer_${index + 1}`,
        first_name: ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily']?.[Math.floor(Math.random() * 6)],
        last_name: ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Davis']?.[Math.floor(Math.random() * 6)],
        email: `customer${index + 1}@example.com`,
        orders_count: Math.floor(Math.random() * 10),
        total_spent: (Math.random() * 1000)?.toFixed(2),
        state: ['enabled', 'disabled']?.[Math.floor(Math.random() * 2)],
        created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)?.toISOString(),
        tags: []
      }));

      return mockCustomers;
    } catch (error) {
      throw new Error(`Failed to get customers: ${error?.message}`);
    }
  }

  async getAnalyticsData(customerId, dateRange = { startDate: '30daysAgo', endDate: 'today' }) {
    try {
      const config = await this.getCustomerConfig(customerId);

      // Mock analytics data
      const mockAnalytics = {
        total_sales: (Math.random() * 50000 + 10000)?.toFixed(2),
        total_orders: Math.floor(Math.random() * 500 + 100),
        conversion_rate: (Math.random() * 3 + 1)?.toFixed(2),
        average_order_value: (Math.random() * 150 + 50)?.toFixed(2),
        returning_customer_rate: (Math.random() * 40 + 20)?.toFixed(1),
        sessions: Math.floor(Math.random() * 10000 + 5000),
        top_products: [
          { name: 'Product A', sales: Math.floor(Math.random() * 100 + 50) },
          { name: 'Product B', sales: Math.floor(Math.random() * 100 + 50) },
          { name: 'Product C', sales: Math.floor(Math.random() * 100 + 50) }
        ]
      };

      // Store analytics data
      await this.adminService?.saveAnalyticsData(
        customerId,
        'shopify_analytics',
        mockAnalytics,
        dateRange
      );

      return mockAnalytics;
    } catch (error) {
      throw new Error(`Failed to get analytics data: ${error?.message}`);
    }
  }

  // Test connection with customer's configuration
  async testConnection(customerId) {
    try {
      const config = await this.getCustomerConfig(customerId);
      
      // In a real implementation, you would make a test API call
      // For now, we'll simulate a successful connection test
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: `Successfully connected to ${config?.shop_domain}`,
        shop_domain: config?.shop_domain,
        timestamp: new Date()?.toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message,
        timestamp: new Date()?.toISOString()
      };
    }
  }

  // Get cached Shopify data for a customer
  async getCachedShopifyData(customerId, dataType, dateRange = null) {
    try {
      const { data } = await this.adminService?.getAnalyticsData(customerId, dataType, dateRange);
      return data?.[0]?.data || null; // Return most recent data
    } catch (error) {
      throw new Error(`Failed to get cached Shopify data: ${error?.message}`);
    }
  }
}

export default EnhancedShopifyService;