import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronLeft, ChevronRight, Home, Camera, MapPin, FileText, User, Settings, LogOut, BarChart2, Map, TrendingUp, AlertTriangle, ClipboardCheck, CheckCircle } from 'lucide-react';
import './Sidebar.css';

const navigation = {
  farmer: [
    { path: '/farmer/dashboard', label: 'Dashboard', icon: Home },
    { path: '/farmer/detect', label: 'Detect', icon: Camera },
    { path: '/farmer/farms', label: 'My Farms', icon: MapPin },
    { path: '/farmer/cases', label: 'My Cases', icon: FileText },
    { path: '/farmer/settings', label: 'Settings', icon: Settings }
  ],
  extension: [
    { path: '/extension/dashboard', label: 'Dashboard', icon: Home },
    { path: '/extension/cases', label: 'All Cases', icon: ClipboardCheck },
    { path: '/extension/cases/pending', label: 'Pending Review', icon: AlertTriangle },
    { path: '/extension/verified', label: 'Verified Cases', icon: CheckCircle },
    { path: '/extension/settings', label: 'Settings', icon: Settings }
  ],
  official: [
    { path: '/official/dashboard', label: 'Dashboard', icon: Home },
    { path: '/official/cases', label: 'Cases', icon: FileText },
    { path: '/official/trends', label: 'Disease Trends', icon: TrendingUp },
    { path: '/official/hotspots', label: 'Hotspot Map', icon: Map },
    { path: '/official/risk-areas', label: 'High-Risk Areas', icon: AlertTriangle },
    { path: '/official/reports', label: 'Reports', icon: BarChart2 },
    { path: '/official/settings', label: 'Settings', icon: Settings }
  ]
};

const Sidebar = ({ role = 'farmer', collapsed = false, onToggleCollapse, user }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = navigation[role] || navigation.farmer;

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <button
        className="sidebar__mobile-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={mobileOpen}
      >
        <Menu size={24} aria-hidden="true" />
      </button>

      {mobileOpen && (
        <div
          className="sidebar__backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${mobileOpen ? 'sidebar--mobile-open' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="sidebar__header">
          {!collapsed && (
            <div className="sidebar__brand">
              <Link to={`/${role}/dashboard`} className="sidebar__logo" aria-label="FasalAI Home">
                <div className="sidebar__logo-icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
                    <rect width="32" height="32" rx="8" fill="currentColor"/>
                    <path d="M8 20C8 16.6863 10.6863 14 14 14C17.3137 14 20 16.6863 20 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 14V8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 12H18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="14" cy="22" r="2" fill="white"/>
                  </svg>
                </div>
                <span className="sidebar__logo-text">FasalAI</span>
              </Link>
              <p className="sidebar__tagline">AI-Powered Crop Health Intelligence</p>
            </div>
          )}
          {collapsed && (
            <Link to={`/${role}/dashboard`} className="sidebar__logo sidebar__logo--collapsed" aria-label="FasalAI Home">
              <div className="sidebar__logo-icon" aria-hidden="true">
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                  <rect width="32" height="32" rx="8" fill="currentColor"/>
                  <path d="M8 20C8 16.6863 10.6863 14 14 14C17.3137 14 20 16.6863 20 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 14V8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 12H18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="14" cy="22" r="2" fill="white"/>
                </svg>
              </div>
            </Link>
          )}
          <button
            className="sidebar__toggle"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="sidebar__nav">
          <ul className="sidebar__nav-list" role="list">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== `/${role}/dashboard` && location.pathname.startsWith(item.path));
              const Icon = item.icon;
              return (
                <li key={item.path} className="sidebar__nav-item">
                  <Link
                    to={item.path}
                    className={`sidebar__nav-link ${isActive ? 'sidebar__nav-link--active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="sidebar__nav-icon" aria-hidden="true">
                      <Icon size={20} />
                    </span>
                    {!collapsed && <span className="sidebar__nav-label">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {!collapsed && user && (
          <div className="sidebar__footer">
            <div className="sidebar__user">
              <div className="sidebar__user-avatar" aria-hidden="true">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="sidebar__user-info">
                <span className="sidebar__user-name">{user.name}</span>
                <span className="sidebar__user-role">{role.charAt(0).toUpperCase() + role.slice(1)}</span>
              </div>
            </div>
            <button className="sidebar__logout" aria-label="Log out">
              <LogOut size={18} aria-hidden="true" />
              <span className="sidebar__logout-label">Log out</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

Sidebar.displayName = 'Sidebar';

export default Sidebar;