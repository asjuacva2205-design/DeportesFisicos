/**
 * Cliente API centralizado para comunicarse con Django REST Framework.
 * Maneja tokens de autenticación en localStorage y mide tiempos de respuesta.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export function getToken() {
  return localStorage.getItem('canchadata_token');
}

export function setToken(token, username = '', isStaff = false) {
  localStorage.setItem('canchadata_token', token);
  localStorage.setItem('canchadata_user', username);
  localStorage.setItem('canchadata_is_staff', isStaff ? 'true' : 'false');
}

export function removeToken() {
  localStorage.removeItem('canchadata_token');
  localStorage.removeItem('canchadata_user');
  localStorage.removeItem('canchadata_is_staff');
}

export function getUserInfo() {
  return {
    token: getToken(),
    username: localStorage.getItem('canchadata_user') || '',
    isStaff: localStorage.getItem('canchadata_is_staff') === 'true',
  };
}

export async function peticion(ruta, opciones = {}) {
  const inicio = performance.now();
  const url = ruta.startsWith('http') ? ruta : `${API_BASE_URL}${ruta.startsWith('/') ? '' : '/'}${ruta}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(opciones.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  const configuracion = {
    ...opciones,
    headers,
  };

  try {
    const respuesta = await fetch(url, configuracion);
    const ms = Math.round(performance.now() - inicio);
    
    let datos = null;
    const contentType = respuesta.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      datos = await respuesta.json();
    } else {
      datos = await respuesta.text();
    }

    return {
      ok: respuesta.ok,
      status: respuesta.status,
      datos,
      ms,
    };
  } catch (error) {
    const ms = Math.round(performance.now() - inicio);
    return {
      ok: false,
      status: 0,
      datos: { error: 'No se pudo conectar con el servidor Django. ¿Está corriendo?' },
      ms,
      error,
    };
  }
}
