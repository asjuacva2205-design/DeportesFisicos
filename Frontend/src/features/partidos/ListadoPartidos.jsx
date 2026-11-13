import React, { useState, useEffect } from 'react';
import { peticion } from '../../shared/api';
import { Search, Plus, Trash2, Calendar, Trophy, ChevronLeft, ChevronRight, Zap, Edit3, Flame } from 'lucide-react';
import FormularioPartidoModal from './FormularioPartidoModal';
import ModalConfirmarBorrado from './ModalConfirmarBorrado';
import SportTableBorder from '../../shared/SportTableBorder';

export default function ListadoPartidos({ usuario, setModalLoginAbierto }) {
  const [partidos, setPartidos] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [tamanoPagina, setTamanoPagina] = useState(10);
  const [cargando, setCargando] = useState(false);
  const [tiempoMs, setTiempoMs] = useState(0);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [deporteFiltro, setDeporteFiltro] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [temporadaFiltro, setTemporadaFiltro] = useState('');

  // Listas auxiliares para selects
  const [deportes, setDeportes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [equipos, setEquipos] = useState([]);

  // Modales
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [partidoParaEditar, setPartidoParaEditar] = useState(null);
  const [partidoAEliminar, setPartidoAEliminar] = useState(null);

  // Cargar catálogos
  useEffect(() => {
    async function cargarCatalogos() {
      const [resDep, resCat, resEq] = await Promise.all([
        peticion('/deportes/'),
        peticion('/categorias/'),
        peticion('/equipos/'),
      ]);
      if (resDep.ok) setDeportes(resDep.datos.results || resDep.datos);
      if (resCat.ok) setCategorias(resCat.datos.results || resCat.datos);
      if (resEq.ok) setEquipos(resEq.datos.results || resEq.datos);
    }
    cargarCatalogos();
  }, []);

  // Cargar listado de partidos paginados
  const cargarPartidos = async () => {
    setCargando(true);
    const params = new URLSearchParams({
      page: pagina,
      page_size: tamanoPagina,
    });
    if (busqueda) params.append('search', busqueda);
    if (deporteFiltro) params.append('deporte', deporteFiltro);
    if (categoriaFiltro) params.append('categoria', categoriaFiltro);
    if (temporadaFiltro) params.append('temporada', temporadaFiltro);

    const res = await peticion(`/partidos/?${params.toString()}`);
    setCargando(false);

    if (res.ok && res.datos) {
      setPartidos(res.datos.results || []);
      setTotal(res.datos.count || 0);
      setTiempoMs(res.ms);
    }
  };

  useEffect(() => {
    cargarPartidos();
  }, [pagina, tamanoPagina, deporteFiltro, categoriaFiltro, temporadaFiltro]);

  const handleBuscar = (e) => {
    e.preventDefault();
    setPagina(1);
    cargarPartidos();
  };

  const totalPaginas = Math.ceil(total / tamanoPagina) || 1;

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <Trophy size={22} color="#f97316" /> Registro Oficial de Partidos
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
              Consulta, filtrado, paginación y CRUD protegido con autenticación por token.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Zap size={14} color="#10b981" /> {tiempoMs} ms
            </span>
            {usuario.token ? (
              <button className="btn btn-accent" onClick={() => { setPartidoParaEditar(null); setModalCrearAbierto(true); }}>
                <Plus size={16} /> Nuevo Partido
              </button>
            ) : (
              <button className="btn btn-outline" onClick={() => setModalLoginAbierto(true)}>
                <Plus size={16} /> Iniciar Sesión para Crear
              </button>
            )}
          </div>
        </div>

        {/* Barra de Filtros */}
        <form onSubmit={handleBuscar} className="filters-bar">
          <div className="filter-group" style={{ flex: '1 1 200px' }}>
            <label className="filter-label">Búsqueda rápida</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                style={{ width: '100%', paddingLeft: '2rem' }}
                placeholder="Equipo o temporada..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <Search size={15} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Deporte</label>
            <select
              className="form-select"
              value={deporteFiltro}
              onChange={(e) => { setDeporteFiltro(e.target.value); setPagina(1); }}
            >
              <option value="">Todos los Deportes</option>
              {deportes.map((d) => (
                <option key={d.id} value={d.codigo}>{d.nombre}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Categoría</label>
            <select
              className="form-select"
              value={categoriaFiltro}
              onChange={(e) => { setCategoriaFiltro(e.target.value); setPagina(1); }}
            >
              <option value="">Todas las Categorías</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.codigo}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Temporada</label>
            <select
              className="form-select"
              value={temporadaFiltro}
              onChange={(e) => { setTemporadaFiltro(e.target.value); setPagina(1); }}
            >
              <option value="">Todas</option>
              <option value="2025-2026">2025-2026</option>
              <option value="2024-2025">2024-2025</option>
            </select>
          </div>

          <div className="filter-group" style={{ alignSelf: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              <Search size={15} /> Filtrar
            </button>
          </div>
        </form>

        {/* Tabla Paginada con Borde Temático de Balones de Voley y Básquetbol */}
        <SportTableBorder
          titulo="Duelo Oficial de Marcadores en Cancha"
          subtitulo="Puntuación oficial auditada con borde perimetral de balones de básquetbol y voleibol"
          badge="🏐 Duela & Red 🏀"
        >
          <div className="table-responsive">
            <table className="table sport-table-animated">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Deporte / Rama</th>
                  <th>Fecha</th>
                  <th>Encuentro en Cancha</th>
                  <th style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>Marcador</th>
                  <th>Ganador</th>
                  <th>Temporada</th>
                  {usuario.token && <th style={{ textAlign: 'right' }}>Acción</th>}
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan={usuario.token ? 8 : 7} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem' }}>
                        <span className="ball-emoji-rotator">🏀</span>
                        <span>Cargando partidos desde PostgreSQL...</span>
                        <span className="ball-emoji-rotator">🏐</span>
                      </div>
                    </td>
                  </tr>
                ) : partidos.length === 0 ? (
                  <tr>
                    <td colSpan={usuario.token ? 8 : 7} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                      No se encontraron partidos con los filtros aplicados. ¡Crea uno con el botón superior!
                    </td>
                  </tr>
                ) : (
                  partidos.map((p) => {
                    const esBasket = p.deporte_codigo === 'BASKET' || String(p.deporte_nombre).toLowerCase().includes('basket');
                    const esFem = p.categoria_nombre === 'Femenino';
                    return (
                      <tr key={p.id} className={`sport-row ${esBasket ? 'row-basket' : 'row-voley'}`}>
                        <td style={{ fontWeight: 700, color: '#475569' }}>
                          <span className="id-badge-sport">#{p.id}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            <span className={`badge ${esBasket ? 'badge-basket' : 'badge-voley'}`}>
                              {esBasket ? '🏀 ' : '🏐 '} {p.deporte_nombre}
                            </span>
                            <span className={`badge ${esFem ? 'badge-fem' : 'badge-masc'}`}>
                              {p.categoria_nombre}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#334155', whiteSpace: 'nowrap' }}>
                            <Calendar size={13} color="#64748b" /> {p.fecha}
                          </span>
                        </td>
                        <td>
                          <div className="matchup-cell">
                            <strong className={p.puntos_local > p.puntos_visitante ? 'team-winner' : 'team-name'}>
                              {p.equipo_local_nombre}
                            </strong>
                            <span className="vs-pill">vs</span>
                            <strong className={p.puntos_visitante > p.puntos_local ? 'team-winner' : 'team-name'}>
                              {p.equipo_visitante_nombre}
                            </strong>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                          <span className="led-scoreboard">
                            <span>{p.puntos_local}</span>
                            <span className="scoreboard-dash">-</span>
                            <span>{p.puntos_visitante}</span>
                          </span>
                        </td>
                        <td>
                          <span className="winner-pill">
                            🏆 {p.ganador_nombre}
                          </span>
                        </td>
                        <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                          {p.temporada} <span className="jornada-badge">J{p.jornada}</span>
                        </td>
                        {usuario.token && (
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                              <button
                                className="btn btn-outline btn-action-edit"
                                onClick={() => { setPartidoParaEditar(p); setModalCrearAbierto(true); }}
                                title="Editar Partido"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                className="btn btn-outline btn-action-delete"
                                onClick={() => setPartidoAEliminar(p)}
                                title="Eliminar con confirmación"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </SportTableBorder>

        {/* Paginación */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
            <span>Mostrando página <strong>{pagina}</strong> de <strong>{totalPaginas}</strong> ({total} partidos)</span>
            <span style={{ margin: '0 0.5rem' }}>|</span>
            <label>Por página:</label>
            <select
              className="form-select"
              style={{ minWidth: '70px', padding: '0.2rem 0.5rem' }}
              value={tamanoPagina}
              onChange={(e) => { setTamanoPagina(Number(e.target.value)); setPagina(1); }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-outline"
              disabled={pagina <= 1}
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} /> Anterior
            </button>
            <button
              className="btn btn-outline"
              disabled={pagina >= totalPaginas}
              onClick={() => setPagina((p) => p + 1)}
            >
              Siguiente <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modales */}
      <FormularioPartidoModal
        isOpen={modalCrearAbierto}
        onClose={() => { setModalCrearAbierto(false); setPartidoParaEditar(null); }}
        onGuardado={() => { cargarPartidos(); }}
        deportes={deportes}
        categorias={categorias}
        equipos={equipos}
        partidoParaEditar={partidoParaEditar}
      />

      <ModalConfirmarBorrado
        isOpen={Boolean(partidoAEliminar)}
        partido={partidoAEliminar}
        onClose={() => setPartidoAEliminar(null)}
        onEliminado={() => { cargarPartidos(); }}
      />
    </div>
  );
}
