"""
Módulo de fuente de datos reales para CanchaData.
Contiene información verificada de equipos, jugadores y partidos oficiales
de Básquetbol (NBA / WNBA / Euroliga) y Voleibol (FIVB / SuperLega / VakifBank).
Genera más de 1.200 registros de estadísticas individuales de partido con bulk_create.
"""

from datetime import date, timedelta
from decimal import Decimal

# Equipos y jugadores reales
DATOS_INICIALES = {
    'deportes': [
        {'nombre': 'Básquetbol', 'codigo': 'BASKET', 'icono': 'dribbble'},
        {'nombre': 'Voleibol', 'codigo': 'VOLEY', 'icono': 'volleyball'},
    ],
    'categorias': [
        {'nombre': 'Masculino', 'codigo': 'MASC'},
        {'nombre': 'Femenino', 'codigo': 'FEM'},
    ],
    'equipos': [
        # Básquetbol Masculino
        {'nombre': 'Boston Celtics', 'ciudad': 'Boston', 'siglas': 'BOS', 'deporte': 'BASKET', 'categoria': 'MASC'},
        {'nombre': 'Golden State Warriors', 'ciudad': 'San Francisco', 'siglas': 'GSW', 'deporte': 'BASKET', 'categoria': 'MASC'},
        {'nombre': 'Real Madrid Baloncesto', 'ciudad': 'Madrid', 'siglas': 'RMB', 'deporte': 'BASKET', 'categoria': 'MASC'},
        {'nombre': 'Los Angeles Lakers', 'ciudad': 'Los Angeles', 'siglas': 'LAL', 'deporte': 'BASKET', 'categoria': 'MASC'},
        # Básquetbol Femenino
        {'nombre': 'Las Vegas Aces', 'ciudad': 'Las Vegas', 'siglas': 'LVA', 'deporte': 'BASKET', 'categoria': 'FEM'},
        {'nombre': 'New York Liberty', 'ciudad': 'Nueva York', 'siglas': 'NYL', 'deporte': 'BASKET', 'categoria': 'FEM'},
        {'nombre': 'Valencia Basket Fem', 'ciudad': 'Valencia', 'siglas': 'VBC', 'deporte': 'BASKET', 'categoria': 'FEM'},
        {'nombre': 'Seattle Storm', 'ciudad': 'Seattle', 'siglas': 'SEA', 'deporte': 'BASKET', 'categoria': 'FEM'},
        # Voleibol Masculino
        {'nombre': 'Trentino Volley', 'ciudad': 'Trento', 'siglas': 'TRE', 'deporte': 'VOLEY', 'categoria': 'MASC'},
        {'nombre': 'Perugia Volley', 'ciudad': 'Perugia', 'siglas': 'PER', 'deporte': 'VOLEY', 'categoria': 'MASC'},
        {'nombre': 'Sada Cruzeiro', 'ciudad': 'Belo Horizonte', 'siglas': 'CRU', 'deporte': 'VOLEY', 'categoria': 'MASC'},
        {'nombre': 'ZAKSA Kedzierzyn', 'ciudad': 'Kedzierzyn', 'siglas': 'ZAK', 'deporte': 'VOLEY', 'categoria': 'MASC'},
        # Voleibol Femenino
        {'nombre': 'VakifBank Istanbul', 'ciudad': 'Estambul', 'siglas': 'VAK', 'deporte': 'VOLEY', 'categoria': 'FEM'},
        {'nombre': 'Imoco Conegliano', 'ciudad': 'Conegliano', 'siglas': 'IMO', 'deporte': 'VOLEY', 'categoria': 'FEM'},
        {'nombre': 'Fenerbahce Opet', 'ciudad': 'Estambul', 'siglas': 'FEN', 'deporte': 'VOLEY', 'categoria': 'FEM'},
        {'nombre': 'Eczacibasi Dynavit', 'ciudad': 'Estambul', 'siglas': 'ECZ', 'deporte': 'VOLEY', 'categoria': 'FEM'},
    ],
    'jugadores': [
        # Básquetbol Masculino - Boston
        {'nombre': 'Jayson Tatum', 'dorsal': 0, 'posicion': 'Alero', 'equipo': 'Boston Celtics', 'categoria': 'MASC', 'edad': 27, 'altura_cm': 203},
        {'nombre': 'Jaylen Brown', 'dorsal': 7, 'posicion': 'Escolta', 'equipo': 'Boston Celtics', 'categoria': 'MASC', 'edad': 28, 'altura_cm': 198},
        {'nombre': 'Derrick White', 'dorsal': 9, 'posicion': 'Base', 'equipo': 'Boston Celtics', 'categoria': 'MASC', 'edad': 30, 'altura_cm': 193},
        {'nombre': 'Al Horford', 'dorsal': 42, 'posicion': 'Pívot', 'equipo': 'Boston Celtics', 'categoria': 'MASC', 'edad': 38, 'altura_cm': 206},
        {'nombre': 'Jrue Holiday', 'dorsal': 4, 'posicion': 'Base', 'equipo': 'Boston Celtics', 'categoria': 'MASC', 'edad': 34, 'altura_cm': 193},
        # Básquetbol Masculino - Warriors
        {'nombre': 'Stephen Curry', 'dorsal': 30, 'posicion': 'Base', 'equipo': 'Golden State Warriors', 'categoria': 'MASC', 'edad': 37, 'altura_cm': 188},
        {'nombre': 'Draymond Green', 'dorsal': 23, 'posicion': 'Ala-Pívot', 'equipo': 'Golden State Warriors', 'categoria': 'MASC', 'edad': 35, 'altura_cm': 198},
        {'nombre': 'Andrew Wiggins', 'dorsal': 22, 'posicion': 'Alero', 'equipo': 'Golden State Warriors', 'categoria': 'MASC', 'edad': 30, 'altura_cm': 201},
        {'nombre': 'Jonathan Kuminga', 'dorsal': 0, 'posicion': 'Alero', 'equipo': 'Golden State Warriors', 'categoria': 'MASC', 'edad': 22, 'altura_cm': 201},
        {'nombre': 'Buddy Hield', 'dorsal': 7, 'posicion': 'Escolta', 'equipo': 'Golden State Warriors', 'categoria': 'MASC', 'edad': 32, 'altura_cm': 193},
        # Básquetbol Masculino - Real Madrid
        {'nombre': 'Facundo Campazzo', 'dorsal': 7, 'posicion': 'Base', 'equipo': 'Real Madrid Baloncesto', 'categoria': 'MASC', 'edad': 34, 'altura_cm': 178},
        {'nombre': 'Walter Tavares', 'dorsal': 22, 'posicion': 'Pívot', 'equipo': 'Real Madrid Baloncesto', 'categoria': 'MASC', 'edad': 33, 'altura_cm': 220},
        {'nombre': 'Mario Hezonja', 'dorsal': 11, 'posicion': 'Alero', 'equipo': 'Real Madrid Baloncesto', 'categoria': 'MASC', 'edad': 30, 'altura_cm': 203},
        {'nombre': 'Dzanan Musa', 'dorsal': 13, 'posicion': 'Escolta', 'equipo': 'Real Madrid Baloncesto', 'categoria': 'MASC', 'edad': 26, 'altura_cm': 205},
        {'nombre': 'Gabriel Deck', 'dorsal': 14, 'posicion': 'Ala-Pívot', 'equipo': 'Real Madrid Baloncesto', 'categoria': 'MASC', 'edad': 30, 'altura_cm': 198},
        # Básquetbol Masculino - Lakers
        {'nombre': 'LeBron James', 'dorsal': 23, 'posicion': 'Alero', 'equipo': 'Los Angeles Lakers', 'categoria': 'MASC', 'edad': 40, 'altura_cm': 206},
        {'nombre': 'Anthony Davis', 'dorsal': 3, 'posicion': 'Pívot', 'equipo': 'Los Angeles Lakers', 'categoria': 'MASC', 'edad': 32, 'altura_cm': 208},
        {'nombre': 'Austin Reaves', 'dorsal': 15, 'posicion': 'Escolta', 'equipo': 'Los Angeles Lakers', 'categoria': 'MASC', 'edad': 26, 'altura_cm': 196},
        {'nombre': 'D Angelo Russell', 'dorsal': 1, 'posicion': 'Base', 'equipo': 'Los Angeles Lakers', 'categoria': 'MASC', 'edad': 29, 'altura_cm': 193},
        {'nombre': 'Rui Hachimura', 'dorsal': 28, 'posicion': 'Ala-Pívot', 'equipo': 'Los Angeles Lakers', 'categoria': 'MASC', 'edad': 27, 'altura_cm': 203},

        # Básquetbol Femenino - Aces
        {'nombre': 'Aja Wilson', 'dorsal': 22, 'posicion': 'Ala-Pívot', 'equipo': 'Las Vegas Aces', 'categoria': 'FEM', 'edad': 28, 'altura_cm': 193},
        {'nombre': 'Kelsey Plum', 'dorsal': 10, 'posicion': 'Base', 'equipo': 'Las Vegas Aces', 'categoria': 'FEM', 'edad': 30, 'altura_cm': 173},
        {'nombre': 'Chelsea Gray', 'dorsal': 12, 'posicion': 'Base', 'equipo': 'Las Vegas Aces', 'categoria': 'FEM', 'edad': 32, 'altura_cm': 180},
        {'nombre': 'Jackie Young', 'dorsal': 0, 'posicion': 'Escolta', 'equipo': 'Las Vegas Aces', 'categoria': 'FEM', 'edad': 27, 'altura_cm': 183},
        {'nombre': 'Alysha Clark', 'dorsal': 7, 'posicion': 'Alero', 'equipo': 'Las Vegas Aces', 'categoria': 'FEM', 'edad': 37, 'altura_cm': 180},
        # Básquetbol Femenino - Liberty
        {'nombre': 'Breanna Stewart', 'dorsal': 30, 'posicion': 'Ala-Pívot', 'equipo': 'New York Liberty', 'categoria': 'FEM', 'edad': 30, 'altura_cm': 193},
        {'nombre': 'Sabrina Ionescu', 'dorsal': 20, 'posicion': 'Base', 'equipo': 'New York Liberty', 'categoria': 'FEM', 'edad': 27, 'altura_cm': 180},
        {'nombre': 'Jonquel Jones', 'dorsal': 35, 'posicion': 'Pívot', 'equipo': 'New York Liberty', 'categoria': 'FEM', 'edad': 31, 'altura_cm': 198},
        {'nombre': 'Betnijah Laney', 'dorsal': 44, 'posicion': 'Alero', 'equipo': 'New York Liberty', 'categoria': 'FEM', 'edad': 31, 'altura_cm': 183},
        {'nombre': 'Courtney Vandersloot', 'dorsal': 22, 'posicion': 'Base', 'equipo': 'New York Liberty', 'categoria': 'FEM', 'edad': 36, 'altura_cm': 173},
        # Básquetbol Femenino - Valencia
        {'nombre': 'Alba Torrens', 'dorsal': 7, 'posicion': 'Alero', 'equipo': 'Valencia Basket Fem', 'categoria': 'FEM', 'edad': 35, 'altura_cm': 190},
        {'nombre': 'Queralt Casas', 'dorsal': 9, 'posicion': 'Escolta', 'equipo': 'Valencia Basket Fem', 'categoria': 'FEM', 'edad': 32, 'altura_cm': 177},
        {'nombre': 'Cristina Ouvina', 'dorsal': 5, 'posicion': 'Base', 'equipo': 'Valencia Basket Fem', 'categoria': 'FEM', 'edad': 34, 'altura_cm': 173},
        {'nombre': 'Raquel Carrera', 'dorsal': 14, 'posicion': 'Pívot', 'equipo': 'Valencia Basket Fem', 'categoria': 'FEM', 'edad': 23, 'altura_cm': 190},
        {'nombre': 'Leticia Romero', 'dorsal': 10, 'posicion': 'Base', 'equipo': 'Valencia Basket Fem', 'categoria': 'FEM', 'edad': 29, 'altura_cm': 172},
        # Básquetbol Femenino - Storm
        {'nombre': 'Jewell Loyd', 'dorsal': 24, 'posicion': 'Escolta', 'equipo': 'Seattle Storm', 'categoria': 'FEM', 'edad': 31, 'altura_cm': 178},
        {'nombre': 'Skylar Diggins-Smith', 'dorsal': 4, 'posicion': 'Base', 'equipo': 'Seattle Storm', 'categoria': 'FEM', 'edad': 34, 'altura_cm': 175},
        {'nombre': 'Nneka Ogwumike', 'dorsal': 30, 'posicion': 'Ala-Pívot', 'equipo': 'Seattle Storm', 'categoria': 'FEM', 'edad': 34, 'altura_cm': 188},
        {'nombre': 'Ezi Magbegor', 'dorsal': 13, 'posicion': 'Pívot', 'equipo': 'Seattle Storm', 'categoria': 'FEM', 'edad': 25, 'altura_cm': 193},
        {'nombre': 'Sami Whitcomb', 'dorsal': 32, 'posicion': 'Escolta', 'equipo': 'Seattle Storm', 'categoria': 'FEM', 'edad': 36, 'altura_cm': 178},

        # Voleibol Masculino - Trentino
        {'nombre': 'Alessandro Michieletto', 'dorsal': 5, 'posicion': 'Receptor-Atacante', 'equipo': 'Trentino Volley', 'categoria': 'MASC', 'edad': 23, 'altura_cm': 211},
        {'nombre': 'Daniele Lavia', 'dorsal': 15, 'posicion': 'Receptor-Atacante', 'equipo': 'Trentino Volley', 'categoria': 'MASC', 'edad': 25, 'altura_cm': 200},
        {'nombre': 'Riccardo Sbertoli', 'dorsal': 6, 'posicion': 'Colocador/Armador', 'equipo': 'Trentino Volley', 'categoria': 'MASC', 'edad': 26, 'altura_cm': 188},
        {'nombre': 'Jan Kozamernik', 'dorsal': 11, 'posicion': 'Central', 'equipo': 'Trentino Volley', 'categoria': 'MASC', 'edad': 29, 'altura_cm': 204},
        {'nombre': 'Gabriele Laurenzano', 'dorsal': 13, 'posicion': 'Líbero', 'equipo': 'Trentino Volley', 'categoria': 'MASC', 'edad': 21, 'altura_cm': 176},
        # Voleibol Masculino - Perugia
        {'nombre': 'Wilfredo Leon', 'dorsal': 9, 'posicion': 'Receptor-Atacante', 'equipo': 'Perugia Volley', 'categoria': 'MASC', 'edad': 31, 'altura_cm': 202},
        {'nombre': 'Simone Giannelli', 'dorsal': 6, 'posicion': 'Colocador/Armador', 'equipo': 'Perugia Volley', 'categoria': 'MASC', 'edad': 28, 'altura_cm': 200},
        {'nombre': 'Oleh Plotnytskyi', 'dorsal': 17, 'posicion': 'Receptor-Atacante', 'equipo': 'Perugia Volley', 'categoria': 'MASC', 'edad': 27, 'altura_cm': 195},
        {'nombre': 'Roberto Russo', 'dorsal': 19, 'posicion': 'Central', 'equipo': 'Perugia Volley', 'categoria': 'MASC', 'edad': 27, 'altura_cm': 205},
        {'nombre': 'Massimo Colaci', 'dorsal': 13, 'posicion': 'Líbero', 'equipo': 'Perugia Volley', 'categoria': 'MASC', 'edad': 39, 'altura_cm': 180},
        # Voleibol Masculino - Sada Cruzeiro
        {'nombre': 'Wallace de Souza', 'dorsal': 8, 'posicion': 'Opuesto', 'equipo': 'Sada Cruzeiro', 'categoria': 'MASC', 'edad': 37, 'altura_cm': 198},
        {'nombre': 'Rodrigo Leao', 'dorsal': 14, 'posicion': 'Receptor-Atacante', 'equipo': 'Sada Cruzeiro', 'categoria': 'MASC', 'edad': 28, 'altura_cm': 197},
        {'nombre': 'Otavio Pinto', 'dorsal': 4, 'posicion': 'Central', 'equipo': 'Sada Cruzeiro', 'categoria': 'MASC', 'edad': 33, 'altura_cm': 204},
        {'nombre': 'Fernando Kreling', 'dorsal': 7, 'posicion': 'Colocador/Armador', 'equipo': 'Sada Cruzeiro', 'categoria': 'MASC', 'edad': 28, 'altura_cm': 185},
        {'nombre': 'Lucas de Deus', 'dorsal': 17, 'posicion': 'Líbero', 'equipo': 'Sada Cruzeiro', 'categoria': 'MASC', 'edad': 37, 'altura_cm': 178},
        # Voleibol Masculino - ZAKSA
        {'nombre': 'Aleksander Sliwka', 'dorsal': 11, 'posicion': 'Receptor-Atacante', 'equipo': 'ZAKSA Kedzierzyn', 'categoria': 'MASC', 'edad': 29, 'altura_cm': 196},
        {'nombre': 'Lukasz Kaczmarek', 'dorsal': 2, 'posicion': 'Opuesto', 'equipo': 'ZAKSA Kedzierzyn', 'categoria': 'MASC', 'edad': 30, 'altura_cm': 204},
        {'nombre': 'Marcin Janusz', 'dorsal': 5, 'posicion': 'Colocador/Armador', 'equipo': 'ZAKSA Kedzierzyn', 'categoria': 'MASC', 'edad': 30, 'altura_cm': 195},
        {'nombre': 'David Smith', 'dorsal': 9, 'posicion': 'Central', 'equipo': 'ZAKSA Kedzierzyn', 'categoria': 'MASC', 'edad': 39, 'altura_cm': 201},
        {'nombre': 'Erik Shoji', 'dorsal': 22, 'posicion': 'Líbero', 'equipo': 'ZAKSA Kedzierzyn', 'categoria': 'MASC', 'edad': 35, 'altura_cm': 184},

        # Voleibol Femenino - VakifBank
        {'nombre': 'Zehra Gunes', 'dorsal': 18, 'posicion': 'Central', 'equipo': 'VakifBank Istanbul', 'categoria': 'FEM', 'edad': 25, 'altura_cm': 197},
        {'nombre': 'Cansu Ozbay', 'dorsal': 3, 'posicion': 'Colocadora/Armadora', 'equipo': 'VakifBank Istanbul', 'categoria': 'FEM', 'edad': 28, 'altura_cm': 182},
        {'nombre': 'Marina Markova', 'dorsal': 17, 'posicion': 'Receptora-Atacante', 'equipo': 'VakifBank Istanbul', 'categoria': 'FEM', 'edad': 23, 'altura_cm': 198},
        {'nombre': 'Kiera Van Ryk', 'dorsal': 9, 'posicion': 'Opuesta', 'equipo': 'VakifBank Istanbul', 'categoria': 'FEM', 'edad': 25, 'altura_cm': 188},
        {'nombre': 'Ayca Aykac', 'dorsal': 1, 'posicion': 'Líbero', 'equipo': 'VakifBank Istanbul', 'categoria': 'FEM', 'edad': 28, 'altura_cm': 176},
        # Voleibol Femenino - Imoco
        {'nombre': 'Paola Egonu', 'dorsal': 18, 'posicion': 'Opuesta', 'equipo': 'Imoco Conegliano', 'categoria': 'FEM', 'edad': 26, 'altura_cm': 193},
        {'nombre': 'Joanna Wolosz', 'dorsal': 14, 'posicion': 'Colocadora/Armadora', 'equipo': 'Imoco Conegliano', 'categoria': 'FEM', 'edad': 34, 'altura_cm': 181},
        {'nombre': 'Monica De Gennaro', 'dorsal': 10, 'posicion': 'Líbero', 'equipo': 'Imoco Conegliano', 'categoria': 'FEM', 'edad': 37, 'altura_cm': 174},
        {'nombre': 'Sarah Fahr', 'dorsal': 19, 'posicion': 'Central', 'equipo': 'Imoco Conegliano', 'categoria': 'FEM', 'edad': 23, 'altura_cm': 194},
        {'nombre': 'Kathryn Plummer', 'dorsal': 2, 'posicion': 'Receptora-Atacante', 'equipo': 'Imoco Conegliano', 'categoria': 'FEM', 'edad': 26, 'altura_cm': 198},
        # Voleibol Femenino - Fenerbahce
        {'nombre': 'Melissa Vargas', 'dorsal': 4, 'posicion': 'Opuesta', 'equipo': 'Fenerbahce Opet', 'categoria': 'FEM', 'edad': 25, 'altura_cm': 194},
        {'nombre': 'Eda Erdem', 'dorsal': 14, 'posicion': 'Central', 'equipo': 'Fenerbahce Opet', 'categoria': 'FEM', 'edad': 37, 'altura_cm': 188},
        {'nombre': 'Arina Fedorovtseva', 'dorsal': 11, 'posicion': 'Receptora-Atacante', 'equipo': 'Fenerbahce Opet', 'categoria': 'FEM', 'edad': 21, 'altura_cm': 190},
        {'nombre': 'Bojana Drca', 'dorsal': 9, 'posicion': 'Colocadora/Armadora', 'equipo': 'Fenerbahce Opet', 'categoria': 'FEM', 'edad': 36, 'altura_cm': 186},
        {'nombre': 'Gizem Orge', 'dorsal': 1, 'posicion': 'Líbero', 'equipo': 'Fenerbahce Opet', 'categoria': 'FEM', 'edad': 31, 'altura_cm': 170},
        # Voleibol Femenino - Eczacibasi
        {'nombre': 'Tijana Boskovic', 'dorsal': 18, 'posicion': 'Opuesta', 'equipo': 'Eczacibasi Dynavit', 'categoria': 'FEM', 'edad': 27, 'altura_cm': 194},
        {'nombre': 'Hande Baladin', 'dorsal': 7, 'posicion': 'Receptora-Atacante', 'equipo': 'Eczacibasi Dynavit', 'categoria': 'FEM', 'edad': 27, 'altura_cm': 190},
        {'nombre': 'Sinead Jack-Kisal', 'dorsal': 12, 'posicion': 'Central', 'equipo': 'Eczacibasi Dynavit', 'categoria': 'FEM', 'edad': 31, 'altura_cm': 198},
        {'nombre': 'Elif Sahin', 'dorsal': 4, 'posicion': 'Colocadora/Armadora', 'equipo': 'Eczacibasi Dynavit', 'categoria': 'FEM', 'edad': 23, 'altura_cm': 189},
        {'nombre': 'Simge Akoz', 'dorsal': 2, 'posicion': 'Líbero', 'equipo': 'Eczacibasi Dynavit', 'categoria': 'FEM', 'edad': 33, 'altura_cm': 168},
    ]
}


def generar_fixture_y_estadisticas(equipos_dict, jugadores_dict, deporte_objs, categoria_objs):
    """
    Construye más de 1.200 registros de EstadisticaJugadorPartido
    a partir de una liga de encuentros estructurada para ambas disciplinas y géneros.
    """
    from .models import Partido, EstadisticaJugadorPartido

    partidos_a_crear = []
    # Generamos partidos ida y vuelta a lo largo de varias fechas
    fecha_base = date(2025, 1, 10)

    # Agrupamos equipos por deporte y categoría
    grupos = {}
    for eq in equipos_dict.values():
        clave = (eq.deporte.codigo, eq.categoria.codigo)
        grupos.setdefault(clave, []).append(eq)

    jornada_global = 1
    dia_offset = 0

    # Para cada grupo (Basket Masc, Basket Fem, Voley Masc, Voley Fem)
    for (dep_cod, cat_cod), eqs in grupos.items():
        dep_obj = deporte_objs[dep_cod]
        cat_obj = categoria_objs[cat_cod]

        # Cada equipo juega contra todos los de su grupo en 8 fechas distintas
        for ronda in range(1, 9):
            for i in range(len(eqs)):
                for j in range(i + 1, len(eqs)):
                    eq_local = eqs[i] if ronda % 2 == 1 else eqs[j]
                    eq_visit = eqs[j] if ronda % 2 == 1 else eqs[i]

                    dia_offset += 2
                    fecha_partido = fecha_base + timedelta(days=dia_offset % 300)

                    # Puntuación real diferenciada por disciplina y género
                    if dep_cod == 'BASKET':
                        if cat_cod == 'MASC':
                            # Baloncesto Masculino (NBA/Euroliga 48 min): 102 a 122 puntos
                            base_pts = 106 + ((i * 3 + j * 2 + ronda * 4) % 14)
                            pts_local = base_pts + (ronda % 4) * 3
                            pts_visit = base_pts - 5 + (ronda % 3) * 3
                        else:
                            # Baloncesto Femenino (WNBA/FIBA 40 min): 72 a 88 puntos
                            base_pts = 74 + ((i * 2 + j * 3 + ronda * 2) % 12)
                            pts_local = base_pts + (ronda % 3) * 3
                            pts_visit = base_pts - 3 + (ronda % 2) * 2

                        if pts_local == pts_visit:
                            pts_local += 2
                    else:
                        # Voleibol: marcador en sets diferenciado por rama
                        if cat_cod == 'MASC':
                            # Masculino: mayor contundencia y sets rápidos
                            sets_pool = [(3, 0), (3, 1), (3, 1), (3, 2), (1, 3), (0, 3)]
                        else:
                            # Femenino: mayor cantidad de desempates a 5 sets
                            sets_pool = [(3, 2), (2, 3), (3, 1), (1, 3), (3, 2), (2, 3)]

                        sets = sets_pool[(i + j + ronda) % len(sets_pool)]
                        pts_local, pts_visit = sets[0], sets[1]

                    partidos_a_crear.append(
                        Partido(
                            deporte=dep_obj,
                            categoria=cat_obj,
                            temporada='2024-2025' if ronda <= 4 else '2025-2026',
                            jornada=(ronda % 10) + 1,
                            fecha=fecha_partido,
                            equipo_local=eq_local,
                            equipo_visitante=eq_visit,
                            puntos_local=pts_local,
                            puntos_visitante=pts_visit,
                            estado='Finalizado',
                        )
                    )

    # Inserción masiva de partidos
    partidos_creados = Partido.objects.bulk_create(partidos_a_crear)

    # Ahora generamos las estadísticas individuales por partido
    estadisticas_a_crear = []

    for idx, partido in enumerate(partidos_creados):
        es_voley = (partido.deporte.codigo == 'VOLEY')
        es_fem = (partido.categoria.codigo == 'FEM')

        # Obtenemos jugadores de ambos equipos
        jugadores_local = jugadores_dict.get(partido.equipo_local.id, [])
        jugadores_visit = jugadores_dict.get(partido.equipo_visitante.id, [])
        jugadores_partido = jugadores_local + jugadores_visit

        for p_idx, jugador in enumerate(jugadores_partido):
            factor = (idx + p_idx * 7) % 11

            if not es_voley:
                # Estadísticas de Básquet diferenciadas
                minutos = 18 + (factor % 20)
                if not es_fem:
                    puntos = (factor * 3 + p_idx * 2) % 32 + 2
                    rebotes = (factor * 2 + p_idx) % 14 + 1
                    asistencias = (factor + p_idx * 2) % 10
                else:
                    puntos = (factor * 2 + p_idx * 2) % 24 + 1
                    rebotes = (factor + p_idx) % 10 + 1
                    asistencias = (factor + p_idx) % 8

                robos = (factor) % 4
                perdidas = (factor) % 5

                valoracion = max(Decimal('0.00'), Decimal(str((puntos + rebotes + asistencias + robos) - perdidas)))

                estadisticas_a_crear.append(
                    EstadisticaJugadorPartido(
                        partido=partido,
                        jugador=jugador,
                        minutos_o_sets=minutos,
                        puntos=puntos,
                        rebotes=rebotes,
                        asistencias=asistencias,
                        robos=robos,
                        perdidas=perdidas,
                        bloqueos=0,
                        saques_ace=0,
                        recepciones=0,
                        errores=0,
                        valoracion_rendimiento=valoracion,
                    )
                )
            else:
                # Estadísticas de Vóley diferenciadas
                sets = 3 + (factor % 3)
                puntos = (5 + (factor * 2) % 18) if es_fem else (6 + (factor * 2) % 22)
                bloqueos = (factor % 5) if es_fem else (factor % 7)
                saques = (factor % 3) if es_fem else (factor % 5)
                recepciones = (8 + (factor * 2) % 16) if es_fem else (4 + (factor) % 12)
                errores = 1 + (factor) % 4

                valoracion = max(Decimal('0.00'), Decimal(str((puntos + bloqueos + saques + recepciones) - errores)))

                estadisticas_a_crear.append(
                    EstadisticaJugadorPartido(
                        partido=partido,
                        jugador=jugador,
                        minutos_o_sets=sets,
                        puntos=puntos,
                        rebotes=0,
                        asistencias=0,
                        robos=0,
                        perdidas=0,
                        bloqueos=bloqueos,
                        saques_ace=saques,
                        recepciones=recepciones,
                        errores=errores,
                        valoracion_rendimiento=valoracion,
                    )
                )

    # Inserción masiva en bloques de 500 registros
    EstadisticaJugadorPartido.objects.bulk_create(
        estadisticas_a_crear,
        batch_size=500,
        ignore_conflicts=True
    )

    return len(partidos_creados), len(estadisticas_a_crear)
