<template>
    <el-main>
        <el-select v-model="value" placeholder="请选择" style="margin-bottom:20px;">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <el-timeline>
            <el-timeline-item 
                :timestamp="item.ptime" 
                placement="top" 
                v-for="(item, index) in list.filter(data => !value || data.pstatus === value)" 
                :key="index">
                <el-card>
                    <router-link :to="'/user/pjob/mypub/detail?pid='+item.pUUID" tag="h4">{{item.content}}</router-link>
                    <p>
                        <span><i class="el-icon-user"></i>联系人: {{item.userName}}</span>
                        <span><i class="el-icon-phone"></i>联系电话：{{item.userPhone}}</span>
                        <span>进度：{{item.pstatus}}</span>
                    </p>
                </el-card>
            </el-timeline-item>
        </el-timeline>
    </el-main>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            value: '',
            options: [
                {
                    value: "",
                    label: "全部"
                },
                {
                    value: "进行中",
                    label: "进行中"
                },
                {
                    value: "已完成",
                    label: "已完成"
                }
            ],
            list: []
        }
    },
    methods: {
        getData(){
            let data = this.$qs.stringify({
                uid: this.user.userUUID
            })
            this.axios.post("/jobController/findInfoByUID", data)
            .then(res => {
                this.list = res.data.list
            }).catch(err => {
                this.$alert("获取数据失败，请刷新重试！", "提示", {
                    confirmButtonText: "确定"
                })
            })
        }
    },
    computed: {
        ...mapState([
            'user'
        ])
    },
    created() {
        this.getData()
    },
}
</script>

<style lang='less' scoped>
.el-main{
    padding: 0;
    .el-timeline{
        text-align: left;
        .el-timeline-item{
            .cardHeader{
                text-align: left;
                .el-avatar{
                    vertical-align: middle;
                    margin-right: 20px;
                }
                .autor{
                    margin-right: 20px;
                    font-weight: 600;
                    vertical-align: middle;
                    display: inline-block;
                    span{
                        cursor: pointer;
                    }
                    .fans{
                        font-weight: 400;
                        font-size: 12px;
                        color: #423f3f;
                    }
                }
                .el-button{
                    margin-top: 10px;
                    float: right;
                    padding: 5px 10px;
                }
            }
            .cardContent{
                margin-top: 20px;
                text-align: left;
                font-size: 14px;
                color: #312c2c;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            .el-timeline-item__wrapper{
                .el-card{
                    background-color: rgba(255,255,255,.5);
                    h4{
                        cursor: pointer;
                        margin-bottom: 10px;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                    }
                    p{
                        font-size: 12px;
                        span{
                            margin-right: 20px;
                        }
                        .unfinish{
                            float: right;
                        }
                        .finished{
                            float: right;
                            color: green;
                        }
                    }
                }
                .el-card:hover{
                    border: 1px solid #3cabcf;
                    background-color: rgba(255,255,255,1);
                }
            }
        }
    }
}
</style>