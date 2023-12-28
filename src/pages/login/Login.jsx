import { useContext, useRef } from 'react';
import './login.css'
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress } from '@mui/material'
import { Link } from 'react-router-dom';

const Login = () => {

  const email = useRef();
  const password = useRef();
  const { isFetching, user, dispatch } = useContext(AuthContext);



  const handleSubmit = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };

  console.log(user);

  return (
    <div className='login'>
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className='loginLogo' >Bhanusocial</h3>
          <span className="loginDesc">Connect with friends and the world around you on Bhanusocial</span>
        </div>
        <div className="loginRight" onSubmit={handleSubmit} >
          <form className="loginBox">

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

            <button className="loginButton">{isFetching ? <CircularProgress style={{color:'white', height:"20px", width:"20px"}} /> : "Log In"}</button>
            <span className="loginForgot">Forgot Password</span>
            <Link to={"/register"} style={{ width:"100%" ,textAlign:"center"}} ><button className="loginRegisterButton">
            {isFetching ? <CircularProgress style={{color:'white', height:"20px", width:"20px"}} /> : "Create a New Account"}
              </button></Link>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
