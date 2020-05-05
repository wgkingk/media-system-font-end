<template>
	<div id="app">
		<el-form :model="loginForm" :rules="rules" ref="loginForm">
			<h2>登录</h2>
			<el-form-item label="用户名" prop="username">
				<el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input v-model="loginForm.password" placeholder="密码" type="password"></el-input>
			</el-form-item>
			<el-form-item label="">
				<el-button style="width:100%" @click="submitForm('loginForm')">登录</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		name: 'Login',
		data() {
			return {
				loginForm: {
					username: '',
					password: ''
				},
				rules: {
					username: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$axios.post('/auth/login', {
								username: this.loginForm.username,
								password: this.loginForm.password
							})
							.then(res => {
								if (res.data.code === 1002) {
									this.$message({
										message: '账号或密码错误',
										type: 'error'
									})
								} else {
									this.$store.commit('login', res.headers.authorization)
									this.$message({
										message: '登陆成功',
										type: 'success'
									})
									this.$router.go(-1)
								}
							})
					} else {
						return false
					}
				})
			}
		}
	}
</script>

<style scoped>
	#app {
		width: 50%;
		margin: 90px auto;
		border: 1px solid #eaeaea;
		border-radius: 50px;
		padding: 50px;
		box-shadow: 0 0 20px 20px gainsboro;
	}
</style>
