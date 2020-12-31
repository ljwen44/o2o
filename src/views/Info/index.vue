<template>
    <el-main>
        <el-row>
            <el-col :sm="24" :md="24" :lg="24">
                <Carousel></Carousel>
                <el-row>
                    <el-col class="typeBox" :sm="14" :md="14" :lg="14">
                        <span>地区:</span>
                        <Select @change="change"></Select>
                    </el-col>
                    <el-col class="typeBox" :sm="10" :md="10" :lg="10">
                        <span>薪资:</span>
                        <el-input v-model="minSalary" oninput="value=value.replace(/^\.+|[^\d.]/g,'')"></el-input> - 
                        <el-input v-model="maxSalary" oninput="value=value.replace(/^\.+|[^\d.]/g,'')"></el-input>
                    </el-col>
                </el-row>
                <ul v-loading="loading">
                    <li v-for="(item, index) in list" :key="index">
                        <JobInfo :item="item"></JobInfo>
                    </li>
                </ul>
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :current-change="handleChange"
                    :total="1000">
                </el-pagination>
            </el-col>
        </el-row>
    </el-main>
</template>

<script>
import Select from '_c/Select/index.vue'
import JobInfo from '_c/JobInfo/index.vue'
import Carousel from '_c/Carousel/index.vue'
import {alist} from '@/lib/data'
export default {
    data() {
        return {
            loading: true,
            page: 1,
            list: alist,
            obj: {},
            minSalary: '',
            maxSalary: ''
        }
    },
    components: {
        JobInfo,
        Select,
        Carousel
    },
    methods: {
        getData(){
            let data = this.$qs.stringify({
                province: this.obj.province,
                city: this.obj.city,
                block: this.obj.block,
                minSalary: this.minSalary,
                maxSalary: this.maxSalary,
                page: this.page,
                type: 0
            })
            this.axios.post("/jobController/getAllJob", data)
            .then(res => {
                this.list = res.data.list
                this.loading = false
            }).catch(err => {
                this.$alert('获取数据失败，请稍后重试！', "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        handleChange(page){
            this.page = page
        },
        change(obj){
            this.obj = obj
        }
    },
    created() {
        this.getData()
    },
}
</script>

<style lang='less' scoped>
.el-main{
    padding: 0;
    .typeBox{
        text-align: left;
        padding: 0 20px;
        span{
            margin-right: 10px;
        }
        .el-input{
            width: 40%;
        }
    }
}
</style>