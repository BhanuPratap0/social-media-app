import ReactTimeago from 'react-timeago'
import './message.css'

const Message = ({ message, own }) => {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" alt="" className='messageImg' />
        <p className='messageText'>{message.text}</p>
      </div>
      <div className="messageBottom">
        <ReactTimeago date={message.createdAt} />
      </div>

    </div>
  )
}

export default Message
