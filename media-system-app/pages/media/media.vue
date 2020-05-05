<template>
	<view>
		<!-- <view>
			<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false"
			 swiperWidth="750"></u-tabs-swiper>
		</view>
		<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item"  v-for="(item, index) in list" :key="index">
			   <view v-if="index === 1">
				   <view v-for="media in item.list" :key="media.mediaId" >
					<video :src="media.mediaUrl" :title="media.mediaTitle"></video>
				   </view>
			   </view>
			   <view v-else>
				   <view>
						<image  v-for="media in item.list" :key="media.mediaId" :src="media.mediaUrl" error-img="/static/error/error.png"></image>
				   </view>
			   </view>
			</swiper-item>
		</swiper> -->
		<view></view>
		<image v-for="item in list[0].list" :key="item.mediaId" :src="item.mediaUrl" mode=""></image>
	</view>
</template>


<script>
	import {getImgUrl,getVideoUrl} from '../../common/fileUtil.js'
	import request from '../../common/requesst/interface.js'
	export default {
		data() {
			return {
				list: [{
					name: '图片',
					page: {
						startPage: 1,
						pageSize: 5,
						totalPage: null
					},
					list:[]
				}, {
					name: '视频',
					page: {
						startPage: 1,
						pageSize: 5,
						totalPage: null
					},
					list:[]
				}],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
			};
		},
		onReady() {
			this.loadMedia(0)
			this.loadMedia(1)
		},
		methods: {
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			// scroll-view到底部加载更多
			onreachBottom() {
				
			},
			loadMedia: function(index) {
				let url
				if (index === 0) {
					url = 'getImage'
				} else {
					url = 'getVideo'
				}
				
				request({
					url: '/file/' + url,
					method: 'POST',
					data: {
						startPage: this.list[index].page.startPage,
						pageSize: this.list[index].page.pageSize
					}
				}).then( res => {
					if (res.data.code === 1000) {
						this.list[index].page.startPage = res.data.data.startPage
						this.list[index].page.pagepageSize = res.data.data.pageSize
						this.list[index].page.totalPage = res.data.data.totalPage
						this.list[index].list = res.data.data.list
						if (index === 0) {
							this.list[index].list.forEach( item => {
								item.mediaUrl = getImgUrl(item.mediaUrl)
							})
						} else {
							this.list[index].list.forEach( item => {
								item.mediaUrl = getVideoUrl(item.mediaUrl)
							})
						}
					}
				})
			}
		}
	};
</script>
<style lang="scss">
	page{
		height: 100%;
	}
	.scroll{
		flex: 1;
		position: relative;
		background-color: #f8f8f8;
		height: 0;
	}
	.scroll-content{
		display: flex;
		flex-direction: column;
	}
</style>