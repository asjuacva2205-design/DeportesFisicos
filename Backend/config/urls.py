"""Rutas principales del Backend para CanchaData."""
import os
from pathlib import Path
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.http import HttpResponse

BASE_DIR = Path(__file__).resolve().parent.parent
frontend_index = BASE_DIR.parent / 'Frontend' / 'dist' / 'index.html'

def index_view(request):
    if frontend_index.exists():
        with open(frontend_index, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read())
    return HttpResponse(
        '<h2>API de CanchaData activa</h2>'
        '<p>Visita <a href="/api/">/api/</a> para consultar los endpoints o inicia el frontend con <code>npm run dev</code>.</p>'
    )

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('canchadata.urls')),
    re_path(r'^(?!api|admin|static).*$', index_view),
]
