import { forwardRef } from 'react';
import { AlertTriangle, CheckCircle, Eye, Shield, FileText } from 'lucide-react';
import './AdvisoryCard.css';

const AdvisoryCard = forwardRef(({
  title = 'Advisory',
  crop,
  disease,
  immediateActions = [],
  monitoring = [],
  expertConsultation = [],
  inputGuidance = [],
  preventiveMeasures = [],
  className = '',
  ...props
}, ref) => {
  const sections = [
    {
      key: 'immediate',
      label: 'IMMEDIATE ACTIONS',
      icon: <AlertTriangle size={20} aria-hidden="true" />,
      color: 'error',
      items: immediateActions
    },
    {
      key: 'monitoring',
      label: 'MONITORING',
      icon: <Eye size={20} aria-hidden="true" />,
      color: 'warning',
      items: monitoring
    },
    {
      key: 'expert',
      label: 'EXPERT CONSULTATION',
      icon: <Shield size={20} aria-hidden="true" />,
      color: 'info',
      items: expertConsultation
    },
    {
      key: 'input',
      label: 'INPUT GUIDANCE',
      icon: <FileText size={20} aria-hidden="true" />,
      color: 'success',
      items: inputGuidance
    },
    {
      key: 'preventive',
      label: 'PREVENTIVE MEASURES',
      icon: <CheckCircle size={20} aria-hidden="true" />,
      color: 'primary',
      items: preventiveMeasures
    }
  ].filter(section => section.items.length > 0);

  const getIconColor = (color) => {
    switch (color) {
      case 'error': return 'var(--color-error)';
      case 'warning': return 'var(--color-warning)';
      case 'info': return 'var(--color-info)';
      case 'success': return 'var(--color-success)';
      case 'primary': return 'var(--color-primary)';
      default: return 'var(--color-text-secondary)';
    }
  };

  const getBgColor = (color) => {
    switch (color) {
      case 'error': return 'var(--color-error-light)';
      case 'warning': return 'var(--color-warning-light)';
      case 'info': return 'var(--color-info-light)';
      case 'success': return 'var(--color-success-light)';
      case 'primary': return 'var(--color-primary-light)';
      default: return 'var(--color-background)';
    }
  };

  return (
    <div ref={ref} className={`advisory-card ${className}`} {...props}>
      <div className="advisory-card__header">
        <h2 className="advisory-card__title">{title}</h2>
        {(crop || disease) && (
          <p className="advisory-card__subtitle">
            {disease && <span className="advisory-card__disease">{disease}</span>}
            {crop && disease && <span className="advisory-card__separator">•</span>}
            {crop && <span className="advisory-card__crop">({crop})</span>}
          </p>
        )}
      </div>

      <div className="advisory-card__sections">
        {sections.map((section) => (
          <section key={section.key} className="advisory-card__section">
            <div 
              className="advisory-card__section-header"
              style={{ 
                borderLeftColor: getIconColor(section.color),
                backgroundColor: getBgColor(section.color)
              }}
            >
              <div className="advisory-card__section-icon" style={{ color: getIconColor(section.color) }}>
                {section.icon}
              </div>
              <h3 className="advisory-card__section-title">{section.label}</h3>
            </div>
            <ul className="advisory-card__items">
              {section.items.map((item, index) => (
                <li key={index} className="advisory-card__item">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {sections.length === 0 && (
        <div className="advisory-card__empty">
          <p>No advisory information available for this condition.</p>
        </div>
      )}
    </div>
  );
});

AdvisoryCard.displayName = 'AdvisoryCard';

export { AdvisoryCard };