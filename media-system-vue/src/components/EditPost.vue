<template>
  <div class='tinymce'>
	<div>
		<el-form ref="articleInfo" :model="form" label-width="80px" :rules="rules" class="demo-ruleForm" >
			<el-row>
			  <el-col :span="16"><div class="grid-content bg-purple">
			  <el-form-item label="文章标题" prop="postTitle">
			  	<el-input type="text" placeholder="请输入文章标题" v-model="form.postTitle"></el-input>
			  </el-form-item>
			  </div></el-col>
			  <el-col :span="8"><div class="grid-content bg-purple-light">
			  <el-form-item label="文章类型" style="text-align: left; z-index: 100;" prop="postCategory">
			  	<el-select v-model="form.postCategory" placeholder="请选择文章类型">
			  	      <el-option v-for="item in categoryList" :key="item.categoryId" :label="item.categoryName" :value="item.categoryId"></el-option>
			  	</el-select>
			  </el-form-item>
			  </div></el-col>
			</el-row>
		</el-form>
	</div>
    <editor id='tinymce' v-model='tinymceHtml' :init='init'></editor>
	<el-button type="primary" @click="diologshow = true">预览</el-button>
	<el-button type="primary" @click="createPost('articleInfo')">确定修改</el-button>
	
	
	<el-dialog :visible.sync="diologshow" :fullscreen=true>
		<div style="margin: 3.125rem 10%;">
			<h1>{{form.postTitle}}</h1>
			<div v-html='tinymceHtml' style="text-align: left;"></div>
		</div>
	</el-dialog>
	
	
    
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver/theme' 
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/media'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/fullscreen'

import {getImgUrl,getVideoUrl} from '../util/fileUtil.js'
import axios from '../api/http.js'
import {Message,Loading} from 'element-ui'
export default {
  name: 'editPost',
  data () {
    return {
	  diologshow: false,
	  form: {
		postId: null,
		postTitle: null,
		postStatus: 1,
		postCategory: null
	  },
	  categoryList: [],
	  rules: {
		postTitle: [
			{ required: true, message: '请输入文章标题', trigger: 'blur' }
		],
		postCategory: [
			{ required: true, message: '请选择栏目', trigger: 'change'}
		]
	  },
      tinymceHtml: null,
      init: {
		language_url: '/static/tinymce/langs/zh_CN.js',
		language: 'zh_CN',
		skin_url: '/static/tinymce/skins/ui/oxide',
        height: 600,
        plugins: 'link lists image code table wordcount media fullscreen',
        toolbar:
          'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image media code | removeformat fullscreen',
        branding: false,
		images_upload_handler: function (blobInfo, succFun, failFun) {
			let file = blobInfo.blob()
			let formData = new FormData()
			formData.append('file',file)
			axios.post('/file/uploadImg',formData,{
				'Content-Type':'multipart/form-data'
			}).then( res=> {
				if (res.data.data) {
					succFun(getImgUrl(res.data.data))
				} else {
					failFun('上传失败')
				}
			})
		},
		file_picker_types: 'media',
		file_picker_callback: function(callback,value,meta){
			if (meta.filetype === 'media') {
				let input = document.createElement('input')
				let filetype='.mp4'
				input.setAttribute('type','file')
				input.setAttribute('accept',filetype)
				input.onchange = function() {
					let file = this.files[0]
					if (file.type == 'video/mp4') {
						let formData = new FormData()
						formData.append('file',file)
						let loading = Loading.service('上传中');
						axios.post('/file/uploadVideo',formData,{
							'Content-Type':'multipart/form-data'
						}).then(res => {
							if (res.data.data) {
								callback(getVideoUrl(res.data.data))
							}
						}).catch(err => {
							Message.error('出错了')
						})
						loading.close()
					} else {
						Message.error('请选择mp4文件')
					}
				}
				input.click()
			}
		}
      }
    }
  },
  mounted () {
    tinymce.init({})
	this.$axios.get('/admin/category').then(res => {
		this.categoryList = res.data.data
	})
	
	if(this.$route.params.postId) {
		this.form.postId = this.$route.params.postId
		this.$axios.get('/posts/'+this.form.postId).then( res => {
			this.tinymceHtml = res.data.data.postContent
			this.form.postTitle = res.data.data.postTitle
			this.form.postCategory = res.data.data.postCategory.categoryId
		})
	}
  },
  methods: {
	createPost: function(refName) {
		this.$refs[refName].validate(valid => {
			if (valid) {
				this.$axios.put('/posts',{
					postId: this.form.postId,
					postTitle: this.form.postTitle,
					postStatus: this.form.postStatus,
					postCategory: this.form.postCategory,
					postContent: this.tinymceHtml
				}).then( res => {
					if (res.data.code === 1000) {
						this.$message.success('修改成功')
					}
				})
			} else {
				this.$message.error('请填写提示内容')
			}
		})
	}
  },
  components: {Editor}
}
</script>

<style>
	.tinymce {
		margin: 1.25rem 10%;
	}
</style>