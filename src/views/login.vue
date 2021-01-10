<template>
    <el-container>
        <router-link to="/" tag="h3" class="title">学生-家教兼职系统</router-link>
        <el-main v-show="!updPwd">
            <el-form :model="form" :rules="rules" ref="form" label-width="60px" label-position="left">
                <h3>用户登录</h3>
                <el-form-item label="邮箱" prop="userEmail">
                    <el-input v-model="form.userEmail"  placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="userPwd">
                    <el-input v-model="form.userPwd" type="password"  placeholder="请输入6-12位的密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleLogin('form')">登录</el-button>
                    <el-link @click="handleStatus">点击注册</el-link><br>
                    <el-link @click="handleForget">忘记密码？</el-link>
                </el-form-item>
            </el-form>
            <el-form :model="form" :rules="rules" ref="form" label-width="60px" label-position="left">
                <h3>用户注册</h3>
                <el-form-item label="邮箱" prop="userEmail">
                    <el-input v-model="form.userEmail"  placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="userPwd">
                    <el-input v-model="form.userPwd" type="password" maxlength="12"  placeholder="请输入6-12位的密码"></el-input>
                </el-form-item>
                <el-form-item label="类别"  style="text-align: left;">
                    <el-radio-group v-model="form.type">
                        <el-radio label="学员"></el-radio>
                        <el-radio label="教员"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="手机" prop="userPhone">
                    <el-input v-model="form.userPhone" maxlength="11"  placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="handleRegister">注册</el-button>
                    <el-link @click="handleStatus">点击登录</el-link>
                </el-form-item>
            </el-form>
            <div class="mask" 
                :style="{left: loginBox?'50%':'0','background-position': loginBox? '100% 0' : '0 0'}"
                @click="handleStatus"></div>
        </el-main>
        <el-main v-show="updPwd" class="upd">
            <el-form :model="updForm" :rules="rules" ref="updform" label-width="80px" label-position="right">
                <h3>找回密码</h3>
                <el-form-item label="手机号码" prop="userPhone">
                    <el-input v-model="form.userPhone" maxlength="11">
                        <template slot="append">
                            <el-button @click="sendCode">发送</el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="code">
                    <el-input v-model="form.code"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleUpdate('updform')">修改密码</el-button>
                    <el-link @click="handleForget">登录</el-link>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
export default {
    data() {
        let regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/ // 邮箱验证
        let reg = /^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(17[0,1,3,5,6,7,8]))\d{8}$/ // 手机验证
        let validatePhone = (rule, value, callback) => {
            if(!reg.test(value)){
                callback(new Error('请输入正确的手机号码'))
            } else {
                callback()
            }
        }
        let validateEmail = (rule, value, callback) => {
            if(!regEmail.test(value)){
                callback(new Error('请输入正确的邮箱'))
            } else {
                callback()
            }
        }
        return {
            form: {
                userEmail: '', // 邮箱
                userPwd: '', // 密码
                type: '学员', // 用户类型
                validCode: '', // 验证码
                userPhone: '', // 手机号码
            }, // 表单信息
            loginBox: true, // 登录注册框
            updPwd: false,
            updForm: {
                userPhone: '',
                code: ''
            },
            rules: {
                userPhone: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { validator: validatePhone, trigger: 'blur' }
                ],
                userEmail: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: validateEmail, trigger: 'blur' }
                ],
                userPwd: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min:6, max: 12, message: "密码应是6-12位数字、字母或字符！", trigger: 'blur' }
                ],
                validCode: [
                    { required: true, message: '请输入验证码', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入验证码', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        handleStatus(){
            this.loginBox = !this.loginBox
        },
        handleForget(){
            this.updPwd = !this.updPwd
            this.resetForm()
        },
        sendCode(){
            this.$message("发送验证码")
        },
        handleUpdate(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    return false;
                }
            })
        },
        handleLogin(formName){
            if(!this.form.userEmail){
                this.$message("请输入邮箱")
                return 
            }
            if(!this.form.userPwd){
                this.$message("请输入密码")
                return 
            }
            let data = this.$qs.stringify({
                email: this.form.userEmail,
                password: this.form.userPwd
            })
            this.axios.post('/loginController/login', data)
            .then(res => {
                if(!res.data.message){
                    this.$alert("登录成功！", "提示", {
                        confirmButtonText: "确定",
                        callback: () => {
                            this.$store.commit('SETUSER', res.data.user)
                            if(res.data.user.type === "管理员"){
                                this.$router.push('/admin')
                            } else {
                                console.log(res.data.logout)
                                if(res.data.logout !== undefined){
                                    this.$store.commit('SETCHAT', JSON.parse(res.data.logout.chat))
                                    this.$store.commit('SETSIGN', JSON.parse(res.data.logout.sign))
                                }
                                this.$router.push('/')
                            }
                        }
                    })
                } else {
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                }
            }).catch(err => {
                this.$alert("服务器错误，请刷新重试！", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        handleRegister(){
            if(!this.form.userEmail || !this.form.userPwd || !this.form.userPhone){
                this.$message("请填写信息")
                return 
            }
            let data = this.$qs.stringify({
                email: this.form.userEmail,
                password: this.form.userPwd,
                type: this.form.type,
                phone: this.form.userPhone
            })
            this.axios.post('/loginController/register', data)
            .then(res => {
                if(!res.data.message){
                    this.$alert("注册成功!", "提示", {
                        confirmButtonText: "确定",
                        callback: () => {
                            this.$store.commit('SETUSER', res.data.user)
                            this.$router.push("/")
                        }
                    })
                } else {
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                }
            }).catch(err => {
                this.$alert("服务器繁忙，请稍后重试", {
                    confirmButtonText: "确定"
                })
            })
        },
        resetForm() {
            this.$refs['form'].resetFields()
        }
    },
    watch: {
        loginBox(newVal, oldVal){
            this.resetForm()
            return newVal
        }
    }
}
</script>

<style lang='less' scoped>
.el-container{
    height: 100vh;
    width: 100%;
    background: rgba(5,195,231,.8);
    .title{
        position: absolute;
        width: 100%;
        color: #fff;
        font-size: 36px;
        cursor: pointer;
        top: 10%;
    }
    .el-main{
        box-shadow: 0 0 8px #ccc;
        background: #fff;
        margin: auto 20%;
        position: relative;
        padding: 0;
        .el-form{
            width: 40%;
            float: left;
            padding: 0 5%;
            margin: 2% 0;
            h3{
                margin: 10px 0;
            }
            .el-button{
                width: 100%;
            }
            .el-link{
                line-height: 20px;
            }
        }
        .mask{
            background: url('../assets/images/login.jpg') no-repeat;
            position: absolute;
            width: 50%;
            height: 100%;
            transition: all ease .5s;
        }
        .mask::before {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            background-color: rgba(255, 255, 255, .3);
            z-index: 2;
        }
    }
    .upd{
        margin: auto 35%;
        .el-form{
            width: 80%;
            .el-input{
                /deep/
                .el-input-group__append{
                    text-align: left;
                }
            }
        }
    }
}
</style>