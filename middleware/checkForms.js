const {
  schema,
  usernameSchema,
  emailSchema,
} = require("../controllers/userControllers");

const checkForm = (req, res, next) => {
  const { value, error } = schema.validate({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
  });

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  if (value) {
    next();
  }
};

const checkUsername = (req, res, next) => {
  const { value, error } = usernameSchema.validate({
    username: req.body.username,
  });

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  if (value) {
    next();
  }
};

const checkEmail = (req, res, next) => {
  const { value, error } = emailSchema.validate({
    email: req.body.email,
  });

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  if (value) {
    next();
  }
};

module.exports = { checkForm, checkEmail, checkUsername };
