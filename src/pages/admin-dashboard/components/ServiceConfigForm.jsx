import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const ServiceConfigForm = ({ config, customers, onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    customer_id: '',
    service_type: 'google_analytics',
    is_active: true,
    config_data: {}
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showSecrets, setShowSecrets] = useState({});

  useEffect(() => {
    if (config) {
      setFormData({
        customer_id: config?.customer_id || '',
        service_type: config?.service_type || 'google_analytics',
        is_active: config?.is_active !== false,
        config_data: config?.config_data || {}
      });
    }
  }, [config]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.customer_id) {
      newErrors.customer_id = 'Please select a customer';
    }

    if (formData?.service_type === 'google_analytics') {
      if (!formData?.config_data?.measurement_id?.trim()) {
        newErrors.measurement_id = 'Google Analytics Measurement ID is required';
      }
    } else if (formData?.service_type === 'shopify') {
      if (!formData?.config_data?.shop_domain?.trim()) {
        newErrors.shop_domain = 'Shopify shop domain is required';
      }
      if (!formData?.config_data?.access_token?.trim()) {
        newErrors.access_token = 'Shopify access token is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const submitData = {
        ...formData,
        created_by: user?.id
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field?.includes('.')) {
      const [parent, child] = field?.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev?.[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error when user starts typing
    const errorField = field?.includes('.') ? field?.split('.')?.pop() : field;
    if (errors?.[errorField]) {
      setErrors(prev => ({
        ...prev,
        [errorField]: ''
      }));
    }
  };

  const toggleSecretVisibility = (field) => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev?.[field]
    }));
  };

  const renderGoogleAnalyticsFields = () => (
    <>
      <div>
        <label htmlFor="measurement_id" className="block text-sm font-medium text-gray-700 mb-1">
          Measurement ID *
        </label>
        <input
          type="text"
          id="measurement_id"
          value={formData?.config_data?.measurement_id || ''}
          onChange={(e) => handleInputChange('config_data.measurement_id', e?.target?.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
            errors?.measurement_id ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
          }`}
          placeholder="G-XXXXXXXXXX"
        />
        {errors?.measurement_id && (
          <p className="mt-1 text-sm text-red-600">{errors?.measurement_id}</p>
        )}
      </div>

      <div>
        <label htmlFor="property_id" className="block text-sm font-medium text-gray-700 mb-1">
          Property ID
        </label>
        <input
          type="text"
          id="property_id"
          value={formData?.config_data?.property_id || ''}
          onChange={(e) => handleInputChange('config_data.property_id', e?.target?.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="123456789"
        />
      </div>

      <div>
        <label htmlFor="api_key" className="block text-sm font-medium text-gray-700 mb-1">
          API Key
        </label>
        <div className="relative">
          <input
            type={showSecrets?.api_key ? 'text' : 'password'}
            id="api_key"
            value={formData?.config_data?.api_key || ''}
            onChange={(e) => handleInputChange('config_data.api_key', e?.target?.value)}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your Google Analytics API key"
          />
          <button
            type="button"
            onClick={() => toggleSecretVisibility('api_key')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showSecrets?.api_key ? (
              <EyeOff className="w-4 h-4 text-gray-400" />
            ) : (
              <Eye className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="view_id" className="block text-sm font-medium text-gray-700 mb-1">
          View ID
        </label>
        <input
          type="text"
          id="view_id"
          value={formData?.config_data?.view_id || ''}
          onChange={(e) => handleInputChange('config_data.view_id', e?.target?.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="987654321"
        />
      </div>
    </>
  );

  const renderShopifyFields = () => (
    <>
      <div>
        <label htmlFor="shop_domain" className="block text-sm font-medium text-gray-700 mb-1">
          Shop Domain *
        </label>
        <input
          type="text"
          id="shop_domain"
          value={formData?.config_data?.shop_domain || ''}
          onChange={(e) => handleInputChange('config_data.shop_domain', e?.target?.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
            errors?.shop_domain ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
          }`}
          placeholder="mystore.myshopify.com"
        />
        {errors?.shop_domain && (
          <p className="mt-1 text-sm text-red-600">{errors?.shop_domain}</p>
        )}
      </div>

      <div>
        <label htmlFor="access_token" className="block text-sm font-medium text-gray-700 mb-1">
          Access Token *
        </label>
        <div className="relative">
          <input
            type={showSecrets?.access_token ? 'text' : 'password'}
            id="access_token"
            value={formData?.config_data?.access_token || ''}
            onChange={(e) => handleInputChange('config_data.access_token', e?.target?.value)}
            className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              errors?.access_token ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
            }`}
            placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          />
          <button
            type="button"
            onClick={() => toggleSecretVisibility('access_token')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showSecrets?.access_token ? (
              <EyeOff className="w-4 h-4 text-gray-400" />
            ) : (
              <Eye className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
        {errors?.access_token && (
          <p className="mt-1 text-sm text-red-600">{errors?.access_token}</p>
        )}
      </div>

      <div>
        <label htmlFor="api_key_shopify" className="block text-sm font-medium text-gray-700 mb-1">
          API Key
        </label>
        <div className="relative">
          <input
            type={showSecrets?.api_key_shopify ? 'text' : 'password'}
            id="api_key_shopify"
            value={formData?.config_data?.api_key || ''}
            onChange={(e) => handleInputChange('config_data.api_key', e?.target?.value)}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your Shopify API key"
          />
          <button
            type="button"
            onClick={() => toggleSecretVisibility('api_key_shopify')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showSecrets?.api_key_shopify ? (
              <EyeOff className="w-4 h-4 text-gray-400" />
            ) : (
              <Eye className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="api_secret" className="block text-sm font-medium text-gray-700 mb-1">
          API Secret
        </label>
        <div className="relative">
          <input
            type={showSecrets?.api_secret ? 'text' : 'password'}
            id="api_secret"
            value={formData?.config_data?.api_secret || ''}
            onChange={(e) => handleInputChange('config_data.api_secret', e?.target?.value)}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your Shopify API secret"
          />
          <button
            type="button"
            onClick={() => toggleSecretVisibility('api_secret')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showSecrets?.api_secret ? (
              <EyeOff className="w-4 h-4 text-gray-400" />
            ) : (
              <Eye className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="webhook_url" className="block text-sm font-medium text-gray-700 mb-1">
          Webhook URL
        </label>
        <input
          type="url"
          id="webhook_url"
          value={formData?.config_data?.webhook_url || ''}
          onChange={(e) => handleInputChange('config_data.webhook_url', e?.target?.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://yourapp.com/webhooks/shopify"
        />
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {config ? 'Edit Service Configuration' : 'Add Service Configuration'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Customer Selection */}
            <div>
              <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700 mb-1">
                Customer *
              </label>
              <select
                id="customer_id"
                value={formData?.customer_id}
                onChange={(e) => handleInputChange('customer_id', e?.target?.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors?.customer_id ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                }`}
                disabled={!!config}
              >
                <option value="">Select a customer</option>
                {customers?.map((customer) => (
                  <option key={customer?.id} value={customer?.id}>
                    {customer?.name} ({customer?.email})
                  </option>
                ))}
              </select>
              {errors?.customer_id && (
                <p className="mt-1 text-sm text-red-600">{errors?.customer_id}</p>
              )}
            </div>

            {/* Service Type */}
            <div>
              <label htmlFor="service_type" className="block text-sm font-medium text-gray-700 mb-1">
                Service Type *
              </label>
              <select
                id="service_type"
                value={formData?.service_type}
                onChange={(e) => handleInputChange('service_type', e?.target?.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                disabled={!!config}
              >
                <option value="google_analytics">Google Analytics</option>
                <option value="shopify">Shopify</option>
              </select>
            </div>

            {/* Service-specific fields */}
            {formData?.service_type === 'google_analytics' && renderGoogleAnalyticsFields()}
            {formData?.service_type === 'shopify' && renderShopifyFields()}

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData?.is_active}
                onChange={(e) => handleInputChange('is_active', e?.target?.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                Active configuration
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : config ? 'Update Configuration' : 'Add Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceConfigForm;