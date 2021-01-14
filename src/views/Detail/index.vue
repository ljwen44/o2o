<template>
    <el-main>
        <el-row>
            <el-col :sm="24" :md="24" :lg="24">
                <el-card class="box-card">
                    <div class="userWrapper">
                        <el-avatar :size="50" :src="item.avatar"></el-avatar>
                        <span class="userName">{{item.name}}</span>
                    </div>
                    <div class="detailWrapper">
                        <p>
                            内容描述：{{item.content}}
                        </p>
                        <p>
                            <span>
                                <i class="el-icon-user"></i>
                                联系人：{{item.userName}}
                            </span>
                            <span>
                                <i class="el-icon-phone"></i>
                                电话：{{item.userPhone}}
                            </span>
                        </p>
                        <p>
                            <span>
                                <i class="el-icon-coin"></i>
                                薪资：{{item.salary}}元/天
                            </span>
                            <span>
                                <i class="iconfont icon-xueshimao"></i>
                                学历：{{item.precord}}
                            </span>
                        </p>
                        <p>
                            <span>
                                <i class="el-icon-time"></i>
                                持续天数：{{item.day}}
                            </span>
                            <span>
                                <i class="el-icon-location-information"></i>
                                地点：{{item.province + item.city + item.block + item.address}}
                            </span>
                        </p>
                        <p>
                            <span>
                                <i class="el-icon-time"></i> 
                                发布时间: {{item.ptime}}
                            </span>
                        </p>
                    </div>
                    <el-button @click="handleConnect" v-if="!item.uid === user.userUUID">与他联系</el-button>
                    <el-button type="primary" @click="handleAddOrder" v-if="user.type==='教员'">接单</el-button>
                </el-card>
            </el-col>
        </el-row>
    </el-main>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            item: [],
            pid: ''
        }
    },
    created() {
        this.pid = this.$router.history.current.query.pid
        this.getData()
    },
    methods: {
        getData(){
            let data = this.$qs.stringify({
                pid: this.pid
            })
            this.axios.post("/jobController/getPartJobByPID", data)
            .then(res => {
                console.log(res.data)
                if(res.data.message){
                    this.$alert(res.data.message, "提示",{
                        confirmButtonText: "确定"
                    })
                } else {
                    this.item = res.data.info
                }
            }).catch(err => {
                this.$alert("获取数据异常，请稍后重试!", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        handleConnect(){
            let obj = {
                userName: this.item.name,
                avatar: this.item.avatar,
                userUUID: this.item.uid
            }
            this.$router.push({
                path: "/message",
                query: {
                    user: JSON.stringify(obj)
                }
            })
        },
        handleAddOrder(){
            this.$confirm('您确定接单吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = this.$qs.stringify({
                    pid: this.item.pid,
                    uid: this.user.userUUID
                })
                this.axios.post("/orderController/addOrder", data)
                .then(res => {
                    if(res.data.message){
                        this.$alert(res.data.message, "提示", {
                            confirmButtonText: "确定"
                        })
                    } else {
                        this.$alert("已成功接单,请尽快与招聘者联系", "提示", {
                            confirmButtonText: "确定",
                            callback: () => {
                                this.handleConnect()
                            }
                        })
                    }
                }).catch(err => {
                    this.$alert("接单失败，请稍后重试!", "提示", {
                        confirmButtonText: "确定"
                    })
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消接单'
                })       
            })
        }
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
    padding: 0 20px;
    text-align: left;
    .box-card{
        min-height: 600px;
        box-shadow: 0 0 4px #ccc;
        text-align: left;
        margin-bottom: 20px;
        margin: 0 20px;
        background: rgba(255,255,255,.8);
        .userWrapper{
            .el-avatar{
                vertical-align: middle;
            }
            .userName{
                margin-left: 20px;
                cursor: pointer;
            }
        }
        .detailWrapper{
            color: #000;
            p{
                margin: 20px 0;
                display: flex;
                line-height: 2;
                span{
                    flex: 1;
                    font-size: 14px;
                    margin-right: 20px;
                }
                span:nth-child(2){
                    flex: 2;
                }
            }
        }
    }
}
</style>