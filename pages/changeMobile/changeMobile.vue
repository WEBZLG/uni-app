<template>
	<view class="changeMobile">
		<u-form :model="form" ref="uForm">
			<u-form-item v-if="!isNew" :rightIconStyle="{color: '#888', fontSize: '32rpx'}" :label-position="labelPosition"
			 label="原手机号:" label-width="150">
				<u-input :border="border" disabled v-model="form.old_phone" type="number"></u-input>
			</u-form-item>
			<u-form-item v-if="isNew" :rightIconStyle="{color: '#888', fontSize: '32rpx'}" :label-position="labelPosition" label="新手机号:"
			 prop="phone" label-width="150">
				<u-input :border="border" placeholder="请输入手机号:" v-model="form.phone" type="number"></u-input>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="验证码:" prop="code" label-width="150">
				<u-input :border="border" placeholder="请输入验证码:" v-model="form.code" type="text"></u-input>
				<u-button slot="right" type="success" size="mini" @click="getCode">{{codeTips}}</u-button>
			</u-form-item>
			<u-button type="success" shape="circle" @click="submit">提交</u-button>
			<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
		</u-form>
	</view>
</template>

<script>
	var _this;
	import API from '../../common/api.js'
	export default {
		data() {
			return {
				isNew: false,
				form: {
					old_phone: API.getStorage('userInfo').mobile,
					phone: '',
					code: '',
				},
				rules: {
					phone: [{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
							trigger: ['change', 'blur'],
						}
					],
					code: [{
							required: true,
							message: '请输入验证码',
							trigger: ['change', 'blur'],
						},
						{
							type: 'number',
							message: '验证码只能为数字',
							trigger: ['change', 'blur'],
						}
					],
				},
				labelPosition: 'left',
				codeTips: '',
				border: false
			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		mounted() {
			_this = this;
		},
		methods: {
			codeChange(text) {
				this.codeTips = text;
			},
			// 获取验证码
			getCode() {

				if (this.$refs.uCode.canGetCode) {
					if (this.isNew) {
						this.setMobile('new', this.form.phone, '', 'get_code', function() {
							setTimeout(() => {
								uni.hideLoading();
								// 这里此提示会被this.start()方法中的提示覆盖
								uni.showToast({
									title:'验证码已发送'
								});
								// 通知验证码组件内部开始倒计时
								_this.$refs.uCode.start();
							}, 2000);
						})
					} else {
						this.setMobile('old', this.form.old_phone, '', 'get_code', function() {
							setTimeout(() => {
								uni.hideLoading();
								// 这里此提示会被this.start()方法中的提示覆盖
								uni.showToast({
									title:'验证码已发送'
								});
								// 通知验证码组件内部开始倒计时
								_this.$refs.uCode.start();
							}, 2000);
						})
					}

				} else {
					this.$u.toast('倒计时结束后再发送');
				}
			},
			setMobile(mobile_type, mobile, code, type, fun) {
				API.changeMobile({
					mobile_type: mobile_type,
					mobile: mobile,
					code: code,
					type: type
				}).then(res => {
					fun(res)
				})
			},
			submit(){
				if (this.isNew) {
					this.setMobile('new', this.form.phone, this.form.code, '', function(res) {
						uni.showToast({
							title:res.message
						})
						API.check_login({}).then(res => {
							API.setStorage('userInfo', res.data.user)
						})
						setTimeout(function(){
							uni.navigateBack({
								delta:0
							})
						},1500)
					})
				} else {
					this.setMobile('old', this.form.old_phone, this.form.code, '', function() {
						_this.isNew = true
						_this.form.code = ''
						// 通知验证码组件内部开始倒计时
						_this.$refs.uCode.reset();
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.changeMobile {
		padding: 30rpx;
	}
</style>
