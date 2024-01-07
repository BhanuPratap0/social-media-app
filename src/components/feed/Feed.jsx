import './feed.css'
import Share from "../share/Share"
import { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import Post from '../post/Post'
import { AuthContext } from '../../context/AuthContext';


const Feed = ({ username }) => {

  const [posts, setPosts] = useState([]);
  const [postLength, setPostLength] = useState("1");
  const { user, postChange, host } = useContext(AuthContext);
  useEffect(() => {
    const fetchPost = async () => {
      const res = username
        ? await axios.get(`${host}/api/post/profile/` + username)
        : await axios.get(`${host}/api/post/timeline/` + user._id);
      setPostLength(res.data.length);
      setPosts(res.data.sort((p1, p2) => {
        return new Date(p2.createdAt) - new Date(p1.createdAt);
      }));
    };
    fetchPost();

  }, [username, user._id, postChange])

  return (
    <div className='feed'>
      <div className="feedWrapper">
        {(!username || username === user.username) && <Share />}

        {username && postLength == 0  &&
          <div className='welcomeText' >          
            <img className='welcomeImage' src={require('../images/camera.png')} />
            <span style={{fontSize:"30px"}} className='welcomeTextBottom' >No Posts Yet</span>
          </div>
          }

        {postLength == 0 && !username
          ? <div className='welcomeText' >
            <h1>Welcome to <span style={{ color: "#005792" }} >SocioSync</span></h1>
            <img className='welcomeImage' src={require('../images/home.png')} />
            <span className='welcomeTextBottom' >When you follow people you will see their photos and videos here.</span>
            <label for="searchFriends" ><span className='addFriends' >Search Friends</span></label>
          </div>
          : posts.map((p) => (
            <Post key={p._id} post={p} />
          ))}
      </div>

    </div>
  )
}

export default Feed
