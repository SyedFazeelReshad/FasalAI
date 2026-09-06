import { forwardRef } from 'react';
import { AlertTriangle, Shield, ExternalLink } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';
import './PredictionCard.css';

const PredictionCard = forwardRef(({
  crop,
  farm,
  date,
  imageUrl,
  prediction,
  confidence,
  riskLevel,
  allScores,
  onViewAdvisory,
  onSubmitCase,
  onRetake,
  onSaveDraft,
  className = '',
  ...props
}, ref) => {
  const getRiskVariant = () => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'risk-low';
      case 'medium': return 'risk-medium';
      case 'high': return 'risk-high';
      case 'critical': return 'risk-critical';
      default: return 'default';
    }
  };

  const getConfidenceLabel = (conf) => {
    if (conf >= 85) return 'High';
    if (conf >= 70) return 'Medium';
    if (conf >= 50) return 'Low';
    return 'Very Low';
  };

  const confidencePercent = Math.round(confidence * 100);

  return (
    <div ref={ref} className={`prediction-card ${className}`} {...props}>
      <div className="prediction-card__header">
        <div className="prediction-card__meta">
          <div className="prediction-card__crop">
            <span className="prediction-card__crop-label">Crop:</span>
            <span className="prediction-card__crop-value">{crop}</span>
          </div>
          {farm && (
            <div className="prediction-card__farm">
              <span className="prediction-card__farm-label">Farm:</span>
              <span className="prediction-card__farm-value">{farm}</span>
            </div>
          )}
          {date && (
            <div className="prediction-card__date">
              <span className="prediction-card__date-label">Date:</span>
              <span className="prediction-card__date-value">{date}</span>
            </div>
          )}
        </div>
      </div>

      {imageUrl && (
        <div className="prediction-card__image-wrapper">
          <img src={imageUrl} alt={`Crop image for ${crop}`} className="prediction-card__image" />
        </div>
      )}

      <div className="prediction-card__result">
        <div className="prediction-card__label">AI CROP HEALTH ASSESSMENT</div>
        <h2 className="prediction-card__prediction">{prediction}</h2>
        
        <div className="prediction-card__confidence">
          <div className="prediction-card__confidence-row">
            <span className="prediction-card__confidence-label">Confidence:</span>
            <span className="prediction-card__confidence-value">{confidencePercent}%</span>
          </div>
          <div className="prediction-card__confidence-bar">
            <div 
              className="prediction-card__confidence-fill" 
              style={{ width: `${confidencePercent}%` }}
              role="progressbar"
              aria-valuenow={confidencePercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Confidence ${confidencePercent}%`}
            />
          </div>
          <span className="prediction-card__confidence-text">{getConfidenceLabel(confidencePercent)}</span>
        </div>

        <div className="prediction-card__risk">
          <span className="prediction-card__risk-label">Risk Level:</span>
          <Badge variant={getRiskVariant()} size="lg" dot>
            {riskLevel?.toUpperCase() || 'UNKNOWN'}
          </Badge>
        </div>

        {allScores && Object.keys(allScores).length > 1 && (
          <details className="prediction-card__all-scores">
            <summary className="prediction-card__all-scores-toggle">
              View all predictions
            </summary>
            <div className="prediction-card__scores-list">
              {Object.entries(allScores)
                .filter(([_, score]) => score > 0.01)
                .sort(([, a], [, b]) => b - a)
                .map(([key, score]) => (
                  <div key={key} className="prediction-card__score-item">
                    <span className="prediction-card__score-name">{key}</span>
                    <span className="prediction-card__score-value">{Math.round(score * 100)}%</span>
                  </div>
                ))}
            </div>
          </details>
        )}

        <div className="prediction-card__disclaimer">
          <AlertTriangle size={16} aria-hidden="true" />
          <span>AI prediction should be verified by an agricultural expert.</span>
        </div>
      </div>

      <div className="prediction-card__actions">
        <Button variant="outline" onClick={onRetake} size="lg">
          Retake
        </Button>
        <Button variant="ghost" onClick={onSaveDraft} size="lg">
          Save Draft
        </Button>
        <Button variant="primary" onClick={onViewAdvisory} size="lg">
          <Shield size={18} aria-hidden="true" />
          View Advisory
        </Button>
        <Button variant="secondary" onClick={onSubmitCase} size="lg">
          Submit Case
        </Button>
      </div>
    </div>
  );
});

PredictionCard.displayName = 'PredictionCard';

export { PredictionCard };