require('dotenv').config();
const express = require('express');
const debug = require('debug')('*');
const logger = require('morgan')('dev');
const dbConnection = require('./database/connection');
const shopRoutes = require('./routes/shop');

const app = express();

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/shop/', shopRoutes);

app.listen(process.env.PORT, () => {
  dbConnection();
  debug(`App is listening on http://localhost:${process.env.PORT}`);
});
