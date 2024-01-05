import Feed from "../../components/feed/Feed"
import Sidebar from "../../components/sidebar/Sidebar"
import Topbar from "../../components/topbar/Topbar"
import Rightbar from "../../components/rightbar/Rightbar"
import "./home.css"
import Snackbar from '@mui/joy/Snackbar';
import { Alert } from '@mui/material'
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"


export default function Home() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [toasttype, setToastType] = useState("success");
  const { loginSuccess,setLoginSuccess } = useContext(AuthContext);


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  useEffect(()=>{
    if(loginSuccess){
      setMessage("Login Successfully!")
      setToastType("success")
      setOpen(true);
      setLoginSuccess(false);
    }
  },[loginSuccess,setLoginSuccess])

  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <Feed />
        <div className="rightbar-home"><Rightbar /></div>
        <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}  anchorOrigin={{ vertical:"top", horizontal:"center" }} >
        <Alert variant="filled" severity={toasttype} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      </div>
    </>
  )
}
