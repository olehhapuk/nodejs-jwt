const jwt = require('jsonwebtoken');

module.exports = {
  generate: (payload) => {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, process.env.JWT_SECRET, (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      });
    });
  },
  verify: (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
          reject(error);
        } else {
          resolve(decoded);
        }
      });
    });
  },
};
