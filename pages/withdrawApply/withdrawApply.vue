
<template>
	<view class="container">
		<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
			<u-form-item :leftIconStyle="{color: '#888', fontSize: '32rpx'}" label-width="200" label="提款金额" prop="money">
				<u-input :border="border" placeholder="提款金额(钻石)" v-model="model.money" type="text"></u-input>
			</u-form-item>
			<u-form-item :leftIconStyle="{color: '#888', fontSize: '32rpx'}" label-width="200" label="姓名" prop="name">
				<u-input :border="border" placeholder="请输入姓名" v-model="model.name" type="text"></u-input>
			</u-form-item>
			<u-form-item label="提款类型" prop="type" label-width="200">
				<u-input :border="border" type="select" :select-open="selectShow" v-model="model.type" placeholder="请选择提款类型" @click="selectShow = true"></u-input>
			</u-form-item>
			<u-form-item :leftIconStyle="{color: '#888', fontSize: '32rpx'}" label-width="200" label="提款账号" prop="count">
				<u-input :border="border" placeholder="请输入提款账号" v-model="model.count" type="text"></u-input>
			</u-form-item>
			<u-button @click="submit" type="warning" shape="circle">提交</u-button>
		</u-form>
		<u-select mode="single-column" :list="selectList" v-model="selectShow" @confirm="selectConfirm"></u-select>
	</view>
</template>

<script>
	import API from '../../common/api.js'
	export default {
		data() {
			return {
				selectShow: false,
				errorType: ['message'],
				border: false,
				model: {
					count: '',
					name: '',
					money: '',
					type: ''
				},
				selectList: [{
						value: '微信',
						label: '微信'
					},
					{
						value: '支付宝',
						label: '支付宝'
					},
					{
						value: '中国银行',
						label: '中国银行'
					},
					{
						value: '建设银行',
						label: '建设银行'
					},
					{
						value: '工商银行',
						label: '工商银行'
					},
					{
						value: '交通银行',
						label: '交通银行'
					},
					{
						value: '农业银行',
						label: '农业银行'
					},
					{
						value: '邮政银行',
						label: '邮政银行'
					},
				],
				rules: {
					name: {
						required: true,
						message: '请输入姓名',
						trigger: 'blur',
					},
					money: {
						type:'number',
						required: true,
						message: '请输入数字',
						trigger: 'blur',
					},
					type: {
						required: true,
						message: '请选择提款类型',
						trigger: 'blur',
					},
					count: {
						required: true,
						message: '请输入提款账号',
						trigger: 'blur',
					},
				}
			}
		},
		onLoad() {

		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('验证通过');
						API.withdrawApply({
							diamond_count:this.model.money,
							bank_user_name:this.model.name,
							bank_name:this.model.type,
							card_no:this.model.count
						}).then(res=>{
							console.log(res)
							uni.showToast({
								title:res.data.message
							})
							this.model.money=''
							this.model.name=''
							this.model.type=''
							this.model.count=''
						})
						
					} else {
						console.log('验证失败');
					}
				});
			},
			// 选择类型
			selectConfirm(e) {
				this.model.type = '';
				e.map((val, index) => {
					this.model.type += this.model.type == '' ? val.label : '-' + val.label;
				})
			},
			errorChange(index) {
				if (index == 0) this.errorType = ['message'];
				if (index == 1) this.errorType = ['toast'];
				if (index == 2) this.errorType = ['border-bottom'];
				if (index == 3) this.errorType = ['border'];
			}
		}
	}
</script>

<style lang="scss">
.container{
	padding: 30rpx;
}
</style>
