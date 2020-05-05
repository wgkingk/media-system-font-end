<template>
	<view>
		<u-table>
			<u-tr>
				<u-th>标题</u-th>
				<u-th>状态</u-th>
				<u-th>操作</u-th>
			</u-tr>
			<u-tr v-for="item in postList" :key="item.postId">
				<u-td>{{item.postTitle}}</u-td>
				<u-td>{{item.postStatus.statusName}}</u-td>
				<u-td><u-button type="primary" @click="handleDetial(item.postId)">查看</u-button></u-td>
				<u-td>
					<u-button type="error" v-if="item.postStatus.status===1" @click="toNoPass(item.postId)">下架</u-button>
					<u-button type="success" v-else @click="checkPass(item.postId)">通过</u-button>
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
					url: '/posts/getAllPosts',
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
			checkPass: function(postId) {
				request({
					url: '/posts',
					data: {
						postId: postId,
						postStatus: 1
					},
					method: 'PUT'
				}).then( res => {
					if ( res.data.code === 1000) {
						this.getAllPosts()
						uni.showToast({
							title:"审核通过"
						})
					} else {
						uni.showToast({
							title:'发生错误'
						})
					}
				})
			},
			toNoPass: function(postId) {
				request({
					url: '/posts',
					data: {
						postId: postId,
						postStatus: 2
					},
					method: 'PUT'
				}).then( res => {
					if ( res.data.code === 1000) {
						this.getAllPosts()
						uni.showToast({
							title:"下架成功"
						})
					} else {
						uni.showToast({
							title:'发生错误'
						})
					}
				})
			}
		}
	}
</script>

<style>

</style>
