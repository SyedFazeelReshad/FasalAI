import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sprout, UserCheck, ShieldAlert, LayoutGrid } from 'lucide-react';

export default function RoleSwitcherBanner() {
  const navigate = useNavigate();
  const location = useLocation();

  const isFarmer = location.pathname.includes('/farmer');
  const isExpert = location.pathname.includes('/extension');
  const isOfficial = location.pathname.includes('/official');

  const btnStyle = (active, color) => ({
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: active ? color : '#1e293b',
    color: '#ffffff',
    transition: 'background 0.2s',
  });

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#020617',
      borderBottom: '1px solid #1e293b',
      color: '#cbd5e1',
      padding: '8px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
        <span style={{ color: '#94a3b8' }}>Active Desk:</span>
        <strong style={{ color: '#34d399' }}>
          {isFarmer ? 'Farmer Portal' : isExpert ? 'Agronomist Desk' : isOfficial ? 'Official Outbreak Desk' : 'Unified Hub'}
        </strong>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => navigate('/')} style={btnStyle(false, '#334155')}>
          <LayoutGrid size={14} /> Hub
        </button>
        <button onClick={() => navigate('/farmer/detect')} style={btnStyle(isFarmer, '#059669')}>
          <Sprout size={14} /> Farmer
        </button>
        <button onClick={() => navigate('/extension/dashboard')} style={btnStyle(isExpert, '#d97706')}>
          <UserCheck size={14} /> Agronomist
        </button>
        <button onClick={() => navigate('/official/dashboard')} style={btnStyle(isOfficial, '#2563eb')}>
          <ShieldAlert size={14} /> Official
        </button>
      </div>
    </div>
  );
}
