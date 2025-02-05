import Validator from "validator";
import isEmpty from "is-empty";

const validateInput = (data) => {
  const errors = {};
  //convert empty fiels to string so we can use validator
  data.username = !isEmpty(data.username) ? data.username : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  //username check
  if (Validator.isEmpty(data.username)) {
    errors.username = "Username field is required";
  }

  //email check
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email field is invalid";
  }

  //password check
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  } else if (!Validator.isLength(data.password, { min: 5 })) {
    errors.password = "Password must be at least 5 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validateLoginInput = (data) => {
  const errors = {};
  //convert empty fiels to string so we can use validator
  data.user = !isEmpty(data.user) ? data.user : "";

  //user check
  if (Validator.isEmpty(data.user)) {
    errors.user = "User field is required";
  } 

  //password check
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  } else if (!Validator.isLength(data.password, { min: 5 })) {
    errors.password = "Password must be at least 5 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validateEmail = (data) => {
  const errors = {};
  data.email = !isEmpty(data.email) ? data.email : "";
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email field is invalid";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};


const validatePassword = (data) => {
  const errors = {};
  //convert empty fiels to string so we can use validator
  data.password = !isEmpty(data.password) ? data.password : "";

  //password check
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  } else if (!Validator.isLength(data.password, { min: 5 })) {
    errors.password = "Password must be at least 5 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export { validateInput, validateLoginInput, validateEmail, validatePassword };
