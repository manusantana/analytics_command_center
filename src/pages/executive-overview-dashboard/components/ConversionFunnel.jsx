import React from 'react';
import Icon from '../../../components/AppIcon';

const ConversionFunnel = ({ data = [], className = '' }) => {
  // Use real data from Google Analytics if available
  const funnelData = data?.length > 0 ? data : [];

  const formatNumber = (value) => {
    return new Intl.NumberFormat('es-ES')?.format(value);
  };

  if (funnelData?.length === 0) {
    return (
      <div className={`bg-card border border-border rounded-lg p-6 shadow-card ${className}`}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Embudo de Conversión
          </h3>
          <p className="text-sm text-muted-foreground">
            Análisis del recorrido del usuario - Google Analytics
          </p>
        </div>
        
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <Icon name="Loader2" size={32} className="animate-spin text-primary mb-4 mx-auto" />
            <p className="text-muted-foreground">Cargando datos del embudo...</p>
          </div>
        </div>
      </div>
    );
  }

  const getStepColor = (index) => {
    const colors = [
      'bg-primary',
      'bg-secondary', 
      'bg-success',
      'bg-warning',
      'bg-error'
    ];
    return colors?.[index] || 'bg-muted';
  };

  const getDropoffRate = (current, previous) => {
    if (!previous || previous?.count === 0) return 0;
    const dropoff = ((previous?.count - current?.count) / previous?.count) * 100;
    return dropoff?.toFixed(1);
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 shadow-card ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Embudo de Conversión
          </h3>
          <p className="text-sm text-muted-foreground">
            Análisis del recorrido del usuario desde la visita hasta la compra - Google Analytics
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={16} className="text-primary" />
          <span className="text-xs text-muted-foreground">GA4 Funnel</span>
        </div>
      </div>
      <div className="space-y-4">
        {funnelData?.map((step, index) => {
          const previousStep = funnelData?.[index - 1];
          const dropoffRate = index > 0 ? getDropoffRate(step, previousStep) : 0;
          const maxWidth = funnelData?.[0]?.count || 100;
          const widthPercentage = (step?.count / maxWidth) * 100;

          return (
            <div key={step?.step} className="relative">
              {/* Step Bar */}
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-foreground">{step?.step}</h4>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-bold text-foreground">
                        {formatNumber(step?.count)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {step?.percentage}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-8 relative overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${getStepColor(index)} relative`}
                      style={{ width: `${widthPercentage}%` }}
                    >
                      <div className="absolute inset-0 bg-white/10 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dropoff Indicator */}
              {index > 0 && dropoffRate > 0 && (
                <div className="ml-4 mt-2 flex items-center space-x-2 text-xs text-error">
                  <Icon name="TrendingDown" size={12} />
                  <span>Abandono: {dropoffRate}%</span>
                  <span className="text-muted-foreground">
                    (-{formatNumber(previousStep?.count - step?.count)} usuarios)
                  </span>
                </div>
              )}

              {/* Connection Line */}
              {index < funnelData?.length - 1 && (
                <div className="absolute left-2 -bottom-2 w-px h-4 bg-border" />
              )}
            </div>
          );
        })}
      </div>
      {/* Summary Statistics */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Icon name="Users" size={14} className="text-primary" />
              <span className="text-2xl font-bold text-foreground">
                {formatNumber(funnelData?.[0]?.count || 0)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Sesiones Iniciales</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Icon name="ShoppingCart" size={14} className="text-success" />
              <span className="text-2xl font-bold text-foreground">
                {formatNumber(funnelData?.[funnelData?.length - 1]?.count || 0)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Conversiones</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Icon name="Target" size={14} className="text-warning" />
              <span className="text-2xl font-bold text-foreground">
                {funnelData?.[funnelData?.length - 1]?.percentage || 0}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Tasa de Conversión</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Icon name="TrendingDown" size={14} className="text-error" />
              <span className="text-2xl font-bold text-foreground">
                {funnelData?.length > 1 ? getDropoffRate(funnelData?.[funnelData?.length - 1], funnelData?.[0]) : 0}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Abandono Total</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionFunnel;