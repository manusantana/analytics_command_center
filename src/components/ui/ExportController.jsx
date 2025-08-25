import React, { useState } from 'react';
import Button from './Button';

import Icon from '../AppIcon';

const ExportController = ({ className = '' }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const exportOptions = [
    { value: 'pdf', label: 'PDF Report', description: 'Informe ejecutivo completo' },
    { value: 'excel', label: 'Excel Spreadsheet', description: 'Datos detallados para análisis' },
    { value: 'csv', label: 'CSV Data', description: 'Datos en formato CSV' },
    { value: 'png', label: 'PNG Image', description: 'Captura visual del dashboard' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setIsDropdownOpen(false);

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real application, this would trigger the actual export
      console.log(`Exporting dashboard as ${exportFormat}`);
      
      // Show success notification (in real app, use toast/notification system)
      alert(`Dashboard exportado exitosamente como ${exportFormat?.toUpperCase()}`);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Error al exportar el dashboard. Por favor, inténtelo de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  const getExportIcon = (format) => {
    switch (format) {
      case 'pdf':
        return 'FileText';
      case 'excel':
        return 'FileSpreadsheet';
      case 'csv':
        return 'Database';
      case 'png':
        return 'Image';
      default:
        return 'Download';
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center space-x-2">
        {/* Quick Export Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          loading={isExporting}
          iconName={getExportIcon(exportFormat)}
          iconPosition="left"
          disabled={isExporting}
        >
          {isExporting ? 'Exportando...' : 'Exportar'}
        </Button>

        {/* Format Selector Dropdown */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleDropdown}
          iconName="ChevronDown"
          iconPosition="right"
          className="px-2"
          aria-label="Seleccionar formato de exportación"
        >
          {exportFormat?.toUpperCase()}
        </Button>
      </div>
      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-modal z-200">
          <div className="p-2">
            <div className="mb-2 px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border">
              Formato de Exportación
            </div>
            {exportOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => {
                  setExportFormat(option?.value);
                  setIsDropdownOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-smooth hover:bg-muted ${
                  exportFormat === option?.value ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'
                }`}
              >
                <Icon name={getExportIcon(option?.value)} size={16} />
                <div className="flex-1 text-left">
                  <div className="font-medium">{option?.label}</div>
                  <div className="text-xs text-muted-foreground">{option?.description}</div>
                </div>
                {exportFormat === option?.value && (
                  <Icon name="Check" size={14} className="text-accent-foreground" />
                )}
              </button>
            ))}
          </div>
          
          <div className="border-t border-border p-2">
            <div className="text-xs text-muted-foreground px-3 py-1">
              Los informes incluyen datos del período seleccionado
            </div>
          </div>
        </div>
      )}
      {/* Overlay to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-100"
          onClick={toggleDropdown}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default ExportController;