"""Configuración de Django para CanchaData."""
import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Cargar variables del archivo .env
load_dotenv(BASE_DIR / '.env')

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-canchadata-default-key-dev-2026')
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '.onrender.com', '*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'whitenoise.runserver_nostatic',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'canchadata',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Orígenes autorizados para React (Vite en desarrollo y Render en producción)
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]

# Permitir subdominios de onrender.com y puertos locales
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https:\/\/.*\.onrender\.com$",
    r"^http:\/\/localhost:\d+$",
    r"^http:\/\/127\.0\.0\.1:\d+$",
]

# En producción permite la comunicación si no está restringida
CORS_ALLOW_ALL_ORIGINS = os.getenv('CORS_ALLOW_ALL', 'True').lower() == 'true'

# Dominios de confianza para protección CSRF en Render
CSRF_TRUSTED_ORIGINS = [
    'https://*.onrender.com',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]


ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR.parent / 'Frontend' / 'dist'] if (BASE_DIR.parent / 'Frontend' / 'dist').exists() else [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Conexión a la base de datos: PostgreSQL
# 1. Si existe DATABASE_URL (estándar en Render, Railway, Neon, Heroku):
#    Usa dj-database-url (o parser de respaldo) para conectarse a la DB en la nube.
# 2. Si no, lee las variables individuales (DB_HOST, DB_PORT, etc.).
# 3. Si no hay variables, usa el entorno local (localhost:5433).

database_url = os.getenv('DATABASE_URL')

if database_url:
    # Render suele entregar postgres://; normalizar a postgresql://
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)

    try:
        import dj_database_url
        DATABASES = {
            'default': dj_database_url.config(
                default=database_url,
                conn_max_age=600,
                conn_health_checks=True,
            )
        }
    except ImportError:
        import urllib.parse
        url = urllib.parse.urlparse(database_url)
        options = {}
        if 'sslmode=require' in database_url:
            options['sslmode'] = 'require'

        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': url.path[1:],
                'USER': url.username,
                'PASSWORD': url.password,
                'HOST': url.hostname,
                'PORT': url.port or '5432',
                'OPTIONS': options,
            }
        }
else:
    db_user = os.getenv('DB_USER', 'postgres')
    db_password = os.getenv('DB_PASSWORD', '')
    db_name = os.getenv('DB_NAME', 'deportes_db')
    db_host = os.getenv('DB_HOST', 'localhost')
    db_port = os.getenv('DB_PORT', '5433' if db_host in ('localhost', '127.0.0.1') else '5432')

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': db_name,
            'USER': db_user,
            'PASSWORD': db_password,
            'HOST': db_host,
            'PORT': db_port,
        }
    }


AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'es'
TIME_ZONE = 'America/Bogota'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

frontend_dist = BASE_DIR.parent / 'Frontend' / 'dist'
STATICFILES_DIRS = []
if frontend_dist.exists():
    STATICFILES_DIRS.append(frontend_dist)

# Configuración de WhiteNoise para producción
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'canchadata.paginacion.PaginacionDeportiva',
    'PAGE_SIZE': 10,
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
}
