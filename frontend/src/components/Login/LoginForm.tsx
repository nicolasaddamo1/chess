import React, { useState } from "react";
import "./LoginForm.css";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para manejar la autenticación.
  };

  return (
    <div className="form-container">
      <div className="logo">
        <img src="ajedrez1.png" alt="" />
      </div>

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
              onClick={() => {
                setShowPassword(!showPassword),
                  showPassword ? "text" : "password";
              }}
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
