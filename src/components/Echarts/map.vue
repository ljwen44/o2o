<template>
    <div class="echarts">
        <div :style="{height:'400px',width:'100%'}" ref="mapEchart"></div>
    </div>
</template>
<script>
import echarts from "echarts"
import '../../../node_modules/echarts/map/js/china.js' // 引入中国地图数据
export default {
    name: "mapEcharts",
    props: ["mapData"],
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
            this.chart = echarts.init(this.$refs.mapEchart); //这里是为了获得容器所在位置    
            this.chart.setOption({ // 进行相关配置
                tooltip: {}, // 鼠标移到图里面的浮动提示框
                title: {
                    text: "用户分布",
                    x: "center"
                },
                dataRange: {
                    show: false,
                    min: 0,
                    max: 1000,
                    text: ['High', 'Low'],
                    realtime: true,
                    calculable: true,
                    color: ['orangered', 'yellow', 'lightskyblue']
                },
                geo: { // 这个是重点配置区
                    map: 'china', // 表示中国地图
                    roam: false,
                    zoom: 1.2,
                    label: {
                        normal: {
                            show: true, // 是否显示对应地名
                            textStyle: {
                                color: 'rgba(0,0,0,0.4)'
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderColor: 'rgba(0, 0, 0, 0.2)'
                        },
                        emphasis: {
                            areaColor: null,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            shadowBlur: 20,
                            borderWidth: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                },
                series: [
                    {
                        type: 'scatter',
                        coordinateSystem: 'geo' // 对应上方配置
                    },
                    {
                        name: '用户分布', // 浮动框的标题
                        type: 'map',
                        geoIndex: 0,
                        data: [
                            {
                                "name": "北京",
                                "value": 599
                            }, {
                                "name": "上海",
                                "value": 142
                            }, {
                                "name": "黑龙江",
                                "value": 44
                            }, {
                                "name": "深圳",
                                "value": 92
                            }, {
                                "name": "湖北",
                                "value": 810
                            }, {
                                "name": "四川",
                                "value": 453
                            }
                        ]
                    }
                ]
            })
            window.addEventListener('resize', () => {
                this.chart.resize()
            })
        }
    }
}
</script>

<style lang="less" scoped>
</style>