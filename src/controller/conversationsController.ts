import { sql, config, poolPromise } from '../models/db';
import { Router, Request, Response } from "express";

export const fetchAllConversationsByUserId = async (req: Request, res: Response) => {

    // res.json({user:req})
    //  res.json({ message: 'OKw', userId: req.user?.id });
    let userId = "";
    if (req.user) {
        console.log('userid==>', req.user.id);
        userId = req.user.id;
    }

    try {
        const pool = await poolPromise;
        const request = pool.request();
        const result = await request.query(

          `SELECT
              c.id AS conversation_id,
              CASE
                WHEN u1.id = '${[userId]}' THEN u2.username
                ELSE u1.username
              END AS participant_name,
              m.content AS last_message,
              m.created_at AS last_message_time
            FROM [FigureMyHealth].[dbo].conversations AS c
            JOIN [FigureMyHealth].[dbo].UserData AS u1
              ON u1.id = c.participant_one
            JOIN [FigureMyHealth].[dbo].UserData AS u2
              ON u2.id = c.participant_two
            OUTER APPLY (
              SELECT TOP 1
                content,
                created_at
              FROM [FigureMyHealth].[dbo].messages AS msg
              WHERE msg.conversation_id = c.id
              ORDER BY created_at DESC
            ) AS m
            WHERE c.participant_one = '${[userId]}'
              OR c.participant_two = '${[userId]}'
            ORDER BY m.created_at DESC;
          
          `
                //             `SELECT
                //   c.id AS conversation_id,
                //   u.username AS participant_name,
                //   m.content AS last_message,
                //   m.created_at AS last_message_time
                // FROM [FigureMyHealth].[dbo].conversations c

                // -- Determine the "other" participant
                // JOIN [FigureMyHealth].[dbo].UserData u
                //   ON u.id = CASE
                //     WHEN c.participant_one = ${[userId]} THEN c.participant_two
                //     ELSE c.participant_one
                //   END

                // -- Grab the most recent message per conversation
                // OUTER APPLY (
                //   SELECT TOP 1 content, created_at
                //   FROM [FigureMyHealth].[dbo].messages
                //   WHERE conversation_id = c.id
                //   ORDER BY created_at DESC
                // ) AS m

                // WHERE ${[userId]} IN (c.participant_one, c.participant_two)
                // ORDER BY m.created_at DESC;`


        );
        console.log('results==>', result.recordset);

        if (result.recordset.length) {
            res.status(200).json({ message: 'All Data Fetched SuccessFully', data: result.recordset });
            return;
        }
        else {
            res.status(200).json({ message: 'No Data Found', data: [] });
            return;
        }


    }

    catch (e) {

        res.status(500).json({ error: 'Failed to fetch conversation' })
    }


}