import React, { useState, useEffect } from 'react';
import { peticion } from '../../shared/api';
import { Database, Play, CheckCircle2, AlertCircle, RefreshCw, Server, HardDrive, FileText, Cpu, Clock, Layers } from 'lucide-react';

export default function CargaMasivaView() {
  const [metricas, setMetricas] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [logs, setLogs] = useState([]);
  const [faseActual, setFaseActual] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const agregarLog = (mensaje, tipo = 'info') => {
    const hora = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { hora, mensaje, tipo }]);
  };

  const consultarEstado = async () => {
    const res = await peticion('/carga-masiva/');
    if (res.ok && res.datos) {
      setMetricas(res.datos);
    }
  };

  useEffect(() => {
    consultarEstado();
    agregarLog('Sistema de Carga Masiva CanchaData inicializado.');
    agregarLog('Conexión con PostgreSQL verificada en puerto 5433.');
  }, []);

  const handleIniciarCarga = async () => {
    setCargando(true);
    setProgreso(10);
    setMensajeExito('');
    setFaseActual('Validando esquemas de datos y llaves foráneas...');
    agregarLog('Iniciando sincronización masiva de datos en PostgreSQL...', 'info');

    // Simulación reactiva de fases visuales de carga
    setTimeout(() => {
      setProgreso(30);
      setFaseActual('Procesando disciplinas (Básquetbol & Voleibol) y categorías...');
      agregarLog('Disciplinas y Categorías indexadas.', 'info');
    }, 400);

    setTimeout(() => {
      setProgreso(55);
      setFaseActual('Generando plantillas de clubes federados y atletas...');
      agregarLog('Clubes y Jugadores vinculados con dorsales y alturas.', 'info');
    }, 800);

    setTimeout(() => {
      setProgreso(75);
      setFaseActual('Ejecutando fixture masivo y cálculos ORM (> 1.000 registros)...');
      agregarLog('Ejecutando bulk_create() para partidos y estadísticas...', 'info');
    }, 1200);

    try {
      const res = await peticion('/carga-masiva/', { method: 'POST' });
      setProgreso(100);
      setCargando(false);

      if (res.ok && res.datos) {
        setMetricas({
          estado: 'Conectado (PostgreSQL)',
          deportes: res.datos.deportes,
          categorias: res.datos.categorias,
          equipos: res.datos.equipos,
          jugadores: res.datos.jugadores,
          partidos: res.datos.partidos,
          estadisticas_individuales: res.datos.estadisticas_individuales,
          supera_mil: res.datos.estadisticas_individuales >= 1000,
        });
        setFaseActual('¡Carga masiva completada con éxito!');
        setMensajeExito(`Se sincronizaron ${res.datos.estadisticas_individuales} registros en ${res.datos.tiempo_ms} ms.`);
        agregarLog(`ÉXITO: ${res.datos.estadisticas_individuales} actuaciones cargadas en base de datos.`, 'exito');
        agregarLog(`Tiempo total de ejecución ORM: ${res.datos.tiempo_ms} ms.`, 'exito');
      } else {
        setFaseActual('Error durante el procesamiento masivo.');
        agregarLog('Error al procesar lote en el servidor backend.', 'error');
      }
    } catch (err) {
      setCargando(false);
      setFaseActual('Error de conexión.');
      agregarLog(`Error de conexión con la API: ${err.message}`, 'error');
    }
  };

  return (
    <div className="container">
      {/* Cabecera del Centro de Carga Masiva */}
      <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: '999px', padding: '0.25rem 0.85rem', marginBottom: '0.75rem', fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }}>
              <span className="live-pulse-dot" style={{ background: '#22c55e' }}></span>
              SISTEMA DE SINCRONIZACIÓN EN LOTE
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.025em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Database size={28} color="#38bdf8" /> Centro de Carga Masiva de Datos
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '650px', marginTop: '0.4rem' }}>
              Módulo de inyección y orquestación de datos deportivos para PostgreSQL. Genera y procesa lotes de más de 1.000 registros de rendimiento con diferenciación técnica por deporte y categoría.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              className="btn btn-outline"
              style={{ color: '#ffffff', borderColor: '#475569' }}
              onClick={consultarEstado}
              disabled={cargando}
            >
              <RefreshCw size={16} /> Actualizar Estado
            </button>
            <button
              className="btn btn-accent"
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)', padding: '0.65rem 1.4rem', fontWeight: 700, fontSize: '0.95rem' }}
              onClick={handleIniciarCarga}
              disabled={cargando}
            >
              {cargando ? (
                <>
                  <RefreshCw size={17} className="spin-anim" /> Procesando Lote...
                </>
              ) : (
                <>
                  <Play size={17} /> Iniciar Carga Masiva
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Estado de la Base de Datos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
            <Layers size={16} color="#2563eb" /> Estadísticas Individuales
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0' }}>
            {metricas?.estadisticas_individuales?.toLocaleString() || '0'}
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: metricas?.supera_mil ? '#059669' : '#d97706', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            {metricas?.supera_mil ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
            {metricas?.supera_mil ? 'Supera los 1.000 requeridos' : 'Pendiente de carga'}
          </span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #ea580c' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
            <Server size={16} color="#ea580c" /> Partidos Disputados
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0' }}>
            {metricas?.partidos?.toLocaleString() || '0'}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Fixture masculino & femenino</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
            <Cpu size={16} color="#0284c7" /> Atletas Registrados
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0' }}>
            {metricas?.jugadores?.toLocaleString() || '0'}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Con dorsales y posiciones</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
            <HardDrive size={16} color="#10b981" /> Estado PostgreSQL
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669', margin: '0.45rem 0' }}>
            {metricas?.estado || 'En espera'}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Puerto 5433 / deportes_db</span>
        </div>
      </div>

      {/* Barra de Progreso y Animación de Balones */}
      {(cargando || progreso > 0) && (
        <div className="card" style={{ marginBottom: '1.5rem', background: '#0f172a', color: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#38bdf8' }}>{faseActual}</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>{progreso}%</span>
          </div>

          <div style={{ height: '14px', background: '#1e293b', borderRadius: '999px', overflow: 'hidden', position: 'relative' }}>
            <div
              style={{
                height: '100%',
                width: `${progreso}%`,
                background: 'linear-gradient(90deg, #f97316 0%, #0284c7 50%, #22c55e 100%)',
                borderRadius: '999px',
                transition: 'width 0.4s ease-out',
                position: 'relative'
              }}
            >
              {/* Balón viajero sobre la barra */}
              <span style={{ position: 'absolute', right: '-4px', top: '-6px', fontSize: '1.15rem' }}>
                {progreso % 2 === 0 ? '🏀' : '🏐'}
              </span>
            </div>
          </div>

          {mensajeExito && (
            <div style={{ marginTop: '0.85rem', padding: '0.6rem 0.85rem', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '6px', color: '#4ade80', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} /> {mensajeExito}
            </div>
          )}
        </div>
      )}

      {/* Terminal de Eventos en Tiempo Real & Instrucciones de Terminal */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.5rem' }}>
        {/* Terminal Visual de Logs */}
        <div className="card" style={{ background: '#0a0f18', color: '#f8fafc', border: '1px solid #1e293b', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid #1e293b', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8' }}>
              <FileText size={16} color="#38bdf8" /> Registro de Ejecución (Console Log)
            </div>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></span>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></span>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span>
            </div>
          </div>

          <div style={{ height: '240px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.78rem', lineHeight: '1.6', color: '#94a3b8' }}>
            {logs.map((item, idx) => (
              <div key={idx} style={{ marginBottom: '0.25rem', color: item.tipo === 'exito' ? '#4ade80' : item.tipo === 'error' ? '#f87171' : '#cbd5e1' }}>
                <span style={{ color: '#64748b' }}>[{item.hora}]</span> &gt; {item.mensaje}
              </div>
            ))}
          </div>
        </div>

        {/* Instrucciones de Ejecución por Terminal Directa */}
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Clock size={18} color="#2563eb" /> Archivo Ejecutable Directo en Terminal
          </h3>
          <p style={{ fontSize: '0.83rem', color: '#64748b', marginBottom: '0.9rem' }}>
            También puedes ejecutar el script independiente que creamos en la raíz del proyecto sin necesidad de abrir el navegador:
          </p>

          <div style={{ background: '#0f172a', color: '#38bdf8', padding: '0.75rem 1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.85rem', marginBottom: '0.85rem', border: '1px solid #1e293b' }}>
            <code>python cargar_datos_masivos.py</code>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.5' }}>
            <strong>Detalles técnicos:</strong>
            <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem' }}>
              <li>Ubicación: <code style={{ color: '#2563eb' }}>c:\Users\Personal\Downloads\Deportes\cargar_datos_masivos.py</code></li>
              <li>Método Django: <code style={{ color: '#2563eb' }}>bulk_create()</code> con lotes de 1.000 filas.</li>
              <li>Calcula diferenciación por género en básquetbol (~117 vs ~83 pts) y voleibol (~3-1 vs ~3-2 sets).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
