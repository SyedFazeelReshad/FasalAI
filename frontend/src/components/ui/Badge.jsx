import { forwardRef } from 'react';
import './Badge.css';

const Badge = forwardRef(({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
  ...props
}, ref) => {
  const classNames = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    dot ? 'badge--dot' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <span ref={ref} className={classNames} {...props}>
      {dot && <span className="badge__dot" aria-hidden="true" />}
      <span className="badge__text">{children}</span>
    </span>
  );
});

Badge.displayName = 'Badge';

export { Badge };