import React from 'react';

/**
 * SportTableBorder
 * Envoltorio perimetral temático para tablas con bordes de balones de vóley y básquetbol:
 * - Cenefa superior e inferior con balones 3D alternados de básquetbol y voleibol en movimiento.
 * - Esquinas animadas con balones interactivos que rebotan y giran al pasar el mouse.
 * - Bordes laterales con degradado de resplandor deportivo (Fuego Básquet a Azul Vóley).
 */
export default function SportTableBorder({ children, titulo = '', subtitulo = '', badge = '' }) {
  // Generar balones alternados para el borde superior e inferior
  const balonesSuperiores = ['🏀', '🏐', '🏀', '🏐', '🏀', '🏐', '🏀', '🏐', '🏀', '🏐', '🏀', '🏐', '🏀', '🏐'];
  const balonesInferiores = ['🏐', '🏀', '🏐', '🏀', '🏐', '🏀', '🏐', '🏀', '🏐', '🏀', '🏐', '🏀', '🏐', '🏀'];

  return (
    <div className="sport-table-wrapper">
      {/* Esquina Superior Izquierda: Balón de Básquetbol */}
      <div className="corner-sport-ball corner-top-left" title="Básquetbol">
        <span className="ball-emoji-rotator">🏀</span>
      </div>

      {/* Esquina Superior Derecha: Balón de Voleibol */}
      <div className="corner-sport-ball corner-top-right" title="Voleibol">
        <span className="ball-emoji-rotator">🏐</span>
      </div>

      {/* Cenefa Superior de Balones */}
      <div className="sport-ball-border-strip strip-top" aria-hidden="true">
        <div className="ball-stream">
          {balonesSuperiores.map((b, idx) => (
            <span key={`top-${idx}`} className={`ball-pip ${b === '🏀' ? 'pip-basket' : 'pip-voley'}`}>
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Contenido de la Tabla */}
      <div className="sport-table-inner">
        {titulo && (
          <div className="sport-table-headline">
            <div>
              <h3 className="sport-table-title">{titulo}</h3>
              {subtitulo && <p className="sport-table-subtitle">{subtitulo}</p>}
            </div>
            {badge && <span className="sport-table-badge">{badge}</span>}
          </div>
        )}
        {children}
      </div>

      {/* Cenefa Inferior de Balones */}
      <div className="sport-ball-border-strip strip-bottom" aria-hidden="true">
        <div className="ball-stream stream-reverse">
          {balonesInferiores.map((b, idx) => (
            <span key={`bot-${idx}`} className={`ball-pip ${b === '🏀' ? 'pip-basket' : 'pip-voley'}`}>
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Esquina Inferior Izquierda: Balón de Voleibol */}
      <div className="corner-sport-ball corner-bottom-left" title="Voleibol">
        <span className="ball-emoji-rotator">🏐</span>
      </div>

      {/* Esquina Inferior Derecha: Balón de Básquetbol */}
      <div className="corner-sport-ball corner-bottom-right" title="Básquetbol">
        <span className="ball-emoji-rotator">🏀</span>
      </div>
    </div>
  );
}
