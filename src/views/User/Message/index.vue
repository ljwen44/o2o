<template>
    <el-main>
        <!-- 左边为聊天列表 -->
        <!-- 右边为聊天框 -->
        <el-row>
            <el-col :sm="6" :md="6" :lg="6" class="userList">
                <el-input
                    placeholder="请输入内容"
                    prefix-icon="el-icon-search"
                    v-model="searchVal">
                </el-input>
                <ul>
                    <li v-for="(item, index) in chatList.filter(data => !searchVal || data.userName.toLowerCase().includes(searchVal.toLowerCase()))" 
                        :key="index" 
                        @click="handleClick(index, item)"
                        @contextmenu.prevent="show(index)"
                        :class="index === bgIndex ? 'active' : ''">
                        <el-badge :value="item.readNum === 0 ? '': item.readNum">
                            <el-avatar shape="square" :size="40" :src="item.avatar"></el-avatar>
                        </el-badge>
                        <p class="userName">{{item.userName}}<span>{{item.time | timeFilter('chat')}}</span></p>
                        <p class="content"
                            v-html="item.desc.includes('data:image/')?'[图片]':item.desc"></p>
                        <span 
                            class="tip" 
                            :style="{left: pos.left + 'px',top: pos.top + 'px'}"
                            @mouseleave="showDel = false"
                            v-if="showDel"
                            @click="del()">删除</span>
                    </li>
                </ul>
            </el-col>
            <el-col :sm="18" :md="18" :lg="18">
                <Chat :recuser="recuser"></Chat>
            </el-col>
        </el-row>
    </el-main>
</template>

<script>
import Chat from '_c/Chat/index.vue'
import {ulist} from '@/lib/data.js'
export default {
    data() {
        return {
            bgIndex: 0,
            searchVal: '',
            pos: {
                left: 0,
                top: 0
            },
            showDel: false,
            delIndex: 0,
            recuser: {},
            chatList: ulist
        }
    },
    methods: {
        del(){
            this.$message("删除")
        },
        handleClick(index, item){
            this.bgIndex = index
            this.recuser = item
        },
        show(index, event){
            this.delIndex = index
            this.showDel = true
            var e = event || window.event;
            this.pos.left = e.clientX
            this.pos.top = e.clientY
        },
    },
    created() {
        this.recuser = this.chatList[0]
    },
    components: {
        Chat
    }
}
</script>

<style lang='less' scoped>
.el-main{
    padding: 0;
    overflow: hidden;
    min-height: 400px;
    .el-row{
        .userList{
            background: rgba(255,255,255,.5);
            padding: 10px;
            ul{
                height: 498px;
                margin-top:10px;
                overflow: auto;
                border: 1px solid #ccc;
                position: relative;
                li{
                    padding: 10px;
                    border-bottom: 1px solid #ccc;
                    height: 40px;
                    cursor: pointer;
                    .el-badge{
                        float: left;
                    }
                    p{
                        text-align: left;
                        line-height: 22px;
                        margin-left: 60px;
                    }
                    .userName{
                        font-size: 12px;
                        span{
                            float: right;
                            color: #827676;
                        }
                    }
                    .content{
                        color: #827676;
                        font-size: 12px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .tip{
                        background: #ccc;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        padding: 5px 10px;
                        font-size: 12px;
                        cursor: default;
                        position: fixed;
                        z-index: 111;
                    }
                    .tip:hover{
                        background: #fff;
                    }
                }
                li:hover{
                    background: rgba(138, 179, 225, 0.2);
                }
                .active{
                    background: rgba(138, 179, 225, 0.6);
                }
                
            }
            
        }
        .chatWrapper{
            background: #e9f1f9;
            height: 570px;
        }
    }
    .zero{
        h3{
            margin: 20px;
            text-align: left;
        }
    }
}
ul::-webkit-scrollbar{ 
    width:1px;
}
ul::-webkit-scrollbar-track{
    background: #ccc;
    border-radius:2px;
    -webkit-border-radius:2px;
    -moz-border-radius:2px;
    -ms-border-radius:2px;
    -o-border-radius:2px;
}
ul::-webkit-scrollbar-thumb{
    background: #80a8d9;
    border-radius:10px;
    -webkit-border-radius:10px;
    -moz-border-radius:10px;
    -ms-border-radius:10px;
    -o-border-radius:10px;
}
ul::-webkit-scrollbar-thumb:hover{
    background: #333;
}
ul::-webkit-scrollbar-corner{
    background: #179a16;
}
</style>