import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import InicioHero from '../features/inicio/InicioHero';
import ListadoPartidos from '../features/partidos/ListadoPartidos';
import GestionDeportiva from '../features/gestion/GestionDeportiva';
import PanelEstadisticas from '../features/estadisticas/PanelEstadisticas';
import PizarraTacticaSimulator from '../features/pizarra/PizarraTacticaSimulator';
import CargaMasivaView from '../features/carga_masiva/CargaMasivaView';
import ComparadorRendimiento from '../features/rendimiento/ComparadorRendimiento';
import AcercaDe from '../features/acerca_de/AcercaDe';
import LoginModal from '../features/auth/LoginModal';
import CanchaBackground from '../shared/CanchaBackground';
import { getUserInfo } from '../shared/api';

export default function App() {
  const [pestanaActiva, setPestanaActiva] = useState('inicio');
  const [usuario, setUsuario] = useState({ token: null, username: '', isStaff: false });
  const [modalLoginAbierto, setModalLoginAbierto] = useState(false);

  useEffect(() => {
    const info = getUserInfo();
    if (info.token) {
      setUsuario(info);
    }
  }, []);

  return (
    <div className="app-root-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Fondo de Cancha Dividida: Mitad Voleibol & Mitad Básquetbol (Traído desde Git) */}
      <CanchaBackground />

      <Navbar
        pestanaActiva={pestanaActiva}
        setPestanaActiva={setPestanaActiva}
        usuario={usuario}
        setUsuario={setUsuario}
        setModalLoginAbierto={setModalLoginAbierto}
      />

      <main style={{ flex: 1, paddingBottom: '2.5rem', position: 'relative', zIndex: 2 }}>

        {pestanaActiva === 'inicio' && (
          <InicioHero setPestanaActiva={setPestanaActiva} />
        )}

        {pestanaActiva === 'partidos' && (
          <ListadoPartidos
            usuario={usuario}
            setModalLoginAbierto={setModalLoginAbierto}
          />
        )}

        {pestanaActiva === 'gestion' && (
          <GestionDeportiva
            usuario={usuario}
            setModalLoginAbierto={setModalLoginAbierto}
          />
        )}

        {pestanaActiva === 'estadisticas' && (
          <PanelEstadisticas />
        )}

        {pestanaActiva === 'pizarra' && (
          <PizarraTacticaSimulator />
        )}

        {pestanaActiva === 'carga_masiva' && (
          <CargaMasivaView />
        )}

        {pestanaActiva === 'rendimiento' && (
          <ComparadorRendimiento />
        )}

        {pestanaActiva === 'acerca_de' && (
          <AcercaDe />
        )}
      </main>


      <footer style={{ background: '#0f172a', color: '#94a3b8', textAlign: 'center', padding: '1.25rem', fontSize: '0.8rem', borderTop: '1px solid #1e293b' }}>
        <div>
          <strong>CanchaData &copy; 2026</strong> — Plataforma de Analítica para Básquetbol y Voleibol
        </div>
        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
          Plataforma de Alto Rendimiento Deportivo construida con Django 6, DRF, PostgreSQL y React 19.
        </div>
      </footer>

      <LoginModal
        isOpen={modalLoginAbierto}
        onClose={() => setModalLoginAbierto(false)}
        onLoginSuccess={(datos) => {
          setUsuario({ token: datos.token, username: datos.username, isStaff: datos.is_staff });
        }}
      />
    </div>
  );
}
