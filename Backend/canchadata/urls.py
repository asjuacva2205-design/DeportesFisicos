from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    DeporteViewSet,
    CategoriaViewSet,
    EquipoViewSet,
    JugadorViewSet,
    PartidoViewSet,
    EstadisticasView,
    ComparadorRendimientoView,
    LimpiezaMasivaView,
    LoginTokenPersonalizadoView,
)

router = DefaultRouter()
router.register('partidos', PartidoViewSet, basename='partido')
router.register('jugadores', JugadorViewSet, basename='jugador')
router.register('equipos', EquipoViewSet, basename='equipo')
router.register('deportes', DeporteViewSet, basename='deporte')
router.register('categorias', CategoriaViewSet, basename='categoria')

urlpatterns = [
    path('estadisticas/', EstadisticasView.as_view(), name='estadisticas'),
    path('rendimiento/comparar/', ComparadorRendimientoView.as_view(), name='comparar-rendimiento'),
    path('limpieza/', LimpiezaMasivaView.as_view(), name='limpieza-masiva'),
    path('auth/login/', LoginTokenPersonalizadoView.as_view(), name='api-login'),
    *router.urls,
]
