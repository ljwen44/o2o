<template>
    <quill-editor
        class="editor"
        ref="myTextEditor"
        v-model="content"
        :options="editorOption"
        @change="onEditorChange($event)"
    ></quill-editor>
</template>

<script>
import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor);
const toolbar = [
    ["image"]
]
export default {
    data() {
        return {
            content: null, //内容
            editorOption: {
                modules: {
                    toolbar
                },
                placeholder: "", //提示
                readyOnly: false, //是否只读
                theme: "snow", //主题 snow/bubble
                syntax: true //语法检测
            }
        }
    },
    methods: {
        // 值发生变化
        onEditorChange(editor) {
            this.$emit("content", this.content)
        },
        // 清空内容
        clearContent(){
            this.content = ''
        }
    },
}
</script>

<style lang="less">
.editor {
    line-height: normal !important;
    height: 180px;
    .ql-toolbar{
        padding: 0;
        .ql-formats{
            float: left;
        }
    }
    .ql-container{
        height: 150px;
        .ql-editor{
            padding: 5px 10px;
            p{
                img{
                    width: 100px;
                }
            }
        }
    }
}
.ql-editor::-webkit-scrollbar{ 
    width:0px;
}
.ql-editor::-webkit-scrollbar-track{
    background: #ccc;
    border-radius:2px;
    -webkit-border-radius:2px;
    -moz-border-radius:2px;
    -ms-border-radius:2px;
    -o-border-radius:2px;
}
.ql-editor::-webkit-scrollbar-thumb{
    background: #80a8d9;
    border-radius:10px;
    -webkit-border-radius:10px;
    -moz-border-radius:10px;
    -ms-border-radius:10px;
    -o-border-radius:10px;
}
.ql-editor::-webkit-scrollbar-thumb:hover{
    background: #333;
}
.ql-editor::-webkit-scrollbar-corner{
    background: #179a16;
}
</style>