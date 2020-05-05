import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import Index from '@/pages/NavMenu'
import PostList from '@/components/postList'
import MyPostList from '@/components/MyPostList.vue'
import Article from '@/components/PostContent.vue'
import Comment from '@/components/Comment.vue'
import Register from '@/pages/Register.vue'
import wangEditor from '@/components/Editor.vue'
import Tiny from '@/components/Tiny.vue'
import EditPost from '@/components/EditPost'
import PersonCenter from '@/pages/PersonCenter'
import Picture from '@/components/Picture'
import Video from '@/components/Video'
import MyFile from '@/components/MyFile'
import Admin from '@/pages/Admin'
import CheckPost from '@/components/CheckPost'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
	{
	  path: '/register',
	  name: 'Register',
	  component: Register
	},
	{
		path: '/peronalCenter',
		name: 'PersonalCenter',
		component: PersonCenter
	},
	{
		path: '/admin',
		name: 'Admin',
		component: Admin
	},
    {
      path: '/',
      name: 'NavMenu',
      component: Index,
      children: [{
        path: 'postList/:categoryId',
        name: 'PostList',
        component: PostList
      },
	  {
		path: 'myPostList',
		name: 'MyPostList',
		component: MyPostList,
		meta: {
			requireAuth: true
		}
	  },
	  {
		path: 'article/:postId',
		name: 'Article',
		component: Article
	  },
	  {
		path: 'editor',
		name: 'editor',
		component: Tiny,
		meta: {
			requireAuth: true
		}
	  },
	  {
		path: 'editPost/:postId',
		name: 'editPost',
		component: EditPost,
		meta: {
			requireAuth: true
		}
	  },
		{
		path: 'pic',
		name: 'Picture',
		component: Picture
		},
		{
		path: 'video',
		name: 'Video',
		component: Video
		},
		{
		path: 'myFile',
		name: 'MyFile',
		component: MyFile
		},
		{
		path: 'check',
		name: 'CheckPost',
		component: CheckPost
		}
	]
    },
	{
	  path: '/test',
	  name: 'Test',
	  component: Picture,
	  meta: {
		  requireAuth: true
	  }
	}
  ]
})
