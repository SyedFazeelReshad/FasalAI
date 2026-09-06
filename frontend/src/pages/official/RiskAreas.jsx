import { useState, useMemo } from 'react';
import { Filter, Download, TrendingUp, TrendingDown, Minus, MapPin, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { mockRiskAreas } from '../../data/mockData';
import './RiskAreas.css';

const OfficialRiskAreas = () => {
  const [riskFilter, setRiskFilter] = useState('');
  const [trendFilter, setTrendFilter] = useState('');
  const [dateRange, setDateRange] = useState('30d');

  const riskOptions = [
    { value: '', label: 'All Risk Levels' }, { value: 'critical', label: 'Critical (80+)' },
    { value: 'high', label: 'High (60-79)' }, { value: 'medium', label: 'Medium (40-59)' },
    { value: 'low', label: 'Low (<40)' }
  ];
  const trendOptions = [
    { value: '', label: 'All Trends' }, { value: 'up', label: 'Increasing ↑' },
    { value: 'down', label: 'Decreasing ↓' }, { value: 'stable', label: 'Stable →' }
  ];

  const filteredAreas = useMemo(() => {
    return mockRiskAreas.filter(area => {
      const matchesRisk = !riskFilter || 
        (riskFilter === 'critical' && area.riskScore >= 80) ||
        (riskFilter === 'high' && area.riskScore >= 60 && area.riskScore < 80) ||
        (riskFilter === 'medium' && area.riskScore >= 40 && area.riskScore < 60) ||
        (riskFilter === 'low' && area.riskScore < 40);
      const matchesTrend = !trendFilter || area.trend === trendFilter;
      return matchesRisk && matchesTrend;
    });
  }, [riskFilter, trendFilter]);

  const columns = [
    { key: 'region', label: 'Region', render: (val, row) => <><MapPin size={14} aria-hidden="true" style={{marginRight: 4}} /> {val}</> },
    { key: 'caseCount', label: 'Cases', align: 'center', render: (val) => val.toLocaleString() },
    { key: 'dominantDisease', label: 'Dominant Disease' },
    { key: 'avgConfidence', label: 'Avg Confidence', align: 'center', render: (val) => `${Math.round(val * 100)}%` },
    { key: 'trend', label: 'Trend', align: 'center', render: (val) => (
      <span className={`trend-badge trend-${val}`}>
        {val === 'up' && <TrendingUp size={14} aria-hidden="true" />}
        {val === 'down' && <TrendingDown size={14} aria-hidden="true" />}
        {val === 'stable' && <Minus size={14} aria-hidden="true" />}
        {val.charAt(0).toUpperCase() + val.slice(1)}
      </span>
    ) },
    { key: 'riskScore', label: 'Risk Score', align: 'center', render: (val) => <Badge variant={val >= 80 ? 'risk-critical' : val >= 60 ? 'risk-high' : val >= 40 ? 'risk-medium' : 'risk-low'} size="md">{val}</Badge> }
  ];

  const clearFilters = () => { setRiskFilter(''); setTrendFilter(''); setDateRange('30d'); };
  const hasActiveFilters = riskFilter || trendFilter;

  return (
    <div className="official-risk-areas">
      <header className="official-risk-areas__header">
        <div>
          <h1 className="official-risk-areas__title">High-Risk Areas</h1>
          <p className="official-risk-areas__subtitle">Regions requiring priority intervention based on case density and risk factors</p>
        </div>
        <div className="official-risk-areas__header-actions">
          <Button variant="outline"><Download size={16} aria-hidden="true" /> Export Report</Button>
        </div>
      </header>

      <Card variant="outlined" className="official-risk-areas__filters">
        <CardHeader> <CardTitle>Filters</CardTitle> <CardSubtitle>Refine risk area analysis</CardSubtitle> </CardHeader>
        <CardContent>
          <div className="risk-areas-controls__grid">
            <div className="filter-group">
              <label htmlFor="risk-level" className="filter-label">Risk Level</label>
              <Select id="risk-level" options={riskOptions} value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} />
            </div>
            <div className="filter-group">
              <label htmlFor="trend" className="filter-label">Trend</label>
              <Select id="trend" options={trendOptions} value={trendFilter} onChange={(e) => setTrendFilter(e.target.value)} />
            </div>
            <div className="filter-group">
              <label htmlFor="date-range" className="filter-label">Period</label>
              <Select id="date-range" options={[{ value: '7d', label: 'Last 7 Days' }, { value: '30d', label: 'Last 30 Days' }, { value: '90d', label: 'Last 90 Days' }]} value={dateRange} onChange={(e) => setDateRange(e.target.value)} />
            </div>
            <div className="filter-group filter-group--actions">
              <Button variant="outline" onClick={clearFilters} disabled={!hasActiveFilters}><Filter size={16} aria-hidden="true" /> Clear Filters</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="official-risk-areas__summary" aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="sr-only">Risk Summary</h2>
        <div className="official-risk-areas__summary-grid">
          <RiskSummaryCard title="Critical Risk" count={mockRiskAreas.filter(a => a.riskScore >= 80).length} icon={<AlertTriangle size={24} />} color="var(--color-error)" bg="var(--color-error-light)" />
          <RiskSummaryCard title="High Risk" count={mockRiskAreas.filter(a => a.riskScore >= 60 && a.riskScore < 80).length} icon={<AlertTriangle size={24} />} color="var(--color-warning)" bg="var(--color-warning-light)" />
          <RiskSummaryCard title="Total Cases" count={mockRiskAreas.reduce((a, b) => a + b.caseCount, 0)} icon={<MapPin size={24} />} color="var(--color-primary)" bg="var(--color-primary-light)" />
          <RiskSummaryCard title="Avg Risk Score" count={Math.round(mockRiskAreas.reduce((a, b) => a + b.riskScore, 0) / mockRiskAreas.length)} icon={<TrendingUp size={24} />} color="var(--color-info)" bg="var(--color-info-light)" />
        </div>
      </section>

      <Card variant="default">
        <CardHeader>
          <CardTitle>Risk Area Details</CardTitle>
          <CardSubtitle>{filteredAreas.length} of {mockRiskAreas.length} regions</CardSubtitle>
        </CardHeader>
        <CardContent className="cases-table-wrapper">
          <DataTable columns={columns} data={filteredAreas} keyField="region" sortable pagination pageSize={15} emptyMessage="No regions match your filters" />
        </CardContent>
      </Card>

      <section className="official-risk-areas__insights" aria-labelledby="insights-heading">
        <h2 id="insights-heading" className="sr-only">Key Insights</h2>
        <Card variant="elevated" className="official-risk-areas__insights-card">
          <CardHeader> <CardTitle>Key Insights</CardTitle> <CardSubtitle>Actionable intelligence for intervention planning</CardSubtitle> </CardHeader>
          <CardContent>
            <div className="insights-list">
              <InsightItem icon="🔴" title="North Delhi - Critical" desc="89 cases, Early Blight dominant. Risk score 87. Immediate intervention recommended." />
              <InsightItem icon="🟠" title="West Delhi - Rising Trend" desc="34 cases, Late Blight. Risk score 65 trending up. Monitor closely." />
              <InsightItem icon="🟡" title="South Delhi - Medium Risk" desc="67 cases, Common Rust. Risk score 72. Seasonal pattern expected." />
              <InsightItem icon="🟢" title="Central Delhi - Improving" desc="28 cases, Bacterial Spot. Risk score 42 trending down. Continue surveillance." />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

const RiskSummaryCard = ({ title, count, icon, color, bg }) => (
  <Card variant="default" className="risk-summary-card" style={{ borderLeft: `4px solid ${color}` }}>
    <CardContent>
      <div className="risk-summary-card__content">
        <div className="risk-summary-card__icon" style={{ backgroundColor: bg, color }}>{icon}</div>
        <div className="risk-summary-card__text">
          <p className="risk-summary-card__count">{count}</p>
          <p className="risk-summary-card__label">{title}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const InsightItem = ({ icon, title, desc }) => (
  <div className="insight-item">
    <span className="insight-item__icon">{icon}</span>
    <div className="insight-item__text">
      <strong>{title}</strong>
      <p>{desc}</p>
    </div>
  </div>
);

OfficialRiskAreas.displayName = 'OfficialRiskAreas';
export default OfficialRiskAreas;