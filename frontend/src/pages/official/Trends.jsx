import { useState } from 'react';
import { Download, Filter, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { mockTrends, mockHotspots } from '../../data/mockData';
import './Trends.css';

const OfficialTrends = () => {
  const [granularity, setGranularity] = useState('weekly');
  const [selectedDiseases, setSelectedDiseases] = useState(mockTrends.datasets.map(d => d.label));
  const [selectedRegions, setSelectedRegions] = useState(['All Regions']);

  const granularityOptions = [
    { value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }
  ];

  const diseaseOptions = mockTrends.datasets.map(d => ({ value: d.label, label: d.label }));
  const regionOptions = [
    { value: 'All Regions', label: 'All Regions' }, { value: 'North Delhi', label: 'North Delhi' },
    { value: 'South Delhi', label: 'South Delhi' }, { value: 'East Delhi', label: 'East Delhi' },
    { value: 'West Delhi', label: 'West Delhi' }, { value: 'Central Delhi', label: 'Central Delhi' }
  ];

  const filteredDatasets = mockTrends.datasets.filter(d => selectedDiseases.includes(d.label));

  return (
    <div className="official-trends">
      <header className="official-trends__header">
        <div>
          <h1 className="official-trends__title">Disease Trends</h1>
          <p className="official-trends__subtitle">View temporal patterns of crop diseases across regions</p>
        </div>
        <div className="official-trends__header-actions">
          <Button variant="outline"><Download size={16} aria-hidden="true" /> Export Data</Button>
        </div>
      </header>

      <Card variant="outlined" className="official-trends__controls">
        <CardHeader> <CardTitle>Filters</CardTitle> <CardSubtitle>Customize the trend view</CardSubtitle> </CardHeader>
        <CardContent>
          <div className="trends-controls__grid">
            <div className="filter-group">
              <label htmlFor="granularity" className="filter-label">Granularity</label>
              <Select id="granularity" options={granularityOptions} value={granularity} onChange={(e) => setGranularity(e.target.value)} />
            </div>
            <div className="filter-group">
              <label htmlFor="diseases" className="filter-label">Diseases</label>
              <Select id="diseases" options={diseaseOptions} value={selectedDiseases} onChange={(e) => { const vals = Array.from(e.target.selectedOptions, o => o.value); setSelectedDiseases(vals); }} multiple />
            </div>
            <div className="filter-group">
              <label htmlFor="regions" className="filter-label">Regions</label>
              <Select id="regions" options={regionOptions} value={selectedRegions} onChange={(e) => { const vals = Array.from(e.target.selectedOptions, o => o.value); setSelectedRegions(vals); }} multiple />
            </div>
            <div className="filter-group">
              <label htmlFor="date-range" className="filter-label">Date Range</label>
              <Select id="date-range" options={[{ value: '30d', label: 'Last 30 Days' }, { value: '90d', label: 'Last 90 Days' }, { value: '1y', label: 'Last Year' }]} value="30d" onChange={() => {}} />
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="official-trends__chart" aria-labelledby="chart-heading">
        <h2 id="chart-heading" className="sr-only">Trend Chart</h2>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Cases Over Time</CardTitle>
            <CardSubtitle>Weekly case counts by disease</CardSubtitle>
          </CardHeader>
          <CardContent>
            <div className="trend-chart-wrapper">
              <TrendChart 
                labels={mockTrends.labels} 
                datasets={filteredDatasets}
                height={400}
              />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="official-trends__summary" aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="sr-only">Summary Statistics</h2>
        <div className="official-trends__summary-grid">
          {filteredDatasets.map((dataset, i) => (
            <Card key={dataset.label} variant="default" className="trend-summary-card">
              <CardContent>
                <div className="trend-summary-card__header">
                  <div className="trend-summary-card__color" style={{ backgroundColor: dataset.color }} />
                  <div className="trend-summary-card__info">
                    <h3 className="trend-summary-card__name">{dataset.label}</h3>
                    <p className="trend-summary-card__total">{dataset.data.reduce((a, b) => a + b, 0)} total cases</p>
                  </div>
                </div>
                <div className="trend-summary-card__stats">
                  <div className="trend-summary-card__stat">
                    <span className="trend-summary-card__stat-label">Peak</span>
                    <span className="trend-summary-card__stat-value">{Math.max(...dataset.data)}</span>
                  </div>
                  <div className="trend-summary-card__stat">
                    <span className="trend-summary-card__stat-label">Average</span>
                    <span className="trend-summary-card__stat-value">{Math.round(dataset.data.reduce((a, b) => a + b, 0) / dataset.data.length)}</span>
                  </div>
                  <div className="trend-summary-card__stat">
                    <span className="trend-summary-card__stat-label">Trend</span>
                    <span className="trend-summary-card__stat-value trend-up">↑ {Math.round(((dataset.data[dataset.data.length - 1] - dataset.data[0]) / dataset.data[0]) * 100)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

const TrendChart = ({ labels, datasets, height }) => {
  if (datasets.length === 0) {
    return (
      <div className="trend-chart__empty">
        <Filter size={48} aria-hidden="true" />
        <p>Select at least one disease to view trends</p>
      </div>
    );
  }

  const maxValue = Math.max(...datasets.flatMap(d => d.data));
  const chartHeight = height - 60;
  const width = '100%';
  const stepX = 100 / (labels.length - 1);

  return (
    <svg viewBox={`0 0 ${100} ${height / chartHeight * 100}`} className="trend-svg" role="img" aria-label="Trend chart">
      <defs>
        {datasets.map((dataset, i) => (
          <linearGradient key={i} id={`gradient-${dataset.label.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={dataset.color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={dataset.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
        <line key={i} x1="0" y1={`${ratio * chartHeight + 30}`} x2="100" y2={`${ratio * chartHeight + 30}`} stroke="var(--color-border-light)" strokeWidth="0.5" />
      ))}
      {/* Y-axis labels */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
        <text key={i} x="-5" y={`${ratio * chartHeight + 35}`} textAnchor="end" fontSize="8" fill="var(--color-text-secondary)">
          {Math.round(maxValue * (1 - ratio))}
        </text>
      ))}
      {/* Datasets */}
      {datasets.map((dataset, i) => {
        const points = dataset.data.map((value, idx) => {
          const x = idx * stepX;
          const y = chartHeight - (value / maxValue) * chartHeight + 30;
          return `${x},${y}`;
        }).join(' ');
        
        return (
          <g key={dataset.label}>
            {/* Area */}
            <path
              d={`M${points.split(' ')[0]} L${points} L${100},${chartHeight + 30} L0,${chartHeight + 30} Z`}
              fill={`url(#gradient-${dataset.label.replace(/\s+/g, '-')})`}
            />
            {/* Line */}
            <path
              d={`M${points}`}
              fill="none"
              stroke={dataset.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Points */}
            {dataset.data.map((value, idx) => (
              <circle
                key={idx}
                cx={idx * stepX}
                cy={chartHeight - (value / maxValue) * chartHeight + 30}
                r="3"
                fill={dataset.color}
                stroke="var(--color-surface)"
                strokeWidth="2"
              />
            ))}
          </g>
        );
      })}
      {/* X-axis labels */}
      {labels.map((label, idx) => (
        <text key={idx} x={idx * stepX} y={`${chartHeight + 50}`} textAnchor="middle" fontSize="8" fill="var(--color-text-secondary)">
          {label}
        </text>
      ))}
    </svg>
  );
};

OfficialTrends.displayName = 'OfficialTrends';
export default OfficialTrends;