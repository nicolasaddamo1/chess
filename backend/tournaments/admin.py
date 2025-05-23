# tournaments/admin.py
from django.contrib import admin
from .models import Tournament, TournamentParticipant  # Importación limpia y correcta

@admin.register(Tournament)
class TournamentAdmin(admin.ModelAdmin):
    list_display = ('name', 'start_date', 'start_time', 'mode', 'status', 'current_participants_count', 'max_players')
    list_filter = ('status', 'mode', 'start_date')
    search_fields = ('name', 'description')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at', 'current_participants_count')
    pass

@admin.register(TournamentParticipant)
class TournamentParticipantAdmin(admin.ModelAdmin):
    list_display = ('tournament', 'user', 'joined_at')
    list_filter = ('joined_at', 'tournament__status')
    search_fields = ('tournament__name', 'user__username', 'user__email')
    ordering = ('-joined_at',)
    pass