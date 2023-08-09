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

          <Route path="/" element={user ? <Navigate to={"/" + user?.username + "/timeline"} /> : <Register />} />
          <Route path="/:username/timeline" element={user ? <Home /> : <Navigate to={"/"} />} />

          <Route path="/login" element={
            user ? <Navigate to={"/" + user?.username + "/timeline"} /> : <Login />
          } />

          <Route path="/register" element={user ? <Navigate to={"/" + user?.username + "/timeline"} /> : <Register />} />

          <Route path="/messenger" element={!user ? <Navigate to="/" /> : <Messenger />} />

          <Route path="/profile/:username" element={<Profile />} />

        </Routes>
      </Router>
    </>
  )
}

export default App;
