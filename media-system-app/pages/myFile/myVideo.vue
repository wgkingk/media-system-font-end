<template>
	<view>
		<u-cell-group>
			<u-cell-item icon="reload" title="上传" @click="picShow = true"></u-cell-item>
		</u-cell-group>
		<uni-card v-for="(item,index) in list" :key="index" :title="'标题：'+item.mediaTitle" :note="'由' + item.userEmail + '上传'">
			<navigator :url="'../video/video?src=' + item.mediaUrl">
				<image src="../../static/video.jpg"></image>
			</navigator>
			<u-alert-tips type="success" :title="item.mediaComment"></u-alert-tips>
			<u-button type="error" size="mini" style="display: block;" @click="deleteVideo(item.mediaId)">删除</u-button>
		</uni-card>
		<u-loadmore :status="status" @loadmore="handleCurrentChange" />
		<u-popup v-model="picShow" mode="top" border-radius="14" length="60%" style="z-index: 10000;">
			<view style="text-align: center;">
				<u-cell-group>
					<u-field label="title" :required="true" v-model="form.mediaTitle"></u-field>
					<u-field label="备注" :required="true" type="textarea" v-model="form.mediaComment"></u-field>
				</u-cell-group>
				<video style="height: 200rpx; width: 380rpx;" v-if="videoPath" :src="videoPath"></video>
				<u-button @click="chooseVideo">选择视频</u-button>
				<u-button @click="submit" type="success">上传</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {getImgUrl,getVideoUrl} from '../../common/fileUtil.js'
	import request from '../../common/requesst/interface.js'
	import uniCard from '../../components/uni-card/uni-card.vue'
	import uniPagination from '../../components/uni-pagination/uni-pagination.vue'
	import config from '../../common/requesst/config.js'
	import store from '../../store/index.js'
	export default {
		data() {
			return {
				picShow: false,
				status: 'loadmore',
				name: '图片',
				page: {
					startPage: 1,
					pageSize: 5,
					totalPage: null
				},
				list:[],
				form: {
					mediaTitle: '',
					mediaComment: ''
				},
				videoPath: ''
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
					url: '/file/getVideoByUser',
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
			},
			deleteVideo: function(mediaId) {
				request({
					url: '/file/' + mediaId,
					method: 'DELETE'
				}).then( res => {
					this.list = this.list.slice(0,(this.page.startPage - 1) * this.page.pageSize)
					this.loadPicture()
					if (res.data.code === 1000) {
						uni.showToast({
							title:'删除成功'
						})
					}
				})
			},
			submit: function() {
				if (!this.form.mediaTitle||!this.form.mediaComment) {
					uni.showToast({
						icon: 'none',
						title: '请输入内容'
					})
					return
				}
				if (!this.videoPath) {
					uni.showToast({
						icon: 'none',
						title: '请选择图片'
					})
					return
				}
				uni.showLoading({
					title:'请等待'
				})
				uni.uploadFile({
				            url: config.url + '/file/uploadVideo', //仅为示例，非真实的接口地址
				            filePath: this.videoPath,
				            name: 'file',
				            formData: {
				                'mediaTitle':this.form.mediaTitle,
								'mediaComment':this.form.mediaComment
				            },
							header: {
								'authorization': store.state.token
							},
				            success: (uploadFileRes) => {
				                console.log(uploadFileRes.data);
								uni.showToast({
									title:'上传成功'
								})
								this.form.mediaTitle = ''
								this.form.mediaComment = ''
								this.videoPath = ''
								this.list = []
								this.loadPicture()
								uni.hideLoading()
				            },
							fail: () => {
								uni.hideLoading()
							}
				        });
			},
			chooseVideo: function() {
				uni.chooseVideo({
					success: (res) => {
						this.videoPath = res.tempFilePath
					}
				})
			}
		}
	}
</script>

<style>

</style>

