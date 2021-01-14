<template>
    <el-header>
        <el-row type="flex" justify="center" align="space-between">
            <el-col :xs="6" :sm="10" :md="6" :lg="6" :xl="2">
                <router-link to="/">
                    <img src="../../assets/images/logo.png" alt="" width="120" height="60">
                </router-link>
            </el-col>
            <el-col :xs="18" :sm="14" :md="18" :lg="18" :xl="22" class="loginBox">
                <router-link to="/login" tag="span" v-if="!user.userName" class="login">登录</router-link>
                <div class="userInfoWrapper" v-else>
                    <el-avatar :size="40" :src="user.avatar" @error="errorHandler">
                        <img src="images/default.jpg"/>
                    </el-avatar>
                    <router-link to="/user" tag="span" style="margin-right: 20px;">{{user.userName}}</router-link>
                    <router-link to="/message" tag="span">消息</router-link>
                </div>
                <span @click="logout" class="logout" v-if="user.userName">退出</span>
            </el-col>
        </el-row>
    </el-header>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {

        }
    },
    methods: {
        errorHandler(){
            return true
        },
        logout(){
            this.$confirm('确定退出登录吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'primary'
            }).then(() => {
                let data = this.$qs.stringify({
                    uid: this.user.userUUID,
                    chat: JSON.stringify(this.chat),
                    sign: JSON.stringify(this.sign)
                })
                this.axios.post("/loginController/logout", data)
                .then(res => {
                    if(res.data.message){
                        this.$alert(res.data.message, "提示", {
                            confirmButtonText: "确定"
                        })
                    } else {
                        this.$alert("退出成功!", "提示", {
                            confirmButtonText: "确定",
                            callback: () => {
                                this.$store.commit('DELUSER')
                                this.$router.push('/login')
                            }
                        })
                    }
                }).catch(err => {
                    console.log(err)
                    this.$alert("退出失败，请刷新重试!", "提示", {
                        confirmButtonText: "确定"
                    })
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                })       
            })
        },
        goUser(){
            this.$router.push('/user')
        }
    },
    computed: {
        ...mapState([
            'user',
            'chat',
            'sign'
        ])
    },
    created() {
        let localUser = localStorage.getItem('_o2o_user')
        if(localUser){
            let user = JSON.parse(localUser)
            if(user.type === "管理员"){
                this.$store.commit('SETUSER', user)
                this.$router.push("/admin")
            } else {
                this.$store.commit('SETUSER', user)
            }
        }
        let localChat = localStorage.getItem("_o2o_chat")
        if(localChat){
            this.$store.commit('SETCHAT', JSON.parse(localChat))
        }
        let localsign = localStorage.getItem('_o2o_sign')
        if(localsign){
            this.$store.commit('SETSIGN', JSON.parse(localsign))
        }
    }
}
</script>

<style lang='less' scoped>
.el-header{
    padding: 0;
    z-index: 1111;
    .el-row{
        position: fixed;
        top: 0;
        height: 60px;
        width: 100%;
        background: #05c3e7;
        color: #fff;
        line-height: 60px;
        .loginBox{
            text-align: right;
            .login{
                float: right;
                margin-right: 20px;
                cursor: pointer;
            }
            .userInfoWrapper{
                display: inline-block;
                cursor: pointer;
                .el-avatar {
                    vertical-align: middle;
                    margin-right: 10px;
                }
            }
            .logout{
                margin: 0 30px;
                font-size: 14px;
                cursor: pointer;
            }
        }
    }
}
</style>