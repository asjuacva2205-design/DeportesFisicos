from decimal import Decimal
from django.db import models


class Deporte(models.Model):
    """Deporte gestionado en la plataforma (Básquetbol o Voleibol)."""
    nombre = models.CharField(max_length=50, unique=True)
    codigo = models.CharField(max_length=20, unique=True)  # 'BASKET', 'VOLEY'
    icono = models.CharField(max_length=50, default='activity')

    class Meta:
        verbose_name = 'Deporte'
        verbose_name_plural = 'Deportes'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Categoria(models.Model):
    """Categoría por género de la competición (Femenino o Masculino)."""
    nombre = models.CharField(max_length=50, unique=True)  # 'Femenino', 'Masculino'
    codigo = models.CharField(max_length=20, unique=True)  # 'FEM', 'MASC'

    class Meta:
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Equipo(models.Model):
    """Equipo participante vinculado a un deporte y a una categoría."""
    nombre = models.CharField(max_length=120)
    ciudad = models.CharField(max_length=100)
    siglas = models.CharField(max_length=10, blank=True)
    deporte = models.ForeignKey(Deporte, on_delete=models.CASCADE, related_name='equipos')
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='equipos')

    class Meta:
        verbose_name = 'Equipo'
        verbose_name_plural = 'Equipos'
        ordering = ['nombre']
        unique_together = ('nombre', 'deporte', 'categoria')

    def __str__(self):
        return f'{self.nombre} ({self.categoria.codigo})'


class Jugador(models.Model):
    """Jugador perteneciente a un equipo y categoría."""
    nombre = models.CharField(max_length=120)
    dorsal = models.PositiveIntegerField(default=0)
    posicion = models.CharField(max_length=60)
    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE, related_name='jugadores')
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='jugadores')
    edad = models.PositiveIntegerField(default=22)
    altura_cm = models.PositiveIntegerField(default=185)

    class Meta:
        verbose_name = 'Jugador'
        verbose_name_plural = 'Jugadores'
        ordering = ['nombre']

    def __str__(self):
        return f'{self.nombre} (#{self.dorsal} - {self.equipo.nombre})'


class Partido(models.Model):
    """Encuentro disputado entre dos equipos con fecha y marcador."""
    deporte = models.ForeignKey(Deporte, on_delete=models.CASCADE, related_name='partidos')
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='partidos')
    temporada = models.CharField(max_length=20, default='2025-2026')
    jornada = models.PositiveIntegerField(default=1)
    fecha = models.DateField()
    equipo_local = models.ForeignKey(Equipo, on_delete=models.CASCADE, related_name='partidos_local')
    equipo_visitante = models.ForeignKey(Equipo, on_delete=models.CASCADE, related_name='partidos_visitante')
    puntos_local = models.PositiveIntegerField(default=0)
    puntos_visitante = models.PositiveIntegerField(default=0)
    estado = models.CharField(max_length=30, default='Finalizado')

    class Meta:
        verbose_name = 'Partido'
        verbose_name_plural = 'Partidos'
        ordering = ['-fecha', '-id']

    def __str__(self):
        return f'{self.equipo_local.nombre} {self.puntos_local} - {self.puntos_visitante} {self.equipo_visitante.nombre} ({self.fecha})'


class EstadisticaJugadorPartido(models.Model):
    """
    Rendimiento individual de un jugador en un partido específico.
    Permite almacenar métricas propias de básquet o voleibol y calcular
    la valoración de rendimiento explicable.
    """
    partido = models.ForeignKey(Partido, on_delete=models.CASCADE, related_name='estadisticas')
    jugador = models.ForeignKey(Jugador, on_delete=models.CASCADE, related_name='estadisticas')

    minutos_o_sets = models.PositiveIntegerField(default=0, help_text='Minutos en Básquetbol o Sets en Voleibol')

    # Métricas de Básquetbol
    puntos = models.PositiveIntegerField(default=0)
    rebotes = models.PositiveIntegerField(default=0)
    asistencias = models.PositiveIntegerField(default=0)
    robos = models.PositiveIntegerField(default=0)
    perdidas = models.PositiveIntegerField(default=0)

    # Métricas de Voleibol
    bloqueos = models.PositiveIntegerField(default=0)
    saques_ace = models.PositiveIntegerField(default=0)
    recepciones = models.PositiveIntegerField(default=0)
    errores = models.PositiveIntegerField(default=0)

    # Valoración transparente calculada:
    # Básquet: (puntos + rebotes + asistencias + robos) - perdidas
    # Vóley: (puntos + bloqueos + saques_ace + recepciones) - errores
    valoracion_rendimiento = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal('0.00'))

    class Meta:
        verbose_name = 'Estadística de Jugador por Partido'
        verbose_name_plural = 'Estadísticas de Jugadores por Partido'
        ordering = ['-valoracion_rendimiento', '-id']

    def calcular_valoracion(self):
        if self.partido.deporte.codigo == 'VOLEY':
            val = (self.puntos + self.bloqueos + self.saques_ace + self.recepciones) - self.errores
        else:
            val = (self.puntos + self.rebotes + self.asistencias + self.robos) - self.perdidas
        return max(Decimal('0.00'), Decimal(str(val)))

    def save(self, *args, **kwargs):
        if not self.valoracion_rendimiento or self.valoracion_rendimiento == Decimal('0.00'):
            self.valoracion_rendimiento = self.calcular_valoracion()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.jugador.nombre} en {self.partido} (Val: {self.valoracion_rendimiento})'
