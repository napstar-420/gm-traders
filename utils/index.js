/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const fs = require('fs/promises');
const fsExtra = require('fs-extra');
const axios = require('axios');
const FormData = require('form-data');
const { v4: uuid } = require('uuid');
const debug = require('debug')('*');
const path = require('path');

// Image uploading
async function uploadImage(file, name) {
  const imageName = `${name}-${uuid()}`;
  try {
    const fileContent = await fs.readFile(file.path);
    // don't remove this line else the uploads folder will get full of images
    fs.unlink(file.path);

    const base64Content = fileContent.toString('base64');
    const data = new FormData();
    data.append('name', imageName);
    data.append('image', base64Content);
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      headers: {
        ...data.getHeaders(),
      },
      data,
    };

    const response = await axios.request(config);
    const { medium } = response.data.data;
    return medium.url;
  } catch (error) {
    debug('Error uploading image:', error);
    throw new Error('Error uploading image');
  }
}

async function emptyTempFolder() {
  fsExtra.emptyDir(`${path.resolve(__dirname, '..')}/uploads/temp`)
    .then(() => debug('Temp Dir empty'))
    .catch((error) => debug({
      message: 'Error while cleaning Temp folder',
      error,
    }));
}

module.exports = {
  uploadImage,
  emptyTempFolder
};
