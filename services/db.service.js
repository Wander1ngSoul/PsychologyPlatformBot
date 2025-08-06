const sql = require('mssql');
const dbConfig = require('../config/db.config');

class DBService {
    constructor() {
        this.pool = new sql.ConnectionPool(dbConfig);
        this.poolConnect = this.pool.connect();
    }

    async executeQuery(query, params = []) {
        await this.poolConnect;

        try {
            const request = this.pool.request();
            params.forEach(param => {
                request.input(param.name, param.type, param.value);
            });
            return await request.query(query);
        } catch (err) {
            console.error('SQL error', err);
            throw err;
        }
    }
}

module.exports = new DBService();