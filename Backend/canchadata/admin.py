from django.contrib import admin
from .models import Deporte, Categoria, Equipo, Jugador, Partido, EstadisticaJugadorPartido


@admin.register(Deporte)
class DeporteAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'codigo')
    search_fields = ('nombre', 'codigo')


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'codigo')
    search_fields = ('nombre', 'codigo')


@admin.register(Equipo)
class EquipoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'ciudad', 'deporte', 'categoria')
    list_filter = ('deporte', 'categoria')
    search_fields = ('nombre', 'ciudad')


@admin.register(Jugador)
class JugadorAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'dorsal', 'posicion', 'equipo', 'categoria')
    list_filter = ('categoria', 'posicion', 'equipo__deporte')
    search_fields = ('nombre', 'equipo__nombre')


@admin.register(Partido)
class PartidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'fecha', 'deporte', 'categoria', 'equipo_local', 'puntos_local', 'puntos_visitante', 'equipo_visitante', 'temporada')
    list_filter = ('deporte', 'categoria', 'temporada')
    search_fields = ('equipo_local__nombre', 'equipo_visitante__nombre')


@admin.register(EstadisticaJugadorPartido)
class EstadisticaJugadorPartidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'jugador', 'partido', 'puntos', 'valoracion_rendimiento')
    list_filter = ('partido__deporte', 'partido__categoria')
    search_fields = ('jugador__nombre',)
