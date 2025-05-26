#tournaments/models.py
import uuid
from django.db import models
from django.conf import settings

class Tournament(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('in_progress', 'En Curso'),
        ('finished', 'Finalizado'),
    ]
    
    MODE_CHOICES = [
        ('blitz', 'Blitz'),
        ('rapid', 'Rápido'),
        ('classical', 'Clásico'),
        ('bullet', 'Bullet'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    start_date = models.DateField()
    start_time = models.TimeField()
    mode = models.CharField(max_length=20, choices=MODE_CHOICES, default='rapid')
    prize = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    description = models.TextField(blank=True)
    max_players = models.IntegerField(default=16)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through='TournamentParticipant',
        related_name='tournaments'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    @property
    def current_participants_count(self):
        return self.participants.count()
    
    @property
    def is_full(self):
        return self.current_participants_count >= self.max_players
    
    class Meta:
        db_table = 'tournaments'
        ordering = ['-created_at']

class TournamentParticipant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'tournament_participants'
        unique_together = ['tournament', 'user']
    
    def __str__(self):
        return f"{self.user.username} en {self.tournament.name}"