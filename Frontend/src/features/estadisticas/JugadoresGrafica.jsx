import React from 'react';

/**
 * JugadoresGrafica
 * Figuras estilizadas de atletas de básquetbol y voleibol para colocar en la cima (borde superior) de los gráficos.
 * - Jugador de Básquetbol: En suspensión aérea rematando una volcada / tiro en suspensión con efecto de estela de fuego.
 * - Jugadora de Voleibol: En salto de ataque sobre la red ejecutando un remate / bloqueo olímpico con estela eléctrica.
 */
export default function JugadoresGrafica({ tipo = 'duelo', titulo = '' }) {
  if (tipo === 'duelo') {
    return (
      <div className="chart-athletes-header" aria-label="Atletas en la cima del gráfico">
        {/* Atleta de Voleibol (Izquierda) */}
        <div className="athlete-card athlete-voley-jump">
          <svg
            className="athlete-svg"
            viewBox="0 0 120 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="voleyPlayerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
              <filter id="voleyGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#38bdf8" floodOpacity="0.6" />
              </filter>
            </defs>

            {/* Balón de Voleibol elevado sobre la mano */}
            <g className="floating-athlete-ball">
              <circle cx="85" cy="22" r="14" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" filter="url(#voleyGlow)" />
              <path d="M 75 14 Q 85 22 95 30" stroke="#eab308" strokeWidth="2" fill="none" />
              <path d="M 73 26 Q 85 22 97 18" stroke="#38bdf8" strokeWidth="2" fill="none" />
              <circle cx="85" cy="22" r="4" fill="#0284c7" />
            </g>

            {/* Silueta de Jugadora Rematadora de Voleibol */}
            <g fill="url(#voleyPlayerGrad)">
              {/* Cabeza con coleta en movimiento */}
              <circle cx="48" cy="38" r="10" />
              <path d="M 40 38 Q 30 32 25 36 Q 32 44 42 42 Z" fill="#075985" />

              {/* Brazo ejecutor extendido hacia arriba para el remate */}
              <path d="M 52 46 L 76 28 L 82 32 L 56 52 Z" />
              {/* Mano abierta para impactar el balón */}
              <circle cx="80" cy="29" r="4" fill="#bae6fd" />

              {/* Brazo izquierdo de equilibrio */}
              <path d="M 44 48 L 28 58 L 25 54 L 42 46 Z" />

              {/* Torso arqueado con uniforme deportivo #7 */}
              <path d="M 42 46 L 56 50 L 52 82 L 38 80 Z" />

              {/* Piernas en suspensión atlética de salto vertical */}
              {/* Pierna delantera flexionada */}
              <path d="M 40 80 L 32 108 L 22 104 L 34 78 Z" />
              <circle cx="21" cy="105" r="4" fill="#0284c7" /> {/* Zapatilla */}

              {/* Pierna trasera estirada con impulso */}
              <path d="M 50 82 L 58 116 L 68 126 L 62 130 L 52 118 L 46 82 Z" />
              <circle cx="65" cy="128" r="4" fill="#0284c7" /> {/* Zapatilla */}
            </g>

            {/* Estela de Salto de Vóley */}
            <path
              d="M 30 135 Q 45 110 50 90"
              stroke="#38bdf8"
              strokeWidth="3"
              strokeDasharray="4 4"
              strokeLinecap="round"
              opacity="0.8"
            />
          </svg>
          <div className="athlete-info-tag tag-voley">
            <span className="athlete-name">🏐 Rematador Élite</span>
            <span className="athlete-stat">Salto Vertical +95cm</span>
          </div>
        </div>

        {/* Centro: Línea / Red decorativa de la cima */}
        <div className="athlete-net-center">
          <div className="athlete-net-bar" />
          <span className="athlete-center-versus">VS</span>
          <div className="athlete-net-bar" />
        </div>

        {/* Atleta de Básquetbol (Derecha) */}
        <div className="athlete-card athlete-basket-dunk">
          <div className="athlete-info-tag tag-basket">
            <span className="athlete-name">🏀 Dunk Master</span>
            <span className="athlete-stat">Clavada 360° Slam</span>
          </div>

          <svg
            className="athlete-svg"
            viewBox="0 0 120 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="basketPlayerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="60%" stopColor="#c2410c" />
                <stop offset="100%" stopColor="#9a3412" />
              </linearGradient>
              <filter id="basketGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#f97316" floodOpacity="0.7" />
              </filter>
            </defs>

            {/* Balón de Básquetbol incandescente en la mano */}
            <g className="floating-athlete-ball">
              <circle cx="35" cy="20" r="15" fill="#f97316" stroke="#7c2d12" strokeWidth="2.5" filter="url(#basketGlow)" />
              <line x1="20" y1="20" x2="50" y2="20" stroke="#1e293b" strokeWidth="2" />
              <line x1="35" y1="5" x2="35" y2="35" stroke="#1e293b" strokeWidth="2" />
              <path d="M 24 10 Q 35 20 24 30" stroke="#1e293b" strokeWidth="2" fill="none" />
              <path d="M 46 10 Q 35 20 46 30" stroke="#1e293b" strokeWidth="2" fill="none" />
            </g>

            {/* Silueta de Jugador de Básquetbol en vuelo de volcada */}
            <g fill="url(#basketPlayerGrad)">
              {/* Cabeza con cinta deportiva (headband) */}
              <circle cx="70" cy="36" r="10" />
              <rect x="62" y="32" width="16" height="3" fill="#ffffff" rx="1.5" />

              {/* Brazo con el que sostiene y clava el balón */}
              <path d="M 64 44 L 40 26 L 36 31 L 58 50 Z" />
              <circle cx="38" cy="28" r="4.5" fill="#ffedd5" /> {/* Mano en la bola */}

              {/* Brazo secundario de potencia */}
              <path d="M 76 46 L 94 40 L 96 45 L 80 54 Z" />

              {/* Tronco con musculatura y jersey #23 */}
              <path d="M 60 46 L 78 48 L 74 80 L 56 78 Z" />

              {/* Piernas abiertas en el aire (estilo Jordan Jumpman) */}
              {/* Pierna izquierda hacia adelante */}
              <path d="M 58 78 L 44 98 L 30 116 L 36 120 L 52 100 L 64 80 Z" />
              <circle cx="34" cy="118" r="5" fill="#1e293b" /> {/* Zapatilla de basket */}

              {/* Pierna derecha doblada hacia atrás */}
              <path d="M 72 80 L 86 104 L 98 108 L 96 114 L 80 110 L 68 82 Z" />
              <circle cx="97" cy="111" r="5" fill="#1e293b" /> {/* Zapatilla de basket */}
            </g>

            {/* Mini Aro y Tablero al que va a clavar */}
            <g opacity="0.65">
              <line x1="8" y1="12" x2="8" y2="44" stroke="#ffffff" strokeWidth="3" />
              <rect x="8" y="24" width="16" height="4" fill="#ea580c" />
              <path d="M 8 28 L 14 44 L 20 44 L 24 28" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
            </g>
          </svg>
        </div>
      </div>
    );
  }

  // Modo: Acción de Cancha (Dribble & Recepción)
  return (
    <div className="chart-athletes-header" aria-label="Atletas en acción en la cima">
      {/* Básquetbol Crossover */}
      <div className="athlete-card athlete-basket-dunk">
        <svg className="athlete-svg" viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="20" r="9" fill="#ea580c" />
          <path d="M 44 30 L 60 32 L 56 62 L 40 60 Z" fill="#c2410c" />
          {/* Brazos protegiendo el balón en drible */}
          <path d="M 44 32 L 24 46 L 28 50 L 46 38 Z" fill="#ea580c" />
          <path d="M 58 34 L 74 44 L 72 50 L 56 40 Z" fill="#ea580c" />
          {/* Piernas en flexión baja */}
          <path d="M 42 60 L 26 84 L 14 96 L 20 100 L 32 86 L 46 62 Z" fill="#9a3412" />
          <path d="M 54 62 L 68 84 L 84 96 L 80 100 L 64 86 L 52 62 Z" fill="#9a3412" />
          {/* Balón rebotando en el suelo */}
          <circle cx="20" cy="62" r="11" fill="#f97316" stroke="#7c2d12" strokeWidth="2" />
          <path d="M 12 62 L 28 62" stroke="#000" strokeWidth="1.5" />
          <path d="M 20 52 L 20 72" stroke="#000" strokeWidth="1.5" />
        </svg>
        <div className="athlete-info-tag tag-basket">
          <span className="athlete-name">🏀 Crossover Speed</span>
          <span className="athlete-stat">Líder Anotador</span>
        </div>
      </div>

      <div className="athlete-net-center">
        <div className="athlete-net-bar" />
        <span className="athlete-center-versus">⚡</span>
        <div className="athlete-net-bar" />
      </div>

      {/* Voleibol Recepción / Líbero en defensa */}
      <div className="athlete-card athlete-voley-jump">
        <div className="athlete-info-tag tag-voley">
          <span className="athlete-name">🏐 Muralla Defensiva</span>
          <span className="athlete-stat">Bloqueo de Impacto</span>
        </div>
        <svg className="athlete-svg" viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="22" r="9" fill="#0284c7" />
          <path d="M 44 32 L 58 32 L 54 64 L 42 64 Z" fill="#0369a1" />
          {/* Brazos juntos al frente en recepción / plataforma de antebrazos */}
          <path d="M 44 34 L 54 56 L 50 60 L 40 38 Z" fill="#38bdf8" />
          <path d="M 56 34 L 56 56 L 52 60 L 52 38 Z" fill="#38bdf8" />
          {/* Manos unidas */}
          <circle cx="53" cy="58" r="4" fill="#ffffff" />
          {/* Posición de recepción flexionada */}
          <path d="M 44 64 L 30 84 L 38 100 L 44 98 L 36 84 L 48 64 Z" fill="#075985" />
          <path d="M 52 64 L 66 84 L 58 100 L 52 98 L 60 84 L 48 64 Z" fill="#075985" />
          {/* Balón impactando en antebrazos */}
          <circle cx="54" cy="42" r="10" fill="#f8fafc" stroke="#0284c7" strokeWidth="2" />
          <path d="M 46 38 Q 54 42 62 46" stroke="#eab308" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
    </div>
  );
}
