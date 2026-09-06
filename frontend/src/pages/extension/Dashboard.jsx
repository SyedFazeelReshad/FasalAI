import { Link } from 'react-router-dom';
import { AlertTriangle, ClipboardCheck, FileText, TrendingUp, Users, MapPin, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent, CardFooter } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { mockExtensionCases, mockDashboardStats, mockPredictions, mockCrops, mockFarms, mockDiseases } from '../../data/mockData';
import './ExtensionDashboard.css';

const ExtensionDashboard = () => {
  const stats = mockDashboardStats.extension;

  const pendingCases = mockExtensionCases.filter(c => c.status === 'submitted' || c.status === 'under_review');
  const verifiedCases = mockExtensionCases.filter(c => c.status === 'verified');
  const rejectedCases = mockExtensionCases.filter(c => c.status === 'rejected');

  const columns = [
    { key: 'id', label: 'Case ID', width: '120px', render: (val) => <span className="case-id">#{val.slice(-8).toUpperCase()}</span> },
    { key: 'cropName', label: 'Crop', width: '120px' },
    { key: 'farmName', label: 'Farm', width: '150px' },
    { key: 'diseaseName', label: 'AI Prediction', width: '180px' },
    { key: 'confidence', label: 'Confidence', width: '100px', align: 'center', render: (val) => val ? `${Math.round(val * 100)}%` : '—' },
    { key: 'riskLevel', label: 'Risk', width: '100px', align: 'center', render: (val) => <Badge variant={getRiskVariant(val)} size="sm" dot>{val?.toUpperCase()}</Badge> },
    { key: 'status', label: 'Status', width: '130px', align: 'center', render: (val) => <Badge variant={getStatusVariant(val)} size="sm">{val.replace('_', ' ')}</Badge> },
    { key: 'distance', label: 'Distance', width: '100px', align: 'center' }
  ];

  const enrichCases = (cases) => cases.map(c => {
    const prediction = mockPredictions.find(p => p.caseId === c.id);
    const crop = mockCrops.find(cr => cr.id === c.cropId);
    const farm = mockFarms.find(f => f.id === c.farmId);
    const disease = prediction ? mockDiseases.find(d => d.id === prediction.diseaseId) : null;
    return {
      ...c,
      cropName: crop?.name || c.cropId,
      farmName: farm?.name || 'Unknown Farm',
      diseaseName: disease?.name || 'Pending',
      confidence: prediction?.confidence,
      riskLevel: prediction?.riskLevel,
      distance: c.distance || '—'
    };
  });

  const enrichedPending = enrichCases(pendingCases);
  const enrichedVerified = enrichCases(verifiedCases);
  const enrichedRejected = enrichCases(rejectedCases);

  return (
    <div className="extension-dashboard">
      {/* Header */}
      <header className="extension-dashboard__header">
        <div>
          <h1 className="extension-dashboard__title">Extension Worker Dashboard</h1>
          <p className="extension-dashboard__subtitle">Review and verify farmer cases in your area</p>
        </div>
      </header>

      {/* Stats */}
      <section className="extension-dashboard__stats" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Statistics</h2>
        <div className="extension-dashboard__stats-grid">
          <StatCard
            title="Pending Review"
            value={stats.pendingCases}
            icon={<AlertTriangle size={20} aria-hidden="true" />}
            trend="up"
            change={3}
            changeLabel="new today"
          />
          <StatCard
            title="In Review"
            value={stats.inReview}
            icon={<Loader2 size={20} aria-hidden="true" />}
            trend="neutral"
            change={0}
            changeLabel="currently"
          />
          <StatCard
            title="Verified Today"
            value={stats.verifiedToday}
            icon={<CheckCircle size={20} aria-hidden="true" />}
            trend="up"
            change={2}
            changeLabel="this week"
          />
          <StatCard
            title="This Week"
            value={stats.thisWeek}
            icon={<ClipboardCheck size={20} aria-hidden="true" />}
            trend="up"
            change={12}
            changeLabel="total"
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="extension-dashboard__quick-actions" aria-labelledby="actions-heading">
        <h2 id="actions-heading" className="sr-only">Quick Actions</h2>
        <div className="extension-dashboard__actions-grid">
          <Link to="/extension/cases/pending">
            <Card variant="outlined" className="extension-dashboard__action-card">
              <CardContent>
                <div className="action-card__icon action-card__icon--warning">
                  <AlertTriangle size={28} aria-hidden="true" />
                </div>
                <h3 className="action-card__title">Pending Review</h3>
                <p className="action-card__description">{pendingCases.length} cases awaiting verification</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" fullWidth>Review Now</Button>
              </CardFooter>
            </Card>
          </Link>
          <Link to="/extension/cases">
            <Card variant="outlined" className="extension-dashboard__action-card">
              <CardContent>
                <div className="action-card__icon action-card__icon--info">
                  <FileText size={28} aria-hidden="true" />
                </div>
                <h3 className="action-card__title">All Cases</h3>
                <p className="action-card__description">Browse all assigned cases</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" fullWidth>View All</Button>
              </CardFooter>
            </Card>
          </Link>
          <Link to="/extension/verified">
            <Card variant="outlined" className="extension-dashboard__action-card">
              <CardContent>
                <div className="action-card__icon action-card__icon--success">
                  <CheckCircle size={28} aria-hidden="true" />
                </div>
                <h3 className="action-card__title">Verified Cases</h3>
                <p className="action-card__description">{verifiedCases.length} cases verified</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" fullWidth>View History</Button>
              </CardFooter>
            </Card>
          </Link>
        </div>
      </section>

      {/* Priority Cases Table */}
      <section className="extension-dashboard__priority" aria-labelledby="priority-heading">
        <div className="extension-dashboard__section-header">
          <h2 id="priority-heading" className="extension-dashboard__section-title">Priority Cases</h2>
          <Link to="/extension/cases/pending">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>
        <Card variant="default">
          <CardContent className="cases-table-wrapper">
            <DataTable
              columns={columns}
              data={enrichedPending.slice(0, 10)}
              keyField="id"
              sortable
              pagination
              pageSize={5}
              emptyMessage="No pending cases"
            />
          </CardContent>
        </Card>
      </section>

      {/* Recent Verified */}
      <section className="extension-dashboard__recent" aria-labelledby="recent-heading">
        <div className="extension-dashboard__section-header">
          <h2 id="recent-heading" className="extension-dashboard__section-title">Recently Verified</h2>
          <Link to="/extension/verified">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>
        <div className="extension-dashboard__cases-grid">
          {enrichedVerified.slice(0, 3).map(caseItem => (
            <ExtensionCaseCard key={caseItem.id} caseData={caseItem} />
          ))}
          {enrichedVerified.length === 0 && (
            <div className="extension-dashboard__empty">
              <CheckCircle size={48} aria-hidden="true" />
              <h3>No verified cases yet</h3>
              <p>Verified cases will appear here</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const ExtensionCaseCard = ({ caseData }) => {
  const prediction = mockPredictions.find(p => p.caseId === caseData.id);
  const disease = prediction ? mockDiseases.find(d => d.id === prediction.diseaseId) : null;

  return (
    <Card variant="default" className="extension-dashboard__case-card">
      <CardContent>
        <div className="extension-case-card__header">
          <span className="extension-case-card__id">#{caseData.id.slice(-8).toUpperCase()}</span>
          <Badge variant={getStatusVariant(caseData.status)} size="sm">
            {caseData.status.replace('_', ' ')}
          </Badge>
        </div>
        <div className="extension-case-card__meta">
          <span>{caseData.cropName}</span>
          <span>{caseData.farmName}</span>
        </div>
        <div className="extension-case-card__prediction">
          <strong>AI: </strong> {disease?.name || 'Pending'}
          <Badge variant={getRiskVariant(prediction?.riskLevel)} size="sm" dot>
            {prediction?.riskLevel?.toUpperCase()}
          </Badge>
        </div>
        <div className="extension-case-card__confidence">
          Confidence: {prediction ? Math.round(prediction.confidence * 100) : 0}%
        </div>
        <div className="extension-case-card__distance">
          Distance: {caseData.distance}
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/extension/cases/${caseData.id}`}>
          <Button variant="primary" size="sm" fullWidth>Review</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const getRiskVariant = (level) => {
  switch (level?.toLowerCase()) {
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

ExtensionDashboard.displayName = 'ExtensionDashboard';

export default ExtensionDashboard;