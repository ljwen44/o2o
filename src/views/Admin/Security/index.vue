<template>
    <el-main>
        <el-row>
            <h3>基本资料</h3>
            <template v-if="!edit">
                <p>
                    <span>昵称：{{user.userName}}</span>
                </p>
                <p>
                    <span>手机号码： {{user.phone}}</span>
                </p>
                <p>
                    头像：
                    <el-image 
                        style="width: 150px;"
                        :src="user.avatar" 
                        :preview-src-list="[user.avatar]">
                    </el-image>
                </p>
            </template>
            <el-form v-if="edit">
                <el-button @click="edit=false">返回</el-button>
                <el-form-item label="昵称">
                    <el-input v-model="form.userName" type="text"></el-input>
                </el-form-item>
                <el-form-item label="手机">
                    <el-input v-model="form.phone" type="text" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <label for="file">
                        <el-avatar style="float:left;cursor: pointer;" :size="60" :src="form.avatar"></el-avatar>
                        <input id="file" ref="file" type="file" accept="image/*" style="display: none;" @change="readAvatar" />
                    </label>
                </el-form-item>
            </el-form>
            <el-button @click="handleEdit" type="primary">{{edit?"修改":"编辑资料"}}</el-button>
        </el-row>
        <el-row>
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
        </el-row>
    </el-main>
</template>

<script>
import { mapState } from 'vuex'
let reg = /^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(17[0,1,3,5,6,7,8]))\d{8}$/
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
                rePwd: '',
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
            },
            edit: false
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
                    this.axios.post("/userController/updpwd", data)
                    .then(res => {
                        if(res.data.message){
                            this.$alert(res.data.message, "提示", {
                                confirmButtonText: "确定"
                            })
                        } else {
                            this.$alert("修改成功，请重新登录!", "提示", {
                                confirmButtonText: "确定",
                                callback: () => {
                                    this.$store.commit("DELUSER")
                                    this.$router.push("/login")
                                }
                            })
                        }
                    }).catch(err => {
                        this.$alert("修改密码失败，请稍后重试!", "提示", {
                            confirmButtonText: "确定"
                        })
                    })
                } else {
                    return false;
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        readAvatar(){
            let files = this.$refs.file.files
            if(files[0].size > 500*1024){
                alert("图片大小不得超过500kb")
                return 
            }
            var fileReader = new FileReader()
            fileReader.readAsDataURL(files[0])
            let that = this
            fileReader.onload = function (event) {
                that.form.avatar = event.target.result
            }
        },
        handleEdit(){
            if(this.edit) {
                if(!this.form.userName){
                    this.$message("请输入昵称")
                    return 
                }
                if(!this.form.phone){
                    this.$message("请输入手机")
                    return 
                }
                if(!reg.test(this.form.phone)){
                    this.$message("请输入正确的手机号码")
                    return 
                }
                let data = this.$qs.stringify({
                    uid: this.user.userUUID,
                    userName: this.form.userName,
                    phone: this.form.phone,
                    img: this.form.avatar
                })
                this.axios.post("/userController/updAdmin", data)
                .then(res => {
                    if(res.data.message){
                        this.$alert(res.data.message, "提示", {
                            confirmButtonText: "确定"
                        })
                    } else {
                        this.$alert("修改成功!", "提示", {
                            confirmButtonText: "确定",
                            callback: () => {
                                this.$store.commit('SETUSER', res.data.user)
                                this.edit = false
                            }
                        })
                    }
                }).catch(err => {
                    this.$alert("修改失败，请稍后重试", "提示", {
                        confirmButtonText: "确定"
                    })
                })
            } else {
                this.edit = !this.edit
            }
        }
    },
    computed: {
        ...mapState([
            'user'
        ])
    },
    created() {
        this.form = {...this.form, ...this.user}
    },
}
</script>

<style lang='less' scoped>
.el-main{
    text-align: left;
    .el-row{
        margin-bottom: 20px;
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
        .el-form{
            margin: 10px 0;
            .el-input{
                width: 40%;
            }
        }
        
    }
}
</style>