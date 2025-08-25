import React, { useState, useEffect } from 'react';
import Button from './Button';
import Icon from '../AppIcon';

const PerformanceAlertIndicator = ({ className = '' }) => {
  const [alerts, setAlerts] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Simulated alert data - in real app, this would come from API
  const mockAlerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Caída significativa en conversiones',
      message: 'Las conversiones han disminuido un 25% en las últimas 2 horas',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      metric: 'conversion_rate',
      threshold: '25%',
      isRead: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Aumento inusual en tasa de rebote',
      message: 'La tasa de rebote ha aumentado un 15% comparado con la semana anterior',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      metric: 'bounce_rate',
      threshold: '15%',
      isRead: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Nuevo pico de tráfico detectado',
      message: 'Se ha registrado un aumento del 40% en visitantes únicos',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      metric: 'unique_visitors',
      threshold: '40%',
      isRead: true
    }
  ];

  useEffect(() => {
    // Simulate loading alerts
    setAlerts(mockAlerts);
    setUnreadCount(mockAlerts?.filter(alert => !alert?.isRead)?.length);
  }, []);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return 'AlertTriangle';
      case 'warning':
        return 'AlertCircle';
      case 'info':
        return 'Info';
      default:
        return 'Bell';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      case 'info':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `hace ${hours}h`;
    } else if (minutes > 0) {
      return `hace ${minutes}m`;
    } else {
      return 'ahora';
    }
  };

  const markAsRead = (alertId) => {
    setAlerts(prevAlerts =>
      prevAlerts?.map(alert =>
        alert?.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setAlerts(prevAlerts =>
      prevAlerts?.map(alert => ({ ...alert, isRead: true }))
    );
    setUnreadCount(0);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleExpanded}
        className="relative"
        aria-label={`Alertas de rendimiento${unreadCount > 0 ? ` (${unreadCount} sin leer)` : ''}`}
      >
        <Icon name="Bell" size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
      {isExpanded && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-modal z-200">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-popover-foreground">Alertas de Rendimiento</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Marcar todas como leídas
                </Button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {alerts?.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <Icon name="CheckCircle" size={24} className="mx-auto mb-2" />
                <p className="text-sm">No hay alertas activas</p>
              </div>
            ) : (
              alerts?.map((alert) => (
                <div
                  key={alert?.id}
                  className={`p-4 border-b border-border last:border-b-0 cursor-pointer hover:bg-muted transition-smooth ${
                    !alert?.isRead ? 'bg-accent/20' : ''
                  }`}
                  onClick={() => markAsRead(alert?.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Icon
                      name={getAlertIcon(alert?.type)}
                      size={16}
                      className={`mt-0.5 ${getAlertColor(alert?.type)}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-popover-foreground truncate">
                          {alert?.title}
                        </h4>
                        {!alert?.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full ml-2 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {alert?.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(alert?.timestamp)}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          alert?.type === 'critical' ? 'bg-error/10 text-error' :
                          alert?.type === 'warning'? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'
                        }`}>
                          {alert?.threshold}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
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

export default PerformanceAlertIndicator;