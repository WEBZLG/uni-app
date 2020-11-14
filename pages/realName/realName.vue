<template>
	<view>
		<u-field v-model="name" label="姓名:" placeholder="请填写姓名" />
		<u-field v-model="idcard" label="身份证号:" placeholder="请填写身份证号" />
		<view class="wrap">
			<u-row gutter="16" justify="space-between">
				<u-col span="6">
					<u-upload :action="action" max-count="1" :auto-upload="false"/>
				</u-col>
				<u-col span="6">
					<u-upload :action="action" max-count="1" :auto-upload="false"/>
				</u-col>
			</u-row>
		</view>
	</view>
</template>

<script>
	import API from '../../common/api.js'
	export default {
		data() {
			return {
				name: '',
				idcard: '',
				action: '',
				fileList1: [{
					url: '',
				}],
				action2: '',
				fileList2: [{
					url: '',
				}]
			};
		},
		onLoad() {
			this.action = API.API_BASE_URL + '/api_upload'
		}
	}
</script>

<style lang="scss">

</style>
