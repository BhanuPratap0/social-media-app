import './rightbar.css'
import Online from '../online/Online'
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Add, Remove } from '@mui/icons-material';

const Rightbar = ({ user }) => {

  const [friends, setFriends] = useState([]);
  const { user:currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(currentUser.followings.includes(user?._id));

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get("https://social-media-gfgj.onrender.com/api/user/friends/" + user?._id);
        setFriends(friendList.data);
      } catch (error) {
        console.log(error)
      }
    };
    getFriends();
    setFollowed(currentUser.followings.includes(user?._id))
  }, [user?._id]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get("https://social-media-gfgj.onrender.com/api/user/friends/" + currentUser._id);
        setFriends(friendList.data);
      } catch (error) {
        console.log(error)
      }
    };
    getFriends();

  },[]);

  const followHandler = async () => {
    try {
      if (followed) {
        await axios.put(`https://social-media-gfgj.onrender.com/api/user/${user._id}/unfollow`, { userId: currentUser._id });
        dispatch({ type: "UNFOLLOW", payload: user._id });

      } else {
        await axios.put(`https://social-media-gfgj.onrender.com/api/user/${user._id}/follow`, { userId: currentUser._id });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
    } catch (error) {
      console.log(error);
    }
    setFollowed(!followed);
  }

  const HomeRightBar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className='birthdayImg' src={require("../images/gift.png")} alt="" />
          <span className="birthdayText"><b>John doe</b> and <b>3 other friends </b> have birthday today</span>
        </div>
        <img className='rightbarAd' src={require("../images/ad.jpg")} alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {friends.map(u => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    )
  }



  const ProfilePageRightbar = () => {

    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={followHandler} >
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className='rightbarTitle' >User Information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City: </span>
            <span className="rightbarInfoValue">{user.city} </span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From: </span>
            <span className="rightbarInfoValue">{user.from} </span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship: </span>
            <span className="rightbarInfoValue">{user.relationship} </span>
          </div>
        </div>
        <h4 className='rightbarTitle' >User Friends</h4>
        <div className="rightbarFollowings">
          {friends.length > 0 && friends.map((friend) => (
            <Link to={"/profile/" + friend.username} style={{ textDecoration: "none" }} >
              <div className="rightbarFollowing">
                <img
                  src={friend.profilePicture}
                  alt=""
                  className="rightbarFollowingImg" />
                <span style={{ color: "black" }} className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div >
      </>
    )
  }

  return (
    <div className='rightbar'>
      <div className="rightbarWrapper">
        {user ? <ProfilePageRightbar /> : <HomeRightBar />}
      </div>
    </div>
  )
}

export default Rightbar
