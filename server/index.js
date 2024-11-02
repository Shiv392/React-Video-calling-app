const {Server} = require('socket.io');
const cors=require('cors');
const bodyparser=require('body-parser');

//by doing cors true, now we dont get the cors policy errors ----------->
const IO = new Server(8000,{
    cors:true
});

const emailToSocketIdMap=new Map();
const socketidToEmail = new Map();

IO.on('connection',(socket)=>{
    console.log('socket connection ==================>',socket.id);

    //now when the socket server receives on notification for join:room , it will call the function to .
    socket.on('join:room',(data)=>{
        console.log('join room data---------------->',data);
        const {email,room}=data;
        emailToSocketIdMap.set(email,socket.id);
        socketidToEmail.set(socket.id,email);

        //now we have to send some notification to the existing user in the meeting.
        IO.to(room).emit('user:joined',{email , id : socket.id});
        //now join this new user in the room;
        socket.join(room);

        IO.to(socket.id).emit('join:room',data);
    });

    socket.on('user:call',({to,offer})=>{
        IO.to(to).emit('Incomming:call',{from:socket.id,offer});
    })

    socket.on('call:accepted',({to,ans})=>{
        IO.to(to).emit('call:accepted',{from:socket.id,ans});
    });

    socket.on("peer:nego:needed", ({ to, offer }) => {
        console.log("peer:nego:needed", offer);
        IO.to(to).emit("peer:nego:needed", { from: socket.id, offer });
      });
    
      socket.on("peer:nego:done", ({ to, ans }) => {
        console.log("peer:nego:done", ans);
        IO.to(to).emit("peer:nego:final", { from: socket.id, ans });
      });
})