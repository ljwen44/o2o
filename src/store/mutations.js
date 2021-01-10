/*
    1、这里只存放对 state 中定义的数据进行监听的方法
    2、格式为 方法名(state, val){ 方法体 }
*/
let arr = [
    '_o2o_user',
    '_o2o_chat',
    '_o2o_sign'
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
    // 签到表
    SETSIGN(state, obj){
        state.sign = obj
        localStorage.setItem('_o2o_sign', JSON.stringify(state.sign))
    },
    ADDSIGN(state, obj){
        state.sign.push(obj)
        localStorage.setItem('_o2o_sign', JSON.stringify(state.sign))
    },

    // 赋值聊天列表
    SETCHAT(state, chatArr){
        state.chat = chatArr
        localStorage.setItem('_o2o_chat', JSON.stringify(state.chat))
    },
    ADDCHAT(state, chat){
        state.chat.unshift(chat)
        localStorage.setItem('_o2o_chat', JSON.stringify(state.chat))
    },
    DELCHAT(state, index){
        state.chat.splice(index, 1)
        localStorage.setItem('_o2o_chat', JSON.stringify(state.chat))
    },

    // 接收聊天的操作
    UPDCHAT(state, chat){
        let flag = false // 是否存在聊天列表
        let obj = {}
        for(let i = 0; i < state.chat.length; i++){
            if(state.chat[i].userUUID === chat.userUUID){
                state.chat[i].readNum += 1
                state.chat[i].time = chat.time
                state.chat[i].message = chat.message
                obj = state.chat[i]
                state.chat.splice(i, 1)
                state.chat.unshift(obj)
                flag = true
                break
            }
        }
        if(!flag){
            chat.readNum = 1
            state.chat.unshift(chat)
        }
        localStorage.setItem('_o2o_chat', JSON.stringify(state.chat))
    },

    // 发送聊天的操作
    UPDSENDCHAT(state, obj){
        for(let i = 0; i < state.chat.length; i++){
            if(state.chat[i].userUUID === obj.userUUID){
                state.chat[i].ctime = obj.ctime
                state.chat[i].message = obj.message
                break
            }
        }
        localStorage.setItem('_o2o_chat', JSON.stringify(state.chat))
    },

    // 接收聊天时为当前窗口聊天对象
    UPDCURRENTCHAT(state, chat){
        for(let i = 0; i < state.chat.length; i++){
            if(state.chat[i].userUUID === chat.userUUID){
                state.chat[i].time = chat.time
                state.chat[i].message = chat.message
                break
            }
        }
        localStorage.setItem('_o2o_chat', JSON.stringify(state.chat))
    },

    // 进入聊天页时更新消息状态
    UPDMSGCHAT(state, list){
        for(let i = 0; i < list.length; i++){
            let flag = false
            for(let j = 0; j < state.chat.length; j++){
                if(state.chat[j].userUUID === list[i].userUUID){
                    state.chat.splice(j, 1)
                    state.chat.unshift(list[i])
                    flag = true
                }
                break
            }
            if(!flag){
                state.chat.unshift(list[i])
            }
        }
        localStorage.setItem('_o2o_chat', JSON.stringify(state.chat))
    },

    // 修改当前窗口聊天对象的状态
    SETCHATREAD(state, id){
        for(let i=0; i < state.chat.length; i++){
            if(state.chat[i].userUUID === id){
                state.chat[i].readNum = 0
                break
            }
        }
        localStorage.setItem('_o2o_chat', JSON.stringify(state.chat))
    }
}

export default mutations