import React, { useState } from "react";
import "./RegisterForm.css";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [acceptTerms, setAcceptTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowPasswordConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.username ||
      !formData.email || !formData.password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const dataToSend = {
        username: formData.username,
        password: formData.password,
        password_confirm: formData.passwordConfirm,
        email: formData.email,
        elo: 2000,
        first_name: formData.firstName,
        last_name: formData.lastName
      };

      const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Registro exitoso:", result);
        alert("Registro exitoso!");

        setFormData({
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          password: "",
          passwordConfirm: "",
        });
        setAcceptTerms(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error en el registro");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="logo">
          <img src="ajedrez1.png" alt="" />
        </div>

        <div className="input-field">
          <label>NOMBRE</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="input-field">
          <label>APELLIDO</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="input-field">
          <label>NOMBRE DE USUARIO</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="input-field">
          <label>EMAIL</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="input-field">
          <label>CONTRASEÑA</label>
          <div className="eye-password">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <img
              src="eye-pass-logo.png"
              alt=""
              onClick={handleShowPassword}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>

        <div className="input-field">
          <label>REPETIR CONTRASEÑA</label>
          <div className="eye-password">
            <input
              type={showPasswordConfirm ? "text" : "password"}
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleInputChange}
              required
            />
            <img
              src="eye-pass-logo.png"
              alt=""
              onClick={handleShowPasswordConfirm}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>

        <div className="terms">
          <label>
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              required
            />
            LEÍ Y ACEPTO LOS TÉRMINOS Y CONDICIONES
          </label>
        </div>

        {error && <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

        <div className="btn-container">
          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "ENVIANDO..." : "SUBMIT"}
          </button>
          <button type="button" className="submit-terms">TERMINOS Y CONDIC</button>
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

export default RegisterForm;