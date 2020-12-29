<template>
    <el-container>
        <Header></Header>
        <el-main class="elmain" id="scro">
            <el-row>
                <el-col :sm="19" :md="19" :lg="20">
                    <router-view></router-view>
                </el-col>
                <el-col :sm="5" :md="5" :lg="4">
                    <Calendar></Calendar>
                    <div>
                        <h3 style="padding: 10px 0;">推荐教员</h3>
                        <ul v-loading="loading" class="ulUser">
                            <li v-for="(item, index) in ulist" :key="index">
                                <UserCard :item="item"></UserCard>
                            </li>
                            <li v-if="!errMsg">{{errMsg}}</li>
                        </ul>
                    </div>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
import Header from '_c/Header/index.vue'
import Calendar from '_c/Calendar/index.vue'
import UserCard from '_c/TeachCard/index.vue'
export default {
    data() {
        return {
            ulist: [],
            loading: true,
            errMsg: ''
        }
    },
    components: {
        Header,
        Calendar,
        UserCard
    },
    methods: {
        getData(){
            this.axios.post("/userController/getRecUser")
            .then(res => {
                if(res.data.message){
                    this.errMsg = res.data.message
                    this.loading = false
                } else{
                    this.ulist = res.data.list
                }
            }).catch(err => {
                this.errMsg = "获取数据失败",
                this.loading = false
            })
        }
    },
}
</script>

<style lang='less' scoped>
.el-container{
    background: #b5dbdf;
    height: 100vh;
    .elmain{
        margin-top: 60px;
        overflow-y: scroll;
        .el-row{
            .ulUser{
                min-height: 200px;
            }
        }
    }
}
</style>