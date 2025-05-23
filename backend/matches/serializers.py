from rest_framework import serializers
from .models import Match
from users.serializers import UserProfileSerializer
from tournaments.serializers import TournamentSerializer

class MatchSerializer(serializers.ModelSerializer):
    white_player = UserProfileSerializer(read_only=True)
    black_player = UserProfileSerializer(read_only=True)
    tournament = TournamentSerializer(read_only=True)
    winner = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = Match
        fields = [
            'id', 'tournament', 'white_player', 'black_player', 'status',
            'result', 'round_number', 'started_at', 'finished_at', 'moves',
            'winner', 'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'created_at', 'updated_at')

class MatchCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = [
            'tournament', 'white_player', 'black_player', 'round_number'
        ]

class MatchUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ['status', 'result', 'moves', 'started_at', 'finished_at']