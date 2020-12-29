<template>
    <el-main>
        <el-row>
            <el-col :sm="24" :md="24">
                <div class="box">
                    <h3 style="margin-bottom:10px;">我的积分</h3>
                    <el-tooltip class="item" effect="dark" placement="right">
                        <div slot="content">
                            累计积分{{user.caclIntegral ? user.caclIntegral : 0}}<br>
                            青铜: 1000<br>
                            白银: 5000<br>
                            黄金: 12000<br>
                            大师: 20000<br>
                        </div>
                        <span>当前段位：青铜</span>
                    </el-tooltip>
                    <el-steps :active="1" align-center style="margin:10px 0;">
                        <el-step title="青铜"></el-step>
                        <el-step title="白银"></el-step>
                        <el-step title="黄金"></el-step>
                        <el-step title="大师"></el-step>
                    </el-steps>
                    <span class="icon">
                        <i class="iconfont icon-ziyuan"></i>可用积分: {{user.integral ? user.integral : 0}}
                        <el-button type="primary" size="mini" @click="dialogVisible = true">兑换</el-button>
                    </span>
                    <span class="icon">
                        <i class="iconfont icon-jinbishangcheng"></i>我的学币: {{user.coin ? user.coin : 0}}
                        <el-button type="success" size="mini">提现</el-button>
                        <el-button size="mini">充值</el-button>
                    </span>
                </div>
                <div class="box">
                    <h3>基本资料</h3>
                    <p>
                        <span>姓名：{{user.userName}}</span>
                        <span>性别：{{user.sex}}</span>
                    </p>
                    <p>
                        <span>手机号码： {{user.phone}}</span>
                        <span>邮箱：{{user.email}}</span>
                    </p>
                    <p>
                        <span>学历：{{user.record}}</span>
                        <span>毕业学校：{{user.school}}</span>
                    </p>
                    <p>
                        <span>期望城市: {{user.city}}</span>
                    </p>
                    <p>
                        简介：{{user.introduce}}
                    </p>
                    <p>
                        证件：
                        <el-image 
                            style="width: 150px;"
                            :src="user.IDpass" 
                            :preview-src-list="[user.IDpass]">
                        </el-image>
                    </p>
                    <router-link to="/user/edit">
                        <el-button type="primary" style="margin-left: 10px; margin-top:10px;">编辑资料</el-button>
                    </router-link>
                    <el-button 
                        :type="user.auth ? 'info':'success'" 
                        :disabled="user.auth ? true : false"
                        v-if="user.type==='教员'"
                        style="margin-left: 10px; margin-top:10px;"
                        @click="handleAuth">
                        {{user.auth ? "已认证": "申请认证"}}
                    </el-button>
                </div>
                <div class="box">
                    <h3>用户评价</h3>
                    <el-card>
                        <div class="content" v-for="(item, index) in list" :key="index">
                            <div class="contentHeader">
                                <el-avatar :src="item.avatar"></el-avatar>
                                <span class="name">{{item.name}}</span>
                                <el-rate
                                    v-model="item.rate"
                                    disabled
                                    show-score
                                    text-color="#ff9900"
                                    score-template="{value}">
                                </el-rate>
                            </div>
                            <div class="contentBody">
                                <p>{{item.desc}}</p>
                                <p><i class="el-icon-time"></i>{{item.time | timeFilter('yyyy-MM-dd')}}</p>
                            </div>
                        </div>
                    </el-card>
                </div>
            </el-col>
        </el-row>
        <!-- 积分兑换弹窗 -->
        <el-dialog title="积分兑换" :visible.sync="dialogVisible">
            <p>兑换规则: 100积分=1学币</p>
            <el-input-number 
                v-model="num"
                :min="user.integral > 100 ? 1 : 0" 
                :max="Math.floor((user.integral ? user.integral : 0)/100)" 
                size="small">
            </el-input-number><br>
            <el-button 
                size="small" 
                @click="handleExchange" 
                :disabled="(user.integral && user.integral> 100) ? false: true"
            >兑换</el-button>
        </el-dialog>
    </el-main>
</template>

<script>
import { mapState } from 'vuex'
import {evaluateList} from '@/lib/data.js'
export default {
    data() {
        return {
            list: evaluateList,
            dialogVisible: false,
            num: '',
        }
    },
    created() {
        this.user.bir ? '' : this.user.bir = ''
    },
    computed: {
        ...mapState([
            'user',
        ])
    },
    methods: {
        handleAuth(){
            if(this.user.authStatus === 1){
                this.$alert("您已申请认证，请等待管理员处理", "提示", {
                    confirmButtonText: "确定"
                })
            } else {
                this.axios.post("/updAuthStatus", {
                    _id: this.user._id,
                    authStatus: 1
                }).then(res => {
                    if(res.data.message === "OK"){
                        this.$alert("申请成功！等待管理员处理", "提示", {
                            confirmButtonText: "确定",
                            callback: () => {
                                this.$store.commit('SETUSER', res.data.user)
                            }
                        })
                    } else {
                        this.$alert(res.data.message, "提示", {
                            confirmButtonText: "确定"
                        })
                    }
                }).catch(err => {
                    this.$alert("申请失败，请稍后重试！", "提示", {
                        confirmButtonText: "确定"
                    })
                })
            }
        },
        errorHandler(){
            return true
        },
        handleExchange(){
            let data = this.$qs.stringify({
                num: this.num,
                uid: this.user.userUUID
            })
            this.axios.post("/userController/inteToCoin", data)
            .then(res => {
                if(res.data.message){
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                } else {
                    this.$alert("兑换成功!", "提示", {
                        confirmButtonText: "确定",
                        callback: ()=>{
                            this.user.integral -= this.num * 100
                            this.user.coin += this.num
                            this.dialogVisible = false
                            this.$store.commit("SETUSER", this.user)
                        }
                    })
                }
            }).catch(err => {
                this.$alert("兑换失败，请稍后重试！", "提示",{
                    confirmButtonText: "确定"
                })
            })
        }
    },
}
</script>

<style lang='less' scoped>
.el-main{
    padding: 20px;
    .el-row{
        .el-col{
            .box{
                padding: 0 10px;
                text-align: left;
                margin-bottom: 20px;
                .icon{
                    display: block;
                    margin-bottom: 10px;
                    i{
                        color: #62c4e8;
                        margin-right: 10px;
                    }
                }
                h3{
                   border-left: 5px solid #3cabcf;
                   padding-left: 10px;
                }
                p{
                    margin: 5px 0;
                    padding: 10px;
                    display: flex;
                    span{
                        flex: 1;
                    }
                }
                ul{
                    padding: 10px 0;
                }
                .el-steps{
                    margin-top: 10px;
                }
                .el-card{
                    margin-top: 20px;
                    background: transparent;
                    .content{
                        margin-bottom: 20px;
                        border-bottom: 1px solid #ccc;
                        .contentHeader{
                            .el-avatar{
                                vertical-align: middle;
                            }
                            .name{
                                margin-left: 20px;
                                font-size: 14px;
                            }
                            .el-rate{
                                display: inline;
                                margin-left: 20px;
                            }
                        }
                        .contentBody{
                            p:nth-child(2){
                                font-size: 12px;
                            }
                        }
                    }
                }
            }
        }
    }
    /deep/
    .el-dialog{
        width: 20%;
        p{
            font-weight: 600;
        }
        .el-button{
            margin-top: 20px;
        }
    }
}
</style>