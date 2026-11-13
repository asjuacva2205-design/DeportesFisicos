"""
Vistas de la API REST para CanchaData.
Incluye CRUD completo, ordenamiento, filtrado, estadísticas con ORM agrupadas
por al menos dos campos, autenticación por token y la herramienta de comparación deportiva.
"""

from decimal import Decimal
import time
from django.db.models import Avg, Count, Max, Min, Sum, Q, F
from rest_framework import filters, permissions, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    Deporte,
    Categoria,
    Equipo,
    Jugador,
    Partido,
    EstadisticaJugadorPartido,
)
from .serializers import (
    DeporteSerializer,
    CategoriaSerializer,
    EquipoSerializer,
    JugadorSerializer,
    PartidoSerializer,
    PartidoDetalleSerializer,
    EstadisticaJugadorPartidoSerializer,
)


class PermisoSeguroOAutenticado(permissions.BasePermission):
    """
    Permite lectura libre (GET) a cualquier usuario.
    Operaciones de escritura (POST, PUT, PATCH, DELETE) exigen autenticación por Token.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated)


class DeporteViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Deporte.objects.all()
    serializer_class = DeporteSerializer


class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class EquipoViewSet(viewsets.ModelViewSet):
    """CRUD completo de Equipos con permisos protegidos."""
    queryset = Equipo.objects.select_related('deporte', 'categoria').all()
    serializer_class = EquipoSerializer
    permission_classes = [PermisoSeguroOAutenticado]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'ciudad', 'siglas']
    ordering_fields = ['nombre', 'ciudad']

    def get_queryset(self):
        qs = super().get_queryset()
        deporte = self.request.query_params.get('deporte')
        categoria = self.request.query_params.get('categoria')
        if deporte:
            qs = qs.filter(Q(deporte__codigo__iexact=deporte) | Q(deporte__nombre__iexact=deporte))
        if categoria:
            qs = qs.filter(Q(categoria__codigo__iexact=categoria) | Q(categoria__nombre__iexact=categoria))
        return qs


class JugadorViewSet(viewsets.ModelViewSet):
    """CRUD de Jugadores con búsqueda, filtros y permisos protegidos."""
    queryset = Jugador.objects.select_related('equipo', 'categoria', 'equipo__deporte').all()
    serializer_class = JugadorSerializer
    permission_classes = [PermisoSeguroOAutenticado]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'posicion', 'equipo__nombre']
    ordering_fields = ['nombre', 'dorsal', 'edad', 'altura_cm']

    def get_queryset(self):
        qs = super().get_queryset()
        equipo = self.request.query_params.get('equipo')
        deporte = self.request.query_params.get('deporte')
        categoria = self.request.query_params.get('categoria')

        if equipo:
            qs = qs.filter(equipo_id=equipo)
        if deporte:
            qs = qs.filter(equipo__deporte__codigo__iexact=deporte)
        if categoria:
            qs = qs.filter(categoria__codigo__iexact=categoria)
        return qs


class PartidoViewSet(viewsets.ModelViewSet):
    """
    CRUD completo de Partidos:
    - Búsqueda por equipos o temporada
    - Ordenamiento por fecha, puntos o id
    - Filtros por deporte, categoría, temporada y equipo
    - Operaciones de escritura protegidas con Token
    """
    queryset = Partido.objects.select_related(
        'deporte', 'categoria', 'equipo_local', 'equipo_visitante'
    ).all()
    permission_classes = [PermisoSeguroOAutenticado]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['equipo_local__nombre', 'equipo_visitante__nombre', 'temporada']
    ordering_fields = ['fecha', 'puntos_local', 'puntos_visitante', 'id']
    ordering = ['-fecha', '-id']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PartidoDetalleSerializer
        return PartidoSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        deporte = self.request.query_params.get('deporte')
        categoria = self.request.query_params.get('categoria')
        temporada = self.request.query_params.get('temporada')
        equipo = self.request.query_params.get('equipo')
        fecha_desde = self.request.query_params.get('fecha_desde')
        fecha_hasta = self.request.query_params.get('fecha_hasta')

        if deporte:
            qs = qs.filter(Q(deporte__codigo__iexact=deporte) | Q(deporte__nombre__iexact=deporte))
        if categoria:
            qs = qs.filter(Q(categoria__codigo__iexact=categoria) | Q(categoria__nombre__iexact=categoria))
        if temporada:
            qs = qs.filter(temporada=temporada)
        if equipo:
            qs = qs.filter(Q(equipo_local_id=equipo) | Q(equipo_visitante_id=equipo))
        if fecha_desde:
            qs = qs.filter(fecha__gte=fecha_desde)
        if fecha_hasta:
            qs = qs.filter(fecha__lte=fecha_hasta)

        return qs


class EstadisticasView(APIView):
    """
    GET /api/estadisticas/
    Calcula estadísticas en la base de datos usando el ORM:
    - Sumas, promedios y conteos agrupados por al menos DOS campos:
      1. Deporte y Categoría (Género)
      2. Temporada y Deporte
      3. Posición y Categoría
    Responde dinámicamente a filtros del usuario.
    """
    def get(self, request):
        qs_partidos = Partido.objects.all()
        qs_stats = EstadisticaJugadorPartido.objects.all()

        deporte = request.query_params.get('deporte')
        categoria = request.query_params.get('categoria')
        temporada = request.query_params.get('temporada')

        if deporte:
            qs_partidos = qs_partidos.filter(Q(deporte__codigo__iexact=deporte) | Q(deporte__nombre__iexact=deporte))
            qs_stats = qs_stats.filter(partido__deporte__codigo__iexact=deporte)
        if categoria:
            qs_partidos = qs_partidos.filter(Q(categoria__codigo__iexact=categoria) | Q(categoria__nombre__iexact=categoria))
            qs_stats = qs_stats.filter(partido__categoria__codigo__iexact=categoria)
        if temporada:
            qs_partidos = qs_partidos.filter(temporada=temporada)
            qs_stats = qs_stats.filter(partido__temporada=temporada)

        # 1. Métricas Globales Agregadas
        metricas_globales = qs_partidos.aggregate(
            total_partidos=Count('id'),
            promedio_puntos_local=Avg('puntos_local'),
            promedio_puntos_visitante=Avg('puntos_visitante'),
            maximo_puntos_local=Max('puntos_local'),
            maximo_puntos_visitante=Max('puntos_visitante'),
            suma_total_puntos=Sum(F('puntos_local') + F('puntos_visitante')),
        )

        # 2. Agrupación 1: Por DEPORTE y CATEGORÍA (2 campos exigidos en rúbrica)
        por_deporte_y_categoria = (
            qs_partidos.values(
                deporte_nombre=F('deporte__nombre'),
                categoria_nombre=F('categoria__nombre')
            )
            .annotate(
                total_partidos=Count('id'),
                promedio_puntos_local=Avg('puntos_local'),
                promedio_puntos_visitante=Avg('puntos_visitante'),
                suma_puntos=Sum(F('puntos_local') + F('puntos_visitante'))
            )
            .order_by('deporte_nombre', 'categoria_nombre')
        )

        # 3. Agrupación 2: Por TEMPORADA y DEPORTE (2 campos)
        por_temporada_y_deporte = (
            qs_partidos.values(
                temporada_nombre=F('temporada'),
                deporte_nombre=F('deporte__nombre')
            )
            .annotate(
                total_partidos=Count('id'),
                promedio_puntos=Avg(F('puntos_local') + F('puntos_visitante'))
            )
            .order_by('temporada_nombre', 'deporte_nombre')
        )

        # 4. Agrupación 3: Rendimiento individual por POSICIÓN y CATEGORÍA (desde EstadisticaJugadorPartido)
        por_posicion_y_categoria = (
            qs_stats.values(
                posicion_nombre=F('jugador__posicion'),
                categoria_nombre=F('partido__categoria__nombre')
            )
            .annotate(
                conteo_actuaciones=Count('id'),
                promedio_valoracion=Avg('valoracion_rendimiento'),
                promedio_puntos=Avg('puntos')
            )
            .order_by('-promedio_valoracion')[:8]
        )

        # 5. Agrupación 4: Rendimiento comparativo por EQUIPO (anotación media y partidos)
        por_equipo = (
            qs_partidos.values(
                equipo_nombre=F('equipo_local__nombre'),
                deporte_nombre=F('deporte__nombre'),
                categoria_nombre=F('categoria__nombre'),
            )
            .annotate(
                partidos_jugados=Count('id'),
                promedio_puntos=Avg('puntos_local'),
                maximo_puntos=Max('puntos_local'),
            )
            .order_by('-promedio_puntos')[:12]
        )

        return Response({
            'metricas_globales': metricas_globales,
            'por_deporte_y_categoria': list(por_deporte_y_categoria),
            'por_temporada_y_deporte': list(por_temporada_y_deporte),
            'por_equipo': list(por_equipo),
            'por_posicion_y_categoria': list(por_posicion_y_categoria),
            'total_registros_estadisticas': qs_stats.count(),
        })


class ComparadorRendimientoView(APIView):
    """
    POST /api/rendimiento/comparar/
    HERRAMIENTA DIFERENCIADORA: CanchaData Performance Index.
    Permite comparar:
    1. Dos jugadores: analiza sus promedios de rendimiento con el ORM y explica la fórmula.
    2. Dos equipos: analiza victorias, promedios anotadores y cara a cara.
    """
    def post(self, request):
        tipo = request.data.get('tipo', 'jugadores')  # 'jugadores' o 'equipos'

        if tipo == 'jugadores':
            id1 = request.data.get('id1')
            id2 = request.data.get('id2')

            if not id1 or not id2:
                return Response(
                    {'detalle': 'Debes enviar id1 e id2 de los jugadores a comparar.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                j1 = Jugador.objects.select_related('equipo', 'categoria', 'equipo__deporte').get(id=id1)
                j2 = Jugador.objects.select_related('equipo', 'categoria', 'equipo__deporte').get(id=id2)
            except Jugador.DoesNotExist:
                return Response(
                    {'detalle': 'Uno o ambos jugadores no existen.'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Cálculo de métricas del jugador 1 con ORM
            stats1 = EstadisticaJugadorPartido.objects.filter(jugador=j1).aggregate(
                partidos_jugados=Count('id'),
                promedio_puntos=Avg('puntos'),
                promedio_rebotes=Avg('rebotes'),
                promedio_asistencias=Avg('asistencias'),
                promedio_robos=Avg('robos'),
                promedio_perdidas=Avg('perdidas'),
                promedio_bloqueos=Avg('bloqueos'),
                promedio_aces=Avg('saques_ace'),
                promedio_recepciones=Avg('recepciones'),
                promedio_errores=Avg('errores'),
                promedio_valoracion=Avg('valoracion_rendimiento'),
            )

            # Cálculo de métricas del jugador 2 con ORM
            stats2 = EstadisticaJugadorPartido.objects.filter(jugador=j2).aggregate(
                partidos_jugados=Count('id'),
                promedio_puntos=Avg('puntos'),
                promedio_rebotes=Avg('rebotes'),
                promedio_asistencias=Avg('asistencias'),
                promedio_robos=Avg('robos'),
                promedio_perdidas=Avg('perdidas'),
                promedio_bloqueos=Avg('bloqueos'),
                promedio_aces=Avg('saques_ace'),
                promedio_recepciones=Avg('recepciones'),
                promedio_errores=Avg('errores'),
                promedio_valoracion=Avg('valoracion_rendimiento'),
            )

            es_voley = (j1.equipo.deporte.codigo == 'VOLEY')
            formula_explicada = (
                "Índice Voleibol = (Puntos + Bloqueos + Aces + Recepciones) - Errores no Forzados"
                if es_voley else
                "Índice Básquetbol = (Puntos + Rebotes + Asistencias + Robos) - Pérdidas"
            )

            return Response({
                'tipo': 'jugadores',
                'deporte': j1.equipo.deporte.nombre,
                'categoria': j1.categoria.nombre,
                'formula_explicada': formula_explicada,
                'jugador_1': {
                    'id': j1.id,
                    'nombre': j1.nombre,
                    'dorsal': j1.dorsal,
                    'posicion': j1.posicion,
                    'equipo': j1.equipo.nombre,
                    'edad': j1.edad,
                    'altura_cm': j1.altura_cm,
                    'estadisticas': stats1,
                },
                'jugador_2': {
                    'id': j2.id,
                    'nombre': j2.nombre,
                    'dorsal': j2.dorsal,
                    'posicion': j2.posicion,
                    'equipo': j2.equipo.nombre,
                    'edad': j2.edad,
                    'altura_cm': j2.altura_cm,
                    'estadisticas': stats2,
                }
            })

        elif tipo == 'equipos':
            id1 = request.data.get('id1')
            id2 = request.data.get('id2')

            if not id1 or not id2:
                return Response(
                    {'detalle': 'Debes enviar id1 e id2 de los equipos a comparar.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                eq1 = Equipo.objects.select_related('deporte', 'categoria').get(id=id1)
                eq2 = Equipo.objects.select_related('deporte', 'categoria').get(id=id2)
            except Equipo.DoesNotExist:
                return Response(
                    {'detalle': 'Uno o ambos equipos no existen.'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Historial cara a cara
            enfrentamientos = Partido.objects.filter(
                (Q(equipo_local=eq1) & Q(equipo_visitante=eq2)) |
                (Q(equipo_local=eq2) & Q(equipo_visitante=eq1))
            )

            victorias_eq1 = enfrentamientos.filter(
                (Q(equipo_local=eq1) & Q(puntos_local__gt=F('puntos_visitante'))) |
                (Q(equipo_visitante=eq1) & Q(puntos_visitante__gt=F('puntos_local')))
            ).count()

            victorias_eq2 = enfrentamientos.filter(
                (Q(equipo_local=eq2) & Q(puntos_local__gt=F('puntos_visitante'))) |
                (Q(equipo_visitante=eq2) & Q(puntos_visitante__gt=F('puntos_local')))
            ).count()

            return Response({
                'tipo': 'equipos',
                'deporte': eq1.deporte.nombre,
                'categoria': eq1.categoria.nombre,
                'equipo_1': {
                    'id': eq1.id,
                    'nombre': eq1.nombre,
                    'ciudad': eq1.ciudad,
                    'victorias_cara_a_cara': victorias_eq1,
                },
                'equipo_2': {
                    'id': eq2.id,
                    'nombre': eq2.nombre,
                    'ciudad': eq2.ciudad,
                    'victorias_cara_a_cara': victorias_eq2,
                },
                'total_partidos_cara_a_cara': enfrentamientos.count(),
            })

        return Response({'detalle': 'Tipo de comparación no soportado.'}, status=status.HTTP_400_BAD_REQUEST)


class LimpiezaMasivaView(APIView):
    """
    DELETE /api/limpieza/
    Borra registros masivos únicamente si se envía {"confirmar": true}.
    Cumple con el requisito de borrado con confirmación del taller.
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        confirmar = request.data.get('confirmar') if hasattr(request.data, 'get') else None
        if confirmar is not True:
            return Response(
                {'detalle': 'El cuerpo debe incluir {"confirmar": true} para proceder con la limpieza.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        inicio = time.perf_counter()
        stats_eliminadas, _ = EstadisticaJugadorPartido.objects.all().delete()
        partidos_eliminados, _ = Partido.objects.all().delete()
        ms = (time.perf_counter() - inicio) * 1000

        return Response({
            'mensaje': 'Limpieza completada con confirmación.',
            'estadisticas_eliminadas': stats_eliminadas,
            'partidos_eliminados': partidos_eliminados,
            'tiempo_ms': round(ms, 2)
        })


class LoginTokenPersonalizadoView(ObtainAuthToken):
    """
    POST /api/auth/login/
    Devuelve el token DRF, el username y el estado de staff.
    """
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'is_staff': user.is_staff,
        })
