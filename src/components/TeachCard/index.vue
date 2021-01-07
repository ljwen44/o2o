<template>
    <el-card class="box-card">
        <el-avatar :size="40" :src="item.avatar" shape="square"></el-avatar>
        <div class="userInfoWrapper">
            <p>
                {{item.userName}}
                <el-tag type="info" class="flag">
                    <i class="iconfont icon-renzheng" :style="{color: item.auth==='已认证' ? 'green': 'grey'}">
                        {{item.auth}}
                    </i>
                </el-tag>
            </p>
            <p>
                <el-rate
                v-model="item.rate"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}">
                </el-rate>
            </p>
        </div>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    props: {
        item: Object
    },
    created() {
        this.item.rate = parseInt(this.item.rate)
    },
}
</script>

<style lang='less' scoped>
.box-card{
    border-radius: 0;
    border: none;
    border-bottom: 1px solid #ccc;
    /deep/
    .el-card__body{
        padding: 10px;
        text-align: left;
        .el-avatar{
            vertical-align: middle;
        }
        .userInfoWrapper{
            display: inline-block;
            vertical-align: middle;
            margin-left: 10px;
            text-align: left;
            cursor: pointer;
            p{
                font-size: 14px;
                .el-tag{
                    border: none;
                    background: transparent;
                    i{
                        font-size: 12px;
                    }
                }
            }
            p:nth-child(2){
                font-size: 12px;
            }
        }
    }
}
</style>