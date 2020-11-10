<template>
	<view class="u-skeleton">
		<u-cell-group>
			<u-cell-item title="修改头像" @click="upload">
				<view class="head">
					<image :src="userInfo.avatar" mode="aspectFill"></image>
				</view>
			</u-cell-item>
			<u-cell-item title="修改昵称" @click="changeName"></u-cell-item>
			<u-cell-item title="修改密码" @click="changePassword"></u-cell-item>
			<u-cell-item title="修改手机号" @click="changeMobile"></u-cell-item>
		</u-cell-group>
		<view class="btn-box">
			<u-button type="warning" shape="circle" @click="exit">退出登录</u-button>
		</view>
		<u-modal v-model="changeNameShow" @confirm="confirm" title="修改昵称:" :show-cancel-button="true" ref="uModal"
		 :mask-close-able="true" :async-close="true">
			<view class="slot-content">
				<u-field v-model="nameValue" label="昵称:" placeholder="请输入昵称" />
			</view>
		</u-modal>
		<u-modal v-model="changePasswordShow" @confirm="confirm_p" title="修改昵称" :show-cancel-button="true" ref="uModal"
		 :mask-close-able="true" :async-close="true">
			<view class="slot-content">
				<u-field v-model="old_p" type="password" label="原密码:" placeholder="请输入原密码" />
				<u-field v-model="new_p" type="password" label="新密码:" placeholder="请输入新密码" />
				<u-field v-model="new_p_c" type="password" label="新密码:" placeholder="请输入新密码" />
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
				changePasswordShow: false,
				nameValue: '',
				userInfo: '',
				new_p_c: '',
				new_p: '',
				old_p: ''
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
		created() {
			let _this = this
			// 监听从裁剪页发布的事件，获得裁剪结果
			uni.$on('uAvatarCropper', path => {
				console.log(path)
				API.upLoad(path).then(res => {
					console.log(res)
					let resp = JSON.parse(res)
					API.changeAvatar({
						avatar: resp.data.path
					}).then(res => {
						uni.showToast({
							title: res.message
						})
						setTimeout(() => {
							API.check_login({}).then(res => {
								API.setStorage('userInfo', res.data.user)
								_this.userInfo = res.data.user
								_this.nameValue = res.data.user.user_name
							})
						}, 1000)

					})
				}, err => {
					uni.showToast({
						title: err.message
					})
				})
			})
		},
		methods: {
			upload() {
				// 此为uView的跳转方法，详见"文档-JS"部分，也可以用uni的uni.navigateTo
				this.$u.route({
					// 关于此路径，请见下方"注意事项"
					url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
					// 内部已设置以下默认参数值，可不传这些参数
					params: {
						// 输出图片宽度，高等于宽，单位px
						destWidth: 100,
						// 裁剪框宽度，高等于宽，单位px
						rectWidth: 100,
						// 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
						fileType: 'jpg',
					}
				})
			},
			changeName() {
				this.changeNameShow = true;
			},
			changePassword() {
				this.changePasswordShow = true;
			},
			changeMobile() {
				uni.navigateTo({
					url: '../changeMobile/changeMobile'
				})
			},
			confirm_p() {
				if (this.old_pass == '' || this.new_pass == '' || this.new_pass_confirm == '') {
					uni.showToast({
						title: '请输入密码'
					})
					return false;
				}
				API.changePassword({
					old_pass: this.old_p,
					new_pass: this.new_p,
					new_pass_confirm: this.new_p_c
				}).then(res => {
						uni.showToast({
							title: res.message
						})
						setTimeout(() => {
							this.changePasswordShow = false;
							API.check_login({}).then(res => {
								API.setStorage('userInfo', res.data.user)
							})
						}, 1000)
					},
					error => {
						uni.showToast({
							title: error.message
						})
						this.$refs.uModal.clearLoading();
					})

			},
			confirm(e) {
				if (this.nameValue == '') {
					uni.showToast({
						title: '请输入昵称'
					})
					return false;
				}
				API.changeName({
					user_name: this.nameValue
				}).then(res => {
						uni.showToast({
							title: res.message
						})
						setTimeout(() => {
							this.changeNameShow = false;
							API.check_login({}).then(res => {
								API.setStorage('userInfo', res.data.user)
							})
						}, 1000)
					},
					error => {
						uni.showToast({
							title: error.message
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

	.ipt {
		padding: 30rpx !important;
	}
</style>
