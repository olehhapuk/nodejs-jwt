const express = require('express');
const bcrypt = require('bcrypt');

const { User } = require('../schemas');
const { validateBySchema, authorize } = require('../middlewares');
const {
  registerUserSchema,
  loginUserSchema,
  updateUserSchema,
} = require('../validationSchemas');
const { jwt } = require('../utils');

const router = express.Router();

const getSafeUserData = (user) => ({
  _id: user._id,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

router.post(
  '/register',
  validateBySchema(registerUserSchema),
  async (req, res) => {
    try {
      const userExists = await User.findOne({
        email: req.body.email,
      });

      if (userExists) {
        res.status(422).send('User with this email is already registered');
        return;
      }

      const newUser = await User.create({
        email: req.body.email,
        password: req.body.password,
      });

      const payload = {
        _id: newUser._id,
      };

      const token = await jwt.generate(payload);

      res.json({
        user: getSafeUserData(newUser),
        token,
      });
    } catch (error) {
      console.dir(error, { depth: null });
      res.status(500).json(error);
    }
  }
);

router.post('/login', validateBySchema(loginUserSchema), async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      res.status(404).send('No user found with this email');
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) {
      res.status(401).send('Invalid credentials');
      return;
    }

    const payload = {
      _id: user._id,
    };

    const token = await jwt.generate(payload);

    res.json({
      user: getSafeUserData(user),
      token,
    });
  } catch (error) {
    console.dir(error, { depth: null });
    res.status(500).json(error);
  }
});

router.get('/me', authorize, async (req, res) => {
  try {
    const user = await User.findById(res.locals.user.id);

    if (!user) {
      res.status(404).send('No user found');
      return;
    }

    res.json({
      user: getSafeUserData(user),
    });
  } catch (error) {
    console.dir(error, { depth: null });
    res.status(500).json(error);
  }
});

router.put('/:id', validateBySchema(updateUserSchema), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        password: req.body.password,
      }
    );

    res.json({
      user: getSafeUserData(user),
    });
  } catch (error) {
    console.dir(error, { depth: null });
    res.status(500).json(error);
  }
});

module.exports = router;
