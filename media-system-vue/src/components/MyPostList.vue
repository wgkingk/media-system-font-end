<template>
	<div id="content">
		<el-table :data="pageInfo.list" style="width: 100%">
			<el-table-column prop="postTitle" label="Title">
			</el-table-column>
			<el-table-column prop="createdTime" label="完成时间" width="180">
			</el-table-column>
			<el-table-column  label="审核状态" width="150">
				<template slot-scope="scope">
					<el-tag>{{scope.row.postStatus.statusName}}</el-tag>
				</template>
				
			</el-table-column>
			<el-table-column prop="postCategory.categoryName" label="文章类型" width="90">
			</el-table-column>
			<el-table-column prop="postClicks" label="点击量" width="90">
			</el-table-column>
			 <el-table-column
			      fixed="right"
			      label="操作"
			      width="150">
			<template slot-scope="scope">
			    <el-button @click="getPostContent(scope.row)" type="text" size="small">查看</el-button>
			    <el-button @click="editPost(scope.row)" type="text" size="small">编辑</el-button>
			    <el-button @click="deletePost(scope.row)" type="text" size="small">删除</el-button>
			</template>
			</el-table-column>
		</el-table>

		<div class="block" style="text-align: center;">
			<el-pagination layout="prev, pager, next" :current-page="pageInfo.startPage" :page-size="pageInfo.pageSize" :total="pageInfo.totalPage * pageInfo.pageSize"
			@current-change="handleCurrentPageChange">
			</el-pagination>
		</div>
		
		<el-dialog :title="postInfo.postTitle" :visible.sync="dialogshow" :fullscreen=true>
			<div v-html="postInfo.postContent" style="text-align: left; margin: 3.125rem 10%;"></div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'MyPostList',
		data() {
			return {
				value: false,
				dialogshow: false,
				postInfo: {
					postTitle: null
				},
				pageInfo: {
					startPage: 1,
					pageSize: 10,
					totalPage: null,
					list: []
				}
			}
		},
		mounted() {
			this.getList()
		},
		methods: {
			getList: function() {
				this.$axios.post('/posts/getMyPostList', {
					startPage: this.pageInfo.startPage,
					pageSize: this.pageInfo.pageSize
				}).then(res => {
					this.pageInfo = res.data.data
					console.log(res.data)
					this.pageInfo.list.forEach( item => {
						item.postStatus = this.getCurrentStatus(item.postStatus)
					})
				})
			},
			handleCurrentPageChange: function(currentPage) {
				this.pageInfo.startPage = currentPage
				this.$axios.post('/posts/getMyPostList', {
					startPage: this.pageInfo.startPage,
					pageSize: this.pageInfo.pageSize
				}).then(res => {
					this.pageInfo = res.data.data
					console.log(res.data)
				})
			},
			handleRowClick: function(row, column, event) {
				
			},
			getPostContent: function(row) {
				this.dialogshow = true
				this.$axios.get('/posts/' + row.postId)
					.then(res => {
						this.postInfo = res.data.data
					})
			},
			editPost: function(row) {
				this.$router.push({
					name: 'editPost',
					params: {
						postId: row.postId
					}
				})
			},
			deletePost: function(row) {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
						  this.$axios.delete('/posts/'+row.postId).then( res => {
							  this.getList()
							  this.$message({
							    type: 'success',
							    message: '删除成功!'
							  })
						  })
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除'
				          })     
				        });
			},
			getCurrentStatus: function (status) {
				switch(status) {
					case 1:
						return {
							status: status,
							statusName: '通过'
						}
						break
					case 2:
						return {
							status: status,
							statusName: '未通过'
						}
						break
				}
			} 
		}
	}
</script>

<style scoped>
	#content {
		margin: auto 10%;
	}
</style>

