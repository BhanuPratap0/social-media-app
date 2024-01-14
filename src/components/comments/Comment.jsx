import { useContext, useEffect, useRef, useState } from 'react'
import './comment.css'
import axios from 'axios'

import { MoreVert } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import ReactTimeago from 'react-timeago';

const Comment = ({ comment, postUserId }) => {
    

    const { user, setPostChange, host } = useContext(AuthContext);
    const [userData, setUserData] = useState([]);
    const scrollRef = useRef();
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`${host}/api/user?userId=${comment.userId}`);
            setUserData(res.data);
        }
        fetchUser();
    }, [comment._id, host, comment.userId])

    const handleDeleteComment = async () => {
        try {
            setPostChange("Comment Deleted")
            await axios.delete(`${host}/api/post/deletecomment/${comment._id}/${comment.userId}`)
            
        } catch (error) {
            console.log("Error deleting comment")
        }
        setPostChange("")
    }

    

    return (
        <div className='comment' ref={scrollRef} >
            <div className="commentWrapper">
                <img className='comment-user-pic' src={userData.profilePicture} alt={userData.profilePicture}/>
                <div className='commentBody' >
                    <span>{userData.username}</span>
                    <span className='commentText' >{comment.desc}</span>
                    <span className='commentTime' ><ReactTimeago date={comment.createdAt} /></span>
                </div>
            </div>
            {(user._id === comment.userId || postUserId === user._id) && <div className="dropdown">
                <button className="post-button" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <MoreVert />
                </button>
                <ul className="dropdown-menu">
                    <li><button onClick={handleDeleteComment} className="dropdown-item">Delete Comment</button></li>
                </ul>
            </div>}
        </div>
    )
}

export default Comment
