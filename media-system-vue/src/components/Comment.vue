<template>
	<div style="margin-bottom: 1.25rem;">
	<el-card class="box-card" style="margin-top: 1.25rem; margin-bottom: 1.25rem;" >
	  <div slot="header" class="clearfix">
	    <span>评论</span>
	  </div>
	  <div>
		<el-form :model="form" :rules="rules" ref="form">
			<el-form-item prop="commentContent">
				<el-input type="textarea" placeholder="请输入评论" v-model="form.commentContent"></el-input>
				<el-button @click="commitForm('form')" type="primary" style="float: right; margin-right: 1.25rem; margin-top: 1.25rem;">发送</el-button>
			</el-form-item>
		</el-form>
	  </div>
	</el-card>
	<el-card id="comments" style="margin-bottom: 0.625rem;" v-for="item in commentInfo.list" :key="item.commentId">
		<div>
			<el-row>
			  <el-col :span="4"><div class="grid-content bg-purple block" style="text-align: left;">
				 <div class="block" key="fit" style="text-align: center;">
				        <el-avatar shape="circle" :size="100" fit=" fill" :src="item.userInfo.personalImage"></el-avatar>
						<div class="title">{{item.userInfo.name}}</div>
				 </div>
			  </div></el-col>
			  <el-col :span="20">
				  <div class="grid-content bg-purple-light">
					<div style="height: 3rem;">{{item.commentContent}}</div>
					<el-divider></el-divider>
					<div style="text-align: right; font-size: 0.75rem;" >发表时间：{{item.commentTime}}</div>
				  </div>
			  </el-col>
			</el-row>
		</div>
	</el-card>
	<el-pagination
	  small
	  layout="prev, pager, next"
	  :hide-on-single-page=true
	  :page-size="commentInfo.pageSize"
	  :current-page="commentInfo.startPage"
	  :total="commentInfo.pageSize * commentInfo.totalPage"
	  @current-change="handleCurrentChange">
	</el-pagination>
	</div>
</template>

<script>
import {getImgUrl} from '../util/fileUtil.js'
export default {
	name: 'Comment',
	props: {
		articleId: {
			type: String,
			default: '1'
		}
	},
	data() {
		return {
			postId: null,
			commentInfo:{
				startPage: 1,
				pageSize: 5,
				totalPage: null,
				list: []
			},
			form: {
				commentContent: null
			},
			rules: {
				commentContent: [
				            { required: true, message: '尚未输入评论内容', trigger: 'blur' },
				          ],
			}
		}
	},
	methods:{
		getComments: function() {
			this.$axios.post('/comment/getList',{
				startPage: this.commentInfo.startPage,
				pageSize: this.commentInfo.pageSize,
				data: {
					postId: this.postId
				}
			}).then(res => {
				this.commentInfo = res.data.data
				this.commentInfo.list.forEach(item => {
					item.userInfo.personalImage = getImgUrl(item.userInfo.personalImage)
				})
				console.log(this.commentInfo)
			})
		},
		handleCurrentChange: function(currentPage) {
			this.commentInfo.startPage = currentPage
			document.querySelector('#comments').scrollIntoView(true)
			this.getComments()
		},
		commitForm: function(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.$axios.post('/comment',{
						postId: this.postId,
						commentContent: this.form.commentContent
					}).then(res => {
						this.getComments()
					})
					this.$refs[formName].resetFields()
					this.$message({
						message: '评论成功',
						type: 'success'
					})
				} else {
					this.$message({
						message: '请输入您的评论',
						type: 'error'
					})
				}
			})
		}
	},
	mounted() {
		this.postId = this.articleId
		this.getComments()
	}
}
</script>
<style>
</style>
