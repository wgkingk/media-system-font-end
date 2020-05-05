<template>
	<view>
		<u-table>
			<u-tr>
				<u-th>标题</u-th>
				<u-th>状态</u-th>
				<u-th>查看</u-th>
				<u-th>编辑</u-th>
				<u-th>删除</u-th>
			</u-tr>
			<u-tr v-for="item in postList" :key="item.postId">
				<u-td>{{item.postTitle}}</u-td>
				<u-td>{{item.postStatus.statusName}}</u-td>
				<u-td><u-button type="primary" @click="handleDetial(item.postId)">查看</u-button></u-td>
				<u-td><u-button type="success" @click="handleEdit(item.postId)">编辑</u-button></u-td>
				<u-td>
					<u-button type="error" @click="handleDelete(item.postId)">删除</u-button>
				</u-td>
			</u-tr>
		</u-table>
		<uni-pagination :current="page.startPage" :pageSize="page.pageSize" :total="page.pageSize * page.totalPage" @change="handleCurrentChange"></uni-pagination>
	</view>
</template>

<script>
	import request from '../../common/requesst/interface.js'
	import uniPagination from '../../components/uni-pagination/uni-pagination.vue'
	export default {
		comments:{
			uniPagination
		},
		data() {
			return {
				postList: [],
				page: {
					startPage: 1,
					pageSize: 10,
					totalPage: null
				}
			}
		},
		onReady:function(){
			this.getAllPosts()
		},
		methods: {
			getAllPosts: function() {
				request({
					url: '/posts/getMyPostList',
					data: {
						startPage: this.page.startPage,
						pageSize: this.page.pageSize
					},
					method: 'POST'
				}).then( res => {
					this.page.startPage = res.data.data.startPage
					this.page.pageSize = res.data.data.pageSize
					this.page.totalPage = res.data.data.totalPage
					this.postList = res.data.data.list
					this.postList.forEach(post => {
						post.postStatus = this.getCurrentStatus(post.postStatus)
					})
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
			},
			handleDetial: function(postId) {
				uni.navigateTo({
					url:'../details/details?data='+postId
				})
			},
			handleCurrentChange: function(e) {
				this.page.startPage = e.current
				this.getAllPosts()
			},
			handleEdit: function(postId) {
				request({
					url: '/posts/' + postId,
					method: 'GET'
				}).then( res => {
					if (res.data.code === 1000) {
						uni.navigateTo({
							url: './editPost?postId=' + res.data.data.postId + '&category=' + res.data.data.postCategory.categoryId + '&postTitle=' + res.data.data.postTitle + '&content=' + encodeURIComponent(JSON.stringify(res.data.data.postContent))
						})
					}
				})
			},
			handleDelete: function(postId) {
				uni.showModal({
					content:'是否确定删除',
					success: (res) => {
						if (res.confirm) {
							request({
								url: '/posts/' + postId,
								method: 'DELETE'
							}).then( res => {
								if ( res.data.code === 1000) {
									this.getAllPosts()
									uni.showToast({
										title: '删除成功'
									});
								} 
							})
						}
						if (res.cancel) {
							uni.showToast({
								title:'取消删除',
								icon: 'none'
							})
						}
					}
				})
			}
		}
	}
</script>

<style>

</style>
