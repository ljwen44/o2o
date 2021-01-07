<template>
    <el-main>
        <h3>好友申请</h3>
        <template v-if="list.length">
            <el-card v-for="(item, index) in list" :key="index">
                <el-row>
                    <el-col :sm="3" :md="3" :lg="3">
                        <el-image
                            style="width: 60px;"
                            :src="item.avatar"
                            fit="fill">
                        </el-image>
                    </el-col>
                    <el-col :sm="17" :md="17" :lg="17" class="infoWrapper">
                        <span>姓名：{{item.userName}}</span><span>申请时间: {{item.atime}}</span><br>
                        <p>备注: {{item.desc}}</p>
                    </el-col>
                    <el-col :sm="4" :md="4" :lg="4" class="opWrapper">
                        <el-button type="success" size="small" @click="handleAgree(index, item.uid, item.aid)">同意</el-button>
                        <el-button type="danger" size="small" @click="handleReject(index, item.uid, item.aid)">拒绝</el-button>
                    </el-col>
                </el-row>
            </el-card>
            <el-pagination
                background
                layout="prev, pager, next"
                :total="total"
                :current-change="handleChange">
            </el-pagination>
        </template>
        <p v-else>还没有人申请加好友噢~</p>
    </el-main>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            list: [],
            total: 0,
            page: 1
        }  
    },
    methods: {
        getData(){
            let data = this.$qs.stringify({
                uid: this.user.userUUID,
                page: this.page
            })
            this.axios.post("/applyController/getApplyByUID", data)
            .then(res => {
                if(res.data.message){
                    this.$alert(res.data.messsage, "提示", {
                        confirmButtontext: "确定"
                    })
                } else {
                    this.list = res.data.list
                    this.total = res.data.total
                }
            }).catch(err => {
                this.$alert("获取数据异常", "提示", {
                    confirmButtontext: "确定"
                })
            })
        },
        handleChange(page){
            this.page = page
            this.getData()
        },
        handleAgree(index, id, aid){
            let data = this.$qs.stringify({
                uid: this.user.userUUID,
                ruid: id,
                aid: aid
            })
            this.axios.post("/applyController/updApplyByUID", data)
            .then(res => {
                if(res.data.message){
                    this.$alert(res.data.message, "提示", {
                        confirmButtontext: "确定"
                    })
                } else {
                    this.list.splice(index, 1)
                    this.$message({
                        message: "已成功添加好友",
                        type: "success"
                    })
                }
            }).catch(err => {
                this.$alert("数据处理异常，请稍后重试", "提示", {
                    confirmButtontext: "确定"
                })
            })
        },
        handleReject(index, id, aid){
            let data = this.$qs.stringify({
                uid: id,
                userName: this.user.userName,
                aid: aid
            })
            this.axios.post("/applyController/rejApplyByUID", data)
            .then(res => {
                if(res.data.message){
                    this.$alert(res.data.message, "提示", {
                        confirmButtontext: "确定"
                    })
                } else {
                    this.list.splice(index, 1)
                    this.$message({
                        message: "已拒绝",
                        type: "danger"
                    })
                }
            }).catch(err => {
                this.$alert("数据异常，请稍后重试", "提示", {
                    confirmButtontext: "确定"
                })
            })
        }
    },
    created() {
        this.getData()
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
    h3{
        border-left: 5px solid #3cabcf;
        padding-left: 10px;
        margin-bottom: 10px;
    }
    .el-card{
        margin-bottom: 10px;
    }
    .el-pagination{
        text-align: center;
        margin-top: 20px;
    }
    .infoWrapper{
        height: 64px;
        line-height: 32px;
        p{
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            font-size: 14px;
        }
        span:nth-child(1){
            margin-right: 40px;
        }
    }
    .opWrapper{
        height: 64px;
        line-height: 64px;
    }
}
</style>