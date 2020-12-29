<template>
    <el-main>
        <div class="header">
            <el-select v-model="value" placeholder="请选择">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-input placeholder="请输入用户名" v-model="search" @keyup.enter.native="handleSearch">
                <template slot="append">
                    <el-button @click="handleSearch">搜索</el-button>
                </template>
            </el-input>
        </div>
        <el-row v-if="true">
            <el-table
                :data="userData.filter(data => !value || data.type === value)"
                style="width: 100%">
                <el-table-column label="姓名" prop="userName"></el-table-column>
                <el-table-column label="手机号码" prop="phone"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="类型" prop="type"></el-table-column>
                <el-table-column label="注册时间" prop="regtime"></el-table-column>v
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.row._id)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                layout="prev, pager, next"
                :current-change="pageChange"
                :total="100">
            </el-pagination>
        </el-row>
        <el-row v-else>
            <p style="margin: 20px 0; text-align: left;">查找不到用户~</p>
        </el-row>
    </el-main>
</template>

<script>
import {ulist} from '@/lib/data.js'
export default {
    data() {
        return {
            userData: ulist,
            options: [
                {
                    value: '',
                    label: "全部"
                },
                {
                    value: "教员",
                    label: "教员"
                },
                {
                    value: "学员",
                    label: "学员"
                }
            ],
            value: '',
            search: '',
            page: 1
        }
    },
    methods: {
        handleSearch(){
            this.$message(this.search)
        },
        handleEdit(id){
            this.$router.push('/admin/user/detail')
        },
        pageChange(page){
            this.page = page
        }
    },
}
</script>

<style lang='less' scoped>
.el-main{
    padding: 20px;
    .header{
        text-align: left;
        .el-input{
            display: inline-table;
            margin-left: 20px;
            width: 30%;
        }
    }
    .el-pagination{
        margin-top: 20px;
        text-align: center;
    }
}
</style>