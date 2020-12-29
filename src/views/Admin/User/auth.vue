<template>
    <el-main>
        <h3>认证管理</h3>
        <el-input placeholder="请输入用户名" v-model="search" @keyup.enter.native="handleSearch" style="width:40%;float:left">
            <template slot="append">
                <el-button @click="handleSearch">搜索</el-button>
            </template>
        </el-input>
        <el-table
            :data="userData"
            style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="真实姓名:">
                            <span>{{ props.row.userName }}</span>
                        </el-form-item>
                        <el-form-item label="性别:">
                            <span>{{ props.row.sex }}</span>
                        </el-form-item>
                        <el-form-item label="手机号码:">
                            <span>{{ props.row.phone }}</span>
                        </el-form-item>
                        <el-form-item label="邮箱:">
                            <span>{{ props.row.email }}</span>
                        </el-form-item>
                        <el-form-item label="毕业学校:">
                            <span>{{ props.row.school }}</span>
                        </el-form-item>
                        <br>
                        <el-form-item label="个人描述:">
                            <span>{{ props.row.consume }}</span>
                        </el-form-item>
                        <el-form-item label="证件:">
                            <img :src="props.row.IDpass" alt="" preview="1">
                        </el-form-item>
                        <br>
                        <el-form-item label="操作:">
                            <el-button type="success" size="small" @click="handlePass(props.$index, props.row._id)">通过</el-button>
                            <el-button type="danger" size="small" @click="handleReject(props.$index, props.row._id)">拒绝</el-button>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                label="真实姓名"
                prop="userName">
            </el-table-column>
            <el-table-column
                label="手机号码"
                prop="phone">
            </el-table-column>
            <el-table-column
                label="邮箱"
                prop="email">
            </el-table-column>
            <el-table-column
                label="毕业学校"
                prop="school">
            </el-table-column>
            <el-table-column
                label="注册时间"
                prop="regtime">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="success"
                        @click="handlePass(scope.$index, scope.row.uid)">通过</el-button>
                    <el-button
                        size="mini"
                        type="danger"
                        @click="handleReject(scope.$index, scope.row.uid)">拒绝</el-button>
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
import {ulist} from '@/lib/data.js'
export default {
    data() {
        return {
            userData: ulist
        }
    },
    methods: {
        handlePass(index, _id){
            this.$confirm('确定通过吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message("已通过")
            
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消!'
                })
            })
        },
        handleReject(index, _id){
            this.$prompt('请输入拒绝的原因：','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({value}) => {
                this.$message(value)
            }).catch(()=>{
                this.$message({
                    type: 'warning',
                    message: '已取消!'
                })
            })
        },
        currentPageChange(page){
            console.log(page)
        },
        handleSearch(){
            this.$message(this.search)
        },
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
    .demo-table-expand {
        font-size: 0;
        label {
            width: 90px;
            color: #99a9bf;
        }
        .el-form-item{
            margin-right: 0;
            margin-bottom: 0;
            width: 50%;
            .el-form-item__content{
                img{
                    width: 100px;
                }
            }
        }
    }
    .el-pagination{
        text-align: center;
        margin-top: 5%;
    }
}
</style>