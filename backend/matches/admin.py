from django.contrib import admin
from .models import Match

@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ('white_player', 'black_player', 'tournament', 'status', 'result', 'round_number')
    list_filter = ('status', 'result', 'tournament', 'round_number')
    search_fields = ('white_player__username', 'black_player__username', 'tournament__name')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at', 'winner')
    pass