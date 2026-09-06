import { useImperativeHandle } from 'react';
import './Card.css';

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  selected = false,
  className = '',
  onClick,
  ...props
}) => {
  const classNames = [
    'card',
    `card--${variant}`,
    `card--padding-${padding}`,
    hover ? 'card--hover' : '',
    selected ? 'card--selected' : '',
    onClick ? 'card--clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classNames}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }} : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

Card.displayName = 'Card';

export { Card };

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`card__header ${className}`} {...props}>{children}</div>
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`card__title ${className}`} {...props}>{children}</h3>
);

export const CardSubtitle = ({ children, className = '', ...props }) => (
  <p className={`card__subtitle ${className}`} {...props}>{children}</p>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`card__content ${className}`} {...props}>{children}</div>
);

CardContent.displayName = 'CardContent';

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`card__footer ${className}`} {...props}>{children}</div>
);

CardFooter.displayName = 'CardFooter';