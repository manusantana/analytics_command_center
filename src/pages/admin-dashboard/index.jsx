import React, { useState, useEffect } from 'react';
import { Users, Settings, Plus, Edit, Trash2, Shield } from 'lucide-react';
import AdminConfigService from '../../services/adminConfigService';
import CustomerForm from './components/CustomerForm';
import ServiceConfigForm from './components/ServiceConfigForm';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [serviceConfigs, setServiceConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('customers');
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editingConfig, setEditingConfig] = useState(null);

  const adminService = new AdminConfigService();

  useEffect(() => {
    if (!authLoading && user) {
      loadData();
    }
  }, [user, authLoading]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [customersResult, configsResult] = await Promise.all([
        adminService?.getCustomers(),
        adminService?.getServiceConfigurations()
      ]);

      if (customersResult?.error) {
        throw new Error(customersResult.error?.message || 'Failed to load customers');
      }

      if (configsResult?.error) {
        throw new Error(configsResult.error?.message || 'Failed to load service configurations');
      }

      setCustomers(customersResult?.data || []);
      setServiceConfigs(configsResult?.data || []);
    } catch (err) {
      setError(err?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSubmit = async (customerData) => {
    try {
      let result;
      if (editingCustomer) {
        result = await adminService?.updateCustomer(editingCustomer?.id, customerData);
      } else {
        result = await adminService?.createCustomer(customerData);
      }

      if (result?.error) {
        throw new Error(result.error?.message);
      }

      await loadData();
      setShowCustomerForm(false);
      setEditingCustomer(null);
    } catch (err) {
      setError(err?.message || 'Failed to save customer');
    }
  };

  const handleServiceConfigSubmit = async (configData) => {
    try {
      let result;
      if (editingConfig) {
        result = await adminService?.updateServiceConfiguration(editingConfig?.id, configData);
      } else {
        result = await adminService?.createServiceConfiguration(configData);
      }

      if (result?.error) {
        throw new Error(result.error?.message);
      }

      await loadData();
      setShowServiceForm(false);
      setEditingConfig(null);
    } catch (err) {
      setError(err?.message || 'Failed to save service configuration');
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!confirm('Are you sure you want to delete this customer? This will also delete all their service configurations.')) {
      return;
    }

    try {
      let result = await adminService?.deleteCustomer(customerId);
      if (result?.error) {
        throw new Error(result.error?.message);
      }

      await loadData();
    } catch (err) {
      setError(err?.message || 'Failed to delete customer');
    }
  };

  const handleDeleteServiceConfig = async (configId) => {
    if (!confirm('Are you sure you want to delete this service configuration?')) {
      return;
    }

    try {
      let result = await adminService?.deleteServiceConfiguration(configId);
      if (result?.error) {
        throw new Error(result.error?.message);
      }

      await loadData();
    } catch (err) {
      setError(err?.message || 'Failed to delete service configuration');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Required</h2>
          <p className="text-gray-600">Please sign in to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage customers and service configurations</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeTab === 'customers' ?'bg-blue-100 text-blue-700' :'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4 inline-block mr-2" />
              Customers ({customers?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeTab === 'services' ?'bg-blue-100 text-blue-700' :'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="w-4 h-4 inline-block mr-2" />
              Service Configurations ({serviceConfigs?.length || 0})
            </button>
          </nav>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Customers Tab */}
            {activeTab === 'customers' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Customer Management</h2>
                  <button
                    onClick={() => {
                      setEditingCustomer(null);
                      setShowCustomerForm(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Customer
                  </button>
                </div>

                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customers?.map((customer) => (
                        <tr key={customer?.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{customer?.name}</div>
                              <div className="text-sm text-gray-500">{customer?.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {customer?.company || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              customer?.status === 'active' ? 'bg-green-100 text-green-800' :
                              customer?.status === 'inactive'? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {customer?.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(customer?.created_at)?.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => {
                                setEditingCustomer(customer);
                                setShowCustomerForm(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCustomer(customer?.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {customers?.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
                      <p className="text-gray-500">Get started by adding your first customer.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Service Configurations Tab */}
            {activeTab === 'services' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Service Configurations</h2>
                  <button
                    onClick={() => {
                      setEditingConfig(null);
                      setShowServiceForm(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Configuration
                  </button>
                </div>

                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {serviceConfigs?.map((config) => (
                        <tr key={config?.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{config?.customers?.name}</div>
                              <div className="text-sm text-gray-500">{config?.customers?.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              config?.service_type === 'google_analytics' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {config?.service_type === 'google_analytics' ? 'Google Analytics' : 'Shopify'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              config?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {config?.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(config?.created_at)?.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => {
                                setEditingConfig(config);
                                setShowServiceForm(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteServiceConfig(config?.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {serviceConfigs?.length === 0 && (
                    <div className="text-center py-12">
                      <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No configurations found</h3>
                      <p className="text-gray-500">Get started by adding your first service configuration.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Customer Form Modal */}
        {showCustomerForm && (
          <CustomerForm
            customer={editingCustomer}
            onSubmit={handleCustomerSubmit}
            onCancel={() => {
              setShowCustomerForm(false);
              setEditingCustomer(null);
            }}
          />
        )}

        {/* Service Configuration Form Modal */}
        {showServiceForm && (
          <ServiceConfigForm
            config={editingConfig}
            customers={customers}
            onSubmit={handleServiceConfigSubmit}
            onCancel={() => {
              setShowServiceForm(false);
              setEditingConfig(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;