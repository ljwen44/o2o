<template>
    <div class="city-select">
        <select v-model="selectedProvince" name="province">
            <template v-for="(item, index) in provinces">
                <option
                    :value="item"
                    :key="index"
                    v-if="item.level === 1">
                    {{ item.value }}
                </option>
            </template>
        </select>
        <select v-model="selectedCity" name="city">
            <option
                v-for="(item, index) in cities"
                :value="item"
                :key="index">
                {{ item.value }}
            </option>
        </select>
        <select v-model="selectedBlock" name="block">
            <option
                v-for="(item, index) in blocks"
                :value="item"
                :key="index">
                {{ item.value }}
            </option>
        </select>
    </div>
</template>
<script>
import Vue from 'vue'
import provinces from '@/lib/provinces.js'
export default {
    data() {
        return {
            selectedProvince: provinces[0],
            selectedBlock: 0,
            selectedCity: 0,
            provinces,
            blocks: 0,
            cities: 0
        }
    },
    created() {
        // 数据初始化,默认选中北京市,默认选中第一个;北京市数据为总数据的前18个
        let beijing = this.provinces.slice(0, 19)
        this.cities = beijing.filter(item => {
            if (item.level === 2) {
                return true
            }
        })
        this.selectedCity = this.cities[0]
        this.blocks = beijing.filter(item => {
            if (item.level === 3) {
                return true
            }
        })
        this.selectedBlock = this.blocks[0]
    },
    watch: {
        selectedProvince(newVal, oldVal) {
            // 港澳台数据只有一级,特殊处理
            if (newVal.sheng === '71' || newVal.sheng === '81' || newVal.sheng === '82') {
                this.cities = [newVal]
                this.blocks = [newVal]
            } else {
                this.cities = this.provinces.filter(item => {
                    if (item.level === 2 && item.sheng && newVal.sheng === item.sheng) {
                        return true
                    }
                })
            }
            // 此时在渲染DOM,渲染结束之后再选中第一个
            Vue.nextTick(() => {
                this.selectedCity = this.cities[0]
                this.$emit('change', this.info)
            })
        },
        selectedBlock() {
            Vue.nextTick(() => {
                this.$emit('change', this.info)
            })
        },
        selectedCity(newVal) {
            // 选择了一个市,要选择区了 di是城市的代表,sheng
            if (newVal.sheng === '71' || newVal.sheng === '81' || newVal.sheng === '82') {
                this.blocks = [newVal]
                this.cities = [newVal]
            } else {
                this.blocks = this.provinces.filter(item => {
                    if (item.level === 3 && item.sheng && item.sheng == newVal.sheng && item.di === newVal.di && item.value !== '市辖区') {
                        return true
                    }
                })
            }
            Vue.nextTick(() => {
                this.selectedBlock = this.blocks[0]
                // 触发与 v-model相关的 input事件
                this.$emit('change', this.info)
            })
        }
    },
    computed: {
        info() {
            return {
                province: this.selectedProvince.value,
                block: this.selectedBlock.value,
                city: this.selectedCity.value
            }
        }
    },
}
</script>
<style lang="less" scoped>
.city-select{
    text-align: left;
    display: inline-block;
    select{
        margin-right: 10px;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 4px;
        border: 1px solid #DCDFE6;
    }
    select:focus{
        outline: none;
        border-color: #409EFF;
    }
}
</style>