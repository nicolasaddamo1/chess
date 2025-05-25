import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TournamentModalForm from './TournamentModalForm';
import './Torneos.css';

// Definición de tipos
type Premios = {
    primerPuesto: number;
    segundoPuesto: number;
};

type Torneo = {
    id: number;
    nombre: string;
    fechaInicio: string;
    modo: string;
    premios: Premios;
};

type Encuentro = {
    jugador1: string;
    jugador2: string;
    estado: string;
};

type TorneoDetalle = {
    id: number;
    nombre: string;
    participantes: string[];
    puntos: number;
    encuentros: Encuentro[];
    logoEmpresa: string;
};

type VistaTorneo = 'empty' | 'list' | 'detail';

const TournamentForm: React.FC = () => {
    const [view, setView] = useState<VistaTorneo>('list');
    const [torneos, setTorneos] = useState<Torneo[]>([]);
    const [selectedTorneo, setSelectedTorneo] = useState<TorneoDetalle | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const navigate = useNavigate();

    // Fetch para obtener lista de torneos
    useEffect(() => {
        const fetchTorneos = async () => {
            try {
                const response = await fetch('/api/torneos');
                const data: Torneo[] = await response.json();

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

    // Handler para ver detalles de un torneo
    const handleViewTorneo = async (torneoId: number) => {
        try {
            const response = await fetch(`/api/torneos/${torneoId}`);
            const data: TorneoDetalle = await response.json();

            setSelectedTorneo(data);
            setView('detail');
        } catch (error) {
            console.error('Error fetching torneo details:', error);
        }
    };

    // Handler para crear nuevo torneo
    const handleSubmitTournament = async (tournamentData: {
        name: string;
        start_date: string;
        start_time: string;
        mode: string;
        max_players: number;
    }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/api/tournaments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(tournamentData)
            });

            if (!response.ok) throw new Error('Error al crear torneo');

            const data = await response.json();
            setTorneos([...torneos, data]);
            setView('list');
        } catch (error) {
            throw error; // Re-lanzamos el error para manejarlo en el modal
        }
    };

    // Handler para volver atrás
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

    return (
        <div className="torneos-container">
            {/* Header con botón de volver */}
            <header className="torneos-header">
                <button onClick={handleBack} className="back-button">
                    ←
                </button>
                <button>🐞</button>
                <button>ℹ</button>
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
                                <h3>{torneo.nombre}</h3>
                                <div className="torneo-info">
                                    <p><strong>FECHA DE INICIO:</strong> {torneo.fechaInicio}</p>
                                    <p><strong>MODO:</strong> {torneo.modo}</p>
                                    <p><strong>PREMIOS:</strong></p>
                                    <ul>
                                        <li>1er puesto: {torneo.premios.primerPuesto} pts</li>
                                        <li>2do puesto: {torneo.premios.segundoPuesto} pts</li>
                                    </ul>
                                </div>
                                <div className="torneo-actions">
                                    <button className="view-button">👁️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {view === 'detail' && selectedTorneo && (
                    <div className="torneo-detail">
                        <section className="participants-section">
                            <h2>PARTICIPANTES</h2>
                            <ul>
                                {selectedTorneo.participantes.map((participante, index) => (
                                    <li key={index}>{participante}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="points-section">
                            <h2>PUNTOS</h2>
                            <p>{selectedTorneo.puntos}</p>
                        </section>

                        <section className="matches-section">
                            <h2>ENCUENTROS EN PROGRESO</h2>
                            {selectedTorneo.encuentros.map((encuentro, index) => (
                                <div key={index} className="match">
                                    <span>{encuentro.jugador1}</span>
                                    <span>VS</span>
                                    <span>{encuentro.jugador2}</span>
                                </div>
                            ))}
                        </section>

                        <section className="logo-section">
                            <h2>LOGO EMPRESA</h2>
                            <img src={selectedTorneo.logoEmpresa} alt="Logo empresa" />
                        </section>
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