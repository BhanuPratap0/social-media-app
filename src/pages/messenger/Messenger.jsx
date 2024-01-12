import { useContext, useEffect, useRef, useState } from 'react'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import Conversation from '../../components/conversation/Conversation'
import Message from '../../components/message/Message'
import Topbar from '../../components/topbar/Topbar'
import './messenger.css'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import { CircularProgress } from '@mui/material'
import { Link } from 'react-router-dom'
import { Search } from '@mui/icons-material'
import SearchResult from '../../components/searchresult/SearchResult'


const Messenger = () => {

    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { user, host, setCoversationSearch, coversationSearch, userChange, setUserChange } = useContext(AuthContext);
    const [chatBoxClass, setChatBoxClass] = useState(false);
    const [chatMenuClass, setChatMenuClass] = useState(false);
    const [currentChatUser, setCurrentChatUser] = useState(null);
    const scrollRef = useRef();
    const [userOnline, setUserOnline] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    var ENDPOINT = 'https://sociosync.onrender.com';
    // var ENDPOINT = 'http://localhost:8800';
    var socket = io(ENDPOINT);

    useEffect(() => {

        // socket.on("typing", () => setIsTyping(true));
        // socket.on("stop typing", () => setIsTyping(false));
        socket.on("getMessage", data => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            })
        })
    }, [])

    useEffect(() => {
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat])

    useEffect(() => {
        socket.emit("addUser", user._id);
        socket.on("getUsers", users => {
            setOnlineUsers(user.followings.filter((f) => users.some((u) => u.userId === f)));
        })

    }, [user, currentChatUser]);


    useEffect(() => {
        setUserOnline(onlineUsers.includes(currentChatUser?._id));
    }, [onlineUsers]);

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get("https://sociosync.onrender.com/api/conversation/" + user._id);
                setConversations(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        getConversations();
    }, [user._id, userChange])

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get("https://sociosync.onrender.com/api/message/" + currentChat?._id);
                setMessages(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        const getUser = async () => {
            try {
                if (currentChat) {
                    const chatUser = currentChat.members.find((f) => f !== user._id);
                    const res = await axios.get("https://sociosync.onrender.com/api/user?userId=" + chatUser);
                    setCurrentChatUser(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        getMessages();
        getUser();
    }, [currentChat]);



    const handleSubmitOnKeyPress = async (e) => {

        if ((e.key === "Enter" && newMessage)) {
            e.preventDefault();
            const message = {
                senderPic: user.profilePicture,
                sender: user._id,
                text: newMessage,
                conversationId: currentChat._id
            };

            const receiverId = currentChat.members.find((member) => member !== user._id);
            socket.emit("sendMessage", {
                senderPic: user.profilePicture,
                senderId: user._id,
                receiverId: receiverId,
                text: newMessage,
            });

            try {
                const res = await axios.post("https://sociosync.onrender.com/api/message/", message);
                setMessages([...messages, res.data]);
            } catch (error) {
                console.log(error);
            }
            setNewMessage("");
        }

    }

    const handleSubmit = async (e) => {
        if (newMessage) {
            e.preventDefault();
            const message = {
                senderPic: user.profilePicture,
                sender: user._id,
                text: newMessage,
                conversationId: currentChat._id
            };

            const receiverId = currentChat.members.find((member) => member !== user._id);
            socket.emit("sendMessage", {
                senderPic: user.profilePicture,
                senderId: user._id,
                receiverId: receiverId,
                text: newMessage,
            });

            try {
                const res = await axios.post("https://sociosync.onrender.com/api/message/", message);
                setMessages([...messages, res.data]);
            } catch (error) {
                console.log(error);
            }
            setNewMessage("");
        }

    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView();
    });

    const handleChatbox = async (c) => {
        setCurrentChat(c);
        setChatBoxClass(true);
        setChatMenuClass(true);
    }

    const handleBackButton = () => {
        setChatBoxClass(false);
        setChatMenuClass(false);
        setCurrentChat(null);
    }

    // const typingHandler = (e) => {
    //     setNewMessage(e.target.value);

    //     //Typing indicator logic

    //     if (!typing) {
    //         setTyping(true);
    //         socket.emit('typing', currentChat._id);
    //     }
    //     let lastTypingTime = new Date().getTime();
    //     var timerLength = 3000;
    //     setTimeout(() => {
    //         var timeNow = new Date().getTime();
    //         var timeDiff = timeNow - lastTypingTime;

    //         if (timeDiff >= timerLength && typing) {
    //             socket.emit("stop typing", currentChat._id);
    //             setTyping(false);
    //         }
    //     }, timerLength);

    // }

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
    }

    const searchUser = async (query) => {
        if (!query) {
            setCoversationSearch([])
            return;
        } else {
            setIsLoading(true);
            try {
                const { data } = await axios.get(`${host}/api/user/searchUsers?search=${query}&userId=${user._id}`);
                console.log(data);
                setIsLoading(false);
                setCoversationSearch(data);
            } catch (error) {
                console.log("no user to search")
            }
        }
    }

    return (
        <>
            <Topbar />
            <div className='messenger' >
                <div className={chatMenuClass ? "chatMenu-Mobile" : "chatMenu"}>
                    <div className="chatMenuWrapper">
                        <div className="coversationSearch" >
                            <Search className="searchIcon" />
                            <input type="text" className="chatMenuInput" placeholder='Search For Friends'
                                onChange={(e) => searchUser(e.target.value)}
                            />
                        </div>

                        <><div className="serachCoversationContainer" >
                            {isLoading
                                ? <CircularProgress fontSize={"xl"} style={{ color: 'white' }} />
                                : (coversationSearch !== null && coversationSearch.map((result) => (
                                    <SearchResult user={result} currentUser={user} setCoversationSearch={setCoversationSearch} setUserChange={setUserChange} />
                                ))
                                )}
                        </div >
                        </>

                        {conversations.map(c => (
                            <div key={c._id} onClick={() => handleChatbox(c)}>
                                <Conversation conversations={c} currentUser={user} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className={chatBoxClass ? "chatBox-Mobile" : "chatBox"}>

                    <div className="chatBoxWrapper">
                        <div className={chatBoxClass ? "chatBoxHeader" : "d-none"} >
                            <ArrowCircleLeftIcon onClick={handleBackButton} className='closeIcon' fontSize='large' />
                            <img src={currentChatUser?.profilePicture} alt="" />
                            <div className='chatBoxHeaderText' >
                                <span className='chatBoxUsername' >{currentChatUser?.username}</span>
                                {userOnline ? <span className='onlineUser' >Online</span> : ""}
                            </div>
                        </div>
                        {currentChat ? <>
                            <div className="chatBoxTop">
                                {messages.map((m) => (
                                    <div ref={scrollRef} >
                                        <Message key={m._id} message={m} own={m.sender === user._id} />
                                    </div>
                                ))}
                            </div>
                            {/* {isTyping ? <div>
                                <Lottie
                                    options={defaultOptions}
                                    width={70}
                                    height={40}
                                    style={{ marginBottom: 15, marginLeft: 0 }}
                                />
                            </div> : (<></>)} */}
                            <div className="chatBoxBottom">
                                <form className='chatMessageInput' onKeyDown={handleSubmitOnKeyPress}  >
                                    <textarea
                                        className='chatMessageInput'
                                        placeholder='Write something'
                                        onChange={typingHandler}
                                        value={newMessage}

                                    ></textarea>
                                </form>
                                <button className='chatSubmitButton' onClick={handleSubmit} >Send</button>
                            </div>
                        </> : <span className='noConversationText' >Open a conversation to start a chat</span>}
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat} setUserOnline={setUserOnline} currentChatUser={currentChatUser} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Messenger
