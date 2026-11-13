import React, { useState, useEffect } from 'react';
import { peticion } from '../../shared/api';
import { BarChart3, TrendingUp, Layers, Award, Filter, RefreshCw, Shield } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import JugadoresGrafica from './JugadoresGrafica';
import SportTableBorder from '../../shared/SportTableBorder';

export default function PanelEstadisticas() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [deporteFiltro, setDeporteFiltro] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [temporadaFiltro, setTemporadaFiltro] = useState('');

  const cargarEstadisticas = async () => {
    setCargando(true);
    const params = new URLSearchParams();
    if (deporteFiltro) params.append('deporte', deporteFiltro);
    if (categoriaFiltro) params.append('categoria', categoriaFiltro);
    if (temporadaFiltro) params.append('temporada', temporadaFiltro);

    const res = await peticion(`/estadisticas/?${params.toString()}`);
    setCargando(false);

    if (res.ok && res.datos) {
      setEstadisticas(res.datos);
    }
  };

  useEffect(() => {
    cargarEstadisticas();
  }, [deporteFiltro, categoriaFiltro, temporadaFiltro]);

  const globales = estadisticas?.metricas_globales || {};
  
  // Agrupación 1: Deporte y Categoría (Diferenciados por género)
  const porDeporteYCat = (estadisticas?.por_deporte_y_categoria || []).map(item => ({
    etiqueta: `${item.deporte_nombre} (${item.categoria_nombre})`,
    promedioLocal: Number(item.promedio_puntos_local || 0).toFixed(1),
    promedioVisitante: Number(item.promedio_puntos_visitante || 0).toFixed(1),
    partidos: item.total_partidos,
  }));

  // Agrupación 2: Rendimiento Comparativo por Equipo
  const porEquipo = (estadisticas?.por_equipo || []).map(item => ({
    equipo: item.equipo_nombre,
    promedioPuntos: Number(item.promedio_puntos || 0).toFixed(1),
    partidos: item.partidos_jugados,
    categoria: item.categoria_nombre,
  }));

  // Agrupación 3: Posiciones individuales
  const porPosicion = (estadisticas?.por_posicion_y_categoria || []).map(item => ({
    posicion: `${item.posicion_nombre} (${item.categoria_nombre})`,
    valoracion: Number(item.promedio_valoracion || 0).toFixed(1),
    puntos: Number(item.promedio_puntos || 0).toFixed(1),
  }));

  return (
    <div className="container">
      {/* Encabezado y Filtros reactivos */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <BarChart3 size={22} color="#2563eb" /> Tablero de Analítica ORM
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
              Estadísticas calculadas en PostgreSQL mediante <code style={{ color: '#2563eb' }}>aggregate()</code> y <code style={{ color: '#2563eb' }}>annotate()</code> agrupadas por dos campos.
            </p>
          </div>

          <button className="btn btn-outline" onClick={cargarEstadisticas}>
            <RefreshCw size={15} /> Actualizar
          </button>
        </div>

        {/* Filtros que manipulan las estadísticas en vivo */}
        <div className="filters-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>
            <Filter size={16} color="#2563eb" /> Filtros reactivos:
          </div>

          <div className="filter-group">
            <select
              className="form-select"
              value={deporteFiltro}
              onChange={(e) => setDeporteFiltro(e.target.value)}
            >
              <option value="">Todos los Deportes</option>
              <option value="BASKET">Básquetbol</option>
              <option value="VOLEY">Voleibol</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              className="form-select"
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
            >
              <option value="">Todas las Categorías</option>
              <option value="MASC">Masculino</option>
              <option value="FEM">Femenino</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              className="form-select"
              value={temporadaFiltro}
              onChange={(e) => setTemporadaFiltro(e.target.value)}
            >
              <option value="">Todas las Temporadas</option>
              <option value="2025-2026">2025-2026</option>
              <option value="2024-2025">2024-2025</option>
            </select>
          </div>
        </div>

        {/* Tarjetas KPI de Resumen */}
        <div className="kpi-grid">
          <div className="kpi-card" style={{ borderLeft: '4px solid #2563eb' }}>
            <span className="kpi-title">Partidos Filtrados</span>
            <span className="kpi-value">{globales.total_partidos || 0}</span>
            <span className="kpi-subtitle">Total encuentros registrados</span>
          </div>

          <div className="kpi-card" style={{ borderLeft: '4px solid #4f46e5' }}>
            <span className="kpi-title">Puntos Totales Anotados</span>
            <span className="kpi-value">{globales.suma_total_puntos || 0}</span>
            <span className="kpi-subtitle">Sumatoria en marcador</span>
          </div>

          <div className="kpi-card" style={{ borderLeft: '4px solid #0284c7' }}>
            <span className="kpi-title">Promedio Puntos Local</span>
            <span className="kpi-value">{Number(globales.promedio_puntos_local || 0).toFixed(1)}</span>
            <span className="kpi-subtitle">Efectividad en casa</span>
          </div>

          <div className="kpi-card" style={{ borderLeft: '4px solid #64748b' }}>
            <span className="kpi-title">Registros Individuales</span>
            <span className="kpi-value">{estadisticas?.total_registros_estadisticas || 0}</span>
            <span className="kpi-subtitle" style={{ color: '#059669', fontWeight: 700 }}>&gt; 1.000 filas reales (Cargadas)</span>
          </div>
        </div>
      </div>

      {/* Gráficos Recharts con Atletas de Básquetbol y Voleibol en la Cima */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Gráfico 1: Agrupación por Deporte y Categoría (Diferenciados) */}
        <div className="card card-with-athletes">
          {/* Jugadores en la Cima del Gráfico (Remate de Vóley vs Clavada de Básquet) */}
          <JugadoresGrafica tipo="duelo" titulo="Duelo Aéreo" />

          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="#2563eb" /> Puntuación Promedio por Deporte y Género
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
            Diferenciación real entre ligas masculinas y femeninas según duración y reglas oficiales.
          </p>

          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={porDeporteYCat} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="etiqueta" angle={-15} textAnchor="end" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="promedioLocal" name="Promedio Local" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="promedioVisitante" name="Promedio Visitante" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Rendimiento Comparativo por Equipo */}
        <div className="card card-with-athletes">
          {/* Jugadores en la Cima del Gráfico (Crossover de Basket vs Recepción de Vóley) */}
          <JugadoresGrafica tipo="accion" titulo="Acción en Duela y Red" />

          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={18} color="#4f46e5" /> Rendimiento Comparativo por Equipo (Top Anotadores)
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
            Cálculo ORM: <code style={{ color: '#0f172a' }}>values('equipo_local__nombre').annotate(Avg('puntos_local'))</code>
          </p>

          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={porEquipo} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="equipo" angle={-25} textAnchor="end" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="promedioPuntos" name="Promedio de Puntos por Partido" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabla resumen de rendimiento por Posición con Borde Temático de Balones */}
      <div className="card">
        <SportTableBorder
          titulo="Ranking de Valoración por Posición Técnica"
          subtitulo="CanchaData Score basado en más de 1.000 actuaciones analizadas por la base de datos"
          badge="⭐ MVPs en Cancha ⭐"
        >
          <div className="table-responsive">
            <table className="table sport-table-animated">
              <thead>
                <tr>
                  <th>Posición y Rama</th>
                  <th style={{ textAlign: 'center' }}>Promedio Valoración (CanchaData Score)</th>
                  <th style={{ textAlign: 'center' }}>Promedio Puntos / Acciones</th>
                </tr>
              </thead>
              <tbody>
                {porPosicion.map((item, idx) => (
                  <tr key={idx} className="sport-row">
                    <td style={{ fontWeight: 600 }}>
                      <span className="sport-indicator-ball">🎯</span> {item.posicion}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge" style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #dbeafe', fontSize: '0.85rem' }}>
                        ⭐ {item.valoracion} pts
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 800, color: '#0f172a' }}>
                      <span className="led-scoreboard" style={{ fontSize: '0.9rem', padding: '0.2rem 0.6rem' }}>
                        {item.puntos}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SportTableBorder>
      </div>
    </div>
  );
}
