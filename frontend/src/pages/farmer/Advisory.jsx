import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, AlertTriangle, Download, Share2, CheckCircle, Eye, FileText, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { mockCases, mockPredictions, mockDiseases, mockCrops, mockFarms, mockAdvisories } from '../../data/mockData';
import './Advisory.css';

const Advisory = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [advisory, setAdvisory] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    immediate: true,
    monitoring: true,
    expert: true,
    input: true,
    preventive: true
  });

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

  if (!caseData || !advisory) {
    return (
      <div className="advisory__not-found">
        <AlertTriangle size={48} aria-hidden="true" />
        <h2>Advisory Not Available</h2>
        <p>No advisory information found for this case.</p>
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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sections = [
    {
      key: 'immediate',
      label: 'IMMEDIATE ACTIONS',
      icon: <AlertTriangle size={20} aria-hidden="true" />,
      color: 'var(--color-error)',
      bgColor: 'var(--color-error-light)',
      items: advisory.immediateActions
    },
    {
      key: 'monitoring',
      label: 'MONITORING',
      icon: <Eye size={20} aria-hidden="true" />,
      color: 'var(--color-warning)',
      bgColor: 'var(--color-warning-light)',
      items: advisory.monitoring
    },
    {
      key: 'expert',
      label: 'EXPERT CONSULTATION',
      icon: <Shield size={20} aria-hidden="true" />,
      color: 'var(--color-info)',
      bgColor: 'var(--color-info-light)',
      items: advisory.expertConsultation
    },
    {
      key: 'input',
      label: 'INPUT GUIDANCE',
      icon: <FileText size={20} aria-hidden="true" />,
      color: 'var(--color-success)',
      bgColor: 'var(--color-success-light)',
      items: advisory.inputGuidance
    },
    {
      key: 'preventive',
      label: 'PREVENTIVE MEASURES',
      icon: <RotateCcw size={20} aria-hidden="true" />,
      color: 'var(--color-primary)',
      bgColor: 'var(--color-primary-light)',
      items: advisory.preventiveMeasures
    }
  ].filter(s => s.items && s.items.length > 0);

  return (
    <div className="advisory">
      {/* Header */}
      <header className="advisory__header">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="advisory__back-btn">
          <ArrowLeft size={18} aria-hidden="true" />
          <span>Back</span>
        </Button>
        <div className="advisory__header-info">
          <h1 className="advisory__title">Advisory</h1>
          <p className="advisory__subtitle">
            {disease?.name} on {crop?.name} • {farm?.name} • {formatDate(caseData.capturedAt)}
          </p>
        </div>
        <div className="advisory__header-actions">
          <Button variant="outline" size="sm">
            <Download size={16} aria-hidden="true" />
            Export PDF
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 size={16} aria-hidden="true" />
            Share
          </Button>
        </div>
      </header>

      {/* Case Summary Card */}
      <Card variant="elevated" className="advisory__summary-card">
        <CardContent>
          <div className="advisory-summary">
            <div className="advisory-summary__main">
              <div className="advisory-summary__icon" style={{ backgroundColor: getRiskVariant() === 'risk-critical' ? 'var(--color-error)' : getRiskVariant() === 'risk-high' ? 'var(--color-error)' : getRiskVariant() === 'risk-medium' ? 'var(--color-warning)' : 'var(--color-success)' }}>
                <AlertTriangle size={24} aria-hidden="true" />
              </div>
              <div className="advisory-summary__info">
                <h2 className="advisory-summary__disease">{disease?.name}</h2>
                <p className="advisory-summary__crop">{crop?.name} • {farm?.name}</p>
              </div>
            </div>
            <div className="advisory-summary__metrics">
              <div className="advisory-summary__metric">
                <span className="advisory-summary__metric-label">AI Confidence</span>
                <span className="advisory-summary__metric-value">{confidencePercent}%</span>
              </div>
              <div className="advisory-summary__metric">
                <span className="advisory-summary__metric-label">Risk Level</span>
                <Badge variant={getRiskVariant()} size="md" dot>
                  {prediction?.riskLevel?.toUpperCase()}
                </Badge>
              </div>
              <div className="advisory-summary__metric">
                <span className="advisory-summary__metric-label">Case Status</span>
                <Badge variant={getStatusVariant(caseData.status)} size="md">
                  {caseData.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="advisory__disclaimer" role="contentinfo">
        <AlertTriangle size={18} aria-hidden="true" />
        <div className="advisory__disclaimer-text">
          <strong>Important Disclaimer:</strong> This advisory is based on an AI prediction, not a definitive diagnosis. 
          The confidence score represents model certainty, not prediction accuracy. 
          All recommendations should be verified by a qualified agricultural extension worker or expert before implementation. 
          Always follow label instructions for any agricultural inputs and consult local agricultural department guidelines.
        </div>
      </div>

      {/* Advisory Sections */}
      <section className="advisory__sections" aria-labelledby="sections-heading">
        <h2 id="sections-heading" className="sr-only">Advisory Sections</h2>
        {sections.map((section) => (
          <Card key={section.key} variant="default" className="advisory__section-card">
            <CardContent>
              <AdvisorySection
                {...section}
                expanded={expandedSections[section.key]}
                onToggle={() => toggleSection(section.key)}
              />
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Footer Actions */}
      <div className="advisory__footer-actions">
        <Link to={`/farmer/detection/result/${caseId}`}>
          <Button variant="outline" size="lg">
            <ArrowLeft size={18} aria-hidden="true" />
            Back to Results
          </Button>
        </Link>
        <Link to="/farmer/cases">
          <Button variant="secondary" size="lg">
            View All Cases
          </Button>
        </Link>
        <Link to="/farmer/detect">
          <Button variant="primary" size="lg">
            <Shield size={18} aria-hidden="true" />
            New Detection
          </Button>
        </Link>
      </div>
    </div>
  );
};

const AdvisorySection = ({ key, label, icon, color, bgColor, items, expanded, onToggle }) => {
  return (
    <section className="advisory-section" style={{ '--section-color': color, '--section-bg': bgColor }}>
      <header className="advisory-section__header" onClick={onToggle}>
        <div className="advisory-section__icon-wrapper" style={{ backgroundColor: bgColor, color }}>
          {icon}
        </div>
        <h3 className="advisory-section__title">{label}</h3>
        <span className="advisory-section__chevron" style={{ color }}>
          {expanded ? '▼' : '▶'}
        </span>
      </header>
      {expanded && (
        <ul className="advisory-section__items">
          {items.map((item, i) => (
            <li key={i} className="advisory-section__item" style={{ '--bullet-color': color }}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

const getRiskVariant = () => {
  switch (prediction?.riskLevel?.toLowerCase()) {
    case 'low': return 'risk-low';
    case 'medium': return 'risk-medium';
    case 'high': return 'risk-high';
    case 'critical': return 'risk-critical';
    default: return 'default';
  }
};

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

Advisory.displayName = 'Advisory';

export default Advisory;