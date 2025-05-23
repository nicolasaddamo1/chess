from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Match
from .serializers import MatchSerializer, MatchCreateSerializer, MatchUpdateSerializer
from django.db import models

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def match_list_create(request):
    """
    GET: Listar todas las partidas
    POST: Crear nueva partida
    """
    if request.method == 'GET':
        matches = Match.objects.all()
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = MatchCreateSerializer(data=request.data)
        if serializer.is_valid():
            match = serializer.save()
            return Response(
                MatchSerializer(match).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def match_detail(request, match_id):
    """
    GET: Obtener detalles de una partida
    PUT: Actualizar partida
    DELETE: Eliminar partida
    """
    match = get_object_or_404(Match, id=match_id)
    
    if request.method == 'GET':
        serializer = MatchSerializer(match)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = MatchUpdateSerializer(match, data=request.data, partial=True)
        if serializer.is_valid():
            # Si se está iniciando la partida, establecer started_at
            if serializer.validated_data.get('status') == 'in_progress' and not match.started_at:
                serializer.validated_data['started_at'] = timezone.now()
            
            # Si se está finalizando la partida, establecer finished_at
            if serializer.validated_data.get('status') == 'finished' and not match.finished_at:
                serializer.validated_data['finished_at'] = timezone.now()
            
            match = serializer.save()
            return Response(MatchSerializer(match).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        match.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_matches(request):
    """
    Obtener todas las partidas del usuario autenticado
    """
    user = request.user
    matches = Match.objects.filter(
        models.Q(white_player=user) | models.Q(black_player=user)
    )
    serializer = MatchSerializer(matches, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_match(request, match_id):
    """
    Iniciar una partida
    """
    match = get_object_or_404(Match, id=match_id)
    
    # Verificar que el usuario sea uno de los jugadores
    if request.user not in [match.white_player, match.black_player]:
        return Response(
            {'error': 'No tienes permiso para iniciar esta partida'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Verificar que la partida esté pendiente
    if match.status != 'pending':
        return Response(
            {'error': 'La partida ya ha sido iniciada o finalizada'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    match.status = 'in_progress'
    match.started_at = timezone.now()
    match.save()
    
    return Response(
        {'message': 'Partida iniciada exitosamente'},
        status=status.HTTP_200_OK
    )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def finish_match(request, match_id):
    """
    Finalizar una partida con resultado
    """
    match = get_object_or_404(Match, id=match_id)
    result = request.data.get('result')
    
    # Verificar que el usuario sea uno de los jugadores
    if request.user not in [match.white_player, match.black_player]:
        return Response(
            {'error': 'No tienes permiso para finalizar esta partida'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Verificar que la partida esté en curso
    if match.status != 'in_progress':
        return Response(
            {'error': 'La partida no está en curso'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validar el resultado
    valid_results = ['white_wins', 'black_wins', 'draw']
    if result not in valid_results:
        return Response(
            {'error': 'Resultado inválido'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    match.status = 'finished'
    match.result = result
    match.finished_at = timezone.now()
    match.save()
    
    return Response(
        {'message': 'Partida finalizada exitosamente'},
        status=status.HTTP_200_OK
    )