<template>
    <div class="echarts">
        <div :style="{height:'400px',width:'100%'}" ref="userLineEchart"></div>
    </div>
</template>

<script>
export default {
    name: "userLineEcharts",
    // props: {
    //     echartsData: Object
    // },
    data() {
        return {
            chart: null
        };
    },
    mounted() {
        this.chinaConfigure();
    },
    beforeDestroy() {
        if (!this.chart) {
            return;
        }
        this.chart.dispose();
        this.chart = null;
    },
    methods: {
        chinaConfigure() {
            this.chart = this.$echarts.init(this.$refs.userLineEchart); //这里是为了获得容器所在位置
            this.chart.setOption({
                title: {
                    text: "用户增加比率"
                },
                tooltip: {
                    trigger: "axis",
                    textStyle:{
                        align:'left'
                    }
                },
                legend: {
                    data: ["学员", "教员"]
                },
                xAxis: [
                    {
                        type: "category",
                        data: this.day
                    },
                ],
                yAxis: [
                    {
                        type: "value",
                        name: "/人"
                    }
                ],
                series: [
                    {
                        name: "学员",
                        type: "line",
                        data: [2,6,7,5,2,1,4],
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                    },
                    {
                        name: "教员",
                        type: "line",
                        data: [4,2,3,5,7,1,6],
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                    }
                ]
            })
            window.addEventListener('resize', () => {
                this.chart.resize()
            })
        },
    },
}
</script>

<style lang='less' scoped>
</style>