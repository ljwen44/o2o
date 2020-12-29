<template>
    <el-main>
        <h3>修改密码</h3>
        <el-form :rules="rules" label-position="left" label-width="80px" :model="form" ref="form">
            <el-form-item label="旧密码" prop="oldPwd">
                <el-input v-model="form.oldPwd" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPwd">
                <el-input v-model="form.newPwd" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="rePwd">
                <el-input v-model="form.rePwd" type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('form')">提交</el-button>
                <el-button @click="resetForm('form')">重置</el-button>
            </el-form-item>
        </el-form>
    </el-main>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                if (this.form.rePwd !== '') {
                    this.$refs.form.validateField('rePwd')
                }
                callback()
            }
        }
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.form.newPwd) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            form: {
                oldPwd: '',
                newPwd: '',
                rePwd: ''
            },
            rules: {
                oldPwd: [
                    { required: true, message: '请输入旧的密码', trigger: 'blur' },
                ],
                newPwd: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' },
                    { validator: validatePass, trigger: 'blur' }
                ],
                rePwd: [
                    { required: true, message: '请确认密码', trigger: 'blur' },
                    { validator: validatePass2, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = this.$qs.stringify({
                        oldpwd: this.form.oldPwd,
                        newpwd: this.form.newPwd,
                        uid: this.user.userUUID
                    })
                    this.axios.post('/userController/updpwd', data)
                    .then(res => {
                        if(res.data.message){
                            this.$alert(res.data.message,'提示', {
                                confirmButtonText: '确定'
                            })
                        } else {
                            this.$alert('修改成功，请重试登录', '提示', {
                                confirmButtonText: '确定',
                                callback: (action) => {
                                    this.$store.commit('DELUSER')
                                    this.$router.push('/login')
                                }
                            })
                        }
                    }).catch(err => {
                        this.$alert('修改失败，请稍后重试！','提示', {
                            confirmButtonText: '确定'
                        })
                    })
                } else {
                    return false;
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
        }
    },
    computed: {
        ...mapState([
            'user'
        ])
    },
}
</script>

<style lang='less' scoped>
.el-main{
    text-align: left;
    padding: 20px;
    h3{
        border-left: 5px solid #3cabcf;
        padding-left: 10px;
    }
    .el-form{
        margin: 10px 0;
        width: 40%;
    }
}
</style>