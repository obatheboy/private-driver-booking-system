export const getToken = () => {
  return localStorage.getItem("driver_token");
};

export const setToken = (token) => {
  localStorage.setItem("driver_token", token);
};

export const logout = () => {
  localStorage.removeItem("driver_token");
};
