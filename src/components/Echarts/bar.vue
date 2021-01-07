<template>
    <div class="echarts">
        <div :style="{height:'400px',width:'100%'}" ref="barEchart"></div>
    </div>
</template>

<script>
export default {
    name: "barEcharts",
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
            this.chart = this.$echarts.init(this.$refs.barEchart); //这里是为了获得容器所在位置
            this.chart.setOption({
                title: {
                    text: "用户类型对比",
                    x: "center"
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: "vertical",
                    x: "left",
                    data: ["学员", "教员"]
                },
                calculable: true,
                series: [
                    {
                        name: "用户类型",
                        type: "pie",
                        radius: "55%",
                        center: ["50%", "60%"],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    formatter: "{b}: {c} ({d}%)"
                                },
                                color: (params) => {
                                    let colorList = ['#05c3e7', '#3e8b9a']
                                    return colorList[params.dataIndex]
                                }
                            }
                        },
                        data: this.barData
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