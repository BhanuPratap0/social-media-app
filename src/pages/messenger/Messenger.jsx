import { useContext, useEffect, useState } from 'react'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import Conversation from '../../components/conversation/Conversation'
import Message from '../../components/message/Message'
import Topbar from '../../components/topbar/Topbar'
import './messenger.css'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'

const Messenger = () => {

    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get("http://localhost:8800/api/conversation/" + user._id);
                setConversations(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        getConversations();
    }, [user._id])

    return (
        <>
            <Topbar />
            <div className='messenger' >
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input type="text" className="chatMenuInput" placeholder='Srach For Friends' />
                        {conversations.map(c => (
                            <div onClick={setCurrentChat}>
                                <Conversation key={c._id} conversations={c} currentUser={user} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {currentChat ? <>
                            <div className="chatBoxTop">
                                <Message />
                                <Message own={true} />
                                <Message />
                                <Message own={true} />
                                <Message />
                                <Message own={true} />
                                <Message />
                            </div>
                            <div className="chatBoxBottom">
                                <textarea className='chatMessageInput' placeholder='Write something'></textarea>
                                <button className='chatSubmitButton' >Send</button>
                            </div>
                        </> : <span className='noConversationText' >Open a conversation to start a chat</span>}
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Messenger
