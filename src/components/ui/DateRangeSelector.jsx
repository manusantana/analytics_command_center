import React, { useState, useEffect } from 'react';
import Select from './Select';
import Input from './Input';
import Button from './Button';
import Icon from '../AppIcon';

const DateRangeSelector = ({ onDateRangeChange, className = '' }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('last_30_days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isCustomRange, setIsCustomRange] = useState(false);

  const periodOptions = [
    { value: 'today', label: 'Hoy' },
    { value: 'yesterday', label: 'Ayer' },
    { value: 'last_7_days', label: 'Últimos 7 días' },
    { value: 'last_30_days', label: 'Últimos 30 días' },
    { value: 'last_90_days', label: 'Últimos 90 días' },
    { value: 'this_month', label: 'Este mes' },
    { value: 'last_month', label: 'Mes anterior' },
    { value: 'this_quarter', label: 'Este trimestre' },
    { value: 'last_quarter', label: 'Trimestre anterior' },
    { value: 'this_year', label: 'Este año' },
    { value: 'last_year', label: 'Año anterior' },
    { value: 'custom', label: 'Rango personalizado' }
  ];

  const getDateRange = (period) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday?.setDate(yesterday?.getDate() - 1);

    switch (period) {
      case 'today':
        return { startDate: today, endDate: today };
      case 'yesterday':
        return { startDate: yesterday, endDate: yesterday };
      case 'last_7_days':
        const last7Days = new Date(today);
        last7Days?.setDate(last7Days?.getDate() - 7);
        return { startDate: last7Days, endDate: today };
      case 'last_30_days':
        const last30Days = new Date(today);
        last30Days?.setDate(last30Days?.getDate() - 30);
        return { startDate: last30Days, endDate: today };
      case 'last_90_days':
        const last90Days = new Date(today);
        last90Days?.setDate(last90Days?.getDate() - 90);
        return { startDate: last90Days, endDate: today };
      case 'this_month':
        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        return { startDate: thisMonthStart, endDate: today };
      case 'last_month':
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        return { startDate: lastMonthStart, endDate: lastMonthEnd };
      case 'this_quarter':
        const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
        return { startDate: quarterStart, endDate: today };
      case 'last_quarter':
        const lastQuarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3 - 3, 1);
        const lastQuarterEnd = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 0);
        return { startDate: lastQuarterStart, endDate: lastQuarterEnd };
      case 'this_year':
        const yearStart = new Date(today.getFullYear(), 0, 1);
        return { startDate: yearStart, endDate: today };
      case 'last_year':
        const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
        const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);
        return { startDate: lastYearStart, endDate: lastYearEnd };
      default:
        return { startDate: last30Days, endDate: today };
    }
  };

  const formatDateForInput = (date) => {
    return date?.toISOString()?.split('T')?.[0];
  };

  const handlePeriodChange = (value) => {
    setSelectedPeriod(value);
    setIsCustomRange(value === 'custom');
    
    if (value !== 'custom') {
      const dateRange = getDateRange(value);
      onDateRangeChange?.(dateRange);
    }
  };

  const handleCustomDateChange = () => {
    if (customStartDate && customEndDate) {
      const startDate = new Date(customStartDate);
      const endDate = new Date(customEndDate);
      
      if (startDate <= endDate) {
        onDateRangeChange?.({ startDate, endDate });
      }
    }
  };

  const applyCustomRange = () => {
    handleCustomDateChange();
  };

  useEffect(() => {
    if (selectedPeriod !== 'custom') {
      const dateRange = getDateRange(selectedPeriod);
      onDateRangeChange?.(dateRange);
    }
  }, [selectedPeriod, onDateRangeChange]);

  useEffect(() => {
    if (isCustomRange && customStartDate && customEndDate) {
      const timeoutId = setTimeout(handleCustomDateChange, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [customStartDate, customEndDate, isCustomRange]);

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <Icon name="Calendar" size={16} className="text-muted-foreground" />
        <Select
          options={periodOptions}
          value={selectedPeriod}
          onChange={handlePeriodChange}
          placeholder="Seleccionar período"
          className="min-w-[180px]"
          label="Período"
          description=""
          error=""
          id="date-period-select"
          name="datePeriod"
        />
      </div>
      {isCustomRange && (
        <div className="flex items-center space-x-2">
          <Input
            type="date"
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e?.target?.value)}
            className="w-auto"
            placeholder="Fecha inicio"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="date"
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e?.target?.value)}
            className="w-auto"
            placeholder="Fecha fin"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={applyCustomRange}
            disabled={!customStartDate || !customEndDate}
          >
            Aplicar
          </Button>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;