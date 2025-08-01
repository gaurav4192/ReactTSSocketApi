import express, { Request, Response } from "express";
import { json } from "body-parser";
 import authRoutes from './routes/authRoutes';
 import http from 'http';
 import { Server } from "socket.io";

import conversationsRoutes from'./routes/conversationsRoutes';

import contactsRoutes from'./routes/contactRoutes';
import messagesRoutes from './routes/messagesRoutes'
import { Socket } from "dgram";
import { saveMessage } from "./controller/messageController";

const app = express();

const server=http.createServer(app);
// app.use(json());
 
const io=new Server(server,{
    cors:{
        origin:'*'
    }
}


);
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/conversations', conversationsRoutes);
app.use('/messages', messagesRoutes);
app.use('/contacts', contactsRoutes);


io.on('connection',(socket)=>{

    console.log('A user conenected',socket.id);
   
    socket.on('join conversation',(conversationId)=>{

        socket.join(conversationId);
        console.log('User join conversation'+conversationId);
    });


    socket.on('sendMessage',async (message)=>{
        const{conversationId,senderId,content}= message;
        try{
            console.log('conversationId==>', conversationId);
            const savedMessage = await saveMessage(conversationId,senderId,content);
            const messageJson = JSON.stringify({
                "message": 'All Data Fetched SuccessFully',
                "data": savedMessage
            });
            console.log('messageJson==>', savedMessage);
            io.to(conversationId).emit('newMessage', savedMessage);

            const updateMessage=JSON.parse(savedMessage);

            // io.emit('conversationUpdated',{
            //     conversationId,
            //     lastMessage: updateMessage.content,
            //     lastMessageTime: updateMessage.created_at
            // })
            io.to(conversationId).emit('conversationUpdated', savedMessage);
        }
        catch(err)
        {
            console.error('Failed to save message',err);
        }
    });

    socket.on('disconnect',()=>{

        console.log('disconnect',socket.id);

    });

});

app.get('/', (_req: Request, _res: Response) => {
    console.log('test');
    _res.json("Help!");
});




const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
