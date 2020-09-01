require('dotenv-safe').config();
const path = require('path');

module.exports = {
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        charset: 'utf8',
        dateStrings: true,
    },
    useNullAsDefault: true,
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
    },
};
