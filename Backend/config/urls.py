"""Rutas principales del Backend para CanchaData."""
import os
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

def index_view(request):
    f_dir = find_frontend_dir()
    if f_dir and (f_dir / 'index.html').exists():
        with open(f_dir / 'index.html', 'r', encoding='utf-8') as f:
            return HttpResponse(f.read(), content_type='text/html; charset=utf-8')
    return HttpResponse(
        '<h2>API de CanchaData activa</h2>'
        '<p>Visita <a href="/api/">/api/</a> para consultar los endpoints o inicia el frontend con <code>npm run dev</code>.</p>',
        content_type='text/html; charset=utf-8'
    )

def assets_serve(request, path):
    f_dir = find_frontend_dir()
    if f_dir and (f_dir / 'assets').exists():
        return serve(request, path, document_root=str(f_dir / 'assets'))
    return HttpResponse(status=404)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('canchadata.urls')),
    path('assets/<path:path>', assets_serve, name='frontend-assets'),
    re_path(r'^(?!api|admin|static|assets).*$', index_view, name='frontend-spa'),
]
