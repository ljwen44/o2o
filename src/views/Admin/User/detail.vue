<template>
    <el-main>
        <el-page-header @back="goBack" style="margin-bottom: 20px;"></el-page-header>
        <el-card>
            <el-row>
                <el-col :sm="6" :md="6" :lg="6">
                    <el-image :src="user.avatar" fit="fill"></el-image>
                </el-col>
                <el-col :sm="18" :md="18" :lg="18" class="box">
                    <h3>基本资料</h3>
                    <p>
                        <span>姓名：{{user.userName}}</span>
                        <span>性别：{{user.sex}}</span>
                    </p>
                    <p>
                        <span>手机号码： {{user.phone}}</span>
                        <span>邮箱：{{user.email}}</span>
                    </p>
                    <p>
                        <span>学历：{{user.record}}</span>
                        <span>毕业学校：{{user.school}}</span>
                    </p>
                    <p>
                        <span>期望城市: {{user.city}}</span>
                    </p>
                    <p>
                        简介：{{user.introduce}}
                    </p>
                </el-col>
            </el-row>
            <el-row v-if="false">
                <div class="box">
                    <h3>用户评价</h3>
                    <el-card>
                        <div class="content" v-for="(item, index) in evaluateList" :key="index">
                            <div class="contentHeader">
                                <el-avatar :src="item.avatar"></el-avatar>
                                <span class="name">{{item.name}}</span>
                                <el-rate
                                    v-model="item.rate"
                                    disabled
                                    show-score
                                    text-color="#ff9900"
                                    score-template="{value}">
                                </el-rate>
                            </div>
                            <div class="contentBody">
                                <p>{{item.desc}}</p>
                                <p><i class="el-icon-time"></i>{{item.time | timeFilter('yyyy-MM-dd')}}</p>
                            </div>
                        </div>
                    </el-card>
                </div>
            </el-row>
            <el-row>
                <div class="box">
                    <h3>最近发布</h3>
                    <el-timeline class="eltimeline">
                        <el-timeline-item :timestamp="item.info.time" placement="top" v-for="(item, index) in list.slice(0,3)" :key="index">
                            <el-card>
                                <h5>{{item.info.desc}}</h5>
                                <p>提交于 {{item.info.time}}</p>
                            </el-card>
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </el-row>
        </el-card>
    </el-main>
</template>

<script>
import {evaluateList, alist} from '@/lib/data.js'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            evaluateList: evaluateList,
            list: alist
        }
    },
    methods: {
        goBack(){
            this.$router.go(-1)
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
    .eltimeline{
        .el-timeline-item{
            p{
                margin: 10px 0;
                padding: 0;
                font-size: 12px;
            }
        }
    }
}
</style>