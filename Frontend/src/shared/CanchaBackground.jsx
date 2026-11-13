import React from 'react';

/**
 * CanchaBackground
 * Fondo dividido de estadio atlético:
 * - Mitad Izquierda: Cancha de Voleibol (Azul olímpico, zona de ataque 3m, líneas de zaga y red central)
 * - Mitad Derecha: Cancha de Básquetbol (Duela de madera / Parquet ámbar, arco de 3 puntos, llave y tiro libre)
 * - Centro: Red de voleibol entrelazada con el círculo central de básquetbol y reflector de estadio
 */
export default function CanchaBackground() {
  return (
    <div className="cancha-background-container" aria-hidden="true">
      {/* Capa de iluminación de estadio */}
      <div className="stadium-lighting-overlay" />

      {/* SVG del Campo Dividido */}
      <svg
        className="cancha-svg-board"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Patrón de madera de básquetbol */}
          <linearGradient id="basketWoodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9a3412" />
            <stop offset="35%" stopColor="#c2410c" />
            <stop offset="70%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#7c2d12" />
          </linearGradient>

          {/* Patrón de duela / tablones de madera */}
          <pattern id="hardwoodPattern" width="40" height="20" patternUnits="userSpaceOnUse">
            <rect width="40" height="20" fill="url(#basketWoodGrad)" />
            <line x1="0" y1="0" x2="40" y2="0" stroke="#78350f" strokeWidth="1" strokeOpacity="0.35" />
            <line x1="0" y1="10" x2="40" y2="10" stroke="#78350f" strokeWidth="1" strokeOpacity="0.35" />
            <line x1="20" y1="0" x2="20" y2="10" stroke="#78350f" strokeWidth="1" strokeOpacity="0.25" />
            <line x1="0" y1="10" x2="0" y2="20" stroke="#78350f" strokeWidth="1" strokeOpacity="0.25" />
            <line x1="40" y1="10" x2="40" y2="20" stroke="#78350f" strokeWidth="1" strokeOpacity="0.25" />
          </pattern>

          {/* Gradiente de piso de vóley azul olímpico */}
          <linearGradient id="voleyFloorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0369a1" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#075985" />
          </linearGradient>

          {/* Gradiente del marco exterior de vóley (amarillo canario clásico de sala) */}
          <linearGradient id="voleyMarginGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          {/* Patrón de malla de la red de voleibol */}
          <pattern id="netMesh" width="10" height="10" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill="none" />
            <path d="M 0 5 L 10 5 M 5 0 L 5 10" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.85" />
          </pattern>

          {/* Resplandor de choque de balones */}
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#f97316" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ---------------------------------------------------- */}
        {/* LADO IZQUIERDO: CANCHA DE VOLEIBOL                  */}
        {/* ---------------------------------------------------- */}
        {/* Margen perimetral de voleibol (zona libre) */}
        <rect x="0" y="0" width="800" height="1000" fill="url(#voleyMarginGrad)" />
        {/* Superficie de juego de voleibol (corte reglamentario 9m x 9m mitad) */}
        <rect x="60" y="80" width="740" height="840" rx="4" fill="url(#voleyFloorGrad)" />

        {/* Línea perimetral de vóley (5cm reglamentarios en blanco) */}
        <rect x="60" y="80" width="740" height="840" fill="none" stroke="#ffffff" strokeWidth="8" strokeOpacity="0.9" />

        {/* Línea de ataque de 3 metros (zona delantera vs zona zaguera) */}
        <line x1="550" y1="80" x2="550" y2="920" stroke="#ffffff" strokeWidth="8" strokeDasharray="16,8" strokeOpacity="0.9" />

        {/* Marcas de línea de saque de voleibol */}
        <line x1="60" y1="200" x2="30" y2="200" stroke="#ffffff" strokeWidth="6" strokeOpacity="0.85" />
        <line x1="60" y1="800" x2="30" y2="800" stroke="#ffffff" strokeWidth="6" strokeOpacity="0.85" />

        {/* Texto decorativo estilizado de cancha */}
        <text
          x="300"
          y="500"
          fill="#ffffff"
          fillOpacity="0.12"
          fontSize="72"
          fontWeight="900"
          fontFamily="system-ui, sans-serif"
          letterSpacing="12"
          transform="rotate(-90 300 500)"
          textAnchor="middle"
        >
          VOLLEYBALL COURT
        </text>

        {/* ---------------------------------------------------- */}
        {/* LADO DERECHO: CANCHA DE BÁSQUETBOL                  */}
        {/* ---------------------------------------------------- */}
        {/* Superficie de madera pulida / Parquet de básquet */}
        <rect x="800" y="0" width="800" height="1000" fill="url(#hardwoodPattern)" />

        {/* Líneas perimetrales de básquetbol */}
        <rect x="800" y="80" width="740" height="840" fill="none" stroke="#ffffff" strokeWidth="8" strokeOpacity="0.9" />

        {/* Arco de 3 Puntos (Línea curva reglamentaria 6.75m) */}
        <path
          d="M 1540 220 L 1260 220 A 420 420 0 0 0 1260 780 L 1540 780"
          fill="none"
          stroke="#ffffff"
          strokeWidth="8"
          strokeOpacity="0.9"
        />

        {/* La Llave / Zona Pintada de Básquetbol */}
        <rect x="1220" y="360" width="320" height="280" fill="#0f172a" fillOpacity="0.35" stroke="#ffffff" strokeWidth="8" />

        {/* Círculo de Tiro Libre */}
        <circle cx="1220" cy="500" r="100" fill="none" stroke="#ffffff" strokeWidth="8" strokeOpacity="0.9" />
        <path d="M 1220 400 A 100 100 0 0 1 1220 600" fill="none" stroke="#ffffff" strokeWidth="8" strokeDasharray="14,10" />

        {/* Tablero y Canasta de Básquetbol */}
        <line x1="1480" y1="440" x2="1480" y2="560" stroke="#f97316" strokeWidth="12" strokeLinecap="round" />
        <circle cx="1455" cy="500" r="28" fill="none" stroke="#ea580c" strokeWidth="6" />

        {/* Texto decorativo estilizado de cancha */}
        <text
          x="1050"
          y="500"
          fill="#ffffff"
          fillOpacity="0.12"
          fontSize="72"
          fontWeight="900"
          fontFamily="system-ui, sans-serif"
          letterSpacing="12"
          transform="rotate(90 1050 500)"
          textAnchor="middle"
        >
          BASKETBALL ARENA
        </text>

        {/* ---------------------------------------------------- */}
        {/* CENTRO: RED DE VOLEY & CÍRCULO CENTRAL DE BASKET     */}
        {/* ---------------------------------------------------- */}
        {/* Círculo de salto de básquetbol en el centro */}
        <circle cx="800" cy="500" r="140" fill="url(#centerGlow)" stroke="#ffffff" strokeWidth="8" strokeOpacity="0.8" />
        <circle cx="800" cy="500" r="45" fill="#f97316" fillOpacity="0.3" stroke="#ffffff" strokeWidth="6" />

        {/* Postes de la Red de Voleibol */}
        <rect x="792" y="40" width="16" height="920" fill="#334155" rx="8" />

        {/* Malla de la red de voleibol a lo largo de la línea divisoria central */}
        <rect x="784" y="60" width="32" height="880" fill="url(#netMesh)" />
        {/* Banda blanca superior de la red */}
        <line x1="782" y1="60" x2="818" y2="60" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
        {/* Banda blanca inferior de la red */}
        <line x1="782" y1="940" x2="818" y2="940" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />

        {/* Antenas de voleibol (rojas y blancas reglamentarias) */}
        <line x1="790" y1="40" x2="790" y2="120" stroke="#ef4444" strokeWidth="5" strokeDasharray="12,12" />
        <line x1="810" y1="40" x2="810" y2="120" stroke="#ffffff" strokeWidth="5" strokeDasharray="12,12" />

        {/* Mini Balones de adorno flotando suavemente en el fondo */}
        {/* Balón de Voleibol flotando en la cancha izquierda */}
        <g className="floating-court-ball ball-voley-bg" transform="translate(220, 260)">
          <circle cx="0" cy="0" r="32" fill="#f8fafc" stroke="#0284c7" strokeWidth="3" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.4))" />
          {/* Secciones curvas de balón de vóley con colores amarillo y azul */}
          <path d="M -32 0 A 32 32 0 0 1 0 -32 A 32 32 0 0 0 -32 0 Z" fill="#38bdf8" fillOpacity="0.85" />
          <path d="M 0 32 A 32 32 0 0 1 32 0 A 32 32 0 0 0 0 32 Z" fill="#eab308" fillOpacity="0.85" />
          <circle cx="0" cy="0" r="32" fill="none" stroke="#1e293b" strokeWidth="2.5" />
          <path d="M -22 -22 Q 0 0 22 22" stroke="#0f172a" strokeWidth="2.5" fill="none" />
          <path d="M -22 22 Q 0 0 22 -22" stroke="#0f172a" strokeWidth="2.5" fill="none" />
        </g>

        {/* Balón de Básquetbol flotando en la cancha derecha */}
        <g className="floating-court-ball ball-basket-bg" transform="translate(1380, 720)">
          <circle cx="0" cy="0" r="34" fill="#ea580c" stroke="#7c2d12" strokeWidth="3" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.5))" />
          {/* Líneas negras características de básquetbol */}
          <line x1="-34" y1="0" x2="34" y2="0" stroke="#1e293b" strokeWidth="3" />
          <line x1="0" y1="-34" x2="0" y2="34" stroke="#1e293b" strokeWidth="3" />
          <path d="M -24 -24 Q 0 0 -24 24" stroke="#1e293b" strokeWidth="3" fill="none" />
          <path d="M 24 -24 Q 0 0 24 24" stroke="#1e293b" strokeWidth="3" fill="none" />
          {/* Brillo de luz de duela */}
          <ellipse cx="-10" cy="-12" rx="10" ry="6" fill="#fed7aa" fillOpacity="0.45" />
        </g>
      </svg>

      {/* Capa de contraste y textura translúcida para que todo el contenido sea 100% legible */}
      <div className="court-frosted-overlay" />
    </div>
  );
}
