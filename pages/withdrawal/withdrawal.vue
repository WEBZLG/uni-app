<template>
	<view>
		<u-cell-group>
			<navigator v-for="(item,index) in itemList" :url="item.url">
				<u-cell-item  :icon="item.icon" :title="item.title"></u-cell-item>
			</navigator>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				itemList:[
					{
						icon:'',
						title:'申请提现',
						url:'../withdrawApply/withdrawApply'
					},
					{
						icon:'',
						title:'提现记录',
						url:'../withdrawList/withdrawList'
					},
					{
						icon:'',
						title:'金额变动',
						url:'../amountChange/amountChange'
					}
				]
			};
		}
	}
</script>

<style lang="scss">

</style>
