import { ConnectionPool, config as SQLConfig, connect } from 'mssql';


const sql = require('mssql');

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

const poolPromise: Promise<ConnectionPool> = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL');
        return pool;
    })
    .catch(err => {
        console.error('Database connection failed: ', err);
        throw err;
    });
export {
    sql, poolPromise, config
};