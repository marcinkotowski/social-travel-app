import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  Navigate,
  ScrollRestoration,
} from "react-router-dom";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import Sidebar from "./components/sidebar/Sidebar.jsx";
import Rightbar from "./components/rightbar/Rightbar.jsx";
import Home from "./pages/home/Home.jsx";
import Explore from "./pages/explore/Explore.jsx";
import Saved from "./pages/saved/Saved.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Toggle from "./components/toggle/Toggle.jsx";
// import Pin from "./pages/pin/Pin.jsx";
import { React, useContext } from "react";
import { DarkModeContext } from "./context/DarkModeContext.jsx";
import { AuthContext } from "./context/authContext.jsx";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

function App() {
  const { currentUser } = useContext(AuthContext);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div style={{ display: "flex" }}>
          <Sidebar />
          <Outlet />
          <Rightbar />
          <Toggle />
          <ScrollRestoration />
        </div>
      </QueryClientProvider>
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
    // {
    //   path: "/create",
    //   element: <Create />,
    // },
  ]);

  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className="App" id={darkMode ? "dark" : "light"}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
