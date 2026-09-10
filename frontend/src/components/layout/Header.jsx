import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, Moon, Sun, HelpCircle, ChevronDown, Settings, LogOut, Globe } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import './Header.css';

const Header = ({
  title,
  subtitle,
  actions,
  user,
  onProfileClick,
  onSettingsClick,
  onLogout,
  onThemeToggle,
  darkMode = false
}) => {
  const { lang, setLang } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header" role="banner">
      <div className="header__left">
        <div className="header__breadcrumbs">
          {title && <h1 className="header__title">{title}</h1>}
          {subtitle && <p className="header__subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="header__right">
        {actions && (
          <div className="header__actions">
            {actions}
          </div>
        )}

        <div className="header__user-menu">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '8px' }}>
            <Globe size={18} style={{ color: '#16a34a' }} aria-hidden="true" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label="Select Language"
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                color: darkMode ? '#f8fafc' : '#0f172a',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="mr">मराठी (Marathi)</option>
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>

          <button
            className="header__theme-toggle"
            onClick={onThemeToggle}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={darkMode}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            className="header__notification"
            aria-label="Notifications"
            aria-haspopup="true"
          >
            <Bell size={20} aria-hidden="true" />
            <span className="header__notification-badge" aria-hidden="true">3</span>
          </button>

          <button
            className="header__help"
            aria-label="Help and documentation"
          >
            <HelpCircle size={20} aria-hidden="true" />
          </button>

          {user && (
            <div className="header__profile" ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                className="header__profile-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User menu"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <div className="header__profile-avatar" aria-hidden="true">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <ChevronDown size={16} aria-hidden="true" />
              </button>

              {dropdownOpen && (
                <div className="header__profile-dropdown" role="menu">
                  <div className="header__profile-dropdown-header">
                    <div className="header__profile-dropdown-avatar" aria-hidden="true">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="header__profile-dropdown-info">
                      <span className="header__profile-dropdown-name">{user.name}</span>
                      <span className="header__profile-dropdown-email">{user.email}</span>
                    </div>
                  </div>
                  <div className="header__profile-dropdown-divider" />
                  <button 
                    className="header__profile-dropdown-item" 
                    role="menuitem" 
                    onClick={() => { setDropdownOpen(false); if (onProfileClick) onProfileClick(); }}
                  >
                    <User size={16} aria-hidden="true" />
                    <span>Profile</span>
                  </button>
                  <button 
                    className="header__profile-dropdown-item" 
                    role="menuitem" 
                    onClick={() => { setDropdownOpen(false); if (onSettingsClick) onSettingsClick(); }}
                  >
                    <Settings size={16} aria-hidden="true" />
                    <span>Settings</span>
                  </button>
                  <div className="header__profile-dropdown-divider" />
                  <button 
                    className="header__profile-dropdown-item header__profile-dropdown-item--danger" 
                    role="menuitem" 
                    onClick={() => { setDropdownOpen(false); if (onLogout) onLogout(); }}
                  >
                    <LogOut size={16} aria-hidden="true" />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

Header.displayName = 'Header';

export default Header;