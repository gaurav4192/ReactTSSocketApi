import { Router, Request, Response } from "express";
import { sql, config, poolPromise } from '../models/db';

export const fetchAllMessagesByConversationId = async (req: Request, res: Response)=>{

    // console.log('My Request==>',req)
    const {conversationId} =req.params;

    try
    {
        const pool = await poolPromise;
        const request = pool.request();
        const result = await request.query(
            `SELECT
                m.id,m.content,m.sender_id,m.conversation_id,m.created_at
                FROM messages m    
                WHERE m.conversation_id= ${conversationId}
                ORDER by m.created_at ASC`

        );
            // console.log('responcess==>',result);
        res.status(200).json({ message: 'All Data Fetched SuccessFully', data: result.recordset });
    }
    catch(error)
    {
        console.log('error==>',error);
        res.status(500).json({error:"Failed to fetch message"});

    }
   
}

export const saveMessage=async(conversationId:string,senderId:string,content:string)=>{
        
    console.log('conversationId==>', conversationId);
    console.log('senderId==>', senderId);
    console.log('content==>', content);
    // console.log('QUERY:',`INSERT INTO messages(conversation_id,sender_id,message)
    //             VALUES(${conversationId},${senderId},'${content}')`)
    try {
        const pool = await poolPromise;
        const request = pool.request();
        const result = await request.query(
             `INSERT INTO messages(conversation_id, sender_id, content)
                    OUTPUT INSERTED.*
                VALUES(${conversationId},${senderId},'${content}')`,
            

            // `INSERT INTO messages(conversation_id,sender_id,message)
            //     VALUES(${conversationId},${senderId},'${content}')`
            

        );

    //   
        const messageJson = JSON.stringify({
            "message": 'All Data Fetched SuccessFully',
            "data": result.recordset
        });
        console.log('content==>', messageJson);
        return messageJson;
    }
    catch (error) {
        console.log('Error saving message:',error);
     throw new Error('Failed to save message');
    }

}
