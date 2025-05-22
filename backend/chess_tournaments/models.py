from django.db import models

class Player(models.Model):
    name = models.CharField(max_length=100)
    elo_rating = models.IntegerField(default=1200)
    created_at = models.DateTimeField(auto_now_add=True)

class Tournament(models.Model):
    name = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField()
    players = models.ManyToManyField(Player, through='Participation')
    STATUS_CHOICES = [
        ('planning', 'Planificación'),
        ('ongoing', 'En curso'),
        ('completed', 'Finalizado')
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='planning')

class Participation(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    score = models.FloatField(default=0)
