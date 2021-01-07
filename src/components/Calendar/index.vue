<template>
    <el-main class="calendarBox">
        <el-calendar>
            <template
                slot="dateCell"
                slot-scope="{date, data}">
                <p :class="data.isSelected ? 'is-selected' : ''">
                    {{ data.day.split('-').slice(1)[1] }}
                    <span>{{arr.includes(data.day) ? '✔️' : ''}}</span>
                </p>
            </template>
        </el-calendar>
        <div style="text-align: left">
            <el-button size="small" 
                :type="flag?'info':'primary'"
                :disabled="flag" 
                @click="sign">{{flag?"已签到":"签到"}}</el-button>
            <span style="font-size: 14px;">已签到{{day}}天</span>
            <p v-if="!errMsg">{{errMsg}}</p>
        </div>
    </el-main>
</template>

<script>
import {mapState} from 'vuex'
export default {
    data() {
        return {
            flag: false,
            day: 0,
            arr: [],
            errMsg: "",
            
        }
    },
    methods: {
        getData(){
            let data = this.$qs.stringify({
                uid: this.user.userUUID
            })
            this.axios.post("/signController/getSign", data)
            .then(res => {
                this.getTime(res.data.list[0])
                if(res.data.message){
                    this.arr = res.data.message
                } else {
                    for(let i = 0; i < res.data.list.length; i++){
                        res.data.list[i] = this.getTime(res.data.list[i])
                    }
                    this.arr = res.data.list
                }
            }).catch(err => {
                this.errMsg = "获取数据异常，请刷新重试!"
            })
        },
        sign(){
            let data = this.$qs.stringify({
                uid: this.userUUID
            })
            this.axios.post("/signController/addSign", data)
            .then(res => {
                if(res.data.message){
                    this.$alert(res.data.message)
                } else {
                    this.$alert("签到成功！", "提示", {
                        confirmButtonText: "确定",
                        callback: () => {
                            this.flag = true
                            let time = this.getTime()
                            this.arr.push(time)
                            this.user.integral = this.user.integral + 5
                            this.$store.commit("SETUSER", this.user)
                        }
                    })
                }
            }).catch(err => {
                this.$alert("签到失败，请刷新重试！", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        getTime(obj){
            let time = new Date(obj)
            let year = time.getFullYear()
            let month = time.getMonth()+1
            month = month > 10 ? month : "0" + month
            let day = time.getDate()
            day = day > 10 ? day : "0" + day
            let res = year +"-"+ month + "-" + day
            return res
        }
    },
    computed: {
        ...mapState([
            'user'
        ])
    },
    created() {
        this.getData()
    },
    watch: {
        arr(newVal, oldVal){
            this.day = newVal.length
            return newVal
        }
    },
}
</script>

<style lang='less'>
.is-selected {
    color: #1989FA;
}
.calendarBox{
    background: rgba(255,255,255,.5);
    padding: 0;
    .el-calendar{
        background: transparent;
        .el-calendar__header{
            padding: 0;
            background: #05c3e7;
            .el-calendar__title{
                text-align: center;
                padding: 10px 0;
                color: #fff;
            }
            .el-calendar__button-group{
                .el-button-group{
                    button:nth-child(odd){
                        display: none;
                    }
                    button:nth-child(2){
                        margin-right: 20px;
                    }
                }
            }
        }
        .el-calendar__body{
            padding: 0;
            table{
                thead{
                    th{
                        padding: 0;
                        font-size: 12px;
                    }
                }
                tbody{
                    .el-calendar-day{
                        height: 40px;
                        p {
                            font-size: 12px;
                            span{
                                display: block;
                            }
                        }
                    }
                }
            }
        }
    }
    .el-button{
        margin: 10px;
    }
}

</style>