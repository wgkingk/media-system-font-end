<template>
	<el-container style="height: 100%;">
	  <el-aside width="300px" style="background-color: #545c64;">
		  <div >
		  <el-menu
		        default-active="1"
		        class="el-menu-vertical-demo"
		        background-color="#545c64"
				@select="handleSelect"
		        text-color="#fff"
		        active-text-color="#ffd04b">
		        <el-menu-item index="1">
		          <i class="el-icon-menu"></i>
		          <span slot="title">个人信息</span>
		        </el-menu-item>
		        <el-menu-item index="2">
		          <i class="el-icon-menu"></i>
		          <span slot="title">修改信息</span>
		        </el-menu-item>
		        <el-menu-item index="3">
		          <i class="el-icon-document"></i>
		          <span slot="title">修改密码</span>
		        </el-menu-item>
		      </el-menu>
			  </div>
	  </el-aside>
	  <el-main>
		  <el-page-header @back="goBack" content="个人中心">
		  </el-page-header>
		  <div v-show="show.personInfo" class="transition-box">
			<div id="ava" >
				<el-avatar :size="100" :src="personInfo.personalImage"></el-avatar>
				<span class="title" style="display: block;">{{personInfo.name}}</span>
				<el-divider></el-divider>
			</div>
			<el-row style="text-align: left;" id="main">
			  <el-col :span="12"><div class="grid-content bg-purple">
			  <span>姓名： {{personInfo.name}}</span>
			  <span>email: {{personInfo.email}}</span>
			  <span>单位： {{personInfo.departmentName}}</span>
			  </div></el-col>
			  <el-col :span="12"><div class="grid-content bg-purple-light">
			  <span>生日： {{personInfo.birthday}}</span>
			  <span>开号日期： {{personInfo.createdTime}}</span>
			  </div></el-col>
			</el-row>
			<el-row id="main" style="text-align: left;">
				<span>个人简介: {{personInfo.introduction}}</span>
			</el-row>
		  </div>
		  
		  <div v-show="show.updateInfo" class="transition-box">
			  <el-form :model="updateInfo" id="loginForm" status-icon  ref="updateInfo" label-width="100px" class="demo-ruleForm" style="margin: 1.25rem auto; width: 80%;text-align: left;">
			    <div style="text-align: center; margin-bottom: 1.25rem;">
			  	  <el-upload
			  	    class="avatar-uploader"
			  		name="file"
			  	    :action="this.$axios.defaults.baseURL + '/file/uploadImg'"
			  	    :show-file-list="false"
			  	    :on-success="handleAvatarSuccess"
			  	    :before-upload="beforeAvatarUpload">
			  	    <el-avatar :size="100" v-if="updateInfo.personalImage" :src="this.getImg(updateInfo.personalImage)"></el-avatar>
			  		<div v-else><el-avatar style="display: block;" :size="100" icon="el-icon-user-solid"></el-avatar><span class="title">点击更换头像</span></div>
			  	    
			  	  </el-upload>
			    </div>
			    <el-form-item label="姓名">
			      <el-input type="text" v-model="updateInfo.name" autocomplete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="单位">
			      <el-select v-model="updateInfo.department" placeholder="请选择工作单位">
			            <el-option v-for="item in departmentList" :key="item.departmentId" :label="item.departmentName" :value="item.departmentId"></el-option>
			      </el-select>
			    </el-form-item>
			    <el-form-item label="生日" style="text-align: left;">
			      <el-date-picker v-model="updateInfo.birthday" type="date" placeholder="选择日期" > </el-date-picker>
			    </el-form-item>
			    <el-form-item label="职务" prop="duties">
			      <el-input type="text" v-model="updateInfo.duties" autocomplete="off"></el-input>
			    </el-form-item>
		
			    <el-form-item label="个人简介" >
			      <el-input type="text" v-model="updateInfo.introduction" autocomplete="off"></el-input>
			    </el-form-item>
			      <el-button @click="submit">更新</el-button>
			  </el-form>
		  </div>
		  
		  <div v-show="show.changePassword">
			  <el-form :model="password" id="loginForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin: 1.25rem auto; width: 80%;text-align: left;">
			    
			    <el-form-item label="密码" prop="nowPassword">
			      <el-input type="password" v-model="password.nowPassword" autocomplete="off"></el-input>
			    </el-form-item>
				<el-form-item label="新密码" prop="newPassword">
				  <el-input type="password" v-model="password.newPassword" autocomplete="off"></el-input>
				</el-form-item>
			    <el-form-item label="确认密码" prop="checkPassword">
			      <el-input type="password" v-model="password.checkPassword" autocomplete="off"></el-input>
			    </el-form-item>
			    <el-form-item>
			      <el-button type="primary" @click="changePassword('ruleForm')">提交</el-button>
			    </el-form-item>
			  </el-form>
		  </div>
		  
		
	  </el-main>
	</el-container>
</template>

<script>
import {getImgUrl} from '../util/fileUtil.js'
export default {
	name: 'PersonCenter',
	data() {
		return {
			show: {
				personInfo: true,
				updateInfo: false,
				changePassword: false
			},
			personInfo: {
				email: null,
				name: null,
				departmentName: null,
				birthday: null,
				duties: null,
				personalImage: null,
				introduction: null,
				createdTime: null
			},
			updateInfo: {
				email: null,
				name: null,
				department: null,
				birthday: null,
				duties: null,
				personalImage: null,
				introduction: null,
				createdTime: null
			},
			departmentId: null,
			departmentList: null,
			password: {
				nowPassword: '',
				newPassword: '',
				checkPassword: ''
			},
			rules: {
				nowPassword:[
				  { required:true, message:'请输入密码', trigger: 'blur'}
				],
				newPassword: [
				  { required:true, message:'请输入新密码', trigger: 'blur' }
				],
				checkPassword: [
				  { required:true, message:'请确定密码', trigger: 'blur' }
				]
			}
		}
	},
	mounted() {
		this.$axios.get('/user').then(res => {
			this.personInfo = res.data.data
			this.personInfo.personalImage = getImgUrl(this.personInfo.personalImage)
		})
	},
	methods:{
		handleSelect: function(index) {
			switch(index) {
				case '1':
					this.show.personInfo = true
					this.show.changePassword = false
					this.show.updateInfo = false
					break
				case '2':
				    if(!this.updateInfo.email){
					this.$axios.get('/originUser').then(res => {
						this.updateInfo = res.data.data
					})
					}
					this.$axios.get('/department').then(res => {
						this.departmentList = res.data.data
					})
					this.show.personInfo = false
					this.show.changePassword = false
					this.show.updateInfo = true
					break
				case '3':
					this.show.personInfo = false
					this.show.changePassword = true
					this.show.updateInfo = false
					console.log(3)
					break
			}
		},
		goBack: function() {
			this.$router.go(-1)
		},
		handleAvatarSuccess: function(res, file) {
			  this.updateInfo.personalImage = res.data
		      },
		beforeAvatarUpload: function(file) {
		  const isJPG = file.type === 'image/jpeg';
		  const isLt2M = file.size / 1024 / 1024 < 2;
		
		  if (!isJPG) {
		    this.$message.error('上传头像图片只能是 JPG 格式!');
		  }
		  if (!isLt2M) {
		    this.$message.error('上传头像图片大小不能超过 2MB!');
		  }
		return isJPG && isLt2M;
		  },
		uploadSucceess: function(response, file, fileList) {
		  console.log(data.data)
		},
		getImg: function(img) {
			return getImgUrl(img)
		},
		submit: function() {
			this.$axios.put('/user',this.updateInfo).then( res => {
				if (res.data.code === 1000) {
					this.$message.success('修改成功')
					this.$axios.get('/user').then(res => {
						this.personInfo = res.data.data
						this.personInfo.personalImage = getImgUrl(this.personInfo.personalImage)
					})
				}
			})
		},
		changePassword: function(refName) {
		if (this.password.checkPassword === this.password.newPassword){
			this.$refs[refName].validate((valid) => {
				if (valid) {
					this.$axios.put('/user/password',this.password).then( res => {
						if (res.data.data === 1) {
							this.$message.success('修改成功，重新登录')
							this.$store.commit('login','')
							this.$router.push({
								name: 'Login'
							})
						} else {
							this.$message.error('原始密码错误')
						}
					})
				} else {
					this.$message.error('请按要求输入')
				}
			})
			} else {
				this.$message.error('两次输入密码不同')
			}
		}
		
	}
	
}
</script>

<style>
#app,
html,
body,
.el-container {
	height: 100%;
	margin: 0 0;
}
#main span {
	display: block;
	margin-left: 1.875rem;
	margin-top: 1.25rem;
	font-size: large;
}
</style>
