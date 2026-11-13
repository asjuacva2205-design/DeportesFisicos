import React from 'react';
import { Activity, BarChart3, Scale, Info, LogIn, LogOut, ShieldCheck, Trophy, Users } from 'lucide-react';
import { removeToken } from '../shared/api';

export default function Navbar({ pestanaActiva, setPestanaActiva, usuario, setUsuario, setModalLoginAbierto }) {
  const handleLogout = () => {
    removeToken();
    setUsuario({ token: null, username: '', isStaff: false });
  };

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <a href="#" className="navbar-brand" onClick={(e) => { e.preventDefault(); setPestanaActiva('partidos'); }}>
          <Trophy size={24} color="#38bdf8" />
          <span>CanchaData</span>
          <span className="brand-badge">PRO</span>
        </a>

        <nav className="nav-links">
          <button
            className={`nav-tab ${pestanaActiva === 'partidos' ? 'active' : ''}`}
            onClick={() => setPestanaActiva('partidos')}
          >
            <Activity size={16} /> Partidos
          </button>

          <button
            className={`nav-tab ${pestanaActiva === 'gestion' ? 'active' : ''}`}
            onClick={() => setPestanaActiva('gestion')}
          >
            <Users size={16} /> Atletas y Clubes
          </button>

          <button
            className={`nav-tab ${pestanaActiva === 'estadisticas' ? 'active' : ''}`}
            onClick={() => setPestanaActiva('estadisticas')}
          >
            <BarChart3 size={16} /> Estadísticas ORM
          </button>

          <button
            className={`nav-tab ${pestanaActiva === 'rendimiento' ? 'active' : ''}`}
            onClick={() => setPestanaActiva('rendimiento')}
          >
            <Scale size={16} /> Comparador Cara a Cara
          </button>

          <button
            className={`nav-tab ${pestanaActiva === 'acerca_de' ? 'active' : ''}`}
            onClick={() => setPestanaActiva('acerca_de')}
          >
            <Info size={16} /> Acerca del Proyecto
          </button>
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {usuario.token ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="user-badge">
              <ShieldCheck size={16} color="#38bdf8" />
              <strong>{usuario.username || 'Admin'}</strong>
            </span>
            <button className="btn btn-outline" style={{ color: '#ffffff', borderColor: '#334155', padding: '0.35rem 0.75rem' }} onClick={handleLogout}>
              <LogOut size={15} /> Salir
            </button>
          </div>
        ) : (
          <button className="btn btn-accent" onClick={() => setModalLoginAbierto(true)}>
            <LogIn size={16} /> Iniciar Sesión
          </button>
        )}
      </div>
    </header>
  );
}
