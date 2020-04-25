import auth from "@/utils/auth"

function getAuthorization() {
    if (auth.getUser().token === undefined) {

    } else {
        return { 'Authorization': auth.getUser().token }
    }
}

const axiosConfig = {
    baseURL: '/',
    // 请求后的数据处理
    transformResponse: [function(data) {
        return data
    }],
    // 超时设置s
    timeout: 30000,
    headers: getAuthorization(),
    responseType: 'json'
}

export default axiosConfig