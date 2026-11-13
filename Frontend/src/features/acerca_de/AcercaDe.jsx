import React from 'react';
import { User, BookOpen, Calendar, Cpu, Sparkles, CheckCircle2, ShieldCheck, Database, Globe } from 'lucide-react';

export default function AcercaDe() {
  return (
    <div className="container" style={{ maxWidth: '960px' }}>
      {/* Tarjeta de Autoría */}
      <div className="card" style={{ borderTop: '4px solid #1e3a8a' }}>
        <div className="card-header">
          <h2 className="card-title">
            <User size={24} color="#1e3a8a" /> Acerca del Proyecto Final
          </h2>
          <span className="brand-badge">Taller Django + React</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <User size={14} /> Estudiante / Autor(a)
            </span>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem' }}>
              Desarrollador(a) CanchaData
            </div>
            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>Modalidad Individual</span>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <BookOpen size={14} /> Asignatura / Taller
            </span>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem' }}>
              Taller Django + React
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Backend DRF & Frontend SPA</span>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} /> Fecha de Entrega
            </span>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem' }}>
              Noviembre 2026
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Convocatoria Oficial</span>
          </div>
        </div>

        <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.6' }}>
          <strong>CanchaData</strong> es una plataforma web completa de analítica deportiva para <strong>Básquetbol</strong> y <strong>Voleibol</strong>, desarrollada aplicando la arquitectura, convenciones y buenas prácticas vistas en clase: separación estricta de Backend en Django REST Framework y Frontend en React (Vite), con persistencia en PostgreSQL y consumo desacoplado mediante API REST.
        </p>
      </div>

      {/* Descripción técnica de la HERRAMIENTA DIFERENCIADORA */}
      <div className="card" style={{ borderTop: '4px solid #f97316' }}>
        <div className="card-header">
          <h3 className="card-title" style={{ color: '#c2410c' }}>
            <Sparkles size={22} color="#f97316" /> Herramienta Nueva Integrada: Ficha de Rendimiento & Comparador Cara a Cara
          </h3>
          <span className="badge" style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5' }}>
            Funcionalidad Extra
          </span>
        </div>

        <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.25rem' }}>
          <h4 style={{ color: '#92400e', marginBottom: '0.5rem', fontSize: '1rem' }}>
            ¿Qué hace y qué problema resuelve?
          </h4>
          <p style={{ color: '#78350f', fontSize: '0.9rem', lineHeight: '1.6' }}>
            En lugar de presentar una "calificación" arbitraria o inventada, esta herramienta implementa un
            <strong> Índice de Rendimiento Explicable (CanchaData Score)</strong> basado en fórmulas oficiales de cada disciplina.
            Permite contrastar dos atletas o dos equipos bajo filtros estrictos de <strong>deporte</strong>, <strong>categoría (femenino o masculino)</strong> y <strong>temporada</strong>, garantizando comparaciones justas y transparentes.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#1e3a8a', display: 'block', marginBottom: '0.35rem' }}>
              🏀 Fórmulas de Básquetbol:
            </strong>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              <code>Eficiencia = (Puntos + Rebotes + Asistencias + Robos) - Pérdidas</code>
              <br />
              Premia la versatilidad técnica y penaliza la pérdida de posesión del balón.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#1e3a8a', display: 'block', marginBottom: '0.35rem' }}>
              🏐 Fórmulas de Voleibol:
            </strong>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              <code>Aportación = (Puntos + Bloqueos + Aces Saque + Recepciones) - Errores</code>
              <br />
              Cuantifica la efectividad en la red y fondo descontando faltas no forzadas.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontSize: '0.85rem', background: '#f0fdf4', padding: '0.75rem', borderRadius: '8px' }}>
          <CheckCircle2 size={18} />
          <span>Calculado en base de datos mediante agregaciones y promedios del ORM de Django en milisegundos.</span>
        </div>
      </div>

      {/* Resumen de Cumplimiento Técnico */}
      <div className="card">
        <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
          <Cpu size={20} color="#1e3a8a" /> Cumplimiento de la Rúbrica Oficial
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
            <Database size={16} color="#10b981" /> <strong>&gt; 1.000 datos reales:</strong> Carga masiva con <code>bulk_create</code>.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
            <ShieldCheck size={16} color="#10b981" /> <strong>Auth por Token:</strong> Escritura y borrado protegidos con DRF.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
            <CheckCircle2 size={16} color="#10b981" /> <strong>Estadísticas ORM:</strong> Agrupadas por 2 campos (Deporte y Categoría).
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
            <Globe size={16} color="#10b981" /> <strong>Despliegue Render:</strong> Listo con WhiteNoise, Gunicorn y <code>DEBUG=False</code>.
          </div>
        </div>
      </div>
    </div>
  );
}
