import * as lockr from 'lockr';
import _ from 'lodash';

const getLocalRefreshToken = () => {
    const user = lockr.get('pf-user');
    return user?.refreshToken;
};

const getLocalAccessToken = () => {
    const user = lockr.get('pf-user');
    return user?.token;
};

const updateLocalTokens = ({token,refreshToken}) => {
    const user = lockr.get('pf-user');
    lockr.set('pf-user', {...user,token,refreshToken});
};

const getUser = () => {
    return lockr.get('pf-user');
};

const setUser = (user) => {
    lockr.set('pf-user', user);
};

const removeUser = () => {
    lockr.rm("pf-user");
};


const TokenService = {
    getLocalRefreshToken,
    getLocalAccessToken,
    updateLocalTokens,
    getUser,
    setUser,
    removeUser,
};

export default TokenService;