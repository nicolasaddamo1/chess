# Guía de Configuración - Backend Django Chess Tournaments

## Pasos para configurar el proyecto

### 1. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 2. Configurar variables de entorno
- Copia `.env.example` a `.env`
- Configura tus variables de base de datos PostgreSQL

### 3. Configurar PostgreSQL
```sql
-- Conectarse a PostgreSQL y crear la base de datos
CREATE DATABASE chess_tournaments;
CREATE USER tu_usuario WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE chess_tournaments TO tu_usuario;
```

### 4. Ejecutar migraciones
```bash
python manage.py makemigrations users
python manage.py makemigrations tournaments  
python manage.py makemigrations matches
python manage.py migrate
```

### 5. Crear superusuario
```bash
python manage.py createsuperuser
```

### 6. Ejecutar servidor
```bash
python manage.py runserver
```

## Endpoints disponibles

### Autenticación (`/api/auth/`)
- `POST /api/auth/register/` - Registro de usuario
- `POST /api/auth/login/` - Login de usuario
- `GET /api/auth/profile/` - Obtener perfil del usuario
- `PUT /api/auth/profile/update/` - Actualizar perfil
- `POST /api/auth/token/refresh/` - Refrescar token JWT

### Torneos (`/api/tournaments/`)
- `GET /api/tournaments/` - Listar torneos
- `POST /api/tournaments/` - Crear torneo
- `GET /api/tournaments/{id}/` - Detalle de torneo
- `POST /api/tournaments/{id}/join/` - Inscribirse en torneo
- `DELETE /api/tournaments/{id}/leave/` - Salir de torneo
- `GET /api/tournaments/{id}/matches/` - Partidas del torneo

### Partidas (`/api/matches/`)
- `GET /api/matches/` - Listar partidas
- `POST /api/matches/` - Crear partida
- `GET /api/matches/{id}/` - Detalle de partida
- `PUT /api/matches/{id}/` - Actualizar partida
- `GET /api/matches/my-matches/` - Mis partidas
- `POST /api/matches/{id}/start/` - Iniciar partida
- `POST /api/matches/{id}/finish/` - Finalizar partida

## Estructura del proyecto

```
backend/
├── back/                   # Configuración principal de Django
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── users/                  # App de usuarios
│   ├── models.py          # Modelo CustomUser
│   ├── serializers.py     # Serializadores JWT
│   ├── views.py           # Vistas de autenticación
│   └── urls.py
├── tournaments/           # App de torneos
│   ├── models.py          # Modelos Tournament, TournamentParticipant
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
└── matches/               # App de partidas
    ├── models.py          # Modelo Match
    ├── serializers.py
    ├── views.py
    └── urls.py
```

## Características implementadas

✅ **Autenticación JWT completa**
- Registro con email/password
- Login con tokens JWT
- Refresh tokens
- Perfil de usuario

✅ **Gestión de Usuarios**
- Modelo customizado con UUID, ELO y puntaje
- Campos: nombre, apellido, username, email

✅ **Gestión de Torneos**
- CRUD completo de torneos
- Inscripción/desinscripción
- Estados: pendiente, en curso, finalizado
- Límite de participantes

✅ **Gestión de Partidas**
- CRUD de partidas
- Estados y resultados
- Vinculación con torneos
- Tracking de tiempo

✅ **Base de datos PostgreSQL**
- Modelos con UUIDs
- Relaciones correctas
- Migraciones incluidas

## Ejemplo de uso con curl

### Registro
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jugador1",
    "email": "jugador1@email.com",
    "first_name": "Juan",
    "last_name": "Pérez", 
    "password": "password123",
    "password_confirm": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jugador1@email.com",
    "password": "password123"
  }'
```

### Crear Torneo (requiere token)
```bash
curl -X POST http://localhost:8000/api/tournaments/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_ACCESS_TOKEN" \
  -d '{
    "name": "Torneo de Primavera",
    "start_date": "2025-06-01",
    "start_time": "10:00:00",
    "mode": "rapid",
    "prize": 1000.00,
    "description": "Torneo de ajedrez rápido",
    "max_players": 16
  }'
```