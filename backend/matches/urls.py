# matches/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Partidas
    path('', views.match_list_create, name='match-list-create'),
    path('<uuid:match_id>/', views.match_detail, name='match-detail'),
    path('user/', views.user_matches, name='user-matches'),
    
    # Acciones de partida
    path('<uuid:match_id>/start/', views.start_match, name='start-match'),
    path('<uuid:match_id>/finish/', views.finish_match, name='finish-match'),

]