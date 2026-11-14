"""
==============================================================================
CanchaData — Script Directo de Carga Masiva de Datos Deportivos (> 1.000 filas)
==============================================================================
Uso directo desde terminal:
    python cargar_datos_masivos.py

Este script inicializa el entorno de Django y ejecuta la generación en lote
(bulk_create) de deportes, categorías, clubes, jugadores y más de 1.900
estadísticas de rendimiento en PostgreSQL con diferenciación por género y reglas.
==============================================================================
"""

import os
import sys
import time

if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Configurar ruta base y entorno Django

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, 'Backend')

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(BACKEND_DIR, '.env'))
except ImportError:
    pass

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

try:
    import django
    django.setup()

except Exception as e:
    print(f"\n[ERROR] No se pudo inicializar Django: {e}")
    print("Asegúrate de que las dependencias estén instaladas y PostgreSQL esté activo.\n")
    sys.exit(1)

from canchadata.models import (
    Deporte,
    Categoria,
    Equipo,
    Jugador,
    Partido,
    EstadisticaJugadorPartido,
)
from canchadata.fuente_datos import DATOS_INICIALES, generar_fixture_y_estadisticas


def ejecutar_carga_masiva():
    print("\n" + "=" * 65)
    print(" 🏀 CANCHADATA — SISTEMA DE CARGA MASIVA DE DATOS DEPORTIVOS 🏐")
    print("=" * 65)
    print(" Iniciando sincronización en base de datos PostgreSQL...\n")

    inicio = time.perf_counter()

    # 1. Deportes
    print(" [1/5] Sincronizando disciplinas deportivas (Básquetbol & Voleibol)...")
    deporte_objs = {}
    for dep in DATOS_INICIALES['deportes']:
        obj, _ = Deporte.objects.get_or_create(
            codigo=dep['codigo'],
            defaults={'nombre': dep['nombre'], 'icono': dep['icono']}
        )
        deporte_objs[dep['codigo']] = obj
    print(f"       ✓ {len(deporte_objs)} deportes activos.")

    # 2. Categorías
    print(" [2/5] Sincronizando categorías por género (Masculino & Femenino)...")
    categoria_objs = {}
    for cat in DATOS_INICIALES['categorias']:
        obj, _ = Categoria.objects.get_or_create(
            codigo=cat['codigo'],
            defaults={'nombre': cat['nombre']}
        )
        categoria_objs[cat['codigo']] = obj
    print(f"       ✓ {len(categoria_objs)} categorías configuradas.")

    # 3. Equipos
    print(" [3/5] Registrando clubes y franquicias...")
    equipos_dict = {}
    for eq in DATOS_INICIALES['equipos']:
        obj, _ = Equipo.objects.get_or_create(
            nombre=eq['nombre'],
            deporte=deporte_objs[eq['deporte']],
            categoria=categoria_objs[eq['categoria']],
            defaults={'ciudad': eq['ciudad'], 'siglas': eq['siglas']}
        )
        equipos_dict[eq['nombre']] = obj
    print(f"       ✓ {len(equipos_dict)} equipos registrados.")

    # 4. Jugadores
    print(" [4/5] Creando plantillas de atletas con roles específicos...")
    jugadores_por_equipo = {}
    for jug in DATOS_INICIALES['jugadores']:
        equipo_obj = equipos_dict[jug['equipo']]
        obj, _ = Jugador.objects.get_or_create(
            nombre=jug['nombre'],
            equipo=equipo_obj,
            categoria=categoria_objs[jug['categoria']],
            defaults={
                'dorsal': jug['dorsal'],
                'posicion': jug['posicion'],
                'edad': jug['edad'],
                'altura_cm': jug['altura_cm'],
            }
        )
        jugadores_por_equipo.setdefault(equipo_obj.id, []).append(obj)
    print(f"       ✓ {Jugador.objects.count()} atletas asignados.")

    # 5. Generar Partidos y Estadísticas Masivas (> 1.000 filas reales)
    print(" [5/5] Generando partidos y estadísticas masivas con bulk_create()...")
    total_partidos, total_estadisticas = generar_fixture_y_estadisticas(
        equipos_dict,
        jugadores_por_equipo,
        deporte_objs,
        categoria_objs
    )

    duracion = time.perf_counter() - inicio

    print("\n" + "=" * 65)
    print(" ¡CARGA MASIVA FINALIZADA CON ÉXITO EN POSTGRESQL!")
    print("=" * 65)
    print(f"  • Disciplinas:                 {Deporte.objects.count()}")
    print(f"  • Categorías:                  {Categoria.objects.count()}")
    print(f"  • Clubes/Equipos:              {Equipo.objects.count()}")
    print(f"  • Atletas federados:           {Jugador.objects.count()}")
    print(f"  • Partidos disputados:         {Partido.objects.count():,}")
    print(f"  • Rendimientos individuales:   {EstadisticaJugadorPartido.objects.count():,} (> 1.000 req.)")
    print(f"  • Tiempo de procesamiento:     {duracion:.2f} segundos")
    print("=" * 65)
    print(" Las estadísticas ya se encuentran disponibles para consultas ORM.")
    print("=" * 65 + "\n")


if __name__ == '__main__':
    ejecutar_carga_masiva()
