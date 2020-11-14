<template>
	<view class="u-skeleton">
		<u-collapse>
			<u-collapse-item :title="item.change_time+(item.type)" v-for="(item, index) in dataList" :key="index">
				<view class="">类型：{{item.remark}}</view>
				<view class="">余额：{{item.balance}}</view>
				<view class="">变动：{{item.amount}}</view>
				<view class="">备注：{{item.remark}}</view>
			</u-collapse-item>
		</u-collapse>
		<u-empty v-if="dataList.length==0" text="暂无记录" mode="list" margin-top="300"></u-empty>
		<u-loadmore :status="status" :load-text="loadText"/>
		<!--骨架组件-->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	import API from '../../common/api.js'
	export default {
		data() {
			return {
				status: 'loadmore',
				page: 1,
				dataList: [],
				loading: true, // 是否显示骨架屏组件
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				}
			};
		},
		onLoad() {
			this.getData(1)
			// 通过延时模拟向后端请求数据，调隐藏骨架屏
			setTimeout(() => {
				this.loading = false;
			}, 2000)
		},
		methods: {
			onPullDownRefresh() {
				console.log('refresh');
				this.page = 1
				this.getData(1)
				setTimeout(function() {
					uni.stopPullDownRefresh();
				}, 1000);
			},
			onReachBottom() {
				this.getData(this.page)
			},
			getData(page) {
				API.moneyChange({
					page: page
				}).then(res => {
					console.log(res.data.logs)
					if (res.data.logs.length == 0&&this.page==1) {
						this.status = 'nomore'
						this.loadText.nomore = ''
					} else if (res.data.logs.length == 0&&this.page>1) {
						this.status = 'nomore'
						this.loadText.nomore = '实在没有了'
					}else{
						this.status = 'loading';
						this.loadText.nomore = '实在没有了'
						this.page = ++this.page;
						setTimeout(() => {
							for (var item in res.data.logs) {
								this.dataList.push(item)
							}
						}, 2000)
					}
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
