import './LoadingState.css';

export const Spinner = ({ size = 'md', className = '', 'aria-label': ariaLabel = 'Loading' }) => {
  const sizeClasses = {
    sm: 'spinner--sm',
    md: 'spinner--md',
    lg: 'spinner--lg'
  };

  return (
    <span
      className={`spinner ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label={ariaLabel}
      aria-busy="true"
    >
      <span className="sr-only">{ariaLabel}</span>
    </span>
  );
};

export const Skeleton = ({ variant = 'text', width = '100%', height, className = '' }) => {
  const classNames = [
    'skeleton',
    `skeleton--${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classNames}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
};

export const LoadingState = ({ variant = 'full', message = 'Loading...', className = '' }) => {
  const classNames = [
    'loading-state',
    `loading-state--${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} role="status" aria-label={message}>
      <Spinner size="lg" />
      {message && <p className="loading-state__message">{message}</p>}
    </div>
  );
};

export const PageLoading = ({ message = 'Loading page...' }) => (
  <div className="page-loading" role="status" aria-label={message}>
    <Spinner size="lg" />
    <p>{message}</p>
  </div>
);

export const InlineLoading = ({ message = 'Loading...' }) => (
  <div className="inline-loading" role="status" aria-label={message}>
    <Spinner size="sm" />
    <span>{message}</span>
  </div>
);