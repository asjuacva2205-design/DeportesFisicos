import React, { useState, useEffect } from 'react';
import { peticion } from '../../shared/api';
import { PlusCircle, Edit3, X, Save } from 'lucide-react';

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
      onGuardado();
      onClose();
    } else {
      setError(esEdicion ? 'Error al actualizar el partido.' : 'Error al crear el partido. Revisa permisos o campos.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
            {esEdicion ? <Edit3 size={20} color="#2563eb" /> : <PlusCircle size={20} color="#2563eb" />}
            {esEdicion ? `Editar Partido #${partidoParaEditar.id}` : 'Registrar Nuevo Partido'}
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label className="filter-label">Deporte</label>
              <select className="form-select" style={{ width: '100%' }} value={deporteId} onChange={e => setDeporteId(e.target.value)} required>
                {deportes.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="filter-label">Categoría</label>
              <select className="form-select" style={{ width: '100%' }} value={categoriaId} onChange={e => setCategoriaId(e.target.value)} required>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label className="filter-label">Marcador Local</label>
              <input type="number" min="0" className="form-input" style={{ width: '100%' }} value={puntosLocal} onChange={e => setPuntosLocal(e.target.value)} required />
            </div>
            <div>
              <label className="filter-label">Marcador Visitante</label>
              <input type="number" min="0" className="form-input" style={{ width: '100%' }} value={puntosVisitante} onChange={e => setPuntosVisitante(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div>
              <label className="filter-label">Fecha</label>
              <input type="date" className="form-input" style={{ width: '100%' }} value={fecha} onChange={e => setFecha(e.target.value)} required />
            </div>
            <div>
              <label className="filter-label">Temporada</label>
              <input type="text" className="form-input" style={{ width: '100%' }} value={temporada} onChange={e => setTemporada(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={cargando}>
              <Save size={16} /> {cargando ? 'Guardando...' : (esEdicion ? 'Actualizar Partido' : 'Crear Partido')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
