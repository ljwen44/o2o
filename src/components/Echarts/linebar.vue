<template>
    <div class="echarts">
        <div :style="{height:'400px',width:'100%'}" ref="barlinechart"></div>
    </div>
</template>

<script>
export default {
    name: "barlinecharts",
    props: ["barData"],
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
            this.chart = this.$echarts.init(this.$refs.barlinechart); //这里是为了获得容器所在位置
            this.chart.setOption({
                title: {
                    text: "近期用户活跃情况",
                },
                tooltip: {
                    trigger: "axis",
                    textStyle:{
                        align:'left'
                    }
                },
                legend: {
                    data: ["学员", "教员", "用户在线人数"]
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: "category",
                        data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月"]
                    },
                    {
                        type: "category",
                        boundaryGap: false,
                    }
                ],
                yAxis: [
                    {
                        type: "value"
                    },
                    {
                        type: "value",
                        name: "/人"
                    }
                ],
                series: [
                    {
                        name: "学员",
                        type: "bar",
                        data: [2, 4.9, 7, 23.2, 25.6, 76.7, 135.6],
                        itemStyle: {
                            normal: {
                                color: '#05c3e7'
                            }
                        },
                    },
                    {
                        name: "教员",
                        type: "bar",
                        data: [2.6, 5.9, 9, 26.4, 28.7, 70.7, 175.6],
                        itemStyle: {
                            normal: {
                                color: '#3e8b9a'
                            }
                        },
                    },
                    {
                        name: "用户在线人数",
                        type: "line",
                        data: [51, 52, 62, 54, 51, 55, 67]
                    },
                ]
            })
            window.addEventListener('resize', () => {
                this.chart.resize()
            })
        },
    }
}
</script>

<style lang='less' scoped>
</style>