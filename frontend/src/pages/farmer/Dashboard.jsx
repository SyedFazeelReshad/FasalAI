import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Cloud, CloudRain, Droplets, Wind, MapPin, Camera, Plus, FileText, AlertTriangle, TrendingUp, Shield, Leaf } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CaseCard } from '../../components/ui/CaseCard';
import { mockUser, mockFarms, mockCases, mockPredictions, mockWeather, mockDashboardStats, mockCrops, mockDiseases } from '../../data/mockData';
import './Dashboard.css';

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = mockDashboardStats.farmer;
  const userFarms = mockFarms;
  const recentCases = mockCases.slice(0, 5).map(caseItem => {
    const prediction = mockPredictions.find(p => p.caseId === caseItem.id);
    return { ...caseItem, prediction };
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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

  return (
    <div className="farmer-dashboard">
      {/* Welcome Section */}
      <section className="farmer-dashboard__welcome" aria-labelledby="welcome-heading">
        <div className="farmer-dashboard__welcome-content">
          <h1 id="welcome-heading" className="farmer-dashboard__greeting">
            {getGreeting()}, {mockUser.name.split(' ')[0]}
          </h1>
          <p className="farmer-dashboard__subtitle">
            Here's your crop health overview. Monitor your farms and detect issues early.
          </p>
        </div>
        <Link to="/farmer/detect" className="farmer-dashboard__cta">
          <Button variant="primary" size="lg">
            <Camera size={20} aria-hidden="true" />
            Detect Crop Disease
          </Button>
        </Link>
      </section>

      {/* Stats Overview */}
      <section className="farmer-dashboard__stats" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Farm Health Overview</h2>
        <div className="farmer-dashboard__stats-grid">
          <StatCard
            title="Total Farms"
            value={stats.totalFarms}
            icon={<MapPin size={20} aria-hidden="true" />}
            trend="up"
            change={1}
            changeLabel="vs last month"
          />
          <StatCard
            title="Active Cases"
            value={stats.activeCases}
            icon={<FileText size={20} aria-hidden="true" />}
            trend="neutral"
            change={0}
            changeLabel="this week"
          />
          <StatCard
            title="High-Risk Cases"
            value={stats.highRiskCases}
            icon={<AlertTriangle size={20} aria-hidden="true" />}
            trend="down"
            change={2}
            changeLabel="vs last week"
          />
          <StatCard
            title="Recently Monitored"
            value={stats.recentlyMonitored}
            icon={<TrendingUp size={20} aria-hidden="true" />}
            trend="up"
            change={15}
            changeLabel="this month"
          />
        </div>
      </section>

      {/* Weather & Risk Insight */}
      <section className="farmer-dashboard__insights" aria-labelledby="insights-heading">
        <h2 id="insights-heading" className="sr-only">Weather & Risk Insights</h2>
        <div className="farmer-dashboard__insights-grid">
          {/* Weather Card */}
          <Card variant="elevated" className="farmer-dashboard__weather-card">
            <CardHeader>
              <CardTitle>Weather for North Field</CardTitle>
              <CardSubtitle>Current conditions & 3-day forecast</CardSubtitle>
            </CardHeader>
            <CardContent>
              <div className="weather-card">
                <div className="weather-card__current">
                  <div className="weather-card__icon">
                    {mockWeather.current.condition === 'Light Rain' ? <CloudRain size={48} /> : 
                     mockWeather.current.condition === 'Partly Cloudy' ? <Cloud size={48} /> : <Sun size={48} />}
                  </div>
                  <div className="weather-card__temp">
                    <span className="weather-card__temp-value">{mockWeather.current.temperature}°C</span>
                    <span className="weather-card__temp-desc">{mockWeather.current.condition}</span>
                  </div>
                </div>
                <div className="weather-card__details">
                  <div className="weather-card__detail">
                    <Droplets size={16} aria-hidden="true" />
                    <span>Humidity: {mockWeather.current.humidity}%</span>
                  </div>
                  <div className="weather-card__detail">
                    <Wind size={16} aria-hidden="true" />
                    <span>Wind: {mockWeather.current.windSpeed} km/h</span>
                  </div>
                  <div className="weather-card__detail">
                    <CloudRain size={16} aria-hidden="true" />
                    <span>Rainfall: {mockWeather.current.rainfall}mm</span>
                  </div>
                </div>
                <div className="weather-card__forecast">
                  {mockWeather.forecast.map((day, i) => (
                    <div key={i} className="weather-card__day">
                      <span className="weather-card__day-name">
                        {i === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short' })}
                      </span>
                      <span className="weather-card__day-icon">
                        {day.condition === 'Light Rain' ? '🌦️' : day.condition === 'Moderate Rain' ? '🌧️' : '⛅'}
                      </span>
                      <span className="weather-card__day-temps">
                        {day.tempMin}° / {day.tempMax}°
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Summary Card */}
          <Card variant="elevated" className="farmer-dashboard__risk-card">
            <CardHeader>
              <CardTitle>Crop Health Risk Summary</CardTitle>
              <CardSubtitle>Based on recent detections & weather</CardSubtitle>
            </CardHeader>
            <CardContent>
              <div className="risk-summary">
                <div className="risk-summary__items">
                  {[
                    { crop: 'Tomato', risk: 'high', count: 2, disease: 'Early Blight' },
                    { crop: 'Maize', risk: 'medium', count: 1, disease: 'Common Rust' },
                    { crop: 'Grape', risk: 'low', count: 1, disease: 'Healthy' }
                  ].map((item, i) => (
                    <div key={i} className="risk-summary__item">
                      <div className="risk-summary__crop">
                        <Leaf size={16} aria-hidden="true" />
                        <span>{item.crop}</span>
                      </div>
                      <Badge variant={getRiskVariant(item.risk)} size="sm" dot>
                        {item.risk.charAt(0).toUpperCase() + item.risk.slice(1)} Risk
                      </Badge>
                      <div className="risk-summary__info">
                        <span>{item.count} case{item.count > 1 ? 's' : ''}</span>
                        <span>{item.disease}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="risk-summary__note">
                  <Shield size={14} aria-hidden="true" />
                  <span>High-risk cases require extension worker verification within 48 hours</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* My Farms */}
      <section className="farmer-dashboard__farms" aria-labelledby="farms-heading">
        <div className="farmer-dashboard__section-header">
          <h2 id="farms-heading" className="farmer-dashboard__section-title">My Farms</h2>
          <Link to="/farmer/farms">
            <Button variant="ghost" size="sm">
              <Plus size={16} aria-hidden="true" />
              Add Farm
            </Button>
          </Link>
        </div>
        <div className="farmer-dashboard__farms-grid">
          {userFarms.map((farm) => {
            const farmCases = mockCases.filter(c => c.farmId === farm.id);
            const highRiskCount = farmCases.filter(c => {
              const p = mockPredictions.find(pred => pred.caseId === c.id);
              return p && ['high', 'critical'].includes(p.riskLevel);
            }).length;
            const activeCount = farmCases.filter(c => ['submitted', 'under_review'].includes(c.status)).length;

            return (
              <Card 
                key={farm.id} 
                variant="default" 
                className="farmer-dashboard__farm-card"
                onClick={() => {}}
              >
                <CardContent>
                  <div className="farm-card__header">
                    <h3 className="farm-card__name">{farm.name}</h3>
                    <Badge variant={highRiskCount > 0 ? 'risk-high' : activeCount > 0 ? 'risk-medium' : 'risk-low'} size="sm" dot>
                      {highRiskCount > 0 ? 'High Risk' : activeCount > 0 ? 'Active' : 'Healthy'}
                    </Badge>
                  </div>
                  <div className="farm-card__details">
                    <div className="farm-card__detail">
                      <MapPin size={14} aria-hidden="true" />
                      <span>{farm.address}</span>
                    </div>
                    <div className="farm-card__detail">
                      <Leaf size={14} aria-hidden="true" />
                      <span>{mockCrops.find(c => c.id === farm.primaryCropId)?.name || farm.primaryCropId}</span>
                    </div>
                    <div className="farm-card__detail">
                      <span>{farm.areaValue} {farm.areaUnit}</span>
                    </div>
                  </div>
                  <div className="farm-card__stats">
                    <div className="farm-card__stat">
                      <span className="farm-card__stat-value">{farmCases.length}</span>
                      <span className="farm-card__stat-label">Total Cases</span>
                    </div>
                    <div className="farm-card__stat">
                      <span className="farm-card__stat-value">{activeCount}</span>
                      <span className="farm-card__stat-label">Active</span>
                    </div>
                    <div className="farm-card__stat">
                      <span className="farm-card__stat-value">{highRiskCount}</span>
                      <span className="farm-card__stat-label">High Risk</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Recent Cases */}
      <section className="farmer-dashboard__cases" aria-labelledby="cases-heading">
        <div className="farmer-dashboard__section-header">
          <h2 id="cases-heading" className="farmer-dashboard__section-title">Recent Crop Health Cases</h2>
          <Link to="/farmer/cases">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>
        <div className="farmer-dashboard__cases-list">
          {recentCases.length > 0 ? (
            recentCases.map((caseItem) => {
              const pred = caseItem.prediction;
              return (
                <CaseCard
                  key={caseItem.id}
                  caseData={{
                    id: caseItem.id,
                    crop: mockCrops.find(c => c.id === caseItem.cropId)?.name || caseItem.cropId,
                    farm: userFarms.find(f => f.id === caseItem.farmId)?.name || 'Unknown Farm',
                    prediction: pred?.diseaseId ? mockDiseases.find(d => d.id === pred.diseaseId)?.name : 'Pending',
                    confidence: pred?.confidence,
                    riskLevel: pred?.riskLevel,
                    status: caseItem.status,
                    date: formatDate(caseItem.capturedAt),
                    imageUrl: caseItem.images?.[0]?.thumbnailUrl
                  }}
                  variant="card"
                  onClick={() => {}}
                />
              );
            })
          ) : (
            <div className="farmer-dashboard__empty-cases">
              <FileText size={48} aria-hidden="true" />
              <h3>No cases yet</h3>
              <p>Start by detecting crop disease on your farms</p>
              <Link to="/farmer/detect">
                <Button variant="primary">
                  <Camera size={18} aria-hidden="true" />
                  Detect Crop Disease
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="farmer-dashboard__quick-actions" aria-labelledby="actions-heading">
        <h2 id="actions-heading" className="sr-only">Quick Actions</h2>
        <div className="farmer-dashboard__actions-grid">
          <Link to="/farmer/detect">
            <Card variant="outlined" className="farmer-dashboard__action-card" onClick={() => {}}>
              <CardContent>
                <div className="action-card__icon">
                  <Camera size={28} aria-hidden="true" />
                </div>
                <h3 className="action-card__title">Detect Crop Disease</h3>
                <p className="action-card__description">Upload crop image for AI health assessment</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/farmer/farms/add">
            <Card variant="outlined" className="farmer-dashboard__action-card" onClick={() => {}}>
              <CardContent>
                <div className="action-card__icon">
                  <Plus size={28} aria-hidden="true" />
                </div>
                <h3 className="action-card__title">Add New Farm</h3>
                <p className="action-card__description">Register a new farm with location & crop</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/farmer/cases">
            <Card variant="outlined" className="farmer-dashboard__action-card" onClick={() => {}}>
              <CardContent>
                <div className="action-card__icon">
                  <FileText size={28} aria-hidden="true" />
                </div>
                <h3 className="action-card__title">View My Cases</h3>
                <p className="action-card__description">Track case status and expert feedback</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
};

FarmerDashboard.displayName = 'FarmerDashboard';

export default FarmerDashboard;