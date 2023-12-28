import { MoreVert } from '@mui/icons-material'
import './post.css'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const Post = ({post}) => {

    const [like, setLike] = useState(post.likes.length);
    const [isLike, setIsLike] = useState(false);
    const [user, setUser] = useState({})
    const {user: currentUser} = useContext(AuthContext);

    useEffect(()=>{
        setIsLike(post.likes.includes(currentUser._id));
    }, [currentUser._id, post.likes]);
    useEffect(() => {
        const fetchUser = async() =>{
          const res = await axios.get(`https://social-media-gfgj.onrender.com/api/user?userId=${post.userId}`);
          setUser(res.data);
        };
        fetchUser();
      },[post.userId])

    

    const handleLike = () => {

        try {
            axios.put("https://social-media-gfgj.onrender.com/api/post/" + post._id + "/like", {userId: currentUser._id});
        } catch (error) {
            
        }

        setLike(isLike ? like-1 : like + 1)
        setIsLike(!isLike);
    }

   
    return (
        <div className='post' >
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`/profile/${user.username}`}>
                        <img src={ user.profilePicture} alt="" className="postProfileImg" />
                        </Link>
                        <span className="postUsername">
                            {user.username}
                        </span>
                        
                    </div>
                    <div className="postTopRight">
                        <MoreVert />
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{post?.desc}</span>
                    <img src={post.img} alt="" className="postImg" />
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <img src={require(`../images/like.png`)} alt="" className="likeIcon" onClick={handleLike} />
                        <img src={require(`../images/heart.png`)} alt="" className="likeIcon" onClick={handleLike} />
                        <span className="postLikeCounter">{like} people like it</span>
                    </div>
                    <div className="postBottomRight">
                        <span className="postCommentText">{post.comment} Comments</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Post
