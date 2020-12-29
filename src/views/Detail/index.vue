<template>
    <el-main>
        <el-row>
            <el-col :sm="20" :md="20" :lg="20">
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
                                薪资：{{item.minSalary}} - {{ item.maxSalary }}元/天
                            </span>
                            <span>
                                <i class="iconfont icon-xueshimao"></i>
                                学历：{{item.prerecord}}
                            </span>
                        </p>
                        <p>
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
                    <el-button @click="handleConnect(item.uid)">与他联系</el-button>
                </el-card>
            </el-col>
            <el-col :sm="4" :md="4" :lg="4"></el-col>
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
                if(res.data.message){
                    this.$alert(res.data.message, "提示",{
                        confirmButtonText: "确定"
                    })
                } else {
                    this.item = res.data.item
                }
            }).catch(err => {
                this.$alert("获取数据异常，请稍后重试!", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        handleConnect(id){
            this.$message("与他联系")
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