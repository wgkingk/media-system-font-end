<template>
	<div id="head">
	<el-button type="success" @click="formVisible = true">上传视频</el-button>
	<el-row>
	  <el-col :span="8" v-for="(o, index) in picList" :key="o.mediaId" >
		  <el-popover
		    placement="top-start"
		    width="200"
		    trigger="hover"
		    v-bind:content="o.mediaComment">
		    <el-card class="card" slot="reference" :body-style="{ padding: '0px' }" style="text-align: center;">
		      <video controls="controls" class="video">
		      <source :src="o.mediaUrl" type="video/mp4" />
			  </video>
		      <div style="padding: 14px;">
		        <h3>{{o.mediaTitle}}</h3>
		    	<div style="text-align: right;">
		    		<span>作者：{{o.userEmail}}</span>
		    	</div>
		      </div>
		    </el-card>
		  </el-popover>
		
	    
	  </el-col>
	</el-row>
	<el-pagination
	  small
	  layout="prev, pager, next"
	  :page-size="page.pageSize"
	  :current-page="page.startPage"
	  :total="page.pageSize*page.totalPage"
	  @current-change="handleCurrentChange"
	  :hide-on-single-page=true>
	</el-pagination>
	
	<el-dialog
	  title="上传"
	  :visible.sync="formVisible">
	  <el-form v-model="formData" ref="formData"  class="demo-ruleForm">
		  <el-form-item label="视频标题">
			  <el-input type="text" v-model="formData.mediaTitle"></el-input>
		  </el-form-item>
		  <el-form-item label="视频文件">
			  <input type="file" accept=".mp4" @change="handleFileChange" ref="file"></input>
		  </el-form-item>
		  <el-form-item label="视频备注">
			  <el-input v-model="formData.mediaComment"></el-input>
		  </el-form-item>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
		<el-button type="infor" @click="formVisible = false">取消</el-button>
	    <el-button type="primary" @click="handleSubmit('formData')">确 定</el-button>
	  </span>
	</el-dialog>
	</div>
	
</template>

<script>
import {getVideoUrl} from '../util/fileUtil.js'
export default {
	name: 'Pictrue',
	data() {
		return {
		formVisible: false,
		currentImg: null,
		page: {
			startPage: 1,
			pageSize: 12,
			totalPage: 1
		},
		picList: [],
		formData: {
			mediaTitle: '',
			mediaComment: '',
			file: null
		},
		rules: {
			mediaTitle:[{ required: true, message: '请输入标题', trigger: 'blur' }],
			file: [{ required: true, message: '请选择文件', trigger: 'change' }],
			mediaComment: [{ required: true, message: '请输入视频备注', trigger: 'blur' }]
		}
		}
	},
	mounted() {
		this.getImages()
	},
	methods: {
		getImages: function () {
			this.$axios.post('/file/getVideo',this.page).then( res => {
				this.picList = res.data.data.list
				this.picList.forEach(pic => {
					pic.mediaUrl = getVideoUrl(pic.mediaUrl)
				})
				this.page.startPage = res.data.data.startPage
				this.page.pageSize = res.data.data.pageSize
				this.page.totalPage = res.data.data.totalPage
			})
		},
		handleCurrentChange: function(current) {
			this.page.startPage = current
			this.getImages()
			document.querySelector('#head').scrollIntoView(true)
		},
		handleSubmit: function(refName) {
			if(!this.formData.file) {
				this.$message.error('请填写全部内容')
			} else {
				let data = new FormData()
				data.append('file',this.formData.file)
				data.append('mediaTitle',this.formData.mediaTitle)
				data.append('mediaComment',this.formData.mediaComment)
				let loading = this.$loading('正在上传')
				this.$axios.post('/file/uploadVideo',data,{
					'Content-Type':'multipart/form-data'
				}).then( res => {
					if (res.data.code === 1000) {
						this.formVisible = false
						this.$message.success('上传成功')
						this.getImages()
						this.formData.file = null
						this.formData.mediaComment = ''
						this.formData.mediaTitle = ''
						loading.close()
					}
				})
			}
			
		},
		handleFileChange: function(event) {
			this.formData.file = event.target.files[0]
		}
	}
}
</script>

<style>
 .video {
	height: 18.75rem;
	margin: auto auto;
    display: block;
  }
  .time {
      font-size: 13px;
      color: #999;
    }
    
   .bottom {
      margin-top: 13px;
      line-height: 12px;
	  text-align: right;
    }
	.card {
	  margin: 1.25rem 1.875rem;
	}
	#head {
		margin: auto 5%;
	}
</style>
