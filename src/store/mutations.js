/*
    1、这里只存放对 state 中定义的数据进行监听的方法
    2、格式为 方法名(state, val){ 方法体 }
*/
let arr = [
    '_o2o_user',
]
const mutations = {
    SETUSER(state, user){
        state.user = {...state.user, ...user}
        localStorage.setItem('_o2o_user', JSON.stringify(state.user))
    },
    DELUSER(state){
        for(let key in state.user){
            state.user[key] = ''
        }
        Object.keys(localStorage).forEach(item => {
            if(arr.includes(item)){
                localStorage.removeItem(item)
            }
        })
    },
}

export default mutations