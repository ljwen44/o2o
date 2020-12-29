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
            day: []
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
                        data: this.day
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
                        data: [
                            51, 52, 62, 54, 51, 55, 67,
                            51, 52, 62, 54, 51, 55, 67,
                            51, 52, 62, 54, 51, 55, 67,
                            51, 52, 62, 54, 51, 55, 67,
                            51, 52, 62, 54
                        ],
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
                        data: [
                            124, 46, 76, 55, 43, 62, 40,
                            124, 46, 76, 55, 43, 62, 40,
                            124, 46, 76, 55, 43, 62, 40,
                            124, 46, 76, 55, 43, 62, 40,
                            124, 46, 76, 55
                        ],
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
            this.day.length = 0
            let year = time[0], month = time[1]
            switch(month){
                case '2':
                    if(year % 100 != 0 && year % 4 == 0 || year % 400 == 0){
                        for(let i=1; i < 30; i++){
                            let str = month + "-" + i
                            this.day.push(str)
                        }
                    } else {
                        for(let i=1; i < 29; i++){
                            let str = month + "-" + i
                            this.day.push(str)
                        }
                    }
                case '4' || '6' || '9' || '11':
                    for(let i=1; i < 31; i++){
                        let str = month + "-" + i
                        this.day.push(str)
                    }
                default: 
                    console.log("执行赋值")
                    for(let i=1; i < 32; i++){
                        let str = month + "-" + i
                        this.day.push(str)
                    }
            }
        }
    },
    created() {
        this.getDay(this.time)
    },
    watch: {
        time(newVal, oldVal){
            this.getDay(newVal)
            this.chart.setOption({
                xAxis: {
                    type: "category",
                    data: this.day
                },
            })
            return newVal
        }
    }
}
</script>

<style lang='less' scoped>
</style>