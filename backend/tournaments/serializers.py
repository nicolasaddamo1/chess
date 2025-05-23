from rest_framework import serializers
from .models import Tournament, TournamentParticipant
from users.serializers import UserProfileSerializer

class TournamentSerializer(serializers.ModelSerializer):
    current_participants_count = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    
    class Meta:
        model = Tournament
        fields = [
            'id', 'name', 'start_date', 'start_time', 'mode', 'prize',
            'description', 'max_players', 'status', 'current_participants_count',
            'is_full', 'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'created_at', 'updated_at')

class TournamentDetailSerializer(serializers.ModelSerializer):
    participants = UserProfileSerializer(many=True, read_only=True)
    current_participants_count = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    
    class Meta:
        model = Tournament
        fields = [
            'id', 'name', 'start_date', 'start_time', 'mode', 'prize',
            'description', 'max_players', 'status', 'participants',
            'current_participants_count', 'is_full', 'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'created_at', 'updated_at')

class TournamentParticipantSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    tournament = TournamentSerializer(read_only=True)
    
    class Meta:
        model = TournamentParticipant
        fields = ['id', 'user', 'tournament', 'joined_at']
        read_only_fields = ('id', 'joined_at')