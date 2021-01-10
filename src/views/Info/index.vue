<template>
    <el-main>
        <el-row>
            <el-col :sm="24" :md="24" :lg="24">
                <Carousel></Carousel>
                <el-row>
                    <el-col class="typeBox" :sm="13" :md="13" :lg="13">
                        <span>地区:</span>
                        <Select @change="change"></Select>
                    </el-col>
                    <el-col class="typeBox" :sm="8" :md="8" :lg="8">
                        <span>薪资:</span>
                        <el-input v-model="minSalary" oninput="value=value.replace(/^\.+|[^\d.]/g,'')"></el-input> - 
                        <el-input v-model="maxSalary" oninput="value=value.replace(/^\.+|[^\d.]/g,'')"></el-input>
                    </el-col>
                    <el-col class="typeBox" :sm="3" :md="3" :lg="3">
                        <el-button type="primary" @click="handleSearch">搜索</el-button>
                    </el-col>
                </el-row>
                <ul v-loading="loading" style="min-height: 200px;">
                    <li v-for="(item, index) in list" :key="index">
                        <JobInfo :item="item"></JobInfo>
                    </li>
                    <li v-if="!list.length">搜索不到相关内容，重新筛选试试~</li>
                </ul>
                <el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="handleChange"
                    :total="total"
                    :page-size="2">
                </el-pagination>
            </el-col>
        </el-row>
    </el-main>
</template>

<script>
import Select from '_c/Select/index.vue'
import JobInfo from '_c/JobInfo/index.vue'
import Carousel from '_c/Carousel/index.vue'
export default {
    data() {
        return {
            loading: true,
            page: 1,
            list: [],
            obj: {},
            minSalary: '',
            maxSalary: '',
            total: 0,
            search: false
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
                page: this.page,
                type: 1
            })
            this.axios.post("/jobController/getAllJob", data)
            .then(res => {
                this.list = res.data.list
                this.loading = false
                this.total = res.data.total || 0
            }).catch(err => {
                this.$alert('获取数据失败，请稍后重试！', "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        getDataBySearch(){
            let data = this.$qs.stringify({
                province: this.obj.province,
                city: this.obj.city,
                block: this.obj.block,
                minSalary: this.minSalary,
                maxSalary: this.maxSalary,
                page: this.page,
                type: 1
            })
            this.axios.post("/jobController/getAllJob", data)
            .then(res => {
                this.list = res.data.list
                this.loading = false
                this.total = res.data.total || 0
            }).catch(err => {
                this.$alert('获取数据失败，请稍后重试！', "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        handleChange(page){
            this.page = page
            if(!this.search){
                this.getData()
            } else {
                this.getDataBySearch()
            }
        },
        change(obj){
            this.obj = obj
        },
        handleSearch(){
            this.page = 1
            this.loading = true
            this.getDataBySearch()
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