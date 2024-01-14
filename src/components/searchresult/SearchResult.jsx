import axios from 'axios';
import './searchResult.css';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const SearchResult = ({ user,currentUser, setCoversationSearch }) => {
    const {setUserChange} = useContext(AuthContext);
    const handleClick = async (query) => {
        try {
            const res = await axios.post('https://sociosync.onrender.com/api/conversation/',
                {
                    senderId: currentUser._id,
                    receiverId: user._id
                })
                setUserChange("Coversation created")
                console.log(res.data);
        } catch (error) {
                console.log("Failed to creat conversation!")
        }
        setCoversationSearch(null);
        setUserChange("");
    }

    return (
        <div>
            <div className="searchCoversationUserItem" onClick={handleClick} >
                <div style={{ display: "flex" }} >
                    <img src={user.profilePicture} alt="" className="searchUserImg" />
                    <div className="serachUserInf">
                        <span>{user.username}</span>
                        <span className="serachUserAbout" >{user.city} | {user.relationship}</span>
                    </div>
                </div>
            </div>
        </div >

    )
}

export default SearchResult
