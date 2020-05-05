import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state:{
		token: uni.getStorageSync('token') ? uni.getStorageSync('token'):null,
		category: [],
		personInfo: null
	},
	
	mutations:{
		login (state,token) {
			state.token = token
			uni.setStorageSync('token',token)
			console.log('登陆成功' + token)
		},
		setCategory (state,category) {
			state.category = category
			console.log('类型信息加载成功')
		},
		setPersonInfo(state,info) {
			state.personInfo = info
			console.log('个人信息加载成功')
		}
	}
})

export default store