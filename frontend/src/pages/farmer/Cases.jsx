import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Filter, ChevronDown, Search, FileText, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { CaseCard } from '../../components/ui/CaseCard';
import { mockCases, mockPredictions, mockCrops, mockFarms, mockDiseases } from '../../data/mockData';
import './Cases.css';

const Cases = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [cropFilter, setCropFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [viewMode, setViewMode] = useState('table'); // table, cards

  const cropOptions = mockCrops.map(crop => ({
    value: crop.id,
    label: crop.name
  }));

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'verified', label: 'Verified' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'closed', label: 'Closed' }
  ];

  const riskOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  const enrichedCases = useMemo(() => {
    return mockCases.map(caseItem => {
      const prediction = mockPredictions.find(p => p.caseId === caseItem.id);
      const crop = mockCrops.find(c => c.id === caseItem.cropId);
      const farm = mockFarms.find(f => f.id === caseItem.farmId);
      const disease = prediction ? mockDiseases.find(d => d.id === prediction.diseaseId) : null;
      
      return {
        ...caseItem,
        prediction,
        cropName: crop?.name || caseItem.cropId,
        farmName: farm?.name || 'Unknown Farm',
        diseaseName: disease?.name || 'Pending',
        confidence: prediction?.confidence,
        riskLevel: prediction?.riskLevel,
        imageUrl: caseItem.images?.[0]?.thumbnailUrl
      };
    });
  }, []);

  const filteredCases = useMemo(() => {
    return enrichedCases.filter(caseItem => {
      const matchesSearch = !searchTerm || 
        caseItem.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.diseaseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCrop = !cropFilter || caseItem.cropId === cropFilter;
      const matchesStatus = !statusFilter || caseItem.status === statusFilter;
      const matchesRisk = !riskFilter || caseItem.riskLevel?.toLowerCase() === riskFilter;
      
      const caseDate = new Date(caseItem.capturedAt);
      const matchesDateFrom = !dateFrom || caseDate >= new Date(dateFrom);
      const matchesDateTo = !dateTo || caseDate <= new Date(dateTo + 'T23:59:59');

      return matchesSearch && matchesCrop && matchesStatus && matchesRisk && matchesDateFrom && matchesDateTo;
    });
  }, [enrichedCases, searchTerm, cropFilter, statusFilter, riskFilter, dateFrom, dateTo]);

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

  const columns = [
    { key: 'id', label: 'Case ID', width: '120px', render: (val) => <span className="case-id">#{val.slice(-8).toUpperCase()}</span> },
    { key: 'cropName', label: 'Crop', width: '120px' },
    { key: 'farmName', label: 'Farm', width: '150px' },
    { key: 'diseaseName', label: 'AI Prediction', width: '180px' },
    { key: 'confidence', label: 'Confidence', width: '100px', align: 'center', render: (val) => val ? `${Math.round(val * 100)}%` : '—' },
    { key: 'riskLevel', label: 'Risk', width: '100px', align: 'center', render: (val) => <Badge variant={getRiskVariant(val)} size="sm" dot>{val?.toUpperCase()}</Badge> },
    { key: 'status', label: 'Status', width: '130px', align: 'center', render: (val) => <Badge variant={getStatusVariant(val)} size="sm">{val.replace('_', ' ')}</Badge> },
    { key: 'capturedAt', label: 'Date', width: '120px', align: 'center', render: (val) => formatDate(val) }
  ];

  const handleRowClick = (caseItem) => {
    if (caseItem.prediction) {
      navigate(`/farmer/detection/result/${caseItem.id}`);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCropFilter('');
    setStatusFilter('');
    setRiskFilter('');
    setDateFrom('');
    setDateTo('');
  };

  const hasActiveFilters = cropFilter || statusFilter || riskFilter || dateFrom || dateTo;

  return (
    <div className="cases-page">
      {/* Page Header */}
      <header className="cases-page__header">
        <div className="cases-page__title-section">
          <h1 className="cases-page__title">My Cases</h1>
          <p className="cases-page__subtitle">
            {filteredCases.length} of {enrichedCases.length} cases
          </p>
        </div>
        <Link to="/farmer/detect">
          <Button variant="primary">
            <FileText size={18} aria-hidden="true" />
            New Detection
          </Button>
        </Link>
      </header>

      {/* Filters */}
      <Card variant="outlined" className="cases-page__filters">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardSubtitle>Refine your case search</CardSubtitle>
        </CardHeader>
        <CardContent>
          <div className="filters-grid">
            <div className="filter-group filter-group--search">
              <label htmlFor="search" className="sr-only">Search cases</label>
              <div className="filter-search">
                <Search size={18} aria-hidden="true" className="filter-search__icon" />
                <Input
                  id="search"
                  placeholder="Search by crop, farm, disease, case ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="filter-search__input"
                />
              </div>
            </div>

            <div className="filter-group">
              <Select
                label="Crop"
                placeholder="All crops"
                options={cropOptions}
                value={cropFilter}
                onChange={(e) => setCropFilter(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <Select
                label="Status"
                placeholder="All statuses"
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <Select
                label="Risk Level"
                placeholder="All risk levels"
                options={riskOptions}
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="date-from" className="filter-label">Date From</label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="filter-date"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="date-to" className="filter-label">Date To</label>
              <Input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="filter-date"
              />
            </div>

            <div className="filter-group filter-group--actions">
              <Button variant="outline" onClick={clearFilters} disabled={!hasActiveFilters}>
                <Filter size={16} aria-hidden="true" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle */}
      <div className="cases-page__view-toggle">
        <Button
          variant={viewMode === 'table' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setViewMode('table')}
          aria-pressed={viewMode === 'table'}
        >
          <span className="view-toggle__icon-table" aria-hidden="true">⋮⋮</span>
          Table
        </Button>
        <Button
          variant={viewMode === 'cards' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setViewMode('cards')}
          aria-pressed={viewMode === 'cards'}
        >
          <span className="view-toggle__icon-cards" aria-hidden="true">▦▦</span>
          Cards
        </Button>
      </div>

      {/* Results */}
      <section className="cases-page__results" aria-labelledby="results-heading">
        <h2 id="results-heading" className="sr-only">Cases</h2>
        
        {viewMode === 'table' ? (
          <Card variant="default">
            <CardContent className="cases-table-wrapper">
              <DataTable
                columns={columns}
                data={filteredCases}
                keyField="id"
                sortable
                pagination
                pageSize={10}
                onRowClick={handleRowClick}
                emptyMessage="No cases match your filters"
                loading={false}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="cases-cards-grid">
            {filteredCases.length > 0 ? (
              filteredCases.map(caseItem => (
                <CaseCard
                  key={caseItem.id}
                  caseData={caseItem}
                  variant="card"
                  onClick={() => handleRowClick(caseItem)}
                />
              ))
            ) : (
              <div className="cases-page__empty">
                <FileText size={48} aria-hidden="true" />
                <h3>No cases found</h3>
                <p>Try adjusting your filters or create a new detection</p>
                <Link to="/farmer/detect">
                  <Button variant="primary">
                    <FileText size={18} aria-hidden="true" />
                    New Detection
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

Cases.displayName = 'Cases';

export default Cases;