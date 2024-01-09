import './message.css'

const Message = ({own}) => {
  return (
    <div className={own? "message own": "message"}>
        <div className="messageTop">
            <img src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" alt="" className='messageImg' />
            <p className='messageText'>Hello this is a message</p>
        </div>
        <div className="messageBottom">
            1 hour agoa
        </div>
      
    </div>
  )
}

export default Message
