import React from 'react';

/**
 * SportTableBorder
 * Envoltorio limpio y moderno para resaltar tablas de datos:
 * - Marco de alto contraste con sutil acento deportivo (Vóley #0284c7 a Básquet #ea580c).
 * - Elimina los bordes esquineros de balones repetitivos para lograr un diseño profesional, limpio y legible.
 * - Encabezado integrado con tipografía clara y badges de estado.
 */
export default function SportTableBorder({ children, titulo = '', subtitulo = '', badge = '' }) {
  return (
    <div className="table-highlight-wrapper">
      {/* Barra superior con gradiente de resplandor deportivo sutil */}
      <div className="table-highlight-topbar" />

      {/* Cabecera de la Tabla */}
      {titulo && (
        <div className="table-highlight-header">
          <div>
            <h3 className="table-highlight-title">{titulo}</h3>
            {subtitulo && <p className="table-highlight-subtitle">{subtitulo}</p>}
          </div>
          {badge && <span className="table-highlight-badge">{badge}</span>}
        </div>
      )}

      {/* Contenedor de la Tabla */}
      <div className="table-highlight-body">
        {children}
      </div>
    </div>
  );
}
