import { Chat, Notifications, Person, Search } from "@mui/icons-material"
import "./topbar.css"
import { Link, useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import axios from "axios"
import { CircularProgress } from "@mui/material"
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

export default function Topbar() {



  const [isLoading, setIsLoading] = useState(false);
  const { user, followingArray, searchResult, setSearchResult } = useContext(AuthContext)

  const searchUser = async (query) => {
    if (!query) {
      setSearchResult([])
      return;
    } else {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`http://localhost:8800/api/user/searchUsers?search=${query}&userId=${user._id}`);
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
            <span className="logo">SociSync</span>
            <span className="sublogo">SS</span>
          </Link>
        </div>
        <div className="topbarCenter">
          <div className="searchbar">
            <Search className="searchIcon" />
            <input onChange={(e) => searchUser(e.target.value)} placeholder="Search for friend, post or video" className="searchInput" />
          </div>

        </div>
        <div className="topbarRight">
          <div className="topbarLinks">
            <Link to="/" style={{textDecoration:"none", color:"white"}} ><span className="topbarLink">Homepage</span></Link>
            {/* <span className="topbarLink">Timeline</span> */}
          </div>
          <div className="topbarIcons">
            <div className="topbarIconItem">
              <Person />
              <span className="topbarIconBadge">1</span>
            </div>
            <div className="topbarIconItem">
              <Chat />
              <span className="topbarIconBadge">1</span>
            </div>
            <div className="topbarIconItem">
              <Notifications />
              <span className="topbarIconBadge">1</span>
            </div>
          </div>

          <div class="dropdown">
            <button class="btn profile-button " type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <Link >
                <img src={user.profilePicture} alt="" className="topbarImg" />
              </Link>
            </button>
            <ul class="dropdown-menu">
              <li><Link class="dropdown-item" to={`/profile/${user.username}`} >Profile</Link></li>
              { user.isAdmin &&  <li><Link class="dropdown-item" to={`/admin`} >Admin Panel</Link></li>}
              <li><button onClick={logoutHandler} class="dropdown-item" href="#">Logout</button></li>
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
                {followingArray.includes(result._id) ? "" : <PersonAddAltIcon />}
              </div>
              </Link>
            }
          </div >
        </>
      ))}
    </>
  )
}

