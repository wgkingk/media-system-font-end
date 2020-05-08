<template>
	<view>
		<video :autoplay="true" style="width: 100%; margin-top: auto;margin-bottom: auto;" :src="videoSrc"></video>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				videoSrc: ''
			}
		},
		onLoad: function(e){
			this.videoSrc = e.src
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
