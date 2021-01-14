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
                            <span>{{ props.row.introduce }}</span>
                        </el-form-item>
                        <el-form-item label="证件:">
                            <img :src="props.row.IDpass" alt="" preview="1">
                        </el-form-item>
                        <br>
                        <el-form-item label="操作:">
                            <el-button type="success" size="small" @click="handlePass(props.$index, props.row.userUUID)">通过</el-button>
                            <el-button type="danger" size="small" @click="handleReject(props.$index, props.row.userUUID)">拒绝</el-button>
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
            <el-table-column label="注册时间">
                <template slot-scope="scope">
                    {{scope.row.regTime | timeFilter("yyyy-MM-dd")}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="success"
                        @click="handlePass(scope.$index, scope.row.userUUID)">通过</el-button>
                    <el-button
                        size="mini"
                        type="danger"
                        @click="handleReject(scope.$index, scope.row.userUUID)">拒绝</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
        background
        v-if="userData.length"
        layout="prev, pager, next"
        :total="total"
        @current-change="currentPageChange">
        </el-pagination>
    </el-main>
</template>

<script>
export default {
    data() {
        return {
            userData: [],
            page: 1,
            total: 0,
            search: ''
        }
    },
    methods: {
        getData(){
            let data = this.$qs.stringify({
                page: this.page,
                userName: this.search
            })
            this.axios.post("/userController/getAuthUser", data)
            .then(res => {
                if(res.data.message){
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                } else {
                    this.userData = res.data.userlist
                    this.total = res.data.total
                }
            }).catch(err => {
                this.$alert("获取数据异常", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        handlePass(index, userUUID){
            this.$confirm('确定通过吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = this.$qs.stringify({
                    uid: userUUID,
                    pass: 1
                })
                this.axios.post("/userController/updAuth", data)
                .then(res => {
                    if(res.data.message){
                        this.$alert(res.data.message, "提示", {
                            confirmButtonText: "确定"
                        })
                    } else {
                        this.userData.splice(index, 1)
                        this.$message({
                            message: "已通过",
                            type: "success"
                        })
                    }
                }).catch(err => {
                    this.$alert("操作失败，请稍后重试", "提示", {
                        confirmButtonText: "确定"
                    })
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消!'
                })
            })
        },
        handleReject(index, userUUID){
            this.$prompt('请输入拒绝的原因：','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({value}) => {
                if(!value.trim()){
                    this.$alert("请输入拒绝的理由", "提示", {
                        confirmButtonText: "确定"
                    })
                    return
                }
                let data = this.$qs.stringify({
                    uid: userUUID,
                    pass: 0,
                    reason: value
                })
                this.axios.post("/userController/updAuth", data)
                .then(res => {
                    if(res.data.message){
                        this.$alert(res.data.message, "提示", {
                            confirmButtonText: "确定"
                        })
                    } else {
                        this.userData.splice(index, 1)
                        this.$message({
                            message: "已拒绝",
                            type: "success"
                        })
                    }
                }).catch(err => {
                    this.$alert("操作失败，请稍后重试", "提示", {
                        confirmButtonText: "确定"
                    })
                })
            }).catch(()=>{
                this.$message({
                    type: 'warning',
                    message: '已取消!'
                })
            })
        },
        currentPageChange(page){
            this.page = page
            this.getData()
        },
        handleSearch(){
            this.getData()
        },
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