import React, { useState } from 'react';
import {
  Activity, BarChart3, Scale, Info, LogIn, LogOut,
  ShieldCheck, Trophy, Users, Home, Target, Database,
  Menu, X
} from 'lucide-react';
import { removeToken } from '../shared/api';

export default function Navbar({ pestanaActiva, setPestanaActiva, usuario, setUsuario, setModalLoginAbierto }) {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  const handleLogout = () => {
    removeToken();
    setUsuario({ token: null, username: '', isStaff: false });
  };

  const cambiarPestana = (pestana) => {
    setPestanaActiva(pestana);
    setMenuMovilAbierto(false);
  };

  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: <Home size={15} /> },
    { id: 'partidos', label: 'Partidos', icon: <Activity size={15} /> },
    { id: 'gestion', label: 'Atletas y Clubes', icon: <Users size={15} /> },
    { id: 'estadisticas', label: 'Estadísticas ORM', icon: <BarChart3 size={15} /> },
    { id: 'pizarra', label: 'Pizarra Táctica', icon: <Target size={15} />, color: '#38bdf8' },
    { id: 'carga_masiva', label: 'Carga Masiva', icon: <Database size={15} />, color: '#4ade80' },
    { id: 'rendimiento', label: 'Comparador', icon: <Scale size={15} /> },
    { id: 'acerca_de', label: 'Acerca de', icon: <Info size={15} /> },
  ];

  return (
    <header className="navbar-container">
      <div className="navbar">
        {/* Marca y Botón de Inicio */}
        <div className="navbar-left">
          <a
            href="#"
            className="navbar-brand"
            onClick={(e) => {
              e.preventDefault();
              cambiarPestana('inicio');
            }}
          >
            <Trophy size={24} color="#38bdf8" />
            <span>CanchaData</span>
            <span className="brand-badge">PRO</span>
          </a>

          {/* Enlaces de navegación para Desktop */}
          <nav className="nav-links desktop-nav">
            {navItems.map((item) => {
              const activo = pestanaActiva === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-tab ${activo ? 'active' : ''}`}
                  onClick={() => cambiarPestana(item.id)}
                  style={item.color && !activo ? { color: item.color } : {}}
                >
                  {item.icon} {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sección derecha: Sesión y Botón Hamburguesa Móvil */}
        <div className="navbar-right">
          {usuario.token ? (
            <div className="user-section">
              <span className="user-badge">
                <ShieldCheck size={16} color="#38bdf8" />
                <strong className="user-badge-name">{usuario.username || 'Admin'}</strong>
              </span>
              <button
                className="btn btn-outline btn-logout"
                onClick={handleLogout}
                title="Cerrar sesión"
              >
                <LogOut size={15} />
                <span className="logout-text">Salir</span>
              </button>
            </div>
          ) : (
            <button
              className="btn btn-accent btn-login"
              onClick={() => setModalLoginAbierto(true)}
            >
              <LogIn size={16} />
              <span className="login-text">Acceder</span>
            </button>
          )}

          {/* Botón Hamburguesa para Móvil y Tablet */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
            aria-label="Abrir menú"
          >
            {menuMovilAbierto ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Barra de navegación rápida deslizable en móvil (Swipeable Pills) */}
      <div className="nav-mobile-pills" role="tablist">
        {navItems.map((item) => {
          const activo = pestanaActiva === item.id;
          return (
            <button
              key={item.id}
              className={`pill-tab ${activo ? 'active' : ''}`}
              onClick={() => cambiarPestana(item.id)}
              style={item.color && !activo ? { color: item.color } : {}}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Menú desplegable completo en Móvil cuando se abre la hamburguesa */}
      {menuMovilAbierto && (
        <div className="mobile-menu-drawer animate-fade-in">
          <div className="mobile-menu-items">
            {navItems.map((item) => {
              const activo = pestanaActiva === item.id;
              return (
                <button
                  key={item.id}
                  className={`mobile-menu-link ${activo ? 'active' : ''}`}
                  onClick={() => cambiarPestana(item.id)}
                  style={item.color && !activo ? { color: item.color } : {}}
                >
                  <span className="mobile-link-icon">{item.icon}</span>
                  <span className="mobile-link-label">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
