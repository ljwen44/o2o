<template>
    <el-main>
        <h3>发布兼职</h3>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" label-position="left">
            <el-form-item label="联系人" prop="name" style="display: inline-block;" >
                <el-input v-model="ruleForm.name" placeholder="请输入联系人"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone" style="display: inline-block;margin-left:20px;" >
                <el-input v-model="ruleForm.phone" maxlength="11" show-word-limit placeholder="请输入联系电话"></el-input>
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
                <Select @change="change"></Select>
                <el-input v-model="ruleForm.address"></el-input>
            </el-form-item>
            <el-form-item label="学历要求" prop="record">
                <el-select v-model="ruleForm.record" clearable placeholder="请选择">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="薪资待遇" prop="salary">
                <el-input v-model="ruleForm.salary" placeholder="请输入薪资" style="width: 30%;"></el-input>
            </el-form-item>
            <el-form-item label="维持天数" prop="day">
                <el-input-number v-model="ruleForm.day"  :min="1" :max="30"></el-input-number>
            </el-form-item>
            <el-form-item label="内容描述" prop="desc">
                <el-input 
                    type="textarea" 
                    v-model="ruleForm.desc" 
                    resize="none"
                    :autosize="{ minRows: 5, maxRows: 4}">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即发布</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </el-main>
</template>

<script>
import Select from '_c/Select/index.vue'
import { mapState } from 'vuex'
export default {
    data() {
        let reg = /^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(17[0,1,3,5,6,7,8]))\d{8}$/ // 手机验证
        let validatePhone = (rule, value, callback) => {
            if(!reg.test(value)){
                callback(new Error('请输入正确的手机号码'))
            } else {
                callback()
            }
        }
        return {
            ruleForm: {
                name: '',
                province: '',
                city: '',
                block: '',
                address: '',
                desc: '',
                salary: '',
                record: '本科',
                phone: '',
                day: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入联系人', trigger: 'blur' },
                    { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { validator: validatePhone, trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '请填写地址', trigger: 'change' }
                ],
                salary: [
                    { required: true, message: '请填写薪资', trigger: 'blur' }
                ],
                desc: [
                    { required: true, message: '请填写内容描述', trigger: 'blur' }
                ],
                record: [
                    { required: true, message: '请选择学历', trigger: 'blur' },
                ],
                day: [
                    { required: true, message: '请填写天数', trigger: 'blur' },
                ],
            },
            options: [
                {
                    value: '本科',
                    label: '本科'
                }, 
                {
                    value: '硕士',
                    label: '硕士'
                }, 
                {
                    value: '博士',
                    label: '博士'
                }
            ],
            selectInfo: ''
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let totalCoin = parseInt(this.ruleForm.salary) * parseInt(this.ruleForm.day)
                    if(this.user.coin < totalCoin){
                        this.$alert("您的学币不够，请充值后再发布", "提示", {
                            confirmButtonText: "确定"
                        })
                        return
                    }
                    let data = this.$qs.stringify({
                        uid: this.user.userUUID,
                        userName: this.ruleForm.name,
                        userPhone: this.ruleForm.phone,
                        province: this.ruleForm.province,
                        city: this.ruleForm.city,
                        block: this.ruleForm.block,
                        address: this.ruleForm.address,
                        salary: this.ruleForm.salary,
                        content: this.ruleForm.desc,
                        precord: this.ruleForm.record,
                        day: this.ruleForm.day
                    })
                    this.axios.post("/jobController/addJob", data)
                    .then(res => {
                        if(res.data.message){
                            this.$alert(res.data.message, "提示", {
                                confirmButtonText: "确定"
                            })
                        } else {
                            this.$alert("发布成功!", "提示", {
                                confirmButtonText: "确定",
                                callback: () => {
                                    this.user.coin -= totalCoin
                                    this.$store.commit("SETUSER", this.user)
                                    this.resetForm('ruleForm')
                                    this.$router.push("/user/pjob/mypub/index")
                                }
                            })
                        }
                    }).catch(err => {
                        this.$alert("服务器错误，请稍后重试!", "提示", {
                            confirmButtonText: "确定"
                        })
                    })
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        change(obj){
            this.ruleForm.province = obj.province
            this.ruleForm.city = obj.city
            this.ruleForm.block = obj.block
        }
    },
    components: {
        Select
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
    text-align: left;
    padding: 20px;
    h3{
        padding-left: 20px;
        border-left: 5px solid #3cabcf;
    }
    .el-form{
        width: 100%;
        margin-top: 20px;
    }
}
</style>