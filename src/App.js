import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";


function App() {

  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route exact path="/" element={user ? <Home /> : <Register />} ></Route>
      <Route exact path="/login" element={user ? <Navigate to={"/"} />: <Login />} ></Route>
      <Route exact path="/register" element={user ? <Navigate to={"/"} /> : <Register />} ></Route>
      <Route exact path="/profile/:username" element={<Profile />} ></Route>
    </Routes>
  );
}

export default App;
