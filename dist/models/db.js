"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.poolPromise = exports.sql = void 0;
const sql = require('mssql');
exports.sql = sql;
const config = {
    user: 'sa',
    password: 'Lucknow123@',
    server: 'localhost', // or your server name / IP
    database: 'FigureMyHealth',
    port: 1433,
    options: {
        encrypt: false, // Use true if you're on Azure or using SSL
        trustServerCertificate: true // Required for self-signed certs
    }
};
exports.config = config;
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
    console.log('Connected to MSSQL');
    return pool;
})
    .catch(err => {
    console.error('Database connection failed: ', err);
    throw err;
});
exports.poolPromise = poolPromise;
