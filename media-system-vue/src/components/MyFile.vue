<template>
  <div id="myfile">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="我的图片" name="image">
        <el-row>
          <el-col :span="8" v-for="(o) in picList" :key="o.mediaId">
            <el-popover placement="top-start"  width="200" trigger="hover" v-bind:content="o.mediaComment">
              <el-card class="card" slot="reference" :body-style="{ padding: '0px' }" style="text-align: center;">
                <img :src="o.mediaUrl" class="image">
                <div style="padding: 14px;">
                  <span class="title">{{o.mediaTitle}}</span>
                  <div class="bottom clearfix">
                    <el-button type="text" class="button" @click="handleDelete(o.mediaId,o.mediaType)">删除</el-button>
                  </div>
                </div>
              </el-card>
            </el-popover>
          </el-col>
        </el-row>
        <el-pagination small layout="prev, pager, next" :page-size="page.picPage.pageSize" :current-page="page.picPage.startPage"
          :total="page.picPage.pageSize * page.picPage.totalPage" @current-change="handleImageCurrentChange" :hide-on-single-page=true>
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="我的视频" name="video">
		 <el-row>
		    <el-col :span="8" v-for="(o) in videoList" :key="o.mediaId">
		      <el-popover placement="top-start" width="200" trigger="hover" v-bind:content="o.mediaComment">
		        <el-card class="card" slot="reference" :body-style="{ padding: '0px' }" style="text-align: center;">
		          <video controls="controls" class="image">
		          <source :src="o.mediaUrl" type="video/mp4" />
		          </video>
		          <div style="padding: 14px;">
		            <span class="title">{{o.mediaTitle}}</span>
		            <div class="bottom clearfix">
		              <el-button type="text" class="button" @click="handleDelete(o.mediaId,o.mediaType)">删除</el-button>
		            </div>
		          </div>
		        </el-card>
		      </el-popover>
		    </el-col>
		  </el-row>
		  <el-pagination small layout="prev, pager, next" :page-size="page.videoPage.pageSize" :current-page="page.videoPage.startPage"
		    :total="page.videoPage.pageSize * page.videoPage.totalPage" @current-change="handleVideoCurrentChange" :hide-on-single-page=true>
		  </el-pagination>
	  </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {
    getImgUrl,
    getVideoUrl
  } from '../util/fileUtil'
  export default {
    name: 'MyFile',
    data() {
      return {
        activeName: 'image',
        page: {
          picPage: {
            startPage: 1,
            pageSize: 12,
            totalPage: 1
          },
          videoPage: {
            startPage: 1,
            pageSize: 12,
            totalPage: 1
          }
        },
        picList: [],
        videoList: []
      }
    },
    methods: {
      getImage: function () {
        this.$axios.post('/file/getImageByUser', this.page.picPage)
          .then(res => {
            if (res.data.code === 1000) {
              this.picList = res.data.data.list
              this.picList.forEach(pic => {
                pic.mediaUrl = getImgUrl(pic.mediaUrl)
              })
              this.page.picPage = res.data.data
            }
          })
      },
      getVideo: function () {
        this.$axios.post('/file/getVideoByUser', this.page.videoPage)
          .then(res => {
            if (res.data.code === 1000) {
              this.videoList = res.data.data.list
              this.videoList.forEach(video => {
                video.mediaUrl = getVideoUrl(video.mediaUrl)
              })
              this.page.videoPage = res.data.data
            }
          })
      },
      handleClick: function (info) {
        if (info.name === 'video' && this.videoList.length == 0) {
          this.getVideo()
        }
      },
      handleImageCurrentChange: function(current){
        this.page.picPage.startPage = current
        this.getImage()
      },
	  handleVideoCurrentChange: function(current) {
		  this.page.videoPage.startPage = current
		  this.getVideo()
	  },
      handleDelete: function(mediaId,mediaType){
        this.$axios.delete('/file/' + mediaId)
          .then( res=> {
            if (res.data.code === 1000) {
              this.$message.success('删除成功')
			  if (mediaType === 'image') {
				  this.getImage()
			  } else if (mediaType === 'video') {
				  this.getVideo()
			  }
            }
          })
      }
    },
    mounted() {
      this.getImage()
    }
  }

</script>

<style>
  #myfile {
	margin: auto 5%;
  }
  .image {
    height: 18.75rem;
    margin: auto auto;
    display: block;
  }

  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
    text-align: right;
  }

  .card {
    margin: 1.25rem 1.875rem;
  }

  #head {
    margin: auto 5%;
  }

</style>
