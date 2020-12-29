<template>
    <el-main>
        <JobInfo :item="item"></JobInfo>
        <h3>教员信息</h3>
        <el-row v-if="status">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>教员信息</span>
                    <span class="unfinish" :style="{color: ostatus==='进行中'? '' : 'color'}">
                        <i :class="ostatus==='进行中'? 'el-icon-warning-outline' : 'el-icon-success'"></i>
                        {{ostatus==='进行中'? '家教进行中' : '家教已完成'}}
                    </span>
                    <el-button style="float: right; padding: 3px 0" type="text">联系他</el-button>
                </div>
                <div class="userInfo">
                    <div class="avatar">
                        <el-image
                            :src="userTeach.avatar"
                            style="margin: 15% 0px;"
                            fit="fill">
                        </el-image>
                    </div>
                    <div class="box">
                        <p>
                            <span>姓名：{{userTeach.userName}}</span>
                            <span>性别：{{userTeach.sex}}</span>
                        </p>
                        <p>
                            <span>手机号码： {{userTeach.phone}}</span>
                            <span>邮箱：{{userTeach.email}}</span>
                        </p>
                        <p>
                            <span>学历：{{userTeach.record}}</span>
                            <span>毕业学校：{{userTeach.school}}</span>
                        </p>
                        <p>
                            简介：{{userTeach.introduce}}
                        </p>
                    </div>
                </div>
            </el-card>
            <el-row v-if="!estatus && ostatus==='已完成'">
                <el-button type="success" style="margin-top: 20px;" @click="handleEvaluate">评价</el-button>
                <el-rate v-model="rate" @change="handleRate" style="margin-top:10px;"></el-rate>
                <el-input
                    type="textarea"
                    resize="none"
                    :autosize="{ minRows: 5, maxRows: 4}"
                    placeholder="请输入内容"
                    v-model="evaluate"
                    >
                </el-input>
            </el-row>
        </el-row>
        <p style="margin-bottom: 10px;" v-if="!status">暂时没有教员接单</p>
        <h3>进度安排</h3>
        <el-timeline v-if="status && progressList.length">
            <el-timeline-item
                v-for="(progress, index) in progressList"
                :key="index"
                :timestamp="progress.time">
                {{progress.content}}
            </el-timeline-item>
        </el-timeline>
        <p v-if="!progressList.length">暂时没有任务安排</p>
    </el-main>
</template>

<script>
import JobInfo from '_c/JobInfo/index.vue'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            item: {},
            progressList: [],
            rate: null,
            status: false,
            userTeach: {},
            ostatus: "",
            evaluate: "", // 评价内容
            estatus: false, // 评价状态
            oid: '',
        }
    },
    created() {
        let pid = this.$router.history.current.query.pid
        this.getData(pid)
    },
    components: {
        JobInfo
    },
    computed: {
        ...mapState([
            'user'
        ])
    },
    methods: {
        getData(pid){
            let data = this.$qs.stringify({
                pid: pid,
                uid: this.user.userUUID
            })
            this.axios.post("/jobController/getPartJobByPID", data)
            .then(res => {
                this.item = res.data.info
                this.status = res.data.status
                this.ostatus = res.data.ostatus || ""
                this.oid = res.data.oid
                this.estatus = res.data.estatus || false
                this.userTeach = res.data.userTeach || {}
                this.progressList = res.data.progressList || {}
            }).catch(err => {
                this.$alert("获取数据异常，请刷新重试!", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        handleRate(){
            console.log(this.rate)
        },
        handleEvaluate(){
            if(!this.rate){
                this.$message({
                    message: "请进行星级评价",
                    type: "warning"
                })
                return 
            }
            if(!this.evaluate){
                this.$message({
                    message: "请输入内容",
                    type: "warning"
                })
                return 
            }
            let data = this.$qs.stringify({
                uid: this.user.userUUID,
                cotent: this.evaluate,
                rate: this.rate,
                ruid: this.userTeach.userUUID,
                oid: this.oid
            })
            this.axios.post("/evaluateController/addEvaluate", data)
            .then(res => {
                if(res.data.message){
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                } else {
                    this.$alert("评价成功！", "提示", {
                        confirmButtonText: "确定",
                        callback: () => {
                            this.rate = null
                            this.evaluate = ''
                            this.estatus = true
                        }
                    })
                }
            }).catch(err => {
                this.$alert("评价失败，请稍后重试！", "提示", {
                    confirmButtonText: "确定"
                })
            })
        }
    },
}
</script>

<style lang='less' scoped>
.el-main{
    padding: 0;
    h3{
        border-left: 5px solid #3cabcf;
        padding-left: 10px;
        margin-bottom: 20px;
    }
    .el-row{
        margin-bottom: 20px;
        .el-card{
            .unfinish{
                font-size: 14px;
                margin-left: 20px;
            }
            .userInfo{
                display: flex;
                .avatar{
                    flex: 1;
                }
                .box{
                    padding: 0 10px;
                    text-align: left;
                    margin-bottom: 20px;
                    flex: 4;
                    p{
                        margin: 5px 0;
                        padding: 10px;
                        display: flex;
                        span{
                            flex: 1;
                        }
                    }
                }
            }  
        } 
        
    }
    .el-timeline{
        background: #fff;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        border: 1px solid #EBEEF5;
        padding: 30px;
    }
}
</style>