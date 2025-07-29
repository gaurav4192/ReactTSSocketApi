import { Request, Response } from "express";
import { sql, config, poolPromise } from '../models/db';
import { error } from "console";

export const fetchContacts = async (req: Request, res: Response): Promise<void>  => {
    let userId = "";
    if (req.user) {
        console.log('userid==>', req.user.id);
        userId = req.user.id;
    }

    try{
        const pool = await poolPromise;
        const request = pool.request();

        const result = await pool
            .request()
            .input('userId', sql.Int, userId)  // adjust type if user_id isn't INT
            .query(`
                    SELECT
                    u.id   AS contact_id,
                    u.username,
                    u.email
                    FROM [dbo].[contacts] AS c
                    JOIN [dbo].[UserData] AS u
                    ON u.id = c.contact_id
                    WHERE c.user_id = @userId
                    ORDER BY u.username ASC;
                `);

        if (result.recordset.length) {
            res.status(200).json({ message: 'All Data Fetched SuccessFully', data: result.recordset });
            return;
        }
        else {
            res.status(200).json({ message: 'No Data Found', data: [] });
            return;
        }
    }
    catch(e){
        console.error('Error Fetching Contacts:',e);
       res.status(500).json({ error: 'Failed to fetch contacts' });
       return;
    }
}


export const addContact = async (req: Request, res: Response): Promise<void> => {
    let userId = "";
    if (req.user) {
        console.log('userid==>', req.user.id);
        userId = req.user.id;
    }
    const {contactEmail}=req.body;
    console.log('contactid==>', contactEmail);
    try{

        const pool = await poolPromise;
        const request = pool.request()
            .input('email', sql.VarChar, contactEmail);

        const contactExist = await request.query(
            `SELECT id from [dbo].[UserData] where email=@email`
           
        );
        console.log("Add result respaaonse", contactExist.recordset.length);
       
        if(contactExist.recordset.length==0)
        {
             res.status(400).json({ error: 'Contact Not Found' }); 
             return ;
        }
        const contactId = contactExist.recordset[0].id;

        console.log("Add result respaaonse", contactExist.recordset.length);
      const addResultResponse=   await request.query(

            // `INSERT INTO contacts(user_id, contact_id)
            //     VALUES($1,$2)
            //     ON CONFLICT DO NOTHING
            //     `,
            //     [userId],[contactid]
            `INSERT INTO contacts(user_id, contact_id)
                VALUES(${userId},${contactId})`
            
            
        );

      

        
        

         res.status(201).json({message:'Contact Added Successfully'});
            return;
    }
    catch(e)
    {
        console.error('Error Adding Contacts:', e);
        res.status(500).json({ error: 'Failed to Add contacts' });
        return;
    }

}