import { useEffect, useState } from 'react'
import './conversation.css'
import axios from 'axios';

const Conversation = ({conversations, currentUser}) => {

  const [user, setUser] = useState(null);

  useEffect(()=>{
    const friendId = conversations.members.find(m=>m !== currentUser._id );

    const getUser = async() => {
      try {
        const res = await axios.get("https://sociosync.onrender.com/api/user?userId="+friendId);
        setUser(res.data);
      } catch (error) {
       console.log(error); 
      }
    }
    getUser();
  }, [conversations, currentUser]);
  

  return (
    <div className='conversation'>
      <img 
      src={user?.profilePicture} 
      alt={user?.profilePicture} 
      className="conversationImg" />
      <span className="conversationName">{user?.username}</span>
    </div>
  )
}

export default Conversation
