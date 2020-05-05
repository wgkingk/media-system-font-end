<template>
	 <view>
		 <view >
		         <u-cell-group>
		         			<u-field
		         				v-model="email"
		         				label="账号"
								required
		         				placeholder="请输入账号"
		         			>
		         			</u-field>
		         			<u-field
		         				v-model="password"
		         				label="密码"
								required
								type="password"
		         				placeholder="请输入密码"
		         			>
		         			</u-field>
							<u-button type="primary" @click="formSubmit">登录</u-button>
		         </u-cell-group>
		 </view>
	 </view>
</template>

<script>
	import request from "../../common/requesst/interface.js"
	import {mapMutations} from 'vuex'
	import {getUserInfo} from "../../common/requesst/index.js"
	import {getImgUrl} from '../../common/fileUtil.js'
	import store from '../../store/index.js'
	export default {
		data() {
			return {
				email: '',
				password: ''
			}
		},
		methods: {
			...mapMutations(['login']),
			...mapMutations(['setPersonInfo']),
			formSubmit: function(e) {
				
				if (!(this.email && this.password)){
					uni.showModal({
					    title: '提示',
					    content: '请输入后再登录',
					    showCancel: false
					});
				} else {
					request({
						url: '/auth/login',
						method: 'POST',
						data: {
							username: this.email,
							password: this.password
						},
					}).then( res => {
						if (res.data.code === 1002) {
							uni.showModal({
								title:'提示',
								content:'账号或密码错误',
								showCancel:false
							})
						} else {
							console.log(res)
							this.login(res.header.authorization)
							
							uni.showToast({
								icon:'success',
								title:'登陆成功'
							})
							getUserInfo().then( res => {
								if (res.data.code === 1000) {
									res.data.data.personalImage = getImgUrl(res.data.data.personalImage)
									this.setPersonInfo(res.data.data)
								}
							})
							
							uni.navigateBack({
								delta: 1
							})
						}
						
					})
				}
			}
		}
	}
</script>

<style>
/* #ifndef APP-NVUE */
.uni-form-item{
        padding: 20rpx 0;
    }
/* #endif */
.uni-btn-v{
	width: 200rpx;
	margin-top: 50rpx;
}
</style>
