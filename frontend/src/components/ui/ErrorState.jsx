import { forwardRef } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import './ErrorState.css';

const ErrorState = forwardRef(({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  onRetry,
  retryLabel = 'Try again',
  icon = <AlertCircle size={48} aria-hidden="true" />,
  className = '',
  ...props
}, ref) => {
  return (
    <div ref={ref} className={`error-state ${className}`} {...props} role="alert">
      <div className="error-state__icon" aria-hidden="true">
        {icon}
      </div>
      <h3 className="error-state__title">{title}</h3>
      {description && <p className="error-state__description">{description}</p>}
      {onRetry && (
        <button
          className="error-state__retry"
          onClick={onRetry}
          type="button"
        >
          <RefreshCw size={16} aria-hidden="true" />
          <span>{retryLabel}</span>
        </button>
      )}
    </div>
  );
});

ErrorState.displayName = 'ErrorState';

export { ErrorState };