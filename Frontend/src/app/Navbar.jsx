import React, { useState, useEffect, useRef } from 'react';
import {
  Activity, BarChart3, Scale, Info, LogIn, LogOut,
  ShieldCheck, Trophy, Users, Home, Target, Database,
  Menu, X
} from 'lucide-react';
import { removeToken } from '../shared/api';

export default function Navbar({ pestanaActiva, setPestanaActiva, usuario, setUsuario, setModalLoginAbierto }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef(null);

  // Cerrar el menú si se hace clic afuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAbierto(false);
      }
    }
    if (menuAbierto) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuAbierto]);

  const handleLogout = () => {
    removeToken();
    setUsuario({ token: null, username: '', isStaff: false });
    setMenuAbierto(false);
  };

  const seleccionarPestana = (pestana) => {
    setPestanaActiva(pestana);
    setMenuAbierto(false);
  };

  const opciones = [
    { id: 'inicio', label: 'Inicio', icon: <Home size={16} /> },
    { id: 'partidos', label: 'Partidos', icon: <Activity size={16} /> },
    { id: 'gestion', label: 'Atletas y Clubes', icon: <Users size={16} /> },
    { id: 'estadisticas', label: 'Estadísticas ORM', icon: <BarChart3 size={16} /> },
    { id: 'pizarra', label: 'Pizarra Táctica', icon: <Target size={16} color="#38bdf8" /> },
    { id: 'carga_masiva', label: 'Carga Masiva', icon: <Database size={16} color="#4ade80" /> },
    { id: 'rendimiento', label: 'Comparador', icon: <Scale size={16} /> },
    { id: 'acerca_de', label: 'Acerca de', icon: <Info size={16} /> },
  ];

  return (
    <header className="navbar-wrapper" ref={menuRef}>
      <div className="navbar-inner">
        {/* Lado Izquierdo: Marca CanchaData */}
        <a
          href="#"
          className="navbar-brand-logo"
          onClick={(e) => {
            e.preventDefault();
            seleccionarPestana('inicio');
          }}
        >
          <Trophy size={22} color="#38bdf8" />
          <span className="brand-text">CanchaData</span>
          <span className="brand-badge-pill">PRO</span>
        </a>

        {/* Centro Desktop: Pestañas horizontales (ocultas en celular) */}
        <nav className="desktop-navbar-nav">
          {opciones.map((item) => {
            const activa = pestanaActiva === item.id;
            return (
              <button
                key={item.id}
                className={`desktop-nav-btn ${activa ? 'active' : ''}`}
                onClick={() => seleccionarPestana(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Lado Derecho Desktop: Botón de Sesión (oculto en celular para usar el menú) */}
        <div className="desktop-auth-section">
          {usuario.token ? (
            <div className="auth-logged-box">
              <span className="auth-user-chip">
                <ShieldCheck size={15} color="#38bdf8" />
                <span>{usuario.username || 'Admin'}</span>
              </span>
              <button className="btn-auth-action logout" onClick={handleLogout}>
                <LogOut size={14} /> Salir
              </button>
            </div>
          ) : (
            <button className="btn-auth-action login" onClick={() => setModalLoginAbierto(true)}>
              <LogIn size={15} /> Iniciar Sesión
            </button>
          )}
        </div>

        {/* Esquina Superior Derecha Móvil: ÚNICO Botón Desplegable (Hamburguesa) */}
        <div className="mobile-corner-box">
          <button
            className={`mobile-menu-corner-btn ${menuAbierto ? 'open' : ''}`}
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Abrir menú de opciones"
            aria-expanded={menuAbierto}
          >
            {menuAbierto ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menú Desplegable Flotante Anclado a la Esquina Superior Derecha en Celular */}
      {menuAbierto && (
        <div className="mobile-corner-dropdown-menu">
          <div className="dropdown-header-status">
            {usuario.token ? (
              <div className="dropdown-user-info">
                <ShieldCheck size={16} color="#38bdf8" />
                <div>
                  <div className="dropdown-user-name">{usuario.username || 'Admin'}</div>
                  <div className="dropdown-user-role">Superusuario Activo</div>
                </div>
              </div>
            ) : (
              <div className="dropdown-guest-info">
                <span>Modo Consulta</span>
              </div>
            )}
          </div>

          <div className="dropdown-links-list">
            {opciones.map((item) => {
              const activa = pestanaActiva === item.id;
              return (
                <button
                  key={item.id}
                  className={`dropdown-item-btn ${activa ? 'active' : ''}`}
                  onClick={() => seleccionarPestana(item.id)}
                >
                  <span className="dropdown-item-icon">{item.icon}</span>
                  <span className="dropdown-item-text">{item.label}</span>
                  {activa && <span className="dropdown-active-dot" />}
                </button>
              );
            })}
          </div>

          <div className="dropdown-auth-footer">
            {usuario.token ? (
              <button className="dropdown-auth-btn logout" onClick={handleLogout}>
                <LogOut size={16} /> Cerrar Sesión
              </button>
            ) : (
              <button
                className="dropdown-auth-btn login"
                onClick={() => {
                  setMenuAbierto(false);
                  setModalLoginAbierto(true);
                }}
              >
                <LogIn size={16} /> Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
