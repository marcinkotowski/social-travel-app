import React, { useContext } from "react";
import "./toggle.scss";
import { MdDarkMode, MdWbSunny } from "react-icons/md";
import { DarkModeContext } from "../../context/DarkModeContext";

const Toggle = () => {
  const { darkMode, toggleTheme } = useContext(DarkModeContext);

  return (
    <div className="absolute">
      <label className="toggle">
        <input type="checkbox" onChange={toggleTheme} checked={darkMode} />
        <span className="slider">
          {darkMode ? (
            <span className="moon">
              <MdDarkMode />
            </span>
          ) : (
            <span className="sun">
              <MdWbSunny />
            </span>
          )}
        </span>
      </label>
    </div>
  );
};

export default Toggle;
