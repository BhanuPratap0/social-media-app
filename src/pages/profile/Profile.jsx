import { useContext, useEffect, useState } from 'react'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Topbar from '../../components/topbar/Topbar'
import './profile.css'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import EditIcon from '@mui/icons-material/Edit';
import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from '@mui/material'




const Profile = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [message, setMessage] = useState("");
    const [toasttype, setToastType] = useState("success");
    const [user, setUser] = useState({})
    const username = useParams().username;
    const { user: currentuser, setUserChange, userChange, dispatch, host } = useContext(AuthContext);
    const [userInf, setUserInf] = useState({ username: "", desc: "", profilePicture: "", coverPicture: "" });
    const [passType, setPassType] = useState("password");
    const [showPass, setShowPass] = useState("Show");
    let history = useNavigate()


    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setOpenAlert(false);
    };

    const deleteCloudPicture = async (file) => {
        const imageUrlArray = file.split("/");
        const image = imageUrlArray[imageUrlArray.length - 1];
        const imagePublicId = image.split('.')[0];

        const responce = await axios.delete(`${host}/api/post/delete-image/` + imagePublicId);
        console.log(responce);


    }
    const postProfilePicture = async (pic) => {
        if (pic === undefined) {
            return;
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
                    setUserInf({ ...userInf, profilePicture: response.data.url.toString() });
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

        if (pic.type === "image/jpeg" || pic.type === "image/png" || pic.type === "image/jpg") {
            setIsLoading(true);
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "bhanumedia");
            data.append("cloud_name", "dns2pagvz")

            await axios.post("https://api.cloudinary.com/v1_1/dns2pagvz/image/upload", data)
                .then((resp) => {
                    console.log("Couldinary Response: ", resp);
                    setUserInf({ ...userInf, coverPicture: resp.data.url.toString() });
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

    const handleUpdateUser = async () => {

        if (user.profilePicture !== userInf.profilePicture) {
            deleteCloudPicture(user.profilePicture);
        }
        if (user.coverPicture !== userInf.coverPicture) {
            deleteCloudPicture(user.coverPicture);
        }

        try {
            await axios.put(`${host}/api/user/` + user._id,
                {
                    userId: user._id,
                    desc: userInf.desc,
                    username: userInf.username,
                    profilePicture: userInf.profilePicture,
                    coverPicture: userInf.coverPicture,
                }
            )
            dispatch({ type: "UPDATE", payload: userInf.username });
            dispatch({ type: "PROFILEPICTURE", payload: userInf.profilePicture });

            setUserChange("Updated")
            setMessage("Profile Updated")
            setToastType("success")
            setOpenAlert(true);
            setOpen(false);
            console.log(userInf.username)
            history(`/profile/${userInf.username}`)

        } catch (error) {
            console.log("Error updating user")
        }
        setUserChange("")
    }


    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`${host}/api/user?username=${username}`);
            setUser(res.data);
            setUserInf(res.data);
        };
        fetchUser();
 

    }, [host,userChange, username])

    const handlePassType = () => {
        if (showPass === "Show") {
            setShowPass("Hide");
            setPassType("text")
        } else {
            setShowPass("Show");
            setPassType("password")
        }
    }
    const onChange = (e) => {
        setUserInf({ ...userInf, [e.target.name]: e.target.value })
    }

    return (
        <>
            <Topbar />
            <div className="profile">
                <Sidebar />
                <div className="profileRight">
                    <div className="profileRightTop">
                        <div className="profileCover">
                            <img src={user.coverPicture} alt="" className="profileCoverImg" />
                            <img src={user.profilePicture} alt="" className="profileUserImg" />
                        </div>
                        <div className="profileInfo">
                            <h4 className='profileInfoName' >{user.username}</h4>
                            <span className='profileInfoDesc' >{user.desc}</span>
                            {currentuser._id === user._id && <button onClick={handleClickOpen} className='editProfile' >Edit Profile<EditIcon fontSize='small' style={{ marginBottom: "3px" }} /></button>}

                            <Dialog open={open} onClose={handleClose}>
                                <DialogTitle>Update Profile</DialogTitle>
                                <DialogContent className='DialogContent' >
                                    <DialogContentText>
                                        <form>
                                            <div className="mb-3">
                                                <label for="username" className="form-label">Username</label>
                                                <input name='username' value={userInf.username} type="text" className="form-control" id="username" onChange={onChange} />
                                            </div>
                                            <div className="mb-3">
                                                <label for="desc" className="form-label">Description</label>
                                                <textarea name='desc' onChange={onChange} value={userInf.desc} type="text" className="form-control" id="desc" />
                                            </div>
                                            <div className="mb-3">
                                                <label for="profile" className="form-label">New Profile Picture</label>
                                                {isLoading ? <CircularProgress style={{ color: 'black', height: "20px", width: "20px" }} /> : <input type="file" className="form-control" id="profile" onChange={(e) => postProfilePicture(e.target.files[0])} />}
                                            </div>
                                            <div className="mb-3">
                                                <label for="cover" className="form-label">New Cover Picture</label>
                                                {isLoading ? <CircularProgress style={{ color: 'black', height: "20px", width: "20px" }} /> : <input type="file" className="form-control" id="cover" onChange={(e) => postCoverPicture(e.target.files[0])} />}
                                            </div>
                                            <div className="mb-3">
                                                <label for="exampleInputPassword1" className="form-label">New Password</label>
                                                <div className="update-input">
                                                    <input type={passType} className="form-control" id="exampleInputPassword1" />
                                                    <Button onClick={handlePassType} >{showPass}</Button>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label for="exampleInputPassword1" className="form-label">Confirm New Password</label>
                                                <div className="update-input">
                                                    <input type={passType} className="form-control" id="exampleInputPassword1" />
                                                    <Button onClick={handlePassType} >{showPass}</Button>
                                                </div>
                                            </div>
                                        </form>
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleUpdateUser}>Update</Button>
                                    <Button onClick={handleClose}>Cancel</Button>
                                </DialogActions>
                            </Dialog>



                        </div>
                    </div>
                    <div className="profileRightBottom">
                        <div className="mobile"><Rightbar user={user} /></div>
                        <div className="feed-div"> <Feed username={username} /></div>
                        <div className="computer"><Rightbar user={user} /></div>

                    </div>
                </div>
            </div>
            <Snackbar open={openAlert} autoHideDuration={1000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }} >
                <Alert variant="filled" severity={toasttype} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default Profile
