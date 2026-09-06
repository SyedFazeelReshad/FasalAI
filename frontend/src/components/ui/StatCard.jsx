import { forwardRef } from 'react';
import './StatCard.css';

const StatCard = forwardRef(({
  title,
  value,
  change,
  changeLabel,
  icon,
  trend = 'neutral',
  className = '',
  ...props
}, ref) => {
  return (
    <div ref={ref} className={`stat-card ${className}`} {...props}>
      <div className="stat-card__content">
        <div className="stat-card__header">
          <span className="stat-card__title">{title}</span>
          {icon && <div className="stat-card__icon">{icon}</div>}
        </div>
        <div className="stat-card__value">{value}</div>
        {change !== undefined && (
          <div className={`stat-card__change stat-card__change--${trend}`}>
            <span className="stat-card__change-value">
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
              {Math.abs(change)}%
            </span>
            {changeLabel && <span className="stat-card__change-label">{changeLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
});

StatCard.displayName = 'StatCard';

export { StatCard };