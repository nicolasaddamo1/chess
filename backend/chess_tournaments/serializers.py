from rest_framework import serializers
from .models import Player, Tournament, Participation

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = '__all__'

class TournamentSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True)
    
    class Meta:
        model = Tournament
        fields = '__all__'

class ParticipationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participation
        fields = '__all__'
