from rest_framework.pagination import PageNumberPagination


class PaginacionDeportiva(PageNumberPagination):
    """Paginación estándar para listados deportivos. Soporta parámetro ?page_size="""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
