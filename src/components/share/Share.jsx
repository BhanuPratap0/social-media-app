import { Cancel, EmojiEmotions, Label, PermMedia, Room } from '@mui/icons-material'
import './share.css'
import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import Snackbar from '@mui/joy/Snackbar';
import { Alert } from '@mui/material'
import { CircularProgress } from '@mui/material'






const Share = () => {
  
  //get location of the user
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [display, setDisplay] = useState("none")

  const locationDisplay = () =>{
    if(display === "none"){
      setDisplay("block")
    } else {
      setDisplay("none")
    }
  }
  
  const locOnChange = (e) =>{
    setWeather(e.target.value);
  }

  function handleLocationClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error, { enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,});
      
    } else {
      console.log("Geolocation not supported");
    }
  }
  

  const  success = async(position) => {
    const latitude = position.coords.latitude ;
    const longitude = position.coords.longitude ;
    setLocation({ latitude, longitude });
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    console.log(`More or less ${position.coords.accuracy} meters.`);

    // Make API call to OpenWeatherMap
    const {data}  = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=+${longitude}&localityLanguage=en`);
    console.log(data.city);
    setWeather(data.city);

  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  //get user location api endsss



  const [description, setDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [toasttype, setToastType] = useState("success");
  const [file, setFile] = useState();
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const { user: currentUser, setPostChange } = useContext(AuthContext);

  const [imageData, setImageData] = useState("");


  const postPicture = async (pic) => {

    if (pic === undefined || pic.size>5288304) {
      setMessage("File size should be 5 mb or less")
      setToastType("warning")
      setOpen(true);
      return;
    }

    if (pic.type === "image/jpeg" || pic.type === "image/png" || pic.type === "image/jpg" || pic.type === "video/mp4" ) {
      setIsLoading(true);
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "bhanumedia");
      data.append("cloud_name", "dns2pagvz")

      await axios.post("https://api.cloudinary.com/v1_1/dns2pagvz/image/upload", data)
        .then((response) => {
          console.log("Couldinary Response: ", response);
          setFile(response.data.url.toString());
          console.log(response.data.public_id);
          setImageData(response.data.public_id);
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

  const deleteFile = async (e) => {
    e.preventDefault();
    try {
      const responce = await axios.delete("https://sociosync.onrender.com/api/post/delete-image/" + imageData);
      console.log(responce);
      setFile("");
    } catch (error) {
      console.log(error);
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    if (description === "") {
      setMessage("Post Caption Can't be Empty")
      setToastType("warning")
      setOpen(true);
      return;
    }

    const newPost = {
      userId: currentUser._id,
      desc: description,
      img: file
    }

    try {
      await axios.post("https://sociosync.onrender.com/api/post/", newPost);
      setMessage("Post Uploaded")
      setToastType("success")
      setOpen(true);
      setPostChange("posted");
      setDesc("");
    } catch (error) {
      console.log(error);
    }
    setFile("");

  }



  return (
    <div className='share'>
      <div className="shareWrapper">
        
        <div className="shareTop">
          <img src={currentUser.profilePicture} alt="" className="shareProfileImg" />
         <input value={description} onChange={(e) => setDesc(e.target.value)} placeholder={"What's in your mind " + currentUser.username + "?"} type="text" className="shareInput" />  
        </div>
        <div className="location-section">
          <input className="Location" style={{display:`${display}`}} type='text' placeholder='Your Location' value={weather} onChange={locOnChange} />
          <button style={{display:`${display}`}} onClick={handleLocationClick} >Current Loc</button>
        </div>
        <hr className='shareHr' />
        {file && (
          <div className="shareImgContainer">
            <img src={file} alt={file} className="shareImg" />
            <Cancel className='shareCancelImg' onClick={deleteFile} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler} >
          <div className="shareOptions">
            <label htmlFor='file' className="shareOption">
              <PermMedia htmlColor='tomato' className='shareIcon' />
              <span className='shareOptionText' >Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id='file'
                accept='.png,.jpg,.jpeg,.mp4'
                onChange={(e) => postPicture(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <Label htmlColor='blue' className='shareIcon' />
              <span className='shareOptionText' >Tag</span>
            </div>
            <div className="shareOption" onClick={locationDisplay}>
              <Room htmlColor='green' className='shareIcon' />
              <span  className='shareOptionText' >Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor='goldenrod' className='shareIcon' />
              <span className='shareOptionText' >Feelings</span>
            </div>
            <button type='submit' className="shareButton">
              {isLoading ? <CircularProgress style={{ color: 'white', height: "20px", width: "20px" }} /> : "Share"}
            </button>
          </div>
        </form>
      </div>
      <Snackbar open={open} autoHideDuration={2500} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }} >
        <Alert variant="filled" severity={toasttype} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div >
  )
}

export default Share
