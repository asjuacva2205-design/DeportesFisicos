import React, { useState, useEffect } from 'react';
import { peticion } from '../../shared/api';
import { Users, Shield, Plus, Edit3, Trash2, Search, X, Save, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import SportTableBorder from '../../shared/SportTableBorder';

const POSICIONES_BASKET = [
  'Base',
  'Escolta',
  'Alero',
  'Ala-Pívot',
  'Pívot',
];

const POSICIONES_VOLEY = [
  'Colocador/Armador',
  'Opuesto',
  'Receptor-Punta / Atacante',
  'Central',
  'Líbero',
];

export default function GestionDeportiva({ usuario, setModalLoginAbierto }) {
  const [subPestana, setSubPestana] = useState('jugadores'); // 'jugadores' o 'equipos'

  // Estado paginación Atletas / Jugadores
  const [jugadores, setJugadores] = useState([]);
  const [totalJugadores, setTotalJugadores] = useState(0);
  const [paginaJugadores, setPaginaJugadores] = useState(1);
  const [tamanoPaginaJugadores, setTamanoPaginaJugadores] = useState(10);

  // Estado paginación Clubes / Equipos
  const [equipos, setEquipos] = useState([]);
  const [totalEquipos, setTotalEquipos] = useState(0);
  const [paginaEquipos, setPaginaEquipos] = useState(1);
  const [tamanoPaginaEquipos, setTamanoPaginaEquipos] = useState(10);

  // Catálogos auxiliares
  const [deportes, setDeportes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [listaEquiposModal, setListaEquiposModal] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  // Modales
  const [modalJugadorAbierto, setModalJugadorAbierto] = useState(false);
  const [jugadorParaEditar, setJugadorParaEditar] = useState(null);

  const [modalEquipoAbierto, setModalEquipoAbierto] = useState(false);
  const [equipoParaEditar, setEquipoParaEditar] = useState(null);

  const [elementoAEliminar, setElementoAEliminar] = useState(null); // { tipo: 'jugador' | 'equipo', id, nombre }

  // Cargar catálogos fijos y lista de equipos para el select de jugadores
  const cargarCatalogos = async () => {
    const [resD, resC, resEqModal] = await Promise.all([
      peticion('/deportes/'),
      peticion('/categorias/'),
      peticion('/equipos/?page_size=100'),
    ]);
    if (resD.ok && resD.datos) setDeportes(resD.datos.results || resD.datos);
    if (resC.ok && resC.datos) setCategorias(resC.datos.results || resC.datos);
    if (resEqModal.ok && resEqModal.datos) setListaEquiposModal(resEqModal.datos.results || resEqModal.datos);
  };

  useEffect(() => {
    cargarCatalogos();
  }, []);

  // Cargar Atletas paginados desde DRF
  const cargarJugadores = async () => {
    setCargando(true);
    const params = new URLSearchParams({
      page: paginaJugadores,
      page_size: tamanoPaginaJugadores,
    });
    if (busqueda.trim()) params.append('search', busqueda.trim());

    const res = await peticion(`/jugadores/?${params.toString()}`);
    setCargando(false);
    if (res.ok && res.datos) {
      setJugadores(res.datos.results || res.datos);
      setTotalJugadores(res.datos.count ?? (res.datos.results || res.datos).length);
    }
  };

  // Cargar Equipos paginados desde DRF
  const cargarEquipos = async () => {
    setCargando(true);
    const params = new URLSearchParams({
      page: paginaEquipos,
      page_size: tamanoPaginaEquipos,
    });
    if (busqueda.trim()) params.append('search', busqueda.trim());

    const res = await peticion(`/equipos/?${params.toString()}`);
    setCargando(false);
    if (res.ok && res.datos) {
      setEquipos(res.datos.results || res.datos);
      setTotalEquipos(res.datos.count ?? (res.datos.results || res.datos).length);
    }
  };

  // Efecto reactivo según sub-pestaña y cambios de página/búsqueda
  useEffect(() => {
    if (subPestana === 'jugadores') {
      cargarJugadores();
    }
  }, [subPestana, paginaJugadores, tamanoPaginaJugadores, busqueda]);

  useEffect(() => {
    if (subPestana === 'equipos') {
      cargarEquipos();
    }
  }, [subPestana, paginaEquipos, tamanoPaginaEquipos, busqueda]);

  // Recarga general tras guardar o eliminar
  const recargarTodo = () => {
    if (subPestana === 'jugadores') {
      cargarJugadores();
    } else {
      cargarEquipos();
    }
    cargarCatalogos();
  };

  // Borrado con confirmación
  const confirmarBorrado = async () => {
    if (!elementoAEliminar) return;
    const ruta = elementoAEliminar.tipo === 'jugador' 
      ? `/jugadores/${elementoAEliminar.id}/` 
      : `/equipos/${elementoAEliminar.id}/`;

    const res = await peticion(ruta, { method: 'DELETE' });
    if (res.ok) {
      setElementoAEliminar(null);
      recargarTodo();
    } else {
      alert('Error al eliminar. Asegúrate de tener permisos de administrador.');
    }
  };

  const totalPaginasJugadores = Math.ceil(totalJugadores / tamanoPaginaJugadores) || 1;
  const totalPaginasEquipos = Math.ceil(totalEquipos / tamanoPaginaEquipos) || 1;

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <Users size={22} color="#2563eb" /> Gestión de Plantillas Deportivas
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
              Registra, edita y administra atletas y clubes oficiales con paginación optimizada desde PostgreSQL.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {subPestana === 'jugadores' ? (
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (!usuario.token) {
                    setModalLoginAbierto(true);
                  } else {
                    setJugadorParaEditar(null);
                    setModalJugadorAbierto(true);
                  }
                }}
              >
                <Plus size={16} /> Nuevo Atleta
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (!usuario.token) {
                    setModalLoginAbierto(true);
                  } else {
                    setEquipoParaEditar(null);
                    setModalEquipoAbierto(true);
                  }
                }}
              >
                <Plus size={16} /> Nuevo Club
              </button>
            )}
          </div>
        </div>

        {/* Sub-pestañas: Jugadores / Equipos */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <button
            className={`btn ${subPestana === 'jugadores' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: '6px', padding: '0.4rem 1rem' }}
            onClick={() => { setSubPestana('jugadores'); setBusqueda(''); setPaginaJugadores(1); }}
          >
            <Users size={16} /> Atletas Registrados ({totalJugadores})
          </button>
          <button
            className={`btn ${subPestana === 'equipos' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: '6px', padding: '0.4rem 1rem' }}
            onClick={() => { setSubPestana('equipos'); setBusqueda(''); setPaginaEquipos(1); }}
          >
            <Shield size={16} /> Equipos / Clubes ({totalEquipos})
          </button>
        </div>

        {/* Buscador */}
        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
          <input
            type="text"
            className="form-input"
            style={{ width: '100%', paddingLeft: '2.2rem' }}
            placeholder={subPestana === 'jugadores' ? 'Buscar atleta por nombre, equipo o posición...' : 'Buscar club por nombre o ciudad...'}
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              if (subPestana === 'jugadores') setPaginaJugadores(1);
              else setPaginaEquipos(1);
            }}
          />
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        </div>

        {/* Vista de Jugadores con Borde Temático de Balones y Paginación */}
        {subPestana === 'jugadores' && (
          <>
            <SportTableBorder
              titulo="Nómina Oficial de Atletas"
              subtitulo="Plantilla de jugadores de Básquetbol y Voleibol federados con paginación optimizada"
              badge="🏀 Atletas Federados 🏐"
            >
              <div className="table-responsive">
                <table className="table sport-table-animated">
                  <thead>
                    <tr>
                      <th>Dorsal</th>
                      <th>Nombre Atleta</th>
                      <th>Posición Específica</th>
                      <th>Club / Equipo</th>
                      <th>Disciplina / Rama</th>
                      <th>Físico</th>
                      {usuario.token && <th style={{ textAlign: 'right' }}>Acciones</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {cargando ? (
                      <tr>
                        <td colSpan={usuario.token ? 7 : 6} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem' }}>
                            <span className="ball-emoji-rotator">🏀</span>
                            <span>Cargando atletas desde PostgreSQL...</span>
                            <span className="ball-emoji-rotator">🏐</span>
                          </div>
                        </td>
                      </tr>
                    ) : jugadores.length === 0 ? (
                      <tr>
                        <td colSpan={usuario.token ? 7 : 6} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                          No se encontraron atletas registrados con el criterio de búsqueda.
                        </td>
                      </tr>
                    ) : (
                      jugadores.map((j) => (
                        <tr key={j.id} className="sport-row">
                          <td style={{ fontWeight: 800, color: '#2563eb' }}>
                            <span className="id-badge-sport">#{j.dorsal}</span>
                          </td>
                          <td style={{ fontWeight: 700, color: '#0f172a' }}>{j.nombre}</td>
                          <td>
                            <span className="badge" style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0' }}>
                              {j.posicion}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600 }}>{j.equipo_nombre}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                              <span className={`badge ${j.deporte_codigo === 'BASKET' ? 'badge-basket' : 'badge-voley'}`}>
                                {j.deporte_codigo === 'BASKET' ? '🏀 ' : '🏐 '} {j.deporte_nombre || 'Básquetbol'}
                              </span>
                              <span className={`badge ${j.categoria_nombre === 'Femenino' ? 'badge-fem' : 'badge-masc'}`}>
                                {j.categoria_nombre}
                              </span>
                            </div>
                          </td>
                          <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            {j.edad} años · {j.altura_cm} cm
                          </td>
                          {usuario.token && (
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                                <button
                                  className="btn btn-outline btn-action-edit"
                                  onClick={() => { setJugadorParaEditar(j); setModalJugadorAbierto(true); }}
                                  title="Editar Atleta"
                                >
                                  <Edit3 size={15} />
                                </button>
                                <button
                                  className="btn btn-outline btn-action-delete"
                                  onClick={() => setElementoAEliminar({ tipo: 'jugador', id: j.id, nombre: j.nombre })}
                                  title="Eliminar con confirmación"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </SportTableBorder>

            {/* Paginación de Atletas */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                <span>Mostrando página <strong>{paginaJugadores}</strong> de <strong>{totalPaginasJugadores}</strong> ({totalJugadores} atletas registrados)</span>
                <span style={{ margin: '0 0.5rem' }}>|</span>
                <label>Por página:</label>
                <select
                  className="form-select"
                  style={{ minWidth: '70px', padding: '0.2rem 0.5rem' }}
                  value={tamanoPaginaJugadores}
                  onChange={(e) => { setTamanoPaginaJugadores(Number(e.target.value)); setPaginaJugadores(1); }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-outline"
                  disabled={paginaJugadores <= 1}
                  onClick={() => setPaginaJugadores((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={16} /> Anterior
                </button>
                <button
                  className="btn btn-outline"
                  disabled={paginaJugadores >= totalPaginasJugadores}
                  onClick={() => setPaginaJugadores((p) => p + 1)}
                >
                  Siguiente <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Vista de Equipos con Borde Temático de Balones y Paginación */}
        {subPestana === 'equipos' && (
          <>
            <SportTableBorder
              titulo="Registro Oficial de Clubes y Franquicias"
              subtitulo="Equipos participantes de básquetbol y voleibol en liga activa con paginación optimizada"
              badge="🏆 Clubes Oficiales 🏆"
            >
              <div className="table-responsive">
                <table className="table sport-table-animated">
                  <thead>
                    <tr>
                      <th>Siglas</th>
                      <th>Nombre del Club</th>
                      <th>Ciudad Sede</th>
                      <th>Disciplina / Rama</th>
                      {usuario.token && <th style={{ textAlign: 'right' }}>Acciones</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {cargando ? (
                      <tr>
                        <td colSpan={usuario.token ? 5 : 4} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem' }}>
                            <span className="ball-emoji-rotator">🏀</span>
                            <span>Cargando clubes desde PostgreSQL...</span>
                            <span className="ball-emoji-rotator">🏐</span>
                          </div>
                        </td>
                      </tr>
                    ) : equipos.length === 0 ? (
                      <tr>
                        <td colSpan={usuario.token ? 5 : 4} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                          No se encontraron equipos registrados con el criterio de búsqueda.
                        </td>
                      </tr>
                    ) : (
                      equipos.map((eq) => (
                        <tr key={eq.id} className="sport-row">
                          <td style={{ fontWeight: 800, color: '#4f46e5' }}>
                            <span className="id-badge-sport">{eq.siglas || 'CLB'}</span>
                          </td>
                          <td style={{ fontWeight: 700, color: '#0f172a' }}>{eq.nombre}</td>
                          <td style={{ color: '#475569' }}>📍 {eq.ciudad}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                              <span className={`badge ${eq.deporte_nombre?.includes('Básquet') ? 'badge-basket' : 'badge-voley'}`}>
                                {eq.deporte_nombre?.includes('Básquet') ? '🏀 ' : '🏐 '} {eq.deporte_nombre}
                              </span>
                              <span className={`badge ${eq.categoria_nombre === 'Femenino' ? 'badge-fem' : 'badge-masc'}`}>
                                {eq.categoria_nombre}
                              </span>
                            </div>
                          </td>
                          {usuario.token && (
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                                <button
                                  className="btn btn-outline btn-action-edit"
                                  onClick={() => { setEquipoParaEditar(eq); setModalEquipoAbierto(true); }}
                                  title="Editar Club"
                                >
                                  <Edit3 size={15} />
                                </button>
                                <button
                                  className="btn btn-outline btn-action-delete"
                                  onClick={() => setElementoAEliminar({ tipo: 'equipo', id: eq.id, nombre: eq.nombre })}
                                  title="Eliminar con confirmación"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </SportTableBorder>

            {/* Paginación de Clubes */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                <span>Mostrando página <strong>{paginaEquipos}</strong> de <strong>{totalPaginasEquipos}</strong> ({totalEquipos} clubes registrados)</span>
                <span style={{ margin: '0 0.5rem' }}>|</span>
                <label>Por página:</label>
                <select
                  className="form-select"
                  style={{ minWidth: '70px', padding: '0.2rem 0.5rem' }}
                  value={tamanoPaginaEquipos}
                  onChange={(e) => { setTamanoPaginaEquipos(Number(e.target.value)); setPaginaEquipos(1); }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-outline"
                  disabled={paginaEquipos <= 1}
                  onClick={() => setPaginaEquipos((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={16} /> Anterior
                </button>
                <button
                  className="btn btn-outline"
                  disabled={paginaEquipos >= totalPaginasEquipos}
                  onClick={() => setPaginaEquipos((p) => p + 1)}
                >
                  Siguiente <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Jugador con Posiciones Dinámicas según Deporte */}
      {modalJugadorAbierto && (
        <ModalJugadorForm
          isOpen={modalJugadorAbierto}
          onClose={() => { setModalJugadorAbierto(false); setJugadorParaEditar(null); }}
          onGuardado={recargarTodo}
          jugadorParaEditar={jugadorParaEditar}
          deportes={deportes}
          categorias={categorias}
          equipos={listaEquiposModal.length > 0 ? listaEquiposModal : equipos}
        />
      )}

      {/* Modal Equipo */}
      {modalEquipoAbierto && (
        <ModalEquipoForm
          isOpen={modalEquipoAbierto}
          onClose={() => { setModalEquipoAbierto(false); setEquipoParaEditar(null); }}
          onGuardado={recargarTodo}
          equipoParaEditar={equipoParaEditar}
          deportes={deportes}
          categorias={categorias}
        />
      )}

      {/* Modal de Confirmación de Borrado */}
      {elementoAEliminar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#e11d48', marginBottom: '1rem' }}>
              <AlertTriangle size={26} />
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Confirmar Eliminación</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '1.25rem' }}>
              ¿Estás seguro de que deseas eliminar a <strong>{elementoAEliminar.nombre}</strong>? Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button className="btn btn-outline" onClick={() => setElementoAEliminar(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={confirmarBorrado}>Sí, Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponente: Formulario Jugador con posiciones dinámicas
function ModalJugadorForm({ isOpen, onClose, onGuardado, jugadorParaEditar, deportes, categorias, equipos }) {
  const esEdicion = Boolean(jugadorParaEditar);

  const [nombre, setNombre] = useState(jugadorParaEditar?.nombre || '');
  const [dorsal, setDorsal] = useState(jugadorParaEditar?.dorsal ?? 0);
  const [deporteId, setDeporteId] = useState(deportes[0]?.id || '');
  const [categoriaId, setCategoriaId] = useState(jugadorParaEditar?.categoria || categorias[0]?.id || '');
  const [equipoId, setEquipoId] = useState(jugadorParaEditar?.equipo || '');
  const [posicion, setPosicion] = useState(jugadorParaEditar?.posicion || '');
  const [edad, setEdad] = useState(jugadorParaEditar?.edad ?? 22);
  const [alturaCm, setAlturaCm] = useState(jugadorParaEditar?.altura_cm ?? 185);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // Identificar el código del deporte seleccionado
  const deporteSeleccionado = deportes.find(d => d.id === Number(deporteId));
  const esVoley = deporteSeleccionado?.codigo === 'VOLEY';
  const listaPosiciones = esVoley ? POSICIONES_VOLEY : POSICIONES_BASKET;

  // Ajustar posición por defecto al cambiar deporte
  useEffect(() => {
    if (!listaPosiciones.includes(posicion)) {
      setPosicion(listaPosiciones[0]);
    }
  }, [deporteId]);

  // Filtrar equipos por deporte y categoría
  const equiposDisponibles = equipos.filter(eq => 
    (!deporteId || eq.deporte === Number(deporteId)) &&
    (!categoriaId || eq.categoria === Number(categoriaId))
  );

  useEffect(() => {
    if (!equipoId && equiposDisponibles.length > 0) {
      setEquipoId(equiposDisponibles[0].id);
    }
  }, [equiposDisponibles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    const cuerpo = {
      nombre,
      dorsal: Number(dorsal),
      posicion,
      equipo: Number(equipoId),
      categoria: Number(categoriaId),
      edad: Number(edad),
      altura_cm: Number(alturaCm),
    };

    const url = esEdicion ? `/jugadores/${jugadorParaEditar.id}/` : '/jugadores/';
    const res = await peticion(url, {
      method: esEdicion ? 'PUT' : 'POST',
      body: JSON.stringify(cuerpo),
    });

    setCargando(false);
    if (res.ok) {
      onGuardado();
      onClose();
    } else {
      setError('Error al guardar atleta. Revisa que los campos sean correctos.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
            <Users size={20} color="#2563eb" />
            {esEdicion ? `Editar Atleta #${jugadorParaEditar.id}` : 'Registrar Nuevo Atleta'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label className="filter-label">Nombre Completo</label>
              <input type="text" className="form-input" style={{ width: '100%' }} value={nombre} onChange={e => setNombre(e.target.value)} required />
            </div>
            <div>
              <label className="filter-label">Dorsal / Camiseta</label>
              <input type="number" min="0" max="99" className="form-input" style={{ width: '100%' }} value={dorsal} onChange={e => setDorsal(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label className="filter-label">Disciplina</label>
              <select className="form-select" style={{ width: '100%' }} value={deporteId} onChange={e => setDeporteId(e.target.value)}>
                {deportes.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="filter-label">Rama / Género</label>
              <select className="form-select" style={{ width: '100%' }} value={categoriaId} onChange={e => setCategoriaId(e.target.value)}>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
          </div>

          {/* Posición dependiente de la disciplina */}
          <div style={{ marginBottom: '1rem' }}>
            <label className="filter-label" style={{ color: '#2563eb' }}>
              Posición Táctica ({esVoley ? 'Voleibol' : 'Básquetbol'})
            </label>
            <select className="form-select" style={{ width: '100%', fontWeight: 600 }} value={posicion} onChange={e => setPosicion(e.target.value)} required>
              {listaPosiciones.map((pos) => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label className="filter-label">Club / Equipo Perteneciente</label>
            <select className="form-select" style={{ width: '100%' }} value={equipoId} onChange={e => setEquipoId(e.target.value)} required>
              {equiposDisponibles.map(eq => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div>
              <label className="filter-label">Edad (Años)</label>
              <input type="number" min="15" max="50" className="form-input" style={{ width: '100%' }} value={edad} onChange={e => setEdad(e.target.value)} required />
            </div>
            <div>
              <label className="filter-label">Estatura (cm)</label>
              <input type="number" min="150" max="230" className="form-input" style={{ width: '100%' }} value={alturaCm} onChange={e => setAlturaCm(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={cargando}>
              <Save size={16} /> {cargando ? 'Guardando...' : (esEdicion ? 'Actualizar Atleta' : 'Guardar Atleta')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Subcomponente: Formulario Club / Equipo
function ModalEquipoForm({ isOpen, onClose, onGuardado, equipoParaEditar, deportes, categorias }) {
  const esEdicion = Boolean(equipoParaEditar);

  const [nombre, setNombre] = useState(equipoParaEditar?.nombre || '');
  const [ciudad, setCiudad] = useState(equipoParaEditar?.ciudad || '');
  const [siglas, setSiglas] = useState(equipoParaEditar?.siglas || '');
  const [deporteId, setDeporteId] = useState(equipoParaEditar?.deporte || deportes[0]?.id || '');
  const [categoriaId, setCategoriaId] = useState(equipoParaEditar?.categoria || categorias[0]?.id || '');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    const cuerpo = {
      nombre,
      ciudad,
      siglas,
      deporte: Number(deporteId),
      categoria: Number(categoriaId),
    };

    const url = esEdicion ? `/equipos/${equipoParaEditar.id}/` : '/equipos/';
    const res = await peticion(url, {
      method: esEdicion ? 'PUT' : 'POST',
      body: JSON.stringify(cuerpo),
    });

    setCargando(false);
    if (res.ok) {
      onGuardado();
      onClose();
    } else {
      setError('Error al guardar el club.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
            <Shield size={20} color="#2563eb" />
            {esEdicion ? `Editar Club #${equipoParaEditar.id}` : 'Registrar Nuevo Club'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label className="filter-label">Nombre del Club</label>
            <input type="text" className="form-input" style={{ width: '100%' }} value={nombre} onChange={e => setNombre(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label className="filter-label">Ciudad Sede</label>
              <input type="text" className="form-input" style={{ width: '100%' }} value={ciudad} onChange={e => setCiudad(e.target.value)} required />
            </div>
            <div>
              <label className="filter-label">Siglas (3 Letras)</label>
              <input type="text" maxLength="4" className="form-input" style={{ width: '100%' }} value={siglas} onChange={e => setSiglas(e.target.value.toUpperCase())} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div>
              <label className="filter-label">Disciplina</label>
              <select className="form-select" style={{ width: '100%' }} value={deporteId} onChange={e => setDeporteId(e.target.value)}>
                {deportes.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="filter-label">Rama / Género</label>
              <select className="form-select" style={{ width: '100%' }} value={categoriaId} onChange={e => setCategoriaId(e.target.value)}>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={cargando}>
              <Save size={16} /> {cargando ? 'Guardando...' : (esEdicion ? 'Actualizar Club' : 'Guardar Club')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
