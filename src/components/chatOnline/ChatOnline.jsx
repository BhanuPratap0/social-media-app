import { useEffect, useState } from 'react';
import './chatOnline.css'
import axios from 'axios';

const ChatOnline = ({ onlineUsers, currentId, setCurrentChat }) => {

    const [friends, setFriends] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);

    useEffect(() => {
        const getFriends = async () => {
            try {
                const friendList = await axios.get(`https://sociosync.onrender.com/api/user/friends/` + currentId);
                setFriends(friendList.data);
            } catch (error) {
                console.log(error)
            }
        };
        getFriends();
    }, [currentId])
    console.log(friends);

    useEffect(() => {
        setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
    }, [friends, onlineUsers]);

    return (
        <div className='chatOnline'>

            {onlineFriends.map((o) => (
                <div className="chatOnlineFriend">
                    <div className="chatOnlineImgConatiner">
                        <img src={o.profilePicture} alt={o.profilePicture} className='chatOnlineImg' />
                        <div className="chatOnlineBadge"></div>
                    </div>
                    <span className="chatOnlineName">{o.username}</span>
                </div>
            ))}

        </div>
    )
}

export default ChatOnline
