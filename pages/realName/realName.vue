<template>
	<view class="container">
		<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
			<u-form-item label-width="160" label="姓名:" prop="name">
				<u-input placeholder="请输入姓名" v-model="model.name" type="text"></u-input>
			</u-form-item>
			<u-form-item label="身份证号:" label-width="160" prop="idcard">
				<u-input type="text" v-model="model.idcard" placeholder="请填写身份证号"></u-input>
			</u-form-item>
			<u-form-item label="身份证正面:" prop="photof" label-width="160">
				<u-upload width="160" height="160" :action="action" ref="uUploadf" max-count="1" :auto-upload="false"></u-upload>
			</u-form-item>
			<u-form-item label="身份证反面:" prop="photob" label-width="160">
				<u-upload width="160" height="160" :action="action" ref="uUploadb" max-count="1" :auto-upload="false"></u-upload>
			</u-form-item>
			<u-button @click="submit" type="success" shape="circle">提交</u-button>
		</u-form>
	</view>
</template>

<script>
	import API from '../../common/api.js'
	export default {
		data() {
			return {
				model: {
					name: '',
					idcard: '',
				},
				action: '',
				errorType: ['message'],
				rules: {
					name: [{
							required: true,
							message: '请输入姓名',
							trigger: 'blur',
						},
						{
							min: 2,
							max: 10,
							message: '姓名长度在2到10个字符',
							trigger: ['change', 'blur'],
						},
						{
							// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
							validator: (rule, value, callback) => {
								// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
								return this.$u.test.chinese(value);
							},
							message: '姓名必须为中文',
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
							trigger: ['change', 'blur'],
						},
					],
					idcard: [{
							required: true,
							message: '请输入身份证号',
							trigger: ['change', 'blur'],
						},
						{
							// 正则不能含有两边的引号
							pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
							message: '请输入正确身份证号',
							trigger: ['change', 'blur'],
						}
					]
				}
			};
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad() {
			this.action = API.API_BASE_URL + '/api_upload'
		},
		methods: {
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('验证通过');
						let files = [];
						let filesf = this.$refs.uUploadf.lists;
						let filesb = this.$refs.uUploadb.lists;
						console.log(filesf,filesb)
					} else {
						console.log('验证失败');
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 30rpx;
	}
</style>
