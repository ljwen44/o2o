<template>
    <el-main class="calendarBox">
        <el-calendar>
            <template
                slot="dateCell"
                slot-scope="{date, data}">
                <p :class="data.isSelected ? 'is-selected' : ''">
                    {{ data.day.split('-').slice(1)[1] }}
                    <span>{{sign.includes(data.day) ? '✔️' : ''}}</span>
                </p>
            </template>
        </el-calendar>
        <div style="text-align: left">
            <el-button size="small" 
                :type="sign.includes(time)?'info':'primary'"
                :disabled="sign.includes(time)" 
                @click="handleSign">{{sign.includes(time)?"已签到":"签到"}}</el-button>
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
            errMsg: "",
            time: '',
        }
    },
    methods: {
        getData(){
            let data = this.$qs.stringify({
                uid: this.user.userUUID
            })
            this.axios.post("/signController/getSign", data)
            .then(res => {
                if(res.data.message){
                    this.errMsg = res.data.message
                } else {
                    this.$store.commit('SETSIGN', res.data.list)
                }
            }).catch(err => {
                this.errMsg = "获取数据异常，请刷新重试!"
            })
        },
        handleSign(){
            let data = this.$qs.stringify({
                uid: this.user.userUUID
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
                            this.user.integral = this.user.integral + 5
                            this.$store.commit("SETUSER", this.user)
                            this.$store.commit('ADDSIGN', this.time)
                        }
                    })
                }
            }).catch(err => {
                this.$alert("签到失败，请刷新重试！", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        getTime(){
            let time = new Date()
            let year = time.getFullYear()
            let month = time.getMonth()+1
            month = month < 10 ? "0" + month : month
            let day = time.getDate()
            day = day < 10 ? "0" + day : day
            let res = year +"-"+ month + "-" + day
            return res
        }
    },
    computed: {
        ...mapState([
            'user',
            'sign'
        ])
    },
    created() {
        this.time = this.getTime()
        let localsign = localStorage.getItem('_o2o_sign')
        if(!localsign && this.user){
            this.getData()
        } else {
            this.$store.commit('SETSIGN', JSON.parse(localsign))
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