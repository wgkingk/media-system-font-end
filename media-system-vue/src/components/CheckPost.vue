<template>
	<div id="content">
		<el-table :data="pageInfo.list.filter(data => !search || data.userName.toLowerCase().includes(search.toLowerCase()))"
		 style="width: 100%">
			<el-table-column prop="postTitle" label="Title">
			</el-table-column>
			<el-table-column prop="createdTime" label="完成时间" width="180">
			</el-table-column>
			<el-table-column prop="userName" label="作者" width="50">
			</el-table-column>
			<el-table-column prop="postCategory.categoryName" label="文章类型" width="90">
			</el-table-column>
			<el-table-column label="查看">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="handleRowClick(scope.row)">查看</el-button>
				</template>
			</el-table-column>
			<el-table-column label="当前状态">
				<template slot-scope="scope">
					<el-tag>{{scope.row.postStatus.statusName}}</el-tag>
					<el-button @click="checkPass(scope.row.postId)" v-if="scope.row.postStatus.status === 2" size="small" type="success">通过</el-button>
					<el-button @click="toNoPass(scope.row.postId)" v-else size="small" type="danger">下架</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="block" style="text-align: center;">
			<el-pagination layout="prev, pager, next" :current-page="pageInfo.startPage" :page-size="pageInfo.pageSize" :total="pageInfo.totalPage * pageInfo.pageSize"
			@current-change="handleCurrentPageChange">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'PostList',
		data() {
			return {
				value: 'false',
				currentType: '0',
				pageInfo: {
					startPage: 1,
					pageSize: 10,
					totalPage: null,
					list: []
				},
				search: ''
			}
		},
		mounted() {
			if (this.$route.params.categoryId) {
				this.currentType = this.$route.params.categoryId
			}
			this.getAllPosts()
		},
		methods: {
			getAllPosts: function() {
				this.$axios.post('/posts/getAllPosts', {
					startPage: this.pageInfo.startPage,
					pageSize: this.pageInfo.pageSize
				}).then(res => {
					this.pageInfo = res.data.data
					this.pageInfo.list.forEach( post => {
						post.postStatus = this.getCurrentStatus(post.postStatus)
					})
				})
			},
			handleCurrentPageChange: function(currentPage) {
				this.pageInfo.startPage = currentPage
				this.$axios.post('/posts/getAllPosts', {
					startPage: this.pageInfo.startPage,
					pageSize: this.pageInfo.pageSize
				}).then(res => {
					this.pageInfo = res.data.data
					this.pageInfo.list.forEach( post => {
						post.postStatus = this.getCurrentStatus(post.postStatus)
					})
					console.log(res.data)
				})
			},
			handleRowClick: function(row) {
				this.$router.push({
					name: 'Article',
					params: {
						postId: row.postId
					}
				})

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
			} ,
			checkPass: function(postId) {
				this.$axios.put('/posts',{
					postId: postId,
					postStatus: 1
				}).then( res => {
					if (res.data.code === 1000) {
						this.$message.success('审核成功')
						this.getAllPosts()
					}
				})
			},
			toNoPass: function(postId) {
				this.$axios.put('/posts',{
					postId: postId,
					postStatus: 2
				}).then( res => {
					if (res.data.code === 1000) {
						this.$message.success('下架成功')
						this.getAllPosts()
					}
				})
			}
		}
	}
</script>

<style scoped>
	#content {
		margin: auto 10%;
	}
</style>
