<template>
    <el-main>
        <h3>求教信息管理</h3>
        <el-table
            :data="userData"
            style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <JobInfo :item="props.row"></JobInfo>
                </template>
            </el-table-column>
            <el-table-column
                label="发布者">
                <template slot-scope="scope">
                    <span>{{scope.row.user.userName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="联系人">
                <template slot-scope="scope">
                    <span>{{scope.row.info.userName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="联系电话">
                <template slot-scope="scope">
                    <span>{{scope.row.info.phone}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="地址">
                <template slot-scope="scope">
                    <span>{{scope.row.info.place}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="发布时间">
                <template slot-scope="scope">
                    <span>{{scope.row.info.time}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="danger"
                        @click="handleDel(scope.$index, scope.row.info)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
        background
        layout="prev, pager, next"
        :total="1000"
        @current-change="currentPageChange">
        </el-pagination>
    </el-main>
</template>

<script>
import JobInfo from '_c/JobInfo/index.vue'
import {alist} from '@/lib/data.js'
export default {
    data() {
        return {
            userData: alist,
            page: 1
        }
    },
    components: {
        JobInfo
    },
    methods: {
        handleDel(index, id){
            this.$message(index)
        },
        currentPageChange(page){
            this.page = page
            console.log(page)
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
    .el-pagination{
        text-align: center;
        margin-top: 20px;
    }
}
</style>