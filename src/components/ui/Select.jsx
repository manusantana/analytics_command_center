import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = "Seleccionar opción",
  label,
  description,
  error,
  disabled = false,
  required = false,
  loading = false,
  multiple = false,
  searchable = false,
  clearable = false,
  className = "",
  id,
  name
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);

  const filteredOptions = searchable
    ? options?.filter(option =>
        option?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
    : options;

  const selectedOption = multiple
    ? options?.filter(option => value?.includes(option?.value))
    : options?.find(option => option?.value === value);

  const displayValue = multiple
    ? selectedOption?.length > 0
      ? `${selectedOption?.length} seleccionado(s)`
      : placeholder
    : selectedOption?.label || placeholder;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef?.current && !selectRef?.current?.contains(event?.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef?.current) {
      searchInputRef?.current?.focus();
    }
  }, [isOpen, searchable]);

  const handleToggle = () => {
    if (!disabled && !loading) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (option) => {
    if (option?.disabled) return;

    if (multiple) {
      const newValue = value?.includes(option?.value)
        ? value?.filter(v => v !== option?.value)
        : [...(value || []), option?.value];
      onChange(newValue);
    } else {
      onChange(option?.value);
      setIsOpen(false);
    }
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e?.stopPropagation();
    onChange(multiple ? [] : '');
  };

  const hasValue = multiple ? value?.length > 0 : value;

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium mb-2 ${
            error ? 'text-error' : 'text-foreground'
          } ${required ? "after:content-['*'] after:ml-0.5 after:text-error" : ''}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          id={id}
          name={name}
          onClick={handleToggle}
          disabled={disabled || loading}
          className={`
            relative w-full flex items-center justify-between px-3 py-2 text-left
            bg-input border border-border rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring
            disabled:cursor-not-allowed disabled:opacity-50
            ${error ? 'border-error focus:ring-error focus:border-error' : ''}
            ${isOpen ? 'ring-2 ring-ring border-ring' : ''}
          `}
        >
          <span className={`block truncate ${!hasValue ? 'text-muted-foreground' : 'text-foreground'}`}>
            {displayValue}
          </span>
          
          <div className="flex items-center space-x-1">
            {loading && (
              <Icon name="RotateCw" size={16} className="animate-spin text-muted-foreground" />
            )}
            {clearable && hasValue && !loading && (
              <button
                type="button"
                onClick={handleClear}
                className="p-0.5 hover:bg-muted rounded"
              >
                <Icon name="X" size={14} className="text-muted-foreground hover:text-foreground" />
              </button>
            )}
            <Icon
              name="ChevronDown"
              size={16}
              className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
            {searchable && (
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e?.target?.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                  />
                </div>
              </div>
            )}

            <div className="py-1">
              {filteredOptions?.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {searchable && searchTerm ? 'No se encontraron resultados' : 'No hay opciones disponibles'}
                </div>
              ) : (
                filteredOptions?.map((option) => {
                  const isSelected = multiple
                    ? value?.includes(option?.value)
                    : value === option?.value;

                  return (
                    <button
                      key={option?.value}
                      type="button"
                      onClick={() => handleOptionClick(option)}
                      disabled={option?.disabled}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 text-left text-sm
                        hover:bg-muted focus:bg-muted focus:outline-none
                        disabled:cursor-not-allowed disabled:opacity-50
                        ${isSelected ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'}
                      `}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{option?.label}</div>
                        {option?.description && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {option?.description}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <Icon name="Check" size={16} className="text-accent-foreground" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
      {description && !error && (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-error flex items-center">
          <Icon name="AlertCircle" size={12} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;