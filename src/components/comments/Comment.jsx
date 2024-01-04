import { useContext, useEffect, useState } from 'react'
import './comment.css'
import axios from 'axios'
import { format } from "timeago.js";
import { MoreVert } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';

const Comment = ({ comment, postUserId }) => {
    const { user, postChange, setPostChange, host } = useContext(AuthContext);
    const [userData, setUserData] = useState([]);
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`${host}/api/user?userId=${comment.userId}`);
            setUserData(res.data);
        }
        fetchUser();
    }, [comment._id])

    const handleDeleteComment = async () => {
        try {
            setPostChange("Comment Deleted")
            const res = await axios.delete(`${host}/api/post/deletecomment/${comment._id}/${comment.userId}`)

        } catch (error) {
            console.log("Error deleting comment")
        }
        setPostChange("")
    }

    return (
        <div className='comment' >
            <div className="commentWrapper">
                <img className='comment-user-pic' src={userData.profilePicture} />
                <div className='commentBody' >
                    <span>{userData.username}</span>
                    <span className='commentText' >{comment.desc}</span>
                    <span className='commentTime' >{format(comment.createdAt)}</span>
                </div>
            </div>
            {(user._id === comment.userId || postUserId === user._id) && <div class="dropdown">
                <button class="post-button" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <MoreVert />
                </button>
                <ul class="dropdown-menu">
                    <li><button onClick={handleDeleteComment} class="dropdown-item">Delete Comment</button></li>
                </ul>
            </div>}
        </div>
    )
}

export default Comment
