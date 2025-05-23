import "./App.css";
import RegisterForm from "./pages/RegisterForm/RegisterForm";
import TournamentForm from "./pages/TournamentForm/TournamentForm";
import Home from "./pages/Home/Home";
import LoginForm from "./pages/Login/LoginForm";
import { Route, BrowserRouter, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/tournament" element={<TournamentForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;