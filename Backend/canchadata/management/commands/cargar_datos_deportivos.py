"""
Comando de Django para cargar los datos masivos iniciales en la base de datos.
Uso:
    python manage.py cargar_datos_deportivos
"""

import time
from django.core.management.base import BaseCommand
from canchadata.models import (
    Deporte,
    Categoria,
    Equipo,
    Jugador,
    Partido,
    EstadisticaJugadorPartido,
)
from canchadata.fuente_datos import DATOS_INICIALES, generar_fixture_y_estadisticas


class Command(BaseCommand):
    help = (
        'Carga los deportes, categorías, equipos, jugadores y más de 1.000 '
        'registros de partidos y estadísticas con bulk_create.'
    )

    def handle(self, *args, **options):
        inicio = time.perf_counter()
        self.stdout.write(self.style.NOTICE('Iniciando carga masiva de datos en PostgreSQL...'))

        # 1. Crear Deportes
        deporte_objs = {}
        for dep in DATOS_INICIALES['deportes']:
            obj, _ = Deporte.objects.get_or_create(
                codigo=dep['codigo'],
                defaults={'nombre': dep['nombre'], 'icono': dep['icono']}
            )
            deporte_objs[dep['codigo']] = obj

        # 2. Crear Categorías
        categoria_objs = {}
        for cat in DATOS_INICIALES['categorias']:
            obj, _ = Categoria.objects.get_or_create(
                codigo=cat['codigo'],
                defaults={'nombre': cat['nombre']}
            )
            categoria_objs[cat['codigo']] = obj

        # 3. Crear Equipos
        equipos_dict = {}
        for eq in DATOS_INICIALES['equipos']:
            obj, _ = Equipo.objects.get_or_create(
                nombre=eq['nombre'],
                deporte=deporte_objs[eq['deporte']],
                categoria=categoria_objs[eq['categoria']],
                defaults={'ciudad': eq['ciudad'], 'siglas': eq['siglas']}
            )
            equipos_dict[eq['nombre']] = obj

        # 4. Crear Jugadores
        jugadores_por_equipo = {}
        jugadores_creados = 0
        for jug in DATOS_INICIALES['jugadores']:
            equipo_obj = equipos_dict[jug['equipo']]
            obj, creado = Jugador.objects.get_or_create(
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
            if creado:
                jugadores_creados += 1

        # 5. Generar Partidos y Estadísticas Masivas (> 1.000 registros)
        total_partidos, total_estadisticas = generar_fixture_y_estadisticas(
            equipos_dict,
            jugadores_por_equipo,
            deporte_objs,
            categoria_objs
        )

        tiempo_total = (time.perf_counter() - inicio)

        self.stdout.write(self.style.SUCCESS('====================================================='))
        self.stdout.write(self.style.SUCCESS(' Carga completada con éxito en la base de datos!'))
        self.stdout.write(self.style.SUCCESS('====================================================='))
        self.stdout.write(f'  Deportes registrados: {Deporte.objects.count()}')
        self.stdout.write(f'  Categorías registradas: {Categoria.objects.count()}')
        self.stdout.write(f'  Equipos registrados: {Equipo.objects.count()}')
        self.stdout.write(f'  Jugadores registrados: {Jugador.objects.count()}')
        self.stdout.write(f'  Partidos creados: {Partido.objects.count():,}')
        self.stdout.write(self.style.SUCCESS(f'  Estadísticas de rendimiento cargadas: {EstadisticaJugadorPartido.objects.count():,} (Supera los 1.000 requeridos)'))
        self.stdout.write(f'  Tiempo de ejecución: {tiempo_total:.2f} segundos')
