import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import DateRangeSelector from './DateRangeSelector';
import PerformanceAlertIndicator from './PerformanceAlertIndicator';
import ExportController from './ExportController';
import DataRefreshStatus from './DataRefreshStatus';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

  const navigationItems = [
    {
      label: 'Resumen Ejecutivo',
      path: '/executive-overview-dashboard',
      icon: 'BarChart3',
      tooltip: 'Panel principal con KPIs estratégicos y métricas de rendimiento'
    }
  ];

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-100 bg-card border-b border-border shadow-card">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to="/executive-overview-dashboard" className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Icon name="TrendingUp" size={20} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">Analytics Command Center</h1>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                isActivePath(item?.path)
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title={item?.tooltip}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </Link>
          ))}
        </nav>

        {/* Header Controls */}
        <div className="flex items-center space-x-4">
          {/* Date Range Selector */}
          <div className="hidden lg:block">
            <DateRangeSelector onDateRangeChange={handleDateRangeChange} />
          </div>

          {/* Performance Alert Indicator */}
          <PerformanceAlertIndicator />

          {/* Export Controller */}
          <div className="hidden md:block">
            <ExportController />
          </div>

          {/* Data Refresh Status */}
          <DataRefreshStatus />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Abrir menú de navegación"
          >
            <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
          </Button>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="px-4 py-4 space-y-2">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-smooth ${
                  isActivePath(item?.path)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
              </Link>
            ))}
            
            {/* Mobile Date Range Selector */}
            <div className="pt-4 border-t border-border">
              <DateRangeSelector onDateRangeChange={handleDateRangeChange} />
            </div>
            
            {/* Mobile Export Controller */}
            <div className="pt-2">
              <ExportController />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;