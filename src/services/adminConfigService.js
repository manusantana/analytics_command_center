import { supabase } from '../lib/supabase';

class AdminConfigService {
  // Customer Management
  async getCustomers() {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async createCustomer(customerData) {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { data, error } = await supabase.from('customers').insert([customerData]).select().single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async updateCustomer(id, customerData) {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { data, error } = await supabase.from('customers').update(customerData).eq('id', id).select().single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async deleteCustomer(id) {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { error } = await supabase.from('customers').delete().eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  // Service Configuration Management
  async getServiceConfigurations(customerId = null) {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      let query = supabase.from('service_configurations').select(`
          *,
          customers (
            id,
            name,
            email,
            company
          )
        `).order('created_at', { ascending: false });

      if (customerId) {
        query = query.eq('customer_id', customerId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async createServiceConfiguration(configData) {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { data, error } = await supabase.from('service_configurations').insert([configData]).select(`
          *,
          customers (
            id,
            name,
            email,
            company
          )
        `).single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async updateServiceConfiguration(id, configData) {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { data, error } = await supabase.from('service_configurations').update(configData).eq('id', id).select(`
          *,
          customers (
            id,
            name,
            email,
            company
          )
        `).single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async deleteServiceConfiguration(id) {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { error } = await supabase.from('service_configurations').delete().eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  // Google Analytics Configuration
  async setGoogleAnalyticsConfig(customerId, config) {
    const configData = {
      customer_id: customerId,
      service_type: 'google_analytics',
      config_data: {
        measurement_id: config?.measurement_id,
        property_id: config?.property_id,
        api_key: config?.api_key,
        view_id: config?.view_id,
        settings: config?.settings || {}
      }
    };

    return this.upsertServiceConfiguration(configData);
  }

  // Shopify Configuration
  async setShopifyConfig(customerId, config) {
    const configData = {
      customer_id: customerId,
      service_type: 'shopify',
      config_data: {
        shop_domain: config?.shop_domain,
        access_token: config?.access_token,
        api_key: config?.api_key,
        api_secret: config?.api_secret,
        webhook_url: config?.webhook_url,
        settings: config?.settings || {}
      }
    };

    return this.upsertServiceConfiguration(configData);
  }

  // Helper method for upsert operations
  async upsertServiceConfiguration(configData) {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { data, error } = await supabase.from('service_configurations').upsert(configData, {
          onConflict: 'customer_id,service_type'
        }).select(`
          *,
          customers (
            id,
            name,
            email,
            company
          )
        `).single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Analytics Data Management
  async getAnalyticsData(customerId, dataType = null, dateRange = null) {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      let query = supabase.from('analytics_data').select('*').eq('customer_id', customerId).order('created_at', { ascending: false });

      if (dataType) {
        query = query.eq('data_type', dataType);
      }

      if (dateRange?.startDate && dateRange?.endDate) {
        query = query.gte('date_range_start', dateRange?.startDate).lte('date_range_end', dateRange?.endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async saveAnalyticsData(customerId, dataType, data, dateRange = null) {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const analyticsData = {
        customer_id: customerId,
        data_type: dataType,
        data: data,
        date_range_start: dateRange?.startDate || null,
        date_range_end: dateRange?.endDate || null
      };

      const { data: savedData, error } = await supabase.from('analytics_data').insert([analyticsData]).select().single();

      if (error) throw error;
      return { data: savedData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get service configuration for a specific customer and service type
  async getCustomerServiceConfig(customerId, serviceType) {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { data, error } = await supabase.from('service_configurations').select('*').eq('customer_id', customerId).eq('service_type', serviceType).eq('is_active', true).single();

      if (error && error?.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
}

export default AdminConfigService;