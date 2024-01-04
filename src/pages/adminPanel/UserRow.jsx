import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import axios from 'axios';
import React, { useContext, useRef, useState } from 'react'
import Snackbar from '@mui/joy/Snackbar';
import { Alert } from '@mui/material'
import { AuthContext } from '../../context/AuthContext';


const UserRow = ({ user, count }) => {

    const {user: currentUser,setUserChange} = useContext(AuthContext);

    const [openAlert, setOpenAlert] = useState(false);
    const [message, setMessage] = useState("");
    const [toasttype, setToastType] = useState("success");

    const [newPassword, setNewPassword] = useState(user.password);
    const [newEmail, setNewEmail] = useState(user.email);
    const [showPass, setShowPass] = useState("Show");
    const [passType, setPassType] = useState("password");

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAlertClose = () =>{
        setOpenAlert(false);
    }

    const onChangeEmail = (e) =>{
        setNewEmail(e.target.value)
    }
    const onChangePass = (e) =>{
        setNewPassword(e.target.value)
    }

    const handleUpdateUser = async () => {
        if (newPassword !== user.password) {
            try {
                await axios.put("https://sociosync.onrender.com/api/user/" + user._id,
                    {
                        userId: user._id,
                        password: newPassword,
                        email: newEmail,
                    }
                )
                setMessage("Update User Credentials")
                setToastType("success")
                setOpenAlert(true);
                setOpen(false);
                setUserChange("Updated")

            } catch (error) {
                console.log("Error updating user")
            }
            setUserChange("")
        }
    }
    const handleDeleteUser = async() => { 
      
        try {
            await  axios.delete("http://localhost:8800/api/user/" + user._id + "/" + currentUser.isAdmin)
            console.log("User Deleted")
            setOpen(false);
            setUserChange("Deleted")
        } catch (error) {
            console.log("Error Deleting")
        }
        setUserChange("")
    }

    const handlePassType = () => {
        if (showPass === "Show") {
            setShowPass("Hide");
            setPassType("text")
        } else {
            setShowPass("Show");
            setPassType("password")
        }
    }


    return (
        <>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.password}</td>
            <td><Button variant="outlined" onClick={handleClickOpen}>
                Update/Delete
            </Button>
            </td>



            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Update / Delete User - <b>{user.username}</b></DialogTitle>
                <DialogContent className='DialogContent' >
                    <DialogContentText>
                        <form>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Email address</label>
                                <input onChange={onChangeEmail} value={newEmail} type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputPassword1" class="form-label">Password</label>
                                <div className="update-input">
                                    <input onChange={onChangePass} value={newPassword} type={passType} class="form-control" id="exampleInputPassword1" />
                                    <Button onClick={handlePassType} >{showPass}</Button>
                                </div>
                            </div>
                        </form>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{ backgroundColor: "red", color: "white" }} onClick={handleDeleteUser}>Delete</Button>
                    <Button onClick={handleUpdateUser}>Update</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={openAlert} onClose={handleAlertClose}autoHideDuration={1000} anchorOrigin={{ vertical: "top", horizontal: "center" }} >
                <Alert variant="filled" severity={toasttype} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>

        </>

    )
}

export default UserRow
