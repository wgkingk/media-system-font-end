<template>
	<div id="article">
		<el-card class="box-card">
		  <div slot="header" class="clearfix">
		    <span style="font-size: 18pt;">{{post.postTitle}}</span>
		    <div style="float: right; padding: 3px 0;" type="text">{{post.userName}}</div>
		  </div>
		  <div style="text-align: left;" v-html="post.postContent"></div>
		  <el-divider></el-divider>
		  <div style="text-align: right;"><span>创建时间: {{post.createdTime}}</span></div>
		</el-card>
		<comment :articleId="post.postId.toString()"></comment>
	</div>
	
</template>

<script>
import comment from '@/components/Comment'
export default {
	name: 'Article',
	components:{
		comment
	},
	data() {
		return {
			post: {
				postId: null,
				userEmail: null,
				userName: null,
				postContent: null,
				postTitle: null,
				createdTime: null,
				postStatus: null,
				postCategory: {
				    categoryId: null,
				    categoryName: null,
				    categoryComment: null
				},
				postClicks: null
			},
			comments: []
		}
	},
	methods: {
		getPost: function(postId) {
			this.$axios.get('/posts/' + postId)
				.then(res => {
					this.post = res.data.data
					console.log(this.post)
				})
		}
	},
	mounted() {
		let loadingInstance = this.$loading()
		this.getPost(this.$route.params.postId)
		loadingInstance.close()
	},
	watch: {
		'$route': 'getParams'
	}
}
</script>

<style>
	#article {
		margin: 3.125rem 10%;
	}
</style>
