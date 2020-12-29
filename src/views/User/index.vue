<template>
    <el-main>
        <el-col :sm="5" :md="5">
            <div class="userInfoWrapper">
                <el-avatar :size="70" :src="user.avatar" @error="errorHandler" class="user_avater">
                    <img src="images/default.jpg"/>
                </el-avatar>
                <p style="margin: 10px 0;">{{user.userName}}</p>
                <el-tag type="info" class="flag" v-if="user.type==='教员'">
                    <i class="iconfont icon-renzheng" :style="{color: user.auth ? 'green': 'grey'}">
                        {{user.auth ? '已认证': '未认证'}}
                    </i>
                </el-tag>
                <p style="margin-top:10px;">积分: {{user.integral ? user.integral : 0}}</p>
            </div>
            <el-menu
                :router="true"
                :default-active="$route.path"
                :unique-opened="true"
                class="el-menu-vertical-demo">
                <el-menu-item index="/user/myzl">
                    <i class="el-icon-document"></i>
                    <span slot="title">我的资料</span>
                </el-menu-item>
                <el-menu-item index="/user/message">
                    <i class="el-icon-chat-dot-round"></i>
                    <span slot="title">消息列表</span>
                </el-menu-item>
                <el-submenu index="/user/friend">
                    <template slot="title">
                        <i class="el-icon-user"></i>
                        <span>好友列表</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/user/friend/myfriend">
                            <i class="iconfont icon-biaoqing ileft" style="font-size:22px;"></i>
                            <span slot="title">我的好友</span>
                        </el-menu-item>
                        <el-menu-item index="/user/friend/apply">
                            <i class="iconfont icon-tianjiahaoyou ileft"></i>
                            <span slot="title">好友申请</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-menu-item index="/user/order" v-if="user.type==='教员'">
                    <i class="el-icon-copy-document"></i>
                    <span slot="title">我的订单</span>
                </el-menu-item>
                <el-submenu index="/user/pjob">
                    <template slot="title">
                        <i class="el-icon-collection-tag"></i>
                        <span>兼职信息</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/user/pjob/mypub/index">
                            <i class="el-icon-copy-document ileft"></i>
                            <span slot="title">我的发布</span>
                        </el-menu-item>
                        <el-menu-item index="/user/pjob/pub">
                            <i class="el-icon-edit-outline ileft"></i>
                            <span slot="title">发布兼职</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-menu-item index="/user/security">
                    <i class="el-icon-setting"></i>
                    <span slot="title">安全中心</span>
                </el-menu-item>
                <el-menu-item index="/user/sysNotice">
                    <i class="el-icon-bell"></i>
                    <span slot="title">系统通知</span>
                </el-menu-item>
            </el-menu>
        </el-col>
        <el-col :sm="18" :md="18">
            <router-view></router-view>
        </el-col>
    </el-main>
</template>

<script>
import {mapState} from 'vuex'
export default {
    data() {
        return {

        }
    },
    methods: {
        errorHandler(){
            return true
        }
    },
    computed: {
        ...mapState([
            'user'
        ])
    }
}
</script>

<style lang='less' scoped>
.el-main{
    padding: 0;
    .el-col:nth-child(1){
        background:rgba(255,255,255,.5);
        margin-left:10px;
        .userInfoWrapper{
            padding: 20px 0;
            background: #05c3e7;
            color: #fff;
            .el-tag{
                i{
                    font-size: 12px;
                }
            }
        }
        .el-menu{
            border-right: 0;
            background: transparent;
        }
    }
    .el-col:nth-child(2){
        background: rgba(255,255,255,.8);
        // padding: 20px;
    }
}
.ileft{
    margin-left: 40px;
    margin-right: 5px;
    font-size: 18px;
}
</style>