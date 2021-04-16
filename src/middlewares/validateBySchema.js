module.exports = (schema) => async (req, res, next) => {
  try {
    const schemaValid = await schema.isValid(req.body);

    if (!schemaValid) {
      res.status(422).send('Validation error');
      return;
    }

    next();
  } catch (error) {
    res.status(500).json(error);
    return;
  }
};
