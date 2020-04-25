import Cookies from 'js-cookie'
const TokenKey = 'User-Cookie';
const NameKey = 'User-Name';

export default {
    isLogin() {
        return Cookies.get(TokenKey) ? true : false
    },
    setUser(token, name, avatar) {
        Cookies.set(TokenKey, token);
        Cookies.set(NameKey, name);
    },
    getUser() {
        return {
            // token: 'dadsa',
            token: Cookies.get(TokenKey),
            name: Cookies.get(NameKey),
        }
    },
    removeUser() {
        Cookies.remove(TokenKey);
        Cookies.remove(NameKey);
    }
}