import ReactTimeago from 'react-timeago'
import './message.css'
import { useEffect, useState } from 'react';
import axios from 'axios';

const Message = ({ message, own }) => {

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img src={message.senderPic} alt="" className='messageImg' />
        <p className='messageText'>{message.text}</p>
      </div>
      <div className="messageBottom">
        <ReactTimeago date={message.createdAt} />
      </div>

    </div>
  )
}

export default Message
