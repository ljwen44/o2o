<template>
    <div class="echarts">
        <div :style="{height:'400px',width:'100%'}" ref="lineEchart"></div>
    </div>
</template>

<script>
export default {
    name: "lineEcharts",
    props: {
        time: Array
    },
    data() {
        return {
            chart: null,
            day: [],
            coin: [],
            order: []
        };
    },
    mounted() {
        this.chinaConfigure()
        this.getData(this.time[0])
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
            this.chart = this.$echarts.init(this.$refs.lineEchart); //这里是为了获得容器所在位置
            this.chart.setOption({
                tooltip: {
                    trigger: "axis",
                    textStyle:{
                        align:'left'
                    }
                },
                legend: {
                    data: ["成交量", "成交金额"]
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
                xAxis: [
                    {
                        type: "category",
                        data: []
                    },
                ],
                yAxis: [
                    {
                        type: "value",
                        name: "/单"
                    },
                    {
                        type: "value",
                        name: "/元"
                    }
                ],
                series: [
                    {
                        name: "成交量",
                        type: "line",
                        data: [],
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                    },
                    {
                        name: "成交金额",
                        type: "line",
                        data: [],
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
        getDay(time){
            console.log(time)
            this.day.length = 0
            let year = time[0], month = time[1]
            switch(month){
                case '2':
                    month = "0" + month
                    if(year % 100 != 0 && year % 4 == 0 || year % 400 == 0){
                        for(let i=1; i < 30; i++){
                            let date = i < 10 ? '0'+ i : i
                            let str = month + "-" + date
                            this.day.push(str)
                        }
                    } else {
                        for(let i=1; i < 29; i++){
                            let date = i < 10 ? '0'+ i : i
                            let str = month + "-" + date
                            this.day.push(str)
                        }
                    }
                    break
                case '4' || '6' || '9' || '11':
                    if(month < 10){
                        month = "0" + month
                    }
                    for(let i=1; i < 31; i++){
                        let date = i < 10 ? '0'+ i : i
                        let str = month + "-" + date
                        this.day.push(str)
                    }
                    break
                default:
                    if(month < 10){
                        month = "0" + month
                    }
                    for(let i=1; i < 32; i++){
                        let date = i < 10 ? '0'+ i : i
                        let str = month + "-" + date
                        this.day.push(str)
                    }
                    break
            }
        },
        getData(year){
            let data = this.$qs.stringify({
                date: year + '-' + this.day[this.day.length-1],
                num: this.day.length
            })
            this.chart.showLoading()
            this.axios.post("/adminController/getOrderByDate", data)
            .then(res => {
                if(res.data.message){
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                } else {
                    for (let index = 0; index < res.data.orderList.length; index++) {
                        this.order.unshift(res.data.orderList[index].value)
                        this.coin.unshift(res.data.coinList[index].value)
                    }
                    this.chart.setOption({
                        xAxis: [
                            {
                                type: "category",
                                data: this.day
                            },
                        ],
                        series: [
                            {
                                name: "成交量",
                                data: this.order
                            },
                            {
                                name: "成交金额",
                                data: this.coin
                            }
                        ]
                    })
                    this.chart.hideLoading()
                }
            }).catch(err => {
                this.$alert("获取数据异常，请刷新重试", "提示", {
                    confirmButtonText: "确定"
                })
            })
        }
    },
    created() {
        this.getDay(this.time)
    },
    watch: {
        time(newVal, oldVal){
            this.getDay(newVal)
            this.getData(newVal[0])
            return newVal
        }
    }
}
</script>

<style lang='less' scoped>
</style>