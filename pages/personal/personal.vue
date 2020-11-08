<template>
	<view class="u-skeleton">
		<u-cell-group>
			<u-cell-item title="修改头像" @click="upload">
				<view class="head">
					<image src="../../static/logo.png" mode=""></image>
				</view>
			</u-cell-item>
		</u-cell-group>
		<!--骨架组件-->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	import API from '../../common/api.js'
	export default {
		data() {
			return {
				loading: true, // 是否显示骨架屏组件
			}
		},
		onLoad() {
			// 通过延时模拟向后端请求数据，调隐藏骨架屏
			setTimeout(() => {
				this.loading = false;
			}, 2000)
		},
		methods: {
			upload() {
				// console.log(23)
				API.upLoad({})
			}
		}
	}
</script>

<style lang="scss">
	image {
		height: 100%;
		width: 100%;
	}

	.head {
		height: 60rpx;
		width: 60rpx;
		display: inline-block;
		vertical-align: middle;
	}
</style>
