import { forwardRef, useEffect, useMemo, useState } from 'react';
import { ChevronUp, ChevronDown, ChevronRight } from 'lucide-react';
import './DataTable.css';

const DataTable = forwardRef(({
  columns = [],
  data = [],
  keyField = 'id',
  sortable = true,
  filterable = false,
  pagination = true,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  selectionMode = 'none',
  selectedRows = [],
  onSelectionChange,
  className = '',
  ...props
}, ref) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [localPageSize, setLocalPageSize] = useState(pageSize);

  const sortedData = useMemo(() => {
    if (!sortable || !sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig, sortable]);

  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * localPageSize;
    return sortedData.slice(start, start + localPageSize);
  }, [sortedData, pagination, currentPage, localPageSize]);

  const totalPages = Math.ceil(sortedData.length / localPageSize) || 1;

  const handleSort = (key) => {
    if (!sortable) return;
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (e) => {
    if (selectionMode !== 'multiple') return;
    if (e.target.checked) {
      onSelectionChange?.(paginatedData.map(row => row[keyField]));
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleRowSelect = (rowId, e) => {
    if (selectionMode === 'none') return;
    e.stopPropagation();
    const newSelection = selectedRows.includes(rowId)
      ? selectedRows.filter(id => id !== rowId)
      : [...selectedRows, rowId];
    onSelectionChange?.(newSelection);
  };

  const handleRowClick = (row, e) => {
    if (selectionMode !== 'none' && e.target.type === 'checkbox') return;
    onRowClick?.(row);
  };

  const renderCell = (row, column) => {
    if (column.render) {
      return column.render(row[column.key], row);
    }
    return row[column.key] ?? '';
  };

  return (
    <div className={`datatable ${className}`} ref={ref} {...props}>
      <div className="datatable__container">
        <table className="datatable__table" role="grid">
          <thead>
            <tr className="datatable__header-row">
              {selectionMode === 'multiple' && (
                <th className="datatable__header-cell datatable__header-cell--checkbox" scope="col">
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && paginatedData.every(row => selectedRows.includes(row[keyField]))}
                    indeterminate={paginatedData.length > 0 && paginatedData.some(row => selectedRows.includes(row[keyField])) && !paginatedData.every(row => selectedRows.includes(row[keyField]))}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`datatable__header-cell ${column.align ? `datatable__header-cell--${column.align}` : ''} ${sortable && column.sortable !== false ? 'datatable__header-cell--sortable' : ''}`}
                  scope="col"
                  onClick={() => handleSort(column.key)}
                  style={{ width: column.width }}
                >
                  <div className="datatable__header-content">
                    <span>{column.label}</span>
                    {sortable && column.sortable !== false && sortConfig.key === column.key && (
                      <span className="datatable__sort-icon" aria-hidden="true">
                        {sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {onRowClick && (
                <th className="datatable__header-cell datatable__header-cell--actions" scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="datatable__body">
            {loading ? (
              <tr className="datatable__row datatable__row--loading">
                <td colSpan={columns.length + (selectionMode === 'multiple' ? 1 : 0) + (onRowClick ? 1 : 0)}>
                  <div className="datatable__loading">
                    <div className="datatable__loading-spinner" aria-hidden="true" />
                    <span>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr className="datatable__row datatable__row--empty">
                <td colSpan={columns.length + (selectionMode === 'multiple' ? 1 : 0) + (onRowClick ? 1 : 0)}>
                  <div className="datatable__empty">
                    <ChevronRight size={32} aria-hidden="true" />
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={row[keyField]}
                  className={`datatable__row ${onRowClick ? 'datatable__row--clickable' : ''} ${selectedRows.includes(row[keyField]) ? 'datatable__row--selected' : ''}`}
                  onClick={(e) => handleRowClick(row, e)}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={onRowClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRowClick(row); }} : undefined}
                >
                  {selectionMode === 'multiple' && (
                    <td className="datatable__cell datatable__cell--checkbox">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row[keyField])}
                        onChange={(e) => handleRowSelect(row[keyField], e)}
                        aria-label={`Select row ${row[keyField]}`}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`datatable__cell ${column.align ? `datatable__cell--${column.align}` : ''}`}
                    >
                      {renderCell(row, column)}
                    </td>
                  ))}
                  {onRowClick && (
                    <td className="datatable__cell datatable__cell--actions">
                      <ChevronRight size={16} aria-hidden="true" className="datatable__chevron" />
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="datatable__pagination">
          <div className="datatable__pagination-info">
            Showing {Math.min((currentPage - 1) * localPageSize + 1, sortedData.length)} to {Math.min(currentPage * localPageSize, sortedData.length)} of {sortedData.length} results
          </div>
          <div className="datatable__pagination-controls">
            <select
              value={localPageSize}
              onChange={(e) => {
                setLocalPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="datatable__page-size"
              aria-label="Rows per page"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>{size} per page</option>
              ))}
            </select>
            <div className="datatable__page-buttons">
              <button
                className="datatable__page-btn"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} aria-hidden="true" />
              </button>
              <span className="datatable__page-indicator" aria-live="polite">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="datatable__page-btn"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

DataTable.displayName = 'DataTable';

export { DataTable };