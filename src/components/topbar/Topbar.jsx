import { Chat, Notifications, Person, Search } from "@mui/icons-material"
import "./topbar.css"
import { Link } from "react-router-dom"
import { useContext, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import axios from "axios"

export default function Topbar() {

  const { user } = useContext(AuthContext)
  const [searchResult, setSearchResult] = useState([]);
  const searchUser = async (query) => {
    if (!query) {
      setSearchResult([])
      return;
    } else {
      try {
        const {data}  = await axios.get(`http://localhost:8800/api/user/searchUsers?search=${query}`, { userId: user._id });
        console.log(data);
        setSearchResult(data);
      } catch (error) {
        console.log("no user to search")
      }
    }
  }

  return (
    <>
      <div className="topbarContainer">
        <div className="topbarLeft">
          <Link to="/" style={{ textDecoration: "none" }} >
            <span className="logo">SociSync</span>
            <span className="sublogo">BS</span>
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
            <span className="topbarLink">Homepage</span>
            <span className="topbarLink">Timeline</span>
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
          <Link to={`/profile/${user.username}`} >
            <img src={user.profilePicture} alt="" className="topbarImg" />
          </Link>
        </div>

      </div>
      {searchResult!==null && searchResult.map((result) => (
        <>
          <div className="serachUserContainer" >
            <div className="searchUserItem">{result.username}</div>
          </div >
        </>
      ))}
    </>
  )
}
