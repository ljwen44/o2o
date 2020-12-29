<template>
    <el-main>
        <el-card>
            <el-row>
                <el-col :sm="6" :md="6" :lg="6">
                    <el-image :src="user.avatar" fit="fill"></el-image>
                </el-col>
                <el-col :sm="18" :md="18" :lg="18" class="box">
                    <h3>基本资料</h3>
                    <p>
                        <span>姓名：{{queryUser.userName}}</span>
                        <span>性别：{{queryUser.sex}}</span>
                    </p>
                    <p>
                        <span>手机号码： {{queryUser.phone}}</span>
                        <span>邮箱：{{queryUser.email}}</span>
                    </p>
                    <p>
                        <span>学历：{{queryUser.record}}</span>
                        <span>毕业学校：{{queryUser.school}}</span>
                    </p>
                    <p>
                        <span>期望城市: {{queryUser.city}}</span>
                    </p>
                    <p>
                        简介：{{queryUser.introduce}}
                    </p>
                </el-col>
            </el-row>
            <el-button 
                type="success" 
                style="margin-bottom: 20px;"
                v-if="!user.userUUID === queryUser.userUUID"
                @click="handleClick"
                >添加好友</el-button>
            <el-row>
                <div class="box">
                    <h3>用户评价</h3>
                    <el-card>
                        <div class="content" v-for="(item, index) in evaluateList" :key="index">
                            <div class="contentHeader">
                                <el-avatar :src="item.avatar"></el-avatar>
                                <span class="name">{{item.userName}}</span>
                                <el-rate
                                    v-model="item.rate"
                                    disabled
                                    show-score
                                    text-color="#ff9900"
                                    score-template="{value}">
                                </el-rate>
                            </div>
                            <div class="contentBody">
                                <p>{{item.content}}</p>
                                <p><i class="el-icon-time"></i>{{item.etime}}</p>
                            </div>
                        </div>
                    </el-card>
                </div>
            </el-row>
        </el-card>
    </el-main>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            evaluateList: [],
            uid: '',
            queryUser: {}
        }
    },
    created() {
        this.uid = this.$router.history.current.query.uid
        this.getData()
    },
    computed: {
        ...mapState([
            'user'
        ])
    },
    methods: {
        getData(){
            let data = this.$qs.stringify({
                uid: this.uid
            })
            this.axios.post("/userController/getUserDeatailByUID", data)
            .then(res => {
                if(res.data.message){
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                } else {
                    this.queryUser = res.data.user
                    this.evaluateList = res.data.list
                }
            }).catch(err => {
                this.$alert("获取数据失败，请刷新重试!", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        handleClick(){
            console.log(1)
        }
    },
}
</script>

<style lang='less' scoped>
.el-main{
    padding: 0 20px;
    text-align: left;
    .el-card{
        background: rgba(255, 255, 255, .8);
        .box{
            padding: 0 10px;
            text-align: left;
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
            ul{
                padding: 10px 0;
            }
            .el-card{
                margin-top: 20px;
                background: transparent;
                .content{
                    margin-bottom: 20px;
                    border-bottom: 1px solid #ccc;
                    .contentHeader{
                        .el-avatar{
                            vertical-align: middle;
                        }
                        .name{
                            margin-left: 20px;
                            font-size: 14px;
                        }
                        .el-rate{
                            display: inline;
                            margin-left: 20px;
                        }
                    }
                    .contentBody{
                        p:nth-child(2){
                            font-size: 12px;
                        }
                    }
                }
            }
        }
    }
}
</style>