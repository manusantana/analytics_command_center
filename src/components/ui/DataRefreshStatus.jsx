import React, { useState, useEffect } from 'react';
import Button from './Button';
import Icon from '../AppIcon';

const DataRefreshStatus = ({ className = '' }) => {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({
    googleAnalytics: 'connected',
    shopify: 'connected'
  });
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-refresh timer
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate automatic data refresh every 5 minutes
      if (!isRefreshing) {
        handleAutoRefresh();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [isRefreshing]);

  const handleAutoRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // Simulate API calls to refresh data
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLastRefresh(new Date());
      
      // Randomly simulate connection issues (for demo purposes)
      const shouldSimulateError = Math.random() < 0.1; // 10% chance
      if (shouldSimulateError) {
        setConnectionStatus(prev => ({
          ...prev,
          googleAnalytics: Math.random() < 0.5 ? 'error' : 'connected'
        }));
      } else {
        setConnectionStatus({
          googleAnalytics: 'connected',
          shopify: 'connected'
        });
      }
    } catch (error) {
      console.error('Refresh failed:', error);
      setConnectionStatus({
        googleAnalytics: 'error',
        shopify: 'error'
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    setIsExpanded(false);
    
    try {
      // Simulate manual refresh
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLastRefresh(new Date());
      setConnectionStatus({
        googleAnalytics: 'connected',
        shopify: 'connected'
      });
    } catch (error) {
      console.error('Manual refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatLastRefresh = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 1) {
      return 'ahora mismo';
    } else if (minutes < 60) {
      return `hace ${minutes}m`;
    } else if (hours < 24) {
      return `hace ${hours}h`;
    } else {
      return date?.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return 'CheckCircle';
      case 'error':
        return 'XCircle';
      case 'warning':
        return 'AlertCircle';
      default:
        return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-success';
      case 'error':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const hasErrors = Object.values(connectionStatus)?.some(status => status === 'error');
  const hasWarnings = Object.values(connectionStatus)?.some(status => status === 'warning');

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleExpanded}
        className="flex items-center space-x-2 text-xs"
        aria-label="Estado de actualización de datos"
      >
        <Icon
          name={isRefreshing ? 'RotateCw' : hasErrors ? 'AlertCircle' : 'RefreshCw'}
          size={14}
          className={`${
            isRefreshing ? 'animate-spin text-primary' : hasErrors ?'text-error': hasWarnings ?'text-warning': 'text-success'
          }`}
        />
        <span className="hidden sm:inline text-muted-foreground">
          {isRefreshing ? 'Actualizando...' : formatLastRefresh(lastRefresh)}
        </span>
      </Button>
      {isExpanded && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-popover border border-border rounded-lg shadow-modal z-200">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-popover-foreground">Estado de Datos</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                iconName="RefreshCw"
                className={isRefreshing ? 'animate-spin' : ''}
              >
                {isRefreshing ? 'Actualizando' : 'Actualizar'}
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Last Refresh Info */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Última actualización:</span>
              <span className="text-sm font-medium text-popover-foreground">
                {formatLastRefresh(lastRefresh)}
              </span>
            </div>

            {/* Connection Status */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-popover-foreground">Conexiones:</h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon
                      name={getStatusIcon(connectionStatus?.googleAnalytics)}
                      size={14}
                      className={getStatusColor(connectionStatus?.googleAnalytics)}
                    />
                    <span className="text-sm">Google Analytics</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    connectionStatus?.googleAnalytics === 'connected' ? 'bg-success/10 text-success' :
                    connectionStatus?.googleAnalytics === 'error'? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
                  }`}>
                    {connectionStatus?.googleAnalytics === 'connected' ? 'Conectado' :
                     connectionStatus?.googleAnalytics === 'error' ? 'Error' : 'Advertencia'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon
                      name={getStatusIcon(connectionStatus?.shopify)}
                      size={14}
                      className={getStatusColor(connectionStatus?.shopify)}
                    />
                    <span className="text-sm">Shopify</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    connectionStatus?.shopify === 'connected' ? 'bg-success/10 text-success' :
                    connectionStatus?.shopify === 'error'? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
                  }`}>
                    {connectionStatus?.shopify === 'connected' ? 'Conectado' :
                     connectionStatus?.shopify === 'error' ? 'Error' : 'Advertencia'}
                  </span>
                </div>
              </div>
            </div>

            {/* Auto-refresh Info */}
            <div className="pt-3 border-t border-border">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Icon name="Clock" size={12} />
                <span>Actualización automática cada 5 minutos</span>
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpanded}
              className="w-full text-xs"
            >
              Cerrar
            </Button>
          </div>
        </div>
      )}
      {/* Overlay to close dropdown when clicking outside */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-100"
          onClick={toggleExpanded}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default DataRefreshStatus;