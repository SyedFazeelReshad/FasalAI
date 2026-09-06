import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './AppShell.css';

const useAppShell = () => {
  throw new Error('useAppShell must be used within an AppShellProvider');
};

const AppShell = ({ role = 'farmer', user, children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);
  const toggleTheme = () => setDarkMode(prev => !prev);

  return (
    <div className="app-shell">
      <Sidebar 
        role={role} 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={toggleSidebar}
        user={user}
      />
      <div className="app-shell__main" style={{ marginLeft: sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)' }}>
        <Header
          title={null}
          subtitle={null}
          user={user}
          onProfileClick={() => {}}
          onSettingsClick={() => {}}
          onLogout={() => {}}
          onThemeToggle={toggleTheme}
          darkMode={darkMode}
        />
        <main className="app-shell__content" role="main">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

AppShell.displayName = 'AppShell';

export { AppShell, useAppShell };