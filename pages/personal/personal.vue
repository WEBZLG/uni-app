<template>
	<view class="u-skeleton">
		<u-cell-group>
			<u-cell-item title="修改头像" @click="upload">
				<view class="head">
					<image :src="userInfo.avatar" mode=""></image>
				</view>
			</u-cell-item>
			<u-cell-item title="修改昵称" @click="changeName"></u-cell-item>
			<u-cell-item title="修改密码" @click="changePassword"></u-cell-item>
			<u-cell-item title="修改手机号" @click="changeMobile"></u-cell-item>
		</u-cell-group>
		<view class="btn-box">
			<u-button type="warning" shape="circle" @click="exit">退出登录</u-button>
		</view>
		<u-modal v-model="changeNameShow" @confirm="confirm" title="修改昵称"  :show-cancel-button="true" ref="uModal" :mask-close-able="true" :async-close="true">
			<view class="slot-content">
				<u-input v-model="nameValue" placeholder="请输入昵称" class="ipt"/>
			</view>
		</u-modal>
		<u-modal v-model="changeNameShow" @confirm="confirm" title="修改昵称"  :show-cancel-button="true" ref="uModal" :mask-close-able="true" :async-close="true">
			<view class="slot-content">
				<u-input v-model="nameValue" placeholder="请输入昵称" class="ipt"/>
			</view>
		</u-modal>
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
				changeNameShow: false,
				nameValue: '',
				userInfo:''
			}
		},
		onLoad() {
			this.userInfo = API.getStorage('userInfo')
			this.nameValue = API.getStorage('userInfo').user_name
			// 通过延时模拟向后端请求数据，调隐藏骨架屏
			setTimeout(() => {
				this.loading = false;
			}, 2000)
		},
		methods: {
			upload() {
				// console.log(23)
				API.upLoad({})
			},
			changeName() {
				this.changeNameShow = true;
			},
			confirm(e){
				API.changeName({
					user_name:this.nameValue
				}).then(res=>{
					uni.showToast({
						title:res.message
					})
					setTimeout(() => {
						this.changeNameShow = false;
						API.check_login({}).then(res=>{
							API.setStorage('userInfo',res.data.user)
						})
					}, 1000)
				},
				error=>{
					uni.showToast({
						title:error.message
					})
					this.$refs.uModal.clearLoading();
				})
			},
			exit() {
				uni.showModal({
					title: '退出提示',
					content: '确定退出登录？',
					success: function(res) {
						if (res.confirm) {
							API.logout({}).then(res => {
								uni.showToast({
									title: res.message
								})
								uni.clearStorage();
								setTimeout(function() {
									uni.reLaunch({
										url: '../login/login'
									})
								}, 1500)
							})
						} else if (res.cancel) {
							uni.showToast({
								title: '已取消'
							})
						}
					}
				});

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

	.btn-box {
		position: fixed;
		bottom: 0;
		padding: 30rpx;
		left: 0;
		right: 0;
	}
	.ipt{
		padding: 30rpx !important;
	}
</style>
