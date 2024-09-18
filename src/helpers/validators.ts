const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  return passwordRegex.test(password);
};

const validateUserName = (userName: string): boolean => {
  const userNameRegex = /^[a-z0-9_]{5,20}$/;
  return userNameRegex.test(userName);
}

const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z ]{2,50}$/;
  return nameRegex.test(name);
}

const validateImageURL = (url: string): boolean => {
  const urlRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/;
  return urlRegex.test(url);
}

export { validateEmail, validatePassword, validateUserName, validateName, validateImageURL };