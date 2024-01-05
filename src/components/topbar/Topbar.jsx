import { Chat, Notifications, Person, Search } from "@mui/icons-material"
import "./topbar.css"
import { Link, useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import axios from "axios"
import { CircularProgress } from "@mui/material"
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

export default function Topbar() {



  const [isLoading, setIsLoading] = useState(false);
  const { user, searchResult, setSearchResult,host } = useContext(AuthContext)

  const searchUser = async (query) => {
    if (!query) {
      setSearchResult([])
      return;
    } else {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`${host}/api/user/searchUsers?search=${query}&userId=${user._id}`);
        console.log(data);
        setIsLoading(false);
        setSearchResult(data);
      } catch (error) {
        console.log("no user to search")
      }
    }
  }

  const history = useNavigate();

  const logoutHandler = () =>{
    localStorage.removeItem('user');
    history("/login");
  }

  return (
    <>
      <div className="topbarContainer">
        <div className="topbarLeft">
          <Link to="/" style={{ textDecoration: "none" }} >
            <span><img className="logo" src={require('../images/newlogo.png')} alt={require('../images/newlogo.png')} /></span>
            <span ><img className="sublogo" src={require('../images/mob-logo.png')} alt={require('../images/mob-logo.png')} /></span>
          </Link>
        </div>
        <div className="topbarCenter">
          <div className="searchbar">
            <Search className="searchIcon" />
            <input id="searchFriends" onChange={(e) => searchUser(e.target.value)} placeholder="Search for friend" className="searchInput" />
          </div>

        </div>
        <div className="topbarRight">
          <div className="topbarLinks">
            <Link to="/" style={{textDecoration:"none", color:"white"}} ><span className="topbarLink">Homepage</span></Link>
            {/* <span className="topbarLink">Timeline</span> */}
          </div>
          <div className="topbarIcons">
            <div className="topbarIconItem">
              <Person style={{height:"30px", width:"30px"}} />
              <span className="topbarIconBadge">1</span>
            </div>
            <div className="topbarIconItem">
              <Chat style={{height:"30px", width:"30px"}} />
              <span className="topbarIconBadge">1</span>
            </div>
            <div className="topbarIconItem">
              <Notifications style={{height:"30px", width:"30px"}} />
              <span className="topbarIconBadge">1</span>
            </div>
          </div>

          <div className="dropdown">
            <button className="btn profile-button " type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <Link >
                <img src={user.profilePicture} alt={user.profilePicture} className="topbarImg" />
              </Link>
            </button>
            <ul className="dropdown-menu">
              <li><Link className="dropdown-item" to={`/profile/${user.username}`} >Profile</Link></li>
              { user.isAdmin &&  <li><Link className="dropdown-item" to={`/admin`} >Admin Panel</Link></li>}
              <li><button onClick={logoutHandler} className="dropdown-item" href="#">Logout</button></li>
            </ul>
          </div>
        </div>

      </div>
      {searchResult !== null && searchResult.map((result) => (
        <>
          <div className="serachUserContainer" >
            {isLoading ? <CircularProgress style={{ color: 'white', height: "20px", width: "20px" }} />
              :
              <Link style={{ textDecoration: "none", fontWeight: "500" }} to={`/profile/${result.username}`}><div className="searchUserItem">
                <div style={{ display: "flex" }} >
                  <img src={result.profilePicture} alt="" className="searchUserImg" />
                  <div className="serachUserInf">
                    <span>{result.username}</span>
                    <span className="serachUserAbout" >{result.city} | {result.relationship}</span>
                  </div>
                </div>
                {user.followings.includes(result._id) ? "" : <PersonAddAltIcon />}
              </div>
              </Link>
            }
          </div >
        </>
      ))}
    </>
  )
}

