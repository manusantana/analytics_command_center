-- Mock Data for Admin Configuration System
-- Run this after the main migration

-- Insert admin user (this would normally be created through signup)
-- Note: In production, users are created through Supabase Auth, this is just for reference
INSERT INTO user_profiles (id, email, full_name, role) 
VALUES 
  ('admin-uuid-here', 'admin@example.com', 'System Administrator', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Insert sample customers
INSERT INTO customers (id, name, email, company, status) VALUES 
  ('customer-1-uuid', 'Acme Corporation', 'contact@acmecorp.com', 'Acme Corp', 'active'),
  ('customer-2-uuid', 'TechStart Inc', 'hello@techstart.com', 'TechStart Inc', 'active'),
  ('customer-3-uuid', 'Digital Solutions', 'info@digitalsolutions.com', 'Digital Solutions Ltd', 'active'),
  ('customer-4-uuid', 'E-commerce Plus', 'support@ecommerceplus.com', 'E-commerce Plus', 'inactive');

-- Insert sample Google Analytics configurations
INSERT INTO service_configurations (customer_id, service_type, config_data, is_active, created_by) VALUES 
  (
    'customer-1-uuid', 
    'google_analytics', 
    '{
      "measurement_id": "G-XXXXXXXXXX",
      "property_id": "123456789",
      "api_key": "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "view_id": "987654321",
      "settings": {
        "timezone": "America/New_York",
        "currency": "USD",
        "enhanced_ecommerce": true
      }
    }',
    true,
    'admin-uuid-here'
  ),
  (
    'customer-2-uuid', 
    'google_analytics', 
    '{
      "measurement_id": "G-YYYYYYYYYY",
      "property_id": "987654321",
      "api_key": "AIzaSyByyyyyyyyyyyyyyyyyyyyyyyyyyyy",
      "settings": {
        "timezone": "Europe/London",
        "currency": "EUR"
      }
    }',
    true,
    'admin-uuid-here'
  );

-- Insert sample Shopify configurations
INSERT INTO service_configurations (customer_id, service_type, config_data, is_active, created_by) VALUES 
  (
    'customer-1-uuid', 
    'shopify', 
    '{
      "shop_domain": "acmecorp.myshopify.com",
      "access_token": "shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "api_key": "your_api_key_here",
      "api_secret": "your_api_secret_here",
      "webhook_url": "https://yourapp.com/webhooks/shopify",
      "settings": {
        "auto_sync": true,
        "sync_frequency": "hourly",
        "webhook_events": ["orders/create", "orders/updated", "products/update"]
      }
    }',
    true,
    'admin-uuid-here'
  ),
  (
    'customer-3-uuid', 
    'shopify', 
    '{
      "shop_domain": "digitalsolutions.myshopify.com",
      "access_token": "shpat_yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",
      "api_key": "your_api_key_here_2",
      "settings": {
        "auto_sync": false,
        "sync_frequency": "daily"
      }
    }',
    true,
    'admin-uuid-here'
  );

-- Insert sample analytics data
INSERT INTO analytics_data (customer_id, data_type, data, date_range_start, date_range_end) VALUES 
  (
    'customer-1-uuid',
    'kpi_metrics',
    '{
      "totalRevenue": {
        "current": 275000,
        "previous": 250000,
        "target": 300000,
        "sparkline": [250000, 255000, 260000, 265000, 270000, 275000]
      },
      "conversionRate": {
        "current": "3.2",
        "previous": 2.8,
        "target": 3.5,
        "sparkline": [2.6, 2.7, 2.8, 3.0, 3.1, 3.2]
      },
      "totalUsers": {
        "current": 45280,
        "previous": 42150,
        "target": 50000,
        "sparkline": [38000, 40000, 41500, 43000, 44200, 45280]
      }
    }',
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE
  ),
  (
    'customer-2-uuid',
    'traffic_sources',
    '[
      {"source": "Organic Search", "sessions": 12500, "percentage": "45.2"},
      {"source": "Direct", "sessions": 6800, "percentage": "24.6"},
      {"source": "Social Media", "sessions": 4200, "percentage": "15.2"},
      {"source": "Email", "sessions": 2800, "percentage": "10.1"},
      {"source": "Paid Search", "sessions": 1400, "percentage": "5.1"}
    ]',
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE
  );

-- Update timestamps to current time
UPDATE customers SET created_at = NOW() - (random() * INTERVAL '30 days');
UPDATE service_configurations SET created_at = NOW() - (random() * INTERVAL '20 days');
UPDATE analytics_data SET created_at = NOW() - (random() * INTERVAL '7 days');