import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const TrafficSourceChart = ({ data = [], className = '' }) => {
  // Use real data from Google Analytics if available
  const chartData = data?.length > 0 ? data : [];

  const COLORS = [
    'var(--color-primary)',
    'var(--color-secondary)', 
    'var(--color-success)',
    'var(--color-warning)',
    'var(--color-error)',
    'var(--color-info)'
  ];

  const formatNumber = (value) => {
    return new Intl.NumberFormat('es-ES')?.format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-modal">
          <p className="font-medium text-popover-foreground mb-2">{data?.source}</p>
          <div className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Sesiones:</span>
              <span className="font-medium text-popover-foreground">{formatNumber(data?.sessions)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Porcentaje:</span>
              <span className="font-medium text-popover-foreground">{data?.percentage}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (chartData?.length === 0) {
    return (
      <div className={`bg-card border border-border rounded-lg p-6 shadow-card ${className}`}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Fuentes de Tráfico
          </h3>
          <p className="text-sm text-muted-foreground">
            Distribución del tráfico por canal - Google Analytics
          </p>
        </div>
        
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <Icon name="Loader2" size={32} className="animate-spin text-primary mb-4 mx-auto" />
            <p className="text-muted-foreground">Cargando fuentes de tráfico...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-lg p-6 shadow-card ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Fuentes de Tráfico
          </h3>
          <p className="text-sm text-muted-foreground">
            Distribución del tráfico por canal - Google Analytics
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground">En vivo</span>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={40}
              paddingAngle={2}
              dataKey="sessions"
              label={({ source, percentage }) => `${source}: ${percentage}%`}
              labelLine={false}
            >
              {chartData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Traffic Sources Summary */}
      <div className="mt-6 space-y-3">
        {chartData?.slice(0, 4)?.map((source, index) => (
          <div key={source?.source} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
              />
              <div>
                <p className="text-sm font-medium text-foreground">{source?.source}</p>
                <p className="text-xs text-muted-foreground">{formatNumber(source?.sessions)} sesiones</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-foreground">{source?.percentage}%</p>
              <p className="text-xs text-muted-foreground">del total</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrafficSourceChart;