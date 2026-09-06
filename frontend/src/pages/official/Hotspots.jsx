import { useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { MapContainer } from '../../components/ui/MapContainer';
import { Badge } from '../../components/ui/Badge';
import { mockHotspots, mockDiseases } from '../../data/mockData';
import './Hotspots.css';

const OfficialHotspots = () => {
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [riskFilter, setRiskFilter] = useState('');
  const [dateRange, setDateRange] = useState('30d');
  const [showClusters, setShowClusters] = useState(true);

  const diseaseOptions = mockDiseases.filter(d => d.category === 'disease').map(d => ({ value: d.id, label: d.name }));
  const riskOptions = [
    { value: '', label: 'All Risk Levels' }, { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }
  ];

  const filteredHotspots = useMemo(() => {
    return mockHotspots.filter(h => {
      const matchesDisease = selectedDiseases.length === 0 || selectedDiseases.includes(h.disease);
      const matchesRisk = !riskFilter || h.risk === riskFilter;
      return matchesDisease && matchesRisk;
    });
  }, [selectedDiseases, riskFilter]);

  const getRiskColor = (risk) => risk === 'high' ? '#EF5350' : risk === 'medium' ? '#FFA726' : '#66BB6A';
  const getRiskVariant = (risk) => {
    switch (risk) {
      case 'high': return 'risk-high';
      case 'medium': return 'risk-medium';
      case 'low': return 'risk-low';
      default: return 'default';
    }
  };

  return (
    <div className="official-hotspots">
      <header className="official-hotspots__header">
        <div>
          <h1 className="official-hotspots__title">Disease Hotspot Map</h1>
          <p className="official-hotspots__subtitle">Geographical clusters of crop disease cases</p>
        </div>
        <div className="official-hotspots__header-actions">
          <Button variant="outline">
            <Download size={16} aria-hidden="true" />
            Export Map Data
          </Button>
        </div>
      </header>

      <Card variant="outlined" className="official-hotspots__controls">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardSubtitle>Customize map view</CardSubtitle>
        </CardHeader>
        <CardContent>
          <div className="hotspots-controls__grid">
            <div className="filter-group">
              <label htmlFor="diseases" className="filter-label">Diseases</label>
              <Select id="diseases" options={diseaseOptions} value={selectedDiseases} onChange={(e) => { const vals = Array.from(e.target.selectedOptions, o => o.value); setSelectedDiseases(vals); }} multiple placeholder="All diseases" />
            </div>
            <div className="filter-group">
              <label htmlFor="risk" className="filter-label">Risk Level</label>
              <Select id="risk" options={riskOptions} value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} />
            </div>
            <div className="filter-group">
              <label htmlFor="date-range" className="filter-label">Date Range</label>
              <Select id="date-range" options={[{ value: '7d', label: 'Last 7 Days' }, { value: '30d', label: 'Last 30 Days' }, { value: '90d', label: 'Last 90 Days' }]} value={dateRange} onChange={(e) => setDateRange(e.target.value)} />
            </div>
            <div className="filter-group filter-group--checkbox">
              <label className="checkbox-label">
                <input type="checkbox" checked={showClusters} onChange={(e) => setShowClusters(e.target.checked)} />
                <span>Show Clusters</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="official-hotspots__map-section" aria-labelledby="map-heading">
        <h2 id="map-heading" className="sr-only">Hotspot Map</h2>
        <Card variant="elevated" className="official-hotspots__map-card">
          <CardContent>
            <MapContainer 
              height={500} 
              markers={filteredHotspots.map(h => ({ position: [h.lat, h.lng], popup: `${mockDiseases.find(d => d.id === h.disease)?.name}: ${h.count} cases`, color: getRiskColor(h.risk) }))} 
              clusters={showClusters ? filteredHotspots : []}
            />
          </CardContent>
        </Card>
      </section>

      <section className="official-hotspots__legend" aria-labelledby="legend-heading">
        <h2 id="legend-heading" className="sr-only">Map Legend</h2>
        <Card variant="default" className="official-hotspots__legend-card">
          <CardContent>
            <div className="legend-grid">
              <div className="legend-section">
                <h3 className="legend-section__title">Risk Levels</h3>
                <div className="legend-items">
                  <div className="legend-item">High Risk</div>
                  <div className="legend-item">Medium Risk</div>
                  <div className="legend-item">Low Risk</div>
                </div>
              </div>
              <div className="legend-section">
                <h3 className="legend-section__title">Case Count</h3>
                <div className="legend-items">
                  <div className="legend-item">30+ cases</div>
                  <div className="legend-item">15-30 cases</div>
                  <div className="legend-item">Under 15 cases</div>
                </div>
              </div>
              <div className="legend-section">
                <h3 className="legend-section__title">Active Hotspots</h3>
                <div className="legend-hotspot-list">
                  {filteredHotspots.slice(0, 5).map(h => (
                    <div key={h.id} className="legend-hotspot">
                      <span className="legend-hotspot__disease">{mockDiseases.find(d => d.id === h.disease)?.name}</span>
                      <span className="legend-hotspot__count">{h.count} cases</span>
                      <Badge variant={getRiskVariant(h.risk)} size="xs">{h.risk}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

const getRiskColor = (risk) => risk === 'high' ? '#EF5350' : risk === 'medium' ? '#FFA726' : '#66BB6A';
const getRiskVariant = (risk) => {
  switch (risk) {
    case 'high': return 'risk-high';
    case 'medium': return 'risk-medium';
    case 'low': return 'risk-low';
    default: return 'default';
  }
};

OfficialHotspots.displayName = 'OfficialHotspots';
export default OfficialHotspots;