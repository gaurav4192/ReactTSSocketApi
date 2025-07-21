import { Request,Response } from "express";

import {sql,config,poolPromise} from '../models/db';

const SALT_ROUNDS=10;
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "figuresecretkey";

// export const login =  async(req:Request,res:Response)=>{
//     const {
//         password,
//         username } = req.body;

//     if (!username && !password) {
//         return res.status(400).json({
//             status: 400,
//             message: 'Username & Password are required *'
//         });
//     }
//     else if (username.length == 0 || password.length == 0) {
//         return res.status(400).json({
//             status: 400,
//             message: 'Username & Password must be Provided *'
//         });
//     }
//     else {
//         let pool = await sql.connect(config);

//         const request = pool.request();
//         // let query = 'SELECT * FROM [dbo].[UserData]';

//         request.input('Username', sql.NVarChar, username);
//         request.input('Password', sql.NVarChar, password);
//         const query = `
//       SELECT * FROM [dbo].[UserData]
//       WHERE Username = @Username AND Password = @Password
//     `;

//         const result = await request.query(query);

//         if (result.recordset.length === 0) {
//             return res.status(200).json({
//                 status: 200,
//                 message: 'User not found',
//                 data: []
//             });
//         }
//         else {

//             const user = result.recordset[0];

//             console.log('user', user)
//             const token = jwt.sign(
//                 { id: user.id, username: user.Username },
//                 JWT_SECRET,
//                 { expiresIn: '1h' }
//             );
//             console.log('token', JWT_SECRET, token)
//             return res.status(200).json({
//                 status: 200,
//                 message: 'User Logged In SuccessFully ! ',
//                 token: token,
//                 data: user
//             });
//         }
//     }

// }

export const login = async (req: Request, res: Response): Promise<void> => {
    console.log('SHIVAM', req.body);


  //  console.log('SHIVAM2', res);
    const { username, password } = {...req.body};
    if (!username || !password) {
      res.status(400).json({ message: 'Username & Password required' });
      return;
    }
  
    const pool = await poolPromise;
    const request = pool.request()
      .input('Username', sql.NVarChar, username)
      .input('Password', sql.NVarChar, password);
  
    const result = await request.query(`
      SELECT * FROM [dbo].[UserData]
      WHERE Username = @Username AND Password = @Password
    `);
  
    if (result.recordset.length === 0) {
      res.status(200).json({ message: 'User not found', data: [] });
      return;
    }
  
  
    const user = result.recordset[0];
  console.log('userdataa==>', user.Id );
  const token = jwt.sign({ id: user.Id, username: user.Username }, JWT_SECRET, { expiresIn: '60m' });
    res.status(200).json({ message: 'User logged in!', token, data: user });
  };


  export const verifyUser = async(req,res,next)=>{
    const {token} = req.body
    try {
      const decodedData = await jwt.verify(token, JWT_SECRET);
      console.log('decodedData', decodedData)
      req.user = decodedData
      next()
    } catch (error) {
      return res.status(500).json({ message: "Jwt token has expires, Pls login again" })
    }
    

   
    
    
  }