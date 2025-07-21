"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = exports.login = void 0;
const db_1 = require("../models/db");
const SALT_ROUNDS = 10;
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
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('SHIVAM', req.body);
    //  console.log('SHIVAM2', res);
    const { username, password } = Object.assign({}, req.body);
    if (!username || !password) {
        res.status(400).json({ message: 'Username & Password required' });
        return;
    }
    const pool = yield db_1.poolPromise;
    const request = pool.request()
        .input('Username', db_1.sql.NVarChar, username)
        .input('Password', db_1.sql.NVarChar, password);
    const result = yield request.query(`
      SELECT * FROM [dbo].[UserData]
      WHERE Username = @Username AND Password = @Password
    `);
    if (result.recordset.length === 0) {
        res.status(200).json({ message: 'User not found', data: [] });
        return;
    }
    const user = result.recordset[0];
    const token = jwt.sign({ id: user.id, username: user.Username }, JWT_SECRET, { expiresIn: '20s' });
    res.status(200).json({ message: 'User logged in!', token, data: user });
});
exports.login = login;
const verifyUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    try {
        const decodedData = yield jwt.verify(token, JWT_SECRET);
        console.log('decodedData', decodedData);
        req.user = decodedData;
        next();
    }
    catch (error) {
        return res.status(500).json({ message: "Jwt token has expires, Pls login again" });
    }
});
exports.verifyUser = verifyUser;
