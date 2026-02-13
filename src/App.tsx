import "./App.css";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { NavLink, Route, Routes } from "react-router-dom";

import About from "./Pages/About/About";
import GameTracker from "./Pages/GameTracker/GameTracker";
import CardList from "./Pages/CardList/CardList";

const appWindow = await getCurrentWindow();
await appWindow.maximize();

const App: React.FC = () => {
  return (
    <main style={{ margin: "2rem" }}>
      <nav className="app-nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          end
        >
          Card Search
        </NavLink>
        <span className="nav-separator">|</span>
        <NavLink 
          to="/gametracker" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          Game Tracker
        </NavLink>
        <span className="nav-separator">|</span>
        <NavLink 
          to="/about" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          About
        </NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<CardList />} />
        <Route path="/gametracker" element={<GameTracker />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </main>
  );
};

export default App;
