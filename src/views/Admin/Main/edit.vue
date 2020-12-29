<template>
    <el-main>
        <h3>编辑轮播图</h3>
        <router-link to="/admin/index/main">
            <el-button type="primary">返回</el-button>
        </router-link>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" label-position="left">
            <el-form-item label="标题" prop="title">
                <el-input v-model="ruleForm.title"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="desc">
                <el-input type="textarea" v-model="ruleForm.desc" :rows="10" resize="none"></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="img">
                <input type="file" id="file" accept="image/*" ref="file" @change="handleImg" v-show="!ruleForm.img">
                <div class="imgBox" ref="imgBox" v-show="ruleForm.img">
                    <img :src="ruleForm.img" alt="" ref="img" width="100px; height:100px;" preview="1">
                    <i class="el-icon-error" @click="del"></i>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">{{newCreate ? "立即创建" :"更新数据"}}</el-button>
            </el-form-item>
        </el-form>
    </el-main>
</template>

<script>
export default {
    data() {
        return {
            ruleForm: {
                title: '',
                desc: '',
                img: ''
            },
            rules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' },
                ],
                desc: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ]
            },
            newCreate: true 
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.ruleForm.img){
                        if(this.newCreate){
                            this.axios.post("/addBanner", this.ruleForm)
                            .then(res => {
                                this.$alert("创建成功！", "提示", {
                                    confirmButtonText: "确定",
                                    callback: (action) => {
                                        this.$router.push("/admin/main")
                                    }
                                })
                            }).catch(err => {
                                this.$alert("创建失败,请稍后重试！", "提示", {
                                    confirmButtonText: "确定"
                                })
                            })
                        } else {
                            this.axios.post("/updBanner", this.ruleForm)
                            .then(res => {
                                this.$alert("更新成功！", "提示", {
                                    confirmButtonText: "确定",
                                    callback: (action) => {
                                        this.$router.push("/admin/main")
                                    }
                                })
                            }).catch(err => {
                                this.$alert("更新失败,请稍后重试！", "提示", {
                                    confirmButtonText: "确定"
                                })
                            })
                        }
                    } else {
                        this.$alert("请上传图片", "提示", {
                            confirmButtonText: "确定",
                        })
                        return false
                    }
                } else {
                    return false;
                }
            })
        },
        handleImg(){
            let files = this.$refs.file.files
            if(files[0].size > 500*1024){
                alert("文件大小不得超过500kb")
                return 
            }
            var fileReader = new FileReader()
            fileReader.readAsDataURL(files[0])
            let that = this
            fileReader.onload = function (event) {
                that.ruleForm.img = event.target.result
                that.$refs.img.src = event.target.result
                that.flag = false
            }
        },
        del(){
            this.ruleForm.img = ''
        }
    },
    created() {
        if(this.$router.history.current.query.data){
            this.ruleForm = JSON.parse(this.$router.history.current.query.data)
            this.newCreate = false
        }
    },
}
</script>

<style lang='less' scoped>
.el-main{
    padding: 0;
    text-align: left;
    h3{
        text-align: left;
        border-left: 5px solid #3cabcf;
        margin: 1rem;
        padding-left: 10px;
    }
    .el-form{
        .el-form-item{
            .imgBox{
                i{
                    position: absolute;
                    color: red;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>