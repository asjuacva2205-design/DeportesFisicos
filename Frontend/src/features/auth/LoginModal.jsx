import React, { useState } from 'react';
import { peticion, setToken } from '../../shared/api';
import { LogIn, X, Lock } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    const res = await peticion('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    setCargando(false);
    if (res.ok && res.datos?.token) {
      setToken(res.datos.token, res.datos.username, res.datos.is_staff);
      onLoginSuccess(res.datos);
      onClose();
    } else {
      setError(res.datos?.non_field_errors?.[0] || 'Credenciales incorrectas o usuario no encontrado.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e3a8a' }}>
            <Lock size={20} /> Iniciar Sesión (Token)
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
          Inicia sesión con un superusuario de Django para desbloquear la creación, edición y borrado de partidos.
        </p>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label className="filter-label" style={{ display: 'block', marginBottom: '0.25rem' }}>Usuario</label>
            <input
              type="text"
              className="form-input"
              style={{ width: '100%' }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label className="filter-label" style={{ display: 'block', marginBottom: '0.25rem' }}>Contraseña</label>
            <input
              type="password"
              className="form-input"
              style={{ width: '100%' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={cargando}>
              <LogIn size={16} /> {cargando ? 'Ingresando...' : 'Acceder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
