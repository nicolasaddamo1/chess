import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.body.classList.add("#root");

    return () => {
      document.body.classList.remove("#root");
    };
  }, []);
  return (
    <div className="diamond">
      <div className="diamond-img">
        <img src="background.png" alt="" />
      </div>

      <div className="container">
        <div className="logo">
          <h1>LOGO EMPRESA</h1>
        </div>
        <div className="lorem">
          <p className="description">
            A new way to play the consecrated game of chess. A decentralized
            platform for everyone who wants to earn money playing the most
            beloved game in the history of mankind. Scholarships, tournaments,
            chip system, ratings, integrated rapido or blitz chess mode and much
            more in the future. A new way to play the consecrated game of chess.
            A decentralized platform for everyone who wants to earn money
            playing the most beloved game in the history of mankind.
            Scholarships, tournaments, chip system, ratings, integrated rapido
            or blitz chess mode and much more in the future. more in the future.
            aca
          </p>
        </div>
        <div className="buttons">
          <div className="buttons-login-register">
            <button className="login" onClick={() => navigate("/login")}>LOGIN</button>
            <button className="register" onClick={() => navigate("/register")}>REGISTER</button>
          </div>
          <div className="footer">
            <a href="#" className="link">
              TÉRMINOS Y CONDIC
            </a>
            <a href="#" className="link">
              MANUAL DE USUARIO
            </a>
            <a
              href="#"
              className="link"
              style={{ fontSize: "18px", padding: "3px" }}
            >
              F.A.Qs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
