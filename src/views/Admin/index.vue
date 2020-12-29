<template>
    <el-container>
        <el-aside :width="isCollapse ? '65px' : '15%'">
            <el-avatar :size="isCollapse ? 50 : 80" :src="user.avatar" style="margin: 20px 0;" fit="fill"></el-avatar>
            <el-menu 
                class="el-menu-vertical-demo" 
                :collapse="isCollapse"
                :router="true"
                :default-active="$route.path"
                :unique-opened="true">
                <el-menu-item index="/admin/analysis">
                    <i class="el-icon-s-marketing"></i>
                    <span slot="title">数据分析</span>
                </el-menu-item>
                <el-menu-item index="/admin/index/main">
                    <i class="el-icon-s-home"></i>
                    <span slot="title">首页管理</span>
                </el-menu-item>
                <el-submenu index="/admin/user">
                    <template slot="title">
                        <i class="el-icon-user"></i>
                        <span>用户管理</span>
                    </template>
                    <el-menu-item-group class="menuitem">
                        <el-menu-item index="/admin/user/auth">
                            <i class="el-icon-user-solid ileft"></i>认证管理
                        </el-menu-item>
                        <el-menu-item index="/admin/user/all">
                            <i class="el-icon-document"></i>查看用户
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-menu-item index="/admin/jobInfo">
                    <i class="el-icon-document"></i>
                    <span slot="title">求教管理</span>
                </el-menu-item>
                <el-menu-item index="/admin/security">
                    <i class="el-icon-setting"></i>
                    <span slot="title">安全中心</span>
                </el-menu-item>
            </el-menu>
            <span class="switch" @click="isCollapse = !isCollapse"><i class="el-icon-s-fold"></i></span>
        </el-aside>
        <el-container class="main" :style="{'margin-left': isCollapse ? '65px':'15%'}">
            <el-header :style="{'width': isCollapse ? 'calc(100vw - 65px)':'85%'}">
                <img src="../../assets/images/logo.png" width="120" height="60">
                <p class="userInfo">
                    <span>{{user.userName}}</span>
                    <span @click="logout">退出</span>
                </p>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            src: "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1819551051,2084395800&fm=26&gp=0.jpg",
            isCollapse: false
        }
    },
    computed: {
        ...mapState([
            'user'
        ])
    },
    methods: {
        logout(){
            // this.$confirm()
            console.log("退出")
        }
    },
}
</script>

<style lang='less' scoped>
.el-container{
    .el-aside{
        position: fixed;
        top: 0;
        bottom: 0;
        background: #05c3e7;
        .el-menu{
            background: transparent;
            border-right: none;
            .el-menu-item{
                color: #fff;
                i{
                    color: #fff;
                }
            }
            /deep/ 
            .el-submenu__title{
                color: #fff;
                i{
                    color: #fff;
                }
            }
            /deep/
            .el-menu--inline{
                background: #9bddf1;
            }
            .el-menu-item:hover{
                background-color: #68a9f3;
            }
            .el-menu-item:focus{
                background-color: #68a9f3;
            }
            /deep/
            .el-submenu__title:hover{
                background-color: #68a9f3;
            }
            /deep/
            .el-submenu__title:focus{
                background-color: #68a9f3;
            }
        }
        .switch{
            float: left;
            line-height: 60px;
            font-size: 24px;
            color: #2f6bde;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            cursor: pointer;
        }
    }
    .main{
        .el-header{
            position: fixed;
            top: 0;
            background: #13d0f4;
            width: 100%;
            z-index: 122;
            img{
                float: left;
            }
            .userInfo{
                float: right;
                line-height: 60px;
                span{
                    color: #fff;
                    margin-left: 20px;
                    cursor: pointer;
                }
            }
        }
        .el-main{
            margin-top: 20px;
        }
    }
}
</style>