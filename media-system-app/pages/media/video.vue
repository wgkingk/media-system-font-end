<template>
	<view>
		<u-cell-group>
			<u-cell-item icon="reload" title="刷新" @click="refresh"></u-cell-item>
		</u-cell-group>
		<uni-card v-for="(item,index) in list" :key="index" :title="'标题：'+item.mediaTitle" :note="'由' + item.userEmail + '上传'">
			<navigator :url="'../video/video?src=' + item.mediaUrl">
				<image src="../../static/video.jpg"></image>
			</navigator>
			<u-alert-tips type="success" :title="item.mediaComment"></u-alert-tips>
		</uni-card>
		<u-loadmore :status="status" @loadmore="handleCurrentChange" />
	</view>
</template>

<script>
	import {getImgUrl,getVideoUrl} from '../../common/fileUtil.js'
	import request from '../../common/requesst/interface.js'
	import uniCard from '../../components/uni-card/uni-card.vue'
	import uniPagination from '../../components/uni-pagination/uni-pagination.vue'
	export default {
		data() {
			return {
				status: 'loadmore',
				name: '图片',
				page: {
					startPage: 1,
					pageSize: 5,
					totalPage: null
				},
				list:[]
			}
		},
		components:{
			uniCard,
			uniPagination
		},
		onLoad() {
			this.loadPicture()
		},
		methods: {
			loadPicture: function() {
				request({
					url: '/file/getVideo',
					data: {
						startPage: this.page.startPage,
						pageSize: this.page.pageSize
					}
				}).then( res => {
					if (res.data.code === 1000) {
						this.page.startPage = res.data.data.startPage
						this.page.totalPage = res.data.data.totalPage
						res.data.data.list.forEach( item => {
							item.mediaUrl = getVideoUrl(item.mediaUrl)
							this.list.push(item)
						})
						if (this.page.startPage === this.page.totalPage) {
							this.status = 'nomore'
						} else {
							this.status = 'loadmore'
						}
					}
				})
			},
			handleCurrentChange: function() {
				if(this.page.startPage === this.page.totalPage) return
				this.status = 'loading'
				this.page.startPage = ++this.page.startPage
				this.loadPicture()
			},
			refresh: function() {
				this.list = []
				this.page.startPage = 1
				this.loadPicture()
			}
		}
	}
</script>

<style>

</style>

