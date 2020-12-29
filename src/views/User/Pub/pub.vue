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
            <el-form-item label="薪资待遇" required>
                <el-col :span="11">
                    <el-form-item prop="minSalary">
                        <el-input v-model="ruleForm.minSalary"></el-input>
                    </el-form-item>
                </el-col>
                <el-col class="line" :span="2" style="text-align: center;">-</el-col>
                <el-col :span="11">
                    <el-form-item prop="maxSalary">
                        <el-input v-model="ruleForm.maxSalary"></el-input>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item label="起止时间" required>
                <el-col :span="11">
                    <el-form-item prop="startTime">
                        <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.startTime" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col class="line" :span="2" style="text-align: center;">-</el-col>
                <el-col :span="11">
                    <el-form-item prop="endTime">
                        <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.endTime" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
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
                startTime: '',
                endTime: '',
                desc: '',
                minSalary: '',
                maxSalary: '',
                record: '本科',
                phone: ''
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
                minSalary: [
                    { required: true, message: '请填写工资区间', trigger: 'blur' }
                ],
                maxSalary: [
                    { required: true, message: '请填写工资区间', trigger: 'blur' }
                ],
                startTime: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
                endTime: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
                desc: [
                    { required: true, message: '请填写内容描述', trigger: 'blur' }
                ],
                record: [
                    { required: true, message: '请选择学历', trigger: 'blur' },
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
                    let data = this.$qs.stringify({
                        uid: this.user.userUUID,
                        userName: this.ruleForm.name,
                        userPhone: this.ruleForm.phone,
                        province: this.ruleForm.province,
                        city: this.ruleForm.city,
                        block: this.ruleForm.block,
                        address: this.ruleForm.address,
                        minSalary: this.ruleForm.minSalary,
                        maxSalary: this.ruleForm.maxSalary,
                        startTime: this.ruleForm.startTime,
                        endTime: this.ruleForm.endTime,
                        content: this.ruleForm.desc,
                        precord: this.ruleForm.record
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