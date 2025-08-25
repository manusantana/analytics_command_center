import React from 'react';
import Icon from '../../../components/AppIcon';

const TopProductsTable = ({ data = [], className = '' }) => {
  // Use real data from Shopify if available
  const products = data?.length > 0 ? data : [];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })?.format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('es-ES')?.format(value);
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <Icon name="TrendingUp" size={16} className="text-success" />;
      case 'down':
        return <Icon name="TrendingDown" size={16} className="text-error" />;
      default:
        return <Icon name="Minus" size={16} className="text-muted-foreground" />;
    }
  };

  if (products?.length === 0) {
    return (
      <div className={`bg-card border border-border rounded-lg p-6 shadow-card ${className}`}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Productos Más Vendidos
          </h3>
          <p className="text-sm text-muted-foreground">
            Top productos por ingresos - Datos de Shopify
          </p>
        </div>
        
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <Icon name="Loader2" size={32} className="animate-spin text-primary mb-4 mx-auto" />
            <p className="text-muted-foreground">Cargando datos de Shopify...</p>
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
            Productos Más Vendidos
          </h3>
          <p className="text-sm text-muted-foreground">
            Top productos por ingresos - Datos de Shopify en tiempo real
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon name="ShoppingBag" size={16} className="text-primary" />
          <span className="text-xs text-muted-foreground">Shopify</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Producto</th>
              <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Ingresos</th>
              <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Pedidos</th>
              <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Precio Prom.</th>
              <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Tendencia</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product, index) => (
              <tr key={product?.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-4 px-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{product?.name}</p>
                      <p className="text-xs text-muted-foreground">{product?.category}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-2 text-right">
                  <p className="font-semibold text-foreground">{formatCurrency(product?.revenue)}</p>
                </td>
                <td className="py-4 px-2 text-right">
                  <p className="text-foreground">{formatNumber(product?.orders)}</p>
                </td>
                <td className="py-4 px-2 text-right">
                  <p className="text-foreground">{formatCurrency(product?.averagePrice)}</p>
                </td>
                <td className="py-4 px-2 text-center">
                  {getTrendIcon(product?.trend)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(products?.reduce((sum, p) => sum + p?.revenue, 0))}
            </p>
            <p className="text-xs text-muted-foreground">Ingresos Totales</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {formatNumber(products?.reduce((sum, p) => sum + p?.orders, 0))}
            </p>
            <p className="text-xs text-muted-foreground">Pedidos Totales</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(products?.reduce((sum, p, _, arr) => sum + p?.averagePrice, 0) / products?.length || 0)}
            </p>
            <p className="text-xs text-muted-foreground">Precio Promedio</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopProductsTable;