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
                <div class="userInfoWrapper" v-else @click="goUser">
                    <el-avatar :size="40" :src="user.avatar" @error="errorHandler">
                        <img src="images/default.jpg"/>
                    </el-avatar>
                    <span>{{user.userName}}</span>
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
                this.$store.commit('DELUSER')
                this.$router.push('/login')
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
            'user'
        ])
    },
    created() {
        let localUser = localStorage.getItem('_o2o_user')
        if(localUser){
            this.$store.commit('SETUSER', JSON.parse(localUser))
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