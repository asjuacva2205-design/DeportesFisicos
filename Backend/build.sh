#!/usr/bin/env bash
# Exit on error
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate

# Corregir posible typo en variable de contraseña de superusuario
if [ -n "$DJANGO_SUPERUSER_PASWORD" ] && [ -z "$DJANGO_SUPERUSER_PASSWORD" ]; then
    export DJANGO_SUPERUSER_PASSWORD="$DJANGO_SUPERUSER_PASWORD"
fi

# Crear superusuario automáticamente si las variables están configuradas
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
    echo "Configurando superusuario de Django..."
    python manage.py createsuperuser --noinput || true
fi

# Inyectar datos iniciales si SEED_ON_BUILD está activo
if [ "$SEED_ON_BUILD" = "True" ] || [ "$SEED_ON_BUILD" = "true" ] || [ "$SEED_ON_BUILD" = "1" ]; then
    echo "Ejecutando carga masiva de datos deportivos..."
    python manage.py cargar_datos_deportivos || true
fi
