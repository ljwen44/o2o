<template>
    <el-main>
        <h3>求教信息管理</h3>
        <span class="label_span">兼职状态:</span>
        <el-select v-model="pstatus" placeholder="请选择" style="float: left;">
            <el-option
                v-for="item in pstatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
        <span class="label_span">兼职发布者类型:</span>
        <el-select v-model="type" placeholder="请选择" style="float: left;">
            <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
        <el-button type="primary" style="float: left;margin-left: 20px;" @click="handleSelect">筛选</el-button>
        <el-table
            v-loading="loading"
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
                    <span>{{scope.row.userPhone}}</span>
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
                        @click="handleDel(scope.$index, scope.row.pid, scope.row.userUUID)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
        background
        v-if="tableData.length"
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
            loading: true,
            tableData: [],
            page: 1,
            total: 0,
            pstatus: "",
            type: "学员",
            pstatusOptions: [
                {
                    label: "全部",
                    value: ""
                },
                {
                    label: "未接单",
                    value: "未接单"
                },
                {
                    label: "进行中",
                    value: "进行中"
                },
                {
                    label: "已完成",
                    value: "已完成"
                },
            ],
            typeOptions: [
                {
                    label: "学员",
                    value: "学员"
                },
                {
                    label: "教员",
                    value: "教员"
                }
            ]
        }
    },
    components: {
        JobInfo
    },
    methods: {
        getData(){
            let data = this.$qs.stringify({
                page: this.page,
                type: this.type,
                pstatus: this.pstatus
            })
            this.axios.post("/adminController/getPJobByAdmin", data)
            .then(res => {
                if(res.data.message){
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                } else {
                    this.tableData = res.data.list
                    this.total = res.data.total || 0
                    this.loading = false
                }
            }).catch(err => {
                this.$alert("获取数据异常", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        handleDel(index, id, uid){
            let data = this.$qs.stringify({
                pid: id,
                uid: uid
            })
            this.axios.post("/adminController/delPJobByPid", data)
            .then(res => {
                if(res.data.message){
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                } else {
                    this.$message({
                        type: "success",
                        message: "删除成功"
                    })
                    this.tableData.splice(index,1)
                }
            }).catch(err => {
                this.$alert("操作失败，请稍后重试!", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        currentPageChange(page){
            this.page = page
            this.getData()
        },
        handleSelect(){
            this.page = 1
            this.getData()
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
    h3{
        text-align: left;
        border-left: 5px solid #3cabcf;
        margin: 1rem;
        padding-left: 10px;
    }
    .label_span{
        float: left;
        line-height: 40px;
        margin: 0 10px;
    }
    .el-pagination{
        text-align: center;
        margin-top: 20px;
    }
}
</style>