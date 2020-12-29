<template>
    <el-carousel indicator-position="outside">
        <el-carousel-item v-for="(item, index) in list" :key="index">
            <el-image :src="item.url" alt="" fit="fill"></el-image>
        </el-carousel-item>
    </el-carousel>
</template>

<script>
import {bannerImgList} from '@/lib/data.js'
export default {
    data() {
        return {
            list: bannerImgList
        }
    },
}
</script>

<style lang='less' scoped>
.el-carousel{
    padding: 0 20px;
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