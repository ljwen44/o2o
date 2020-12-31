<template>
    <el-main>
        <h3>求教信息管理</h3>
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <JobInfo :item="props.row"></JobInfo>
                </template>
            </el-table-column>
            <el-table-column
                label="发布者">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="联系人">
                <template slot-scope="scope">
                    <span>{{scope.row.userName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="联系电话">
                <template slot-scope="scope">
                    <span>{{scope.row.phone}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="地址">
                <template slot-scope="scope">
                    <span>{{scope.row.province + scope.row.city + scope.row.block + scope.row.address}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="发布时间">
                <template slot-scope="scope">
                    <span>{{scope.row.ptime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="danger"
                        @click="handleDel(scope.$index, scope.row.pid)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="currentPageChange">
        </el-pagination>
    </el-main>
</template>

<script>
import JobInfo from '_c/JobInfo/index.vue'
export default {
    data() {
        return {
            tableData: [],
            page: 1,
            total: 0
        }
    },
    components: {
        JobInfo
    },
    methods: {
        getData(){
            let data = this.$qs.stringify({
                page: this.page,
                type: 1
            })
            this.axios.post("/jobController/getAllJob", data)
            .then(res => {
                if(res.data.message){
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                } else {
                    this.tableData = res.data.list
                    this.total = res.data.total || 0
                }
            }).catch(err => {
                this.$alert("获取数据异常", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        handleDel(index, id){
            console.log(id)
        },
        currentPageChange(page){
            this.page = page
            this.getData()
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