const Pool = require("pg").Pool;


const pool = new Pool({
    user: "postgres",
    password: "TKKowan2024",
    host: "database-1.camhm8t412ed.us-east-1.rds.amazonaws.com",
    port: 5432,
    database: "postgres"
});


module.exports = pool;
