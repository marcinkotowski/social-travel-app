import React from "react";
import ReactDOM from "react-dom/client";
import "./main.scss";
import App from "./App";
import { DarkModeContextProvider } from "./context/DarkModeContext.jsx";
import { AuthContextProvider } from "./context/authContext.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <DarkModeContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </DarkModeContextProvider>
  </React.StrictMode>
);
