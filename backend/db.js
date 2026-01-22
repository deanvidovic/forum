require('dotenv').config();

const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbDatabase = process.env.DB_DATABASE;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

const pgp = require('pg-promise')()
const db = pgp(`postgres://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbDatabase}`)

module.exports = db;