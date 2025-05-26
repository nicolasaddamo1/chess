from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Tournament, TournamentParticipant
from .serializers import TournamentSerializer, TournamentDetailSerializer
from matches.models import Match
from matches.serializers import MatchSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def tournament_list_create(request):
    """
    GET: Listar todos los torneos
    POST: Crear nuevo torneo
    """
    if request.method == 'GET':
        tournaments = Tournament.objects.all()
        serializer = TournamentSerializer(tournaments, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = TournamentSerializer(data=request.data)
        if serializer.is_valid():
            tournament = serializer.save()
            return Response(
                TournamentSerializer(tournament).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def tournament_detail(request, tournament_id):
    """
    Obtener detalles de un torneo específico
    """
    tournament = get_object_or_404(Tournament, id=tournament_id)
    serializer = TournamentDetailSerializer(tournament)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def join_tournament(request, tournament_id):
    """
    Inscribirse en un torneo
    """
    tournament = get_object_or_404(Tournament, id=tournament_id)
    user = request.user
    
    # Verificar si el torneo está lleno
    if tournament.is_full:
        return Response(
            {'error': 'El torneo está lleno'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Verificar si el usuario ya está inscrito
    if TournamentParticipant.objects.filter(tournament=tournament, user=user).exists():
        return Response(
            {'error': 'Ya estás inscrito en este torneo'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Verificar si el torneo ya comenzó
    if tournament.status != 'pending':
        return Response(
            {'error': 'No puedes inscribirte en un torneo que ya comenzó'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Crear la inscripción
    TournamentParticipant.objects.create(tournament=tournament, user=user)
    
    return Response(
        {'message': 'Te has inscrito exitosamente en el torneo'},
        status=status.HTTP_201_CREATED
    )

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def leave_tournament(request, tournament_id):
    """
    Salir de un torneo
    """
    tournament = get_object_or_404(Tournament, id=tournament_id)
    user = request.user
    
    # Verificar si el torneo ya comenzó
    if tournament.status != 'pending':
        return Response(
            {'error': 'No puedes salir de un torneo que ya comenzó'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Buscar y eliminar la inscripción
    try:
        participant = TournamentParticipant.objects.get(tournament=tournament, user=user)
        participant.delete()
        return Response(
            {'message': 'Has salido del torneo exitosamente'},
            status=status.HTTP_200_OK
        )
    except TournamentParticipant.DoesNotExist:
        return Response(
            {'error': 'No estás inscrito en este torneo'},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
@permission_classes([AllowAny])
def tournament_matches(request, tournament_id):
    """
    Obtener todas las partidas de un torneo
    """
    tournament = get_object_or_404(Tournament, id=tournament_id)
    matches = Match.objects.filter(tournament=tournament)
    serializer = MatchSerializer(matches, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tournament_participants(request, tournament_id):
    """
    Obtiene todos los participantes de un torneo con sus puntos
    """
    try:
        tournament = get_object_or_404(Tournament, id=tournament_id)
        
        participants_data = []
        tournament_participants = TournamentParticipant.objects.filter(
            tournament=tournament
        ).select_related('user')  # 👈 corregido aquí
        
        for tp in tournament_participants:
            participant_info = {
                'id': tp.user.id,
                'username': tp.user.username,
                'email': tp.user.email,
                'elo': getattr(tp.user, 'elo', 1200),  # si tu modelo User tiene elo
                'points': 0,  # aún no tenés campo 'points' en el modelo
                'wins': 0,
                'losses': 0,
                'draws': 0,
                'joined_at': tp.joined_at
            }
            participants_data.append(participant_info)
        
        # Ordenar por puntos (descendente)
        participants_data.sort(key=lambda x: x['points'], reverse=True)
        
        return Response({
            'tournament_id': tournament_id,
            'tournament_name': tournament.name,
            'total_participants': len(participants_data),
            'participants': participants_data
        }, status=status.HTTP_200_OK)
        
    except Tournament.DoesNotExist:
        return Response(
            {'error': 'Tournament not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response(
            {'error': f'An error occurred: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
