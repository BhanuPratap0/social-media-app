import { MoreVert } from '@mui/icons-material'
import './post.css'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

import Snackbar from '@mui/joy/Snackbar';
import { Alert, CircularProgress } from '@mui/material'
import Comment from '../comments/Comment'
import ReactTimeago from 'react-timeago'

const Post = ({ post }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [toasttype, setToastType] = useState("success");
    const [like, setLike] = useState(post.likes.length);
    const [isLike, setIsLike] = useState(false);
    const [user, setUser] = useState({})
    const { user: currentUser, postChange, setPostChange, host } = useContext(AuthContext);
    const [postDesc, setPostDesc] = useState(post.desc);
    const [comments, setComments] = useState([]);
    const [commentText, setcommentText] = useState("");
  

 



    const onChangeComment = (e) =>{
        setcommentText(e.target.value);
    }

    const handleComment = async(e) => {
        setIsLoading(true);
        e.preventDefault();
        const res = await axios.post(`${host}/api/post/comments`, {
            userId: currentUser._id,
            postId: post._id,
            desc: commentText
        });
        console.log(res);
        setIsLoading(false);
        setcommentText("")
    }

    useEffect(() => {
        setIsLike(post.likes.includes(currentUser._id));
    }, [currentUser._id, post.likes]);
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`${host}/api/user?userId=${post.userId}`);
            setUser(res.data);
        };
        fetchUser();

        const fetchComments = async () => {
            const res = await axios.get(`${host}/api/post/getcomments/${post._id}`); 
            let newArray = res.data;
            newArray.reverse();
            setComments(newArray);
        }
        fetchComments();

    }, [postChange,isLoading,post.userId,host,post._id])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleLike = () => {

        try {
            axios.put(`${host}/api/post/` + post._id + "/like", { userId: currentUser._id });
            console.log("Liked")
        } catch (error) {

        }

        setLike(isLike ? like - 1 : like + 1)
        setIsLike(!isLike);
    }

    const handleDeletePost = async () => {
        try {
            if (post.img) {
                const imageUrlArray = post.img.split("/");
                const image = imageUrlArray[imageUrlArray.length - 1];
                const imagePublicId = image.split('.')[0];

                const responce = await axios.delete(`${host}/api/post/delete-image/` + imagePublicId);
                console.log(responce);
            }

            await axios.delete(`${host}/api/post/` + post._id + "/" + currentUser._id);

            setMessage("Post Deleted")
            setToastType("success")
            setOpen(true);
            setPostChange("change");

        } catch (error) {
            console.log("Error deleting post")
        }
        setPostChange("")

    }

    const handleUpdatePost = async (description) => {
        try {



            await axios.put(`${host}/api/post/` + post._id,

                {
                    userId: currentUser._id,
                    desc: postDesc
                }
            );
            setMessage("Post Updated")
            setToastType("success")
            setOpen(true);
            setPostChange("change");
        } catch (error) {

        }
        setPostChange("");
    }

    const onChange = (e) => {
        setPostDesc(e.target.value);
    }

    

    return (
        <div className='post' >
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`/profile/${user.username}`}>
                            <img src={user.profilePicture} alt="" className="postProfileImg" />
                        </Link>
                        <span className="postUsername">
                            {user.username}
                        </span>
                        <div className='desktop-div' >
                            <span className="postDate"><ReactTimeago date={post.createdAt} /></span>
                            <span className="postDate">{post.location}</span>
                        </div>
                    </div>
                    {currentUser._id === post.userId && <div className="postTopRight">
                        <div className="dropdown">
                            <button className="post-button " type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <MoreVert />
                            </button>
                            <ul className="dropdown-menu">
                                <li><button onClick={handleDeletePost} className="dropdown-item">Delete Post</button></li>
                                <li><button data-toggle="modal" data-target="#exampleModal" className="dropdown-item">Update Post</button></li>
                            </ul>
                        </div>
                    </div>}
                </div>
                <div className='mobile-div' >
                    <span className="postDate"><ReactTimeago date={post.createdAt} /></span>
                    <span className="postDate">{post.location}</span>
                </div>
                <div className="postCenter">
                    <span className="postText">{post?.desc}</span>
                    <img src={post.img} alt="" className="postImg" />
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        { isLike ? <img src={require(`../images/like.png`)} alt="" className="likeIcon" onClick={handleLike} />:
                        <img src={require(`../images/heart.png`)} alt="" className="likeIcon" onClick={handleLike} />}
                        <span className="postLikeCounter">{like} people like it</span>
                    </div>
                    <div className="postBottomRight">
                        <span className="postCommentText"> {comments.length ===1 ? (`${comments.length} Comment`) : (`${comments.length} Comments`)}</span>
                    </div>
                </div>                
            {comments!=null && <div  className='comments-section'>
                {comments?.map((comment) => {
                    return <Comment key={comment._id} postUserId={post.userId} comment={comment} />
                })}
            </div>}
            <form className='commentBox' onSubmit={handleComment}>
                <input onChange={onChangeComment} value={commentText} className='commentInput' type='text' placeholder='Enter Your Comment' />
                <button className='commentButton' >{isLoading? <CircularProgress style={{color:'white', height:"20px", width:"20px"}} /> : "Post"}</button>
            </form>
            </div>
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }} >
                <Alert variant="filled" severity={toasttype} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>

            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Update Post</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <span>Update Post Description</span>
                            <textarea className="form-control" onChange={onChange} value={postDesc} id="edescription" name="edescription" rows="3" minLength={5} required ></textarea>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" onClick={(e) => handleUpdatePost(e.target.value)} className="btn btn-primary" data-dismiss="modal">Update</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}

export default Post
