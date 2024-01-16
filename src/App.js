import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import './App.css'
import Admin from "./pages/adminPanel/Admin";
import Feed from "./components/feed/Feed";
import WeatherApp from "./components/getlocation/WeatherApp";
import Messenger from "./pages/messenger/Messenger";
import axios from "axios";


function App() {
  const { user } = useContext(AuthContext);
  let history = useNavigate();
  useEffect(() => {
    const getUser = async () => {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get("https://sociosync.onrender.com/api/auth/login/success",
          {
            withCredentials: true,    
          });
        console.log(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        history("/");

      } catch (error) {
        console.log("Authentication failed")
      }
    }
    getUser();
  }, [])



  return (
    <Routes>
      <Route exact path="/" element={user ? <Home /> : <Login />} ></Route>
      <Route exact path="/login" element={<Login />} ></Route>
      <Route exact path="/feed" element={<Feed />} ></Route>
      <Route exact path="/register" element={<Register />} ></Route>
      <Route exact path="/profile/:username" element={<Profile />} ></Route>
      <Route exact path="/admin" element={user?.isAdmin ? <Admin /> : <Navigate to={"/"} />} ></Route>
      <Route exact path="/messenger" element={user ? <Messenger /> : <Navigate to={"/"} />} ></Route>
    </Routes>
  );
}

export default App;
