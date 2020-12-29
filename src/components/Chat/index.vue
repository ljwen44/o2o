<template>
    <el-container>
        <el-main>
            <el-row class="chatHeader">
                {{recuser.userName || userName}}
            </el-row>
            <el-row class="chatWrapper">
                <ul ref="chatUL">
                    <li :class="item.user._id === user._id ?'right':'left'" v-for="(item, index) in list" :key="index">
                        <div>
                            <el-avatar 
                                shape="square" 
                                style="cursor: pointer;"
                                :size="40" 
                                :src="item.user.avatar" 
                                @click="toUserDetail(item.user._id)"></el-avatar>
                            <cite class="userName">{{item.user.userName}}</cite>
                        </div>
                        <div class="chatContent">
                            <p v-html="item.desc"></p>
                        </div>
                    </li>
                </ul>
            </el-row>
            <el-row class="sendWrapper">
                <Editor @content="content" ref="editor"></Editor>
                <el-button type="success" @click="sendmsg">发送</el-button>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
import Editor from '_c/Editor/index.vue'
import {mapState} from 'vuex'
export default {
    data() {
        return {
            list: [],
            val: '',
            userName: ''
        }
    },
    methods: {
        // updChat(id){
        //     this.axios.post("/updChatRead", {
        //         uid: this.user._id,
        //         ruid: id
        //     }).then(res => {
        //         if(res.data.message === "OK"){
        //             this.$store.commit('UPDCHATREAD', this.recuser._id)
        //         }
        //     }).catch(err => {
        //         console.log(err)
        //         this.$message("数据获取异常，请稍后重试！")
        //     })
        // },
        ulScroller(){
            setTimeout(()=>{
                this.$refs.chatUL.scrollTop = this.$refs.chatUL.scrollHeight;
            },0)
        },
        content(obj){
            this.val = obj
        },
        // toUserDetail(id){
        //     this.$router.push({
        //         path: "/userDetail",
        //         query: {
        //             _id: id
        //         }
        //     })
        // },
        // 建立用户连接
        // join() {
        //     this.$socket.emit("join", {
        //         uid: this.user._id,
        //     })
        // },
        // 发送消息给后台 用于私发消息
        sendmsg() {
            this.$message(this.val)
            // this.$socket.emit("sendmsg", {
            //     user: this.user,
            //     desc: this.val,
            //     ruser: this.recuser
            // })
        }
    },
    // sockets: {
    //     connect(){
    //         console.log("socket connected")
    //     },
    //     sendMessage(data){
    //         this.list.push(data)
    //         this.ulScroller()
    //         this.$refs.editor.clearContent()
    //         this.$store.commit('UPDSENDCHAT', data)
    //     },
    //     receivemsg(data) {
    //         if(data.user._id === this.recuser._id){
    //             // 当前窗口的聊天
    //             this.list.push(data)
    //             this.ulScroller()
    //             this.$refs.editor.clearContent()
    //             this.$store.commit('UPDRECCHAT', data, true)
    //         } else {
    //             // 不是当前窗口的聊天, 只更新聊天列表
    //             this.$store.commit('UPDRECCHAT', data, false)
    //         }
    //     }
    // },
    created() {
        this.ulScroller()
        // this.join()
    },
    components: {
        Editor
    },
    computed: {
        ...mapState([
            'user',
        ])
    },
    props: {
        recuser: Object
    },
    // watch: {
    //     recuser(newVal, oldVal){
    //         if(newVal.user !== undefined){
    //             newVal = newVal.user
    //         }
    //         this.userName = newVal.userName
    //         this.getData(newVal._id)
    //         this.updChat(newVal._id)
    //         return newVal
    //     },
    // }
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