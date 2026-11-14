import React, { useEffect, useState } from 'react';
import { Flame, Zap, Trophy, Sparkles } from 'lucide-react';

/**
 * AnimacionChoqueBalones
 * Animación cinematográfica de colisión de balones al crear o registrar un partido:
 * - Básquetbol: ¡SUPERBOLAS! Balones en llamas a velocidad supersónica que chocan con explosión de fuego y chispas.
 * - Voleibol: ¡VOLLEYBALL SMASH! Balones eléctricos impulsados por remate aéreo que chocan con ondas sónicas y rayos.
 */
export default function AnimacionChoqueBalones({
  visible,
  deporteCodigo = 'BASKET',
  equipoLocal = 'Equipo Local',
  equipoVisitante = 'Equipo Visitante',
  onFinalizar,
}) {
  const [fase, setFase] = useState('inicio'); // 'aproximando', 'impacto', 'celebracion'

  const esBasket = deporteCodigo === 'BASKET' || String(deporteCodigo).toLowerCase().includes('basket');

  useEffect(() => {
    if (!visible) {
      setFase('inicio');
      return;
    }

    // Cronología de la animación
    setFase('aproximando');

    // Momento del Choque / Impacto
    const timerImpacto = setTimeout(() => {
      setFase('impacto');
    }, 700);

    // Momento de la revelación victoriosa
    const timerCelebracion = setTimeout(() => {
      setFase('celebracion');
    }, 1100);

    // Finalizar animación automáticamente
    const timerFinal = setTimeout(() => {
      if (onFinalizar) onFinalizar();
    }, 2800);

    return () => {
      clearTimeout(timerImpacto);
      clearTimeout(timerCelebracion);
      clearTimeout(timerFinal);
    };
  }, [visible, onFinalizar]);

  if (!visible) return null;

  return (
    <div className={`clash-overlay ${fase === 'impacto' ? 'clash-screen-shake' : ''}`}>
      {/* Resplandor ambiental de estadio */}
      <div className={`clash-ambient-glow ${esBasket ? 'glow-basket' : 'glow-voley'}`} />

      {/* Partículas de chispas o rayos */}
      <div className="clash-particles-container">
        {[...Array(16)].map((_, i) => (
          <span
            key={i}
            className={`clash-sparkle ${esBasket ? 'sparkle-fire' : 'sparkle-electric'} ${fase === 'impacto' || fase === 'celebracion' ? 'explode' : ''}`}
            style={{
              '--angle': `${i * 22.5}deg`,
              '--delay': `${(i % 4) * 0.05}s`,
              '--dist': `${120 + (i % 5) * 45}px`,
            }}
          />
        ))}
      </div>

      <div className="clash-stage">
        {/* Balón Izquierdo (Avanza de izquierda al centro) */}
        <div className={`clash-ball-wrapper ball-left ${fase}`}>
          {esBasket ? (
            /* Superbola de Básquetbol con llamas ardientes */
            <div className="superbola-basket">
              <div className="fire-aura">
                <Flame className="fire-icon-left" size={60} />
              </div>
              <div className="basketball-graphic">
                <div className="basket-seam horizontal" />
                <div className="basket-seam vertical" />
                <div className="basket-seam curve-1" />
                <div className="basket-seam curve-2" />
                <span className="ball-glow-flame" />
              </div>
              <div className="speed-lines fire-speed" />
            </div>
          ) : (
            /* Balón de Voleibol con estela de viento y rayos */
            <div className="volleyball-smash">
              <div className="electric-aura">
                <Zap className="electric-icon-left" size={54} />
              </div>
              <div className="voleyball-graphic">
                <div className="voley-panel blue-panel" />
                <div className="voley-panel yellow-panel" />
                <div className="voley-panel white-panel" />
                <span className="ball-glow-voley" />
              </div>
              <div className="speed-lines voley-speed" />
            </div>
          )}
          <span className="team-floating-tag tag-left">{equipoLocal}</span>
        </div>

        {/* Zona de Choque en el Centro */}
        <div className={`clash-center-impact ${fase === 'impacto' || fase === 'celebracion' ? 'active' : ''}`}>
          {/* Ondas expansivas concéntricas */}
          <div className="shockwave-ring ring-1" />
          <div className="shockwave-ring ring-2" />
          <div className="shockwave-ring ring-3" />

          {/* Flash cegador de impacto */}
          <div className="impact-flash" />

          {/* Icono central de explosión */}
          <div className="impact-symbol">
            {esBasket ? '💥' : '⚡'}
          </div>
        </div>

        {/* Balón Derecho (Avanza de derecha al centro) */}
        <div className={`clash-ball-wrapper ball-right ${fase}`}>
          {esBasket ? (
            /* Segunda Superbola de Básquetbol con llamas ardientes */
            <div className="superbola-basket mirror">
              <div className="fire-aura">
                <Flame className="fire-icon-right" size={60} />
              </div>
              <div className="basketball-graphic">
                <div className="basket-seam horizontal" />
                <div className="basket-seam vertical" />
                <div className="basket-seam curve-1" />
                <div className="basket-seam curve-2" />
                <span className="ball-glow-flame" />
              </div>
              <div className="speed-lines fire-speed" />
            </div>
          ) : (
            /* Segundo Balón de Voleibol con remate supersónico */
            <div className="volleyball-smash mirror">
              <div className="electric-aura">
                <Zap className="electric-icon-right" size={54} />
              </div>
              <div className="voleyball-graphic">
                <div className="voley-panel yellow-panel" />
                <div className="voley-panel blue-panel" />
                <div className="voley-panel white-panel" />
                <span className="ball-glow-voley" />
              </div>
              <div className="speed-lines voley-speed" />
            </div>
          )}
          <span className="team-floating-tag tag-right">{equipoVisitante}</span>
        </div>
      </div>

      {/* Cartel Victorioso / Título del Choque */}
      <div className={`clash-title-banner ${fase === 'celebracion' ? 'banner-visible' : ''}`}>
        <div className="clash-badge">
          <Trophy size={20} />
          <span>{esBasket ? '¡DUELO DE SUPERBOLAS EN LA DUELA!' : '¡REMATE ÉPICO SOBRE LA RED!'}</span>
          <Sparkles size={20} />
        </div>
        <h2 className="clash-main-text">
          {esBasket ? '🔥 ¡SUPERBASKET CLASH! 🔥' : '⚡ ¡VOLLEYBALL SPIKE! ⚡'}
        </h2>
        <p className="clash-subtext">
          ¡Partido registrado con éxito en la plataforma oficial!
        </p>

        <button
          className="btn-clash-continue"
          onClick={() => {
            if (onFinalizar) onFinalizar();
          }}
        >
          Entrar a la Cancha &rarr;
        </button>
      </div>
    </div>
  );
}
