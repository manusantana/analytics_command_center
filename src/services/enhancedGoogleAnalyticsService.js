import AdminConfigService from './adminConfigService';

class EnhancedGoogleAnalyticsService {
  constructor() {
    this.adminService = new AdminConfigService();
  }

  // Get customer configuration and validate access
  async getCustomerConfig(customerId) {
    try {
      const { data: config } = await this.adminService?.getCustomerServiceConfig(
        customerId, 
        'google_analytics'
      );

      if (!config || !config?.is_active) {
        throw new Error('Google Analytics not configured for this customer');
      }

      return config?.config_data;
    } catch (error) {
      throw new Error(`Failed to get customer configuration: ${error?.message}`);
    }
  }

  // Enhanced method to get real-time metrics with customer-specific config
  async getRealtimeMetrics(customerId) {
    try {
      const config = await this.getCustomerConfig(customerId);
      
      // In a real implementation, you would use the config to make actual API calls
      // For now, we'll return mock data but store it in the database
      const mockData = {
        totalUsers: Math.floor(Math.random() * 1000) + 500,
        activeUsers: Math.floor(Math.random() * 200) + 100,
        pageViews: Math.floor(Math.random() * 5000) + 2000,
        sessions: Math.floor(Math.random() * 800) + 400,
        bounceRate: (Math.random() * 0.4 + 0.3)?.toFixed(2),
        sessionDuration: Math.floor(Math.random() * 300) + 120,
      };

      // Store data for customer
      await this.adminService?.saveAnalyticsData(
        customerId,
        'realtime_metrics',
        mockData
      );

      return mockData;
    } catch (error) {
      throw new Error(`Failed to get realtime metrics: ${error?.message}`);
    }
  }

  async getKPIMetrics(customerId, dateRange = { startDate: '30daysAgo', endDate: 'today' }) {
    try {
      const config = await this.getCustomerConfig(customerId);
      
      const baseRevenue = 250000;
      const variation = Math.random() * 0.2 - 0.1;
      const currentRevenue = Math.floor(baseRevenue * (1 + variation));
      const previousRevenue = Math.floor(baseRevenue * 0.9);

      const mockData = {
        totalRevenue: {
          current: currentRevenue,
          previous: previousRevenue,
          target: 300000,
          sparkline: this.generateSparklineData(previousRevenue, currentRevenue, 6)
        },
        conversionRate: {
          current: (Math.random() * 1.5 + 2.5)?.toFixed(1),
          previous: 2.8,
          target: 3.5,
          sparkline: [2.6, 2.7, 2.8, 3.0, 3.1, 3.2]
        },
        totalUsers: {
          current: Math.floor(Math.random() * 10000) + 40000,
          previous: 42150,
          target: 50000,
          sparkline: [38000, 40000, 41500, 43000, 44200, 45280]
        },
        roas: {
          current: (Math.random() * 1.0 + 4.0)?.toFixed(1),
          previous: 4.2,
          target: 5.0,
          sparkline: [4.0, 4.1, 4.3, 4.5, 4.7, 4.8]
        }
      };

      // Store data for customer
      await this.adminService?.saveAnalyticsData(
        customerId,
        'kpi_metrics',
        mockData,
        dateRange
      );

      return mockData;
    } catch (error) {
      throw new Error(`Failed to get KPI metrics: ${error?.message}`);
    }
  }

  async getTrafficSources(customerId, dateRange = { startDate: '30daysAgo', endDate: 'today' }) {
    try {
      const config = await this.getCustomerConfig(customerId);

      const sources = [
        { source: 'Organic Search', sessions: Math.floor(Math.random() * 5000) + 8000, percentage: 0 },
        { source: 'Direct', sessions: Math.floor(Math.random() * 3000) + 4000, percentage: 0 },
        { source: 'Social Media', sessions: Math.floor(Math.random() * 2000) + 2500, percentage: 0 },
        { source: 'Email', sessions: Math.floor(Math.random() * 1500) + 1800, percentage: 0 },
        { source: 'Paid Search', sessions: Math.floor(Math.random() * 1000) + 1200, percentage: 0 },
        { source: 'Referral', sessions: Math.floor(Math.random() * 800) + 800, percentage: 0 },
      ];

      const totalSessions = sources?.reduce((sum, source) => sum + source?.sessions, 0);
      sources?.forEach(source => {
        source.percentage = ((source?.sessions / totalSessions) * 100)?.toFixed(1);
      });

      const sortedSources = sources?.sort((a, b) => b?.sessions - a?.sessions);

      // Store data for customer
      await this.adminService?.saveAnalyticsData(
        customerId,
        'traffic_sources',
        sortedSources,
        dateRange
      );

      return sortedSources;
    } catch (error) {
      throw new Error(`Failed to get traffic sources: ${error?.message}`);
    }
  }

  async getRevenueData(customerId, dateRange = { startDate: '30daysAgo', endDate: 'today' }) {
    try {
      const config = await this.getCustomerConfig(customerId);

      const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
      const currentMonth = new Date()?.getMonth();
      
      const revenueData = months?.slice(0, currentMonth + 1)?.map((month, index) => ({
        month,
        revenue: Math.floor(Math.random() * 30000) + 45000,
        users: Math.floor(Math.random() * 2000) + 2800,
        orders: Math.floor(Math.random() * 200) + 320,
        sessions: Math.floor(Math.random() * 3000) + 3500,
        conversionRate: (Math.random() * 2 + 2.5)?.toFixed(2)
      }));

      // Store data for customer
      await this.adminService?.saveAnalyticsData(
        customerId,
        'revenue_data',
        revenueData,
        dateRange
      );

      return revenueData;
    } catch (error) {
      throw new Error(`Failed to get revenue data: ${error?.message}`);
    }
  }

  async getConversionFunnelData(customerId) {
    try {
      const config = await this.getCustomerConfig(customerId);

      const totalSessions = Math.floor(Math.random() * 10000) + 50000;
      
      const funnelData = [
        { step: 'Sesiones', count: totalSessions, percentage: 100 },
        { step: 'Páginas de Producto', count: Math.floor(totalSessions * 0.6), percentage: 60 },
        { step: 'Carrito de Compras', count: Math.floor(totalSessions * 0.15), percentage: 15 },
        { step: 'Inicio de Checkout', count: Math.floor(totalSessions * 0.08), percentage: 8 },
        { step: 'Compras Completadas', count: Math.floor(totalSessions * 0.032), percentage: 3.2 },
      ];

      // Store data for customer
      await this.adminService?.saveAnalyticsData(
        customerId,
        'conversion_funnel',
        funnelData
      );

      return funnelData;
    } catch (error) {
      throw new Error(`Failed to get conversion funnel data: ${error?.message}`);
    }
  }

  // Get cached analytics data for a customer
  async getCachedAnalyticsData(customerId, dataType, dateRange = null) {
    try {
      const { data } = await this.adminService?.getAnalyticsData(customerId, dataType, dateRange);
      return data?.[0]?.data || null; // Return most recent data
    } catch (error) {
      throw new Error(`Failed to get cached analytics data: ${error?.message}`);
    }
  }

  // Utility method for generating sparkline data
  generateSparklineData(startValue, endValue, points) {
    const data = [];
    const step = (endValue - startValue) / (points - 1);
    
    for (let i = 0; i < points; i++) {
      const value = startValue + (step * i);
      const noise = value * (Math.random() * 0.1 - 0.05);
      data?.push(Math.floor(value + noise));
    }
    
    return data;
  }
}

export default EnhancedGoogleAnalyticsService;