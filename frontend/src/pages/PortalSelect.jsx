import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, UserCheck, ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PortalSelect() {
  const navigate = useNavigate();

  const cards = [
    {
      id: 'farmer',
      title: 'Farmer Portal',
      subtitle: 'Kisan Suvidha Kendra',
      desc: 'Upload crop leaf photos, get instant disease detection, dosage calculation, and organic advisories.',
      icon: Sprout,
      badge: 'Real-Time Inference',
      badgeBg: '#ecfdf5',
      badgeText: '#047857',
      accent: '#059669',
      iconBg: '#10b981',
      route: '/farmer/detect',
      action: 'Open Diagnosis Hub'
    },
    {
      id: 'extension',
      title: 'Agronomist & Extension',
      subtitle: 'KVK Field Officer Desk',
      desc: 'Verify flagged disease cases, review uncertain model predictions, and guide regional treatment.',
      icon: UserCheck,
      badge: 'Expert Verification',
      badgeBg: '#fffbeb',
      badgeText: '#b45309',
      accent: '#d97706',
      iconBg: '#f59e0b',
      route: '/extension/dashboard',
      action: 'Access Expert Queue'
    },
    {
      id: 'official',
      title: 'District Official',
      subtitle: 'Outbreak Command Center',
      desc: 'Monitor real-time disease hotspot clusters on maps, analyze trends, and trigger district containment.',
      icon: ShieldAlert,
      badge: 'District Surveillance',
      badgeBg: '#eff6ff',
      badgeText: '#1d4ed8',
      accent: '#2563eb',
      iconBg: '#3b82f6',
      route: '/official/dashboard',
      action: 'View Outbreak Command'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxSizing: 'border-box'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 36px auto' }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
          <img 
            src="/logo.png" 
            alt="FasalAI Logo" 
            style={{ height: '135px', maxWidth: '420px', width: 'auto', objectFit: 'contain', display: 'block' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>

        {/* Hackathon Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: '9999px',
          backgroundColor: '#dcfce7',
          color: '#15803d',
          fontSize: '13px',
          fontWeight: '600',
          marginBottom: '20px',
          border: '1px solid #bbf7d0'
        }}>
          <ShieldCheck size={16} /> Smart India Hackathon Ecosystem
        </div>

        <h1 style={{ fontSize: '36px', fontWeight: '800', margin: '0 0 10px 0', color: '#0f172a', letterSpacing: '-0.5px' }}>
          Unified Command Portal
        </h1>
        <p style={{ color: '#475569', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
          Central gateway linking farmers, field agronomists, and district administration on one platform.
        </p>
      </div>

      {/* Role Cards */}
      <div style={{
        maxWidth: '1140px',
        margin: '0 auto',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              onClick={() => navigate(c.route)}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '28px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = c.accent;
                e.currentTarget.style.boxShadow = '0 16px 24px rgba(15, 23, 42, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.05)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    backgroundColor: c.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}>
                    <Icon size={26} />
                  </div>
                  <span style={{
                    backgroundColor: c.badgeBg,
                    color: c.badgeText,
                    border: `1px solid ${c.badgeText}33`,
                    fontSize: '12px',
                    fontWeight: '700',
                    padding: '5px 12px',
                    borderRadius: '9999px'
                  }}>
                    {c.badge}
                  </span>
                </div>

                <h2 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 4px 0', color: '#0f172a' }}>
                  {c.title}
                </h2>
                <div style={{ fontSize: '12px', color: c.accent, fontWeight: '700', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.5px' }}>
                  {c.subtitle}
                </div>
                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                  {c.desc}
                </p>
              </div>

              <div style={{
                marginTop: '32px',
                paddingTop: '16px',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: c.accent,
                fontWeight: '700',
                fontSize: '14px'
              }}>
                <span>{c.action}</span>
                <ArrowRight size={18} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', marginTop: '40px' }}>
        FasalAI Machine Learning Core • Smart India Hackathon
      </div>
    </div>
  );
}

