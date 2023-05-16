import api from "./api";
import TokenService from "./tokenService";

const loginUrl = `${import.meta.env.VITE_LOGIN_ROUTE}`;
const refreshTokenUrl = `${import.meta.env.VITE_REFRESH_TOKEN_ROUTE}`;
const login = async (data) => {
  const response = await api.post(loginUrl, data, { timeout: 30000 });
  return response;
};

const refreshToken=async()=>{
  const user=getCurrentUser();
  return api.post(refreshTokenUrl,user);
}

const getCurrentUser = () => {
  return TokenService.getUser();
};



const logout = () => {
  TokenService.removeUser();
};
const authService = {
  login,
  logout,
  refreshToken,
  getCurrentUser,
};

export default authService;