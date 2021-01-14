<template>
    <el-card class="box-card">
        <div class="userWrapper">
            <el-avatar :size="50" :src="item.avatar"></el-avatar>
            <router-link :to="'/udetail?uid='+item.userUUID" class="userName" tag="span">{{item.name}}</router-link>
        </div>
        <div class="detailWrapper">
            <p>
                <span>
                    <i class="el-icon-user"></i>
                    联系人：{{item.userName}}
                </span>
                <span>
                    <i class="el-icon-phone"></i>
                    电话：{{item.userPhone}}
                </span>
                <span>
                    <i class="iconfont icon-xueshimao"></i>
                    学历：{{item.precord}}
                </span>
            </p>
            <p>
                <span>
                    <i class="el-icon-coin"></i>
                    薪资：{{item.salary}}元/天
                </span>
                <span>
                    <i class="el-icon-time"></i>
                    持续天数：{{item.day}}天
                </span>
            </p>
            <p>
                <span>
                    <i class="el-icon-location-information"></i>
                    地点：{{item.province + item.city + item.block + item.address}}
                </span>
            </p>
            <router-link :to="'/detail?pid='+item.pid" tag="p">
                内容描述：{{item.content}}
            </router-link>
            <p>
                <span>
                    <i class="el-icon-time"></i> 
                    发布时间: {{item.ptime}}
                </span>
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
}
</script>

<style lang='less' scoped>
.box-card{
    box-shadow: 0 0 4px #ccc;
    text-align: left;
    margin-bottom: 20px;
    margin: 20px;
    background: rgba(255,255,255,1);
    .userWrapper{
        .el-avatar{
            vertical-align: middle;
        }
        .userName{
            margin-left: 20px;
            cursor: pointer;
        }
    }
    .detailWrapper{
        color: #000;
        p{
            margin: 10px 0;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            span{
                font-size: 14px;
                margin-right: 20px;
                color: #968d8d;
            }
        }
    }
}
.box-card:hover{
    box-shadow: 0 0 4px #05c3e7;
}
</style>