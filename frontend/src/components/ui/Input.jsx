import { forwardRef, useId } from 'react';
import './Input.css';

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  readOnly = false,
  helperText,
  className = '',
  id: providedId,
  name,
  autoComplete,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  const hasError = Boolean(error);

  return (
    <div className={`input-wrapper ${className} ${hasError ? 'input-wrapper--error' : ''} ${disabled ? 'input-wrapper--disabled' : ''}`}>
      {label && (
        <label htmlFor={id} className="input__label">
          {label}
          {required && <span className="input__required" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
        className="input"
        {...props}
      />
      {hasError && (
        <span id={errorId} className="input__error" role="alert">
          {error}
        </span>
      )}
      {!hasError && helperText && (
        <span id={helperId} className="input__helper">
          {helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };