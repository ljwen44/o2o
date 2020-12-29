import Cookies from 'js-cookie'

// 存取 token
export const setToken = (tokenName) => {
    return Cookies.set(tokenName)
}

// 获取 token
export const getToken = (tokenName) => {
    return Cookies.get(tokenName)
}