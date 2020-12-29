<template>
    <el-main>
        <h3>我的发布</h3>
        <router-view></router-view>
    </el-main>
</template>

<script>
export default {
    data() {
        return {

        }
    },
}
</script>

<style lang='less' scoped>
.el-main{
    text-align: left;
    padding: 20px;
    h3{
        padding-left: 20px;
        border-left: 5px solid #3cabcf;
        margin-bottom: 20px;
    }
}
</style>