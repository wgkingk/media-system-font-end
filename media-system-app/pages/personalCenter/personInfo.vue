<template>
	<view>
		<u-cell-group>
			<u-cell-item title="编辑" arrow-direction="none" :arrow="false">
				<u-icon slot="icon" size="32" name="setting-fill"></u-icon>
				<!-- <u-badge count="99" :absolute="false" slot="right"></u-badge> -->
				<u-switch slot="right" v-model="edit"></u-switch>
			</u-cell-item>
			<u-field v-model="user.email" label="邮箱" :disabled="true" />
			<u-field :required="edit" v-model="user.name" label="姓名" :disabled="!edit" />
			<u-field :required="edit" v-model="user.duties" label="职位" :disabled="!edit" />
			<u-field v-model="user.departmentName" label="单位" :disabled="true" />
			<u-field v-model="user.birthday" label="生日" :disabled="true" />
			<u-field v-model="user.createdTime" label="注册时间" :disabled="true" />
			<u-field :required="edit" type="textarea" v-model="user.introduction" label="个人介绍" :disabled="!edit" />
		</u-cell-group>
		<u-alert-tips v-if="edit" type="warning" title="带*号的项为可编辑项"></u-alert-tips>
		<u-button type="primary" v-if="edit" @click="putForm">提交</u-button>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import request from '../../common/requesst/interface.js'
	import {getImgUrl} from '../../common/fileUtil.js'
	export default {
		data() {
			return {
				edit: false,
				user: {
					birthday: '',
					createdTime: '',
					departmentName: '',
					duties: '',
					email: '',
					introduction: '',
					name: ''
				}
			}
		},
		computed: {
			...mapState(['personInfo'])
		},
		methods: {
			...mapMutations(['setPersonInfo']),
			putForm: function() {
				request({
					url: '/user',
					method: 'PUT',
					data: {
						duties: this.user.duties,
						introduction: this.user.introduction,
						name: this.user.name
					}
					}).then( res => {
						if (res.data.code === 1000) {
							this.edit = !this.edit
							uni.showToast({
								title: '更新成功'
							});
							getUserInfo().then( res => {
								if (res.data.code === 1000) {
									res.data.data.personalImage = getImgUrl(res.data.data.personalImage)
									this.setPersonInfo(res.data.data)
								}
							})
						}
				})
			}
		},
		onLoad() {
			this.user = this.personInfo
		}
	}
</script>

<style>

</style>
