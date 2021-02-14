<template>
    <el-carousel indicator-position="outside" v-loading="loading">
        <el-carousel-item v-for="(item, index) in list" :key="index">
            <el-image :src="item" alt="" fit="fill"></el-image>
        </el-carousel-item>
    </el-carousel>
</template>

<script>
// import {bannerImgList} from '@/lib/data.js'
export default {
    data() {
        return {
            // list: bannerImgList,
            list: [],
            loading: true
        }
    },
    methods: {
        getData(){
            this.axios.post("/bannerController/getIndexBanners")
            .then(res => {
                this.list = res.data.list
                this.loading = false
            }).catch(err =>{
                thia.$message({
                    message: "获取数据失败，请刷新重试!",
                    type: "info"
                })
            })
        }
    },
    created() {
        this.getData()
    },
}
</script>

<style lang='less' scoped>
.el-carousel{
    padding: 0 0 0 20px;
    /deep/
    .el-carousel__container{
        height: 364px;
        .el-image{
            width: 100%;
            height: 100%;
        }
    }
}
</style>