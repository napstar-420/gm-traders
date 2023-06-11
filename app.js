/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const express = require('express');
const debug = require('debug')('*');
const logger = require('morgan')('dev');
const session = require('express-session');
const { v4: uuid } = require('uuid');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dbConnection = require('./database/connection');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');

dbConnection();

const app = express();

app.use(credentials);
app.use(cors(corsOptions));
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: uuid(), resave: false, saveUninitialized: true }));
app.use('/shop/', shopRoutes);
app.use('/auth/', authRoutes);

app.listen(process.env.PORT, () => {
  debug(`App is listening on http://localhost:${process.env.PORT}`);
});
