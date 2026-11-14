#!/usr/bin/env bash
# Exit on error
set -o errexit

# 1. Compilar Frontend si npm está disponible en el entorno
if command -v npm &> /dev/null && [ -d "Frontend" ]; then
    echo "Compilando Frontend con Vite..."
    cd Frontend
    npm install
    npm run build
    cd ..
fi

# 2. Instalar dependencias de Python
pip install -r Backend/requirements.txt

# 3. Recopilar estáticos y aplicar migraciones
python Backend/manage.py collectstatic --noinput
python Backend/manage.py migrate

# 4. Corregir posible typo en variable de contraseña de superusuario
if [ -n "$DJANGO_SUPERUSER_PASWORD" ] && [ -z "$DJANGO_SUPERUSER_PASSWORD" ]; then
    export DJANGO_SUPERUSER_PASSWORD="$DJANGO_SUPERUSER_PASWORD"
fi

# 5. Crear superusuario automáticamente si las variables están configuradas
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
    echo "Configurando superusuario de Django..."
    python Backend/manage.py createsuperuser --noinput || true
fi

# 6. Inyectar datos iniciales si SEED_ON_BUILD está activo
if [ "$SEED_ON_BUILD" = "True" ] || [ "$SEED_ON_BUILD" = "true" ] || [ "$SEED_ON_BUILD" = "1" ]; then
    echo "Ejecutando carga masiva de datos deportivos..."
    python Backend/manage.py cargar_datos_deportivos || true
fi
