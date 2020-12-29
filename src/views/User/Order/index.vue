<template>
    <el-main>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1">
                <router-link to="/user/order/finish?type=0" tag="span" class="span">未完成</router-link>
            </el-menu-item>
            <el-menu-item index="2">
                <router-link to="/user/order/finish?type=1">已完成</router-link>
            </el-menu-item>
        </el-menu>
        <router-view></router-view>
    </el-main>
</template>

<script>
export default {
    data() {
        return {
            activeIndex: '1',
            activeIndex2: '1'
        }
    },
    methods: {
    }
}
</script>

<style lang='less' scoped>
.el-main{
    padding: 20px;
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
}
</style>