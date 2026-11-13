import React, { useState, useEffect } from 'react';
import { peticion } from '../../shared/api';
import { PlusCircle, Edit3, X, Save, Zap, Flame } from 'lucide-react';
import AnimacionChoqueBalones from './AnimacionChoqueBalones';

export default function FormularioPartidoModal({
  isOpen,
  onClose,
  onGuardado,
  deportes,
  categorias,
  equipos,
  partidoParaEditar = null,
}) {
  const [deporteId, setDeporteId] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [equipoLocalId, setEquipoLocalId] = useState('');
  const [equipoVisitanteId, setEquipoVisitanteId] = useState('');
  const [puntosLocal, setPuntosLocal] = useState(0);
  const [puntosVisitante, setPuntosVisitante] = useState(0);
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [temporada, setTemporada] = useState('2025-2026');
  const [jornada, setJornada] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // Estado para la animación de choque de balones
  const [mostrarChoque, setMostrarChoque] = useState(false);
  const [choqueDeporteCodigo, setChoqueDeporteCodigo] = useState('BASKET');
  const [nombresEquipos, setNombresEquipos] = useState({ local: 'Equipo Local', visitante: 'Equipo Visitante' });

  const esEdicion = Boolean(partidoParaEditar);

  useEffect(() => {
    if (partidoParaEditar) {
      setDeporteId(partidoParaEditar.deporte || '');
      setCategoriaId(partidoParaEditar.categoria || '');
      setEquipoLocalId(partidoParaEditar.equipo_local || '');
      setEquipoVisitanteId(partidoParaEditar.equipo_visitante || '');
      setPuntosLocal(partidoParaEditar.puntos_local ?? 0);
      setPuntosVisitante(partidoParaEditar.puntos_visitante ?? 0);
      setFecha(partidoParaEditar.fecha || new Date().toISOString().slice(0, 10));
      setTemporada(partidoParaEditar.temporada || '2025-2026');
      setJornada(partidoParaEditar.jornada || 1);
    } else {
      if (deportes.length > 0 && !deporteId) setDeporteId(deportes[0].id);
      if (categorias.length > 0 && !categoriaId) setCategoriaId(categorias[0].id);
      setPuntosLocal(0);
      setPuntosVisitante(0);
      setFecha(new Date().toISOString().slice(0, 10));
      setTemporada('2025-2026');
      setJornada(1);
    }
  }, [partidoParaEditar, isOpen, deportes, categorias]);

  // Filtrar equipos por deporte y categoría seleccionados
  const equiposFiltrados = equipos.filter(eq => 
    (!deporteId || eq.deporte === Number(deporteId)) &&
    (!categoriaId || eq.categoria === Number(categoriaId))
  );

  useEffect(() => {
    if (!esEdicion && equiposFiltrados.length >= 2) {
      setEquipoLocalId(equiposFiltrados[0].id);
      setEquipoVisitanteId(equiposFiltrados[1].id);
    }
  }, [deporteId, categoriaId, esEdicion]);

  if (!isOpen) return null;

  // Obtener información del deporte actual
  const deporteActual = deportes.find(d => Number(d.id) === Number(deporteId));
  const esBasket = deporteActual ? (deporteActual.codigo === 'BASKET' || deporteActual.nombre.toLowerCase().includes('basket')) : true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (equipoLocalId === equipoVisitanteId) {
      setError('El equipo local y el visitante no pueden ser el mismo.');
      return;
    }

    setCargando(true);
    setError('');

    const cuerpo = {
      deporte: Number(deporteId),
      categoria: Number(categoriaId),
      equipo_local: Number(equipoLocalId),
      equipo_visitante: Number(equipoVisitanteId),
      puntos_local: Number(puntosLocal),
      puntos_visitante: Number(puntosVisitante),
      fecha,
      temporada,
      jornada: Number(jornada),
      estado: 'Finalizado',
    };

    const url = esEdicion ? `/partidos/${partidoParaEditar.id}/` : '/partidos/';
    const metodo = esEdicion ? 'PUT' : 'POST';

    const res = await peticion(url, {
      method: metodo,
      body: JSON.stringify(cuerpo),
    });

    setCargando(false);
    if (res.ok) {
      // Configurar y disparar la animación de choque de balones
      const eqLocalObj = equipos.find(eq => Number(eq.id) === Number(equipoLocalId));
      const eqVisitObj = equipos.find(eq => Number(eq.id) === Number(equipoVisitanteId));

      setChoqueDeporteCodigo(deporteActual ? deporteActual.codigo : 'BASKET');
      setNombresEquipos({
        local: eqLocalObj ? eqLocalObj.nombre : 'Equipo Local',
        visitante: eqVisitObj ? eqVisitObj.nombre : 'Equipo Visitante',
      });
      setMostrarChoque(true);
    } else {
      setError(esEdicion ? 'Error al actualizar el partido.' : 'Error al crear el partido. Revisa permisos o campos.');
    }
  };

  // Función para probar la animación en cualquier momento
  const handleProbarAnimacion = () => {
    const eqLocalObj = equipos.find(eq => Number(eq.id) === Number(equipoLocalId));
    const eqVisitObj = equipos.find(eq => Number(eq.id) === Number(equipoVisitanteId));

    setChoqueDeporteCodigo(deporteActual ? deporteActual.codigo : 'BASKET');
    setNombresEquipos({
      local: eqLocalObj ? eqLocalObj.nombre : 'Águilas Básquet',
      visitante: eqVisitObj ? eqVisitObj.nombre : 'Titanes Voley',
    });
    setMostrarChoque(true);
  };

  const finalizarAnimacion = () => {
    setMostrarChoque(false);
    onGuardado();
    onClose();
  };

  return (
    <>
      {/* Animación de Choque de Balones: Superbolas de Basket o Volley Smash */}
      <AnimacionChoqueBalones
        visible={mostrarChoque}
        deporteCodigo={choqueDeporteCodigo}
        equipoLocal={nombresEquipos.local}
        equipoVisitante={nombresEquipos.visitante}
        onFinalizar={finalizarAnimacion}
      />

      <div className="modal-overlay">
        <div className="modal-content modal-sport-styled" style={{ maxWidth: '540px' }}>
          {/* Barra superior con estilo de duela */}
          <div className="modal-sport-header-bar">
            <span>{esBasket ? '🏀 DUELA DE BÁSQUETBOL' : '🏐 RED DE VOLEIBOL'}</span>
            <span className="court-indicator">{esBasket ? 'SUPERBOLA ACTIVE' : 'VOLLEY SPIKE READY'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', marginTop: '0.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#0f172a' }}>
              {esEdicion ? (
                <Edit3 size={22} color={esBasket ? '#ea580c' : '#0284c7'} />
              ) : (
                <PlusCircle size={22} color={esBasket ? '#ea580c' : '#0284c7'} />
              )}
              {esEdicion ? `Editar Partido #${partidoParaEditar.id}` : 'Registrar Nuevo Partido Oficial'}
            </h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <X size={20} />
            </button>
          </div>

          {error && (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.6rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', borderLeft: '4px solid #ef4444' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
              <div>
                <label className="filter-label">Deporte Oficial</label>
                <select
                  className="form-select"
                  style={{ width: '100%', borderColor: esBasket ? '#fdba74' : '#7dd3fc' }}
                  value={deporteId}
                  onChange={e => setDeporteId(e.target.value)}
                  required
                >
                  {deportes.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.codigo === 'BASKET' ? '🏀' : '🏐'} {d.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="filter-label">Rama / Categoría</label>
                <select className="form-select" style={{ width: '100%' }} value={categoriaId} onChange={e => setCategoriaId(e.target.value)} required>
                  {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
              <div>
                <label className="filter-label">Equipo Local</label>
                <select className="form-select" style={{ width: '100%' }} value={equipoLocalId} onChange={e => setEquipoLocalId(e.target.value)} required>
                  {equiposFiltrados.map(eq => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="filter-label">Equipo Visitante</label>
                <select className="form-select" style={{ width: '100%' }} value={equipoVisitanteId} onChange={e => setEquipoVisitanteId(e.target.value)} required>
                  {equiposFiltrados.map(eq => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
                </select>
              </div>
            </div>

            {/* Marcador alineado en la misma línea estilo tablero electrónico */}
            <div style={{ marginBottom: '1rem', background: '#0f172a', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <label className="filter-label" style={{ color: '#38bdf8', margin: 0 }}>
                  ⚡ Marcador Oficial del Partido (En la Misma Línea)
                </label>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Puntos Oficiales</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', whiteSpace: 'nowrap' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '130px' }} title={equiposFiltrados.find(e => Number(e.id) === Number(equipoLocalId))?.nombre || 'Local'}>
                    {equiposFiltrados.find(e => Number(e.id) === Number(equipoLocalId))?.nombre || 'Local'}
                  </span>
                  <input
                    type="number"
                    min="0"
                    className="form-input score-input"
                    style={{ width: '75px', textAlign: 'center', fontWeight: 900, fontSize: '1.2rem', background: '#1e293b', color: '#38bdf8', borderColor: '#334155' }}
                    value={puntosLocal}
                    onChange={e => setPuntosLocal(e.target.value)}
                    required
                  />
                </div>

                <span style={{ color: '#f59e0b', fontWeight: 900, fontSize: '1.3rem', padding: '0 0.25rem' }}>—</span>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-start' }}>
                  <input
                    type="number"
                    min="0"
                    className="form-input score-input"
                    style={{ width: '75px', textAlign: 'center', fontWeight: 900, fontSize: '1.2rem', background: '#1e293b', color: '#38bdf8', borderColor: '#334155' }}
                    value={puntosVisitante}
                    onChange={e => setPuntosVisitante(e.target.value)}
                    required
                  />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '130px' }} title={equiposFiltrados.find(e => Number(e.id) === Number(equipoVisitanteId))?.nombre || 'Visitante'}>
                    {equiposFiltrados.find(e => Number(e.id) === Number(equipoVisitanteId))?.nombre || 'Visitante'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="filter-label">Fecha del Encuentro</label>
                <input type="date" className="form-input" style={{ width: '100%' }} value={fecha} onChange={e => setFecha(e.target.value)} required />
              </div>
              <div>
                <label className="filter-label">Temporada y Jornada</label>
                <input type="text" className="form-input" style={{ width: '100%' }} value={temporada} onChange={e => setTemporada(e.target.value)} required />
              </div>
            </div>

            {/* Fila de Botones y Botón de Prueba de Choque */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
              <button
                type="button"
                className="btn btn-sport-test"
                onClick={handleProbarAnimacion}
                title="Prueba la animación cinematográfica de choque de balones"
              >
                {esBasket ? <Flame size={15} color="#ea580c" /> : <Zap size={15} color="#0284c7" />}
                <span>💥 Probar Choque de Balones</span>
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
                <button
                  type="submit"
                  className={`btn ${esBasket ? 'btn-basket-clash' : 'btn-voley-clash'}`}
                  disabled={cargando}
                >
                  <Save size={16} />
                  {cargando ? 'Guardando...' : (esEdicion ? 'Actualizar Partido' : 'Crear Partido y Chocar Balones')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
