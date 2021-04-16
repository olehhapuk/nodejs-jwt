const express = require('express');
const bcrypt = require('bcrypt');

const { User } = require('../schemas');
const { validateBySchema } = require('../middlewares');
const { registerUserSchema, loginUserSchema } = require('../validationSchemas');
const { jwt } = require('../utils');

const router = express.Router();

router.post(
  '/register',
  validateBySchema(registerUserSchema),
  async (req, res) => {
    try {
      // Check if user with this email exists
      const existingUser = await User.findOne({
        email: req.body.email,
      });

      if (existingUser) {
        res.status(422).send('User with this email is already registered');
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(
        req.body.password,
        Number(process.env.SALT_ROUNDS)
      );

      // Create new user
      const newUser = await User.create({
        ...req.body,
        password: hashedPassword,
      });

      // Generate token
      const payload = {
        _id: newUser._id,
      };

      const token = await jwt.generate(payload);

      res.json({
        user: {
          _id: newUser._id,
          email: newUser.email,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
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
    // Check if user with this email exists
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      res.status(404).send('No user found with this email');
      return;
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) {
      res.status(401).send('Invalid credentials');
      return;
    }

    // Generate jwt token
    const payload = {
      _id: user._id,
    };

    const token = await jwt.generate(payload);

    res.json({
      user: {
        _id: user._id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    });
  } catch (error) {
    console.dir(error, { depth: null });
    res.status(500).json(error);
  }
});
// router.get('/me', authorize, UserController.me);

module.exports = router;
