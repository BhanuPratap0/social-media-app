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

    const [user, setUser] = useState({})
    const username = useParams().username;
    const {setSearchResult } = useContext(AuthContext)

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`https://social-media-gfgj.onrender.com/api/user?username=${username}`);
            setUser(res.data);
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
                            <img src={user.coverPicture} alt="" className="profileCoverImg" />
                            <img src={user.profilePicture} alt="" className="profileUserImg" />
                        </div>
                        <div className="profileInfo">
                            <h4 className='profileInfoName' >{user.username}</h4>
                            <span className='profileInfoDesc' >{user.desc}</span>
                        </div>
                    </div>
                    <div className="profileRightBottom">
                    <div className="mobile"><Rightbar user={user} /></div> 
                        <Feed username={username} />
                       <div className="computer"><Rightbar user={user} /></div> 
                      
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile
