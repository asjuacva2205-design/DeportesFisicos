import React, { useState, useEffect } from 'react';
import { peticion } from '../../shared/api';
import { Scale, Users, Shield, Zap, Sparkles, HelpCircle, CheckCircle } from 'lucide-react';

export default function ComparadorRendimiento() {
  const [jugadores, setJugadores] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [deporteFiltro, setDeporteFiltro] = useState('BASKET');
  const [categoriaFiltro, setCategoriaFiltro] = useState('MASC');

  // Selección de comparación
  const [id1, setId1] = useState('');
  const [id2, setId2] = useState('');
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // Cargar jugadores según deporte y categoría
  useEffect(() => {
    async function cargarJugadores() {
      const res = await peticion(`/jugadores/?deporte=${deporteFiltro}&categoria=${categoriaFiltro}`);
      if (res.ok && res.datos) {
        const lista = res.datos.results || res.datos;
        setJugadores(lista);
        if (lista.length >= 2) {
          setId1(lista[0].id);
          setId2(lista[1].id);
        }
      }
    }
    cargarJugadores();
  }, [deporteFiltro, categoriaFiltro]);

  // Ejecutar comparación
  const handleComparar = async () => {
    if (!id1 || !id2) return;
    setCargando(true);
    setError('');

    const res = await peticion('/rendimiento/comparar/', {
      method: 'POST',
      body: JSON.stringify({
        tipo: 'jugadores',
        id1: Number(id1),
        id2: Number(id2),
      }),
    });

    setCargando(false);
    if (res.ok && res.datos) {
      setResultado(res.datos);
    } else {
      setError(res.datos?.detalle || 'Error al procesar la comparación.');
    }
  };

  useEffect(() => {
    if (id1 && id2 && id1 !== id2) {
      handleComparar();
    }
  }, [id1, id2]);

  const j1 = resultado?.jugador_1;
  const j2 = resultado?.jugador_2;
  const esVoley = deporteFiltro === 'VOLEY';

  const val1 = Number(j1?.estadisticas?.promedio_valoracion || 0);
  const val2 = Number(j2?.estadisticas?.promedio_valoracion || 0);

  return (
    <div className="container">
      {/* Encabezado */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <Scale size={24} color="#f97316" /> Herramienta Exclusiva: Comparador Cara a Cara
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
              Evalúa el rendimiento individual de jugadores dentro de una misma disciplina y categoría mediante métricas explicables.
            </p>
          </div>
          <span className="brand-badge" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
            CanchaData Analytics
          </span>
        </div>

        {/* Filtros de disciplina y género */}
        <div className="filters-bar">
          <div className="filter-group">
            <label className="filter-label">Disciplina Deportiva</label>
            <select
              className="form-select"
              value={deporteFiltro}
              onChange={(e) => setDeporteFiltro(e.target.value)}
            >
              <option value="BASKET">Básquetbol</option>
              <option value="VOLEY">Voleibol</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Rama / Género</label>
            <select
              className="form-select"
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
            >
              <option value="MASC">Masculino</option>
              <option value="FEM">Femenino</option>
            </select>
          </div>

          <div className="filter-group" style={{ flex: '1 1 200px' }}>
            <label className="filter-label">Jugador 1</label>
            <select
              className="form-select"
              style={{ width: '100%' }}
              value={id1}
              onChange={(e) => setId1(e.target.value)}
            >
              {jugadores.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.nombre} ({j.equipo_nombre} - #{j.dorsal})
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group" style={{ flex: '1 1 200px' }}>
            <label className="filter-label">Jugador 2</label>
            <select
              className="form-select"
              style={{ width: '100%' }}
              value={id2}
              onChange={(e) => setId2(e.target.value)}
            >
              {jugadores.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.nombre} ({j.equipo_nombre} - #{j.dorsal})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Fórmula explicada */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '1rem', marginTop: '0.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <Sparkles size={20} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#166534', fontSize: '0.9rem', display: 'block' }}>
              Fórmula de Valoración Explicable:
            </strong>
            <p style={{ fontSize: '0.85rem', color: '#15803d', margin: '0.25rem 0' }}>
              {resultado?.formula_explicada || 'Cargando fórmula para esta disciplina...'}
            </p>
            <span style={{ fontSize: '0.75rem', color: '#166534' }}>
              Las métricas no inventan una calificación: premian aportaciones positivas y descuentan errores técnicos en cancha.
            </span>
          </div>
        </div>
      </div>

      {/* Tarjetas Cara a Cara */}
      {resultado && j1 && j2 && (
        <div className="comparator-grid">
          {/* Jugador 1 */}
          <div className={`comparator-card ${val1 >= val2 ? 'winner' : ''}`}>
            {val1 >= val2 && (
              <span className="badge" style={{ background: '#dcfce7', color: '#15803d', marginBottom: '0.75rem' }}>
                <CheckCircle size={14} /> Mayor Rendimiento
              </span>
            )}
            <h3 style={{ fontSize: '1.3rem', color: '#1e3a8a' }}>{j1.nombre}</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>
              #{j1.dorsal} · {j1.posicion} · <strong>{j1.equipo}</strong>
            </p>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Índice CanchaData</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: val1 >= val2 ? '#10b981' : '#1e3a8a' }}>
                {val1.toFixed(1)} <span style={{ fontSize: '1rem', fontWeight: 500 }}>pts</span>
              </div>
            </div>

            {/* Métricas detalladas */}
            <div style={{ textAlign: 'left' }}>
              <div className="metric-row">
                <span>Partidos disputados:</span>
                <strong>{j1.estadisticas.partidos_jugados}</strong>
              </div>
              <div className="metric-row">
                <span>Promedio Puntos:</span>
                <strong style={{ color: '#1e3a8a' }}>{Number(j1.estadisticas.promedio_puntos || 0).toFixed(1)}</strong>
              </div>

              {!esVoley ? (
                <>
                  <div className="metric-row">
                    <span>Rebotes / partido:</span>
                    <strong>{Number(j1.estadisticas.promedio_rebotes || 0).toFixed(1)}</strong>
                  </div>
                  <div className="metric-row">
                    <span>Asistencias / partido:</span>
                    <strong>{Number(j1.estadisticas.promedio_asistencias || 0).toFixed(1)}</strong>
                  </div>
                  <div className="metric-row">
                    <span>Robos de balón:</span>
                    <strong>{Number(j1.estadisticas.promedio_robos || 0).toFixed(1)}</strong>
                  </div>
                  <div className="metric-row">
                    <span>Pérdidas (penalización):</span>
                    <strong style={{ color: '#ef4444' }}>-{Number(j1.estadisticas.promedio_perdidas || 0).toFixed(1)}</strong>
                  </div>
                </>
              ) : (
                <>
                  <div className="metric-row">
                    <span>Bloqueos directos:</span>
                    <strong>{Number(j1.estadisticas.promedio_bloqueos || 0).toFixed(1)}</strong>
                  </div>
                  <div className="metric-row">
                    <span>Puntos de saque (Aces):</span>
                    <strong>{Number(j1.estadisticas.promedio_aces || 0).toFixed(1)}</strong>
                  </div>
                  <div className="metric-row">
                    <span>Recepciones positivas:</span>
                    <strong>{Number(j1.estadisticas.promedio_recepciones || 0).toFixed(1)}</strong>
                  </div>
                  <div className="metric-row">
                    <span>Errores no forzados:</span>
                    <strong style={{ color: '#ef4444' }}>-{Number(j1.estadisticas.promedio_errores || 0).toFixed(1)}</strong>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Insignia VS Central */}
          <div className="vs-badge">
            VS
          </div>

          {/* Jugador 2 */}
          <div className={`comparator-card ${val2 >= val1 ? 'winner' : ''}`}>
            {val2 >= val1 && (
              <span className="badge" style={{ background: '#dcfce7', color: '#15803d', marginBottom: '0.75rem' }}>
                <CheckCircle size={14} /> Mayor Rendimiento
              </span>
            )}
            <h3 style={{ fontSize: '1.3rem', color: '#1e3a8a' }}>{j2.nombre}</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>
              #{j2.dorsal} · {j2.posicion} · <strong>{j2.equipo}</strong>
            </p>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Índice CanchaData</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: val2 >= val1 ? '#10b981' : '#1e3a8a' }}>
                {val2.toFixed(1)} <span style={{ fontSize: '1rem', fontWeight: 500 }}>pts</span>
              </div>
            </div>

            {/* Métricas detalladas */}
            <div style={{ textAlign: 'left' }}>
              <div className="metric-row">
                <span>Partidos disputados:</span>
                <strong>{j2.estadisticas.partidos_jugados}</strong>
              </div>
              <div className="metric-row">
                <span>Promedio Puntos:</span>
                <strong style={{ color: '#1e3a8a' }}>{Number(j2.estadisticas.promedio_puntos || 0).toFixed(1)}</strong>
              </div>

              {!esVoley ? (
                <>
                  <div className="metric-row">
                    <span>Rebotes / partido:</span>
                    <strong>{Number(j2.estadisticas.promedio_rebotes || 0).toFixed(1)}</strong>
                  </div>
                  <div className="metric-row">
                    <span>Asistencias / partido:</span>
                    <strong>{Number(j2.estadisticas.promedio_asistencias || 0).toFixed(1)}</strong>
                  </div>
                  <div className="metric-row">
                    <span>Robos de balón:</span>
                    <strong>{Number(j2.estadisticas.promedio_robos || 0).toFixed(1)}</strong>
                  </div>
                  <div className="metric-row">
                    <span>Pérdidas (penalización):</span>
                    <strong style={{ color: '#ef4444' }}>-{Number(j2.estadisticas.promedio_perdidas || 0).toFixed(1)}</strong>
                  </div>
                </>
              ) : (
                <>
                  <div className="metric-row">
                    <span>Bloqueos directos:</span>
                    <strong>{Number(j2.estadisticas.promedio_bloqueos || 0).toFixed(1)}</strong>
                  </div>
                  <div className="metric-row">
                    <span>Puntos de saque (Aces):</span>
                    <strong>{Number(j2.estadisticas.promedio_aces || 0).toFixed(1)}</strong>
                  </div>
                  <div className="metric-row">
                    <span>Recepciones positivas:</span>
                    <strong>{Number(j2.estadisticas.promedio_recepciones || 0).toFixed(1)}</strong>
                  </div>
                  <div className="metric-row">
                    <span>Errores no forzados:</span>
                    <strong style={{ color: '#ef4444' }}>-{Number(j2.estadisticas.promedio_errores || 0).toFixed(1)}</strong>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
