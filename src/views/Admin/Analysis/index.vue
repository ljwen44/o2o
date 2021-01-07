<template>
    <el-main>
        <el-row>
            <el-col :sm="12" :md="12">
                <BarCharts></BarCharts>
            </el-col>
            <el-col :sm="12" :md="12">
                <UserLineCharts></UserLineCharts>
            </el-col>
        </el-row>
        <el-row style="margin-top:20px;">
            <BarLineEcharts></BarLineEcharts>
        </el-row>
        <el-row>
            <h3>每月成交量和总金额</h3>
            <div style="text-align: left;margin: 10px 0;">
                <el-cascader
                    v-model="selectVal"
                    :options="options"
                    @change="handleChange"></el-cascader>
            </div>
            <LineCharts :time="selectVal"></LineCharts>
        </el-row>
    </el-main>
</template>

<script>
import BarLineEcharts from '_c/Echarts/linebar.vue'
import BarCharts from '_c/Echarts/bar.vue'
import LineCharts from '_c/Echarts/line.vue'
import UserLineCharts from '_c/Echarts/userLine.vue'
import { months } from '@/lib/data.js'
export default{
    data() {
        return {
            selectVal: [],
            options: months
        }
    },
    components: {
        BarCharts,
        BarLineEcharts,
        LineCharts,
        UserLineCharts
    },
    methods: {
        handleChange(){
            console.log(this.selectVal)
        }
    },
    created() {
        let time = new Date()
        this.selectVal.push(time.getFullYear())
        this.selectVal.push(time.getMonth()+1)
    },
}
</script>

<style lang='less' scoped>
.el-main{
    .el-row{
        h3{
            padding-left: 10px;
            border-left: 5px solid #3cabcf;
            text-align: left;
        }
    }
}
</style>