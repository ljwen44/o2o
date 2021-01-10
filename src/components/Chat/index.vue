<template>
    <el-container>
        <el-main v-show="recuser.userName">
            <el-row class="chatHeader">
                {{recuser ? recuser.userName : ""}}
            </el-row>
            <el-row class="chatWrapper">
                <ul ref="chatUL">
                    <li :class="item.userUUID === user.userUUID ?'right':'left'" v-for="(item, index) in list" :key="index">
                        <div>
                            <el-avatar 
                                shape="square" 
                                style="cursor: pointer;"
                                :size="40" 
                                :src="item.avatar"></el-avatar>
                            <cite class="userName">{{item.userName}}</cite>
                        </div>
                        <span 
                            class="el-icon-warning-outline" 
                            style="color: red;cursor: pointer;"
                            v-if="item.flag && item.flag === '失败'"
                            @click="sendAgain(item.message, index)"
                        ></span>
                        <div class="chatContent">
                            <p v-html="item.message"></p>
                        </div>
                    </li>
                </ul>
            </el-row>
            <el-row class="sendWrapper">
                <Editor @content="content" ref="editor"></Editor>
                <el-button type="success" @click="sendmsg(val)">发送</el-button>
            </el-row>
        </el-main>
        <el-main v-show="!recuser.userName" class="nochat">
            <img src="../../assets/images/chatbg.png" alt="">
        </el-main>
    </el-container>
</template>

<script>
import Editor from '_c/Editor/index.vue'
import {mapState} from 'vuex'
export default {
    data() {
        return {
            list: [], // 聊天记录
            val: '',
            wsUrl: '',
        }
    },
    methods: {
        ulScroller(){
            setTimeout(()=>{
                this.$refs.chatUL.scrollTop = this.$refs.chatUL.scrollHeight;
            },0)
        },
        getData(id){
            let data = this.$qs.stringify({
                uid: this.user.userUUID,
                ruid: id
            })
            this.axios.post("/chatController/getChatList", data)
            .then(res => {
                if(res.data.message){
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                } else {
                    this.list = res.data.list
                    this.$store.commit("SETCHATREAD", id)
                    this.ulScroller()
                }
            }).catch(err => {
                this.$alert("获取数据异常", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        init(){
            // 连接建立时触发
            this.wsUrl.onopen = () => {
                console.log("连接成功")
            }
            this.wsUrl.onclose = () => {
                console.log("连接关闭")
            }
            // 通信发生错误时触发
            this.wsUrl.onerror = () => {
                // 重新创建长连接
                console.log("连接错误")
                this.reconnect();
            }
            // 客户端接收服务端数据时触发
            this.wsUrl.onmessage = msg => {
                // 业务逻辑处理
                msg = JSON.parse(msg.data)
                if(msg.errMsg === "发送失败"){
                    this.$message(msg.errMsg)
                    this.list[this.list.length-1].flag = "失败"
                } else if(msg.errMsg === "OK") {
                    let obj = {
                        message: msg.message,
                        ctime: msg.time,
                        userUUID: this.recuser.userUUID
                    }
                    this.$store.commit('UPDSENDCHAT', obj)
                } else {
                    // 其他用户发送给当前用户
                    // 1、判断是否是当前窗口聊天对象
                    // 是则直接加到 list
                    // 否则修改状态管理器中发送用户的状态
                    let obj = {
                        userName: msg.userName,
                        avatar: msg.avatar,
                        message: msg.message,
                        userUUID: msg.userUUID,
                        time: msg.time, 
                    }
                    if(this.recuser.userUUID === msg.userUUID){
                        this.list.push(obj)
                        this.$store.commit('UPDCURRENTCHAT', obj)
                    } else{
                        this.$store.commit('UPDCHAT', obj)
                    }
                }
                this.ulScroller()
            }
        },
        reconnect() {
            // 没连接上会一直重连，设置延迟避免请求过多
            setTimeout(() => {
                this.init(this.wsUrl);
            }, 2000)
        },
        content(obj){
            this.val = obj
        },
        // 发送消息给后台 用于私发消息
        sendmsg(val) {
            this.wsUrl.send(JSON.stringify({
                ruid: this.recuser.userUUID,
                uid: this.user.userUUID,
                message: val,
                userName: this.user.userName,
                avatar: this.user.avatar
            }))
            let obj = {
                userUUID: this.user.userUUID,
                avatar: this.user.avatar,
                userName: this.user.userName,
                message: this.val,
                flag: "成功"
            }
            this.list.push(obj)
            this.$refs.editor.clearContent()
            this.ulScroller()
        },
        sendAgain(val, index){
            this.$confirm('确认重新发送该消息吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.wsUrl.send(JSON.stringify({
                    ruid: this.recuser.userUUID,
                    uid: this.user.userUUID,
                    message: val,
                    userName: this.user.userName,
                    avatar: this.user.avatar
                }))
                this.list[index].flag = "成功"
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                })        
            })
        }
    },
    created() {
        this.ulScroller()
        if ('WebSocket' in window) {
            this.wsUrl = new WebSocket("ws://localhost:8080/o2o/webSocket/"+this.user.userUUID);
        } else if ('MozWebSocket' in window) {
            this.wsUrl = new MozWebSocket("ws://localhost:8080/o2o/webSocket/"+this.user.userUUID);
        } else {
            this.wsUrl = new SockJS("ws://localhost:8080/o2o/webSocket/"+this.user.userUUID);
        }
        this.init()
        if(this.recuser.userUUID){
            this.getData(this.recuser.userUUID)
        }
    },
    components: {
        Editor
    },
    computed: {
        ...mapState([
            'user',
            'chat'
        ])
    },
    props: {
        recuser: Object
    },
    watch: {
        recuser(newVal, oldVal){
            this.getData(newVal.userUUID)
            return newVal
        },
    },
    beforeDestroy() {
        if(this.wsUrl){
            this.wsUrl.close()
        }
    },
}
</script>

<style lang='less' scoped>
.el-container{
    .el-main{
        padding: 0;
        overflow: hidden;
        .chatHeader{
            background: #05c3e7;
            line-height: 40px;
            color: #fff;
        }
        .chatWrapper{
            height: 350px;
            background: #fff;
            border-left: 1px solid #ccc;
            ul{
                height: inherit;
                overflow: auto;
                li{
                    padding: 10px;
                    .el-avatar{
                        vertical-align: top;
                    }
                }
                .left{
                    text-align: left;
                    .el-avatar{
                        float: left;
                    }
                    .userName{
                        font-size: 12px;
                        margin-left: 10px;
                        font-style: normal;
                    }
                    .chatContent{
                        display: inline-block;
                        margin-left: 10px;
                        max-width: 60%;
                        border-radius: 4px;
                        background: #fff;
                        padding: 5px 10px;
                        color: #000;
                        margin-top: 5px;
                        font-size: 12px;
                        box-shadow: 0 0 2px #ccc;
                        letter-spacing: 2px;
                        p{
                            color: #000 !important;
                        }
                        /deep/
                        img{
                            width: 100px;
                            height: 100px;
                        }
                    }
                }
                .right{
                    text-align: right;
                    .el-avatar{
                        float: right;
                    }
                    .userName{
                        font-size: 12px;
                        margin-right: 10px;
                        font-style: normal;
                    }
                    .chatContent{
                        text-align: left;
                        display: inline-block;
                        margin-right: 10px;
                        max-width: 60%;
                        border-radius: 4px;
                        background: #517cb3;
                        padding: 5px 10px;
                        color: #fff;
                        margin-top: 5px;
                        font-size: 12px;
                        letter-spacing: 2px;
                        p{
                            color: #fff !important;
                        }
                        /deep/
                        img{
                            width: 100px;
                            height: 100px;
                        }
                    }
                }
            }
        }
        .sendWrapper{
            height: 180px;
            background: rgba(255, 255, 255, 1);
            border-top: 1px solid #ccc;
            position: relative;
            .pic{
                position: absolute;
                top: -10%;
            }
            .textareaWrapper{
                resize: none;
                height: 120px;
                border: none;
                width: 98%;
                padding: 1%;
                font-size: 16px;
            }
            .textareaWrapper:focus{
                border: none;
                outline: none;
            }
            .el-button{
                padding: 5px 15px;
                float: right;
                margin-right: 20px;
                position: absolute;
                bottom: 5%;
                right: 0;
            }
        }
    }
    .nochat{
        background: #e9f1f9;
        height: 570px;
        img{
            margin: 40% auto;
            width: 30%;
        }
    }
}
ul::-webkit-scrollbar{ 
    width:1px;
}
textarea::-webkit-scrollbar{ 
    width:0px;
}
ul::-webkit-scrollbar-track, textarea::-webkit-scrollbar-track{
    background: #ccc;
    border-radius:2px;
    -webkit-border-radius:2px;
    -moz-border-radius:2px;
    -ms-border-radius:2px;
    -o-border-radius:2px;
}
ul::-webkit-scrollbar-thumb, textarea::-webkit-scrollbar-track{
    background: #80a8d9;
    border-radius:10px;
    -webkit-border-radius:10px;
    -moz-border-radius:10px;
    -ms-border-radius:10px;
    -o-border-radius:10px;
}
ul::-webkit-scrollbar-thumb:hover{
    background: #333;
}
ul::-webkit-scrollbar-corner, textarea::-webkit-scrollbar-track{
    background: #179a16;
}
</style>