import React, { useContext } from 'react'
import video from '../img/cam.png'
import contacts from '../img/add.png'
import more from '../img/more.png'
import Messages from './Messages'
import Input from './Input'
import { ChatContext } from '../context/ChatContext'

const Chat = () => {
  const{ data }=useContext(ChatContext);
  return (
    <div className='chat'>
      <div className='chatInfo'>
      <span>{data.user?.displayName}</span>
        <div className='icons'>
          <img src={video} alt='' />
          <img src={contacts} alt='' />
          <img src={more} alt='' />
        </div>        
      </div>
      <Messages/>
      <Input/>
    </div>
  )
}

export default Chat