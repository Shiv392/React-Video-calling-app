import React,{useEffect,useState,useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import { useSocket } from '../context/SocketProvider';

const LobbyScreen=()=>{

    const [email, setEmail] = useState("");
    const [room, setRoom] = useState("");

    const navigate=useNavigate();
    const socket=useSocket();

    const handleSubmitForm = useCallback(
       (e)=>{
        e.preventDefault();
        console.log('form event--------->',e);

        //<-----now we are calling our socket io server with event 'join:room' so when our server recives flag join,room 
        //it will call their function ------------>
        socket.emit('join:room',{email,room})
       },[email,room,socket]
      );
    
    const handleJoinRoom = useCallback((data) => {
        console.log('handle join room--------->',data);
          const { email, room } = data;
          navigate(`/room/${room}`);
        },
        [navigate]
      );

    useEffect(()=>{
      socket.on('join:room',handleJoinRoom);
      return ()=>{
        socket.off();
      }
      },[socket])

return(
    <div>
    <h1>Lobby</h1>
    <form onSubmit={handleSubmitForm}>
        <label htmlFor="email">Email ID</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="room">Room Number</label>
        <input
          type="text"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <br />
        <button>Join</button>
      </form>
    </div>
)
}

export default LobbyScreen;