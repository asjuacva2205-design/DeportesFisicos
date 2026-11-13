from rest_framework import serializers
from .models import Deporte, Categoria, Equipo, Jugador, Partido, EstadisticaJugadorPartido


class DeporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deporte
        fields = '__all__'


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'


class EquipoSerializer(serializers.ModelSerializer):
    deporte_nombre = serializers.CharField(source='deporte.nombre', read_only=True)
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)

    class Meta:
        model = Equipo
        fields = ['id', 'nombre', 'ciudad', 'siglas', 'deporte', 'categoria', 'deporte_nombre', 'categoria_nombre']


class JugadorSerializer(serializers.ModelSerializer):
    equipo_nombre = serializers.CharField(source='equipo.nombre', read_only=True)
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    deporte_nombre = serializers.CharField(source='equipo.deporte.nombre', read_only=True)
    deporte_codigo = serializers.CharField(source='equipo.deporte.codigo', read_only=True)

    class Meta:
        model = Jugador
        fields = [
            'id', 'nombre', 'dorsal', 'posicion', 'edad', 'altura_cm',
            'equipo', 'categoria', 'equipo_nombre', 'categoria_nombre',
            'deporte_nombre', 'deporte_codigo'
        ]


class EstadisticaJugadorPartidoSerializer(serializers.ModelSerializer):
    jugador_nombre = serializers.CharField(source='jugador.nombre', read_only=True)
    dorsal = serializers.IntegerField(source='jugador.dorsal', read_only=True)
    posicion = serializers.CharField(source='jugador.posicion', read_only=True)
    equipo_nombre = serializers.CharField(source='jugador.equipo.nombre', read_only=True)

    class Meta:
        model = EstadisticaJugadorPartido
        fields = [
            'id', 'partido', 'jugador', 'jugador_nombre', 'dorsal', 'posicion', 'equipo_nombre',
            'minutos_o_sets', 'puntos', 'rebotes', 'asistencias', 'robos', 'perdidas',
            'bloqueos', 'saques_ace', 'recepciones', 'errores', 'valoracion_rendimiento'
        ]


class PartidoSerializer(serializers.ModelSerializer):
    deporte_nombre = serializers.CharField(source='deporte.nombre', read_only=True)
    deporte_codigo = serializers.CharField(source='deporte.codigo', read_only=True)
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    equipo_local_nombre = serializers.CharField(source='equipo_local.nombre', read_only=True)
    equipo_visitante_nombre = serializers.CharField(source='equipo_visitante.nombre', read_only=True)
    ganador_nombre = serializers.SerializerMethodField()

    class Meta:
        model = Partido
        fields = [
            'id', 'deporte', 'categoria', 'deporte_nombre', 'deporte_codigo',
            'categoria_nombre', 'temporada', 'jornada', 'fecha',
            'equipo_local', 'equipo_visitante', 'equipo_local_nombre', 'equipo_visitante_nombre',
            'puntos_local', 'puntos_visitante', 'estado', 'ganador_nombre'
        ]

    def get_ganador_nombre(self, obj):
        if obj.puntos_local > obj.puntos_visitante:
            return obj.equipo_local.nombre
        elif obj.puntos_visitante > obj.puntos_local:
            return obj.equipo_visitante.nombre
        return 'Empate'


class PartidoDetalleSerializer(PartidoSerializer):
    estadisticas = EstadisticaJugadorPartidoSerializer(many=True, read_only=True)

    class Meta(PartidoSerializer.Meta):
        fields = PartidoSerializer.Meta.fields + ['estadisticas']
