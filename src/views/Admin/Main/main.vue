<template>
    <el-row>
        <h3>首页轮播图</h3>
        <router-link to="/admin/index/edit" tag="div" style="text-align: left;">
            <el-button type="primary">新建</el-button>
        </router-link>
        <el-table
            :data="dataList"
            style="width: 100%">
            <el-table-column label="id" prop="_id"></el-table-column>
            <el-table-column label="标题" prop="title"></el-table-column>
            <el-table-column label="描述" prop="desc"></el-table-column>
            <el-table-column label="图片" prop="url">
                <template slot-scope="scope">
                    <img
                    width="150"
                    :src="scope.row.url"
                    preview="1" />
                </template>
            </el-table-column>
            <el-table-column label="时间" prop="time">
                <template slot-scope="scope">
                    {{scope.row.time | timeFilter("yyyy-MM-dd hh:mm:ss")}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDel(scope.$index, scope.row._id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-row>
</template>

<script>
import {bannerImgList} from '@/lib/data.js'
export default {
    data() {
        return {
            dataList: bannerImgList
        }
    },
    methods: {
        handleEdit(index, obj){
            this.$router.push({
                path: '/admin/index/edit?', 
                query: {data: JSON.stringify(obj)}
            })
        },
        handleDel(index, _id){
            this.$confirm('确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message("删除")
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })   
            })
        },
    },
}
</script>

<style lang='less' scoped>
h3{
    text-align: left;
    border-left: 5px solid #3cabcf;
    margin: 1rem;
    padding-left: 10px;
}
</style>