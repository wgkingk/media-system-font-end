<template>
    <div>
		<div>
			<el-form ref="articleInfo" label-width="80px">
				<el-row>
				  <el-col :span="12"><div class="grid-content bg-purple">
				  <el-form-item label="文章标题" >
				  	<el-input type="text" placeholder="请输入文章标题" v-model="postTitle"></el-input>
				  </el-form-item>
				  </div></el-col>
				  <el-col :span="12"><div class="grid-content bg-purple-light">
				  <el-form-item label="文章类型" style="text-align: left; z-index: 100;">
				  	<el-select v-model="postCategory" placeholder="请选择文章类型">
				  	      <el-option v-for="item in categoryList" :key="item.categoryId" :label="item.categoryName" :value="item.categoryId"></el-option>
				  	</el-select>
				  </el-form-item>
				  </div></el-col>
				</el-row>
				<el-form-item label="文章类型"></el-form-item>
			</el-form>
		</div>
        <div id="div1" class="toolbar" ref="toolbar">
            </div>
        <div id="div2" class="text" ref="text"> <!--可使用 min-height 实现编辑区域自动增加高度-->
        </div>
        <button v-on:click="createArticle">查看内容</button>
    </div>
</template>

<script>
    import E from 'wangeditor'
	import {getImgUrl} from '../util/fileUtil.js'
    export default {
      name: 'editor',
	  props: {
		  postId: {
			  type: Number,
			  default: -1
		  }
	  },
      data () {
        return {
          editorContent: '',
		  postTitle: null,
		  postStatus: 1,
		  postCategory: null,
		  categoryList: []
        }
      },
      methods: {
        createArticle: function () {
            alert(this.editorContent)
			this.$axios.post('/posts/create',{
				postTitle: this.postTitle,
				postStatus: this.postStatus,
				postCategory: this.postCategory,
				postContent: this.editorContent
			}).then(res => {
				if (res.data.data === 1) {
					this.$message.success('发表成功')
				} else {
					this.$message.error('发生错误')
				}
			})
        }
      },
      mounted() {
        var editor = new E(this.$refs.toolbar,this.$refs.text)
		var _this = this
        editor.customConfig.onchange = (html) => {
          this.editorContent = html
        }
		editor.customConfig.uploadImgServer = '/upload'
		editor.customConfig.customUploadImg = function (files, insert) {
			let headers = {headers: {"Content-Type": "multipart/form-data"}}
			console.log(files)
			files.forEach(file => {
				let data = new FormData()
				data.append('file',file)
				_this.$axios.post('/file/uploadImg',data,headers).then(res => {
					insert(getImgUrl(res.data.data))
					})
				
			})
		}
		editor.customConfig.menus = [
		          'head', // 标题
		          'bold', // 粗体
		          'fontSize', // 字号
		          'fontName', // 字体
		          'italic', // 斜体
		          'underline', // 下划线
		          'strikeThrough', // 删除线
		          'foreColor', // 文字颜色
		          'backColor', // 背景颜色
		          'link', // 插入链接
		          'list', // 列表
		          'justify', // 对齐方式
		          'quote', // 引用
		          'image', // 插入图片
		          'table', // 表格
		          'video', // 插入视频
		          'code', // 插入代码
		          'undo', // 撤销
		          'redo', // 重复
		          'fullscreen' // 全屏
		        ]
		
        editor.create()
		
		this.$axios.get('/admin/category').then(res => {
			this.categoryList = res.data.data
		})
      }
    }
</script>

<style scoped>
	.text {
		height: 31.25rem;
	}
</style>