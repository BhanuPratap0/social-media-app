import { useContext, useEffect, useState } from 'react'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Topbar from '../../components/topbar/Topbar'
import './profile.css'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'


const Profile = () => {

    const [userProfile, setUserProfile] = useState({})
    const username = useParams().username;
    const {setSearchResult } = useContext(AuthContext)

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`https://social-media-gfgj.onrender.com/api/user?username=${username}`);
            setUserProfile(res.data);
        };
        fetchUser();
        setSearchResult([])
        
    },[username])

    return (
        <>
            <Topbar />
            <div className="profile">
                <Sidebar />
                <div className="profileRight">
                    <div className="profileRightTop">
                        <div className="profileCover">
                            <img src={userProfile.coverPicture} alt="" className="profileCoverImg" />
                            <img src={userProfile.profilePicture} alt="" className="profileUserImg" />
                        </div>
                        <div className="profileInfo">
                            <h4 className='profileInfoName' >{userProfile.username}</h4>
                            <span className='profileInfoDesc' >{userProfile.desc}</span>
                        </div>
                    </div>
                    <div className="profileRightBottom">
                        <Feed username={username} />
                        <Rightbar user={userProfile} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile
