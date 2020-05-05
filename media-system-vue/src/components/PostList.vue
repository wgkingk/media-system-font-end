<template>
	<div id="content">
		<el-table :data="pageInfo.list" @row-click="handleRowClick" style="width: 100%">
			<el-table-column prop="postTitle" label="Title">
			</el-table-column>
			<el-table-column prop="createdTime" label="完成时间" width="180">
			</el-table-column>
			<el-table-column prop="userName" label="作者" width="50">
			</el-table-column>
			<el-table-column prop="postCategory.categoryName" label="文章类型" width="90">
			</el-table-column>
			<el-table-column prop="postClicks" label="点击量" width="90">
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
				}
			}
		},
		mounted() {
			if (this.$route.params.categoryId) {
				this.currentType = this.$route.params.categoryId
			}
			this.$axios.post('/posts/getByCategory/' + this.currentType, {
				startPage: this.pageInfo.startPage,
				pageSize: this.pageInfo.pageSize
			}).then(res => {
				this.pageInfo = res.data.data
				console.log(res.data)
			})
		},
		methods: {
			handleCurrentPageChange: function(currentPage) {
				this.pageInfo.startPage = currentPage
				this.$axios.post('/posts/getByCategory/' + this.$route.params.categoryId, {
					startPage: this.pageInfo.startPage,
					pageSize: this.pageInfo.pageSize
				}).then(res => {
					this.pageInfo = res.data.data
					console.log(res.data)
				})
			},
			handleRowClick: function(row, column, event) {
				this.$router.push({
					name: 'Article',
					params: {
						postId: row.postId
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
