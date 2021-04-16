const { jwt } = require('../utils');
const { User } = require('../schemas');

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      res.status(401).send('Unauthorized');
      return;
    }

    const token = req.headers.authorization.replace('Bearer ', '');

    const decoded = await jwt.verify(token);

    const user = await User.findById(decoded._id);

    res.locals.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      console.dir(error, { depth: null });
      res.status(401).send('Unauthorized');
      return;
    }

    console.dir(error, { depth: null });
    res.status(500).json(error);
  }
};
