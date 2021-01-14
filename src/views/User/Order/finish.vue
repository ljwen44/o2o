<template>
    <el-main>
        <el-timeline>
            <el-timeline-item 
                timestamp="2018/4/12" 
                placement="top"
                v-for="(item, index) in list"
                :key="index">
                <el-card>
                    <router-link :to="'/user/order/detail?oid='+item.oid+'&pid='+item.pid" tag="h4">{{item.content}}</router-link>
                    <p>
                        <span><i class="el-icon-user"></i>联系人: {{item.userName}}</span>
                        <span><i class="el-icon-phone"></i>联系电话：{{item.userPhone}}</span>
                        <span class="unfinish" :style="{color: type === '进行中'? '' : 'green'}">
                            <i :class="type === '进行中'? 'el-icon-warning-outline' :'el-icon-success'"></i>
                            {{type === '进行中'? "进行中" : "已完成"}}
                        </span>
                    </p>
                </el-card>
            </el-timeline-item>
        </el-timeline>
        <p v-if="!list.length">
            您暂时还没接单~
        </p>
    </el-main>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            list: [],
            type: 0
        }
    },
    created() {
        this.type = this.$router.history.current.query
        this.getData(this.type)
    },
    computed: {
        ...mapState([
            'user'
        ])
    },
    methods: {
        getData(type){
            console.log(type)
            let data = this.$qs.stringify({
                uid: this.user.userUUID,
                flag: type === 0 ? "进行中" : "已完成"
            })
            this.axios.post("/orderController/getOrder", data)
            .then(res => {
                console.log(res.data)
                if(res.data.message){
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                } else {
                    this.list = res.data.list
                }
            }).catch(err => {
                this.$alert("获取数据异常", "提示", {
                    confirmButtonText: "确定"
                })
            })
        }
    },
    watch: {
        type(newVal, oldVal){
            console.log(newVal)
            this.getData(newVal)
            return newVal
        }
    }
}
</script>

<style lang='less' scoped>
.el-main{
    min-height: 400px;
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