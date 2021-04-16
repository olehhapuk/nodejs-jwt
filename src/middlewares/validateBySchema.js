module.exports = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, {
      abortEarly: false,
    });

    next();
  } catch (error) {
    res.status(422).json(error);
    return;
  }
};
