//email regex reference https://medium.com/@sketch.paintings/email-validation-with-javascript-regex-e1b40863ed23
const validateEmail = (email) => {
  const errors = [];
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    errors.push("Invalid email address");
  }
  return errors;
};

const validateUsername = (username) => {
  const errors = [];
  if (!/^[a-zA-Z]$/.test(username[0])) {
    errors.push("First letter must be a character");
  }
  if (username.length < 5 || username.length > 20) {
    errors.push("Username can only be 5-20 characters long");
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push("Username can only contain numbers, alphabets, underscore");
  }
  return errors;
};

//password regex reference https://dev.to/rasaf_ibrahim/write-regex-password-validation-like-a-pro-5175
const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8 || password.length > 20) {
    errors.push("password can only be 8-20 characters long");
  }
  if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* )/.test(password)) {
    errors.push(
      "Password must contain a digit, a lowercase character, a uppercase character, a special character"
    );
  }
  return errors;
};

export const validateLoginData = (loginData) => {
  const error = {};
  const { email, password } = loginData;
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  if (emailError.length) {
    error.email = emailError;
  }
  if (passwordError.length) {
    error.password = passwordError;
  }
  return error;
};

export const validateSignUpData = (signupData) => {
  const error = {};
  const { username, email, password, confirmPassword } = signupData;
  const emailError = validateEmail(email);
  const usernameError = validateUsername(username);
  const passwordError = validatePassword(password);
  const confirmPasswordError = [];

  if (emailError.length) {
    error.email = emailError;
  }
  if (usernameError.length) {
    error.username = usernameError;
  }
  if (passwordError.length) {
    error.password = passwordError;
  }
  if (confirmPassword === "") {
    confirmPasswordError.push("confirm password cannot be empty");
  }
  if (confirmPassword !== password) {
    confirmPasswordError.push("confirm password should be same as password");
  }
  if (confirmPasswordError.length) {
    error.confirmPassword = confirmPasswordError;
  }
  return error;
};
