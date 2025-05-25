import React, { useState } from "react";
import { useEffect } from "react";
import "./TournamentModalForm.css";
type TournamentModalFormProps = {
  onClose: () => void;
  onSubmit: (tournamentData: {
    name: string;
    start_date: string;
    start_time: string;
    mode: string;
    max_players: number;
  }) => Promise<void>; // Cambio aquí
};
const TournamentModalForm = ({ onClose, onSubmit }: TournamentModalFormProps) => {
  const [tournamentName, setTournamentName] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [players, setPlayers] = useState(16);
  const [prize, setPrize] = useState("5000 PTS");
  useEffect(() => {
    document.body.classList.add("#root");

    return () => {
      document.body.classList.remove("#root");
    };
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const tournamentData = {
        name: tournamentName,
        start_date: startDate,
        start_time: startTime,
        mode: mode.toLowerCase(),
        max_players: players,
      };

      const response = await fetch(`${import.meta.env.VITE_URL}/api/tournaments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tournamentData)
      });

      if (!response.ok) {
        throw new Error('Error al crear torneo');
      }

      const data = await response.json();
      console.log('Torneo creado:', data);

      onClose();

    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form className="tournament-form" onSubmit={handleCreate}>
      <h2>CREAR TORNEO</h2>
      <div className="form-group1">
        <input type="text" id="nombre-torneo" placeholder="NOMBRE TORNEO" />
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="">MODO</option>
          <option value="modo-1">Modo 1</option>
          <option value="modo-2">Modo 2</option>
        </select>
      </div>
      <div className="form-group2">
        <input type="text" id="description" placeholder="DESCRIPCIÓN" />

        <div className="form-group2-2">
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
        </div>
      </div>

      <div className="button-group">
        <button type="submit" className="create-button">
          CREAR
        </button>
        <button id="btn-cancelar" onClick={() => console.log("Cancelado")}>
          CANCELAR
        </button>
      </div>
    </form>
  );
};

export default TournamentModalForm;
