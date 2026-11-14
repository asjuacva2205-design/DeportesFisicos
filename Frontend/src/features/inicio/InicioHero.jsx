import React, { useState, useEffect } from 'react';
import { peticion } from '../../shared/api';
import { Trophy, Activity, Target, Database, BarChart3, Users, ChevronRight, Zap, Shield, Sparkles, Flame } from 'lucide-react';

export default function InicioHero({ setPestanaActiva }) {
  const [metricas, setMetricas] = useState(null);
  const [partidosRecientes, setPartidosRecientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      // Traer estadísticas y telemetría en vivo desde la API
      const [resCarga, resPartidos] = await Promise.all([
        peticion('/carga-masiva/'),
        peticion('/partidos/?ordering=-fecha&page=1'),
      ]);

      if (resCarga.ok && resCarga.datos) {
        setMetricas(resCarga.datos);
      }

      if (resPartidos.ok && resPartidos.datos) {
        const lista = resPartidos.datos.results || resPartidos.datos;
        setPartidosRecientes(lista.slice(0, 4));
      }
      setCargando(false);
    };

    cargarDatos();
  }, []);

  return (
    <div>
      {/* SECCIÓN HERO PRINCIPAL CON FONDO DEPORTIVO */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            {/* Badge de Telemetría en Vivo */}
            <div className="hero-live-badge">
              <span className="live-pulse-dot"></span>
              SISTEMA ORM EN VIVO — POSTGRESQL 5433 SINCRONIZADO
            </div>

            <h1 className="hero-title">
              Analítica Deportiva de Alto Rendimiento
              <span className="hero-gradient-text"> Básquetbol & Voleibol</span>
            </h1>

            <p className="hero-subtitle">
              Inteligencia deportiva impulsada por Django REST Framework y PostgreSQL. Cálculos ORM agrupados por dos campos, simulación de pizarras tácticas interactivas y más de 3.800 rendimientos individuales indexados.
            </p>

            {/* Botones de Acción Inmediata */}
            <div className="hero-actions">
              <button className="btn btn-accent hero-btn-main" onClick={() => setPestanaActiva('partidos')}>
                <Activity size={18} /> Explorar Partidos y Resultados
              </button>
              <button className="btn btn-outline hero-btn-sub" onClick={() => setPestanaActiva('pizarra')}>
                <Target size={18} color="#38bdf8" /> Abrir Pizarra Táctica
              </button>
              <button className="btn btn-outline hero-btn-sub" onClick={() => setPestanaActiva('carga_masiva')}>
                <Database size={18} color="#22c55e" /> Centro de Carga Masiva
              </button>
            </div>

            {/* Métricas de Telemetría en Vivo tipo EarthScope */}
            <div className="hero-telemetry-grid">
              <div className="telemetry-card">
                <span className="telemetry-label">Rendimientos ORM</span>
                <span className="telemetry-number" style={{ color: '#38bdf8' }}>
                  {metricas?.estadisticas_individuales ? `${metricas.estadisticas_individuales.toLocaleString()}+` : '3,840+'}
                </span>
                <span className="telemetry-sub">Filas analizadas en DB</span>
              </div>

              <div className="telemetry-card">
                <span className="telemetry-label">Partidos Registrados</span>
                <span className="telemetry-number" style={{ color: '#fb923c' }}>
                  {metricas?.partidos || '390'}
                </span>
                <span className="telemetry-sub">Marcadores oficiales</span>
              </div>

              <div className="telemetry-card">
                <span className="telemetry-label">Franquicias & Clubes</span>
                <span className="telemetry-number" style={{ color: '#4ade80' }}>
                  {metricas?.equipos || '16'}
                </span>
                <span className="telemetry-sub">Ramas Masc. y Fem.</span>
              </div>

              <div className="telemetry-card">
                <span className="telemetry-label">Precisión Estadística</span>
                <span className="telemetry-number" style={{ color: '#a78bfa' }}>
                  100%
                </span>
                <span className="telemetry-sub">Agrupación por 2 campos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN INTERACTIVA DE DISCIPLINAS: BÁSQUETBOL VS VOLEIBOL */}
      <div className="container" style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Disciplinas y Mecánicas de Rendimiento
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '600px', margin: '0.4rem auto 0' }}>
            Reglas diferenciadas oficialmente: canastas de 2 y 3 puntos vs sets al mejor de 5 y bloqueos sobre la red.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {/* Tarjeta Básquetbol */}
          <div className="sport-feature-card sport-card-basket" onClick={() => setPestanaActiva('estadisticas')}>
            <div className="sport-card-glow"></div>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="sport-chip chip-basket">🏀 BALONCESTO NBA</span>
                <Flame size={20} color="#ea580c" />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                Tabloncillo & Anotación Rápida
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Promedios de alta frecuencia (~117 pts Masculino / ~83 pts Femenino). Seguimiento de triples, tiros libres, rebotes ofensivos y asistencias clave.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ea580c', fontWeight: 700, fontSize: '0.88rem' }}>
                Ver Estadísticas de Básquet <ChevronRight size={16} />
              </div>
            </div>
          </div>

          {/* Tarjeta Voleibol */}
          <div className="sport-feature-card sport-card-voley" onClick={() => setPestanaActiva('estadisticas')}>
            <div className="sport-card-glow"></div>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="sport-chip chip-voley">🏐 VOLEIBOL FIVB</span>
                <Zap size={20} color="#0284c7" />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                Taraflex & Dominio en la Red
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Récord de sets oficiales (3-0, 3-1, 3-2). Métricas de eficacia en remates verticales (+95cm), aces de saque, bloqueos directos y salvadas de líbero.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7', fontWeight: 700, fontSize: '0.88rem' }}>
                Ver Estadísticas de Vóley <ChevronRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEED DE ÚLTIMOS RESULTADOS EN VIVO */}
      <div className="container" style={{ marginBottom: '3rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trophy size={20} color="#2563eb" /> Últimos Resultados Sincronizados
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Registros recuperados directamente desde la API REST</span>
            </div>
            <button className="btn btn-outline" style={{ fontSize: '0.82rem' }} onClick={() => setPestanaActiva('partidos')}>
              Ver Todos los Partidos
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {partidosRecientes.map((partido) => {
              const esVoley = partido.deporte_nombre?.toLowerCase().includes('voley');
              return (
                <div key={partido.id} className="mini-scorecard">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="badge" style={{ background: esVoley ? '#e0f2fe' : '#ffedd5', color: esVoley ? '#0369a1' : '#c2410c', fontSize: '0.72rem', fontWeight: 700 }}>
                      {esVoley ? '🏐 Voleibol' : '🏀 Básquetbol'}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{partido.fecha}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>
                      {partido.equipo_local_nombre}
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: partido.puntos_local > partido.puntos_visitante ? '#2563eb' : '#64748b' }}>
                      {partido.puntos_local}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>
                      {partido.equipo_visitante_nombre}
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: partido.puntos_visitante > partido.puntos_local ? '#2563eb' : '#64748b' }}>
                      {partido.puntos_visitante}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
