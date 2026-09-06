import { Bell, User, Moon, Sun, HelpCircle, ChevronDown, Settings, LogOut } from 'lucide-react';
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
            <div className="header__profile">
              <button
                className="header__profile-trigger"
                onClick={onProfileClick}
                aria-label="User menu"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <div className="header__profile-avatar" aria-hidden="true">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <ChevronDown size={16} aria-hidden="true" />
              </button>

              <div className="header__profile-dropdown" role="menu">
                <div className="header__profile-dropdown-header">
                  <div className="header__profile-dropdown-avatar" aria-hidden="true">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="header__profile-dropdown-info">
                    <span className="header__profile-dropdown-name">{user.name}</span>
                    <span className="header__profile-dropdown-email">{user.email}</span>
                  </div>
                </div>
                <div className="header__profile-dropdown-divider" />
                <button className="header__profile-dropdown-item" role="menuitem" onClick={onProfileClick}>
                  <User size={16} aria-hidden="true" />
                  <span>Profile</span>
                </button>
                <button className="header__profile-dropdown-item" role="menuitem" onClick={onSettingsClick}>
                  <Settings size={16} aria-hidden="true" />
                  <span>Settings</span>
                </button>
                <div className="header__profile-dropdown-divider" />
                <button className="header__profile-dropdown-item header__profile-dropdown-item--danger" role="menuitem" onClick={onLogout}>
                  <LogOut size={16} aria-hidden="true" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

Header.displayName = 'Header';

export default Header;