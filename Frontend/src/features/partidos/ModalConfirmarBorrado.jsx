import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { peticion } from '../../shared/api';

export default function ModalConfirmarBorrado({ isOpen, onClose, partido, onEliminado }) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !partido) return null;

  const handleEliminar = async () => {
    setCargando(true);
    setError('');

    const res = await peticion(`/partidos/${partido.id}/`, {
      method: 'DELETE',
    });

    setCargando(false);
    if (res.ok) {
      onEliminado(partido.id);
      onClose();
    } else {
      setError('No tienes autorización o ocurrió un error al eliminar. Inicia sesión con token.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ef4444', marginBottom: '1rem' }}>
          <AlertTriangle size={26} />
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Confirmar Eliminación</h3>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '1rem' }}>
          ¿Estás seguro de que deseas eliminar este encuentro?
        </p>

        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem', marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 700, color: '#0f172a' }}>
            {partido.equipo_local_nombre} ({partido.puntos_local}) vs ({partido.puntos_visitante}) {partido.equipo_visitante_nombre}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
            Fecha: {partido.fecha} | {partido.deporte_nombre} ({partido.categoria_nombre})
          </div>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button type="button" className="btn btn-outline" onClick={onClose} disabled={cargando}>
            Cancelar
          </button>
          <button type="button" className="btn btn-danger" onClick={handleEliminar} disabled={cargando}>
            <Trash2 size={16} /> {cargando ? 'Borrando...' : 'Sí, Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
