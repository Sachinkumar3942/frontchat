import React, { useContext, useState } from 'react'
import Pic from '../img/img.png'
import Attach from '../img/attach.png'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import {v4 as uuid} from 'uuid'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
const Input = () => {
  const [text,setText]=useState('');
  const [img,setImg]=useState(null);

  const {currentUser}=useContext(AuthContext);
  const {data}=useContext(ChatContext);
  const handleSend=async()=>{
    if(img){
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    }else{
      await updateDoc(doc(db,"chats",data.chatId), {
        messages: arrayUnion({
          id:uuid(),
          text,
          senderId:currentUser.uid,
          date:Timestamp.now()
        })
    });
    }
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    setImg(null);
    setText('');
  }
  return (
    <div className='input'>
      <div className='pre'>
      <input className='in' type='text' placeholder='Type a message' onChange={(e)=>{setText(e.target.value)}} value={text}/>
      <input id='file2' style={{display:"none"}} type='file' placeholder='Enter image'  onChange={(e) => setImg(e.target.files[0])}/>
        <label htmlFor='file2' >
            <img src={Pic} width={35} alt='The img is not desplayed' />
           
        </label>
      <input id='file1' style={{display:"none"}} type='file' placeholder='Enter image'  onChange={(e) => setImg(e.target.files[0])}/>
        <label htmlFor='file1' >
            <img src={Attach} width={35} alt='The img is not desplayed' />
            
        </label>
        
        
      </div>
      <div className='send'>
        <button onClick={handleSend} >Send</button>
      </div>
    </div>
  )
}

export default Input