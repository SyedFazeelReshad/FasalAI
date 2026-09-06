import { useState, useMemo } from 'react';
import { Filter, Search, Download, Eye, Edit } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { mockExtensionCases, mockPredictions, mockCrops, mockFarms, mockDiseases } from '../../data/mockData';
import './ExtensionCases.css';

const ExtensionCases = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cropFilter, setCropFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [assignedFilter, setAssignedFilter] = useState('');

  const cropOptions = mockCrops.map(crop => ({ value: crop.id, label: crop.name }));
  const statusOptions = [
    { value: 'draft', label: 'Draft' }, { value: 'submitted', label: 'Submitted' },
    { value: 'under_review', label: 'Under Review' }, { value: 'verified', label: 'Verified' },
    { value: 'rejected', label: 'Rejected' }, { value: 'closed', label: 'Closed' }
  ];
  const riskOptions = [
    { value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }, { value: 'critical', label: 'Critical' }
  ];
  const assignedOptions = [
    { value: 'me', label: 'Assigned to Me' }, { value: 'unassigned', label: 'Unassigned' }
  ];

  const enrichedCases = useMemo(() => {
    return mockExtensionCases.map(caseItem => {
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
        distance: caseItem.distance || '—'
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
      const matchesAssigned = !assignedFilter || 
        (assignedFilter === 'me' && caseItem.assignedTo === 'ext-001') ||
        (assignedFilter === 'unassigned' && !caseItem.assignedTo);
      
      const caseDate = new Date(caseItem.capturedAt);
      const matchesDateFrom = !dateFrom || caseDate >= new Date(dateFrom);
      const matchesDateTo = !dateTo || caseDate <= new Date(dateTo + 'T23:59:59');

      return matchesSearch && matchesCrop && matchesStatus && matchesRisk && matchesAssigned && matchesDateFrom && matchesDateTo;
    });
  }, [enrichedCases, searchTerm, cropFilter, statusFilter, riskFilter, assignedFilter, dateFrom, dateTo]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
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
    { key: 'distance', label: 'Distance', width: '100px', align: 'center' }
  ];

  const clearFilters = () => {
    setSearchTerm(''); setCropFilter(''); setStatusFilter(''); setRiskFilter(''); setAssignedFilter(''); setDateFrom(''); setDateTo('');
  };

  const hasActiveFilters = searchTerm || cropFilter || statusFilter || riskFilter || assignedFilter || dateFrom || dateTo;

  return (
    <div className="extension-cases">
      <header className="extension-cases__header">
        <div>
          <h1 className="extension-cases__title">All Cases</h1>
          <p className="extension-cases__subtitle">{filteredCases.length} of {enrichedCases.length} cases</p>
        </div>
        <Button variant="outline" onClick={() => {}}>
          <Download size={16} aria-hidden="true" />
          Export
        </Button>
      </header>

      <Card variant="outlined" className="extension-cases__filters">
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
                <Input id="search" placeholder="Search cases..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="filter-search__input" />
              </div>
            </div>
            <div className="filter-group">
              <Select label="Crop" placeholder="All crops" options={cropOptions} value={cropFilter} onChange={(e) => setCropFilter(e.target.value)} />
            </div>
            <div className="filter-group">
              <Select label="Status" placeholder="All statuses" options={statusOptions} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
            </div>
            <div className="filter-group">
              <Select label="Risk" placeholder="All risk levels" options={riskOptions} value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} />
            </div>
            <div className="filter-group">
              <Select label="Assigned" placeholder="All" options={assignedOptions} value={assignedFilter} onChange={(e) => setAssignedFilter(e.target.value)} />
            </div>
            <div className="filter-group">
              <label htmlFor="date-from" className="filter-label">Date From</label>
              <Input id="date-from" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="filter-date" />
            </div>
            <div className="filter-group">
              <label htmlFor="date-to" className="filter-label">Date To</label>
              <Input id="date-to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="filter-date" />
            </div>
            <div className="filter-group filter-group--actions">
              <Button variant="outline" onClick={clearFilters} disabled={!hasActiveFilters}>
                <Filter size={16} aria-hidden="true" /> Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card variant="default">
        <CardContent className="cases-table-wrapper">
          <DataTable
            columns={columns}
            data={filteredCases}
            keyField="id"
            sortable
            pagination
            pageSize={15}
            onRowClick={(caseItem) => {}}
            emptyMessage="No cases match your filters"
          />
        </CardContent>
      </Card>
    </div>
  );
};

ExtensionCases.displayName = 'ExtensionCases';

export default ExtensionCases;