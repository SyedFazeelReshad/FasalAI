import { useState, useMemo } from 'react';
import { Filter, Search, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { mockOfficialCases, mockPredictions, mockCrops, mockFarms, mockDiseases } from '../../data/mockData';
import './Cases.css';

const OfficialCases = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cropFilter, setCropFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const cropOptions = mockCrops.map(crop => ({ value: crop.id, label: crop.name }));
  const statusOptions = [
    { value: 'Verified', label: 'Verified' }, { value: 'Under Review', label: 'Under Review' },
    { value: 'Pending', label: 'Pending' }, { value: 'Rejected', label: 'Rejected' }
  ];
  const riskOptions = [
    { value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }, { value: 'critical', label: 'Critical' }
  ];
  const regionOptions = [
    { value: 'North Delhi', label: 'North Delhi' }, { value: 'South Delhi', label: 'South Delhi' },
    { value: 'East Delhi', label: 'East Delhi' }, { value: 'West Delhi', label: 'West Delhi' },
    { value: 'Central Delhi', label: 'Central Delhi' }
  ];

  const enrichedCases = useMemo(() => {
    return mockOfficialCases.map(caseItem => {
      const prediction = mockPredictions.find(p => p.caseId === caseItem.id);
      const crop = mockCrops.find(c => c.id === caseItem.cropId);
      const farm = mockFarms.find(f => f.id === caseItem.farmId);
      const disease = prediction ? mockDiseases.find(d => d.id === prediction.diseaseId) : null;
      return {
        ...caseItem,
        cropName: crop?.name || caseItem.cropId,
        farmName: farm?.name || 'Unknown Farm',
        diseaseName: disease?.name || 'Pending',
        confidence: prediction?.confidence,
        riskLevel: prediction?.riskLevel,
        region: getRegionFromCoords(caseItem.location)
      };
    });
  }, []);

  const filteredCases = useMemo(() => {
    return enrichedCases.filter(caseItem => {
      const matchesSearch = !searchTerm || 
        caseItem.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.diseaseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCrop = !cropFilter || caseItem.cropId === cropFilter;
      const matchesStatus = !statusFilter || caseItem.verificationStatus === statusFilter;
      const matchesRisk = !riskFilter || caseItem.riskLevel?.toLowerCase() === riskFilter;
      const matchesRegion = !regionFilter || caseItem.region === regionFilter;
      
      const caseDate = new Date(caseItem.capturedAt);
      const matchesDateFrom = !dateFrom || caseDate >= new Date(dateFrom);
      const matchesDateTo = !dateTo || caseDate <= new Date(dateTo + 'T23:59:59');

      return matchesSearch && matchesCrop && matchesStatus && matchesRisk && matchesRegion && matchesDateFrom && matchesDateTo;
    });
  }, [enrichedCases, searchTerm, cropFilter, statusFilter, riskFilter, regionFilter, dateFrom, dateTo]);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

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
    switch (status) {
      case 'Verified': return 'status-verified';
      case 'Under Review': return 'status-under_review';
      case 'Pending': return 'status-submitted';
      case 'Rejected': return 'status-rejected';
      default: return 'default';
    }
  };

  const columns = [
    { key: 'id', label: 'Case ID', width: '120px', render: (val) => <span className="case-id">#{val.slice(-8).toUpperCase()}</span> },
    { key: 'farmerName', label: 'Farmer', width: '150px' },
    { key: 'cropName', label: 'Crop', width: '100px' },
    { key: 'diseaseName', label: 'Disease', width: '180px' },
    { key: 'region', label: 'Region', width: '120px' },
    { key: 'confidence', label: 'Confidence', width: '100px', align: 'center', render: (val) => val ? `${Math.round(val * 100)}%` : '—' },
    { key: 'riskLevel', label: 'Risk', width: '100px', align: 'center', render: (val) => <Badge variant={getRiskVariant(val)} size="sm" dot>{val?.toUpperCase()}</Badge> },
    { key: 'verificationStatus', label: 'Status', width: '130px', align: 'center', render: (val) => <Badge variant={getStatusVariant(val)} size="sm">{val}</Badge> },
    { key: 'capturedAt', label: 'Date', width: '120px', align: 'center', render: (val) => formatDate(val) }
  ];

  const clearFilters = () => { setSearchTerm(''); setCropFilter(''); setStatusFilter(''); setRiskFilter(''); setRegionFilter(''); setDateFrom(''); setDateTo(''); };
  const hasActiveFilters = searchTerm || cropFilter || statusFilter || riskFilter || regionFilter || dateFrom || dateTo;

  return (
    <div className="official-cases">
      <header className="official-cases__header">
        <div>
          <h1 className="official-cases__title">All Cases</h1>
          <p className="official-cases__subtitle">{filteredCases.length} of {enrichedCases.length} cases</p>
        </div>
        <Button variant="outline" onClick={() => {}}> <Download size={16} aria-hidden="true" /> Export </Button>
      </header>

      <Card variant="outlined" className="official-cases__filters">
        <CardHeader> <CardTitle>Filters</CardTitle> <CardSubtitle>Refine case search</CardSubtitle> </CardHeader>
        <CardContent>
          <div className="filters-grid">
            <div className="filter-group filter-group--search">
              <label htmlFor="search" className="sr-only">Search cases</label>
              <div className="filter-search">
                <Search size={18} aria-hidden="true" className="filter-search__icon" />
                <Input id="search" placeholder="Search by farmer, crop, disease, case ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="filter-search__input" />
              </div>
            </div>
            <div className="filter-group"> <Select label="Crop" placeholder="All crops" options={cropOptions} value={cropFilter} onChange={(e) => setCropFilter(e.target.value)} /> </div>
            <div className="filter-group"> <Select label="Status" placeholder="All statuses" options={statusOptions} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} /> </div>
            <div className="filter-group"> <Select label="Risk" placeholder="All risk levels" options={riskOptions} value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} /> </div>
            <div className="filter-group"> <Select label="Region" placeholder="All regions" options={regionOptions} value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} /> </div>
            <div className="filter-group"> <label htmlFor="date-from" className="filter-label">Date From</label> <Input id="date-from" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="filter-date" /> </div>
            <div className="filter-group"> <label htmlFor="date-to" className="filter-label">Date To</label> <Input id="date-to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="filter-date" /> </div>
            <div className="filter-group filter-group--actions"> <Button variant="outline" onClick={clearFilters} disabled={!hasActiveFilters}> <Filter size={16} aria-hidden="true" /> Clear Filters </Button> </div>
          </div>
        </CardContent>
      </Card>

      <Card variant="default">
        <CardContent className="cases-table-wrapper">
          <DataTable columns={columns} data={filteredCases} keyField="id" sortable pagination pageSize={20} emptyMessage="No cases match your filters" />
        </CardContent>
      </Card>
    </div>
  );
};

const getRegionFromCoords = (loc) => { if (!loc) return 'Unknown'; if (loc.lat > 28.65) return 'North Delhi'; if (loc.lat < 28.55) return 'South Delhi'; if (loc.lng > 77.3) return 'East Delhi'; if (loc.lng < 77.1) return 'West Delhi'; return 'Central Delhi'; };

OfficialCases.displayName = 'OfficialCases';
export default OfficialCases;