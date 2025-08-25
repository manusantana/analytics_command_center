import React from 'react';
import Icon from '../AppIcon';

const Checkbox = ({
  checked = false,
  onChange,
  label,
  description,
  error,
  disabled = false,
  required = false,
  indeterminate = false,
  size = 'default',
  className = '',
  id,
  name,
  value,
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const iconSizes = {
    sm: 12,
    default: 14,
    lg: 16
  };

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={`flex items-start space-x-3 ${className}`}>
      <div className="relative flex items-center">
        <input
          type="checkbox"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className="sr-only"
          {...props}
        />
        <button
          type="button"
          onClick={(e) => {
            e?.preventDefault();
            if (!disabled) {
              const syntheticEvent = {
                target: { checked: !checked, name, value },
                preventDefault: () => {},
                stopPropagation: () => {}
              };
              handleChange(syntheticEvent);
            }
          }}
          disabled={disabled}
          className={`
            ${sizeClasses?.[size]} flex items-center justify-center
            border-2 rounded-md transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
            ${checked || indeterminate
              ? 'bg-primary border-primary text-primary-foreground'
              : 'bg-input border-border hover:border-primary'
            }
            ${error ? 'border-error focus:ring-error' : ''}
          `}
        >
          {indeterminate ? (
            <Icon name="Minus" size={iconSizes?.[size]} className="text-current" />
          ) : checked ? (
            <Icon name="Check" size={iconSizes?.[size]} className="text-current" />
          ) : null}
        </button>
      </div>
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <label
              htmlFor={id}
              className={`
                block text-sm font-medium cursor-pointer
                ${error ? 'text-error' : 'text-foreground'}
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
                ${required ? "after:content-['*'] after:ml-0.5 after:text-error" : ''}
              `}
            >
              {label}
            </label>
          )}
          {description && (
            <p className={`mt-1 text-xs ${error ? 'text-error' : 'text-muted-foreground'}`}>
              {description}
            </p>
          )}
        </div>
      )}
      {error && (
        <div className="flex items-center mt-1">
          <Icon name="AlertCircle" size={12} className="text-error mr-1" />
          <span className="text-xs text-error">{error}</span>
        </div>
      )}
    </div>
  );
};

const CheckboxGroup = ({ 
  label, 
  description, 
  error, 
  required = false, 
  className = '', 
  children 
}) => {
  return (
    <fieldset className={`space-y-3 ${className}`}>
      {label && (
        <legend className={`
          text-sm font-medium
          ${error ? 'text-error' : 'text-foreground'}
          ${required ? "after:content-['*'] after:ml-0.5 after:text-error" : ''}
        `}>
          {label}
        </legend>
      )}
      
      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      
      <div className="space-y-2">
        {children}
      </div>
      
      {error && (
        <p className="text-xs text-error flex items-center">
          <Icon name="AlertCircle" size={12} className="mr-1" />
          {error}
        </p>
      )}
    </fieldset>
  );
};

export { Checkbox, CheckboxGroup };
export default Checkbox;