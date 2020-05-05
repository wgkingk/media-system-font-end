<template>
    <view class="container">
		<view>
				<u-cell-group>
					<u-field
						v-model="postTitle"
						:required=true
						
						label="题目"
						placeholder="请输入文章题目"
					>
					</u-field>
					<u-radio-group v-model="postCategory" style="margin: auto auto;">
								<u-radio 
									v-for="(item, index) in category" :key="index" 
									:name="item.categoryId"
								>
									{{item.categoryName}}
									
								</u-radio>
					</u-radio-group>
				</u-cell-group>
			</view>
        <jin-edit :html="originHtml" @editOk="editOk" :uploadFileUrl="imageService"></jin-edit>
    </view>
</template>

<script>
	import jinEdit from '../../components/jin-edit/jin-edit.vue';
	import config from '../../common/requesst/config.js'
	import {mapState} from 'vuex'
	import request from '../../common/requesst/interface.js'
    export default {
        data() {
            return {
                placeholder: '开始输入...',
				imageService: config.url + '/file/uploadImg',
				postTitle: '',
				postCategory: null,
				postId: null,
				originHtml: ''
            }
        },
		components: {
			jinEdit
		},
		computed:{
			...mapState(['category'])
		},
		onLoad:function(option){
			this.postId = option.postId
			this.postTitle = option.postTitle
			this.postCategory = option.category
			this.originHtml = JSON.parse(decodeURIComponent(option.content))
		},
        methods: {
			editOk(res) {
			    console.log(res);
				if (!this.postTitle || !this.postCategory || !res.html) {
					uni.showModal({
						showCancel: false,
						title: '提示',
						content: '请输入完整的信息'
					})
				} else {
					request({
						url: '/posts',
						data: {
							postId: this.postId,
							postTitle: this.postTitle,
							postCategory: this.postCategory,
							postContent: res.html
						},
						method: 'PUT'
					}).then( res => {
						if (res.data.code === 1000) {
							uni.showToast({
								icon: 'success',
								title: '修改成功'
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
    .container {
        padding: 10px;
    }

    #editor {
        width: 100%;
        height: 300px;
        background-color: #CCCCCC;
    }

    button {
        margin-top: 10px;
    }
</style>
