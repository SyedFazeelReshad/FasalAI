import { Link } from 'react-router-dom';
import { FileText, TrendingUp, Map, AlertTriangle, BarChart2, Users, MapPin, Clock, CheckCircle, XCircle, Loader2, Shield, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent, CardFooter } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { MapContainer } from '../../components/ui/MapContainer';
import { mockOfficialCases, mockDashboardStats, mockRiskAreas, mockHotspots, mockPredictions, mockCrops, mockDiseases } from '../../data/mockData';
import './Dashboard.css';

const OfficialDashboard = () => {
  const stats = mockDashboardStats.official;

  const columns = [
    { key: 'id', label: 'Case ID', width: '120px', render: (val) => <span className="case-id">#{val.slice(-8).toUpperCase()}</span> },
    { key: 'farmerName', label: 'Farmer', width: '150px' },
    { key: 'cropName', label: 'Crop', width: '100px' },
    { key: 'diseaseName', label: 'Disease', width: '180px' },
    { key: 'region', label: 'Region', width: '120px' },
    { key: 'verificationStatus', label: 'Status', width: '130px', align: 'center', render: (val) => <Badge variant={getStatusVariant(val)} size="sm">{val}</Badge> },
    { key: 'capturedAt', label: 'Date', width: '120px', align: 'center', render: (val) => formatDate(val) }
  ];

  const enrichedCases = mockOfficialCases.map(c => {
    const prediction = mockPredictions.find(p => p.caseId === c.id);
    const crop = mockCrops.find(cr => cr.id === c.cropId);
    const disease = prediction ? mockDiseases.find(d => d.id === prediction.diseaseId) : null;
    return {
      ...c,
      cropName: crop?.name || c.cropId,
      diseaseName: disease?.name || 'Pending',
      region: getRegionFromCoords(c.location)
    };
  });

  return (
    <div className="official-dashboard">
      <header className="official-dashboard__header">
        <div>
          <h1 className="official-dashboard__title">Agriculture Official Dashboard</h1>
          <p className="official-dashboard__subtitle">Monitor crop health trends, hotspots, and high-risk areas</p>
        </div>
        <Button variant="outline">
          <Download size={16} aria-hidden="true" />
          Export Report
        </Button>
      </header>

      <section className="official-dashboard__stats" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Key Statistics</h2>
        <div className="official-dashboard__stats-grid">
          <StatCard title="Total Cases" value={stats.totalCases.toLocaleString()} icon={<FileText size={20} aria-hidden="true" />} trend="up" change={12} changeLabel="this month" />
          <StatCard title="Active Diseases" value={stats.activeDiseases} icon={<AlertTriangle size={20} aria-hidden="true" />} trend="neutral" change={0} changeLabel="monitored" />
          <StatCard title="High-Risk Areas" value={stats.highRiskAreas} icon={<MapPin size={20} aria-hidden="true" />} trend="up" change={5} changeLabel="new this week" />
          <StatCard title="Verification Rate" value={`${stats.verificationRate}%`} icon={<Shield size={20} aria-hidden="true" />} trend="up" change={3} changeLabel="improvement" />
        </div>
      </section>

      <div className="official-dashboard__charts-grid">
        <Card variant="elevated" className="official-dashboard__chart-card">
          <CardHeader>
            <CardTitle>Disease Distribution</CardTitle>
            <CardSubtitle>Cases by disease type</CardSubtitle>
          </CardHeader>
          <CardContent>
            <div className="disease-distribution">
              <div className="distribution-bars">
                {[
                  { name: 'Tomato Early Blight', count: 342, color: '#C62828' },
                  { name: 'Maize Common Rust', count: 287, color: '#F57F17' },
                  { name: 'Tomato Late Blight', count: 198, color: '#B71C1C' },
                  { name: 'Grape Black Rot', count: 156, color: '#2E7D32' },
                  { name: 'Tomato Bacterial Spot', count: 124, color: '#EF5350' },
                  { name: 'Others', count: 140, color: '#757575' }
                ].map((item, i) => (
                  <div key={i} className="distribution-bar">
                    <span className="distribution-bar__name">{item.name}</span>
                    <div className="distribution-bar__track">
                      <div className="distribution-bar__fill" style={{ width: `${(item.count / 342) * 100}%`, backgroundColor: item.color }} />
                    </div>
                    <span className="distribution-bar__value">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="official-dashboard__chart-card">
          <CardHeader>
            <CardTitle>Case Trends (30 Days)</CardTitle>
            <CardSubtitle>Daily new cases</CardSubtitle>
          </CardHeader>
          <CardContent>
            <div className="trend-chart">
              <svg viewBox="0 0 100 50" className="trend-svg">
                <polyline 
                  fill="none" 
                  stroke="var(--color-primary)" 
                  strokeWidth="2"
                  points="5,40 12,35 19,38 26,28 33,32 40,22 47,25 54,18 61,20 68,15 75,12 82,18 89,10 96,8"
                />
              </svg>
              <div className="trend-legend">
                <span className="trend-legend__item"><span className="trend-legend__dot" style={{ backgroundColor: '#C62828' }} /> Early Blight</span>
                <span className="trend-legend__item"><span className="trend-legend__dot" style={{ backgroundColor: '#F57F17' }} /> Common Rust</span>
                <span className="trend-legend__item"><span className="trend-legend__dot" style={{ backgroundColor: '#2E7D32' }} /> Black Rot</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="official-dashboard__bottom-grid">
        <Card variant="elevated" className="official-dashboard__hotspot-card">
          <CardHeader>
            <CardTitle>Hotspot Map</CardTitle>
            <CardSubtitle>Disease clusters in your region</CardSubtitle>
          </CardHeader>
          <CardContent>
            <MapContainer height={300} markers={mockHotspots.map(h => ({ position: [h.lat, h.lng], popup: `${h.disease}: ${h.count} cases`, color: getRiskColor(h.risk) }))} />
          </CardContent>
        </Card>

        <Card variant="elevated" className="official-dashboard__risk-card">
          <CardHeader>
            <CardTitle>High-Risk Areas</CardTitle>
            <CardSubtitle>Regions requiring attention</CardSubtitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={[
                { key: 'region', label: 'Region' },
                { key: 'caseCount', label: 'Cases', align: 'center' },
                { key: 'dominantDisease', label: 'Dominant Disease' },
                { key: 'avgConfidence', label: 'Avg Confidence', align: 'center', render: (val) => `${Math.round(val * 100)}%` },
                { key: 'trend', label: 'Trend', align: 'center', render: (val) => <span className={`trend-${val}`}>{val === 'up' ? '↑' : val === 'down' ? '↓' : '→'}</span> },
                { key: 'riskScore', label: 'Risk Score', align: 'center', render: (val) => <Badge variant={val > 80 ? 'risk-critical' : val > 60 ? 'risk-high' : 'risk-medium'} size="sm">{val}</Badge> }
              ]}
              data={mockRiskAreas}
              keyField="region"
              sortable
              pagination={false}
              emptyMessage="No risk areas"
            />
          </CardContent>
        </Card>
      </div>

      <section className="official-dashboard__quick-links" aria-labelledby="links-heading">
        <h2 id="links-heading" className="sr-only">Quick Links</h2>
        <div className="official-dashboard__links-grid">
          <Link to="/official/cases">
            <Card variant="outlined" className="official-dashboard__link-card">
              <CardContent>
                <div className="link-card__icon"><FileText size={28} aria-hidden="true" /></div>
                <h3>All Cases</h3>
                <p>Browse and filter all reported cases</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/official/trends">
            <Card variant="outlined" className="official-dashboard__link-card">
              <CardContent>
                <div className="link-card__icon"><TrendingUp size={28} aria-hidden="true" /></div>
                <h3>Disease Trends</h3>
                <p>View temporal disease patterns</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/official/hotspots">
            <Card variant="outlined" className="official-dashboard__link-card">
              <CardContent>
                <div className="link-card__icon"><Map size={28} aria-hidden="true" /></div>
                <h3>Hotspot Map</h3>
                <p>Interactive disease cluster map</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/official/risk-areas">
            <Card variant="outlined" className="official-dashboard__link-card">
              <CardContent>
                <div className="link-card__icon"><AlertTriangle size={28} aria-hidden="true" /></div>
                <h3>High-Risk Areas</h3>
                <p>Priority intervention zones</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/official/reports">
            <Card variant="outlined" className="official-dashboard__link-card">
              <CardContent>
                <div className="link-card__icon"><BarChart2 size={28} aria-hidden="true" /></div>
                <h3>Reports</h3>
                <p>Generate and export reports</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
};

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const getRegionFromCoords = (loc) => { if (!loc) return 'Unknown'; if (loc.lat > 28.65) return 'North Delhi'; if (loc.lat < 28.55) return 'South Delhi'; return 'Central Delhi'; };
const getRiskColor = (risk) => risk === 'high' ? '#EF5350' : risk === 'medium' ? '#FFA726' : '#66BB6A';
const getStatusVariant = (status) => { switch (status) { case 'Verified': return 'status-verified'; case 'Under Review': return 'status-under_review'; default: return 'status-submitted'; } };

OfficialDashboard.displayName = 'OfficialDashboard';
export default OfficialDashboard;