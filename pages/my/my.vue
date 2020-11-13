<template>
	<view class="u-skeleton">
		<view class="u-flex user-box u-p-t-30 u-p-l-30 u-p-r-20 u-p-b-30" @click="onPersonal">
			<view class="u-m-r-10">
				<u-avatar :src="userInfo.avatar" size="140"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{userInfo.user_name}}</view>
				<view class="u-font-14 u-tips-color">邀请码:{{userInfo.p_code}}</view>
			</view>
			<view class="u-m-l-10 u-p-10">
				<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
			</view>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="account" title="申请实名"></u-cell-item>
			</u-cell-group>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="red-packet" title="我的账单" @click="onWithdrawal"></u-cell-item>
			</u-cell-group>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="setting" title="设置"></u-cell-item>
			</u-cell-group>
		</view>
		<!--骨架组件-->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	import API from '../../common/api.js'
	export default {
		data() {
			return {
				show:true,
				loading: true, // 是否显示骨架屏组件
				userInfo:''
			}
		},
		onLoad() {
			this.userInfo = API.getStorage('userInfo')
			console.log(this.userInfo)
			// 通过延时模拟向后端请求数据，调隐藏骨架屏
			setTimeout(() => {
				this.loading = false;
			}, 2000)
		},
		methods: {
			onPersonal(){
				uni.navigateTo({
					url:'../personal/personal'
				})
			},
			onWithdrawal(){
				uni.navigateTo({
					url:'../withdrawal/withdrawal'
				})
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #ededed;
}

.camera{
	width: 54px;
	height: 44px;
	
	&:active{
		background-color: #ededed;
	}
}
.user-box{
	background-color: #fff;
}
</style>
