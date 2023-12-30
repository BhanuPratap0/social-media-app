import axios from 'axios'

export const loginCall = async (userCredentials, dispatch) => {
    dispatch({ type: "LOGIN_START" });
    try {
        const res = await axios.post("https://social-media-gfgj.onrender.com/api/auth/login", userCredentials);
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    } catch (error) {
        console.log("Wrong Password")
    }
}