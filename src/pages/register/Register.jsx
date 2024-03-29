import { Link, useNavigate } from 'react-router-dom'
import './register.css'
import { useRef, useState } from 'react';
import axios from 'axios';
import { Alert, CircularProgress, Snackbar } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [toasttype, setToastType] = useState("");
  const [profile, setProfile] = useState();
  const [cover, setCover] = useState();

  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const city = useRef();
  const relationship = useRef();
  const desc = useRef();
  let history = useNavigate();

  const deleteCloudPicture = async (file) => {
    const imageUrlArray = file.split("/");
    const image = imageUrlArray[imageUrlArray.length - 1];
    const imagePublicId = image.split('.')[0];
    const responce = await axios.delete(`https://sociosync.onrender.com/api/post/delete-image/` + imagePublicId);
    console.log(responce);
  }
  const postProfilePicture = async (pic) => {
    if (pic === undefined) {
      return;
    }
    if (profile != null) {
      deleteCloudPicture(profile);
    }

    if (pic.type === "image/jpeg" || pic.type === "image/png" || pic.type === "image/jpg") {
      setIsLoading(true);
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "bhanumedia");
      data.append("cloud_name", "dns2pagvz")

      await axios.post("https://api.cloudinary.com/v1_1/dns2pagvz/image/upload", data)
        .then((response) => {
          console.log("Couldinary Response: ", response);
          setProfile(response.data.url.toString());
        })
        .catch((error) => {
          console.log("Cloudinary error:", error);

        });
      setIsLoading(false);
    } else {
      setMessage("Invalid Image Type")
      setToastType("warning")
      setOpen(true);
    }
  }

  const postCoverPicture = async (pic) => {
    if (pic === undefined) {
      return;
    }
    if (cover != null) {
      deleteCloudPicture(cover);
    }
    if (pic.type === "image/jpeg" || pic.type === "image/png" || pic.type === "image/jpg") {
      setIsLoading(true);
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "bhanumedia");
      data.append("cloud_name", "dns2pagvz")

      await axios.post("https://api.cloudinary.com/v1_1/dns2pagvz/image/upload", data)
        .then((resp) => {
          console.log("Couldinary Response: ", resp);
          setCover(resp.data.url.toString());
        })
        .catch((error) => {
          console.log("Cloudinary error:", error);

        });
      setIsLoading(false);
    } else {
      setMessage("Invalid Image Type")
      setToastType("warning")
      setOpen(true);
    }
  }

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      setIsLoading(false);
      passwordAgain.current.setCustomValidity("Passwords don't match")
      return;

    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
        profilePicture: profile,
        coverPicture: cover,
        desc: desc.current.value,
        city: city.current.value,
        relationship: relationship.current.value,
      }
      try {
        await axios.post(`https://sociosync.onrender.com/api/auth/register`, user);
        setIsLoading(false);
        history("/login");
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };



  return (
    <div className='register'>
      <div className="RegisterWrapper">
        <div className="loginLeft">
          <h3 className='loginLogo' >SocioSync</h3>
          <span className="loginDesc">Connect with friends and the world around you on Bhanusocial</span>
        </div>
        <div className="registerRight">
          <form onSubmit={handleSubmit} className="registerBox">
            <input type="text" ref={username} placeholder='Username' className='loginInput' />

            <input type="email" ref={email} placeholder='Email' className='loginInput' />
            <input type="password" ref={password} placeholder='Password' className='loginInput' />

            <input type="password" ref={passwordAgain} placeholder='Password Again' className='loginInput' />

            <input type="text" ref={city} placeholder='City' className='loginInput' />

            <select ref={relationship} className='loginInput'>
              <option className='loginInput' disabled selected>Relationship</option>
              <option className='loginInput' value="Single">Single</option>
              <option className='loginInput' value="Not Single">Not Single</option>
              <option className='loginInput' value="Married">Married</option>
              <option className='loginInput' value="">Prefer Not To Say</option>
            </select>

            <label htmlFor='file' style={{ display: "flex", justifyContent: "space-between" }} className='loginInput' >
              <span style={{ paddingTop: "10px", opacity: "0.6" }} >{profile != null
                ? (<><DoneIcon style={{ color: "green" }} /> Uploaded </>)
                : "Upload Profile Picture"} </span>
              <span className='upload-button' >Upload</span>
              <input
                style={{ display: "none" }}
                type="file"
                id='file'
                accept='.png,.jpg,.jpeg'
                onChange={(e) => postProfilePicture(e.target.files[0])}
              />

            </label>
            <label htmlFor='profile' style={{ display: "flex", justifyContent: "space-between" }} className='loginInput' >
              <span style={{ paddingTop: "10px", opacity: "0.6" }} >{cover != null
                ? (<><DoneIcon style={{ color: "green" }} /> Uploaded </>)
                : "Upload Profile Picture"} </span>
              <span className='upload-button' >Upload</span>
              <input
                className='uploadInput'
                style={{ display: "none" }}
                type="file"
                id='profile'
                accept='.png,.jpg,.jpeg'
                onChange={(e) => postCoverPicture(e.target.files[0])}
              />
            </label>
            <textarea ref={desc} placeholder='Tell us about yourself (Not More Than 50 Words)' rows="5" cols="50"></textarea>

            <button type='submit' className="loginButton">
              {isLoading ? <CircularProgress style={{ color: 'white', height: "20px", width: "20px" }} /> : "Sign Up"}
            </button>
            <Link to={"/login"} style={{ width: "100%", textAlign: "center" }} ><button className="loginRegisterButton">Log into Account</button></Link>
          </form>
        </div>
      </div>
      <Snackbar open={open} autoHideDuration={2500} onClose={handleClose}>
        <Alert variant="filled" severity={toasttype} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Register
