import "./styles/global.css";

import { MenuItem } from "./components/MenuItem";

export const App: React.FC = () => {
  return (
    <div className="menu">
      <div className="menu-img">
        <img src="bg.jpg" alt="" />
      </div>

      <ul className="menu-wrapper">
        <MenuItem category="Cinema" name="La Strada Nacosta" />
        <MenuItem category="Advertising" name="Echoes in Motion" />
        <MenuItem category="Videoclip" name="Hyperspace" />
        <MenuItem category="Cinema" name="Onda Silenziosa" />
        <MenuItem category="Media" name="Nexus" />
        <MenuItem category="Workshop" name="Between Lines" />
        <MenuItem category="Media Kit" name="The Enigma" />
        <MenuItem category="Cinema" name="Le Stelle Cadenti" />
        <MenuItem category="Videoclip" name="Quantum Pulse" />
        <MenuItem category="Advertising" name="Neon Flow" />
      </ul>
    </div>
  );
};

App.displayName = "App";
