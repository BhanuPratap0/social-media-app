import { useContext, useRef } from 'react';
import './login.css'
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {

  const email = useRef();
  const password = useRef();
  const { isFetching, user, dispatch } = useContext(AuthContext);


  let history = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
      history("/")
  };

  console.log(user);

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
    </div>
  )
}

export default Login
