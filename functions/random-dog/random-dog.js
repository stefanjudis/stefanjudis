/* eslint-disable */
const cloudinary = require('cloudinary').v2;
const { promisify } = require('util');
const got = require('got');

exports.handler = async function (event, context) {
  try {
    const { resources: videos } = await cloudinary.search
      .expression('folder:random-dogs')
      .execute();

    const randomIndex = Math.floor(Math.random() * videos.length);
    const dogVideoUrl = videos[randomIndex].secure_url;
    const dogGifUrl = dogVideoUrl.replace('mp4', 'gif');
    const dogGif = await got(dogGifUrl).buffer();

    return {
      statusCode: 200,
      body: dogGif.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: e.message }),
    };
  }
};
