import os
from django.db import migrations


def crear_superusuarios(apps, schema_editor):
    from django.contrib.auth import get_user_model
    User = get_user_model()

    # Contraseña desde variable de entorno de Render o por defecto
    pwd = (
        os.getenv('DJANGO_SUPERUSER_PASSWORD')
        or os.getenv('DJANGO_SUPERUSER_PASWORD')
        or 'admin1234'
    )
    user_name = os.getenv('DJANGO_SUPERUSER_USERNAME', 'astridj')
    email = os.getenv('DJANGO_SUPERUSER_EMAIL', 'astridj@canchadata.com')

    # 1. Crear / asegurar superusuario astridj
    user = User.objects.filter(username=user_name).first()
    if not user:
        User.objects.create_superuser(
            username=user_name,
            email=email,
            password=pwd,
        )
    else:
        user.is_staff = True
        user.is_superuser = True
        user.save()

    # 2. Crear / asegurar superusuario admin de prueba del taller
    admin_user = User.objects.filter(username='admin').first()
    if not admin_user:
        User.objects.create_superuser(
            username='admin',
            email='admin@canchadata.com',
            password='admin1234',
        )
    else:
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.save()


def revertir(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('canchadata', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(crear_superusuarios, reverse_code=revertir),
    ]
