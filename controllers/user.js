/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const debug = require('debug')('*');
const User = require('../models/User');
const messages = require('../config/error_messages');
const userValidation = require('../validation/user');

const signup = [
  ...userValidation,

  // Validation
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw res.status(400).json(errors);
    }
    return next();
  },

  // Creation
  (req, res) => {
    const {
      firstName,
      lastName,
      email,
      password,
    } = req.body;

    bcrypt.hash(password, 10, async (error, hashedPassword) => {
      if (error) {
        throw res.status(500).json({ message: messages.somethingWentWrong, error });
      }

      try {
        const user = new User({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          inventory: [],
          orderHistory: [],
        });
        await user.save();
        return res.json({ message: messages.user.created });
      } catch (err) {
        throw res.status(500).json({ message: messages.somethingWentWrong, err });
      }
    });
  },
];

async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Check if the user credentials are valid
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate and sign a JWT
    const payload = { id: user.id };

    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' },
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '30d' },
    );

    // store the refresh token on database, for persistent login
    user.refreshToken = refreshToken;
    await user.save();

    // Return the JWT as a response
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.json({ accessToken });
  } catch (error) {
    debug(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function logout(req, res) {
  // On client, also delete the access token

  const { cookies } = req;
  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }

  const refreshToken = cookies.jwt;

  try {
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      return res.sendStatus(204);
    }

    // remove the refresh token from database, to prevent unwanted access
    user.refreshToken = '';
    await user.save();

    // remove token from cookie
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return res.sendStatus(204);
  } catch (error) {
    debug(error);
    return res.sendStatus(500);
  }
}

async function handleRefreshToken(req, res) {
  const { cookies } = req;
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  const refreshToken = cookies.jwt;

  try {
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.sendStatus(403);
    }

    return jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || user.id !== decoded.id) {
          return res.sendStatus(403);
        }
        const accessToken = jwt.sign(
          { id: decoded.id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '1d' },
        );

        return res.json({ accessToken });
      },
    );
  } catch (error) {
    return res.sendStatus(500);
  }
}

module.exports = {
  signup,
  login,
  handleRefreshToken,
  logout,
};
