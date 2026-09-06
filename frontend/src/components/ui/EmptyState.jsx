import { forwardRef } from 'react';
import './EmptyState.css';

const EmptyState = forwardRef(({
  icon,
  title = 'No data available',
  description = 'Get started by creating your first item.',
  action,
  className = '',
  ...props
}, ref) => {
  return (
    <div ref={ref} className={`empty-state ${className}`} {...props}>
      <div className="empty-state__icon" aria-hidden="true">
        {icon}
      </div>
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__description">{description}</p>}
      {action && (
        <div className="empty-state__action">
          {action}
        </div>
      )}
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

export { EmptyState };