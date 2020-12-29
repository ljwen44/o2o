<template>
    <el-main>
        <JobInfo :item="item"></JobInfo>
        <h3>进度安排</h3>
        <el-button type="primary" size="small" @click="addprogress">增加进度</el-button>
        <el-row v-if="flag" class="row">
            <el-input
                type="textarea"
                resize="none"
                :autosize="{ minRows: 5, maxRows: 4}"
                placeholder="请输入内容"
                v-model="value"
                >
            </el-input>
            <el-button type="success" size="small" @click="handleSubmit">提交</el-button>
        </el-row>
        <el-timeline>
            <el-timeline-item
                v-for="(item, index) in list"
                :key="index"
                :timestamp="item.pptime">
                {{item.content}}
            </el-timeline-item>
        </el-timeline>
        <el-button :type="finish ? 'info' : 'primary'" @click="handleFinish" :disabled="finish">
            {{finish? "已完成" :"完成家教"}}
        </el-button>
        <el-button @click="goback">返回</el-button>
    </el-main>
</template>

<script>
import JobInfo from '_c/JobInfo/index.vue'
import {alist} from '@/lib/data'
export default {
    data() {
        return {
            item: {},
            list: [],
            flag: false,
            value: '',
            finish: false
        }
    },
    created() {
        this.oid = this.$router.history.current.query.oid
        this.pid = this.$router.history.current.query.pid
    },
    methods: {
        getData(pid){
            let data = this.$qs.stringify({
                pid: pid,
                oid: this.oid
            })
            this.axios.post("/orderController/getOrderDetail", data)
            .then(res => {
                if(res.data.message){
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                } else {
                    this.item = res.data.item
                    this.list = res.data.progressList
                }
            }).catch(err => {
                this.$alert("获取数据异常，请刷新重试!", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        addprogress(){
            this.flag = true
        },
        goback(){
            this.$router.history.go(-1)
        },
        handleSubmit(){
            if(!this.value.trim()){
                this.$message("内容不能为空")
                return 
            }
            let data = this.$qs.stringify({
                content: this.value,
                oid: this.oid
            })
            this.axios.post("/progressController/addProgress", data)
            .then(res => {
                if(res.data.message){
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                } else {
                    this.$alert("添加成功!", "提示", {
                        confirmButtonText: "确定",
                        callback: () => {
                            this.value = ''
                            this.flag = false
                            this.list.unshift(res.data.progress)
                        }
                    })
                }
            }).catch(err => {
                this.alert("添加失败，请刷新重试!", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        handleFinish(){
            this.finish = true
        }
    },
    components: {
        JobInfo
    }
}
</script>

<style lang='less' scoped>
.el-main{
    text-align: left;
    h3{
        border-left: 5px solid #3cabcf;
        padding-left: 10px;
        display: inline-block;
    }
    .el-button{
        margin-left: 20px;
    }
    .row{
        .el-textarea{
            margin-top: 10px;
        }
        .el-button{
            margin-top: 10px;
            margin-left: 0;
        }
    }
    .el-timeline{
        margin-top: 20px;
    }
}
</style>