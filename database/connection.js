require('dotenv').config();
const mongoose = require('mongoose');
const debug = require('debug')('*');

async function main() {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.DB_CONNECTION, {
      dbName: 'gm_traders',
    });
    debug('DATABASE CONNECTED');
  } catch (error) {
    debug('DATABASE ERROR');
    debug(error);
  }
}

module.exports = main;
