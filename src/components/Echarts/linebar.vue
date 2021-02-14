<template>
    <div class="echarts">
        <div :style="{height:'400px',width:'100%'}" ref="barlinechart"></div>
    </div>
</template>

<script>
export default {
    name: "barlinecharts",
    // props: ["barData"],
    data() {
        return {
            chart: null,
            time: [],
            stuList: [],
            teaList: [],
            sign: []
        }
    },
    mounted() {
        this.chinaConfigure()
        this.getData()
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
                        data: []
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
                        data: [],
                        itemStyle: {
                            normal: {
                                color: '#05c3e7'
                            }
                        },
                    },
                    {
                        name: "教员",
                        type: "bar",
                        data: [],
                        itemStyle: {
                            normal: {
                                color: '#3e8b9a'
                            }
                        },
                    },
                    {
                        name: "用户在线人数",
                        type: "line",
                        data: []
                    },
                ]
            })
            window.addEventListener('resize', () => {
                this.chart.resize()
            })
        },
        getData(){
            this.chart.showLoading()
            this.axios.post("/adminController/getBarLineByDate")
            .then(res => {
                if(res.data.message){
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                } else {
                    for (let index = 0; index < res.data.stuList.length; index++) {
                        this.stuList.unshift(res.data.stuList[index].value)
                        this.time.unshift(res.data.stuList[index].time)
                        this.teaList.unshift(res.data.teaList[index].value)
                        this.sign.unshift(res.data.userSignList[index].value)
                    }
                    this.chart.setOption({
                        xAxis: [
                            {
                                type: "category",
                                data: this.time
                            },
                        ],
                        series: [
                            {
                                name: "学员",
                                data: this.stuList
                            },
                            {
                                name: "教员",
                                data: this.teaList
                            },
                            {
                                name: "用户在线人数",
                                data: this.sign
                            }
                        ]
                    })
                    this.chart.hideLoading()
                }
            }).catch(err => {
                console.log(err)
                this.$alert("获取数据异常，请刷新重试", "提示", {
                    confirmButtonText: "确定"
                })
            })
        }
    }
}
</script>

<style lang='less' scoped>
</style>