<template>
	<view class="content u-skeleton">
		<view class="banner">
			<u-swiper :list="bannerList" :effect3d="true"></u-swiper>
		</view>
		<view class="icon-nav">
			<u-grid :col="3" :border="false">
				<u-grid-item>
					<u-icon name="photo" :size="46"></u-icon>
					<view class="grid-text">签到</view>
				</u-grid-item>
				<u-grid-item>
					<u-icon name="lock" :size="46"></u-icon>
					<view class="grid-text">H5小游戏</view>
				</u-grid-item>
				<u-grid-item>
					<u-icon name="hourglass" :size="46"></u-icon>
					<view class="grid-text">赚取金币</view>
				</u-grid-item>
			</u-grid>
		</view>
		<!--骨架组件-->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bannerList: ['https://cdn.uviewui.com/uview/swiper/1.jpg', 'https://cdn.uviewui.com/uview/swiper/2.jpg',
					'https://cdn.uviewui.com/uview/swiper/3.jpg'
				],
				loading: true, // 是否显示骨架屏组件
			};
		},
		onLoad() {
			// 通过延时模拟向后端请求数据，调隐藏骨架屏
			setTimeout(() => {
				this.loading = false;
			}, 2000)
		},
	}
</script>

<style lang="scss">
.icon-nav{
	padding: 30rpx 0;
}
</style>
