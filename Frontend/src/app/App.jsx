import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import ListadoPartidos from '../features/partidos/ListadoPartidos';
import GestionDeportiva from '../features/gestion/GestionDeportiva';
import PanelEstadisticas from '../features/estadisticas/PanelEstadisticas';
import ComparadorRendimiento from '../features/rendimiento/ComparadorRendimiento';
import AcercaDe from '../features/acerca_de/AcercaDe';
import LoginModal from '../features/auth/LoginModal';
import { getUserInfo } from '../shared/api';

export default function App() {
  const [pestanaActiva, setPestanaActiva] = useState('partidos');
  const [usuario, setUsuario] = useState({ token: null, username: '', isStaff: false });
  const [modalLoginAbierto, setModalLoginAbierto] = useState(false);

  useEffect(() => {
    const info = getUserInfo();
    if (info.token) {
      setUsuario(info);
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        pestanaActiva={pestanaActiva}
        setPestanaActiva={setPestanaActiva}
        usuario={usuario}
        setUsuario={setUsuario}
        setModalLoginAbierto={setModalLoginAbierto}
      />

      <main style={{ flex: 1, paddingBottom: '2rem' }}>
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
        <div style={{ marginTop: '0.25rem' }}>
          Construido con Django 6, DRF, PostgreSQL y React 19 siguiendo las especificaciones del Taller.
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
