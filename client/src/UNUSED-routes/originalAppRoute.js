import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Login from "./pages/login/Login.jsx.js";
import Register from "./pages/register/Register.jsx.js";
import Sidebar from "./components/sidebar/Sidebar.jsx.js";
import Rightbar from "./components/rightbar/Rightbar.jsx.js";
import Home from "./pages/home/Home.jsx.js";
import Explore from "./pages/explore/Explore.jsx.js";
import Saved from "./pages/saved/Saved.jsx.js";
import Profile from "./pages/profile/Profile.jsx.js";
import Toggle from "./components/toggle/Toggle.jsx.js";
import { React, useContext } from "react";
import { DarkModeContext } from "./context/DarkModeContext.js.js";
import { AuthContext } from "./context/authContext.js.js";

function App() {
  const { currentUser } = useContext(AuthContext);

  const Layout = () => {
    return (
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Outlet />
        <Rightbar />
        <Toggle />
      </div>
    );
  };

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };
  // PROTECTED COMPONENTS THE PATH, WHICH NO SHOW IF THE USER IS NOT LOGGED IN

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/explore",
          element: <Explore />,
        },
        {
          path: "/saved",
          element: (
            <ProtectedRoute>
              <Saved />
            </ProtectedRoute>
          ),
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className="App" id={darkMode ? "dark" : "light"}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
