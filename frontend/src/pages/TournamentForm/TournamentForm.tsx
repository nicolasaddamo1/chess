import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TournamentModalForm from './TournamentModalForm';
import './Torneos.css';
import './TournamentModalForm.css';


const token = localStorage.getItem("authToken");


type Torneo = {
    created_at: string;
    current_participants_count: number;
    description: string;
    id: string;
    is_full: boolean;
    max_players: number;
    mode: string;
    name: string;
    prize: string
    start_date: string;
    start_time: string;
    status: string;
    updated_at: string;


};

type Encuentro = {
    jugador1: string;
    jugador2: string;
    estado: string;
};
type Player = {
    id: string;
    elo: number;
    firts_name: string;
    last_name: string;
    score: number;
    username: string;
    mail: string;
};
type Match = {
    black_player: Player;
    white_player: Player;
    created_at: string;
    finished_at: string;
    id: string;
    moves: string;
    result: string;
    round_number: number;
    started_at: string;
    status: string;
    tournament: Torneo;
    updated_at: string;
    winner: Player | null;

}

type Participant = {
    id: string;
    user: Player;
    tournament: Torneo;
    points: number;
    created_at: string;
    updated_at: string;
    name: string;
    elo: number;
    username: string;
};



type VistaTorneo = 'empty' | 'list' | 'detail';

const TournamentForm: React.FC = () => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [participants, setParticipants] = useState<Participant[]>([]);

    const [view, setView] = useState<VistaTorneo>('list');
    const [torneos, setTorneos] = useState<Torneo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTorneos = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/tournaments/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data: Torneo[] = await response.json();
                console.log("Torneos:", data);

                if (data.length === 0) {
                    setView('empty');
                } else {
                    setTorneos(data);
                    setView('list');
                }
            } catch (error) {
                console.error('Error fetching torneos:', error);
                setView('empty');
            } finally {
                setLoading(false);
            }
        };

        fetchTorneos();
    }, []);

    const handleViewTorneo = async (torneoId: string) => {

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/matches/tournament/${torneoId}/`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            console.log('Match data:', data);
            console.log('Matches array:', data.matches);

            setMatches(data.matches || []);



        } catch (error) {
            console.error('Error fetching matches:', error);
            setMatches([]);
        }


    };

    const handleSubmitTournament = async (tournamentData: {
        name: string;
        start_date: string;
        start_time: string;
        mode: string;
        max_players: number;
    }) => {
        try {
            const response = await fetch(`http://127.0.0/api/tournaments`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(tournamentData)
            });

            if (!response.ok) throw new Error('Error al crear torneo');

            const data = await response.json();
            setTorneos([...torneos, data]);
            setView('list');
        } catch (error) {
            throw error;
        }
    };

    const handleBack = () => {
        if (view === 'detail') {
            setView('list');
        } else {
            navigate('/');
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }
    const handleParticipats = async (torneoId: string) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/tournaments/${torneoId}/participants/`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Participants data:', data);
            setParticipants(data.participants || []);

        }
        catch (error) {
            console.error('Error fetching participants:', error);
        }

    }
    return (
        <div className="torneos-container" style={{ width: "100%" }}>
            {/* Header con botón de volver */}
            <header className="torneos-header">
                <button onClick={handleBack} className="back-button">
                    ←
                </button>
                <button>🐞</button>
                <button onClick={() => {
                    if (view !== 'list') {
                        setView('list')

                    } else { setView('empty') }
                }
                }>ℹ</button>
                <button>📜</button>
                <button>⚙</button>
            </header>

            {/* Contenido principal según la vista */}
            <main className="torneos-main">
                {view === 'empty' && (
                    <div className="empty-state">
                        <p>No hay torneos disponibles</p>
                        <button
                            onClick={() => (setIsModalOpen(true))}
                            className="create-button"
                        >
                            CREAR
                        </button>
                    </div>
                )}
                {isModalOpen && (
                    <div className="modal-overlay">
                        <TournamentModalForm
                            onClose={() => setIsModalOpen(false)}
                            onSubmit={handleSubmitTournament}

                        />
                    </div>
                )}

                {view === 'list' && (
                    <div className="torneos-list">
                        {torneos.map((torneo) => (
                            <div
                                key={torneo.id}
                                className="torneo-card"
                                onClick={() => handleViewTorneo(torneo.id)}
                            >
                                <h3>{torneo.name}</h3>
                                <div className="torneo-info">
                                    <p><strong>FECHA DE INICIO:</strong> {torneo.start_date}</p>
                                    <p><strong>MODO:</strong> {torneo.mode}</p>
                                    <p><strong>PREMIOS:</strong></p>
                                    <ul>
                                        <li>1er puesto: {torneo.prize} pts</li>
                                        <li>2do puesto: {(torneo.prize)} pts</li>
                                    </ul>
                                </div>
                                <div className="torneo-actions">
                                    <button className="view-button" onClick={() => {
                                        setView(view === 'list' ? 'detail' : 'list');
                                        handleParticipats(torneo.id);

                                    }}>👁️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {view === 'detail' && (
                    <div>
                        <div className="torneos-grid">
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>ELO</th>
                                            <th>Puntos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {participants.map((participant) => (
                                            console.log("participant", participant),
                                            <tr key={participant.id}>
                                                <td>{participant.username}</td>
                                                <td>{participant.elo}</td>
                                                <td>{participant.points}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Partida</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {matches.map((match) => (
                                            <tr key={match.id}>
                                                <td>{match.white_player.username} vs {match.black_player.username}</td>
                                                <td>{match.status === 'in_progress' ? 'En progreso' : 'Finalizada'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                )}
            </main>

            {/* Footer con botones */}
            <footer className="torneos-footer">
                <button>🏆</button>
                <button>🤲</button>
                <button>↔</button>
                <button>🛒</button>
            </footer>
        </div>
    );
};

export default TournamentForm;