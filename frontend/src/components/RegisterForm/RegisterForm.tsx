import React from 'react';
import './RegisterForm.css';
const RegisterForm: React.FC = () => {
    return (
        <div className="form-container">
            <div className="logo">LOGO EMPRESA</div>

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
                <input type="password" />
            </div>

            <div className="input-field">
                <label>REPETIR CONTRASEÑA</label>
                <input type="password" />
                <span className="eye-icon">👁️</span>
            </div>

            <div className="terms">
                LEÍ Y ACEPTO LOS TÉRMINOS Y CONDICIONES
            </div>
            <div className='btn-container'>
                <button className="submit-btn">SUBMIT</button>
                <button className="submit-terms">TERMINOS Y CONDICIONES</button>
            </div>

            <div className="links">
                <span>YA TENÉS CUENTA? <a href="#">INICIÁ SESIÓN</a></span>
                <span>OLVIDASTE TU CONTRASEÑA? <a href="#">RESETEALA</a></span>
            </div>
        </div>
    );
};

export default RegisterForm;
