<template>
  <div id="app">
	<div id="header" style="">
	<el-row>
	<el-col :span="12">
	<div style="text-align: left; margin-left: 10%;" class="grid-content"><h1>融媒体管理与发布系统</h1></div>
	</el-col>
	<el-col :span="12">
	<div class="grid-content" style="margin-top: 1.875rem;">
	<el-dropdown id="personblank" @command="handleCommand" style="margin-right: 12.5rem;">
	  <span class="el-dropdown-link">
	    <div>
	          <el-avatar v-bind:src="personalImage">未登录</el-avatar>
	        </div>
	  </span>
	  <el-dropdown-menu v-if="this.$store.state.token" slot="dropdown">
	    <el-dropdown-item command="personalCenter">个人中心</el-dropdown-item>
		<el-dropdown-item command="logout">注销</el-dropdown-item>
	  </el-dropdown-menu>
	  <el-dropdown-menu v-else slot="dropdown">
	    <el-dropdown-item command="login">登录</el-dropdown-item>
	    <el-dropdown-item command="register">注册</el-dropdown-item>
	  </el-dropdown-menu>
	</el-dropdown>	
	</div>
	</el-col>
	</el-row>
	</div>
    <el-menu id="menu" :default-active="activeIndex" class="el-menu-vertical-demo" mode="horizontal" @select="handleSelect">
       <el-submenu index="1" >
         <template slot="title">文章</template>
         <el-menu-item index="1-0" @click="getPostsList(0)">所有类型</el-menu-item>
         <el-menu-item v-for="item in categoryInfo" :index="'1-' + item.categoryId.toString()" :key="item.categoryId" @click="getPostsList(item.categoryId)">{{item.categoryName}}</el-menu-item>
       </el-submenu>
			 <el-menu-item index="6">图片</el-menu-item>
			 <el-menu-item index="7">视频</el-menu-item>
       <el-menu-item index="2" v-if="menuShow">写文章</el-menu-item>
       <el-menu-item index="3" v-if="menuShow">文章审批</el-menu-item>
			 <el-menu-item index="4" v-if="menuShow">我的文章</el-menu-item>
       <el-menu-item index="5" v-if="menuShow">我的文件</el-menu-item>
    </el-menu>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
	import {getImgUrl} from '../util/fileUtil.js'
export default {
  name: 'Index',
  data () {
    return {
	  user: {},
      activeIndex: '1-0',
      categoryInfo: [],
	  personalImage: null,
	  menuShow: false
    }
  },
  mounted () {
	
	if (this.$store.state.token) {
		this.$axios.get('/user').then( res => {
			this.user = res.data.data
			this.personalImage = getImgUrl(this.user.personalImage)
			console.log(this.user)
			if ( res.data.data.roles.length === 1 && res.data.data.roles[0].roleId === 1) {
				this.menuShow = false
			} else {
				this.menuShow = true
			}
		})
	}
    this.$axios.get('/admin/category')
      .then(res => {
        this.categoryInfo = res.data.data
        console.log(this.categoryInfo)
      })
	if (this.$route.path === '/') {
		this.$router.replace('/postList/'+ '0')
	}
  },
  methods: {
    handleSelect: function (index,path) {
      switch(index) {
			case '2':
				this.$router.push({
					name: 'editor'
				})
				break;
			case '3':
				this.$router.push({
					name: 'CheckPost'
				})
				break;
			case '4':
				this.$router.push('/myPostList')
				break;
			case '5':
				this.$router.push({
					name: 'MyFile'
				})
				break;
			case '6':
				this.$router.push({
					name: 'Picture'
				})
				break;
			case '7':
				this.$router.push({
					name: 'Video'
				})
	  }
	  
    },
    getPostsList(categoryId) {
      this.$router.push({
        path: '/postList/'+ categoryId,
        
      }).catch(err => {err})
    },
	handleCommand: function(command) {
	 if (command === 'login') {
		 this.$router.push('/login')
	 } else if (command === 'register') {
		 this.$router.push('/register')
	 } else if (command === 'personalCenter') {
		 this.$router.push({
			 name: 'PersonalCenter'
		 })
	 } else if (command === 'logout') {
		 localStorage.removeItem('token')
		 location.reload();
	 }
	}
  }
}
</script>

<style>
	#menu {
		margin-left: 5%;
		margin-right: 5%;
	}
	#header {
		height: 6.25rem;
		text-align: right; 
		border-radius: 0.625rem;
	}
	#personblank {
		margin: auto;
	}
	
</style>
