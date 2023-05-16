import axios from "axios";
const baseUrl = 'http://localhost:3001/api/getdata';

const instance = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

// import axios from "axios";
// import TokenService from "./tokenService";
// import authService from "./authService";
// import { Config } from "../../config";


// const baseUrl = Config.baseApiUrl;
// const tokenUrl = import.meta.env.VITE_LOGIN_ROUTE;

// const sscUsername = import.meta.env.VITE_SSC_USERNAME;


// const instance = axios.create({
//     baseURL: baseUrl,
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

// if (sscUsername) {
//     instance.defaults.headers.common["ssc-username"] = sscUsername;
// }

// instance.interceptors.request.use(
//     (config) => {
//         const token = TokenService.getLocalAccessToken();
//         if (token) {
//             // config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
//             config.headers["x-auth-token"] = token; // for Node.js Express back-end
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// instance.interceptors.response.use(
//     (res) => {
//         return res;
//     },
//     async (err) => {
//         const originalConfig = err.config;

//         if (originalConfig.url !== tokenUrl && err.response) {
//             // Access Token was expired
//             if (err.response.status === 401 && !originalConfig._retry) {
//                 try {

                    
//                     originalConfig._retry = true;
//                     const rs = await authService.refreshToken();
//                     const { token,refreshToken,  Success ,ErrorCode,Message } = rs.data;
//                     if (Success === false) throw {code:ErrorCode,message:Message};
//                     if (token)
//                         TokenService.updateLocalTokens({token,refreshToken,})

//                     return instance(originalConfig);
//                 } catch (_error) {
//                     return Promise.reject(_error);
//                 }
//             }
//             else if (err.response.status === 400) {
//                 return err.response;
//             }
//         }

//         return Promise.reject(err);
//     }
// );

export default instance;