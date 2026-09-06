import { Badge } from './Badge';

const RiskBadge = ({ level, showLabel = true, size = 'md', className = '' }) => {
  const riskLevels = {
    low: { label: 'Low Risk', variant: 'risk-low' },
    medium: { label: 'Medium Risk', variant: 'risk-medium' },
    high: { label: 'High Risk', variant: 'risk-high' },
    critical: { label: 'Critical Risk', variant: 'risk-critical' },
    unknown: { label: 'Unknown Risk', variant: 'default' }
  };

  const config = riskLevels[level?.toLowerCase()] || riskLevels.unknown;

  return (
    <Badge variant={config.variant} size={size} dot className={className}>
      {showLabel ? config.label : level?.toUpperCase()}
    </Badge>
  );
};

RiskBadge.displayName = 'RiskBadge';

export { RiskBadge };