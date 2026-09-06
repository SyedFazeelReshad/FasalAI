import { forwardRef, useId } from 'react';
import './Select.css';

const Select = forwardRef(({
  label,
  options = [],
  placeholder = 'Select an option',
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  helperText,
  className = '',
  id: providedId,
  name,
  multiple = false,
  searchable = false,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  const hasError = Boolean(error);

  const handleChange = (e) => {
    onChange?.(e);
  };

  return (
    <div className={`select-wrapper ${className} ${hasError ? 'select-wrapper--error' : ''} ${disabled ? 'select-wrapper--disabled' : ''}`}>
      {label && (
        <label htmlFor={id} className="select__label">
          {label}
          {required && <span className="select__required" aria-hidden="true">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        multiple={multiple}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
        className="select"
        {...props}
      >
        {!multiple && placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hasError && (
        <span id={errorId} className="select__error" role="alert">
          {error}
        </span>
      )}
      {!hasError && helperText && (
        <span id={helperId} className="select__helper">
          {helperText}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export { Select };