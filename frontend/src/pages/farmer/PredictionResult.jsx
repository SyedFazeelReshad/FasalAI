import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, AlertTriangle, Download, Share2, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { PredictionCard } from '../../components/ui/PredictionCard';
import { mockCases, mockPredictions, mockDiseases, mockCrops, mockFarms, mockAdvisories } from '../../data/mockData';
import './PredictionResult.css';

const PredictionResult = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [advisory, setAdvisory] = useState(null);
  const [showAdvisory, setShowAdvisory] = useState(false);

  useEffect(() => {
    const foundCase = mockCases.find(c => c.id === caseId);
    if (foundCase) {
      setCaseData(foundCase);
      const foundPrediction = mockPredictions.find(p => p.caseId === caseId);
      if (foundPrediction) {
        setPrediction(foundPrediction);
        const diseaseKey = foundPrediction.diseaseId;
        setAdvisory(mockAdvisories[diseaseKey] || null);
      }
    }
  }, [caseId]);

  if (!caseData) {
    return (
      <div className="prediction-result__not-found">
        <AlertTriangle size={48} aria-hidden="true" />
        <h2>Case Not Found</h2>
        <p>The requested case could not be found.</p>
        <Link to="/farmer/dashboard">
          <Button variant="primary">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const crop = mockCrops.find(c => c.id === caseData.cropId);
  const farm = mockFarms.find(f => f.id === caseData.farmId);
  const disease = mockDiseases.find(d => d.id === prediction?.diseaseId);
  const confidencePercent = prediction ? Math.round(prediction.confidence * 100) : 0;

  const getRiskVariant = () => {
    switch (prediction?.riskLevel?.toLowerCase()) {
      case 'low': return 'risk-low';
      case 'medium': return 'risk-medium';
      case 'high': return 'risk-high';
      case 'critical': return 'risk-critical';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmitCase = () => {
    // In real app, this would call API to submit case
    alert('Case submitted for extension worker review!');
  };

  const handleRetake = () => {
    navigate('/farmer/detect');
  };

  const handleSaveDraft = () => {
    alert('Draft saved locally');
  };

  return (
    <div className="prediction-result">
      {/* Header */}
      <header className="prediction-result__header">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="prediction-result__back-btn">
          <ArrowLeft size={18} aria-hidden="true" />
          <span>Back</span>
        </Button>
        <div className="prediction-result__header-info">
          <h1 className="prediction-result__title">AI Crop Health Assessment</h1>
          <p className="prediction-result__subtitle">Case ID: {caseData.id}</p>
        </div>
        <div className="prediction-result__header-actions">
          <Button variant="outline" size="sm">
            <Download size={16} aria-hidden="true" />
            Export
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 size={16} aria-hidden="true" />
            Share
          </Button>
        </div>
      </header>

      {showAdvisory && advisory ? (
        <AdvisoryView 
          advisory={advisory} 
          crop={crop?.name} 
          disease={disease?.name}
          onClose={() => setShowAdvisory(false)}
        />
      ) : (
        <>
          {/* Prediction Card */}
          <PredictionCard
            crop={crop?.name}
            farm={farm?.name}
            date={formatDate(caseData.capturedAt)}
            imageUrl={caseData.images?.[0]?.url}
            prediction={disease?.name}
            confidence={prediction?.confidence}
            riskLevel={prediction?.riskLevel}
            allScores={prediction?.allScores}
            onViewAdvisory={() => setShowAdvisory(true)}
            onSubmitCase={handleSubmitCase}
            onRetake={handleRetake}
            onSaveDraft={handleSaveDraft}
          />

          {/* Quick Info Cards */}
          <section className="prediction-result__info-cards" aria-labelledby="info-heading">
            <h2 id="info-heading" className="sr-only">Case Information</h2>
            <div className="prediction-result__info-grid">
              <Card variant="default">
                <CardContent>
                  <div className="info-card">
                    <div className="info-card__icon">
                      <FileText size={24} aria-hidden="true" />
                    </div>
                    <div className="info-card__content">
                      <span className="info-card__label">Case Status</span>
                      <Badge variant={getStatusVariant(caseData.status)} size="md">
                        {caseData.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card variant="default">
                <CardContent>
                  <div className="info-card">
                    <div className="info-card__icon">
                      <AlertTriangle size={24} aria-hidden="true" />
                    </div>
                    <div className="info-card__content">
                      <span className="info-card__label">Risk Level</span>
                      <Badge variant={getRiskVariant()} size="md" dot>
                        {prediction?.riskLevel?.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card variant="default">
                <CardContent>
                  <div className="info-card">
                    <div className="info-card__icon">
                      <Shield size={24} aria-hidden="true" />
                    </div>
                    <div className="info-card__content">
                      <span className="info-card__label">Confidence</span>
                      <span className="info-card__value">{confidencePercent}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Action Buttons */}
          <section className="prediction-result__actions" aria-labelledby="actions-heading">
            <h2 id="actions-heading" className="sr-only">Actions</h2>
            <div className="prediction-result__action-buttons">
              <Button variant="primary" size="lg" onClick={() => setShowAdvisory(true)}>
                <Shield size={20} aria-hidden="true" />
                View Advisory
              </Button>
              <Button variant="secondary" size="lg" onClick={handleSubmitCase}>
                <FileText size={20} aria-hidden="true" />
                Submit for Expert Review
              </Button>
              <Button variant="outline" size="lg" onClick={handleRetake}>
                <ArrowLeft size={18} aria-hidden="true" />
                Retake Image
              </Button>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="prediction-result__disclaimer" role="contentinfo">
            <div className="disclaimer-card">
              <AlertTriangle size={20} aria-hidden="true" />
              <div className="disclaimer-content">
                <strong>Important:</strong> This is an AI prediction, not a definitive diagnosis. 
                AI predictions should be verified by an agricultural expert before taking action. 
                Confidence score represents model certainty, not prediction accuracy.
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

const AdvisoryView = ({ advisory, crop, disease, onClose }) => {
  return (
    <div className="advisory-view">
      <header className="advisory-view__header">
        <h2 className="advisory-view__title">Advisory for {disease} ({crop})</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ChevronRight size={18} aria-hidden="true" />
        </Button>
      </header>
      <div className="advisory-view__content">
        {advisory.immediateActions && advisory.immediateActions.length > 0 && (
          <AdvisorySection
            title="IMMEDIATE ACTIONS"
            icon="🔴"
            color="var(--color-error)"
            items={advisory.immediateActions}
          />
        )}
        {advisory.monitoring && advisory.monitoring.length > 0 && (
          <AdvisorySection
            title="MONITORING"
            icon="🟡"
            color="var(--color-warning)"
            items={advisory.monitoring}
          />
        )}
        {advisory.expertConsultation && advisory.expertConsultation.length > 0 && (
          <AdvisorySection
            title="EXPERT CONSULTATION"
            icon="🟢"
            color="var(--color-info)"
            items={advisory.expertConsultation}
          />
        )}
        {advisory.inputGuidance && advisory.inputGuidance.length > 0 && (
          <AdvisorySection
            title="INPUT GUIDANCE"
            icon="📋"
            color="var(--color-success)"
            items={advisory.inputGuidance}
          />
        )}
        {advisory.preventiveMeasures && advisory.preventiveMeasures.length > 0 && (
          <AdvisorySection
            title="PREVENTIVE MEASURES"
            icon="✅"
            color="var(--color-primary)"
            items={advisory.preventiveMeasures}
          />
        )}
      </div>
    </div>
  );
};

const AdvisorySection = ({ title, icon, color, items }) => (
  <section className="advisory-section" style={{ borderLeftColor: color }}>
    <header className="advisory-section__header" style={{ backgroundColor: color + '15' }}>
      <span className="advisory-section__icon" style={{ color }}>{icon}</span>
      <h3 className="advisory-section__title">{title}</h3>
    </header>
    <ul className="advisory-section__items">
      {items.map((item, i) => (
        <li key={i} className="advisory-section__item">{item}</li>
      ))}
    </ul>
  </section>
);

const getStatusVariant = (status) => {
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

PredictionResult.displayName = 'PredictionResult';

export default PredictionResult;