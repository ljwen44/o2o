<template>
    <el-main>
        <el-row>
            <el-col :sm="24" :md="24">
                <div class="box">
                    <h3 style="margin-bottom:10px;">我的积分</h3>
                    <el-tooltip class="item" effect="dark" placement="right">
                        <div slot="content">
                            累计积分:{{user.caclIntergral ? user.caclIntergral : 0}}<br>
                            青铜: 1000<br>
                            白银: 5000<br>
                            黄金: 12000<br>
                            大师: 20000<br>
                        </div>
                        <span>当前段位：{{duanArr[active-1]}}</span>
                    </el-tooltip>
                    <el-steps :active="active" align-center style="margin:10px 0;">
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
                        <el-link style="font-size:12px;margin-left:10px;" @click="reflush">刷新</el-link>
                    </span>
                    <el-button type="success" size="medium" @click="drawalVisible = true">提现</el-button>
                    <el-button size="medium" @click="payVisible = true">充值</el-button>
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
                        :type="user.auth !== '未认证' ? 'info':'success'" 
                        :disabled="user.auth !== '未认证' ? true : false"
                        v-if="user.type==='教员'"
                        style="margin-left: 10px; margin-top:10px;"
                        @click="handleAuth">
                        {{user.auth !== '未认证' ? "已认证": "申请认证"}}
                    </el-button>
                </div>
                <div class="box">
                    <h3>用户评价</h3>
                    <el-card v-if="list.length">
                        <div class="content" v-for="(item, index) in list" :key="index">
                            <div class="contentHeader">
                                <el-avatar :src="item.avatar"></el-avatar>
                                <span class="name">{{item.userName}}</span>
                                <el-rate
                                    v-model="item.erate"
                                    disabled
                                    show-score
                                    text-color="#ff9900"
                                    score-template="{value}">
                                </el-rate>
                            </div>
                            <div class="contentBody">
                                <p>{{item.content}}</p>
                                <p><i class="el-icon-time"></i>{{item.etime | timeFilter('yyyy-MM-dd')}}</p>
                            </div>
                        </div>
                    </el-card>
                    <p v-else>暂时还没有用户评价</p>
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
        <!-- 充值窗口 -->
        <el-dialog title="学币充值" :visible.sync="payVisible">
            <div v-if="!qrcode">
                <p class="pay">兑换规则: 1元=1学币</p>
                <p class="pay">注意事项：支付前请检查您要充值的金额，只能充值 1 的整数倍金额，一次最多充值1000元.</p>
                <el-input-number 
                    v-model="paynum"
                    :min="1" 
                    :max="1000" 
                    size="small">
                </el-input-number><br>
                <el-button 
                    size="small" 
                    @click="handlePay"
                >充值</el-button>
            </div>
            <div v-show="qrcode">
                <div ref="qrcode" id="qrcode"></div>
                <el-button type="primary" size="mini" @click="confirmPay">确定支付</el-button>
            </div>
        </el-dialog>
        <!-- 提现窗口 -->
        <el-dialog title="提现窗口" :visible.sync="drawalVisible">
            <el-form label-position="left" label-width="100px" :model="form" :rules="rules" ref="form">
                <el-form-item label="支付宝账号" prop="account">
                    <el-input v-model="form.account"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="userName">
                    <el-input v-model="form.userName"></el-input>
                </el-form-item>
                <el-form-item label="提现金额" prop="amount">
                    <el-input v-model="form.amount"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="handleDrawal('form')">提现</el-button>
        </el-dialog>
    </el-main>
</template>

<script>
import QRCode from "qrcode2"
import { mapState } from 'vuex'
export default {
    data() {
        return {
            list: [],
            dialogVisible: false,
            payVisible: false,
            drawalVisible: false,
            num: '',
            paynum: '',
            active: null,
            duanArr: ['青铜', '白银', '黄金', '大师'],
            qrcode: false,
            out_trade_no: '',
            visible: false,
            form: {
                account: '',
                amount: '',
                userName: ''
            },
            rules: {
                userName: [
                    { required: true, message: '请输入支付宝真实姓名', trigger: 'blur' },
                ],
                account: [
                    { required: true, message: '请输入支付宝账号', trigger: 'blur' },
                ],
                amount: [
                    { required: true, message: '请输入提现金额', trigger: 'blur' },
                ]
            }
        }
    },
    created() {
        this.user.bir ? '' : this.user.bir = ''
        let caclIntergral = this.user.caclIntergral
        if(caclIntergral <= 5000){
            this.active = 1
        } else if(caclIntergral > 5000 && caclIntergral <= 12000){
            this.active = 2
        } else if(caclIntergral > 12000 && caclIntergral <= 20000){
            this.active = 3
        } else {
            this.active = 4
        }
        this.getData()
    },
    computed: {
        ...mapState([
            'user',
        ])
    },
    methods: {
        handleAuth(){
            if(this.user.authStatus === "已申请"){
                this.$alert("您已申请认证，请等待管理员处理", "提示", {
                    confirmButtonText: "确定"
                })
            } else {
                let data = this.$qs.stringify({
                    uid: this.user.userUUID
                })
                this.axios.post("/userController/updAuthStatus", data)
                .then(res => {
                    if(res.data.message){
                        this.$alert(res.data.message, "提示", {
                            confirmButtonText: "确定",
                            callback: () => {
                                this.$store.commit('SETUSER', res.data.user)
                            }
                        })
                    } else {
                        this.$alert("申请成功，等待管理员审核", "提示", {
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
        // 积分兑换
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
        },
        // 学币充值
        handlePay(){
            if(!Number.isInteger(this.paynum)){
                this.$message("输入金额只能输入1的倍数")
                return
            }
            let data = this.$qs.stringify({
                uid: this.user.userUUID,
                paynum: this.paynum
            })
            this.axios.post("/alipayController/QRcode", data)
            .then(res => {
                if(res.data.message){
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                } else {
                    this.qrcode = true
                    let qrcode = new QRCode("qrcode", {
                        width: 200,
                        height: 200,
                        text: res.data.QRcode
                    })
                    this.out_trade_no = res.data.out_trade_no
                }
            }).catch(err => {
                this.$alert("操作失败，请稍后重试!", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        getData(){
            let data = this.$qs.stringify({
                uid: this.user.userUUID
            })
            this.axios.post('/evaluateController/getEvaListByUID', data)
            .then(res => {
                if(res.data.message){
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                } else {
                    this.list = res.data.list
                    for(let i = 0; i < this.list.length; i++){
                        this.list[i].erate = parseInt(this.list[i].erate)
                    }
                }
            }).catch(err => {
                this.$alert("获取数据异常", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        // 确定支付
        confirmPay(){
            let data = this.$qs.stringify({
                apid: this.out_trade_no
            })
            this.axios.post("/alipayController/confirmPay", data)
            .then(res => {
                if(res.data.message){
                    this.$message({
                        type: "danger",
                        message: res.data.message
                    })
                } else {
                    this.user.coin += parseInt(res.data.coin)
                    this.$store.commit('SETUSER', this.user)
                    this.qrcode = false
                    this.payVisible = false
                    this.$message({
                        type: "success",
                        message: "支付成功!"
                    })
                }
            }).catch(err => {
                this.$message({
                    type: "danger",
                    message: "操作异常，请稍后重试!"
                })
            })
        },
        reflush(){
            let data = this.$qs.stringify({
                uid: this.user.userUUID
            })
            this.axios.post("/userController/reCoin", data)
            .then(res => {
                if(res.data.message){
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                } else {
                    this.user.coin = res.data.coin
                    this.$store.commit("SETUSER", this.user)
                }
            }).catch(err => {
                this.$alert("刷新失败，请稍后重试!", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        handleDrawal(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(!Number.isInteger(parseInt(this.form.amount))){
                        this.$message({
                            message: "提现金额需为1的整数倍",
                            type: "warning"
                        })
                        return false
                    }
                    let data = this.$qs.stringify({
                        amount: this.form.amount,
                        account: this.form.account,
                        userName: this.form.userName,
                        uid: this.user.userUUID
                    })
                    this.axios.post("/alipayController/drawal", data)
                    .then(res => {
                        if(res.data.message){
                            this.$alert("提现失败，请稍后重试", "提示", {
                                confirmButtonText: "确定"
                            })
                            console.log(res.data.message)
                        } else {
                            this.user.coin -= parseInt(res.data.coin)
                            this.$store.commit("SETUSER", this.user)
                            this.$message({
                                message: "提现成功，请稍后到支付宝查看",
                                type: "success"
                            })
                            this.drawalVisible = false
                        }
                    }).catch(err => {
                        this.$alert("操作失败，请刷新重试!", "提示", {
                            confirmButtonText: "确定"
                        })
                    })
                } else {
                    return false;
                }
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
        width: 30%;
        p{
            font-weight: 600;
            margin-bottom: 10px;
        }
        .pay{
            color: #ccc;
            text-align: left;
            font-size: 14px;
        }
        #qrcode{
            img{
                margin: 5px auto;
            }
        }
        .el-button{
            margin-top: 20px;
        }
    }
}
</style>