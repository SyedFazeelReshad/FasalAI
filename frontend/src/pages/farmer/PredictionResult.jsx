import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, AlertTriangle, Download, Share2, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { PredictionCard } from '../../components/ui/PredictionCard';
import { mockCases, mockCrops, mockFarms } from '../../data/mockData';
import './PredictionResult.css';

const PredictionResult = () => {
  const { caseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [advisory, setAdvisory] = useState(null);
  const [showAdvisory, setShowAdvisory] = useState(false);

  // Check if we have prediction data from navigation state (new analysis)
  const statePrediction = location.state?.prediction;

  useEffect(() => {
    if (statePrediction) {
      // New analysis from API - use the returned data directly
      setPrediction({
        predicted_disease: statePrediction.predicted_disease,
        confidence: statePrediction.confidence,
        riskLevel: statePrediction.risk_level?.toLowerCase().replace(' (uncertain)', ''),
        allScores: statePrediction.all_probabilities,
        is_low_confidence: statePrediction.is_low_confidence,
      });
      setAdvisory(statePrediction.advisory);
      setCaseData({
        id: statePrediction.crop ? `case-${Date.now()}` : 'case-new',
        cropId: statePrediction.crop?.toLowerCase(),
        capturedAt: new Date().toISOString(),
        status: 'draft',
        images: [{ url: URL.createObjectURL(new Blob()) }], // placeholder, will be replaced
      });
    } else if (caseId && caseId !== 'new') {
      // Existing case from mock data
      const foundCase = mockCases.find(c => c.id === caseId);
      if (foundCase) {
        setCaseData(foundCase);
        const foundPrediction = mockCases.find(p => p.id === caseId); // mockPredictions imported but not used here
        if (foundPrediction) {
          // We need mockPredictions for this
        }
      }
    }
  }, [caseId, statePrediction]);

  // For backward compatibility with mock data, import mockPredictions
  // eslint-disable-next-line no-unused-vars
  const mockPredictions = [
    { id: 'pred-001', caseId: 'case-001', confidence: 0.87, riskLevel: 'high', allScores: {} },
    { id: 'pred-002', caseId: 'case-002', confidence: 0.72, riskLevel: 'high', allScores: {} },
    { id: 'pred-003', caseId: 'case-003', confidence: 0.91, riskLevel: 'medium', allScores: {} },
    { id: 'pred-004', caseId: 'case-004', confidence: 0.65, riskLevel: 'high', allScores: {} },
    { id: 'pred-005', caseId: 'case-005', confidence: 0.42, riskLevel: 'critical', allScores: {} },
  ];
  const mockAdvisories = {
    tomato_early_blight: { immediateActions: [], monitoring: [], expertConsultation: [], inputGuidance: [], preventiveMeasures: [] },
  };

  // Find prediction for mock cases
  useEffect(() => {
    if (caseData && caseId && caseId !== 'new' && !statePrediction) {
      const foundPrediction = mockPredictions.find(p => p.caseId === caseId);
      if (foundPrediction) {
        setPrediction(foundPrediction);
        const diseaseKey = foundPrediction.diseaseId;
        setAdvisory(mockAdvisories[diseaseKey] || null);
      }
    }
  }, [caseData, caseId, statePrediction]);

  if (!caseData && !statePrediction) {
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

  const crop = mockCrops.find(c => c.id === caseData?.cropId);
  const farm = mockFarms.find(f => f.id === caseData?.farmId);
  const confidencePercent = prediction ? Math.round((prediction.confidence || prediction.confidencePercent || 0)) : 0;

  const getRiskVariant = () => {
    const risk = (prediction?.riskLevel || '').toLowerCase();
    switch (risk) {
      case 'low': return 'risk-low';
      case 'medium': return 'risk-medium';
      case 'high': return 'risk-high';
      case 'critical': return 'risk-critical';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmitCase = () => {
    alert('Case submitted for extension worker review!');
  };

  const handleRetake = () => {
    navigate('/farmer/detect');
  };

  const handleSaveDraft = () => {
    alert('Draft saved locally');
  };

  // For API response, prediction object has different structure
  const predictedDisease = prediction?.predicted_disease || prediction?.diseaseId;
  const allProbabilities = prediction?.allScores || prediction?.all_probabilities || {};
  const isLowConfidence = prediction?.is_low_confidence || false;
  const riskLevel = prediction?.riskLevel || prediction?.risk_level;

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
          <p className="prediction-result__subtitle">Case ID: {caseData?.id || 'new'}</p>
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
          disease={predictedDisease}
          onClose={() => setShowAdvisory(false)}
        />
      ) : (
        <>
          {/* Prediction Card */}
          <PredictionCard
            crop={crop?.name || statePrediction?.crop}
            farm={farm?.name}
            date={formatDate(caseData?.capturedAt)}
            imageUrl={caseData?.images?.[0]?.url}
            prediction={predictedDisease}
            confidence={prediction?.confidence || prediction?.confidencePercent ? (prediction.confidence || prediction.confidencePercent / 100) : 0}
            riskLevel={riskLevel}
            allScores={allProbabilities}
            onViewAdvisory={() => setShowAdvisory(true)}
            onSubmitCase={handleSubmitCase}
            onRetake={handleRetake}
            onSaveDraft={handleSaveDraft}
            isLowConfidence={isLowConfidence}
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
                      <Badge variant={getStatusVariant(caseData?.status)} size="md">
                        {(caseData?.status || 'draft').replace('_', ' ')}
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
                        {(riskLevel || 'unknown').toUpperCase()}
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
                      <span className="info-card__value">
                        {statePrediction ? statePrediction.confidence : confidencePercent}%
                        {isLowConfidence && <span className="confidence-low-badge"> (Low)</span>}
                      </span>
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
                {isLowConfidence && ' Low confidence result - field verification strongly recommended.'}
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
        {advisory.immediate_actions && advisory.immediate_actions.length > 0 && (
          <AdvisorySection
            title="IMMEDIATE ACTIONS"
            icon="🔴"
            color="var(--color-error)"
            items={advisory.immediate_actions}
          />
        )}
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
        {advisory.expert_consultation && advisory.expert_consultation.length > 0 && (
          <AdvisorySection
            title="EXPERT CONSULTATION"
            icon="🟢"
            color="var(--color-info)"
            items={advisory.expert_consultation}
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
        {advisory.input_guidance && advisory.input_guidance.length > 0 && (
          <AdvisorySection
            title="INPUT GUIDANCE"
            icon="📋"
            color="var(--color-success)"
            items={advisory.input_guidance}
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
        {advisory.preventive_measures && advisory.preventive_measures.length > 0 && (
          <AdvisorySection
            title="PREVENTIVE MEASURES"
            icon="✅"
            color="var(--color-primary)"
            items={advisory.preventive_measures}
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