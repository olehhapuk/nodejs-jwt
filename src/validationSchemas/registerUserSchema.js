const yup = require('yup');

module.exports = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});
