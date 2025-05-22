import React, { useState } from 'react';
import './TournamentForm.css';

const TournamentForm = () => {
    const [tournamentName, setTournamentName] = useState('');
    const [description, setDescription] = useState('');
    const [mode, setMode] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [players, setPlayers] = useState(16);
    const [prize, setPrize] = useState('5000 PTS');

    const handleCreate = () => {
        console.log('Torneo creado:', { tournamentName, description, mode, startDate, startTime, players, prize });
    };

    return (

        <section className="tournament-form">
            <h2>CREAR TORNEO</h2>
            <div className="form-group">
                <label>NOMBRE TORNEO</label>
                <input
                    type="text"
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>DESCRIPCIÓN</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
            </div>
            <div className="form-group">
                <label>MODO</label>
                <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                >
                    <option value="">Seleccionar</option>
                    <option value="modo-1">Modo 1</option>
                    <option value="modo-2">Modo 2</option>
                </select>
            </div>
            <div className="form-group">
                <label>FECHA INICIO</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>HORA INICIO</label>
                <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>JUGADORES</label>
                <input
                    type="number"
                    value={players}
                    onChange={(e) => setPlayers(parseInt(e.target.value, 10))}
                />
            </div>
            <div className="form-group">
                <label>PREMIO</label>
                <input
                    type="text"
                    value={prize}
                    onChange={(e) => setPrize(e.target.value)}
                />
            </div>
            <div className="button-group">
                <button onClick={() => console.log('Cancelado')}>CANCELAR</button>
                <button onClick={handleCreate} className="create-button">CREAR</button>
            </div>
        </section>
    );
};

export default TournamentForm;
