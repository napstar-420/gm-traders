require('dotenv').config();
const express = require('express');
const db_connection = require('./database/connection');
const debug = require('debug')('*');
const logger = require('morgan')('dev');

const app = express();

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('root route')
})

app.listen(process.env.PORT, () => {
    db_connection();
    debug(`App is listening on http://localhost:${process.env.PORT}`)
})