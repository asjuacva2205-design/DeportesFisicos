# CanchaData — Plataforma de Analítica Deportiva (Básquetbol y Voleibol)

Proyecto final desarrollado para el **Taller Django + React**, aplicando la arquitectura, convenciones y buenas prácticas vistas en clase. Implementa una API construida con Django y Django REST Framework, persistencia en PostgreSQL, un panel de usuario interactivo en React que la consume y configuración lista para despliegue en producción con WhiteNoise y Gunicorn.

---

## 🚀 Arquitectura y Tecnologías

El proyecto mantiene la estructura desacoplada del taller:

```text
Deportes/
├── Backend/                      # API REST construida con Django y DRF
│   ├── config/                   # Configuración central (settings, urls, wsgi)
│   ├── canchadata/               # App de dominio deportivo
│   │   ├── models.py             # Modelos relacionales normalizados
│   │   ├── serializers.py        # Serializadores DRF
│   │   ├── views.py              # CRUD, filtros, estadísticas ORM y comparador
│   │   ├── paginacion.py         # Paginación estándar {count, next, previous, results}
│   │   ├── fuente_datos.py       # Procesamiento de datos reales
│   │   └── management/commands/  # Comando de inyección masiva en bloque
│   ├── requirements.txt          # Dependencias de Python congeladas
│   └── .env                      # Variables de entorno (conexión DB y SECRET_KEY)
└── Frontend/                     # Panel de usuario SPA con React 19 y Vite
    ├── src/
    │   ├── shared/api.js         # Cliente fetch centralizado con autenticación por token
    │   ├── features/partidos/    # Listado paginado, búsqueda y CRUD con confirmación
    │   ├── features/estadisticas/# Tablero reactivo con gráficas Recharts y ORM
    │   ├── features/rendimiento/ # HERRAMIENTA NUEVA: Comparador Cara a Cara
    │   └── features/acerca_de/   # Ficha de autoría y explicación técnica
    ├── package.json              # Dependencias de Node (React, Recharts, Lucide)
    └── vite.config.js            # Configuración de compilación
```

---

## 🏀 Modelo de Datos del Dominio

* **`Deporte`**: Básquetbol y Voleibol.
* **`Categoria`**: Femenino y Masculino (separación estricta para garantizar comparaciones justas).
* **`Equipo`**: 16 clubes oficiales (NBA, WNBA, Euroliga, SuperLega, CEV Champions League).
* **`Jugador`**: 80 atletas reales con posición, dorsal, altura y edad.
* **`Partido`**: 192 encuentros disputados con marcadores y fechas oficiales.
* **`EstadisticaJugadorPartido`**: **1.920 registros individuales reales** cargados en la base de datos con `bulk_create` (supera la exigencia de más de 1.000 registros).

---

## ⭐ Herramienta Diferenciadora: CanchaData Performance Index

En lugar de presentar una calificación subjetiva o inventada, el sistema incluye una **Ficha de Rendimiento Explicable y Comparador Cara a Cara**:
* **Básquetbol:** `Eficiencia = (Puntos + Rebotes + Asistencias + Robos) - Pérdidas`
* **Voleibol:** `Aportación = (Puntos + Bloqueos + Aces Saque + Recepciones) - Errores no Forzados`
* Permite comparar a 2 atletas o 2 equipos bajo la misma rama deportiva y temporada, visualizando de forma transparente cómo influye cada variable en el rendimiento.

---

## 💻 Instrucciones para Arrancar Localmente

### 1. Iniciar el Backend (Django)
Abre una terminal PowerShell en la carpeta raíz del proyecto:
```powershell
cd Backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```
El servidor Django responderá en **<http://127.0.0.1:8000>**.

### 2. Iniciar el Frontend (React)
Abre una segunda terminal en la carpeta raíz:
```powershell
cd Frontend
npm run dev
```
Abre tu navegador en **<http://localhost:5173>**.

---

## 🔐 Credenciales de Prueba

* **Usuario Administrador:** `admin`
* **Contraseña:** `admin1234`
* *(Permite iniciar sesión en el panel de React mediante Token Auth para crear nuevos partidos y eliminarlos con confirmación).*

---

## 📊 Endpoints Clave de la API

* **Partidos (CRUD y Búsqueda):** `GET /api/partidos/` (soporta `?page=`, `?page_size=`, `?search=`, `?deporte=`, `?categoria=`, `?temporada=`).
* **Estadísticas ORM (2 campos):** `GET /api/estadisticas/` (agrupaciones por *Deporte y Categoría* y *Temporada y Deporte*).
* **Comparador de Rendimiento:** `POST /api/rendimiento/comparar/`.
* **Autenticación por Token:** `POST /api/auth/login/`.
* **Limpieza Masiva con Confirmación:** `DELETE /api/limpieza/` (requiere `{"confirmar": true}`).
