import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const RevenueChart = ({ data = [], className = '' }) => {
  // Use real data from Google Analytics if available, otherwise show loading state
  const chartData = data?.length > 0 ? data : [];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('es-ES')?.format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-modal">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-muted-foreground">{entry?.name}:</span>
              <span className="font-medium text-popover-foreground">
                {entry?.dataKey === 'revenue' ? formatCurrency(entry?.value) : formatNumber(entry?.value)}
              </span>
            </div>
          ))}
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
            Tendencia de Ingresos y Usuarios
          </h3>
          <p className="text-sm text-muted-foreground">
            Datos de Google Analytics - Evolución mensual
          </p>
        </div>
        
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <Icon name="Loader2" size={32} className="animate-spin text-primary mb-4 mx-auto" />
            <p className="text-muted-foreground">Cargando datos de Google Analytics...</p>
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
            Tendencia de Ingresos y Usuarios
          </h3>
          <p className="text-sm text-muted-foreground">
            Datos de Google Analytics - Evolución mensual con correlación de usuarios y pedidos
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground">Datos en vivo</span>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              yAxisId="left"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={formatNumber}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar 
              yAxisId="left"
              dataKey="revenue" 
              name="Ingresos (€)"
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
              opacity={0.8}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="users" 
              name="Usuarios Totales"
              stroke="var(--color-secondary)"
              strokeWidth={3}
              dot={{ fill: 'var(--color-secondary)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-secondary)', strokeWidth: 2 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="orders" 
              name="Pedidos"
              stroke="var(--color-success)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: 'var(--color-success)', strokeWidth: 2 }}
            />
            {chartData?.[0]?.conversionRate && (
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="conversionRate" 
                name="Tasa de Conversión (%)"
                stroke="var(--color-warning)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-warning)', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: 'var(--color-warning)', strokeWidth: 2 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;