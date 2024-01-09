import './chatOnline.css'

const ChatOnline = () => {
  return (
    <div className='chatOnline'>
        <div className="chatOnlineFriend">
            <div className="chatOnlineImgConatiner">
                <img src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" alt="" className='chatOnlineImg' />
                <div className="chatOnlineBadge"></div>
            </div>
            <span className="chatOnlineName">John Doe</span>
        </div>
        <div className="chatOnlineFriend">
            <div className="chatOnlineImgConatiner">
                <img src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" alt="" className='chatOnlineImg' />
                <div className="chatOnlineBadge"></div>
            </div>
            <span className="chatOnlineName">John Doe</span>
        </div>
        <div className="chatOnlineFriend">
            <div className="chatOnlineImgConatiner">
                <img src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" alt="" className='chatOnlineImg' />
                <div className="chatOnlineBadge"></div>
            </div>
            <span className="chatOnlineName">John Doe</span>
        </div>
      
    </div>
  )
}

export default ChatOnline
