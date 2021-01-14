<template>
    <el-main>
        <h3>我的好友</h3>
        <p v-if="hidden">暂时还没有添加任何好友</p>
        <el-row class="frinendList" v-if="list.length" v-loading="loading">
            <ul>
                <li v-for="(item, index) in list" :key="index">
                    <el-card>
                        <el-row>
                            <el-col :sm="5" :md="5">
                                <el-image
                                    style="width: 50px;"
                                    :src="item.avatar"
                                    fit="fill">
                                </el-image>
                            </el-col>
                            <el-col :sm="15" :md="15" class="infoWrapper">
                                <span>姓名：{{item.userName}}</span><br>
                                <p>简介: {{item.introduce}}</p>
                            </el-col>
                            <el-col :sm="4" :md="4" class="opWrapper">
                                <el-button 
                                    type="primary" 
                                    size="mini" 
                                    @click="handleChat(item)"
                                >聊天</el-button>
                                <el-button 
                                    @click="handleDel(item.fid, item.userUUID, index)" 
                                    size="mini" 
                                    style="margin-left:0;margin-top:5px;"
                                >删除</el-button>
                            </el-col>
                        </el-row>
                    </el-card>
                </li>
            </ul>          
        </el-row>
        <el-pagination
            v-if="list.length"
            background
            layout="prev, pager, next"
            :total="total"
            @current-change="handleChange">
        </el-pagination>
    </el-main>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            list: [],
            page: 1,
            total: 0,
            loading: true,
            hidden: false
        }
    },
    created() {
        this.getData()
    },
    methods: {
        getData(){
            let data = this.$qs.stringify({
                uid: this.user.userUUID,
                page: this.page
            })
            this.axios.post("/friendController/getFriendByUID", data)
            .then(res => {
                if(res.data.message){
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                } else {
                    this.list = res.data.list
                    this.total = res.data.total || 0
                    this.loading = false
                }
            }).catch(err => {
                this.$alert("获取数据异常", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        handleChange(page){
            this.page = page
            this.getData()
        },
        handleChat(obj){
            let userObj = {
                userName: obj.userName,
                avatar: obj.avatar,
                userUUID: obj.userUUID
            }
            this.$router.push({
                path: "/message",
                query: {
                    user: JSON.stringify(userObj)
                }
            })
        },
        handleDel(id, uid, index){
            this.$confirm('确认删除该好友吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = this.$qs.stringify({
                    fid: id,
                    uid: this.user.userUUID,
                    ruid: uid
                })
                this.axios.post("/friendController/delFriendByFID", data)
                .then(res => {
                    if(res.data.message){
                        this.$alert(res.data.message, "提示", {
                            confirmButtonText: "确定"
                        })
                    } else {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.list.splice(index, 1)
                    }
                }).catch(err => {
                    this.$alert("删除失败，请稍后重试!", "提示", {
                        confirmButtonText: "确定"
                    })
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        }
    },
    computed: {
        ...mapState([
            'user'
        ])
    },
    watch: {
        list(newVal, oldVal){
            if(newVal.length === 0){
                this.hidden = true
            }
            return newVal
        }
    }
}
</script>

<style lang='less' scoped>
.el-main{
    text-align: left;
    min-height: 400px;
    h3{
        border-left: 5px solid #3cabcf;
        padding-left: 10px;
        margin-bottom: 10px;
    }
    .frinendList{
        ul{
            li{
                float: left;
                width: 45%;
                margin-right: 5%;
                margin-bottom: 20px;
                .el-card{
                    .infoWrapper{
                        height: 54px;
                        line-height: 27px;
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
                        height: 54px;
                        line-height: 27px;
                    }
                }
            }
        }
        
    }
    .el-pagination{
        text-align: center;
        margin-top: 20px;
    }
}
</style>