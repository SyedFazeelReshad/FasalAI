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
      badgeColor: '#065f46',
      badgeText: '#6ee7b7',
      accent: '#10b981',
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
      badgeColor: '#78350f',
      badgeText: '#fde68a',
      accent: '#f59e0b',
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
      badgeColor: '#1e3a8a',
      badgeText: '#bfdbfe',
      accent: '#3b82f6',
      route: '/official/dashboard',
      action: 'View Outbreak Command'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxSizing: 'border-box'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: '9999px',
          backgroundColor: '#064e3b',
          color: '#34d399',
          fontSize: '12px',
          fontWeight: '600',
          marginBottom: '16px'
        }}>
          <ShieldCheck size={16} /> Smart India Hackathon Ecosystem
        </div>
        <h1 style={{ fontSize: '38px', fontWeight: '800', margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>
          FasalAI Unified Command Portal
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
          Central gateway linking farmers, field agronomists, and district administration on one platform.
        </p>
      </div>

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
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '16px',
                padding: '28px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = c.accent;
                e.currentTarget.style.boxShadow = `0 12px 24px rgba(0,0,0,0.4)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = '#334155';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: c.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}>
                    <Icon size={24} />
                  </div>
                  <span style={{
                    backgroundColor: c.badgeColor,
                    color: c.badgeText,
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '4px 10px',
                    borderRadius: '9999px'
                  }}>
                    {c.badge}
                  </span>
                </div>

                <h2 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 4px 0', color: '#f8fafc' }}>
                  {c.title}
                </h2>
                <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '14px' }}>
                  {c.subtitle}
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                  {c.desc}
                </p>
              </div>

              <div style={{
                marginTop: '32px',
                paddingTop: '16px',
                borderTop: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: c.accent,
                fontWeight: '600',
                fontSize: '14px'
              }}>
                <span>{c.action}</span>
                <ArrowRight size={16} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', marginTop: '40px' }}>
        FasalAI Machine Learning Core • Smart India Hackathon
      </div>
    </div>
  );
}
