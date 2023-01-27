import {
  Outlet,
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { AuthContext } from "../context/authContext.js";
import { useContext } from "react";
import { ScrollRestoration } from "react-router-dom";
import Login from "../pages/login/Login.jsx";
import Register from "../pages/register/Register.jsx";
import Sidebar from "../components/sidebar/Sidebar.jsx";
import Rightbar from "../components/rightbar/Rightbar.jsx";
import Home from "../pages/home/Home.jsx";
import Explore from "../pages/explore/Explore.jsx";
import Saved from "../pages/saved/Saved.jsx";
import Profile from "../pages/profile/Profile.jsx";
import Toggle from "../components/toggle/Toggle.jsx";

const Router = () => {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };
  // PROTECTED COMPONENTS THE PATH, WHICH NO SHOW IF THE USER IS NOT LOGGED IN

  const Layout = () => {
    return (
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Outlet />
        <Rightbar />
        <Toggle />
        <ScrollRestoration />
      </div>
    );
  };

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

  return <RouterProvider router={router} />;
};

export default Router;
