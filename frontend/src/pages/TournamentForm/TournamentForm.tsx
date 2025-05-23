import React, { useState } from "react";
import { useEffect } from "react";
import "./TournamentForm.css";

const TournamentForm = () => {
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

  const handleCreate = () => {
    console.log("Torneo creado:", {
      tournamentName,
      description,
      mode,
      startDate,
      startTime,
      players,
      prize,
    });
  };

  return (
    <section className="tournament-form">
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
        <button onClick={handleCreate} className="create-button">
          CREAR
        </button>
        <button id="btn-cancelar" onClick={() => console.log("Cancelado")}>
          CANCELAR
        </button>
      </div>
    </section>
  );
};

export default TournamentForm;
