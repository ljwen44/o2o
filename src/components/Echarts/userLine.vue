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
            chart: null,
            time: [],
            value: []
        };
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
                    data: "人数"
                },
                xAxis: [
                    {
                        type: "category",
                        data: [],
                        axisLabel: {  
                            interval:0,  
                            rotate:40  
                        }  
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
                        name: "人数",
                        type: "line",
                        data: [],
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                    },
                ]
            })
            window.addEventListener('resize', () => {
                this.chart.resize()
            })
        },
        getData(){
            this.chart.showLoading()
            this.axios.post("/adminController/getUserNumByDate")
            .then(res => {
                if(res.data.message){
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                } else {
                    for (let index = 0; index < res.data.userNumList.length; index++) {
                        this.time.unshift(res.data.userNumList[index].time)
                        this.value.unshift(res.data.userNumList[index].value)
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
                                name: "人数",
                                data: this.value
                            },
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
    },
}
</script>

<style lang='less' scoped>
</style>