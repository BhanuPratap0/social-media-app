import { useContext, useEffect, useRef, useState } from 'react';
import './login.css'
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom';
import Snackbar from '@mui/joy/Snackbar';
import { Alert } from '@mui/material'

const Login = () => {

  
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [toasttype, setToastType] = useState("success");
  const email = useRef();
  const password = useRef();
  const { isFetching, user, dispatch, error ,setLoginSuccess } = useContext(AuthContext);


  let history = useNavigate();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
    history("/")
  };
  
  useEffect(()=>{
    if(error){
      setMessage("Invalid Credentials")
        setToastType("error")
        setOpen(true);
    }else{
      setLoginSuccess(true);
    }
    if(user){
      setLoginSuccess(true);
    }
  },[user])


  return (
    <div className='login'>
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className='loginLogo' >SociSync</h3>
          <span className="loginDesc">Connect with friends and the world around you on Bhanusocial</span>
        </div>
        <div className="loginRight" >
          <form className="loginBox" onSubmit={handleSubmit} >

            <input
              type="email"
              required
              placeholder='Email'
              className='loginInput'
              ref={email} />

            <input
              type="password"
              required
              placeholder='Password'
              className='loginInput'
              ref={password} />

            <button type='submit' className="loginButton">{isFetching ? <CircularProgress style={{color:'white', height:"20px", width:"20px"}} /> : "Log In"}</button>
            <span className="loginForgot">Forgot Password</span>
            <Link to={"/register"} style={{textAlign:"center"}} ><button className="loginRegisterButton">
            {isFetching ? <CircularProgress style={{color:'white', height:"20px", width:"20px"}} /> : "Create a New Account"}
              </button></Link>
          </form>
        </div>
      </div>
      <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}  anchorOrigin={{ vertical:"top", horizontal:"center" }} >
        <Alert variant="filled" severity={toasttype} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Login
