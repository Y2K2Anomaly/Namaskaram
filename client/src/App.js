import React from "react";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Profile from "./pages/profile/Profile";
import Messenger from "./pages/messenger/Messenger";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {

  const { user } = useContext(AuthContext);

  return (
    <>
      <Router>
        <Routes>

          <Route path={user ? "/:username" : "/"} element={user ? <Home /> : <Register />} />

          <Route path="/login" element={
            user ? <Navigate to={"/" + user?.username} /> : <Login />
          } />

          <Route path="/register" element={user ? <Navigate to={"/" + user?.username} /> : <Register />} />

          <Route path="/messenger" element={!user ? <Navigate to="/" /> : <Messenger />} />

          <Route path="/profile/:username" element={<Profile />} />

        </Routes>
      </Router>
    </>
  )
}

export default App;
