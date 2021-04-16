const yup = require('yup');

module.exports = yup.object().shape({
  password: yup.string().min(6).required(),
});
