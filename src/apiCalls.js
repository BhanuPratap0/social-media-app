import axios from 'axios'
import { useContext } from 'react';

export const loginCall = async (userCredentials, dispatch) => {
    
    dispatch({ type: "LOGIN_START" });
    try {
        const res = await axios.post(`https://sociosync.onrender.com/api/auth/login`, userCredentials);
        // const res = await axios.post(`http://localhost:8800/api/auth/login`, userCredentials);
        localStorage.setItem("user", JSON.stringify(res.data))
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    } catch (error) {
        dispatch({ type: "LOGIN_FAILURE", payload: error });
    }
}