<template>
    <el-row>
        <h3>首页轮播图</h3>
        <router-link to="/admin/index/edit" tag="div" style="text-align: left;">
            <el-button type="primary">新建</el-button>
        </router-link>
        <el-table
            :data="dataList"
            style="width: 100%">
            <el-table-column label="id" prop="bid"></el-table-column>
            <el-table-column label="标题" prop="title"></el-table-column>
            <el-table-column label="描述" prop="desc"></el-table-column>
            <el-table-column label="图片" prop="img">
                <template slot-scope="scope">
                    <img
                    width="150"
                    :src="scope.row.img"
                    preview="1" />
                </template>
            </el-table-column>
            <el-table-column label="时间" prop="time">
                <template slot-scope="scope">
                    {{scope.row.btime}}
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
                    @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            style="margin-top:20px; text-align:center;"
            :current-change="handleChange">
        </el-pagination>
    </el-row>
</template>

<script>
export default {
    data() {
        return {
            dataList: [],
            page: 1,
            total: 0
        }
    },
    methods: {
        getData(){
            let data = this.$qs.stringify({
                page: this.page
            })
            this.axios.post("/bannerController/getBanners", data)
            .then(res => {
                if(res.data.message){
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                } else {
                    this.total = res.data.total
                    this.dataList = res.data.list
                }
            }).catch(er => {
                this.$alert("获取数据异常", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        handleEdit(index, obj){
            this.$router.push({
                path: '/admin/index/edit?', 
                query: {data: JSON.stringify(obj)}
            })
        },
        handleDel(index, obj){
            this.$confirm('确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = this.$qs.stringify({
                    bid: obj.bid,
                    img: obj.img
                })
                this.axios.post("/bannerController/delBanner", data)
                .then(res => {
                    if(res.data.message){
                        this.$alert(res.data.message, "提示", {
                            confirmButtonText: "确定"
                        })
                    } else {
                        this.$alert("删除成功!", "提示",{
                            confirmButtonText: "确定",
                            callback: () => {
                                this.total--
                                this.dataList.splice(index, 1)
                            }
                        })
                    }
                }).catch(err => {
                    this.$alert("删除失败，请刷新重试!", "提示", {
                        confirmButtonText: "确定"
                    })
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })   
            })
        },
        handleChange(page){
            this.page = page
            this.getData()
        }
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