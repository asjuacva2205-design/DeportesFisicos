import React, { useState, useEffect } from 'react';
import { peticion } from '../../shared/api';
import {
  Play, RotateCcw, Zap, Target, Users, Shield, Award, Sparkles,
  ChevronRight, Activity, Flame, Compass, CheckCircle2
} from 'lucide-react';

export default function PizarraTacticaSimulator() {
  const [deporte, setDeporte] = useState('BASKET'); // 'BASKET' | 'VOLEY'
  const [simulando, setSimulando] = useState(false);
  const [pasoActual, setPasoActual] = useState(0); // Índice del paso actual en la secuencia de jugadores
  const [jugadorSeleccionadoId, setJugadorSeleccionadoId] = useState(1);
  const [equipos, setEquipos] = useState([]);
  const [equipoLocal, setEquipoLocal] = useState('');
  const [equipoVisitante, setEquipoVisitante] = useState('');

  // ============================================================================
  // POSICIONES OFICIALES FIBA (BÁSQUETBOL)
  // Coordenadas exactas en porcentaje y píxeles SVG (500 x 340)
  // Aro de básquetbol en x: 50%, y: 14% (SVG: 250, 48)
  // ============================================================================
  const aroBasket = { x: '50%', y: '14%', svgX: 250, svgY: 48, label: 'Aro / Canasta' };

  const jugadoresBasket = [
    {
      id: 1,
      rol: 'Base (PG)',
      dorsal: '7',
      nombre: 'Playmaker',
      x: '25%', y: '78%', svgX: 125, svgY: 265,
      nombreJugada: 'Pick & Roll: Base ➔ Pívot ➔ Canasta',
      regla: 'FIBA Art. 24: Conducción y pase de desmarque',
      // Secuencia estricta de jugador a jugador:
      // Paso 0: Base tiene balón
      // Paso 1: Pasa directo a las manos del Pívot
      // Paso 2: Pívot clava el balón en el aro
      pasos: [
        { x: '25%', y: '78%', jugador: 'Base (#7)', accion: 'Inicio de posesión' },
        { x: '50%', y: '32%', jugador: 'Pívot (#15)', accion: 'Pase directo al pecho del Pívot' },
        { x: '50%', y: '14%', jugador: 'Aro NBA', accion: '¡Pívot remata con clavada al aro!' }
      ],
      trayectoriaSvg: 'M 125 265 L 250 108 L 250 48',
      puntoImpacto: { x: 250, y: 48 },
      metricas: { velocidad: '32.5 km/h', salto: '88 cm', tiempo: '1.2s', puntos: '¡DUNK +2 PTS!' }
    },
    {
      id: 2,
      rol: 'Escolta (SG)',
      dorsal: '23',
      nombre: 'Shooter',
      x: '75%', y: '78%', svgX: 375, svgY: 265,
      nombreJugada: 'Circulación: Base ➔ Escolta ➔ Triple',
      regla: 'FIBA Art. 29: Tiro detrás de la línea de 6.75m',
      pasos: [
        { x: '25%', y: '78%', jugador: 'Base (#7)', accion: 'Base inicia ataque' },
        { x: '75%', y: '78%', jugador: 'Escolta (#23)', accion: 'Pase perimetral a las manos del Escolta' },
        { x: '50%', y: '14%', jugador: 'Aro NBA', accion: '¡Escolta lanza y anota triple limpio!' }
      ],
      trayectoriaSvg: 'M 125 265 L 375 265 L 250 48',
      puntoImpacto: { x: 250, y: 48 },
      metricas: { velocidad: '38.0 km/h', salto: '72 cm', tiempo: '1.4s', puntos: '¡TRIPLE +3 PTS!' }
    },
    {
      id: 3,
      rol: 'Alero (SF)',
      dorsal: '6',
      nombre: 'Slasher',
      x: '16%', y: '48%', svgX: 80, svgY: 163,
      nombreJugada: 'Ataque Rápido: Base ➔ Alero ➔ Bandeja',
      regla: 'FIBA Art. 25: Entrada al aro sin caminar',
      pasos: [
        { x: '25%', y: '78%', jugador: 'Base (#7)', accion: 'Pase adelantado al ala izquierda' },
        { x: '16%', y: '48%', jugador: 'Alero (#6)', accion: 'Alero recibe en carrera' },
        { x: '50%', y: '14%', jugador: 'Aro NBA', accion: '¡Alero entra y anota bandeja en el aro!' }
      ],
      trayectoriaSvg: 'M 125 265 L 80 163 L 250 48',
      puntoImpacto: { x: 250, y: 48 },
      metricas: { velocidad: '34.2 km/h', salto: '79 cm', tiempo: '1.1s', puntos: '¡BANDEJA +2 PTS!' }
    },
    {
      id: 4,
      rol: 'Ala-Pívot (PF)',
      dorsal: '34',
      nombre: 'Power Forward',
      x: '84%', y: '48%', svgX: 420, svgY: 163,
      nombreJugada: 'In-and-Out: Escolta ➔ Ala-Pívot ➔ Media Distancia',
      regla: 'FIBA Art. 16: Tiro en suspensión desde poste medio',
      pasos: [
        { x: '75%', y: '78%', jugador: 'Escolta (#23)', accion: 'Escolta fija marca' },
        { x: '84%', y: '48%', jugador: 'Ala-Pívot (#34)', accion: 'Pase a las manos del Ala-Pívot' },
        { x: '50%', y: '14%', jugador: 'Aro NBA', accion: '¡Ala-Pívot encesta tiro de 2 puntos!' }
      ],
      trayectoriaSvg: 'M 375 265 L 420 163 L 250 48',
      puntoImpacto: { x: 250, y: 48 },
      metricas: { velocidad: '29.0 km/h', salto: '74 cm', tiempo: '1.3s', puntos: '¡CANASTA +2 PTS!' }
    },
    {
      id: 5,
      rol: 'Pívot (C)',
      dorsal: '15',
      nombre: 'Center Rim',
      x: '50%', y: '32%', svgX: 250, svgY: 108,
      nombreJugada: 'Alley-Oop Directo: Base ➔ Pívot ➔ Martillazo',
      regla: 'FIBA Art. 15: Hundimiento de balón sobre el aro',
      pasos: [
        { x: '25%', y: '78%', jugador: 'Base (#7)', accion: 'Base lanza pase elevado sobre la pintura' },
        { x: '50%', y: '32%', jugador: 'Pívot (#15)', accion: 'Pívot atrapa el balón en el aire' },
        { x: '50%', y: '14%', jugador: 'Aro NBA', accion: '¡Pívot hunde el balón en la canasta!' }
      ],
      trayectoriaSvg: 'M 125 265 L 250 108 L 250 48',
      puntoImpacto: { x: 250, y: 48 },
      metricas: { velocidad: '44.5 km/h', salto: '96 cm', tiempo: '0.9s', puntos: '¡ALLEY-OOP DUNK!' }
    },
  ];

  // ============================================================================
  // POSICIONES Y REGLAS OFICIALES FIVB (VOLEIBOL)
  // Regla estricta de 3 toques: Recepción ➔ Colocación (Armador) ➔ Remate sobre la Red
  // Red en y: 25 (en la parte superior de la cancha)
  // Campo rival / Punto en y: 8 (cruzando la red hacia el campo contrario)
  // ============================================================================
  const jugadoresVoley = [
    {
      id: 1,
      rol: 'Armador (S)',
      dorsal: '2',
      nombre: 'Armador',
      x: '50%', y: '36%', svgX: 250, svgY: 122,
      nombreJugada: 'Toque Sorpresa: Líbero ➔ Armador ➔ Finta al Campo Rival',
      regla: 'FIVB Regla 13.1: Toque de segundo tiempo sobre la red',
      pasos: [
        { x: '24%', y: '76%', jugador: 'Líbero (#5)', accion: '1er Toque: Recepción perfecta del Líbero' },
        { x: '50%', y: '36%', jugador: 'Armador (#2)', accion: '2do Toque: Balón llega a manos del Armador' },
        { x: '35%', y: '6%', jugador: 'Piso Rival', accion: '3er Toque: Armador finta y toca el balón al piso rival' }
      ],
      trayectoriaSvg: 'M 120 258 L 250 122 L 175 20',
      puntoImpacto: { x: 175, y: 20 },
      metricas: { velocidad: '52.0 km/h', salto: '64 cm', tiempo: '1.2s', puntos: '¡PUNTO DE FINTA!' }
    },
    {
      id: 2,
      rol: 'Opuesto (OP)',
      dorsal: '18',
      nombre: 'Opuesto',
      x: '82%', y: '32%', svgX: 410, svgY: 109,
      nombreJugada: 'Ataque por Posición 2: Líbero ➔ Armador ➔ Opuesto ➔ Punto',
      regla: 'FIVB Regla 9.1: Tres toques máximos antes de cruzar la red',
      pasos: [
        { x: '24%', y: '76%', jugador: 'Líbero (#5)', accion: '1er Toque: Líbero defiende en zaga' },
        { x: '50%', y: '36%', jugador: 'Armador (#2)', accion: '2do Toque: Armador coloca a la antena derecha' },
        { x: '82%', y: '32%', jugador: 'Opuesto (#18)', accion: '3er Toque: Opuesto salta y conecta el remate' },
        { x: '20%', y: '6%', jugador: 'Piso Rival', accion: '¡El remate cruza la red y pica en campo rival!' }
      ],
      trayectoriaSvg: 'M 120 258 L 250 122 L 410 109 L 100 20',
      puntoImpacto: { x: 100, y: 20 },
      metricas: { velocidad: '116.4 km/h', salto: '104 cm', tiempo: '1.3s', puntos: '¡MISIL A 116 KM/H!' }
    },
    {
      id: 3,
      rol: 'Punta Receptor 1 (OH1)',
      dorsal: '9',
      nombre: 'Punta 1',
      x: '18%', y: '32%', svgX: 90, svgY: 109,
      nombreJugada: 'Remate por Posición 4: Punta 2 ➔ Armador ➔ Punta 1 ➔ Punto',
      regla: 'FIVB Regla 14: Ataque por la banda izquierda sobre el bloqueo',
      pasos: [
        { x: '82%', y: '76%', jugador: 'Punta 2 (#11)', accion: '1er Toque: Recepción de saque' },
        { x: '50%', y: '36%', jugador: 'Armador (#2)', accion: '2do Toque: Armador eleva balón a la punta izquierda' },
        { x: '18%', y: '32%', jugador: 'Punta 1 (#9)', accion: '3er Toque: Punta 1 remata con fuerza' },
        { x: '75%', y: '6%', jugador: 'Piso Rival', accion: '¡Remate diagonal pica adentro del campo rival!' }
      ],
      trayectoriaSvg: 'M 410 258 L 250 122 L 90 109 L 375 20',
      puntoImpacto: { x: 375, y: 20 },
      metricas: { velocidad: '108.2 km/h', salto: '97 cm', tiempo: '1.2s', puntos: '¡PUNTO DIAGONAL!' }
    },
    {
      id: 4,
      rol: 'Central (MB1)',
      dorsal: '14',
      nombre: 'Central',
      x: '50%', y: '58%', svgX: 250, svgY: 197,
      nombreJugada: 'Ataque 1er Tiempo: Líbero ➔ Armador ➔ Central ➔ Picada',
      regla: 'FIVB Regla 13.2: Balón rápido a 30cm sobre la banda de la red',
      pasos: [
        { x: '24%', y: '76%', jugador: 'Líbero (#5)', accion: '1er Toque: Recepción limpia a la red' },
        { x: '50%', y: '36%', jugador: 'Armador (#2)', accion: '2do Toque: Colocación ultrarrápida al centro' },
        { x: '50%', y: '58%', jugador: 'Central (#14)', accion: '3er Toque: Central martillea en suspensión' },
        { x: '50%', y: '6%', jugador: 'Piso Rival', accion: '¡Picada vertical fulminante al piso rival!' }
      ],
      trayectoriaSvg: 'M 120 258 L 250 122 L 250 197 L 250 20',
      puntoImpacto: { x: 250, y: 20 },
      metricas: { velocidad: '119.5 km/h', salto: '92 cm', tiempo: '0.8s', puntos: '¡PRIMER TEMPO 119 KM/H!' }
    },
    {
      id: 5,
      rol: 'Punta Receptor 2 (OH2)',
      dorsal: '11',
      nombre: 'Punta 2 / Servidor',
      x: '82%', y: '76%', svgX: 410, svgY: 258,
      nombreJugada: 'Saque As Olímpico: Punta 2 (Zona de Saque) ➔ Cruza Red ➔ Punto As',
      regla: 'FIVB Regla 12: Saque oficial en salto desde la línea de fondo',
      pasos: [
        { x: '82%', y: '76%', jugador: 'Punta 2 (#11)', accion: 'Lanzamiento y carrera de saque en salto' },
        { x: '50%', y: '12%', jugador: 'Banda de la Red', accion: 'El balón vuela a toda velocidad sobre la red' },
        { x: '20%', y: '6%', jugador: 'Piso Rival', accion: '¡SAQUE AS DIRECTO! El balón pica inalcanzable' }
      ],
      trayectoriaSvg: 'M 410 258 L 250 40 L 100 20',
      puntoImpacto: { x: 100, y: 20 },
      metricas: { velocidad: '112.0 km/h', salto: '85 cm', tiempo: '0.9s', puntos: '¡SAQUE AS DIRECTO!' }
    },
    {
      id: 6,
      rol: 'Líbero (L)',
      dorsal: '5',
      nombre: 'Líbero Defensivo',
      x: '24%', y: '76%', svgX: 120, svgY: 258,
      nombreJugada: 'Defensa Heroica: Líbero (Plancha) ➔ Armador ➔ Punta ➔ Contraataque',
      regla: 'FIVB Regla 19: Especialista defensivo no remata, inicia transición',
      pasos: [
        { x: '24%', y: '76%', jugador: 'Líbero (#5)', accion: '1er Toque: Líbero rescata en plancha al suelo' },
        { x: '50%', y: '36%', jugador: 'Armador (#2)', accion: '2do Toque: Armador distribuye a posición 4' },
        { x: '18%', y: '32%', jugador: 'Punta 1 (#9)', accion: '3er Toque: Punta remata en contraataque' },
        { x: '80%', y: '6%', jugador: 'Piso Rival', accion: '¡Punto de contraataque tras la salvada del Líbero!' }
      ],
      trayectoriaSvg: 'M 120 258 L 250 122 L 90 109 L 400 20',
      puntoImpacto: { x: 400, y: 20 },
      metricas: { velocidad: '98.0 km/h', salto: '22 cm', tiempo: '1.4s', puntos: '¡TRANSICIÓN EXITOSA!' }
    },
  ];

  // Cargar y filtrar equipos por deporte
  useEffect(() => {
    const cargarEquipos = async () => {
      const res = await peticion('/equipos/');
      if (res.ok && res.datos) {
        const lista = res.datos.results || res.datos;
        setEquipos(lista);
      }
    };
    cargarEquipos();
  }, []);

  // Filtrado estricto por disciplina
  const equiposPorDeporte = equipos.filter(eq => {
    if (deporte === 'BASKET') {
      return eq.deporte_codigo === 'BASKET' || eq.deporte_nombre?.toLowerCase().includes('básquet') || eq.deporte_nombre?.toLowerCase().includes('basket');
    } else {
      return eq.deporte_codigo === 'VOLEY' || eq.deporte_nombre?.toLowerCase().includes('voley') || eq.deporte_nombre?.toLowerCase().includes('volei');
    }
  });

  useEffect(() => {
    if (equiposPorDeporte.length >= 2) {
      setEquipoLocal(equiposPorDeporte[0].nombre);
      setEquipoVisitante(equiposPorDeporte[1].nombre);
    } else if (equiposPorDeporte.length === 1) {
      setEquipoLocal(equiposPorDeporte[0].nombre);
      setEquipoVisitante(equiposPorDeporte[0].nombre);
    }
  }, [deporte, equipos.length]);

  const listaJugadores = deporte === 'BASKET' ? jugadoresBasket : jugadoresVoley;
  const jugadaActiva = listaJugadores.find(j => j.id === jugadorSeleccionadoId) || listaJugadores[0];

  // Ejecución precisa: El balón SOLO viaja y se detiene en cada jugador de la secuencia
  const simularJugada = () => {
    if (simulando) return;
    setSimulando(true);
    setPasoActual(0);

    const totalPasos = jugadaActiva.pasos.length;
    let pasoIndex = 0;

    const intervalo = setInterval(() => {
      pasoIndex++;
      if (pasoIndex < totalPasos) {
        setPasoActual(pasoIndex);
      } else {
        clearInterval(intervalo);
        setSimulando(false);
      }
    }, 700); // 700ms por parada en cada jugador para que se aprecie quién tiene el balón
  };

  const reiniciarPizarra = () => {
    setPasoActual(0);
    setSimulando(false);
  };

  const cambiarDeporte = (nuevoDeporte) => {
    setDeporte(nuevoDeporte);
    setJugadorSeleccionadoId(1);
    setPasoActual(0);
    setSimulando(false);
  };

  // Coordenada actual exacta del balón: proviene del paso de la jugada
  const pasoInfo = jugadaActiva.pasos[pasoActual] || jugadaActiva.pasos[0];
  const esUltimoPaso = pasoActual === jugadaActiva.pasos.length - 1;

  return (
    <div className="container" style={{ position: 'relative', zIndex: 3 }}>
      {/* Banner Principal */}
      <div className="card" style={{ marginBottom: '1.25rem', background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.98) 100%)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: '999px', padding: '0.2rem 0.85rem', marginBottom: '0.65rem', fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }}>
              <Sparkles size={14} /> PIZARRA TÁCTICA OFICIAL — PASE JUGADOR A JUGADOR
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.025em' }}>
              <Target size={28} color="#38bdf8" /> Simulador de Jugadas Reglamentarias
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', maxWidth: '680px', marginTop: '0.35rem' }}>
              El balón únicamente viaja de las manos de un jugador a las manos del siguiente compañero según las reglas oficiales (3 toques reglamentarios en voleibol y circulación oficial en baloncesto).
            </p>
          </div>

          {/* Selector de Disciplina */}
          <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '0.35rem', borderRadius: '12px', border: '1px solid #334155', gap: '0.4rem' }}>
            <button
              onClick={() => cambiarDeporte('BASKET')}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                background: deporte === 'BASKET' ? 'linear-gradient(135deg, #ea580c, #c2410c)' : 'transparent',
                color: deporte === 'BASKET' ? '#ffffff' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.2s',
                boxShadow: deporte === 'BASKET' ? '0 4px 12px rgba(234, 88, 12, 0.4)' : 'none'
              }}
            >
              🏀 Baloncesto FIBA
            </button>
            <button
              onClick={() => cambiarDeporte('VOLEY')}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                background: deporte === 'VOLEY' ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'transparent',
                color: deporte === 'VOLEY' ? '#ffffff' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.2s',
                boxShadow: deporte === 'VOLEY' ? '0 4px 12px rgba(2, 132, 199, 0.4)' : 'none'
              }}
            >
              🏐 Voleibol FIVB
            </button>
          </div>
        </div>
      </div>

      {/* Selector de Atleta / Jugada */}
      <div className="card" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.25rem', background: 'rgba(255, 255, 255, 0.96)', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass size={16} color={deporte === 'BASKET' ? '#ea580c' : '#0284c7'} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Elige el Jugador que Inicia o Culmina la Jugada:
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid #a7f3d0' }}>
            {jugadaActiva.regla}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {listaJugadores.map(jug => {
            const activa = jug.id === jugadorSeleccionadoId;
            return (
              <button
                key={jug.id}
                onClick={() => { setJugadorSeleccionadoId(jug.id); setPasoActual(0); }}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  border: activa ? (deporte === 'BASKET' ? '2px solid #ea580c' : '2px solid #0284c7') : '1px solid #cbd5e1',
                  background: activa ? (deporte === 'BASKET' ? '#fff7ed' : '#f0f9ff') : '#ffffff',
                  color: activa ? (deporte === 'BASKET' ? '#c2410c' : '#0369a1') : '#475569',
                  fontWeight: activa ? 800 : 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: activa ? (deporte === 'BASKET' ? '#ea580c' : '#0284c7') : '#94a3b8', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800 }}>
                  {jug.dorsal}
                </span>
                <span>{jug.rol}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Área Cancha y Radar */}
      <div className="tactical-board-grid">
        {/* Cancha Táctica */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#ffffff', borderRadius: '16px' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={18} color={deporte === 'BASKET' ? '#ea580c' : '#0284c7'} />
                {deporte === 'BASKET' ? 'Media Cancha Baloncesto (Pases Reales)' : 'Pista de Voleibol (Regla de 3 Toques)'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.15rem 0 0' }}>
                {jugadaActiva.nombreJugada}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }} onClick={reiniciarPizarra}>
                <RotateCcw size={14} /> Reiniciar
              </button>
              <button
                className="btn btn-accent"
                style={{
                  padding: '0.45rem 1.15rem',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  background: deporte === 'BASKET' ? 'linear-gradient(135deg, #ea580c, #c2410c)' : 'linear-gradient(135deg, #0284c7, #0369a1)',
                  boxShadow: deporte === 'BASKET' ? '0 4px 12px rgba(234,88,12,0.35)' : '0 4px 12px rgba(2,132,199,0.35)'
                }}
                onClick={simularJugada}
                disabled={simulando}
              >
                <Play size={14} /> {simulando ? 'Pasando...' : '¡Ejecutar Jugada!'}
              </button>
            </div>
          </div>

          {/* SVG Cancha */}
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              height: '370px',
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5), 0 12px 30px rgba(0,0,0,0.18)',
              background: deporte === 'BASKET'
                ? 'radial-gradient(circle at 50% 20%, #c2410c 0%, #9a3412 50%, #7c2d12 100%)'
                : 'radial-gradient(circle at 50% 15%, #0284c7 0%, #0369a1 50%, #075985 100%)',
              border: '4px solid #ffffff',
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 500 340" style={{ position: 'absolute', top: 0, left: 0 }}>
              <defs>
                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {deporte === 'BASKET' ? (
                <>
                  <line x1="0" y1="85" x2="500" y2="85" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <line x1="0" y1="170" x2="500" y2="170" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <line x1="0" y1="255" x2="500" y2="255" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <line x1="20" y1="20" x2="480" y2="20" stroke="#ffffff" strokeWidth="3" />
                  <rect x="180" y="20" width="140" height="150" fill="rgba(15, 23, 42, 0.28)" stroke="#ffffff" strokeWidth="2.5" />
                  <circle cx="250" cy="170" r="55" fill="none" stroke="#ffffff" strokeWidth="2.5" />
                  <rect x="220" y="28" width="60" height="5" fill="#ffffff" rx="1" />
                  <circle cx="250" cy="46" r="14" fill="none" stroke="#ea580c" strokeWidth="3" />
                  <line x1="250" y1="33" x2="250" y2="40" stroke="#ffffff" strokeWidth="3" />
                  <path d="M 60 20 L 60 100 A 210 210 0 0 0 440 100 L 440 20" fill="none" stroke="#ffffff" strokeWidth="2.5" />
                </>
              ) : (
                <>
                  {/* Cancha Voleibol: Red en y: 25 */}
                  <line x1="10" y1="25" x2="490" y2="25" stroke="#facc15" strokeWidth="6" strokeDasharray="8 4" />
                  <line x1="50" y1="5" x2="50" y2="35" stroke="#ef4444" strokeWidth="4" />
                  <line x1="450" y1="5" x2="450" y2="35" stroke="#ef4444" strokeWidth="4" />
                  <line x1="30" y1="125" x2="470" y2="125" stroke="#ffffff" strokeWidth="3" strokeDasharray="14 6" />
                  <text x="40" y="117" fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="800" letterSpacing="1">
                    LÍNEA DE ATAQUE (3M)
                  </text>
                  <rect x="30" y="25" width="440" height="290" fill="none" stroke="#ffffff" strokeWidth="3" />
                  {/* Zona de piso rival donde caen los puntos */}
                  <rect x="40" y="5" width="420" height="16" fill="rgba(250, 204, 21, 0.25)" stroke="#facc15" strokeWidth="1" strokeDasharray="4 4" rx="3" />
                  <text x="250" y="17" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="800">CAMPO RIVAL (ZONA DE PUNTO)</text>
                </>
              )}

              {/* Trayectoria directa y limpia entre los jugadores que participan */}
              <path
                d={jugadaActiva.trayectoriaSvg}
                fill="none"
                stroke="#ffffff"
                strokeWidth={simulando ? "3.5" : "2"}
                strokeDasharray={simulando ? "8 6" : "4 4"}
                className={simulando ? "dash-move-anim" : ""}
                filter="url(#glowEffect)"
              />

              {/* Onda expansiva de anotación únicamente en el punto final */}
              {esUltimoPaso && (
                <g transform={`translate(${jugadaActiva.puntoImpacto.x}, ${jugadaActiva.puntoImpacto.y})`}>
                  <circle cx="0" cy="0" r="30" fill="none" stroke="#facc15" strokeWidth="3" opacity="0.9" className="shockwave-ring" />
                  <circle cx="0" cy="0" r="50" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.6" className="shockwave-ring-delayed" />
                  <text x="0" y="6" textAnchor="middle" fontSize="20">💥</text>
                </g>
              )}
            </svg>

            {/* Balón: Se mueve y se posiciona DIRECTAMENTE en el jugador que tiene la posesión */}
            <div
              style={{
                position: 'absolute',
                fontSize: '1.9rem',
                left: pasoInfo.x,
                top: pasoInfo.y,
                transform: `translate(-50%, -50%) scale(${esUltimoPaso ? 1.4 : 1.1})`,
                transition: 'all 0.55s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
                zIndex: 35,
                filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.6))',
                pointerEvents: 'none'
              }}
            >
              {deporte === 'BASKET' ? '🏀' : '🏐'}
            </div>

            {/* Pines de los Jugadores */}
            {listaJugadores.map((jug) => {
              // Verifica si el jugador actual tiene el balón en este paso
              const tieneElBalon = pasoInfo.jugador?.includes(jug.dorsal);
              const esJugadorPrincipal = jug.id === jugadaActiva.id;

              return (
                <div
                  key={jug.id}
                  onClick={() => { setJugadorSeleccionadoId(jug.id); setPasoActual(0); }}
                  style={{
                    position: 'absolute',
                    left: jug.x,
                    top: jug.y,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: tieneElBalon ? 30 : 20,
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.15)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)')}
                >
                  {/* Resplandor pulsante si el jugador tiene el balón o está seleccionado */}
                  {(tieneElBalon || esJugadorPrincipal) && (
                    <div
                      style={{
                        position: 'absolute',
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        border: tieneElBalon ? '3px solid #facc15' : (deporte === 'BASKET' ? '3px solid #ea580c' : '3px solid #38bdf8'),
                        animation: 'pulse-ring 1.3s infinite',
                        pointerEvents: 'none'
                      }}
                    />
                  )}

                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: tieneElBalon ? '#facc15' : (esJugadorPrincipal ? '#ffffff' : (deporte === 'BASKET' ? '#ea580c' : (jug.rol.includes('Líbero') ? '#facc15' : '#0284c7'))),
                      color: tieneElBalon ? '#0f172a' : (esJugadorPrincipal ? '#0f172a' : (jug.rol.includes('Líbero') ? '#0f172a' : '#ffffff')),
                      border: '2px solid #ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '0.88rem',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.35)',
                    }}
                  >
                    {jug.dorsal}
                  </div>
                  <span
                    style={{
                      background: tieneElBalon ? '#facc15' : 'rgba(15, 23, 42, 0.85)',
                      color: tieneElBalon ? '#0f172a' : '#ffffff',
                      fontSize: '0.68rem',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      marginTop: '0.2rem',
                      whiteSpace: 'nowrap',
                      fontWeight: 800,
                    }}
                  >
                    {jug.rol.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* HUD de Posesión y Fase Actual */}
          <div style={{ width: '100%', marginTop: '1rem', background: '#0f172a', borderRadius: '12px', padding: '0.85rem 1.15rem', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Posesión Actual del Balón:
              </span>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: esUltimoPaso ? '#4ade80' : '#facc15', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="live-pulse-dot" style={{ background: esUltimoPaso ? '#4ade80' : '#facc15' }}></span>
                {pasoInfo.jugador} — {pasoInfo.accion}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Velocidad</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#facc15' }}>
                  {jugadaActiva.metricas.velocidad}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Tiempo Jugada</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38bdf8' }}>
                  {jugadaActiva.metricas.tiempo}
                </div>
              </div>

              <div style={{ background: esUltimoPaso ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255,255,255,0.1)', border: esUltimoPaso ? '1px solid #4ade80' : 'none', padding: '0.3rem 0.75rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.85rem', color: esUltimoPaso ? '#4ade80' : '#ffffff' }}>
                {jugadaActiva.metricas.puntos}
              </div>
            </div>
          </div>
        </div>

        {/* Panel Lateral: Perfil y Radar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Ficha Táctica */}
          <div className="card" style={{ background: '#ffffff', borderRadius: '16px' }}>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={17} color={deporte === 'BASKET' ? '#ea580c' : '#0284c7'} />
              Secuencia Táctica: {jugadaActiva.rol}
            </h4>

            <div style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: deporte === 'BASKET' ? '#ea580c' : '#0284c7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', fontWeight: 900 }}>
                  {jugadaActiva.dorsal}
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#0f172a', margin: 0, fontWeight: 800 }}>{jugadaActiva.nombreJugada}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{jugadaActiva.regla}</span>
                </div>
              </div>

              {/* Lista secuencial de pases entre jugadores */}
              <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {jugadaActiva.pasos.map((p, idx) => {
                  const esPasoActivo = idx === pasoActual;
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '0.45rem 0.65rem',
                        borderRadius: '6px',
                        background: esPasoActivo ? '#fff7ed' : '#ffffff',
                        border: esPasoActivo ? '1px solid #f97316' : '1px solid #e2e8f0',
                        fontSize: '0.78rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontWeight: esPasoActivo ? 800 : 500
                      }}
                    >
                      <span style={{ color: esPasoActivo ? '#c2410c' : '#334155' }}>
                        Paso {idx + 1}: <strong>{p.jugador}</strong>
                      </span>
                      <span style={{ color: '#64748b', fontSize: '0.72rem' }}>
                        {p.accion.slice(0, 32)}...
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Radar Predictivo con Clubes Filtrados */}
          <div className="card" style={{ background: '#ffffff', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <Shield size={17} color="#4f46e5" /> Radar Predictivo del Enfrentamiento
              </h4>
              <span className="badge" style={{ background: deporte === 'BASKET' ? '#ffedd5' : '#e0f2fe', color: deporte === 'BASKET' ? '#c2410c' : '#0369a1', fontSize: '0.72rem', fontWeight: 800 }}>
                {deporte === 'BASKET' ? '🏀 Baloncesto' : '🏐 Voleibol'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
                  Club Local ({deporte})
                </label>
                <select
                  className="form-select"
                  style={{ width: '100%', fontSize: '0.8rem', padding: '0.4rem 0.5rem' }}
                  value={equipoLocal}
                  onChange={e => setEquipoLocal(e.target.value)}
                >
                  {equiposPorDeporte.map(eq => (
                    <option key={eq.id} value={eq.nombre}>{eq.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
                  Club Visitante ({deporte})
                </label>
                <select
                  className="form-select"
                  style={{ width: '100%', fontSize: '0.8rem', padding: '0.4rem 0.5rem' }}
                  value={equipoVisitante}
                  onChange={e => setEquipoVisitante(e.target.value)}
                >
                  {equiposPorDeporte.map(eq => (
                    <option key={eq.id} value={eq.nombre}>{eq.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Medidores de Radar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: 700, color: '#334155' }}>
                  <span>Rating Ofensivo (ORM)</span>
                  <span style={{ color: deporte === 'BASKET' ? '#ea580c' : '#0284c7' }}>58% vs 42%</span>
                </div>
                <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: '58%', background: deporte === 'BASKET' ? '#ea580c' : '#0284c7' }} />
                  <div style={{ width: '42%', background: '#94a3b8' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: 700, color: '#334155' }}>
                  <span>Eficacia en {deporte === 'BASKET' ? 'Aro & Pintura' : 'Ataque sobre Red'}</span>
                  <span style={{ color: deporte === 'BASKET' ? '#ea580c' : '#0284c7' }}>66% vs 34%</span>
                </div>
                <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: '66%', background: deporte === 'BASKET' ? '#ea580c' : '#0284c7' }} />
                  <div style={{ width: '34%', background: '#94a3b8' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: 700, color: '#334155' }}>
                  <span>Ritmo de Posesión (Pace)</span>
                  <span style={{ color: '#4f46e5' }}>52% vs 48%</span>
                </div>
                <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: '52%', background: '#4f46e5' }} />
                  <div style={{ width: '48%', background: '#94a3b8' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
