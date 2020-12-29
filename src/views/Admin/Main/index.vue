<template>
    <el-main>
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
    padding: 0;
    h3{
        text-align: left;
        border-left: 5px solid #3cabcf;
        margin: 1rem;
        padding-left: 10px;
    }
}
</style>