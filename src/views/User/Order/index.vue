<template>
    <el-main>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1">
                <span class="span" @click="type=0">未完成</span>
            </el-menu-item>
            <el-menu-item index="2">
                <span @click="type = 1">已完成</span>
            </el-menu-item>
        </el-menu>
        <el-timeline style="text-align: left; margin-top:20px;">
            <el-timeline-item 
                :timestamp="item.ppTime" 
                placement="top"
                v-for="(item, index) in list"
                :key="index">
                <el-card>
                    <router-link :to="'/user/order/detail?oid='+item.oid+'&pid='+item.pid" tag="h4">{{item.content}}</router-link>
                    <p>
                        <span><i class="el-icon-user"></i>联系人: {{item.userName}}</span>
                        <span><i class="el-icon-phone"></i>联系电话：{{item.userPhone}}</span>
                        <span class="unfinish" :style="{color: item.flag === '进行中'? '' : 'green'}">
                            <i :class="item.flag === '进行中'? 'el-icon-warning-outline' :'el-icon-success'"></i>
                            {{item.flag === '进行中'? "进行中" : "已完成"}}
                        </span>
                    </p>
                </el-card>
            </el-timeline-item>
        </el-timeline>
        <p v-if="!list.length" style="text-align: left; margin-top:20px;">
            您暂时还没接单~
        </p>
    </el-main>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            activeIndex: '1',
            activeIndex2: '1',
            list: [],
            type: 0
        }
    },
    methods: {
        getData(type){
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
    created() {
        this.getData(this.type)
    },
    computed: {
        ...mapState([
            'user'
        ])
    },
    watch: {
        type(newVal, oldVal){
            this.getData(newVal)
            return newVal
        }
    }
}
</script>

<style lang='less' scoped>
.el-main{
    padding: 20px;
    min-height: 400px;
    .el-menu{
        background: transparent;
        .span{
            width: inherit;
            height: inherit;
            display: block;
        }
    }
    .el-menu li:focus{
        background: transparent;
    }
    .el-timeline{
        .el-card{
            p{
                margin-top: 10px;
                span{
                    margin-right: 10px;
                }
            }
        }
    }
}
</style>