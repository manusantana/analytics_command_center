import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useGoogleAnalytics, trackButtonClick, trackDataRefresh } from '../../hooks/useGoogleAnalytics';
import GoogleAnalyticsService from '../../services/googleAnalyticsService';
import ShopifyService from '../../services/shopifyService';
import Header from '../../components/ui/Header';
import DateRangeSelector from '../../components/ui/DateRangeSelector';
import KPICard from './components/KPICard';
import RevenueChart from './components/RevenueChart';
import TrafficSourceChart from './components/TrafficSourceChart';
import TopProductsTable from './components/TopProductsTable';
import ConversionFunnel from './components/ConversionFunnel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ExecutiveOverviewDashboard = () => {
  // Initialize Google Analytics tracking
  useGoogleAnalytics();

  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  });
  // 👇 añadimos esto, no sustituimos lo de arriba
  const stableRange = useMemo(() => ({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  }), [dateRange.startDate, dateRange.endDate]);

  const [isComparisonEnabled, setIsComparisonEnabled] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Real data state
  const [kpiData, setKpiData] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [conversionData, setConversionData] = useState([]);
  const [realtimeMetrics, setRealtimeMetrics] = useState({});

  // Services
  const gaService = new GoogleAnalyticsService();
  const shopifyService = new ShopifyService();

  // Load initial data
  useEffect(() => {
    loadDashboardData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      if (!isRefreshing) {
        loadDashboardData(false);
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dateRange]);

  const loadDashboardData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setIsRefreshing(true);

    try {
      // Track data refresh event
      trackDataRefresh('dashboard_load');

      // Fetch data from both Google Analytics and Shopify
      const [
        kpiMetrics,
        revenueMetrics,
        trafficSources,
        products,
        funnelData,
        realtime
      ] = await Promise.all([
        gaService?.getKPIMetrics(dateRange),
        gaService?.getRevenueData(dateRange),
        gaService?.getTrafficSources(dateRange),
        shopifyService?.getTopProducts(),
        gaService?.getConversionFunnelData(),
        gaService?.getRealtimeMetrics()
      ]);

      setKpiData(kpiMetrics);
      setRevenueData(revenueMetrics);
      setTrafficData(trafficSources);
      setTopProducts(products);
      setConversionData(funnelData);
      setRealtimeMetrics(realtime);
      setLastRefresh(new Date());

      trackDataRefresh('dashboard_load', true);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      trackDataRefresh('dashboard_load', false);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };
  const sameRange = (a, b) => {
    if (!a || !b) return false;
    const s1 = new Date(a.startDate).getTime();
    const e1 = new Date(a.endDate).getTime();
    const s2 = new Date(b.startDate).getTime();
    const e2 = new Date(b.endDate).getTime();
    return s1 === s2 && e1 === e2;
  };

  const handleDateRangeChange = (newRange) => {
    if (sameRange(dateRange, newRange)) return; // ← evita setState redundante
    setDateRange({
      startDate: new Date(newRange.startDate),
      endDate: new Date(newRange.endDate)
    });
    trackButtonClick('date_range_change');
  };

  const handleRefresh = async () => {
    trackButtonClick('manual_refresh');
    await loadDashboardData();
  };

  const handleExport = () => {
    trackButtonClick('export_report');
    // Implement export functionality
    console.log('Exporting dashboard report...');
  };

  const handleSettings = () => {
    trackButtonClick('settings');
    // Implement settings functionality
    console.log('Opening settings...');
  };

  const formatLastRefresh = (date) => {
    return date?.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const num = (x) => {
    const n = typeof x === "number" ? x : parseFloat(String(x ?? "").replace(/[, %]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-primary mb-4 mx-auto" />
          <p className="text-muted-foreground">Cargando datos del dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Resumen Ejecutivo - Analytics Command Center</title>
        <meta name="description" content="Panel de control ejecutivo con KPIs estratégicos y métricas de rendimiento para e-commerce integrado con Google Analytics y Shopify" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-6 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Resumen Ejecutivo
              </h1>
              <p className="text-muted-foreground">
                Panel estratégico con datos en tiempo real de Google Analytics y Shopify
              </p>
              {realtimeMetrics?.activeUsers && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-muted-foreground">
                    {realtimeMetrics?.activeUsers} usuarios activos ahora
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Date Range Selector */}
              <DateRangeSelector
                value={stableRange}
                onDateRangeChange={handleDateRangeChange}
                className="w-full sm:w-auto"
              />

              {/* Comparison Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="comparison"
                  checked={isComparisonEnabled}
                  onChange={(e) => setIsComparisonEnabled(e?.target?.checked)}
                  className="rounded border-border"
                />
                <label htmlFor="comparison" className="text-sm text-muted-foreground">
                  Comparar períodos
                </label>
              </div>

              {/* Auto-refresh Links */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    trackButtonClick('ga_refresh');
                    gaService?.getKPIMetrics(dateRange)?.then(data => setKpiData(data));
                  }}
                  className="text-xs text-primary hover:text-primary/80 underline"
                  disabled={isRefreshing}
                >
                  Actualizar GA
                </button>
                <span className="text-xs text-muted-foreground">•</span>
                <button
                  onClick={() => {
                    trackButtonClick('shopify_refresh');
                    shopifyService?.getTopProducts()?.then(data => setTopProducts(data));
                  }}
                  className="text-xs text-primary hover:text-primary/80 underline"
                  disabled={isRefreshing}
                >
                  Actualizar Shopify
                </button>
              </div>

              {/* Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                loading={isRefreshing}
                iconName="RefreshCw"
                iconPosition="left"
                className="w-full sm:w-auto"
              >
                {isRefreshing ? 'Actualizando...' : 'Actualizar Todo'}
              </Button>
            </div>
          </div>

          {/* Last Refresh Info */}
          <div className="mt-4 flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Clock" size={12} />
            <span>Última actualización: {formatLastRefresh(lastRefresh)}</span>
            <span>•</span>
            <span>Datos de Google Analytics y Shopify</span>
            <span>•</span>
            <span>Actualización automática cada 5 minutos</span>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Ingresos Totales"
            value={num(kpiData?.totalRevenue?.current)}
            previousValue={num(kpiData?.totalRevenue?.previous)}
            target={num(kpiData?.totalRevenue?.target)}
            format="currency"
            sparklineData={kpiData?.totalRevenue?.sparkline || []}
          />

          <KPICard
            title="Tasa de Conversión"
            value={num(kpiData?.conversionRate?.current)}
            previousValue={num(kpiData?.conversionRate?.previous)}
            target={num(kpiData?.conversionRate?.target)}
            format="percentage"
            sparklineData={kpiData?.conversionRate?.sparkline || []}
          />

          <KPICard
            title="Usuarios Totales"
            value={num(kpiData?.totalUsers?.current)}
            previousValue={num(kpiData?.totalUsers?.previous)}
            target={num(kpiData?.totalUsers?.target)}
            format="number"
            sparklineData={kpiData?.totalUsers?.sparkline || []}
          />

          <KPICard
            title="ROAS"
            value={num(kpiData?.roas?.current)}
            previousValue={num(kpiData?.roas?.previous)}
            target={num(kpiData?.roas?.target)}
            format="decimal"
            unit="x"
            sparklineData={kpiData?.roas?.sparkline || []}
          />

        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart - Takes 2 columns on xl screens */}
          <div className="xl:col-span-2">
            <RevenueChart data={revenueData} />
          </div>

          {/* Traffic Sources - Takes 1 column */}
          <div className="xl:col-span-1">
            <TrafficSourceChart data={trafficData} />
          </div>
        </div>

        {/* Secondary Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Top Products Table - Takes 2 columns on xl screens */}
          <div className="xl:col-span-2">
            <TopProductsTable data={topProducts} />
          </div>

          {/* Performance Summary Card */}
          <div className="xl:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 shadow-card h-fit">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Resumen en Tiempo Real
                </h3>
                <button
                  onClick={() => {
                    trackButtonClick('realtime_refresh');
                    gaService?.getRealtimeMetrics()?.then(data => setRealtimeMetrics(data));
                  }}
                  className="text-primary hover:text-primary/80"
                  disabled={isRefreshing}
                >
                  <Icon name="RefreshCw" size={14} className={isRefreshing ? 'animate-spin' : ''} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="Users" size={16} className="text-success" />
                    <span className="text-sm font-medium text-foreground">Usuarios Activos</span>
                  </div>
                  <span className="text-sm font-bold text-success">{realtimeMetrics?.activeUsers || 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="Eye" size={16} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">Páginas Vistas</span>
                  </div>
                  <span className="text-sm font-bold text-primary">{realtimeMetrics?.pageViews || 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="Activity" size={16} className="text-warning" />
                    <span className="text-sm font-medium text-foreground">Tasa de Rebote</span>
                  </div>
                  <span className="text-sm font-bold text-warning">{realtimeMetrics?.bounceRate || 0}%</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-info/10 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={16} className="text-info" />
                    <span className="text-sm font-medium text-foreground">Duración Promedio</span>
                  </div>
                  <span className="text-sm font-bold text-info">
                    {realtimeMetrics?.sessionDuration ? `${Math.floor(realtimeMetrics?.sessionDuration / 60)}m` : '0m'}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-muted-foreground">
                    Datos en tiempo real de Google Analytics
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Funnel - Full Width */}
        <div className="mb-8">
          <ConversionFunnel data={conversionData} />
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 pt-8 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Integración con Google Analytics 4 y Shopify • Datos actualizados automáticamente
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={handleExport}
            >
              Exportar Informe
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Settings"
              iconPosition="left"
              onClick={handleSettings}
            >
              Configurar Alertas
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExecutiveOverviewDashboard;