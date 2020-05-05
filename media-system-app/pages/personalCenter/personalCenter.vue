<template>
	<view>
		<view style="text-align: center; margin: 50rpx auto;">
			<navigator v-if="!personInfo" url="../login/login">
				<u-avatar size="160"></u-avatar>
			</navigator>
			<u-avatar v-else :src="personInfo.personalImage" size="160"></u-avatar>
		</view>
		<u-cell-group v-if="personInfo">
			<navigator url="personInfo"><u-cell-item icon="man-add" title="个人信息"></u-cell-item></navigator>
			<view v-if="!(personInfo.roles.length === 1 && personInfo.roles[0].roleId === 1)">
			<navigator url="../editor/editor"><u-cell-item icon="more-circle" title="写文章"></u-cell-item></navigator>
			<navigator url="../myPost/myPost"><u-cell-item icon="setting-fill" title="我的文章"></u-cell-item></navigator>
			<navigator url="../check/check"><u-cell-item icon="integral-fill" title="文章审核"></u-cell-item></navigator>
			</view>
			<u-cell-item icon="reload" title="注销" @click="logout"></u-cell-item>
		</u-cell-group>
		<u-alert-tips v-else type="warning" title="点击头像登录" :show-icon="true"></u-alert-tips>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				
			}
		},
		computed:{
			...mapState(['personInfo'])
		},
		methods: {
			...mapMutations(['login']),
			...mapMutations(['setPersonInfo']),
			logout: function() {
				uni.removeStorageSync('token')
				this.login(null)
				this.setPersonInfo(null)
				uni.reLaunch({
					url: '../index/index'
				})
			}
		}
	}
</script>

<style>

</style>
