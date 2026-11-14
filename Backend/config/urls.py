"""Rutas principales del Backend para CanchaData."""
from pathlib import Path
from django.contrib import admin
from django.urls import path, include, re_path
from django.http import HttpResponse
from django.views.static import serve

BASE_DIR = Path(__file__).resolve().parent.parent

def find_frontend_dir():
    candidates = [
        BASE_DIR.parent / 'Frontend' / 'dist',
        BASE_DIR / 'Frontend' / 'dist',
        BASE_DIR / 'dist',
        BASE_DIR / 'staticfiles',
    ]
    for c in candidates:
        if (c / 'index.html').exists():
            return c
    return None

def spa_or_file_view(request, path=''):
    f_dir = find_frontend_dir()
    if not f_dir:
        return HttpResponse(
            '<h2>API de CanchaData activa</h2>'
            '<p>Visita <a href="/api/">/api/</a> para consultar los endpoints o compila el frontend con <code>npm run build</code>.</p>',
            content_type='text/html; charset=utf-8'
        )
    
    # 1. Si la ruta apunta a un archivo estático real en Frontend/dist (ej: assets/..., favicon.ico)
    if path:
        target_file = f_dir / path
        if target_file.is_file():
            return serve(request, path, document_root=str(f_dir))

    # 2. De lo contrario (/, /partidos, /estadisticas, /rendimiento, /pizarra, /acerca-de)
    # Servir index.html de la SPA React
    index_file = f_dir / 'index.html'
    if index_file.exists():
        with open(index_file, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read(), content_type='text/html; charset=utf-8')
            
    return HttpResponse(
        '<h2>API de CanchaData activa</h2>'
        '<p>Visita <a href="/api/">/api/</a> para consultar los endpoints.</p>',
        content_type='text/html; charset=utf-8'
    )

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('canchadata.urls')),
    re_path(r'^(?!api|admin)(?P<path>.*)$', spa_or_file_view, name='frontend-spa'),
]
