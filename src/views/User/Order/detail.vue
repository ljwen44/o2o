<template>
    <el-main>
        <JobInfo :item="item"></JobInfo>
        <h3>进度安排</h3>
        <el-button 
            v-if="flag==='进行中'"
            type="primary" 
            size="small" 
            @click="cancelOrder" 
            style="margin-left: 20px;"
            >取消订单</el-button>
        <el-row v-if="flag === '进行中'" class="row">
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
                :timestamp="item.ppTime"
                placement="top">
                {{item.content}}
            </el-timeline-item>
        </el-timeline>
        <p v-if="!list.length" style="margin-bottom: 20px;">暂时还没有发布任何进度安排</p>
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
            oid: '',
            pid: ''
        }
    },
    created() {
        this.oid = this.$router.history.current.query.oid
        this.pid = this.$router.history.current.query.pid
        this.getData(this.pid)
    },
    methods: {
        getData(pid){
            let data = this.$qs.stringify({
                pid: pid,
                oid: this.oid
            })
            this.axios.post("/orderController/getOrderDetail", data)
            .then(res => {
                console.log(res.data)
                if(res.data.message){
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                } else {
                    this.item = res.data.item
                    this.list = res.data.progressList
                    this.flag = res.data.ostatus
                }
            }).catch(err => {
                this.$alert("获取数据异常，请刷新重试!", "提示", {
                    confirmButtonText: "确定"
                })
            })
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
        cancelOrder(){
            this.$confirm('您确定取消订单吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = this.$qs.stringify({
                    oid: this.oid,
                    pid: this.pid
                })
                this.axios.post("/orderController/delOrder", data)
                .then(res => {
                    if(res.data.message){
                        this.$alert(res.data.message, "提示", {
                            confirmButtonText: "确定"
                        })
                    } else {
                        this.$alert("已取消订单", "提示", {
                            confirmButtonText: "确定",
                            callback: () => {
                                this.$router.push("/user/order/finish")
                            }
                        })
                    }
                }).catch(err => {
                    this.$alert("取消失败，请刷新重试!", "提示", {
                        confirmButtonText: "确定"
                    })
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                })       
            })
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
    padding: 20px;
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