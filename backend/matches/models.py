import uuid
from django.db import models
from django.conf import settings
from tournaments.models import Tournament

class Match(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('in_progress', 'En Curso'),
        ('finished', 'Finalizada'),
        ('cancelled', 'Cancelada'),
    ]
    
    RESULT_CHOICES = [
        ('white_wins', 'Ganan Blancas'),
        ('black_wins', 'Ganan Negras'),
        ('draw', 'Empate'),
        ('pending', 'Pendiente'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='matches')
    white_player = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='white_matches'
    )
    black_player = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='black_matches'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    result = models.CharField(max_length=20, choices=RESULT_CHOICES, default='pending')
    round_number = models.IntegerField(default=1)
    started_at = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)
    moves = models.TextField(blank=True)  # PGN notation
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.white_player.username} vs {self.black_player.username} - {self.tournament.name}"
    
    @property
    def winner(self):
        if self.result == 'white_wins':
            return self.white_player
        elif self.result == 'black_wins':
            return self.black_player
        return None
    
    class Meta:
        db_table = 'matches'
        ordering = ['-created_at']