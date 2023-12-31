import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import './App.css'
import Admin from "./pages/adminPanel/Admin";


function App() {

  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route exact path="/" element={user ? <Home /> : <Login />} ></Route>
      <Route exact path="/login" element={<Login />} ></Route>
      <Route exact path="/register" element={<Register />} ></Route>
      <Route exact path="/profile/:username" element={<Profile />} ></Route>
      <Route exact path="/admin" element={ user?.isAdmin ? <Admin />: <Navigate to={"/"} />} ></Route>
    </Routes>
  );
}

export default App;
