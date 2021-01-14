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
                <el-table-column label="注册时间" prop="regTime"></el-table-column>v
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.row.userUUID, scope.row.type)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                layout="prev, pager, next"
                :current-change="pageChange"
                :total="total">
            </el-pagination>
        </el-row>
        <el-row v-else>
            <p style="margin: 20px 0; text-align: left;">查找不到用户~</p>
        </el-row>
    </el-main>
</template>

<script>
export default {
    data() {
        return {
            userData: [],
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
            page: 1,
            total: 0
        }
    },
    methods: {
        getData(value){
            let data = this.$qs.stringify({
                type: value,
                userName: this.search,
                page: this.page
            })
            this.axios.post("/userController/getUserByConditions", data)
            .then(res => {
                if(res.data.message){
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                } else {
                    this.userData = res.data.userList
                    this.total = res.data.total
                }
            }).catch(err => {
                this.$alert("获取数据异常", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        handleSearch(){
            this.page = 1
            this.getData(this.value)
        },
        handleEdit(id, type){
            this.$router.push({
                path: '/admin/user/detail',
                query: {
                    uid: id,
                    type: type
                }
            })
        },
        pageChange(page){
            this.page = page
            this.getData()
        }
    },
    created() {
        this.getData()
    },
    watch: {
        value(newVal, oldVal){
            this.getData(newVal)
            return newVal
        }
    }
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