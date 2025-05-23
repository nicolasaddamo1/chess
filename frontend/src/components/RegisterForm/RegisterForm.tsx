import React, { useState } from "react";
import "./RegisterForm.css";
const RegisterForm: React.FC = () => {
  const [password, setPassword] = useState("password");
  const handleShowPassword = () => {
    setPassword((password) => (password === "password" ? "text" : "password"));
  };

  const [password2, setPassword2] = useState("password");
  const handleShowPassword2 = () => {
    setPassword2((password2) =>
      password2 === "password" ? "text" : "password"
    );
  };

  return (
    <div className="form-container">
      <div className="logo">
        <img src="ajedrez1.png" alt="" />
      </div>

      <div className="input-field">
        <label>NOMBRE</label>
        <input type="text" />
      </div>

      <div className="input-field">
        <label>APELLIDO</label>
        <input type="text" />
      </div>

      <div className="input-field">
        <label>NOMBRE DE USUARIO</label>
        <input type="text" />
      </div>

      <div className="input-field">
        <label>EMAIL</label>
        <input type="email" />
      </div>

      <div className="input-field">
        <label>CONTRASEÑA</label>
        <div className="eye-password">
          <input type={password} />

          <img src="eye-pass-logo.png" alt="" onClick={handleShowPassword} />
        </div>
      </div>

      <div className="input-field">
        <label>REPETIR CONTRASEÑA</label>
        <div className="eye-password">
          <input type={password2} />

          <img src="eye-pass-logo.png" alt="" onClick={handleShowPassword2} />
        </div>
      </div>

      <div className="terms">LEÍ Y ACEPTO LOS TÉRMINOS Y CONDICIONES</div>
      <div className="btn-container">
        <button className="submit-btn">SUBMIT</button>
        <button className="submit-terms">TERMINOS Y CONDIC</button>
      </div>

      <div className="links">
        <span>
          YA TENÉS CUENTA? <a href="#">INICIÁ SESIÓN</a>
        </span>

        <span>
          OLVIDASTE TU CONTRASEÑA? <a href="#">RESETEALA</a>
        </span>
      </div>
    </div>
  );
};

export default RegisterForm;
