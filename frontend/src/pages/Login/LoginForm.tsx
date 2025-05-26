import React, { useState } from "react";
import "./LoginForm.css";

// Para Vite, las variables de entorno deben comenzar con VITE_
const API_URL = import.meta.env.VITE_URL || "http://localhost:8000";
console.log("API URL:", API_URL);

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error en el login");
      }

      const data = await response.json();
      localStorage.setItem("authToken", data.tokens.access);
      localStorage.setItem("refreshToken", data.tokens.refresh);
      console.log("Token Data:", data);

      return data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const userData = await loginUser(email, password);
      console.log("Login exitoso:", userData);
      window.location.href = "/tournament";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  return (
    <div className="form-container">
      <div className="logo">
        <img src="ajedrez1.png" alt="" />
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="container-input">
          <label>EMAIL</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="container-input">
          <br />
          <label>CONTRASEÑA</label>
          <div className="container-pasword-img">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "80%" }}
            />
            <img
              src="eye-pass-logo.png"
              alt=""
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>
        <div className="container-buttons">
          <button type="submit" className="btn-gray">
            SUBMIT
          </button>
          <button className="btn-red" type="button">
            TERMINOS Y CONDIC
          </button>
        </div>

        <div className="links">
          <span>
            YA TENÉS CUENTA? <a href="#">INICIÁ SESIÓN</a>
          </span>
          <span>
            OLVIDASTE TU CONTRASEÑA? <a href="#">RESETEALA</a>
          </span>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;