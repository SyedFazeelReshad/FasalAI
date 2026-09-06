import { forwardRef } from 'react';
import { ChevronRight, Image } from 'lucide-react';
import { Badge } from './Badge';
import './CaseCard.css';

const CaseCard = forwardRef(({
  caseData,
  variant = 'card',
  onClick,
  className = '',
  ...props
}, ref) => {
  const {
    id,
    crop,
    farm,
    prediction,
    confidence,
    riskLevel,
    status,
    date,
    imageUrl
  } = caseData;

  const getRiskVariant = () => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'risk-low';
      case 'medium': return 'risk-medium';
      case 'high': return 'risk-high';
      case 'critical': return 'risk-critical';
      default: return 'default';
    }
  };

  const getStatusVariant = () => {
    switch (status?.toLowerCase()) {
      case 'draft': return 'status-draft';
      case 'submitted': return 'status-submitted';
      case 'under_review': return 'status-under_review';
      case 'verified': return 'status-verified';
      case 'rejected': return 'status-rejected';
      case 'closed': return 'status-closed';
      default: return 'default';
    }
  };

  const confidencePercent = confidence ? Math.round(confidence * 100) : 0;

  if (variant === 'table-row') {
    return (
      <tr className={`case-card case-card--table-row ${className}`} {...props}>
        <td className="case-card__cell">
          <span className="case-card__id">#{id?.slice(-8).toUpperCase()}</span>
        </td>
        <td className="case-card__cell">
          <span className="case-card__crop">{crop}</span>
        </td>
        <td className="case-card__cell">
          <span className="case-card__prediction">{prediction}</span>
        </td>
        <td className="case-card__cell">
          <Badge variant={getRiskVariant()} size="sm" dot>
            {riskLevel?.toUpperCase()}
          </Badge>
        </td>
        <td className="case-card__cell">
          <Badge variant={getStatusVariant()} size="sm">
            {status?.replace('_', ' ')}
          </Badge>
        </td>
        <td className="case-card__cell">
          <span className="case-card__date">{date}</span>
        </td>
        <td className="case-card__cell case-card__cell--actions">
          {onClick && (
            <button
              className="case-card__action-btn"
              onClick={(e) => { e.stopPropagation(); onClick(caseData); }}
              aria-label={`View case ${id}`}
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          )}
        </td>
      </tr>
    );
  }

  return (
    <article
      ref={ref}
      className={`case-card case-card--${variant} ${onClick ? 'case-card--clickable' : ''} ${className}`}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(caseData); }} : undefined}
      {...props}
    >
      {imageUrl && (
        <div className="case-card__image">
          <img src={imageUrl} alt={`Crop image for ${crop}`} loading="lazy" />
          <div className="case-card__image-overlay">
            <Image size={24} aria-hidden="true" />
            <span>View Image</span>
          </div>
        </div>
      )}

      <div className="case-card__content">
        <div className="case-card__header">
          <div className="case-card__id-row">
            <span className="case-card__id">#{id?.slice(-8).toUpperCase()}</span>
            <Badge variant={getStatusVariant()} size="sm">
              {status?.replace('_', ' ')}
            </Badge>
          </div>
          <div className="case-card__meta">
            <span className="case-card__crop">{crop}</span>
            {farm && <span className="case-card__farm">{farm}</span>}
            <span className="case-card__date">{date}</span>
          </div>
        </div>

        <div className="case-card__prediction">
          <span className="case-card__prediction-label">AI Assessment:</span>
          <span className="case-card__prediction-value">{prediction}</span>
        </div>

        <div className="case-card__confidence">
          <div className="case-card__confidence-bar">
            <div 
              className="case-card__confidence-fill"
              style={{ width: `${confidencePercent}%` }}
              role="progressbar"
              aria-valuenow={confidencePercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <span className="case-card__confidence-text">
            Confidence: {confidencePercent}%
          </span>
        </div>

        <div className="case-card__footer">
          <Badge variant={getRiskVariant()} size="sm" dot>
            Risk: {riskLevel?.toUpperCase()}
          </Badge>
          {onClick && (
            <button
              className="case-card__view-btn"
              onClick={(e) => { e.stopPropagation(); onClick(caseData); }}
              aria-label={`View case ${id} details`}
            >
              View Details
              <ChevronRight size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
});

CaseCard.displayName = 'CaseCard';

export { CaseCard };