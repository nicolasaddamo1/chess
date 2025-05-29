import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TournamentModalForm from "./TournamentModalForm";
import "./Torneos.css";
import "./TournamentModalForm.css";

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
    prize: string;
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
};

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

type VistaTorneo = "empty" | "list" | "detail";

const TournamentForm: React.FC = () => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [participants, setParticipants] = useState<Participant[]>([]);

    const [view, setView] = useState<VistaTorneo>("list");
    const [torneos, setTorneos] = useState<Torneo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add("#root");

        return () => {
            document.body.classList.remove("#root");
        };
    }, []);

    useEffect(() => {
        const fetchMatches = async (torneoId: string) => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/matches/tournament/${torneoId}/`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Match data:", data);
                console.log("Matches array:", data.matches);
                setMatches(data.matches || []);
            } catch (error) {
                console.error("Error fetching matches:", error);
            }
        };

        const fetchTorneos = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                navigate("/login");
                return;
            }
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/tournaments/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data: Torneo[] = await response.json();
                console.log("Torneos:", data);

                if (data.length === 0) {
                    setView("empty");
                } else {
                    setTorneos(data);
                    setView("list");
                }
            } catch (error) {
                console.error("Error fetching torneos:", error);
                setView("empty");
            } finally {
                setLoading(false);
            }
        };
        fetchTorneos();
        fetchMatches("ba95cbe0-2a63-4ae3-81d7-ba7879a7eba8");
    }, []);

    const handleViewTorneo = async (torneoId: string) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/matches/tournament/${torneoId}/`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            console.log("Match data:", data);
            console.log("Matches array:", data.matches);

            setMatches(data.matches || []);
        } catch (error) {
            console.error("Error fetching matches:", error);
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
                body: JSON.stringify(tournamentData),
            });

            if (!response.ok) throw new Error("Error al crear torneo");

            const data = await response.json();
            setTorneos([...torneos, data]);
            setView("list");
        } catch (error) {
            throw error;
        }
    };

    const handleBack = () => {
        if (view === "detail") {
            setView("list");
        } else {
            navigate("/");
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }
    const handleParticipats = async (torneoId: string) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/tournaments/${torneoId}/participants/`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Participants data:", data);
            setParticipants(data.participants || []);
        } catch (error) {
            console.error("Error fetching participants:", error);
        }
    };




    return (
        <div className="torneos-container" style={{ width: "100%" }}>
            {/* Header con botón de volver */}
            <header className="torneos-header">
                <div className="header-1">
                    <button onClick={handleBack} className="back-button">
                        <img src="tournament-arrow-back.png" alt="" />
                    </button>
                </div>
                <div className="header-2">
                    <button>
                        <img src="tournament-bug.png" alt="" />
                    </button>
                    <button
                        onClick={() => {
                            if (view !== "list") {
                                setView("list");
                            } else {
                                setView("empty");
                            }
                        }}
                    >
                        <img src="tournament-i.png" alt="" />
                    </button>
                    <button>
                        <img src="tournament-list.png" alt="" />
                    </button>
                    <button>
                        <img src="tournament-settings.png" alt="" />
                    </button>
                </div>
            </header>

            {/* Contenido principal según la vista */}
            <main className="torneos-main">
                {view === "empty" && (
                    <div className="empty-state">
                        <p>No hay torneos disponibles</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="create-button"
                            style={{
                                backgroundColor: "rgb(249, 225, 151) ",
                                color: "rgb(224, 48, 86)",
                            }}
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
                {view === "list" && (
                    <div className="torneos-list">
                        {/* Cabecera */}
                        <div className="torneo-header">
                            <div className="header-item"><strong>NOMBRE</strong></div>
                            <div className="header-item"><strong>FECHA INICIO</strong></div>
                            <div className="header-item"><strong>MODO</strong></div>
                            <div className="header-item"><strong>1er PREMIO</strong></div>
                            <div className="header-item"><strong>ACCIÓN</strong></div>
                        </div>

                        {/* Lista de torneos */}
                        {torneos.map((torneo) => (
                            <div
                                key={torneo.id}
                                className="torneo-card"
                                onClick={() => handleViewTorneo(torneo.id)}
                            >
                                <div className="torneo-row">
                                    <div className="torneo-item"><strong>{torneo.name}</strong></div>
                                    <div className="torneo-item">{torneo.start_date}</div>
                                    <div className="torneo-item">{torneo.mode}</div>
                                    <div className="torneo-item">{torneo.prize} pts</div>
                                    <div className="torneo-item">
                                        <button
                                            className="view-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setView(view === "list" ? "detail" : "list");
                                                handleParticipats(torneo.id);
                                            }}
                                        >
                                            👁️ Ver
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {view === "detail" && (
                    <div className="torneos-detail">
                        {/* Sección de Participantes */}
                        <div className="section">
                            <h3>Participantes del Torneo</h3>
                            <div className="table-grid">
                                <div className="table-header">
                                    <div className="header-item"><strong>NOMBRE</strong></div>
                                    <div className="header-item"><strong>ELO</strong></div>
                                    <div className="header-item"><strong>PUNTOS</strong></div>
                                </div>

                                {participants.map((participant) => (
                                    <div key={participant.id} className="table-row">
                                        <div className="table-item">{participant.username}</div>
                                        <div className="table-item">{participant.elo}</div>
                                        <div className="table-item">{participant.points}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sección de Partidas */}
                        <div className="section">
                            <h3>Partidas del Torneo</h3>
                            <div className="table-grid">
                                <div className="table-header">
                                    <div className="header-item wide"><strong>PARTIDA</strong></div>
                                    <div className="header-item"><strong>ESTADO</strong></div>
                                </div>

                                {matches.map((match) => (
                                    <div key={match.id} className="table-row">
                                        <div className="table-item wide">
                                            {match.white_player.username} vs {match.black_player.username}
                                        </div>
                                        <div className="table-item">
                                            {match.status === "in_progress" ? "En progreso" : "Finalizada"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer con botones */}
            <footer className="torneos-footer">
                <div className="footer-1">
                    <img src="eye-pass-logo.png" alt="" />
                    <img src="tournament-cup.png" alt="" />
                </div>
                <div className="footer-2">
                    <img
                        src="tournament-hands.png
          "
                        alt=""
                    />
                    <img src="tournament-z.png" alt="" />
                    <img src="tournament-carrito.png" alt="" />
                </div>
            </footer>
        </div>
    );
};

export default TournamentForm;
