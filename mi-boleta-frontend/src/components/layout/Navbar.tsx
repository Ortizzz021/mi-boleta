import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

interface NavbarProps {
  onToggleTheme: () => void;
  isDark: boolean;
}

export function Navbar({ onToggleTheme, isDark }: NavbarProps) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n ? n[0] : '').join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="navbar-brand-icon">🎟️</span>
        <span className="navbar-brand-text">Mi Boleta</span>
      </Link>

      {isAuthenticated && (
        <>
          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>

          <div className={`navbar-nav ${mobileOpen ? 'open' : ''}`}>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="nav-link-icon">📊</span>
              Dashboard
            </NavLink>
            <NavLink
              to="/tickets"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="nav-link-icon">🎟️</span>
              Mis Boletas
            </NavLink>
            <NavLink
              to="/tickets/new"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="nav-link-icon">➕</span>
              Nueva
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <span className="nav-link-icon">🛡️</span>
                Admin
              </NavLink>
            )}
          </div>
        </>
      )}

      <div className="navbar-actions">
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={isDark ? 'Modo claro' : 'Modo oscuro'}
          title={isDark ? 'Modo claro' : 'Modo oscuro'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        {isAuthenticated && user && (
          <>
            <div className="navbar-user">
              <div className="navbar-user-avatar">{getInitials(user?.name)}</div>
              <span>{user?.name ? user.name.split(' ')[0] : 'Usuario'}</span>
            </div>
            <button className="logout-btn" onClick={logout} title="Cerrar sesión">
              🚪 Salir
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
