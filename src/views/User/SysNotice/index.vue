<template>
    <el-main>
        <h3>系统通知</h3>
        <el-timeline v-if="sysList.length">
            <el-timeline-item :timestamp="item.time | timeFilter('yyyy-MM-dd')" placement="top" v-for="(item, index) in sysList" :key="index">
                <el-card>
                    <h4>{{item.desc}}</h4>
                    <p>{{item.time}}</p>
                </el-card>
            </el-timeline-item>
        </el-timeline>
        <p style="text-align: left;" v-else>您还没有接收到任何系统通知</p>
    </el-main>
</template>

<script>
import {mapState} from 'vuex'
export default {
    data() {
        return {
            sysList: []
        }
    },
    methods: {
        getData(){
            let data = this.$qs.stringify({
                uid: this.user.userUUID
            })
            this.axios.post("/sysNoticeController/getSysNotice", data)
            .then(res => {
                if(res.data.message){
                    this.$alert("获取数据异常", "提示", {
                        confirmButtonText: "确定"
                    })
                } else {
                    this.sysList = res.data.sysList
                }
            }).catch(err => {
                this.$alert("获取数据异常", "提示", {
                    confirmButtonText: "确定"
                })
            })
        }
    },
    created() {
    },
    computed: {
        ...mapState([
            'user'
        ])
    },
}
</script>

<style lang='less' scoped>
.el-main{
    min-height: 500px;
    padding: 20px;
    h3{
        border-left: 5px solid #3cabcf;
        padding-left: 10px;
        text-align: left;
        margin-bottom: 20px;
    }
    .el-timeline{
        text-align: left;
        .el-timeline-item{
            .el-timeline-item__wrapper{
                .el-card{
                    background-color: rgba(255,255,255,.5);
                    h4{
                        cursor: pointer;
                        margin-bottom: 20px;
                    }
                    p{
                        font-size: 12px;
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